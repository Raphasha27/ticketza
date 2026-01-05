# Ticketza

Ticketza is a centralized event ticketing platform where event organizers list events, users browse and select seats in real-time, payments are processed, and digital QR tickets are issued and scanned at venues. A modern, enterprise-grade alternative to Computicket.

## 🎯 Core Concept
- **Event Discovery**: Users browse events.
- **Seat Selection**: Real-time seat locking and selection.
- **Payments**: Integrated mock or real payment gateways.
- **Ticketing**: QR code generation and validation.

## 👥 User Roles
1. **Customer**: Browse, book, pay, view tickets.
2. **Event Organizer**: Create events, manage venues, view sales.
3. **Admin**: Manage platform, approve events, monitor fraud.

## 🧠 Architecture
- **Frontend**: Next.js (React), Tailwind CSS.
- **Backend**: FastAPI, Python.
- **Database**: PostgreSQL (Users, Events, Venues, Seats, Tickets, Payments).
- **Services**: Payment Gateway, Email/SMS, PDF Generation.

## 🗄️ Database Schema (Core Tables)
- **users**: `id, name, email, role, password_hash`
- **events**: `id, title, description, date, venue_id, organizer_id`
- **venues**: `id, name, city`
- **seats**: `id, venue_id, section, row, number`
- **event_seats**: `event_id, seat_id, price, status`
- **tickets**: `id, event_id, seat_id, user_id, qr_code, status`
- **payments**: `id, user_id, amount, status, reference`

## 🚀 Roadmap

### Phase 1 – Foundation
- [ ] Auth & RBAC
- [ ] Events CRUD
- [ ] Basic Seat Selection
- [ ] Fake Payment
- [ ] Ticket Generation

### Phase 2 – Realism
- [ ] Seat Locking Logic (Redis/locking)
- [ ] QR Validation
- [ ] Organizer Dashboard

### Phase 3 – Polish
- [ ] Analytics & Heatmaps
- [ ] Admin Controls
- [ ] Production Deployment

## 🎮 Demo Features Ready
- **Frontend**: http://localhost:3000
- **Organizer Dashboard**: http://localhost:3000/organizer/dashboard
- **Seat Map Demo**: http://localhost:3000/events/1

