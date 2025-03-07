from flask import Blueprint, request, jsonify
from app.utils.auth_utils import jwt_required
from bson import ObjectId
import os
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from app.models.donations_model import DonationSchema
from app.config.database import db
from app.utils.notifications import notify_receivers
from geopy.distance import geodesic

donation_bp = Blueprint("donation", __name__)

UPLOAD_FOLDER = "D:\\My_Space\\DeepBlue\\backend\\app\\static\\uploads\\donations"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the folder exists

@donation_bp.route("/register", methods=["POST"])
@jwt_required
def register_donation():
    try:
        # Extract user ID from JWT
        user_id = request.user_id
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        # Check if user is a donor
        user = db.users.find_one({"_id": ObjectId(user_id)}, {"role": 1})
        if not user or user.get("role") != "donor":
            return jsonify({"error": "Access denied. Only donors can register donations."}), 403

        # Fetch donor details for location
        donor = db.donors.find_one({"user_id": str(user_id)}, {"location": 1})
        if not donor or "location" not in donor:
            return jsonify({"error": "Donor profile incomplete or location missing."}), 400

        # Extract form data
        data = request.form.to_dict()
        data["donor_id"] = str(user_id)  # Store as string for MongoDB
        data["location"] = donor["location"]  # Assign donor's geolocation

        if "perishable_ingredients" in data:
            data["perishable_ingredients"] = [
                item.strip() for item in data["perishable_ingredients"].split(",") if item.strip()
            ]

        try:
            data["quantity"] = float(data.get("quantity", 0))  # Default to 0 if missing
            data["quality_score"] = float(data.get("quality_score", 0))
        except ValueError:
            return jsonify({"error": "Invalid quantity or quality score. Must be a number."}), 400
            
        # Handle image uploads
        image_urls = []
        if "images" in request.files:
            files = request.files.getlist("images")  # Multiple images
            for file in files:
                filename = secure_filename(file.filename)
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(file_path)
                image_urls.append(file_path)  # Save image URLs
        data["image_urls"] = image_urls

        # Convert expiry_date to datetime
        if "expiry_date" in data:
            data["expiry_date"] = datetime.strptime(data["expiry_date"], "%Y-%m-%d")

        # Validate and serialize data
        donation = DonationSchema(**data)
        donation_dict = donation.model_dump()

        # Store donation in MongoDB
        inserted_id = db.donations.insert_one(donation_dict).inserted_id

        notify_receivers(donor["location"], str(inserted_id))

        return jsonify({
            "message": "Donation registered successfully",
            "donation_id": str(inserted_id)
        }), 201

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400

@donation_bp.route("/nearby", methods=["GET"])
@jwt_required
def get_nearby_donations():
    try:
        # Get the user's ID from JWT token
        user_id = request.user_id
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        # Fetch pending donations
        donations = list(db.donations.find({"status": "Pending"}))  # Convert cursor to list
        print(donations)  # This will now print the actual donation data

        nearby_donations = []

        for donation in donations:
            # For testing, include all donations regardless of distance
            donation_copy = donation.copy()
            donation_copy["_id"] = str(donation_copy["_id"])  # Convert ObjectId to string
            
            if "expiry_date" in donation_copy:
                donation_copy["expiry_date"] = str(donation_copy["expiry_date"])
            
            # Format image URLs
            if "image_urls" in donation_copy and donation_copy["image_urls"]:
                # Use the first image as the main image
                image_url = donation_copy["image_urls"][0]
                # Check if it's a local path or already a URL
                if not image_url.startswith("http"):
                    # Convert local path to URL
                    filename = os.path.basename(image_url)
                    image_url = f"http://localhost:5000/static/uploads/donations/{filename}"
                donation_copy["image_url"] = image_url
            
            nearby_donations.append(donation_copy)

        return jsonify({"nearby_donations": nearby_donations}), 200

    except Exception as e:
        print(f"Error fetching nearby donations: {e}")
        return jsonify({"error": str(e)}), 500


