from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base

room_amenity = Table(
    'room_amenity',
    Base.metadata,
    Column('room_id', Integer, ForeignKey('rooms.id'), primary_key=True),
    Column('amenity_id', Integer, ForeignKey('amenities.id'), primary_key=True)
)

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    hotel_id = Column(Integer, ForeignKey("hotels.id"), nullable=False)
    name = Column(String, nullable=False)
    price_per_night = Column(Float, nullable=False)
    capacity = Column(Integer, default=1)
    
    hotel = relationship("Hotel", back_populates="rooms")
    amenities = relationship("Amenity", secondary=room_amenity, back_populates="rooms")
    photos = relationship("Photo", back_populates="room", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="room", cascade="all, delete-orphan")
