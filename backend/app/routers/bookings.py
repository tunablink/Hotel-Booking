from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models import booking as booking_model
from app.models import room as room_model
from app.schemas import booking as booking_schema
from app.dependencies import get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.get("/", response_model=List[booking_schema.BookingResponse])
def get_user_bookings(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(booking_model.Booking).filter(booking_model.Booking.user_id == current_user.id).all()

@router.post("/", response_model=booking_schema.BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking: booking_schema.BookingCreate, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    # Check if the room exists and is available
    room = db.query(room_model.Room).filter(room_model.Room.id == booking.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if not room.availability:
        raise HTTPException(status_code=400, detail="Room is not available")
    
    # Check-in must be before check-out
    if booking.check_in >= booking.check_out:
        raise HTTPException(status_code=400, detail="Check-in must be before check-out")

    new_booking = booking_model.Booking(
        user_id=current_user.id,
        room_id=booking.room_id,
        check_in=booking.check_in,
        check_out=booking.check_out,
        total_price=booking.total_price,
        status="confirmed"
    )
    db.add(new_booking)
    
    # Mark room as unavailable
    room.availability = False
    
    db.commit()
    db.refresh(new_booking)
    return new_booking

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_booking(
    id: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    booking = db.query(booking_model.Booking).filter(booking_model.Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")
    
    # Change status and free the room
    booking.status = "cancelled"
    
    room = db.query(room_model.Room).filter(room_model.Room.id == booking.room_id).first()
    if room:
        room.availability = True
        
    db.commit()
    return None
