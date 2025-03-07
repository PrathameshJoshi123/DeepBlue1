from flask import Blueprint, request, jsonify
from app.config.database import db
from app.utils.auth_utils import jwt_required
from bson import ObjectId
from datetime import datetime

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/get", methods=["GET"])
@jwt_required
def get_profile():
    try:
        # Get the user's ID from the JWT token
        user_id = request.user_id
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        # Get user from the users collection
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        role = user.get("role", "general")
        
        # Base profile data
        profile_data = {
            "user_id": str(user["_id"]),
            "email": user.get("email", ""),
            "role": role,
            "join_date": user.get("created_at", datetime.utcnow()).strftime("%Y-%m-%d")
        }
        
        # Get role-specific profile data
        if role == "donor":
            donor = db.donors.find_one({"user_id": str(user_id)})
            if donor:
                profile_data.update({
                    "name": donor.get("full_name", ""),
                    "restaurant_name": donor.get("restaurant_name", ""),
                    "phone": donor.get("contact_number", ""),
                    "address": f"{donor.get('building_name', '')}, {donor.get('street_name', '')}, {donor.get('city', '')}, {donor.get('state', '')}, {donor.get('zip_code', '')}",
                    "fssai_id": donor.get("fssai_id", ""),
                    "donation_frequency": donor.get("donation_frequency", "")
                })
        
        elif role == "receiver":
            receiver = db.receivers.find_one({"user_id": str(user_id)})
            if receiver:
                profile_data.update({
                    "name": receiver.get("contact_person", ""),
                    "ngo_name": receiver.get("ngo_name", ""),
                    "phone": receiver.get("contact_number", ""),
                    "address": f"{receiver.get('building_name', '')}, {receiver.get('street_name', '')}, {receiver.get('city', '')}, {receiver.get('state', '')}, {receiver.get('zip_code', '')}",
                    "registration_number": receiver.get("registration_number", ""),
                    "ngo_gov_no": receiver.get("ngo_gov_no", ""),
                    "date_of_establishment": receiver.get("date_of_establishment", ""),
                    "website": receiver.get("website", "")
                })
        
        elif role == "delivery_partner":
            delivery_partner = db.delivery_partners.find_one({"user_id": str(user_id)})
            if delivery_partner:
                profile_data.update({
                    "name": delivery_partner.get("person_name", ""),
                    "company_name": delivery_partner.get("company_name", ""),
                    "phone": delivery_partner.get("number", ""),
                    "address": f"{delivery_partner.get('building_name', '')}, {delivery_partner.get('street_address', '')}, {delivery_partner.get('city', '')}, {delivery_partner.get('state', '')}, {delivery_partner.get('postal_code', '')}",
                    "registration_number": delivery_partner.get("registration_number", ""),
                    "vehicle_types": delivery_partner.get("vehicle_types", []),
                    "fleet_size": delivery_partner.get("fleet_size", 0),
                    "website": delivery_partner.get("website", "")
                })
        
        # Get transaction stats
        transaction_stats = {
            "total_transactions": 0,
            "completed_transactions": 0,
            "pending_transactions": 0
        }
        
        # Query based on role
        if role == "donor":
            transaction_stats["total_transactions"] = db.donations.count_documents({"donor_id": str(user_id)})
            transaction_stats["completed_transactions"] = db.donations.count_documents({"donor_id": str(user_id), "status": "Delivered"})
            transaction_stats["pending_transactions"] = db.donations.count_documents({"donor_id": str(user_id), "status": {"$in": ["Pending", "Accepted", "Picked Up"]}})
        
        elif role == "receiver":
            transaction_stats["total_transactions"] = db.donations.count_documents({"receiver_id": str(user_id)})
            transaction_stats["completed_transactions"] = db.donations.count_documents({"receiver_id": str(user_id), "status": "Delivered"})
            transaction_stats["pending_transactions"] = db.donations.count_documents({"receiver_id": str(user_id), "status": {"$in": ["Accepted", "Picked Up"]}})
        
        elif role == "delivery_partner":
            transaction_stats["total_transactions"] = db.donations.count_documents({"delivery_partner_id": str(user_id)})
            transaction_stats["completed_transactions"] = db.donations.count_documents({"delivery_partner_id": str(user_id), "status": "Delivered"})
            transaction_stats["pending_transactions"] = db.donations.count_documents({"delivery_partner_id": str(user_id), "status": {"$in": ["Accepted", "Picked Up"]}})
        
        profile_data["stats"] = transaction_stats
        
        return jsonify({"profile": profile_data}), 200
        
    except Exception as e:
        print(f"Error fetching profile: {e}")
        return jsonify({"error": str(e)}), 500 