@donation_bp.route("/accept/<donation_id>", methods=["POST"])
@jwt_required
def accept_donation(donation_id):
    try:
        # Get the receiver's user ID from the JWT token
        user_id = request.user_id
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        # Check if the user is a receiver
        receiver = db.receivers.find_one({"user_id": str(user_id)})
        if not receiver:
            return jsonify({"error": "Only registered receivers can accept donations"}), 403

        # Fetch the donation
        donation = db.donations.find_one({"_id": ObjectId(donation_id), "status": "Pending"})
        if not donation:
            return jsonify({"error": "Donation not found or already accepted"}), 404

        # Update the donation's status to "Ready for Delivery" and assign the receiver ID
        db.donations.update_one(
            {"_id": ObjectId(donation_id)},
            {"$set": {"status": "Ready for Delivery", "receiver_id": str(receiver["_id"])}}
        )

        return jsonify({"message": "Donation accepted successfully and is now ready for delivery"}), 200

    except Exception as e:
        print(f"Error accepting donation: {e}")
        return jsonify({"error": str(e)}), 400


@donation_bp.route("/ready_for_delivery", methods=["GET"])
@jwt_required
def get_ready_for_delivery():
    try:
        # Get the delivery partner's user ID from JWT token
        user_id = request.user_id
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        # Check if we're in test mode
        test_mode = request.args.get("test_mode", "false").lower() == "true"
        
        # Only fetch partner location if not in test mode
        partner_coords = None
        if not test_mode:
        # Fetch delivery partner's location
            partner = db.delivery_partners.find_one({"user_id": str(user_id)}, {"location": 1})
        if not partner or "location" not in partner:
            return jsonify({"error": "Delivery partner profile incomplete or location missing."}), 400
        partner_coords = partner["location"]["coordinates"]

        # Fetch donations with status "Ready for Delivery" or "Accepted" for testing
        status = "Ready for Delivery"
        if test_mode:
            # For testing, also include Accepted donations
            status = request.args.get("status", "Ready for Delivery")
            
        donations = list(db.donations.find({"status": status}))
        nearby_donations = []

        for donation in donations:
            # Process each donation
            donation_copy = donation.copy()
            donation_copy["_id"] = str(donation_copy["_id"])  # Convert ObjectId to string
            
            if "expiry_date" in donation_copy:
                donation_copy["expiry_date"] = str(donation_copy["expiry_date"])
            
            # In test mode, include all donations regardless of distance
            include_donation = test_mode
            
            # If not in test mode, check distance
            if not test_mode and "location" in donation and "coordinates" in donation["location"]:
                donation_coords = donation["location"]["coordinates"]
                distance_km = geodesic((partner_coords[1], partner_coords[0]), (donation_coords[1], donation_coords[0])).km  
                include_donation = distance_km <= 10  # Only include donations within 10KM
            
            if include_donation:
                # Add donor address
                if "donor_id" in donation_copy:
                    donor_record = db.donors.find_one({"user_id": donation_copy["donor_id"]})
                    if donor_record:
                        donation_copy["donor_name"] = donor_record.get("restaurant_name") or donor_record.get("full_name", "Unknown Donor")
                        donation_copy["donor_address"] = format_address(donor_record)
                        donation_copy["donor_contact"] = donor_record.get("contact_number", "N/A")
                        donation_copy["pickup_location"] = donor_record.get("location", {})

                # Add receiver address
                if "receiver_id" in donation_copy:
                    receiver_record = db.receivers.find_one({"user_id": donation_copy["receiver_id"]})
                    if receiver_record:
                        donation_copy["receiver_name"] = receiver_record.get("ngo_name", "Unknown Receiver")
                        donation_copy["receiver_address"] = format_address(receiver_record)
                        donation_copy["receiver_contact"] = receiver_record.get("contact_number", "N/A")
                        donation_copy["delivery_location"] = receiver_record.get("location", {})
                
                # Format image URLs
                if "image_urls" in donation_copy and donation_copy["image_urls"]:
                    # Use the first image as the main image
                    image_url = donation_copy["image_urls"][0]
                    # Check if it's a local path or already a URL
                    if not image_url.startswith("http"):
                        # Convert local path to URL
                        filename = os.path.basename(image_url)
                        image_url = f"http://localhost:5000/static/uploads/donations/{filename}"
                    donation_copy["image_url"] = image_url
                
                nearby_donations.append(donation_copy)

        return jsonify({"donations": nearby_donations}), 200

    except Exception as e:
        print(f"Error fetching deliveries: {e}")
        return jsonify({"error": str(e)}), 500


