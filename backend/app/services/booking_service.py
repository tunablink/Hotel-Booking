from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemas.booking import BookingCreate
from app.repositories import booking_repository
from app.models.user import User


def create_booking(db: Session, booking: BookingCreate, current_user: User):
    room = booking_repository.get_room_by_id(db, booking.room_id)
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )

    if booking.check_in >= booking.check_out:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-out must be after check-in",
        )

    nights = (booking.check_out - booking.check_in).days
    if nights <= 0:
        nights = 1

    total_price = nights * room.price_per_night
    db_booking = booking_repository.create_booking(db, booking, current_user.id, total_price)

    # Enrich response with room/hotel names
    return _enrich_booking(db_booking)


def get_my_bookings(db: Session, user: User):
    bookings = booking_repository.get_user_bookings(db, user.id)
    return [_enrich_booking(b) for b in bookings]


def get_all_bookings(db: Session):
    bookings = booking_repository.get_all_bookings(db)
    return [_enrich_booking(b) for b in bookings]


def _enrich_booking(booking):
    """Add room_name and hotel_name to a booking object for the response."""
    booking.room_name = booking.room.name if booking.room else None
    booking.hotel_name = (
        booking.room.hotel.name if booking.room and booking.room.hotel else None
    )
    return booking
