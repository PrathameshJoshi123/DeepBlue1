from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv
import bcrypt
from bson import ObjectId

# Load environment variables
load_dotenv()

# Connect to MongoDB
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client.get_database()

# Check if test user exists
test_user = db.users.find_one({"email": "test@example.com"})

if not test_user:
    print("Creating test user...")
    
    # Hash password
    password = "password123"
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Create user
    user_id = ObjectId()
    user_data = {
        "_id": user_id,
        "email": "test@example.com",
        "password": hashed_password,
        "role": "donor",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    db.users.insert_one(user_data)
    
    # Create donor profile
    donor_data = {
        "user_id": str(user_id),
        "full_name": "Test Donor",
        "organization_name": "Test Organization",
        "contact_number": "1234567890",
        "address": "123 Test Street",
        "city": "Test City",
        "state": "Test State",
        "pincode": "123456",
        "food_types": ["Cooked Food", "Raw Food"],
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    db.donors.insert_one(donor_data)
    
    print(f"Test user created with ID: {user_id}")
    print("Email: test@example.com")
    print("Password: password123")
else:
    print("Test user already exists")
    print("Email: test@example.com")
    print("Password: password123")

print("Test user setup complete!") 