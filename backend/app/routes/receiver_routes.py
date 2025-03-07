from flask import Blueprint, request, jsonify
from flask_login import login_required
from bson import ObjectId
from app.config.database import db
from app.models.receiver import ReceiverSchema
from app.utils.geolocation import get_coordinates
from app.utils.auth_utils import jwt_required
import os
from werkzeug.utils import secure_filename
from datetime import datetime, time


receiver_bp = Blueprint("receiver", __name__)

UPLOAD_FOLDER = "D:\\My_Space\\DeepBlue\\backend\\app\\static\\uploads\\receiver"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure directory exists

# Register a new receiver
@receiver_bp.route("/register", methods=["POST"])
@jwt_required
def register_receiver():
    try:
        # Get form data
        data = request.form.to_dict()

        # Get user ID from JWT token
        user_id = request.user_id
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401
        data["user_id"] = str(user_id)

        # Handle ID proof upload
        file = request.files.get("id_proof")
        if not file:
            return jsonify({"error": "ID proof is required"}), 400

        # Secure filename and save locally
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        data["id_proof"] = file_path  # Store file path

        # Fetch Coordinates
        building_name = data.get("building_name", "")
        street_name = data.get("street_name", "")
        city = data.get("city", "")
        state = data.get("state", "")

        coordinates = get_coordinates(building_name, street_name, city, state)
        if not coordinates:
            return jsonify({"error": "Could not determine location coordinates"}), 400

        # Add GeoJSON location
        data["location"] = {"type": "Point", "coordinates": coordinates}


        from datetime import datetime

        if "preferred_delivery_time" in data:
            data["preferred_delivery_time"] = str(data["preferred_delivery_time"])



        # Validate and store receiver data
        receiver = ReceiverSchema(**data)
        receiver_dict = receiver.model_dump()

        # Insert into MongoDB
        inserted_id = db.receivers.insert_one(receiver_dict).inserted_id

        # Update user's role to 'receiver'
        db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"role": "receiver"}})

        return jsonify({
            "message": "Receiver registered successfully",
            "user": {
                "user_id": str(user_id),  # Convert ObjectId to string
                "role": "receiver"
            },
        }), 201
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400

# Get a specific receiver by ID
@receiver_bp.route("/get/<string:receiver_id>", methods=["GET"])
def get_receiver(receiver_id):
    receiver = db.receivers.find_one({"_id": ObjectId(receiver_id)})
    if receiver:
        return jsonify(serialize_receiver(receiver)), 200
    return jsonify({"error": "Receiver not found"}), 404

# Update receiver details
@receiver_bp.route("/update/<string:receiver_id>", methods=["POST"])
def update_receiver(receiver_id):
    try:
        data = request.json
        receiver = ReceiverSchema(**data)  # Validate input
        update_result = db.receivers.update_one({"_id": ObjectId(receiver_id)}, {"$set": receiver.model_dump()})
        
        if update_result.modified_count > 0:
            return jsonify({"message": "Receiver updated successfully"}), 200
        return jsonify({"message": "No changes made"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Delete receiver
@receiver_bp.route("/delete/<string:receiver_id>", methods=["DELETE"])
def delete_receiver(receiver_id):
    result = db.receivers.delete_one({"_id": ObjectId(receiver_id)})
    if result.deleted_count:
        return jsonify({"message": "Receiver deleted successfully"}), 200
    return jsonify({"error": "Receiver not found"}), 404

# Search receivers by name
@receiver_bp.route("/search", methods=["GET"])
def search_receivers():
    try:
        name_query = request.args.get("name", "")
        if not name_query or len(name_query) < 2:
            return jsonify({"error": "Search query too short"}), 400
            
        # Search by contact_person or ngo_name
        query = {
            "$or": [
                {"contact_person": {"$regex": name_query, "$options": "i"}},
                {"ngo_name": {"$regex": name_query, "$options": "i"}}
            ]
        }
        
        # Find matching receivers
        receivers = list(db.receivers.find(query, {
            "contact_person": 1, 
            "ngo_name": 1,
            "user_id": 1
        }).limit(10))
        
        # Format results
        results = []
        for receiver in receivers:
            results.append({
                "_id": str(receiver["_id"]),
                "contact_person": receiver.get("contact_person", ""),
                "ngo_name": receiver.get("ngo_name", ""),
                "user_id": receiver.get("user_id", "")
            })
            
        return jsonify({"results": results}), 200
        
    except Exception as e:
        print(f"Error searching receivers: {e}")
        return jsonify({"error": str(e)}), 500