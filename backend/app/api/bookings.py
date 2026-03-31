from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.booking import BookingCreate, BookingResponse
from app.services import booking_service
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post(
    "",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new booking",
)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Book a room. Requires authentication.

    - Validates that the room exists
    - Calculates `total_price` = nights × price_per_night
    - Stores the booking in the database
    """
    return booking_service.create_booking(db, booking_data, current_user)


@router.get(
    "/my",
    response_model=List[BookingResponse],
    summary="Get my bookings",
)
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all bookings for the currently authenticated user.
    Returns room and hotel names alongside booking details.
    """
    return booking_service.get_my_bookings(db, current_user)
