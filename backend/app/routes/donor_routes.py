from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from bson import ObjectId
from app.config.database import db
from app.models.donor import DonorSchema
from app.utils.auth_utils import jwt_required
from app.utils.geolocation import get_coordinates
import os

donor_bp = Blueprint("donor", __name__)
UPLOAD_FOLDER = "D:\\My_Space\\DeepBlue\\backend\\app\\static\\uploads\\donor"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the directory exists

# Helper function to serialize MongoDB documents
def serialize_donor(donor):
    donor["_id"] = str(donor["_id"])
    return donor

# Register a new donor with ID proof upload
@donor_bp.route("/register", methods=["POST"])
@jwt_required
def register_donor():
    try:
        # Get form data
        data = request.form.to_dict()

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
        street_name = data.get("street_name", "")
        city = data.get("city", "")
        state = data.get("state", "")

        coordinates = get_coordinates(building_name, street_name, city, state)
        if not coordinates:
            return jsonify({"error": "Could not determine location coordinates"}), 400

        # Add GeoJSON location
        data["location"] = {"type": "Point", "coordinates": coordinates}

        # Validate donor data
        donor = DonorSchema(**data)  
        donor_dict = donor.model_dump()

        # Insert into MongoDB
        inserted_id = db.donors.insert_one(donor_dict).inserted_id

        # Update user's role to 'donor'
        db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"role": "donor"}})

        return jsonify({
            "message": "Donor registered successfully",
            "user": {
                "user_id": str(user_id),  # Convert ObjectId to string
                "role": "donor"
            },
        }), 201

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400

# Get a specific donor by ID
@donor_bp.route("/get/<string:donor_id>", methods=["GET"])
def get_donor(donor_id):
    donor = db.donors.find_one({"_id": ObjectId(donor_id)})
    if donor:
        return jsonify(serialize_donor(donor)), 200
    return jsonify({"error": "Donor not found"}), 404

# Update donor details
@donor_bp.route("/update/<string:donor_id>", methods=["POST"])
def update_donor(donor_id):
    try:
        data = request.json
        donor = DonorSchema(**data)  # Validate input
        update_result = db.donors.update_one({"_id": ObjectId(donor_id)}, {"$set": donor.model_dump()})
        
        if update_result.modified_count > 0:
            return jsonify({"message": "Donor updated successfully"}), 200
        return jsonify({"message": "No changes made"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Delete donor
@donor_bp.route("/delete/<string:donor_id>", methods=["DELETE"])
def delete_donor(donor_id):
    result = db.donors.delete_one({"_id": ObjectId(donor_id)})
    if result.deleted_count:
        return jsonify({"message": "Donor deleted successfully"}), 200
    return jsonify({"error": "Donor not found"}), 404
