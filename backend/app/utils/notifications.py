import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
from app.config.database import db
from geopy.distance import geodesic

# Load environment variables from .env file
load_dotenv()

def send_email_notification(email: str, message: str, contact_person: str):
    """Send an email notification to the receiver."""
    try:
        # sender_email = 
        # sender_password = 
        # smtp_server = "smtp-mail.outlook.com"
        # smtp_port = int(465)

        if not sender_email or not sender_password:
            raise ValueError("Email credentials are missing. Check your .env file.")

        # Create Email Message
        msg = MIMEText(message)
        msg["Subject"] = f"Hey {contact_person}! New Food Donation Available"
        msg["From"] = sender_email
        msg["To"] = email

        # Connect to SMTP Server
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email, msg.as_string())
        server.quit()

        print(f"✅ Email notification sent to {email}")

    except Exception as e:
        print(f"⚠️ Notification Error: {e}")


def notify_receivers(donor_location, donation_id):
    """
    Notify receivers within a 5KM radius when a new donation is made.
    """
    try:
        donor_coords = donor_location["coordinates"]  
        nearby_receivers = []

        # Fetch receivers from DB
        receivers = db.receivers.find({}, {"location": 1, "contact_person": 1, "contact_number": 1, "email": 1})
        
        for receiver in receivers:
            if "location" in receiver and "coordinates" in receiver["location"]:
                receiver_coords = receiver["location"]["coordinates"]
                distance_km = geodesic((donor_coords[0], donor_coords[1]), (receiver_coords[0], receiver_coords[1])).km

                if distance_km <= 5:  # Only notify receivers within 5KM radius
                    nearby_receivers.append(receiver)

        # Send notifications
        message = f"New donation is available near you! Donation ID: {donation_id}"
        for receiver in nearby_receivers:
            send_email_notification(receiver["email"],receiver['contact_person'], message)

        print(f"✅ Notified {len(nearby_receivers)} {receiver['contact_person']} receivers.")

    except Exception as e:
        print(f"⚠️ Error in notify_receivers: {e}")
