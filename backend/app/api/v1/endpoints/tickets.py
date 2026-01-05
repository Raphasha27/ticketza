
from typing import Any
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.utils.qrcode_gen import generate_qr_code
import uuid

router = APIRouter()

class TicketRequest(BaseModel):
    user_id: int
    event_id: int
    seat_ids: list[int]

class TicketResponse(BaseModel):
    ticket_id: str
    qr_code: str
    event_name: str
    seat_info: str
    status: str

@router.post("/issue", response_model=TicketResponse)
def issue_ticket(request: TicketRequest) -> Any:
    """
    Issue a ticket and generate a QR code.
    """
    # In a real app, verify payment status here first.
    
    # Generate a unique ticket ID / Reference
    ticket_ref = str(uuid.uuid4())[:8].upper()
    
    # Generate QR Data (e.g., ticket_ref + secure signature of user)
    qr_data = f"TICKETZA:{ticket_ref}:{request.user_id}:{request.event_id}"
    qr_image = generate_qr_code(qr_data)
    
    # Mock response
    return {
        "ticket_id": ticket_ref,
        "qr_code": qr_image,
        "event_name": "Soweto Derby: Chiefs vs Pirates", # Mock
        "seat_info": f"Section A, Seats {request.seat_ids}",
        "status": "ISSUED"
    }
