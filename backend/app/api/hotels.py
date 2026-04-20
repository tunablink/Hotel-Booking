from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.hotel import HotelResponse, PaginatedHotelResponse
from app.schemas.review import ReviewCreate, ReviewResponse
from app.services import hotel_service, review_service
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/hotels", tags=["Hotels"])


@router.get(
    "",
    response_model=PaginatedHotelResponse,
    summary="Search & list hotels with pagination",
)
def get_hotels(
    location: Optional[str] = Query(None, description="Filter by location or name (partial match)"),
    price_min: Optional[float] = Query(None, ge=0, description="Minimum room price per night"),
    price_max: Optional[float] = Query(None, ge=0, description="Maximum room price per night"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum hotel rating"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    """
    Search hotels with optional filters and pagination.

    - **location**: case-insensitive partial match on hotel name or location
    - **price_min / price_max**: filter by room price range
    - **min_rating**: minimum hotel rating
    - **page / limit**: pagination controls
    """
    return hotel_service.search_hotels(
        db,
        location=location,
        price_min=price_min,
        price_max=price_max,
        min_rating=min_rating,
        page=page,
        limit=limit,
    )


@router.get(
    "/{hotel_id}",
    response_model=HotelResponse,
    summary="Get hotel details",
)
def get_hotel(hotel_id: int, db: Session = Depends(get_db)):
    """
    Get a single hotel by ID, including its rooms, amenities, and photos.
    Uses `joinedload` to optimize queries and avoid N+1.
    """
    return hotel_service.get_hotel_details(db, hotel_id)


@router.get(
    "/{hotel_id}/reviews",
    response_model=List[ReviewResponse],
    summary="Get guest reviews for a hotel",
)
def get_hotel_reviews(hotel_id: int, db: Session = Depends(get_db)):
    """Return all guest reviews for a hotel, newest first."""
    return review_service.get_hotel_reviews(db, hotel_id)


@router.post(
    "/{hotel_id}/reviews",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a guest review for a hotel",
)
def create_hotel_review(
    hotel_id: int,
    review_data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a review from the currently authenticated user."""
    return review_service.create_hotel_review(db, hotel_id, review_data, current_user)
