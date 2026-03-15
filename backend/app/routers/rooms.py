from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import room as room_model
from app.schemas import room as room_schema
from app.dependencies import get_current_admin

router = APIRouter(prefix="/rooms", tags=["Rooms"])

@router.get("/", response_model=List[room_schema.RoomResponse])
def get_rooms(hotel_id: int = None, db: Session = Depends(get_db)):
    query = db.query(room_model.Room).filter(room_model.Room.availability == True)
    if hotel_id:
        query = query.filter(room_model.Room.hotel_id == hotel_id)
    return query.all()

@router.get("/{id}", response_model=room_schema.RoomResponse)
def get_room(id: int, db: Session = Depends(get_db)):
    room = db.query(room_model.Room).filter(room_model.Room.id == id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

@router.post("/", response_model=room_schema.RoomResponse, status_code=status.HTTP_201_CREATED)
def create_room(
    room: room_schema.RoomCreate, 
    db: Session = Depends(get_db), 
    current_admin = Depends(get_current_admin)
):
    new_room = room_model.Room(**room.model_dump())
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return new_room

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room(
    id: int, 
    db: Session = Depends(get_db), 
    current_admin = Depends(get_current_admin)
):
    room = db.query(room_model.Room).filter(room_model.Room.id == id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    db.delete(room)
    db.commit()
    return None
