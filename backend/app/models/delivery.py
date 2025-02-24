from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional

class GeoJSONPoint(BaseModel):
    type: str = Field(default="Point", Literal=True, example="Point")
    coordinates: List[float] = Field(..., min_items=2, max_items=2, example=[72.8892, 19.0457])

class DeliveryPartnerSchema(BaseModel):
    # Reference to the user who registered as a delivery partner
    user_id: str  # MongoDB ObjectId stored as a string

    # Basic Information
    company_name: str = Field(..., min_length=3, max_length=100)
    person_name: str = Field(..., min_length=3, max_length=100)
    email: str
    number: str = Field(..., pattern=r"^\+?\d{10,15}$")  # Validates phone numbers
    website: Optional[str]  # Optional field

    # Business/Individual Details
    registration_number: str = Field(..., min_length=5, max_length=50)
    vehicle_types: List[str]  # e.g., ["bike", "van", "truck"]
    fleet_size: int = Field(..., gt=0, description="Number of vehicles available")

    # Address Details
    building_name: str
    street_address: str
    city: str
    state: str
    postal_code: str = Field(..., min_length=3, max_length=10, description="Postal/ZIP Code")
    country: str
    location: GeoJSONPoint
    
    # Terms Agreement (boolean flag)
    terms_agreed: bool = Field(..., description="Must agree to Terms & Conditions")

    id_proof: str = Field(..., description="File path or URL of ID proof")