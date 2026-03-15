from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models import user as user_model, hotel as hotel_model, room as room_model
from app.core import security

def seed_db():
    db = SessionLocal()
    
    # Check if admin exists
    admin = db.query(user_model.User).filter(user_model.User.username == "admin").first()
    if not admin:
        admin_user = user_model.User(
            username="admin", 
            email="admin@luxe.com", 
            password_hash=security.get_password_hash("admin123"), 
            role="admin"
        )
        db.add(admin_user)
        
    # Check if a hotel exists
    hotel = db.query(hotel_model.Hotel).filter(hotel_model.Hotel.name == "Luxe Grand Hotel").first()
    if not hotel:
        new_hotel = hotel_model.Hotel(
            name="Luxe Grand Hotel",
            location="New York, NY",
            description="Experience unparalleled luxury in the heart of the city.",
            rating=4.9
        )
        db.add(new_hotel)
        db.commit()
        db.refresh(new_hotel)
        
        # Add Rooms to the hotel
        room1 = room_model.Room(hotel_id=new_hotel.id, room_type="Deluxe Suite", price=850.0, capacity=2)
        room2 = room_model.Room(hotel_id=new_hotel.id, room_type="Presidential Suite", price=2500.0, capacity=4)
        db.add_all([room1, room2])
        
    db.commit()
    db.close()
    print("Database seeded successfully with sample data!")

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    seed_db()
