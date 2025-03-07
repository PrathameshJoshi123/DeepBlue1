from flask import Blueprint, request, jsonify
from app.config.database import db
from app.utils.auth_utils import jwt_required
from app.models.community_post import CommunityPostSchema, CommentSchema
from bson import ObjectId
from datetime import datetime

community_bp = Blueprint("community", __name__)

# Helper function to serialize MongoDB documents
def serialize_post(post):
    post["_id"] = str(post["_id"])
    if "created_at" in post:
        post["created_at"] = post["created_at"].strftime("%Y-%m-%d %H:%M:%S")
    if "updated_at" in post:
        post["updated_at"] = post["updated_at"].strftime("%Y-%m-%d %H:%M:%S")
    
    # Serialize comments
    if "comments" in post and post["comments"]:
        for comment in post["comments"]:
            if "created_at" in comment:
                comment["created_at"] = comment["created_at"].strftime("%Y-%m-%d %H:%M:%S")
    
    return post

# Create a new post
@community_bp.route("/posts", methods=["POST"])
@jwt_required
def create_post():
    try:
        # Get the user's ID from the JWT token
        user_id = request.user_id
        print(f"User ID from token: {user_id}")
        
        # Get post data from request
        data = request.json
        print(f"Received post data: {data}")
        
        if not data or not data.get('title') or not data.get('content') or not data.get('category'):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Try to get user info
        try:
            user = db.users.find_one({"_id": ObjectId(user_id)})
            print(f"User from database: {user}")
            
            # Get user's name based on role if not provided in request
            if not data.get('author_name'):
                user_name = "Unknown User"
                if user and user.get("role") == "donor":
                    donor = db.donors.find_one({"user_id": str(user_id)})
                    if donor:
                        user_name = donor.get("full_name", "Unknown Donor")
                elif user and user.get("role") == "receiver":
                    receiver = db.receivers.find_one({"user_id": str(user_id)})
                    if receiver:
                        user_name = receiver.get("contact_person", "Unknown Receiver")
                elif user and user.get("role") == "delivery_partner":
                    delivery = db.delivery_partners.find_one({"user_id": str(user_id)})
                    if delivery:
                        user_name = delivery.get("person_name", "Unknown Delivery Partner")
                
                data["author_name"] = user_name
        except Exception as e:
            print(f"Error getting user info: {e}")
            # If we can't get user info, use the provided author_name or default
            if not data.get('author_name'):
                data["author_name"] = "Anonymous User"
        
        # Add author ID and timestamps
        data["author_id"] = str(user_id)
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()
        data["likes"] = []
        data["comments"] = []
        
        # For reviews, ensure target_name is stored
        if data.get('category') == 'review' and data.get('target_id') and not data.get('target_name'):
            target_type = data.get('target_type')
            target_id = data.get('target_id')
            
            # Try to get target name based on type
            if target_type == 'donor':
                donor = db.donors.find_one({"_id": ObjectId(target_id)})
                if donor:
                    data["target_name"] = donor.get("full_name") or donor.get("organization_name") or "Unknown Donor"
            elif target_type == 'receiver':
                receiver = db.receivers.find_one({"_id": ObjectId(target_id)})
                if receiver:
                    data["target_name"] = receiver.get("contact_person") or receiver.get("ngo_name") or "Unknown Receiver"
            elif target_type == 'delivery_partner':
                delivery = db.delivery_partners.find_one({"_id": ObjectId(target_id)})
                if delivery:
                    data["target_name"] = delivery.get("person_name") or delivery.get("company_name") or "Unknown Delivery Partner"
        
        # Insert into database
        result = db.community_posts.insert_one(data)
        
        return jsonify({
            "message": "Post created successfully",
            "post_id": str(result.inserted_id)
        }), 201
    
    except Exception as e:
        print(f"Error creating post: {e}")
        return jsonify({"error": str(e)}), 400

# Get all posts with optional filtering
@community_bp.route("/posts", methods=["GET"])
def get_posts():
    try:
        # Get query parameters for filtering
        category = request.args.get("category")
        search = request.args.get("search")
        target_type = request.args.get("target_type")
        target_id = request.args.get("target_id")
        
        # Pagination parameters
        limit = int(request.args.get("limit", 10))
        skip = int(request.args.get("skip", 0))
        
        # Build query
        query = {}
        if category:
            query["category"] = category
        if target_type:
            query["target_type"] = target_type
        if target_id:
            query["target_id"] = target_id
        if search:
            # Search in title and content
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"content": {"$regex": search, "$options": "i"}}
            ]
        
        # Fetch posts with pagination
        posts_cursor = db.community_posts.find(query).sort("created_at", -1).skip(skip).limit(limit)
        posts = list(map(serialize_post, posts_cursor))
        
        # Get total count for pagination
        total_count = db.community_posts.count_documents(query)
        
        return jsonify({
            "posts": posts,
            "total": total_count,
            "skip": skip,
            "limit": limit
        }), 200
    
    except Exception as e:
        print(f"Error fetching posts: {e}")
        return jsonify({"error": str(e)}), 500

# Get a specific post by ID
@community_bp.route("/posts/<post_id>", methods=["GET"])
def get_post(post_id):
    try:
        post = db.community_posts.find_one({"_id": ObjectId(post_id)})
        if not post:
            return jsonify({"error": "Post not found"}), 404
        
        return jsonify(serialize_post(post)), 200
    
    except Exception as e:
        print(f"Error fetching post: {e}")
        return jsonify({"error": str(e)}), 500

