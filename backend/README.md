# ⚙️ Ticketza API Backend
### High-Performance Python Engine for Event Commerce 🇿🇦

---

## 🚀 Overview
**Ticketza Backend** is a robust API layer built with **FastAPI** and **Python 3.10+**. It handles all critical business logic, event indexing, and transaction processing for the Ticketza ecosystem.

---

## ✨ Features
- **High Concurrency**: Built on FastAPI's asynchronous architecture for fast response times.
- **SQLAlchemy ORM**: Flexible and powerful database management (SQLite implementation).
- **Auto-Docs**: Interactive API documentation via Swagger UI.
- **Scalable Design**: Modular app structure for easy expansion.

---

## 🛠️ Technology Stack
- **Language**: Python 3.10+
- **Framework**: FastAPI
- **Database**: SQLite (SQLAlchemy ORM)
- **Environment**: Pydantic for configuration

---

## 📖 API Documentation
Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## ⚙️ Development Setup

1. **Install Virtual Environment**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # venv\Scripts\activate on Windows
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Server**:
   ```bash
   uvicorn app.main:app --reload
   ```

---

### 🔥 Built by Kid Of Dynamic 🇿🇦
*Developing high-availability systems for the next generation of South African apps.*
