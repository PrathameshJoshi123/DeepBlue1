from flask import Blueprint, request, jsonify
from bson import ObjectId
from app.config.database import db
from app.models.delivery import DeliveryPartnerSchema
from werkzeug.utils import secure_filename
from app.utils.auth_utils import jwt_required
from app.utils.geolocation import get_coordinates
import os

delivery_bp = Blueprint("delivery", __name__)
UPLOAD_FOLDER = "D:\\My_Space\\DeepBlue\\backend\\app\\static\\uploads\\delivery"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the directory exists

# Helper function to serialize MongoDB documents
def serialize_delivery(delivery):
    delivery["_id"] = str(delivery["_id"])
    return delivery

# Register a new delivery partner
@delivery_bp.route("/register", methods=["POST"])
@jwt_required
def register_delivery():
    try:
        # Get form data
        data = request.form.to_dict()
        print(data)
        # Get user ID from JWT (assuming middleware sets request.user_id)
        user_id = request.user_id  
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401
        data["user_id"] = str(user_id)  

        # Get file
        file = request.files.get("id_proof")
        if not file:
            return jsonify({"error": "ID proof is required"}), 400

        # Secure filename and save file
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        data["id_proof"] = file_path  

        # Fetch Coordinates
        building_name = data.get("building_name", "")
        street_address = data.get("street_address", "")
        city = data.get("city", "")
        state = data.get("state", "")

        coordinates = get_coordinates(building_name, street_address, city, state)
        if not coordinates:
            return jsonify({"error": "Could not determine location coordinates"}), 400

        # Add GeoJSON location
        data["location"] = {"type": "Point", "coordinates": coordinates}

        # Convert `vehicle_types` to list
        vehicle_types_str = data.get("vehicle_types", "")
        data["vehicle_types"] = [v.strip() for v in vehicle_types_str.split(",") if v.strip()]

        # Validate delivery partner data
        delivery_partner = DeliveryPartnerSchema(**data)  
        delivery_dict = delivery_partner.model_dump()

        # Insert into MongoDB
        inserted_id = db.delivery_partners.insert_one(delivery_dict).inserted_id

        # Update user's role to 'delivery_partner'
        db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"role": "delivery_partner"}})

        return jsonify({
            "message": "Delivery Partner registered successfully",
            "user": {
                "user_id": str(user_id),  
                "role": "delivery_partner"
            },
        }), 201
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400


# Get a specific delivery partner by ID
@delivery_bp.route("/get/<string:delivery_id>", methods=["GET"])
def get_delivery(delivery_id):
    delivery_partner = db.delivery_partners.find_one({"_id": ObjectId(delivery_id)})
    if delivery_partner:
        return jsonify(serialize_delivery(delivery_partner)), 200
    return jsonify({"error": "Delivery Partner not found"}), 404

# Update delivery partner details
@delivery_bp.route("/update/<string:delivery_id>", methods=["POST"])
def update_delivery(delivery_id):
    try:
        data = request.json
        delivery_partner = DeliveryPartnerSchema(**data)  # Validate input
        update_result = db.delivery_partners.update_one({"_id": ObjectId(delivery_id)}, {"$set": delivery_partner.model_dump()})
        
        if update_result.modified_count > 0:
            return jsonify({"message": "Delivery Partner updated successfully"}), 200
        return jsonify({"message": "No changes made"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Delete delivery partner
@delivery_bp.route("/delete/<string:delivery_id>", methods=["DELETE"])
def delete_delivery(delivery_id):
    result = db.delivery_partners.delete

# Search delivery partners by name
@delivery_bp.route("/search", methods=["GET"])
def search_delivery_partners():
    try:
        name_query = request.args.get("name", "")
        if not name_query or len(name_query) < 2:
            return jsonify({"error": "Search query too short"}), 400
            
        # Search by person_name or company_name
        query = {
            "$or": [
                {"person_name": {"$regex": name_query, "$options": "i"}},
                {"company_name": {"$regex": name_query, "$options": "i"}}
            ]
        }
        
        # Find matching delivery partners
        delivery_partners = list(db.delivery_partners.find(query, {
            "person_name": 1, 
            "company_name": 1,
            "user_id": 1
        }).limit(10))
        
        # Format results
        results = []
        for partner in delivery_partners:
            results.append({
                "_id": str(partner["_id"]),
                "person_name": partner.get("person_name", ""),
                "company_name": partner.get("company_name", ""),
                "user_id": partner.get("user_id", "")
            })
            
        return jsonify({"results": results}), 200
        
    except Exception as e:
        print(f"Error searching delivery partners: {e}")
        return jsonify({"error": str(e)}), 500
