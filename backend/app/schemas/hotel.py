from pydantic import BaseModel
from typing import Optional

class HotelBase(BaseModel):
    name: str
    location: str
    description: Optional[str] = None
    rating: float = 0.0

class HotelCreate(HotelBase):
    pass

class HotelUpdate(HotelBase):
    pass

class HotelResponse(HotelBase):
    id: int

    class Config:
        from_attributes = True
