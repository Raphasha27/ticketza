
from fastapi import APIRouter
from app.api.v1.endpoints import events, users, seats, payments, tickets

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(seats.router, prefix="/seats", tags=["seats"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
