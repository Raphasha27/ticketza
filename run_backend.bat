
@echo off
echo Starting Ticketza Backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
