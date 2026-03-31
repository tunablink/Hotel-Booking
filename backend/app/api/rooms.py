from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.room import RoomResponse
from app.services import room_service

router = APIRouter(prefix="/rooms", tags=["Rooms"])


@router.get("", response_model=List[RoomResponse], summary="List all rooms")
def get_rooms(
    hotel_id: Optional[int] = Query(None, description="Filter by hotel ID"),
    db: Session = Depends(get_db),
):
    """
    Get all rooms. Optionally filter by `hotel_id`.
    Each room includes its amenities and photos.
    """
    return room_service.get_all_rooms(db, hotel_id=hotel_id)


@router.get("/{room_id}", response_model=RoomResponse, summary="Get room details")
def get_room(room_id: int, db: Session = Depends(get_db)):
    """Get a single room by ID, including amenities and photos."""
    return room_service.get_room_details(db, room_id)
