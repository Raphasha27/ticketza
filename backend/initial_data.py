
import logging

from app.db.session import SessionLocal, engine
from app.models.all_models import Base, User, Venue, Event, Seat, EventSeat
from datetime import datetime, timedelta
from app.core.config import settings
from sqlalchemy.orm import Session

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db(db: Session):
    # Create Tables
    Base.metadata.create_all(bind=engine)
    
    # 1. Create Superuser
    user = db.query(User).filter(User.email == "admin@ticketza.co.za").first()
    if not user:
        user = User(
            full_name="Admin User",
            email="admin@ticketza.co.za",
            hashed_password="hashed_password_secret", # In real app, hash this
            is_superuser=True,
            role="admin"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 2. PROUDLY SOUTH AFRICAN VENUES 🇿🇦
    venues_data = [
        {"name": "FNB Stadium (Soccer City)", "city": "Johannesburg", "capacity": 94736, "address": "Stadium Ave, Nasrec, Johannesburg"},
        {"name": "Moses Mabhida Stadium", "city": "Durban", "capacity": 56000, "address": "44 Isaiah Ntshangase Rd, Stamford Hill"},
        {"name": "Cape Town Stadium (DHL)", "city": "Cape Town", "capacity": 55000, "address": "Fritz Sonnenberg Rd, Green Point"},
        {"name": "SunBet Arena (Time Square)", "city": "Pretoria", "capacity": 8500, "address": "209 Aramist Ave, Menlyn, Pretoria"},
    ]
    
    created_venues = []
    for v_data in venues_data:
        venue = db.query(Venue).filter(Venue.name == v_data["name"]).first()
        if not venue:
            venue = Venue(
                name=v_data["name"],
                city=v_data["city"],
                capacity=v_data["capacity"],
                address=v_data["address"],
                organizer_id=user.id
            )
            db.add(venue)
            db.commit()
            db.refresh(venue)
        created_venues.append(venue)

    # 3. Create Dummy Seats for Venues (simplified: 1 Section, 10 Rows, 10 Seats = 100 seats per venue for demo)
    # real app would be thousands
    for venue in created_venues:
        existing_seats = db.query(Seat).filter(Seat.venue_id == venue.id).count()
        if existing_seats == 0:
            logger.info(f"Seeding seats for {venue.name}...")
            seats_to_add = []
            for row in ["A", "B", "C", "D", "E"]:
                for num in range(1, 21): # 20 seats per row
                    seats_to_add.append(Seat(
                        venue_id=venue.id,
                        section="Golden Circle",
                        row=row,
                        number=str(num)
                    ))
            db.add_all(seats_to_add)
            db.commit()

    # 4. ICONIC SA EVENTS
    events_data = [
        {
            "title": "Soweto Derby: Chiefs vs Pirates",
            "description": "The biggest football rivalry in South Africa returns to the Calabash!",
            "date": datetime.now() + timedelta(days=14),
            "venue": created_venues[0], # FNB
            "image_url": "https://placehold.co/600x400/orange/white?text=Soweto+Derby"
        },
        {
            "title": "Black Coffee: Africa Rising II",
            "description": "Grammy-winning DJ Black Coffee performs a 5-hour set live in Durban.",
            "date": datetime.now() + timedelta(days=30),
            "venue": created_venues[1], # Moses Mabhida
            "image_url": "https://placehold.co/600x400/black/white?text=Black+Coffee"
        },
        {
            "title": "Cape Town Jazz Festival 2026",
            "description": "Africa's Grandest Gathering featuring international and local jazz legends.",
            "date": datetime.now() + timedelta(days=60),
            "venue": created_venues[2], # CT Stadium
            "image_url": "https://placehold.co/600x400/purple/white?text=Cape+Town+Jazz"
        },
        {
            "title": "Trevor Noah: The homecoming",
            "description": "Trevor Noah returns to home for a night of laughter.",
            "date": datetime.now() + timedelta(days=5),
            "venue": created_venues[3], # SunBet Arena
            "image_url": "https://placehold.co/600x400/blue/white?text=Trevor+Noah"
        }
    ]

    for event_data in events_data:
        event = db.query(Event).filter(Event.title == event_data["title"]).first()
        if not event:
            event = Event(
                title=event_data["title"],
                description=event_data["description"],
                date=event_data['date'],
                venue_id=event_data['venue'].id,
                organizer_id=user.id,
                image_url=event_data['image_url']
            )
            db.add(event)
            db.commit()
            db.refresh(event)
            
            # Link seats to event (EventSeats)
            venue_seats = db.query(Seat).filter(Seat.venue_id == event.venue_id).all()
            event_seats = []
            for seat in venue_seats:
                # Random pricing based on row
                price = 500.0 if seat.row in ["A", "B"] else 250.0 
                event_seats.append(EventSeat(
                    event_id=event.id,
                    seat_id=seat.id,
                    price=price,
                    status="AVAILABLE"
                ))
            db.add_all(event_seats)
            db.commit()

def main():
    logger.info("Creating initial data")
    db = SessionLocal()
    init_db(db)
    logger.info("Initial data created")

if __name__ == "__main__":
    main()
