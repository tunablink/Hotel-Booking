from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models.hotel import Hotel
from app.models.review import Review


def get_reviews_by_hotel(db: Session, hotel_id: int):
    return (
        db.query(Review)
        .options(joinedload(Review.user))
        .filter(Review.hotel_id == hotel_id)
        .order_by(Review.created_at.desc(), Review.id.desc())
        .all()
    )


def create_review(db: Session, hotel_id: int, user_id: int, rating: float, comment: str):
    review = Review(
        hotel_id=hotel_id,
        user_id=user_id,
        rating=rating,
        comment=comment.strip(),
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    average_rating = (
        db.query(func.avg(Review.rating))
        .filter(Review.hotel_id == hotel_id)
        .scalar()
    )
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if hotel:
        hotel.rating = round(float(average_rating or 0), 1)
        db.commit()

    return (
        db.query(Review)
        .options(joinedload(Review.user))
        .filter(Review.id == review.id)
        .first()
    )