def format_address(record):
    """Helper function to format the address"""
    if not record:
        return "Unknown"

    street = record.get("street_name", "")
    building = record.get("building_name", "")
    city = record.get("city", "")
    
    # Construct full address string
    address_parts = [part for part in [building, street, city] if part]  # Remove empty values
    return ", ".join(address_parts) if address_parts else "Unknown"


@donation_bp.route("/delivery/accept/<donation_id>", methods=["POST"])
@jwt_required
def accept_delivery(donation_id):
    try:
        # Get the delivery partner's user ID from the JWT token
        user_id = request.user_id
        
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        # Check if the user is a delivery partner
        delivery_partner = db.delivery_partners.find_one({"user_id": str(user_id)})
        if not delivery_partner:
            return jsonify({"error": "Only registered delivery partners can accept deliveries"}), 403

        # Fetch the donation
        donation = db.donations.find_one({"_id": ObjectId(donation_id), "status": "Ready for Delivery"})
        if not donation:
            return jsonify({"error": "Donation not found or already assigned"}), 404

        # Update the donation's status to "Accepted" and assign the delivery partner ID
        # Use the user_id as the delivery_partner_id for consistency
        db.donations.update_one(
            {"_id": ObjectId(donation_id)},
            {"$set": {
                "status": "Accepted", 
                "delivery_partner_id": str(user_id),
                "updated_at": datetime.utcnow()
            }}
        )
        
        print(f"Delivery accepted: Donation ID {donation_id} assigned to delivery partner {user_id}")

        return jsonify({"message": "Delivery accepted successfully"}), 200

    except Exception as e:
        print(f"Error accepting delivery: {e}")
        return jsonify({"error": str(e)}), 400



