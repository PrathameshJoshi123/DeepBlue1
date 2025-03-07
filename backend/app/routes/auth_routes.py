import jwt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required
from flask_bcrypt import Bcrypt
from app.config.database import db
from app.models.user import UserSchema
from werkzeug.security import check_password_hash
from app.utils.auth_utils import jwt_required 

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()

# Configure session duration (1 day)
auth_bp.permanent_session_lifetime = timedelta(days=1)

# Helper function to serialize MongoDB documents
def serialize_user(user):
    user["_id"] = str(user["_id"])
    return user

# User Signup (Register)
@auth_bp.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        user = UserSchema(**data)  # Validate input
        
        print(data)
        # Check if user already exists
        existing_user = db.users.find_one({"email": user.email})
        if existing_user:
            return jsonify({"error": "User already exists!"}), 400
        print(existing_user)

        # Hash the password
        hashed_password = bcrypt.generate_password_hash(user.password).decode("utf-8")
        
        # Insert new user into database with a generalized role
        user_dict = user.model_dump()
        user_dict["password"] = hashed_password
        user_dict["role"] = "general"  # Default role
        inserted_id = db.users.insert_one(user_dict).inserted_id

        
        return jsonify({"message": "User registered successfully", "id": str(inserted_id)}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400

# User Login with JWT Token
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        user = UserSchema(**data)

        # Check if user exists in the database
        existing_user = db.users.find_one({"email": user.email})
        if not existing_user:
            return jsonify({"error": "User not found!"}), 404

        print(existing_user)
        # Check password
        if bcrypt.check_password_hash(existing_user["password"], user.password):
            # Generate JWT token
            payload = {
                "user_id": str(existing_user["_id"]),  # User ID
                "role": existing_user.get("role", "general"),  # User role
                "exp": datetime.utcnow() + timedelta(hours=24)  # Expiration time (1 hour)
            }
            token = jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")
            user_name = None  # Default to None in case no record is found

            if existing_user["role"] == "donor":
                user_data = db.donors.find_one({"user_id": str(existing_user["_id"])})
            elif existing_user["role"] == "receiver":
                user_data = db.receivers.find_one({"user_id": str(existing_user["_id"])})
            elif existing_user["role"] == "delivery_partner":
                user_data = db.delivery_partners.find_one({"user_id": str(existing_user["_id"])})

            print(user_data)
            if user_data:  # Ensure record exists
                user_name = user_data.get("full_name", "Unknown")
            # Return the token to the client
            return jsonify({
                "message": "Login successful",
                "token": token,  # Send the token in the response
                "user": {
                    "user_id": str(existing_user["_id"]),  # Convert ObjectId to string
                    "role": existing_user["role"],
                    "name": user_name
                }
            }), 200

        else:
            return jsonify({"error": "Invalid password!"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# User Logout
@auth_bp.route("/logout", methods=["POST"])
@jwt_required
def logout():
    user = request.user_id
    print(user)
    if not user:
        return jsonify({"error": "No token provided"}), 401

    # Invalidate token on client-side (JWT is stateless, so nothing to do on the server)
    return jsonify({"message": "User logged out successfully"}), 200