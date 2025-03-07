import jwt
from functools import wraps
from flask import request, jsonify, current_app

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get("Authorization")
        print(f"Authorization header: {token}")

        if not token:
            return jsonify({"error": "Token is missing"}), 401
        
        try:
            if token.startswith("Bearer "):
                token = token.split("Bearer ")[1]  # Remove "Bearer " prefix
            print(f"Token after processing: {token}")
            
            decoded_token = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            print(f"Decoded token: {decoded_token}")
            
            # Extract user_id and role from token
            request.user_id = decoded_token.get("user_id")
            request.role = decoded_token.get("role", "unknown")
            
            # If user_id is missing, return error
            if not request.user_id:
                return jsonify({"error": "Invalid token: missing user_id"}), 401
                
            print(f"Extracted user_id: {request.user_id}, role: {request.role}")
        except jwt.ExpiredSignatureError:
            print("Token expired")
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError as e:
            print(f"Invalid token: {str(e)}")
            return jsonify({"error": f"Invalid token: {str(e)}"}), 401
        except Exception as e:
            print(f"Error processing token: {str(e)}")
            return jsonify({"error": f"Error processing token: {str(e)}"}), 401
        
        return f(*args, **kwargs)
    
    return decorated_function