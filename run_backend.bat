
@echo off
echo Starting Ticketza Backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
pause
