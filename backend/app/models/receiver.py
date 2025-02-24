from pydantic import BaseModel, Field, EmailStr, HttpUrl
from typing import Optional, List
from datetime import time

class GeoJSONPoint(BaseModel):
    type: str = Field(default="Point", example="Point")
    coordinates: List[float] = Field(..., min_items=2, max_items=2, example=[72.8892, 19.0457])  # [longitude, latitude]

class ReceiverSchema(BaseModel):
    # Reference to the user who registered as a receiver
    user_id: str  # MongoDB ObjectId stored as a string

    # Basic Information
    ngo_name: str = Field(..., min_length=3, max_length=100)
    contact_person: str = Field(..., min_length=3, max_length=100)
    contact_number: str = Field(..., pattern=r"^\+?\d{10,15}$")  # Validates phone numbers
    email: EmailStr

    # Address Details (Structured)
    building_name: str = Field(..., min_length=3, max_length=100)
    street_name: str = Field(..., min_length=3, max_length=100)
    shop_number: Optional[str]  # Optional field
    city: str
    state: str
    zip_code: str = Field(..., min_length=3, max_length=10, description="Postal/ZIP Code")

    # Location in GeoJSON format for geospatial queries
    location: GeoJSONPoint  # Embedded GeoJSON schema

    # Organization Details
    website: Optional[str]  # Optional field
    registration_number: str
    id_proof: str = Field(..., description="File path or URL of ID proof")
    ngo_gov_no: str
    date_of_establishment: str  # Consider validating as YYYY-MM-DD

    # Additional Information
    support_level: Optional[str]  # Optional field
    funding_type: Optional[str]  # Optional field
    benefits_to_receiver: Optional[str]
    items_received: Optional[str]  # Allows multiple items

    # Delivery & Logistics
    delivery_method: Optional[str]
    preferred_delivery_time: Optional[str]
    warehouse_details: Optional[str]
