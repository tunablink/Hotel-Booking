from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class BookingBase(BaseModel):
    room_id: int
    check_in: datetime
    check_out: datetime


class BookingCreate(BookingBase):
    pass


class BookingResponse(BookingBase):
    id: int
    user_id: int
    total_price: float
    status: str = "confirmed"
    room_name: Optional[str] = None
    hotel_name: Optional[str] = None

    class Config:
        from_attributes = True
