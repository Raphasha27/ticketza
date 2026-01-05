
from typing import Optional
from pydantic import BaseModel

class VenueBase(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    capacity: Optional[int] = None

class VenueCreate(VenueBase):
    name: str
    city: str
    pass

class VenueUpdate(VenueBase):
    pass

class VenueInDBBase(VenueBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

class Venue(VenueInDBBase):
    pass
