from pydantic import BaseModel
from typing import List, Optional


class AmenityResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class PhotoResponse(BaseModel):
    id: int
    url: str

    class Config:
        from_attributes = True


class RoomBase(BaseModel):
    name: str
    price_per_night: float
    capacity: int


class RoomCreate(RoomBase):
    hotel_id: int


class RoomUpdate(BaseModel):
    name: Optional[str] = None
    price_per_night: Optional[float] = None
    capacity: Optional[int] = None


class RoomResponse(RoomBase):
    id: int
    hotel_id: int
    amenities: List[AmenityResponse] = []
    photos: List[PhotoResponse] = []

    class Config:
        from_attributes = True
