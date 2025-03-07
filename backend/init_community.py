from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to MongoDB
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client.get_database()

# Check if community_posts collection exists and has data
if "community_posts" not in db.list_collection_names() or db.community_posts.count_documents({}) == 0:
    print("Initializing community_posts collection with sample data...")
    
    # Sample posts data
    sample_posts = [
        {
            "title": "Successful Food Drive at Local School",
            "content": "We organized a food drive at Springfield Elementary and collected over 500 kg of food that would have otherwise gone to waste. The food was distributed to 100 families in need.",
            "category": "success",
            "author_id": "sample_author_id",
            "author_name": "John Doe",
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "likes": [],
            "comments": [
                {
                    "author_id": "sample_commenter_id",
                    "author_name": "Jane Smith",
                    "content": "This is amazing! I'd love to help with the next drive.",
                    "created_at": datetime.now()
                }
            ]
        },
        {
            "title": "New Community Fridge Initiative",
            "content": "We're launching a community fridge program in downtown area. Restaurants and individuals can donate excess food, and anyone in need can take what they require.",
            "category": "initiatives",
            "author_id": "sample_author_id2",
            "author_name": "Sarah Johnson",
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "likes": [],
            "comments": []
        },
        {
            "title": "How to Store Vegetables Longer",
            "content": "Here are some tips to extend the shelf life of vegetables: 1. Store leafy greens with a paper towel to absorb moisture. 2. Keep potatoes and onions in a cool, dark place but separate from each other. 3. Don't wash berries until you're ready to eat them.",
            "category": "tips",
            "author_id": "sample_author_id3",
            "author_name": "Chef Mike",
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "likes": [],
            "comments": []
        },
        {
            "title": "How can restaurants donate excess food safely?",
            "content": "I run a small restaurant and often have excess food at the end of the day. What are the legal and safety guidelines for donating this food to shelters or through your platform?",
            "category": "qa",
            "author_id": "sample_author_id4",
            "author_name": "Restaurant Owner",
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "likes": [],
            "comments": []
        }
    ]
    
    # Insert sample posts
    db.community_posts.insert_many(sample_posts)
    print(f"Added {len(sample_posts)} sample posts to the community_posts collection")
else:
    print("community_posts collection already exists with data")

print("Community posts initialization complete!") 