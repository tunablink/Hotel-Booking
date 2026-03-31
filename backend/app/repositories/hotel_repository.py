import math
from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.hotel import Hotel
from app.models.room import Room
from app.models.photo import Photo


def get_hotels(db: Session):
    """Get all hotels with rooms, amenities, photos eager-loaded."""
    return db.query(Hotel).options(
        joinedload(Hotel.rooms).joinedload(Room.amenities),
        joinedload(Hotel.rooms).joinedload(Room.photos),
        joinedload(Hotel.photos),
    ).all()


def get_hotel_by_id(db: Session, hotel_id: int):
    """Get a single hotel by ID with rooms, amenities, photos eager-loaded."""
    return db.query(Hotel).options(
        joinedload(Hotel.rooms).joinedload(Room.amenities),
        joinedload(Hotel.rooms).joinedload(Room.photos),
        joinedload(Hotel.photos),
    ).filter(Hotel.id == hotel_id).first()


def search_hotels(
    db: Session,
    location: Optional[str] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    min_rating: Optional[float] = None,
    page: int = 1,
    limit: int = 10,
):
    """Search hotels with filters and pagination. Returns (items, total, pages)."""
    query = db.query(Hotel).options(
        joinedload(Hotel.rooms).joinedload(Room.amenities),
        joinedload(Hotel.rooms).joinedload(Room.photos),
        joinedload(Hotel.photos),
    )

    if location:
        query = query.filter(
            or_(
                Hotel.location.ilike(f"%{location}%"),
                Hotel.name.ilike(f"%{location}%"),
            )
        )

    if min_rating is not None:
        query = query.filter(Hotel.rating >= min_rating)

    if price_min is not None or price_max is not None:
        query = query.join(Room, Room.hotel_id == Hotel.id, isouter=True)
        if price_min is not None:
            query = query.filter(Room.price_per_night >= price_min)
        if price_max is not None:
            query = query.filter(Room.price_per_night <= price_max)

    query = query.distinct().order_by(Hotel.id.desc())

    total = query.count()
    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()
    pages = math.ceil(total / limit) if limit > 0 else 0

    return items, total, pages


def create_hotel(db: Session, hotel_data: dict, photo_urls: List[str] = None):
    """Create a hotel with optional photos."""
    hotel = Hotel(
        name=hotel_data["name"],
        location=hotel_data["location"],
        description=hotel_data.get("description"),
        rating=hotel_data.get("rating", 0.0),
    )
    db.add(hotel)
    db.commit()
    db.refresh(hotel)

    # Add photos
    if photo_urls:
        for url in photo_urls:
            photo = Photo(hotel_id=hotel.id, url=url)
            db.add(photo)
        db.commit()
        db.refresh(hotel)

    return hotel


def update_hotel(db: Session, hotel_id: int, update_data: dict, photo_urls: List[str] = None):
    """Update hotel fields and optionally replace photos."""
    hotel = db.query(Hotel).options(joinedload(Hotel.photos)).filter(Hotel.id == hotel_id).first()
    if not hotel:
        return None

    for key, value in update_data.items():
        if value is not None:
            setattr(hotel, key, value)

    # Replace photos if provided
    if photo_urls is not None:
        # Delete existing hotel photos
        for photo in hotel.photos:
            db.delete(photo)
        # Add new ones
        for url in photo_urls:
            db.add(Photo(hotel_id=hotel.id, url=url))

    db.commit()
    db.refresh(hotel)
    return hotel


def delete_hotel(db: Session, hotel_id: int) -> bool:
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        return False
    db.delete(hotel)
    db.commit()
    return True