@donation_bp.route("/accepted", methods=["GET"])
@jwt_required
def get_accepted_donations():
    try:
        # Get the user's ID from the JWT token
        user_id = request.user_id
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        # Get user role from the users collection
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        role = user.get("role", "general")
        
        # Check if we're in test mode
        test_mode = request.args.get("test_mode", "false").lower() == "true"
        
        # Define the query based on user role or test mode
        query = {}
        if not test_mode:
            if role == "donor":
                query["donor_id"] = str(user_id)  # Fetch donations made by this donor
            elif role == "receiver":
                query["receiver_id"] = str(user_id)  # Fetch donations accepted by this receiver
            elif role == "delivery_partner":
                query["delivery_partner_id"] = str(user_id)  # Fetch donations assigned to this delivery partner
            else:
                return jsonify({"error": "Invalid role for viewing accepted donations"}), 403

        # Get status filter from query parameters (default to "Accepted")
        status = request.args.get("status", "Accepted")
        query["status"] = status
        
        # Pagination parameters
        limit = int(request.args.get("limit", 10))
        skip = int(request.args.get("skip", 0))

        # Fetch matching donations with pagination
        donations_cursor = db.donations.find(query).sort("created_at", -1).skip(skip).limit(limit)
        donations = list(donations_cursor)
        
        # Get total count for pagination
        total_count = db.donations.count_documents(query)
        
        # Print debug info
        print(f"Query: {query}, Found: {total_count} donations")
        print(f"User ID: {user_id}, Role: {role}")
        
        # Process each donation to include only necessary fields based on role
        formatted_donations = []
        for donation in donations:
            # Base fields needed for all roles
            formatted_donation = {
                "id": str(donation["_id"]),
                "food_type": donation.get("food_type", "Unknown"),
                "quantity": donation.get("quantity", 0),
                "unit": donation.get("unit", "kg"),
                "status": donation.get("status", "Unknown"),
                "created_at": donation.get("created_at", datetime.utcnow()).strftime("%Y-%m-%d %H:%M:%S"),
                "updated_at": donation.get("updated_at", datetime.utcnow()).strftime("%Y-%m-%d %H:%M:%S"),
            }
            
            # Add expiry date if available
            if "expiry_date" in donation:
                formatted_donation["expiry_date"] = donation["expiry_date"].strftime("%Y-%m-%d")
            
            # Add role-specific fields
            if role == "donor":
                # Donor needs receiver and delivery partner info
                if "receiver_id" in donation:
                    receiver = db.receivers.find_one({"user_id": donation["receiver_id"]})
                    if receiver:
                        formatted_donation["receiver_name"] = receiver.get("ngo_name", "Unknown Receiver")
                        formatted_donation["receiver_address"] = (
                            f'{receiver.get("building_name", "")}, {receiver.get("street_name", "")}, '
                            f'{receiver.get("city", "")}, {receiver.get("state", "")}'
                        )
                        formatted_donation["receiver_contact"] = receiver.get("contact_number", "N/A")
                
                if "delivery_partner_id" in donation and donation["delivery_partner_id"]:
                    delivery_partner = db.delivery_partners.find_one({"user_id": donation["delivery_partner_id"]})
                    if delivery_partner:
                        formatted_donation["delivery_partner_name"] = delivery_partner.get("person_name", "Unknown")
                        formatted_donation["delivery_partner_contact"] = delivery_partner.get("number", "N/A")
            
            elif role == "receiver":
                # Receiver needs donor info
                if "donor_id" in donation:
                    donor = db.donors.find_one({"user_id": donation["donor_id"]})
                    if donor:
                        formatted_donation["donor_name"] = donor.get("restaurant_name") or donor.get("full_name", "Unknown Donor")
                        formatted_donation["donor_address"] = (
                            f'{donor.get("building_name", "")}, {donor.get("street_name", "")}, '
                            f'{donor.get("city", "")}, {donor.get("state", "")}'
                        )
                        formatted_donation["donor_contact"] = donor.get("contact_number", "N/A")
                
                if "delivery_partner_id" in donation and donation["delivery_partner_id"]:
                    delivery_partner = db.delivery_partners.find_one({"user_id": donation["delivery_partner_id"]})
                    if delivery_partner:
                        formatted_donation["delivery_partner_name"] = delivery_partner.get("person_name", "Unknown")
                        formatted_donation["delivery_partner_contact"] = delivery_partner.get("number", "N/A")
            
            elif role == "delivery_partner":
                # Delivery partner needs both donor and receiver info
                if "donor_id" in donation:
                    donor = db.donors.find_one({"user_id": donation["donor_id"]})
                    if donor:
                        formatted_donation["donor_name"] = donor.get("restaurant_name") or donor.get("full_name", "Unknown Donor")
                        formatted_donation["donor_address"] = (
                            f'{donor.get("building_name", "")}, {donor.get("street_name", "")}, '
                            f'{donor.get("city", "")}, {donor.get("state", "")}'
                        )
                        formatted_donation["donor_contact"] = donor.get("contact_number", "N/A")
                        formatted_donation["pickup_location"] = donor.get("location", {})
                
                if "receiver_id" in donation:
                    receiver = db.receivers.find_one({"user_id": donation["receiver_id"]})
                    if receiver:
                        formatted_donation["receiver_name"] = receiver.get("ngo_name", "Unknown Receiver")
                        formatted_donation["receiver_address"] = (
                            f'{receiver.get("building_name", "")}, {receiver.get("street_name", "")}, '
                            f'{receiver.get("city", "")}, {receiver.get("state", "")}'
                        )
                        formatted_donation["receiver_contact"] = receiver.get("contact_number", "N/A")
                        formatted_donation["delivery_location"] = receiver.get("location", {})
            
            # Add image URLs if available (limited to first image only for efficiency)
            if "image_urls" in donation and donation["image_urls"]:
                image_url = donation["image_urls"][0]
                # Check if it's a local path or already a URL
                if not image_url.startswith("http"):
                    # Convert local path to URL
                    filename = os.path.basename(image_url)
                    image_url = f"http://localhost:5000/static/uploads/donations/{filename}"
                formatted_donation["image_url"] = image_url
            
            formatted_donations.append(formatted_donation)

        return jsonify({
            "accepted_donations": formatted_donations,
            "total": total_count,
            "skip": skip,
            "limit": limit
        }), 200

    except Exception as e:
        print(f"Error fetching accepted donations: {e}")
        return jsonify({"error": str(e)}), 500

