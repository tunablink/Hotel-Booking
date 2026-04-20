from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.hotel import Hotel
from app.models.user import User
from app.repositories import review_repository
from app.schemas.review import ReviewCreate


def get_hotel_reviews(db: Session, hotel_id: int):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hotel not found")
    return review_repository.get_reviews_by_hotel(db, hotel_id)


def create_hotel_review(db: Session, hotel_id: int, review_data: ReviewCreate, current_user: User):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hotel not found")

    comment = review_data.comment.strip()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Comment cannot be empty",
        )

    return review_repository.create_review(
        db,
        hotel_id=hotel_id,
        user_id=current_user.id,
        rating=review_data.rating,
        comment=comment,
    )
