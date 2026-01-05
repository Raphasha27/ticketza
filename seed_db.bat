
@echo off
echo Seeding Database with South African data...
cd backend
call venv\Scripts\activate
set PYTHONPATH=.
python initial_data.py
pause
