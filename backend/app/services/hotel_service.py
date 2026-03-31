from typing import Optional, List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories import hotel_repository


def get_all_hotels(db: Session):
    return hotel_repository.get_hotels(db)


def get_hotel_details(db: Session, hotel_id: int):
    hotel = hotel_repository.get_hotel_by_id(db, hotel_id)
    if not hotel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hotel not found")
    return hotel


def search_hotels(
    db: Session,
    location: Optional[str] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    min_rating: Optional[float] = None,
    page: int = 1,
    limit: int = 10,
):
    items, total, pages = hotel_repository.search_hotels(
        db,
        location=location,
        price_min=price_min,
        price_max=price_max,
        min_rating=min_rating,
        page=page,
        limit=limit,
    )
    return {
        "items": items,
        "total": total,
        "page": page,
        "pages": pages,
        "limit": limit,
    }


# --- Admin operations ---

def create_hotel(db: Session, hotel_data: dict, photo_urls: List[str] = None):
    return hotel_repository.create_hotel(db, hotel_data, photo_urls=photo_urls)


def update_hotel(db: Session, hotel_id: int, update_data: dict, photo_urls: List[str] = None):
    hotel = hotel_repository.update_hotel(db, hotel_id, update_data, photo_urls=photo_urls)
    if not hotel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hotel not found")
    return hotel


def delete_hotel(db: Session, hotel_id: int):
    deleted = hotel_repository.delete_hotel(db, hotel_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hotel not found")
    return True
