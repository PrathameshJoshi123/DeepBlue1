from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os
from app.routes.auth_routes import auth_bp
from app.routes.receiver_routes import receiver_bp
from app.routes.donor_routes import donor_bp
from app.routes.delivery_routes import delivery_bp
from app.routes.register_donations import donation_bp
from app.routes.forecast_routes import forecast_bp

# Load environment variables from .env
load_dotenv()

# Initialize Flask app
def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable Cross-Origin Resource Sharing

    # Set Flask Config from .env file
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")  # Add the Mongo URI from .env

    # Initialize Flask-PyMongo
    mongo = PyMongo(app)
    db = mongo.db  # Access the database

    # Initialize Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)

    # Register Blueprints
    app.register_blueprint(receiver_bp, url_prefix="/receiver")
    app.register_blueprint(donor_bp, url_prefix="/donor")
    app.register_blueprint(donation_bp, url_prefix="/donation")
    app.register_blueprint(delivery_bp, url_prefix="/delivery")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(forecast_bp, url_prefix="/forecast")

    # Define user loader for Flask-Login
    @login_manager.user_loader
    def load_user(user_id):
        return db.users.find_one({"_id": user_id})  # Use ObjectId if necessary

    return app