# Update a post
@community_bp.route("/posts/<post_id>", methods=["PUT"])
@jwt_required
def update_post(post_id):
    try:
        # Get the user's ID from the JWT token
        user_id = request.user_id
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401
        
        # Get the post
        post = db.community_posts.find_one({"_id": ObjectId(post_id)})
        if not post:
            return jsonify({"error": "Post not found"}), 404
        
        # Check if user is the author
        if post["author_id"] != str(user_id):
            return jsonify({"error": "You can only update your own posts"}), 403
        
        # Get update data
        data = request.json
        
        # Remove fields that shouldn't be updated
        if "author_id" in data:
            del data["author_id"]
        if "author_name" in data:
            del data["author_name"]
        if "created_at" in data:
            del data["created_at"]
        
        # Update the post
        data["updated_at"] = datetime.utcnow()
        
        db.community_posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": data}
        )
        
        return jsonify({"message": "Post updated successfully"}), 200
    
    except Exception as e:
        print(f"Error updating post: {e}")
        return jsonify({"error": str(e)}), 400

# Delete a post
@community_bp.route("/posts/<post_id>", methods=["DELETE"])
@jwt_required
def delete_post(post_id):
    try:
        # Get the user's ID from the JWT token
        user_id = request.user_id
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401
        
        # Get the post
        post = db.community_posts.find_one({"_id": ObjectId(post_id)})
        if not post:
            return jsonify({"error": "Post not found"}), 404
        
        # Check if user is the author
        if post["author_id"] != str(user_id):
            return jsonify({"error": "You can only delete your own posts"}), 403
        
        # Delete the post
        db.community_posts.delete_one({"_id": ObjectId(post_id)})
        
        return jsonify({"message": "Post deleted successfully"}), 200
    
    except Exception as e:
        print(f"Error deleting post: {e}")
        return jsonify({"error": str(e)}), 400

# Add a comment to a post
@community_bp.route("/posts/<post_id>/comment", methods=["POST"])
@jwt_required
def add_comment(post_id):
    try:
        # Get the user's ID from the JWT token
        user_id = request.user_id
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401
        
        # Get user info
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Get user's name based on role
        user_name = "Unknown User"
        if user["role"] == "donor":
            donor = db.donors.find_one({"user_id": str(user_id)})
            if donor:
                user_name = donor.get("full_name", "Unknown Donor")
        elif user["role"] == "receiver":
            receiver = db.receivers.find_one({"user_id": str(user_id)})
            if receiver:
                user_name = receiver.get("contact_person", "Unknown Receiver")
        elif user["role"] == "delivery_partner":
            delivery = db.delivery_partners.find_one({"user_id": str(user_id)})
            if delivery:
                user_name = delivery.get("person_name", "Unknown Delivery Partner")
        
        # Get comment data
        data = request.json
        
        # Add author info
        data["author_id"] = str(user_id)
        data["author_name"] = user_name
        data["created_at"] = datetime.utcnow()
        
        # Validate with schema
        comment = CommentSchema(**data)
        
        # Add comment to post
        db.community_posts.update_one(
            {"_id": ObjectId(post_id)},
            {
                "$push": {"comments": comment.model_dump()},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        return jsonify({
            "message": "Comment added successfully",
            "comment": comment.model_dump()
        }), 201
    
    except Exception as e:
        print(f"Error adding comment: {e}")
        return jsonify({"error": str(e)}), 400

# Like a post
@community_bp.route("/posts/<post_id>/like", methods=["POST"])
@jwt_required
def like_post(post_id):
    try:
        # Get the user's ID from the JWT token
        user_id = request.user_id
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401
        
        # Check if user has already liked the post
        post = db.community_posts.find_one({
            "_id": ObjectId(post_id),
            "likes": {"$in": [str(user_id)]}
        })
        
        if post:
            # User already liked the post, remove the like
            db.community_posts.update_one(
                {"_id": ObjectId(post_id)},
                {
                    "$pull": {"likes": str(user_id)},
                    "$inc": {"likes": -1}
                }
            )
            return jsonify({"message": "Like removed", "liked": False}), 200
        else:
            # User hasn't liked the post, add the like
            db.community_posts.update_one(
                {"_id": ObjectId(post_id)},
                {
                    "$addToSet": {"likes": str(user_id)},
                    "$inc": {"likes": 1}
                }
            )
            return jsonify({"message": "Post liked", "liked": True}), 200
    
    except Exception as e:
        print(f"Error liking post: {e}")
        return jsonify({"error": str(e)}), 400

# Get reviews for a specific entity
@community_bp.route("/reviews", methods=["GET"])
def get_reviews():
    try:
        # Get query parameters for filtering
        target_type = request.args.get("target_type")
        target_id = request.args.get("target_id")
        
        # Pagination parameters
        limit = int(request.args.get("limit", 10))
        skip = int(request.args.get("skip", 0))
        
        # Build query
        query = {"category": "review"}
        if target_type:
            query["target_type"] = target_type
        if target_id:
            query["target_id"] = target_id
        
        # Fetch reviews with pagination
        reviews_cursor = db.community_posts.find(query).sort("created_at", -1).skip(skip).limit(limit)
        reviews = list(map(serialize_post, reviews_cursor))
        
        # Get total count for pagination
        total_count = db.community_posts.count_documents(query)
        
        # Calculate average rating if target_id is provided
        average_rating = None
        if target_id:
            pipeline = [
                {"$match": {"category": "review", "target_id": target_id}},
                {"$group": {"_id": None, "average": {"$avg": "$rating"}}}
            ]
            result = list(db.community_posts.aggregate(pipeline))
            if result:
                average_rating = result[0]["average"]
        
        return jsonify({
            "reviews": reviews,
            "total": total_count,
            "skip": skip,
            "limit": limit,
            "average_rating": average_rating
        }), 200
    
    except Exception as e:
        print(f"Error fetching reviews: {e}")
        return jsonify({"error": str(e)}), 500 