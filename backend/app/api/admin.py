from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.hotel import HotelCreate, HotelUpdate, HotelResponse
from app.schemas.room import RoomCreate, RoomUpdate, RoomResponse
from app.schemas.booking import BookingResponse
from app.services import hotel_service, room_service, booking_service
from app.api.deps import require_admin
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin"])


# ─── Hotels ───────────────────────────────────────────────────────────

@router.post(
    "/hotels",
    response_model=HotelResponse,
    status_code=status.HTTP_201_CREATED,
    summary="[Admin] Create a hotel",
)
def create_hotel(
    hotel_data: HotelCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Create a new hotel with optional photos and map embed data. Requires ADMIN role."""
    data = hotel_data.model_dump(mode="json", exclude={"photos"})
    return hotel_service.create_hotel(db, data, photo_urls=hotel_data.photos)


@router.put(
    "/hotels/{hotel_id}",
    response_model=HotelResponse,
    summary="[Admin] Update a hotel",
)
def update_hotel(
    hotel_id: int,
    hotel_data: HotelUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Update an existing hotel. Only non-null fields are updated. Requires ADMIN role."""
    data = hotel_data.model_dump(mode="json", exclude_unset=True, exclude={"photos"})
    return hotel_service.update_hotel(db, hotel_id, data, photo_urls=hotel_data.photos)


@router.delete(
    "/hotels/{hotel_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="[Admin] Delete a hotel",
)
def delete_hotel(
    hotel_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Delete a hotel and all its rooms. Requires ADMIN role."""
    hotel_service.delete_hotel(db, hotel_id)
    return None


# ─── Rooms ────────────────────────────────────────────────────────────

@router.post(
    "/rooms",
    response_model=RoomResponse,
    status_code=status.HTTP_201_CREATED,
    summary="[Admin] Create a room",
)
def create_room(
    room_data: RoomCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Create a new room for a hotel. Requires ADMIN role."""
    return room_service.create_room(db, room_data.model_dump())


@router.put(
    "/rooms/{room_id}",
    response_model=RoomResponse,
    summary="[Admin] Update a room",
)
def update_room(
    room_id: int,
    room_data: RoomUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Update a room. Only non-null fields are updated. Requires ADMIN role."""
    return room_service.update_room(db, room_id, room_data.model_dump(exclude_unset=True))


@router.delete(
    "/rooms/{room_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="[Admin] Delete a room",
)
def delete_room(
    room_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Delete a room. Requires ADMIN role."""
    room_service.delete_room(db, room_id)
    return None


# ─── Bookings ─────────────────────────────────────────────────────────

@router.get(
    "/bookings",
    response_model=List[BookingResponse],
    summary="[Admin] Get all bookings",
)
def get_all_bookings(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Get all bookings across all users. Requires ADMIN role."""
    return booking_service.get_all_bookings(db)
