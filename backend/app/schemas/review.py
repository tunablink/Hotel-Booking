from datetime import datetime

from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    rating: float = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=3, max_length=1000)


class ReviewResponse(BaseModel):
    id: int
    hotel_id: int
    user_id: int
    user_name: str
    rating: float
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True
