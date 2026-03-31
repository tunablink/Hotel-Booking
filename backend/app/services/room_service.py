from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories import room_repository


def get_all_rooms(db: Session, hotel_id: Optional[int] = None):
    return room_repository.get_rooms(db, hotel_id=hotel_id)


def get_room_details(db: Session, room_id: int):
    room = room_repository.get_room_by_id(db, room_id)
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    return room


# --- Admin operations ---

def create_room(db: Session, room_data: dict):
    return room_repository.create_room(db, room_data)


def update_room(db: Session, room_id: int, update_data: dict):
    room = room_repository.update_room(db, room_id, update_data)
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    return room


def delete_room(db: Session, room_id: int):
    deleted = room_repository.delete_room(db, room_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    return True
