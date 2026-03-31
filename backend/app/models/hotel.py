from sqlalchemy import Column, Integer, String, Text, Float
from sqlalchemy.orm import relationship
from app.database import Base


class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    location = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    rating = Column(Float, default=0.0)

    rooms = relationship("Room", back_populates="hotel", cascade="all, delete-orphan")
    photos = relationship("Photo", back_populates="hotel", cascade="all, delete-orphan")
