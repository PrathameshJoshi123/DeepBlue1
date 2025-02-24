from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class LocationSchema(BaseModel):
    type: str = Field(default="Point")
    coordinates: List[float]  # [longitude, latitude]

class DonationSchema(BaseModel):
    donor_id: str  # Reference to Donor's ObjectId stored as a string

    # Food Details
    food_type: str = Field(..., min_length=3, max_length=100)  # Example: "Vegetarian", "Non-Vegetarian", "Fruits"
    quantity: float = Field(..., gt=0, description="Quantity in KG/Liters/Items")
    unit: str = Field(..., description="Unit of measurement (kg, liters, pieces, etc.)")
    expiry_date: datetime = Field(..., description="Expiry date of the food item")
   #perishable_ingredients: Optional[List[str]] = Field(None, description="List of perishable ingredients")
    perishable_ingredients: Optional[List[str]] = Field(None, description="List of perishable ingredients")
    
    # Food Quality Check
    quality_status: Optional[str] = Field(None, description="Auto-evaluated status like 'Good', 'Medium', 'Expired'")
    quality_score: Optional[float] = Field(None, ge=0, le=1, description="Food quality confidence score (0-1)")

    # Images (Sample Images of Donation)
    image_urls: List[str] = Field(default=[], description="List of image URLs")

    # Pickup Location (Same as Donor's GeoJSON)
    location: LocationSchema = Field(..., description="Geolocation of food pickup point")

    # Donation Status
    status: str = Field(default="Pending", description="Pending, Accepted, Picked Up, Delivered, Canceled")
    
    # Receiver & Delivery Partner (Initially None)
    receiver_id: Optional[str] = Field(None, description="Receiver's ObjectId")
    delivery_partner_id: Optional[str] = Field(None, description="Delivery Partner's ObjectId")

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
