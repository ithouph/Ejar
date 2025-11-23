# Ejar - Travel & Marketplace App 🏠

A React Native mobile application built with Expo for discovering and booking properties, plus a comprehensive marketplace for phones, electronics, and more.

---

## ✨ Features

- 🏠 **Property Discovery** - Search and filter properties (Rent/Sell)
- 📱 **Marketplace** - Buy/Sell Phones, Electronics, Cars, and more
- ⭐ **Saved Posts** - Bookmark your favorite listings
- 💰 **Wallet System** - Manage balance, transactions, and top-ups
- 💳 **Payment Requests** - Member-only approval system
- ⭐ **Reviews & Ratings** - Rate properties and view feedback
- 🔐 **Google OAuth** - Secure authentication
- 📍 **Location Search** - 27 Mauritanian cities autocomplete
- 🌓 **Dark/Light Mode** - Auto-detection
- 🎨 **iOS 26 Liquid Glass UI** - Modern, native design

---

## 🚀 Quick Start

### **Option 1: Run on Replit (Recommended)**

1. Open the Replit project
2. Click **"Run"** button
3. Scan QR code with Expo Go app on your phone
4. Start developing!

> ✅ Everything is pre-configured on Replit - just run and test!

---

### **Option 2: Run Locally**

Want to run on your computer? Follow our detailed guide:

📖 **[Read LOCAL_SETUP_GUIDE.md](./LOCAL_SETUP_GUIDE.md)**

**Quick Summary:**

```bash
# 1. Install dependencies
npm install

# 2. Create .env file (see .env.example)
cp .env.example .env
# Add your Supabase credentials

# 3. Start the app (use "start", NOT "dev")
npm start

# 4. Scan QR code with Expo Go
```

> ⚠️ **Important:** Use `npm start` for local development, NOT `npm run dev` (Replit only)

---

## 📱 Testing

### On Mobile (Recommended)
1. Install **Expo Go** app ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Scan QR code from terminal
3. App opens in Expo Go

### On Web
```bash
npm run web
# Opens at http://localhost:8081
```

---

## 🔧 Tech Stack

- **Framework:** Expo (React Native 0.81.5)
- **Language:** JavaScript (no TypeScript)
- **Backend:** Supabase (PostgreSQL)
- **Auth:** Google OAuth via expo-auth-session
- **Navigation:** React Navigation 7
- **State:** React Context
- **Styling:** Centralized theme system (theme/ folder)
- **Design:** iOS 26 liquid glass interface

---

## 📂 Project Structure

```
ejar-app/
├── pages/              # All screen components
├── navigation/         # Navigation setup
├── components/         # Reusable UI components
├── services/           # Backend API logic (database.js)
├── contexts/           # React Context providers
├── theme/              # Global styles & colors
├── data/               # Fallback/static data
├── app.json            # Expo configuration
└── .env                # Environment variables
```

---

## 🔐 Environment Variables

Required in `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_KEY=your-anon-key
```

See `.env.example` for template.

---

## 📜 Available Scripts

```bash
npm start          # Start Expo (LOCAL development)
npm run dev        # Start Expo (REPLIT only - has proxy vars)
npm run web        # Open web version
npm run android    # Open Android emulator
npm run ios        # Open iOS simulator
npm run lint       # Check code quality
```

---

## 🗄️ Database Setup

The app uses Supabase PostgreSQL. Setup files:

- **DATABASE_SETUP_CLEAN.sql** - Full schema creation
- **SEED_DATA.sql** - Sample data (10 posts, users, etc.)
- **DATABASE_FIX_SCHEMA.sql** - Migration script for updates
- **DATABASE_SCHEMA.md** - Complete schema documentation

### Quick Setup:
1. Create Supabase project
2. Run `DATABASE_SETUP_CLEAN.sql` in SQL Editor
3. (Optional) Run `SEED_DATA.sql` for test data
4. Add credentials to `.env`

---

## 📚 Documentation

- 📖 [Local Setup Guide](./LOCAL_SETUP_GUIDE.md) - Run on your computer
- 📖 [Database Schema](./DATABASE_SCHEMA.md) - Tables & relationships
- 📖 [Database README](./README_DATABASE.md) - Database details
- 📖 [Important Database Update](./IMPORTANT_DATABASE_UPDATE.md) - Migration guide
- 📖 [replit.md](./replit.md) - Project architecture & history

---

## 🐛 Troubleshooting

### App won't start locally?
- Use `npm start` (not `npm run dev`)
- Clear cache: `npm start --clear`
- Delete `node_modules/` and run `npm install` again

### Database errors?
- Run `DATABASE_FIX_SCHEMA.sql` in Supabase
- Check `.env` has correct credentials

### QR code won't scan?
- Ensure phone and computer on same WiFi
- Try opening with Expo Go manually: paste URL

📖 See [LOCAL_SETUP_GUIDE.md](./LOCAL_SETUP_GUIDE.md) for detailed troubleshooting.

---

## 🎯 Development Guidelines

- **Language:** JavaScript only (no TypeScript)
- **Styling:** All styles in `theme/` folder - no custom CSS in pages
- **Backend:** All CRUD operations via `services/database.js`
- **Auth:** Google OAuth only (sign-up flow)
- **Design:** Follow iOS 26 liquid glass principles

---

## 📦 Key Dependencies

- expo (~54.0.25)
- react-native (0.81.5)
- @supabase/supabase-js (^2.83.0)
- react-navigation (^7.x)
- expo-auth-session (^7.0.9)
- expo-image-picker (^17.0.8)

---

## 🚀 Deployment

Ready to publish? The app is configured for Expo deployment:

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for production
eas build --platform android
eas build --platform ios

# Submit to stores
eas submit
```

---

## 👥 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

This project is private and proprietary.

---

## 🆘 Support

Having issues?
1. Check [LOCAL_SETUP_GUIDE.md](./LOCAL_SETUP_GUIDE.md)
2. Review [Database Documentation](./DATABASE_SCHEMA.md)
3. Check Expo Go app is latest version
4. Ensure Node.js v18+ installed

---

**Happy Coding! 🎉**
