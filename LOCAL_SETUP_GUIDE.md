# 🏠 Local Development Setup Guide

This guide will help you run the Ejar app on your local computer.

---

## ⚠️ The Problem

The app is configured for Replit's environment with special proxy settings. When you download and try to run it locally, you'll get errors because these Replit-specific variables don't exist on your machine.

---

## ✅ Solution: Run Locally in 5 Steps

### **Step 1: Prerequisites**

Make sure you have these installed:
- ✅ **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- ✅ **npm** (comes with Node.js)
- ✅ **Expo Go app** on your phone - [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

### **Step 2: Download the Project**

1. Download all files from Replit
2. Extract to a folder on your computer
3. Open Terminal/Command Prompt in that folder

---

### **Step 3: Create `.env` File**

Create a file named `.env` in the root folder with this content:

```env
EXPO_PUBLIC_SUPABASE_URL=https://pvfgyvjsxqlmyugucohg.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2Zmd5dmpzeHFsbXl1Z3Vjb2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMDg5MTUsImV4cCI6MjA3NzY4NDkxNX0.Sqnn_B3bInpZ-1voy1uYTS08pnrWOMcnPKHv5FxmHbE
```

> ⚠️ **Important:** This file is already in your project, but make sure it exists when you download.

---

### **Step 4: Install Dependencies**

Open Terminal in your project folder and run:

```bash
npm install
```

Wait for all packages to download (this may take a few minutes).

---

### **Step 5: Start the App**

Use this command instead of `npm run dev`:

```bash
npm start
```

**DO NOT use** `npm run dev` - that's for Replit only!

---

## 📱 Testing the App

After running `npm start`, you'll see:

1. **QR Code** in the terminal
2. **Options** to open on web, Android, or iOS

### On Your Phone:
- **iOS:** Open Camera app → Scan QR code → Tap notification
- **Android:** Open Expo Go app → Scan QR code

### On Web:
- Press `w` in the terminal
- Opens browser at `http://localhost:8081`

---

## 🔧 Common Issues & Fixes

### ❌ Error: "Cannot find module"
**Solution:** Run `npm install` again

### ❌ Error: "EXPO_PACKAGER_PROXY_URL is not defined"
**Solution:** Use `npm start` instead of `npm run dev`

### ❌ Error: "Supabase client initialization failed"
**Solution:** Check that `.env` file exists with correct credentials

### ❌ Metro bundler won't start
**Solution:** 
```bash
npm start --clear
```

### ❌ App crashes on phone
**Solution:**
1. Close Expo Go completely
2. Clear cache: `npm start --clear`
3. Scan QR code again

---

## 🎯 Quick Command Reference

```bash
# Install dependencies
npm install

# Start development server (LOCAL)
npm start

# Start with cache cleared
npm start --clear

# Open on web
npm run web

# Check for errors
npm run lint
```

---

## 📂 Project Structure

```
ejar-app/
├── .env                  ← Supabase credentials
├── package.json          ← Dependencies & scripts
├── app.json             ← Expo configuration
├── pages/               ← All screens
├── navigation/          ← Navigation setup
├── components/          ← Reusable components
├── services/            ← Backend logic
├── theme/               ← Styling system
└── data/                ← Fallback data
```

---

## 🚀 Development Tips

1. **Hot Reload:** Changes auto-update - no need to restart
2. **Console Logs:** Shake phone → "Debug Remote JS" to see logs
3. **Fast Refresh:** If stuck, shake phone → "Reload"
4. **Production Build:** Use `eas build` when ready to publish

---

## 🔐 Environment Variables

The app needs these Supabase credentials (already in `.env`):

| Variable | Purpose | Value |
|----------|---------|-------|
| `EXPO_PUBLIC_SUPABASE_URL` | Database URL | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_KEY` | API Key | Supabase anon/public key |

> 💡 **Note:** These are public keys - safe to share in client apps

---

## 🆘 Still Having Issues?

1. **Delete `node_modules/` and `package-lock.json`**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Update Expo CLI**
   ```bash
   npm install -g expo-cli@latest
   ```

3. **Check Node version**
   ```bash
   node --version  # Should be v18+
   ```

---

## ✅ Success Checklist

- [ ] Node.js v18+ installed
- [ ] `.env` file exists with Supabase credentials
- [ ] Ran `npm install` successfully
- [ ] Using `npm start` (not `npm run dev`)
- [ ] QR code appears in terminal
- [ ] Expo Go app installed on phone
- [ ] Can scan QR code and see app

---

**You're all set!** The app should now run perfectly on your local machine. 🎉
