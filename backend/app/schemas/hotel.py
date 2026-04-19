from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional
from app.schemas.room import RoomResponse, PhotoResponse


class HotelBase(BaseModel):
    name: str
    location: str
    description: Optional[str] = None
    rating: float = 0.0
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    map_embed_url: Optional[HttpUrl] = None


class HotelCreate(HotelBase):
    photos: List[HttpUrl] = Field(default_factory=list)  # List of photo URLs


class HotelUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    rating: Optional[float] = None
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    map_embed_url: Optional[HttpUrl] = None
    photos: Optional[List[HttpUrl]] = None  # Replace photos if provided


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