@donation_bp.route("/transactions", methods=["GET"])
@jwt_required
def get_transactions():
    """
    Get donation transactions for the authenticated user based on their role
    - Donors see donations they've made
    - Receivers see donations they've received
    - Delivery partners see donations they've delivered
    """
    try:
        # Extract user ID from JWT
        user_id = request.user_id
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        # Get user role
        user = db.users.find_one({"_id": ObjectId(user_id)}, {"role": 1})
        if not user:
            return jsonify({"error": "User not found"}), 404

        role = user.get("role", "general")
        
        # Query based on role
        if role == "donor":
            # Donors see donations they've made
            query = {"donor_id": str(user_id)}
        elif role == "receiver":
            # Receivers see donations they've received
            query = {"receiver_id": str(user_id)}
        elif role == "delivery_partner":
            # Delivery partners see donations they've delivered
            query = {"delivery_partner_id": str(user_id)}
        else:
            return jsonify({"error": "Invalid role for transactions"}), 403
        
        # Get optional query parameters
        status = request.args.get("status")
        limit = int(request.args.get("limit", 50))  # Default to 50 items
        skip = int(request.args.get("skip", 0))  # Default to starting from the beginning
        
        # Add status filter if provided
        if status:
            query["status"] = status
            
        # Get transactions from database with pagination
        transactions = list(db.donations.find(query).sort("created_at", -1).skip(skip).limit(limit))
        
        # Format transactions for response
        formatted_transactions = []
        for tx in transactions:
            # Convert ObjectId to string for JSON serialization
            tx["_id"] = str(tx["_id"])
            
            # Add additional information based on role
            if role == "donor" and tx.get("receiver_id"):
                # Add receiver info for donors
                receiver = db.receivers.find_one({"user_id": tx["receiver_id"]}, {"ngo_name": 1})
                if receiver:
                    tx["receiver_name"] = receiver.get("ngo_name", "Unknown Receiver")
            
            elif role == "receiver" and tx.get("donor_id"):
                # Add donor info for receivers
                donor = db.donors.find_one({"user_id": tx["donor_id"]}, {"full_name": 1, "restaurant_name": 1})
                if donor:
                    tx["donor_name"] = donor.get("restaurant_name") or donor.get("full_name", "Unknown Donor")
            
            # Format dates for better readability
            if "created_at" in tx:
                tx["created_at"] = tx["created_at"].strftime("%Y-%m-%d %H:%M:%S")
            if "updated_at" in tx:
                tx["updated_at"] = tx["updated_at"].strftime("%Y-%m-%d %H:%M:%S")
            if "expiry_date" in tx:
                tx["expiry_date"] = tx["expiry_date"].strftime("%Y-%m-%d")
                
            formatted_transactions.append(tx)
        
        # Get total count for pagination
        total_count = db.donations.count_documents(query)
        
        return jsonify({
            "transactions": formatted_transactions,
            "total": total_count,
            "skip": skip,
            "limit": limit
        }), 200
        
    except Exception as e:
        print(f"Error in get_transactions: {str(e)}")
        return jsonify({"error": str(e)}), 500

