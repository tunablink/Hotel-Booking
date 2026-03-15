from pydantic import BaseModel
from datetime import datetime

class BookingBase(BaseModel):
    room_id: int
    check_in: datetime
    check_out: datetime

class BookingCreate(BookingBase):
    total_price: float

class BookingResponse(BookingBase):
    id: int
    user_id: int
    total_price: float
    status: str

    class Config:
        from_attributes = True
