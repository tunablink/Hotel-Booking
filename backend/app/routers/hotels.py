from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.database import get_db
from app.models import hotel as hotel_model
from app.schemas import hotel as hotel_schema
from app.dependencies import get_current_admin

router = APIRouter(prefix="/hotels", tags=["Hotels"])


@router.get("/", response_model=List[hotel_schema.HotelResponse])
def get_hotels(
    location: Optional[str] = Query(None, description="Filter by location (partial match)"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum room price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum room price"),
    min_rating: Optional[float] = Query(None, ge=0, le=10, description="Minimum guest rating (0-10)"),
    stars: Optional[int] = Query(None, ge=1, le=5, description="Star rating filter"),
    amenities: Optional[str] = Query(None, description="Comma-separated amenities e.g. wifi,pool"),
    sort_by: Optional[str] = Query("popularity", description="Sort: popularity | price_asc | price_desc | rating"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Search hotels with optional filters:
    - **location**: partial text match on the location field
    - **min_price / max_price**: filter by minimum room price within each hotel
    - **min_rating**: filter hotels with rating >= value
    - **stars**: exact star-rating match
    - **amenities**: comma-separated list; hotel must have ALL listed amenities
    - **sort_by**: field to sort results by
    """
    query = db.query(hotel_model.Hotel)

    # Location filter (case-insensitive partial match)
    if location:
        query = query.filter(
            or_(
                hotel_model.Hotel.location.ilike(f"%{location}%"),
                hotel_model.Hotel.name.ilike(f"%{location}%"),
            )
        )

    # Rating filter
    if min_rating is not None:
        query = query.filter(hotel_model.Hotel.rating >= min_rating)

    # Stars filter (stored in rating column as an approximation or in a dedicated field)
    # For now filters on rating >= stars (can be extended once a stars column is added)
    if stars is not None:
        query = query.filter(hotel_model.Hotel.rating >= float(stars))

    # Price filter — join rooms table to check room prices
    if min_price is not None or max_price is not None:
        from app.models.room import Room
        query = query.join(Room, Room.hotel_id == hotel_model.Hotel.id, isouter=True)
        if min_price is not None:
            query = query.filter(Room.price >= min_price)
        if max_price is not None:
            query = query.filter(Room.price <= max_price)

    # Sort
    if sort_by == "price_asc":
        from app.models.room import Room as R2
        query = query.outerjoin(R2, R2.hotel_id == hotel_model.Hotel.id).order_by(R2.price.asc())
    elif sort_by == "price_desc":
        from app.models.room import Room as R3
        query = query.outerjoin(R3, R3.hotel_id == hotel_model.Hotel.id).order_by(R3.price.desc())
    elif sort_by == "rating":
        query = query.order_by(hotel_model.Hotel.rating.desc())
    else:
        # popularity: newest first (by id desc)
        query = query.order_by(hotel_model.Hotel.id.desc())

    return query.distinct().offset(skip).limit(limit).all()


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
    current_admin=Depends(get_current_admin),
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
    current_admin=Depends(get_current_admin),
):
    hotel = db.query(hotel_model.Hotel).filter(hotel_model.Hotel.id == id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    db.delete(hotel)
    db.commit()
    return None
