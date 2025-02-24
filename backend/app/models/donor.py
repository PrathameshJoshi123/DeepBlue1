from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Dict, List

class GeoJSONPoint(BaseModel):
    type: str = Field(default="Point", Literal=True, example="Point")
    coordinates: List[float] = Field(..., min_items=2, max_items=2, example=[72.8892, 19.0457])  # [longitude, latitude]

class DonorSchema(BaseModel):
    # Reference to the user who registered as a donor
    user_id: str  # MongoDB ObjectId stored as a string

    # Basic Information
    full_name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    restaurant_name: Optional[str]  # Optional field
    contact_number: str = Field(..., pattern=r"^\+?\d{10,15}$")  # Validates phone numbers

    # Address Details (Broken Down)
    building_name: str = Field(..., min_length=3, max_length=100)
    street_name: str = Field(..., min_length=3, max_length=100)
    shop_number: Optional[str]  # Optional field
    city: str
    state: str
    zip_code: str = Field(..., min_length=3, max_length=10, description="Postal/ZIP Code")

    # Location in GeoJSON format for geospatial queries
    location: GeoJSONPoint  # Embedded GeoJSON schema

    # Food Donation Details
    donation_frequency: str

    # Verification and Compliance
    id_proof: str = Field(..., description="File path or URL of ID proof")
    fssai_id: str = Field(..., min_length=6, max_length=20)

    # Terms Agreement (boolean flag)
    terms_agreed: bool = Field(..., description="Must agree to Terms & Conditions")
