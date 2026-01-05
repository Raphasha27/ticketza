
from fastapi import APIRouter

router = APIRouter()

@router.post("/")
def create_payment():
    return {"status": "pending", "gateway": "Paystack"}
