from sqlalchemy.orm import Session, joinedload
from app.models.booking import Booking
from app.models.room import Room
from app.schemas.booking import BookingCreate


def create_booking(db: Session, booking: BookingCreate, user_id: int, total_price: float):
    db_booking = Booking(
        user_id=user_id,
        room_id=booking.room_id,
        check_in=booking.check_in,
        check_out=booking.check_out,
        total_price=total_price,
        status="confirmed",
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


def get_room_by_id(db: Session, room_id: int):
    return db.query(Room).filter(Room.id == room_id).first()


def get_user_bookings(db: Session, user_id: int):
    """Get all bookings for a specific user, eager-loading room and hotel."""
    return (
        db.query(Booking)
        .options(joinedload(Booking.room).joinedload(Room.hotel))
        .filter(Booking.user_id == user_id)
        .order_by(Booking.id.desc())
        .all()
    )


def get_all_bookings(db: Session):
    """Get all bookings (admin). Eager-loads room, hotel, and user."""
    return (
        db.query(Booking)
        .options(
            joinedload(Booking.room).joinedload(Room.hotel),
            joinedload(Booking.user),
        )
        .order_by(Booking.id.desc())
        .all()
    )
