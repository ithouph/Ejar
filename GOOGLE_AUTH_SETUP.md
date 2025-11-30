# Google OAuth Setup Guide for Ejar

The app has Google OAuth authentication code ready to go. To complete the setup, you need to configure Google OAuth in your Supabase project and Google Cloud Console.

## Important App Information

Your app is configured with:
- **Bundle Identifier (iOS)**: `com.ejar.app`
- **Package Name (Android)**: `com.ejar.app`
- **App Scheme**: `com.ejar.app`

---

## Part 1: Enable Google Auth in Supabase

### Step 1: Enable Google Provider

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Ejar project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list and click on it
5. Toggle **Enable Sign in with Google** to ON
6. Leave this page open - you'll return here in Part 3

---

## Part 2: Get Google OAuth Credentials

You need to create **3 separate OAuth client IDs** for iOS, Android, and Web.

### A. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown and select **New Project**
3. Name it "Ejar" (or any name you prefer)
4. Click **Create** and wait for the project to be created
5. Select your new project from the dropdown

### B. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Click **Create**
4. Fill in the required fields:
   - **App name**: Ejar
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click **Save and Continue**
6. Skip **Scopes** (click Save and Continue)
7. Click **Back to Dashboard**

### C. Create iOS OAuth Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **iOS** as the application type
4. Fill in:
   - **Name**: Ejar iOS
   - **Bundle ID**: `com.ejar.app`
5. Click **Create**
6. **Copy the iOS Client ID** - you'll need this for Supabase
7. Keep this page open in a tab

### D. Create Android OAuth Client ID

1. Go to **APIs & Services** → **Credentials** again
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Android** as the application type
4. Fill in:
   - **Name**: Ejar Android
   - **Package name**: `com.ejar.app`
   - **SHA-1 certificate fingerprint**: See instructions below

#### How to Get SHA-1 Fingerprint:

**For Development (Expo Go):**
```bash
# On macOS/Linux:
keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey -storepass android -keypass android | grep SHA1

# On Windows:
keytool -keystore %USERPROFILE%\.android\debug.keystore -list -v -alias androiddebugkey -storepass android -keypass android | findstr SHA1
```

Copy the SHA-1 fingerprint and paste it into Google Cloud Console.

**Note**: When you publish to Google Play, you'll need to get the SHA-1 from Google Play Console and add another Android OAuth client.

5. Click **Create**
6. **Copy the Android Client ID** - you'll need this for Supabase
7. Keep this page open in a tab

### E. Create Web OAuth Client ID

1. Go to **APIs & Services** → **Credentials** again
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application** as the application type
4. Fill in:
   - **Name**: Ejar Web
   - **Authorized redirect URIs**: Add these two:
     - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
     - (Replace YOUR_PROJECT_REF with your actual Supabase project reference)
5. Click **Create**
6. **Copy the Web Client ID and Client Secret** - you'll need both for Supabase

---

## Part 3: Configure Supabase with Google Credentials

1. Return to Supabase **Authentication** → **Providers** → **Google**
2. Paste your credentials:
   - **Client ID (for OAuth)**: Paste the **Web Client ID** from Part 2E
   - **Client Secret (for OAuth)**: Paste the **Web Client Secret** from Part 2E
3. Scroll down to **Additional Client IDs (for native apps)**:
   - **iOS Client ID**: Paste the iOS Client ID from Part 2C
   - **Android Client ID**: Paste the Android Client ID from Part 2D
4. **Authorized Client IDs**: Add all three Client IDs (iOS, Android, Web) separated by commas
5. **Redirect URLs**: Should already include your app scheme:
   - `com.ejar.app://auth/callback`
6. Click **Save**

---

## Part 4: Test Authentication

### On iOS (via Expo Go)

1. Make sure you've completed Parts 1-3 above
2. Open the Expo Go app on your iPhone
3. Scan the QR code from your Replit terminal
4. Wait for Ejar to load
5. On the Login screen, tap **Sign up with Google**
6. You'll be redirected to Google's sign-in page
7. Choose your Google account
8. Grant the requested permissions
9. You should be redirected back to Ejar
10. The app should show you're logged in

### On Android (via Expo Go)

1. Make sure you've completed Parts 1-3 above
2. Open the Expo Go app on your Android device
3. Scan the QR code from your Replit terminal
4. Wait for Ejar to load
5. On the Login screen, tap **Sign up with Google**
6. You'll be redirected to Google's sign-in page
7. Choose your Google account
8. Grant the requested permissions
9. You should be redirected back to Ejar
10. The app should show you're logged in

---

## Current Implementation

The Ejar app already includes:
- ✅ **AuthContext** for managing authentication state across the app
- ✅ **Google OAuth service** using expo-auth-session
- ✅ **Session persistence** with AsyncStorage (stays logged in)
- ✅ **Proper redirect URI configuration** (`com.ejar.app://auth/callback`)
- ✅ **Loading states** and error handling
- ✅ **User profile creation** in Supabase after first sign-in

