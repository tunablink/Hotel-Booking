from typing import Optional
from sqlalchemy.orm import Session, joinedload
from app.models.room import Room
from app.models.hotel import Hotel


def get_rooms(db: Session, hotel_id: Optional[int] = None):
    """Get all rooms with amenities and photos. Optionally filter by hotel_id."""
    query = db.query(Room).options(
        joinedload(Room.amenities),
        joinedload(Room.photos),
    )
    if hotel_id is not None:
        query = query.filter(Room.hotel_id == hotel_id)
    return query.all()


def get_room_by_id(db: Session, room_id: int):
    """Get a single room by ID with amenities and photos."""
    return (
        db.query(Room)
        .options(
            joinedload(Room.amenities),
            joinedload(Room.photos),
        )
        .filter(Room.id == room_id)
        .first()
    )


def create_room(db: Session, room_data: dict):
    room = Room(**room_data)
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


def update_room(db: Session, room_id: int, update_data: dict):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        return None
    for key, value in update_data.items():
        if value is not None:
            setattr(room, key, value)
    db.commit()
    db.refresh(room)
    return room


def delete_room(db: Session, room_id: int) -> bool:
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        return False
    db.delete(room)
    db.commit()
    return True
