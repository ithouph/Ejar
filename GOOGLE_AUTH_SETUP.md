# Google OAuth Setup Guide for TravelStay

The app has Google OAuth authentication code ready to go. To complete the setup, you need to configure Google OAuth in your Supabase project.

## Steps to Enable Google Sign-In

### 1. Enable Google Auth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list and click on it
4. Toggle **Enable Sign in with Google** to ON

### 2. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application** as the application type
6. Add these to **Authorized redirect URIs**:
   - `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
   - For local testing: `http://localhost:8081/auth/callback`
7. Copy the **Client ID** and **Client Secret**

### 3. Configure Supabase with Google Credentials

1. Back in Supabase **Authentication** → **Providers** → **Google**
2. Paste your **Client ID** 
3. Paste your **Client Secret**
4. Add your app's redirect URL:
   - `com.travelstay.app://auth/callback`
5. Click **Save**

### 4. Test Authentication

1. Open your app in Expo Go
2. Click "Sign up with Google"
3. Complete the Google sign-in flow
4. You should be redirected back to the app after successful authentication

## Current Implementation

The app already includes:
- ✅ AuthContext for managing authentication state
- ✅ Google OAuth service with expo-auth-session
- ✅ Session persistence with AsyncStorage
- ✅ Proper redirect URI configuration
- ✅ Loading states and error handling

## Troubleshooting

### "Sign In Failed" Error
- Make sure Google provider is enabled in Supabase
- Verify Client ID and Secret are correct
- Check that redirect URIs match exactly

### Redirect Issues
- Ensure `com.travelstay.app://auth/callback` is added in both Google Console and Supabase
- The scheme `com.travelstay.app` must match in app.json

### Session Not Persisting
- This is handled automatically by AsyncStorage
- If issues persist, try clearing app data and signing in again

## Next Steps

Once authentication works, the app will:
- Store user info in Supabase `users` table
- Maintain authenticated sessions
- Enable personalized features (favorites, reviews, wallet, etc.)
