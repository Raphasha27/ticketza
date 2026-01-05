
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from .venue import Venue

class EventBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    venue_id: Optional[int] = None
    image_url: Optional[str] = None

class EventCreate(EventBase):
    title: str
    venue_id: int
    date: datetime

class EventUpdate(EventBase):
    pass

class EventInDBBase(EventBase):
    id: Optional[int] = None
    organizer_id: int
    venue: Optional[Venue] = None # Nested Venue object

    class Config:
        from_attributes = True

class Event(EventInDBBase):
    pass
