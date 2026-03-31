from sqlalchemy.orm import Session
from app.models.hotel import Hotel
from app.models.room import Room
from app.models.amenity import Amenity
from app.models.photo import Photo
from app.models.user import User, UserRole
from app.core.security import get_password_hash
from app.database import SessionLocal, Base, engine


def seed_data():
    """Seed the database with sample hotels, rooms, amenities, photos, and an admin user."""
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # Skip if already seeded
        if db.query(Hotel).first():
            return

        # ── Amenities ──────────────────────────────────────────
        amenity_names = [
            "WiFi", "Air Conditioning", "Swimming Pool", "Spa",
            "Gym", "Restaurant", "Bar", "Room Service",
            "Parking", "Beach Access",
        ]
        amenities = {}
        for name in amenity_names:
            a = Amenity(name=name)
            db.add(a)
            amenities[name] = a
        db.commit()

        # ── Hotels & Rooms ─────────────────────────────────────
        hotels_data = [
            {
                "name": "Luxury Hotel Hanoi",
                "location": "Hanoi",
                "description": "Experience luxury in the heart of Hanoi with stunning views and world-class amenities.",
                "rating": 4.8,
                "rooms": [
                    {"name": "Deluxe Room", "price": 120.0, "cap": 2, "amenities": ["WiFi", "Air Conditioning", "Room Service"]},
                    {"name": "Suite", "price": 250.0, "cap": 3, "amenities": ["WiFi", "Air Conditioning", "Spa", "Room Service"]},
                    {"name": "Standard Room", "price": 80.0, "cap": 2, "amenities": ["WiFi", "Air Conditioning"]},
                ],
            },
            {
                "name": "Saigon Riverside Resort",
                "location": "Ho Chi Minh City",
                "description": "A riverside retreat offering modern comforts and breathtaking Saigon River views.",
                "rating": 4.5,
                "rooms": [
                    {"name": "River View Room", "price": 150.0, "cap": 2, "amenities": ["WiFi", "Air Conditioning", "Swimming Pool"]},
                    {"name": "Family Suite", "price": 300.0, "cap": 5, "amenities": ["WiFi", "Air Conditioning", "Swimming Pool", "Gym"]},
                ],
            },
            {
                "name": "Da Nang Beach Hotel",
                "location": "Da Nang",
                "description": "Steps away from My Khe Beach, perfect for a seaside holiday.",
                "rating": 4.6,
                "rooms": [
                    {"name": "Ocean View Room", "price": 180.0, "cap": 2, "amenities": ["WiFi", "Air Conditioning", "Beach Access"]},
                    {"name": "Penthouse", "price": 500.0, "cap": 4, "amenities": ["WiFi", "Air Conditioning", "Beach Access", "Spa", "Bar"]},
                ],
            },
            {
                "name": "Hoi An Ancient Town Stay",
                "location": "Hoi An",
                "description": "Charming boutique hotel in the UNESCO World Heritage ancient town.",
                "rating": 4.7,
                "rooms": [
                    {"name": "Heritage Room", "price": 95.0, "cap": 2, "amenities": ["WiFi", "Air Conditioning", "Restaurant"]},
                    {"name": "Garden Villa", "price": 220.0, "cap": 3, "amenities": ["WiFi", "Air Conditioning", "Swimming Pool", "Parking"]},
                ],
            },
            {
                "name": "Nha Trang Bay Resort",
                "location": "Nha Trang",
                "description": "Premium beachfront resort overlooking the stunning Nha Trang Bay.",
                "rating": 4.9,
                "rooms": [
                    {"name": "Bay View Room", "price": 200.0, "cap": 2, "amenities": ["WiFi", "Air Conditioning", "Swimming Pool", "Beach Access"]},
                    {"name": "Presidential Suite", "price": 700.0, "cap": 4, "amenities": ["WiFi", "Air Conditioning", "Spa", "Bar", "Room Service", "Beach Access"]},
                    {"name": "Economy Room", "price": 70.0, "cap": 2, "amenities": ["WiFi", "Air Conditioning"]},
                ],
            },
        ]

        photo_counter = 1
        for h_data in hotels_data:
            hotel = Hotel(
                name=h_data["name"],
                location=h_data["location"],
                description=h_data["description"],
                rating=h_data["rating"],
            )
            db.add(hotel)
            db.commit()
            db.refresh(hotel)

            # Add hotel-level photos
            for i in range(1, 4):
                hotel_photo = Photo(
                    hotel_id=hotel.id,
                    url=f"https://picsum.photos/seed/hotel{hotel.id}_{i}/1200/800",
                )
                db.add(hotel_photo)
            db.commit()

            for r_data in h_data["rooms"]:
                room = Room(
                    hotel_id=hotel.id,
                    name=r_data["name"],
                    price_per_night=r_data["price"],
                    capacity=r_data["cap"],
                )
                for amenity_name in r_data["amenities"]:
                    room.amenities.append(amenities[amenity_name])
                db.add(room)
                db.commit()
                db.refresh(room)

                # Add 2 photos per room
                for i in range(1, 3):
                    photo = Photo(
                        room_id=room.id,
                        url=f"https://picsum.photos/seed/room{photo_counter}_{i}/800/600",
                    )
                    db.add(photo)
                photo_counter += 1
            db.commit()

        # ── Admin User ─────────────────────────────────────────
        admin_user = User(
            full_name="Tuna",
            email="tuna123@hotel.com",
            password_hash=get_password_hash("tuna123"),
            role=UserRole.ADMIN,
        )
        
        db.add(admin_user)
        db.commit()

        admin_user = User(
            full_name="Admin",
            email="admin@hotel.com",
            password_hash=get_password_hash("admin123"),
            role=UserRole.ADMIN,
        )
        db.add(admin_user)
        db.commit()

    finally:
        db.close()
