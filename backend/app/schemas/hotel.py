from pydantic import BaseModel
from typing import List, Optional
from app.schemas.room import RoomResponse, PhotoResponse


class HotelBase(BaseModel):
    name: str
    location: str
    description: Optional[str] = None
    rating: float = 0.0


class HotelCreate(HotelBase):
    photos: List[str] = []  # List of photo URLs


class HotelUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    rating: Optional[float] = None
    photos: Optional[List[str]] = None  # Replace photos if provided


class HotelResponse(HotelBase):
    id: int
    rooms: List[RoomResponse] = []
    photos: List[PhotoResponse] = []

    class Config:
        from_attributes = True


class PaginatedHotelResponse(BaseModel):
    items: List[HotelResponse]
    total: int
    page: int
    pages: int
    limit: int
