# Ticketza Mobile App

A React Native Expo mobile application for event ticketing in South Africa.

## Features

- Browse upcoming events
- View event details with maps
- Add tickets to cart
- Multiple payment methods (PayFast, SnapScan, Ozow, Card)
- Digital tickets with QR codes
- Real-time cart management

## Installation

```bash
cd mobile
npm install
```

## Running the App

### iOS Simulator
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Expo Go (Physical Device)
```bash
npm start
```
Then scan the QR code with:
- iOS: Camera app
- Android: Expo Go app

## Tech Stack

- React Native
- Expo
- Expo Linear Gradient
- React Native Maps (ready to integrate)

## Screens

1. **Home** - Browse events with search
2. **Event Details** - View event info, select tickets
3. **Cart** - Review selected tickets
4. **Payment** - Choose payment method
5. **Confirmation** - View digital tickets with QR codes

## Payment Methods

- PayFast
- SnapScan
- Ozow
- Credit/Debit Card

## Development

The app uses local state management for simplicity. To connect to the backend API:

1. Update API endpoints in the components
2. Replace mock data with API calls
3. Add authentication

## License

MIT
