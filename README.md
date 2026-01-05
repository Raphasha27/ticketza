# Ticketza 🇿🇦

Ticketza is a centralized event ticketing platform designed for the South African market. It allows event organizers to list events, users to browse and select seats in real-time, processes payments, and issues digital QR tickets for venue entry.

## 📱 Mobile App (React Native Expo)
The mobile version of Ticketza is built for on-the-go event discovery and instant ticket access.

### Features
- **Real-time Discovery**: Syncs directly with the FastAPI backend.
- **Premium UI**: Modern, glassmorphic design optimized for Android & iOS.
- **Cart & Checkout**: Full shopping bag experience with South African payment methods (PayFast, SnapScan, Ozow).
- **Digital Tickets**: Offline-ready QR codes for scanning at entrance.
- **Offline Reliability**: Built-in fallback mode ensures the app works even with poor connectivity.

### How to Run (Local)
1. **Prerequisites**: [Expo Go](https://expo.dev/go) installed on your physical device.
2. **Terminal 1 (Backend)**:
   ```bash
   # Bind to 0.0.0.0 to allow mobile connection
   run_backend.bat
   ```
3. **Terminal 2 (Mobile)**:
   ```bash
   cd mobile
   npx expo start --lan
   ```
4. **Scan**: Use Expo Go to scan the QR code (ensure phone and PC are on the same Wi-Fi).

---

## 🏗️ Technical Stack
- **Web Frontend**: Next.js 16 (React), Tailwind CSS, Framer Motion.
- **Mobile App**: React Native Expo, Ionicons, Linear Gradients.
- **Backend API**: FastAPI (Python 3.10+), Pydantic.
- **Database**: 
  - **Development**: SQLite (`ticketza.db`) for zero-configuration setup.
  - **Production**: PostgreSQL.
- **Real-time**: WebSockets for seat map synchronization.

## 👥 User Roles
1. **Customer**: Browse events, book seats, pay, view digital tickets.
2. **Event Organizer**: Create events, manage venues, monitor real-time sales.
3. **Admin**: Platform governance, fraud monitoring, venue approval.

## 🚀 Phase Status
- [x] **Phase 1: Foundation**: Auth, Events CRUD, Basic Booking.
- [x] **Phase 2: Mobile Integration**: React Native app with real-time API sync.
- [x] **Phase 3: Database & Local**: Migrated to easy-run SQLite with SA data seeding.
- [ ] **Phase 4: Advanced Locking**: Implementation of Redis-based seat locking.

## 🎮 Access Points
- **Web Interface**: `http://localhost:3000`
- **API Documentation**: `http://localhost:8000/docs`
- **Mobile Dev Server**: `http://localhost:8081`

---
*Built with ❤️ for South African Entertainment.*
