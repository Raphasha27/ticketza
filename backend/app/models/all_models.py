
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)
    role = Column(String, default="customer") # customer, organizer, admin

class Venue(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    city = Column(String)
    address = Column(String)
    capacity = Column(Integer)
    organizer_id = Column(Integer, ForeignKey("user.id"))
    
    organizer = relationship("User")
    events = relationship("Event", back_populates="venue")
    seats = relationship("Seat", back_populates="venue")

class Event(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    date = Column(DateTime)
    venue_id = Column(Integer, ForeignKey("venue.id"))
    organizer_id = Column(Integer, ForeignKey("user.id"))
    image_url = Column(String, nullable=True)
    
    venue = relationship("Venue", back_populates="events")
    organizer = relationship("User")
    seats = relationship("EventSeat", back_populates="event")
    tickets = relationship("Ticket", back_populates="event")

class Seat(Base):
    id = Column(Integer, primary_key=True, index=True)
    venue_id = Column(Integer, ForeignKey("venue.id"))
    section = Column(String)
    row = Column(String)
    number = Column(String)
    
    venue = relationship("Venue", back_populates="seats")
    event_seats = relationship("EventSeat", back_populates="seat")

class EventSeat(Base):
    """
    Represents a specific seat for a specific event with its state and price.
    """
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("event.id"))
    seat_id = Column(Integer, ForeignKey("seat.id"))
    price = Column(Float)
    status = Column(String, default="AVAILABLE") # AVAILABLE, LOCKED, SOLD
    
    event = relationship("Event", back_populates="seats")
    seat = relationship("Seat", back_populates="event_seats")
    
class Ticket(Base):
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("event.id"))
    seat_id = Column(Integer, ForeignKey("seat.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    qr_code = Column(String, unique=True, index=True)
    status = Column(String, default="VALID") # VALID, USED, CANCELLED
    purchase_date = Column(DateTime, default=datetime.utcnow)

    event = relationship("Event", back_populates="tickets")
    seat = relationship("Seat")
    user = relationship("User")

class Payment(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    amount = Column(Float)
    status = Column(String) # PENDING, SUCCESS, FAILED
    reference = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
