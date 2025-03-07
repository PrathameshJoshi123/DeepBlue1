from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CommentSchema(BaseModel):
    author_id: str = Field(..., description="User ID of the comment author")
    author_name: str = Field(..., description="Name of the comment author")
    content: str = Field(..., min_length=1, max_length=1000, description="Comment content")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CommunityPostSchema(BaseModel):
    author_id: str = Field(..., description="User ID of the post author")
    author_name: str = Field(..., description="Name of the post author")
    title: str = Field(..., min_length=5, max_length=200, description="Post title")
    content: str = Field(..., min_length=10, max_length=5000, description="Post content")
    category: str = Field(..., description="Post category (success, initiatives, tips, qa, review)")
    target_type: Optional[str] = Field(None, description="Target type for reviews (donor, receiver, delivery_partner, general)")
    target_id: Optional[str] = Field(None, description="Target ID for reviews (user_id of the target)")
    target_name: Optional[str] = Field(None, description="Target name for reviews (name of the target entity)")
    rating: Optional[int] = Field(None, ge=1, le=5, description="Rating (1-5) for reviews")
    likes: List[str] = Field(default=[], description="List of user IDs who liked the post")
    comments: List[CommentSchema] = Field(default=[], description="List of comments on the post")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        schema_extra = {
            "example": {
                "author_id": "60d21b4967d0d8992e610c85",
                "author_name": "John Doe",
                "title": "Great experience with food donation",
                "content": "I had a wonderful experience donating food through this platform. The process was smooth and the team was very helpful.",
                "category": "success",
                "target_type": None,
                "target_id": None,
                "target_name": None,
                "rating": None,
                "likes": [],
                "comments": [],
                "created_at": "2023-10-15T10:30:00",
                "updated_at": "2023-10-15T10:30:00"
            }
        } 