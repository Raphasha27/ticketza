
from typing import Any
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class SeatLockRequest(BaseModel):
    seat_id: int
    user_id: int

@router.post("/lock")
def lock_seat(request: SeatLockRequest) -> Any:
    """
    Lock a seat for 5-10 minutes.
    """
    # Placeholder for actual Redis/DB logic
    return {"status": "locked", "seat_id": request.seat_id, "expires_in": 300}

@router.post("/unlock")
def unlock_seat(request: SeatLockRequest) -> Any:
    """
    Unlock a seat manually (or via timeout).
    """
    return {"status": "unlocked", "seat_id": request.seat_id}
