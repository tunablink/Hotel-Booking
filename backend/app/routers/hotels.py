from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import hotel as hotel_model
from app.schemas import hotel as hotel_schema
from app.dependencies import get_current_admin

router = APIRouter(prefix="/hotels", tags=["Hotels"])

@router.get("/", response_model=List[hotel_schema.HotelResponse])
def get_hotels(db: Session = Depends(get_db)):
    return db.query(hotel_model.Hotel).all()

@router.get("/{id}", response_model=hotel_schema.HotelResponse)
def get_hotel(id: int, db: Session = Depends(get_db)):
    hotel = db.query(hotel_model.Hotel).filter(hotel_model.Hotel.id == id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return hotel

@router.post("/", response_model=hotel_schema.HotelResponse, status_code=status.HTTP_201_CREATED)
def create_hotel(
    hotel: hotel_schema.HotelCreate, 
    db: Session = Depends(get_db), 
    current_admin = Depends(get_current_admin)
):
    new_hotel = hotel_model.Hotel(**hotel.model_dump())
    db.add(new_hotel)
    db.commit()
    db.refresh(new_hotel)
    return new_hotel

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hotel(
    id: int, 
    db: Session = Depends(get_db), 
    current_admin = Depends(get_current_admin)
):
    hotel = db.query(hotel_model.Hotel).filter(hotel_model.Hotel.id == id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    db.delete(hotel)
    db.commit()
    return None