---

## Troubleshooting

### Issue: "Sign In Failed" Error

**Possible Causes:**
- Google provider not enabled in Supabase
- Wrong Client ID or Client Secret
- Missing iOS/Android Client IDs

**Solutions:**
1. Go to Supabase → Authentication → Providers → Google
2. Make sure "Enable Sign in with Google" is toggled ON
3. Verify all Client IDs are correctly pasted:
   - Web Client ID + Secret (main fields)
   - iOS Client ID (Additional Client IDs section)
   - Android Client ID (Additional Client IDs section)
4. Click **Save** again

### Issue: "Invalid Redirect URI"

**Possible Causes:**
- Redirect URI mismatch between app and Supabase
- Wrong bundle identifier or package name

**Solutions:**
1. Check your `app.json`:
   - iOS Bundle ID should be: `com.ejar.app`
   - Android Package should be: `com.ejar.app`
   - Scheme should be: `com.ejar.app`
2. In Supabase, verify Redirect URL is: `com.ejar.app://auth/callback`
3. Restart your app after making changes

### Issue: Stuck on Google Sign-In Page

**Possible Causes:**
- SHA-1 fingerprint missing or incorrect (Android only)
- OAuth consent screen not properly configured

**Solutions:**
1. For Android: Verify you added the correct SHA-1 fingerprint
2. Run the keytool command again and make sure you copied the full fingerprint
3. Go to Google Cloud Console → Credentials → Edit your Android OAuth client
4. Add the correct SHA-1 fingerprint
5. Wait 5-10 minutes for changes to propagate

### Issue: "App Not Verified" Warning

**Expected Behavior:**
- During development, Google shows an "App Not Verified" warning
- This is normal and safe to bypass during testing

**How to Proceed:**
1. Click "Advanced" on the warning page
2. Click "Go to Ejar (unsafe)" - this is safe during development
3. Grant the permissions

**To Remove Warning (Optional):**
- Submit your app for Google verification (required only for production)
- Go to Google Cloud Console → OAuth consent screen → Submit for Verification

### Issue: Session Not Persisting

**Possible Causes:**
- AsyncStorage not working properly
- App cache issues

**Solutions:**
1. Close the app completely (swipe away from recent apps)
2. Reopen Expo Go
3. Clear the app's cache:
   - iOS: Delete and reinstall Expo Go
   - Android: Settings → Apps → Expo Go → Clear Cache
4. Try signing in again

### Issue: Different User Shows Up

**Cause:**
- You're logged into multiple Google accounts on your device

**Solution:**
1. Sign out from Ejar
2. When signing in again, carefully select the correct Google account
3. Or go to Google account settings and remove unused accounts

---

## Production Deployment

When you're ready to publish Ejar to the App Store and Google Play:

### For iOS:

1. Build your app with EAS Build
2. The bundle identifier `com.ejar.app` will be used
3. No changes needed to Google OAuth (same iOS Client ID works)

### For Android:

1. Build your app with EAS Build
2. Get the **production SHA-1 fingerprint** from Google Play Console
3. Go to Google Cloud Console → Credentials
4. Create a **new Android OAuth client** for production:
   - Package name: `com.ejar.app`
   - SHA-1: Production fingerprint from Google Play
5. Add this new production Client ID to Supabase (Additional Client IDs)
6. Keep the development Client ID for testing

---

## What Happens After Sign-In?

Once a user successfully signs in with Google:

1. **User Profile Created**: A record is created in Supabase `users` table
2. **Session Stored**: The session is saved to AsyncStorage (stays logged in)
3. **User Info Available**: Name, email, and profile photo are accessible
4. **Features Unlocked**:
   - Save favorite properties
   - Leave reviews and ratings
   - Manage wallet and balance
   - Create social posts
   - Plan events and weddings

---

## Need Help?

If you're still having issues:

1. Check the browser console for error messages (if testing on web)
2. Check the Expo logs in your terminal
3. Verify all steps were completed in order
4. Make sure you waited a few minutes after saving changes in Google/Supabase
5. Try signing in with a different Google account to isolate the issue

---

## Summary Checklist

Before testing, make sure you have:

- [ ] Created Google Cloud project
- [ ] Configured OAuth consent screen
- [ ] Created iOS OAuth client ID
- [ ] Created Android OAuth client ID (with SHA-1 fingerprint)
- [ ] Created Web OAuth client ID + secret
- [ ] Enabled Google provider in Supabase
- [ ] Added Web Client ID + Secret to Supabase
- [ ] Added iOS Client ID to Supabase (Additional Client IDs)
- [ ] Added Android Client ID to Supabase (Additional Client IDs)
- [ ] Added all three Client IDs to "Authorized Client IDs"
- [ ] Verified redirect URL is `com.ejar.app://auth/callback`
- [ ] Saved all changes in Supabase
- [ ] Waited 5-10 minutes for changes to propagate
- [ ] Restarted the app

Once all boxes are checked, you're ready to test!
