from flask import Blueprint, request, jsonify
from app.utils.auth_utils import jwt_required
from bson import ObjectId
import os
from werkzeug.utils import secure_filename
from datetime import datetime
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
        # Get the receiver's user ID from JWT token
        user_id = request.user_id
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401
        
        # Fetch receiver's location
        receiver = db.receivers.find_one({"user_id": str(user_id)}, {"location": 1})
        if not receiver or "location" not in receiver:
            return jsonify({"error": "Receiver profile incomplete or location missing."}), 400

        receiver_coords = receiver["location"]["coordinates"]

        # Fetch pending donations
        donations = list(db.donations.find({"status": "Pending"}))  # Convert cursor to list
        print(donations)  # This will now print the actual donation data

        nearby_donations = []

        for donation in donations:
            if "location" in donation and "coordinates" in donation["location"]:
                donation_coords = donation["location"]["coordinates"]
                distance_km = geodesic((receiver_coords[1], receiver_coords[0]), (donation_coords[1], donation_coords[0])).km  # Fixed coordinate order

                if distance_km <= 5:  # Only include donations within 5KM
                    donation["_id"] = str(donation["_id"])  # Convert ObjectId to string
                    if "expiry_date" in donation:
                        donation["expiry_date"] = str(donation["expiry_date"])                         
                    nearby_donations.append(donation)

        return jsonify({"donations": nearby_donations}), 200


    except Exception as e:
        print(f"Error fetching nearby donations: {e}")
        return jsonify({"error": str(e)}), 400


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

        # Fetch delivery partner's location
        partner = db.delivery_partners.find_one({"user_id": str(user_id)}, {"location": 1})
        if not partner or "location" not in partner:
            return jsonify({"error": "Delivery partner profile incomplete or location missing."}), 400

        partner_coords = partner["location"]["coordinates"]

        # Fetch donations with status "Ready for Delivery"
        donations = list(db.donations.find({"status": "Ready for Delivery"}))
        nearby_donations = []

        for donation in donations:
            if "location" in donation and "coordinates" in donation["location"]:
                donation_coords = donation["location"]["coordinates"]
                distance_km = geodesic((partner_coords[1], partner_coords[0]), (donation_coords[1], donation_coords[0])).km  

                if distance_km <= 10:  # Only include donations within 10KM
                    donation["_id"] = str(donation["_id"])  # Convert ObjectId to string
                    donor_record = db.donors.find_one({"user_id": donation["donor_id"]}, {"street_name": 1, "building_name": 1, "city": 1})
                    print(donor_record)
                    donation["sender_address"] = format_address(donor_record)

                    # Fetch receiver details and construct receiver address
                    receiver_record = db.receivers.find_one({"_id": ObjectId(donation["receiver_id"])}, {"street_name": 1, "building_name": 1, "city": 1})
                    donation["receiver_address"] = format_address(receiver_record)
                    nearby_donations.append(donation)
                    

        return jsonify({"donations": nearby_donations}), 200

    except Exception as e:
        print(f"Error fetching deliveries: {e}")
        return jsonify({"error": str(e)}), 400


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
        db.donations.update_one(
            {"_id": ObjectId(donation_id)},
            {"$set": {"status": "Accepted", "delivery_partner_id": str(delivery_partner["_id"])}}
        )

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

        # Check if the user is a donor, receiver, or delivery partner
        donor = db.donors.find_one({"user_id": str(user_id)})
        receiver = db.receivers.find_one({"user_id": str(user_id)})
        delivery_partner = db.delivery_partners.find_one({"user_id": str(user_id)})

        if not (donor or receiver or delivery_partner):
            return jsonify({"error": "Only registered users can view accepted donations"}), 403

        # Define the query based on user role
        query = {}
        if donor:
            query["donor_id"] = str(donor["_id"])  # Fetch donations made by this donor
        elif receiver:
            query["receiver_id"] = str(receiver["_id"])  # Fetch donations accepted by this receiver
        elif delivery_partner:
            query["delivery_partner_id"] = str(delivery_partner["_id"])  # Fetch donations assigned to this delivery partner

        # Ensure we fetch only donations with status "Accepted"
        query["status"] = "Accepted"

        # Fetch matching donations
        accepted_donations = list(db.donations.find(query))

        # Process each donation to include sender/receiver/delivery info and image URLs
        for donation in accepted_donations:
            donation["_id"] = str(donation["_id"])  # Convert ObjectId to string

            if "expiry_date" in donation:
                        donation["expiry_date"] = str(donation["expiry_date"]) 

            # Fetch donor details for sender address
            donor_info = db.donors.find_one({"user_id": donation["donor_id"]})
            donation["sender_address"] = (
                f'{donor_info.get("building_name", "")}, {donor_info.get("street_address", "")}, {donor_info.get("city", "")}, {donor_info.get("state", "")}, {donor_info.get("country", "")}'
                if donor_info else "Unknown Address"
            )

            # Fetch receiver details
            receiver_info = db.receivers.find_one({"_id": ObjectId(donation["receiver_id"])})
            donation["receiver_name"] = receiver_info.get("name", "Unknown") if receiver_info else "Unknown"

            # Fetch delivery partner details
            delivery_info = db.delivery_partners.find_one({"_id": ObjectId(donation.get("delivery_partner_id", ""))})
            donation["delivery_partner_name"] = delivery_info.get("name", "Not Assigned") if delivery_info else "Not Assigned"

            # Convert image paths to full URLs
            import os

            donation["image_urls"] = [
                f"http://127.0.0.1:5000/static/uploads/donations/{os.path.basename(img_path)}"
                for img_path in donation.get("image_urls", [])
            ]


        return jsonify({"accepted_donations": accepted_donations}), 200

    except Exception as e:
        print(f"Error fetching accepted donations: {e}")
        return jsonify({"error": str(e)}), 400
