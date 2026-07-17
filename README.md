# Ticketza

Full-stack event ticketing platform with FastAPI backend and Next.js frontend.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** FastAPI (Python), SQLAlchemy, Pydantic
- **Database:** SQLite
- **Features:** QR code generation, payment processing

## Features

- Event creation and management
- Seat selection and reservation
- Ticket purchasing and QR code generation
- User authentication and profiles
- Payment processing integration

## Getting Started

```bash
git clone https://github.com/Raphasha27/ticketza.git
cd ticketza
# Backend
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
# Frontend
cd frontend && npm install && npm run dev
```

## License

MIT
