from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal

class UserSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    role: Literal["general", "donor", "receiver", "delivery"] = "general"  # Default is "general"

    @classmethod
    def validate_password(cls, value: str) -> str:
        # Further password validation logic can be added here
        return value
