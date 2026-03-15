from pydantic import BaseModel
from typing import Optional

class RoomBase(BaseModel):
    hotel_id: int
    room_type: str
    price: float
    capacity: int = 1
    availability: bool = True

class RoomCreate(RoomBase):
    pass

class RoomUpdate(RoomBase):
    pass

class RoomResponse(RoomBase):
    id: int

    class Config:
        from_attributes = True