@donation_bp.route("/create_test_donation", methods=["GET"])
def create_test_donation():
    """Create a test donation for development purposes"""
    try:
        # Create a sample donation
        test_donation = {
            "donor_id": "67af4380c36fccf24fd735f9",  # Use an existing donor ID
            "food_type": "Test Food",
            "quantity": 5.0,
            "unit": "kg",
            "expiry_date": datetime.utcnow() + timedelta(days=7),
            "perishable_ingredients": ["test"],
            "quality_status": "Good",
            "quality_score": 0.9,
            "image_urls": ["http://localhost:5000/static/uploads/donations/test-food.jpg"],
            "location": {
                "type": "Point",
                "coordinates": [72.8777, 19.0760]  # Mumbai coordinates
            },
            "status": "Pending",  # Start as pending
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert into database
        result = db.donations.insert_one(test_donation)
        
        # Return the created donation
        return jsonify({
            "message": "Test donation created successfully",
            "donation_id": str(result.inserted_id)
        }), 200
        
    except Exception as e:
        print(f"Error creating test donation: {e}")
        return jsonify({"error": str(e)}), 500

@donation_bp.route("/create_test_accepted_donation", methods=["GET"])
def create_test_accepted_donation():
    """Create a test accepted donation for development purposes"""
    try:
        # Create a sample accepted donation
        test_donation = {
            "donor_id": "67af4380c36fccf24fd735f9",  # Use an existing donor ID
            "receiver_id": "67bc68c8b5e3b76a4eef52a3",  # Use an existing receiver ID
            "food_type": "Test Accepted Food",
            "quantity": 3.0,
            "unit": "kg",
            "expiry_date": datetime.utcnow() + timedelta(days=5),
            "perishable_ingredients": ["test"],
            "quality_status": "Good",
            "quality_score": 0.9,
            "image_urls": ["http://localhost:5000/static/uploads/donations/test-accepted-food.jpg"],
            "location": {
                "type": "Point",
                "coordinates": [72.8777, 19.0760]  # Mumbai coordinates
            },
            "status": "Accepted",  # Already accepted
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert into database
        result = db.donations.insert_one(test_donation)
        
        # Return the created donation
        return jsonify({
            "message": "Test accepted donation created successfully",
            "donation_id": str(result.inserted_id)
        }), 200
        
    except Exception as e:
        print(f"Error creating test accepted donation: {e}")
        return jsonify({"error": str(e)}), 500

@donation_bp.route("/create_test_delivery_donation", methods=["GET"])
def create_test_delivery_donation():
    """Create a test donation with 'Ready for Delivery' status for development purposes"""
    try:
        # Create a sample donation ready for delivery
        test_donation = {
            "donor_id": "67af4380c36fccf24fd735f9",  # Use an existing donor ID
            "receiver_id": "67bc68c8b5e3b76a4eef52a3",  # Use an existing receiver ID
            "food_type": "Test Delivery Food",
            "quantity": 4.0,
            "unit": "kg",
            "expiry_date": datetime.utcnow() + timedelta(days=3),
            "perishable_ingredients": ["test"],
            "quality_status": "Good",
            "quality_score": 0.9,
            "image_urls": ["http://localhost:5000/static/uploads/donations/test-delivery-food.jpg"],
            "location": {
                "type": "Point",
                "coordinates": [72.8777, 19.0760]  # Mumbai coordinates
            },
            "status": "Ready for Delivery",  # Ready for delivery
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert into database
        result = db.donations.insert_one(test_donation)
        donation_id = str(result.inserted_id)
        
        # Add donor and receiver information for better testing
        donor = db.donors.find_one({"user_id": test_donation["donor_id"]})
        if donor:
            print(f"Found donor: {donor.get('full_name')}")
        else:
            print(f"Donor not found with ID: {test_donation['donor_id']}")
            
        receiver = db.receivers.find_one({"user_id": test_donation["receiver_id"]})
        if receiver:
            print(f"Found receiver: {receiver.get('ngo_name')}")
        else:
            print(f"Receiver not found with ID: {test_donation['receiver_id']}")
        
        # Return the created donation
        return jsonify({
            "message": "Test delivery-ready donation created successfully",
            "donation_id": donation_id
        }), 200
        
    except Exception as e:
        print(f"Error creating test delivery donation: {e}")
        return jsonify({"error": str(e)}), 500
