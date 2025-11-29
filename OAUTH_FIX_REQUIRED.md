# 🚨 CRITICAL: OAuth Configuration Update Required

## The Problem

Your bundle identifier changed from `com.Ejar.app` to `com.ejar.app`, but Google Cloud Console and Supabase still have the old identifier. This **WILL cause OAuth redirect errors** until you update both platforms.

## ✅ Already Fixed (By Agent)

- ✅ `app.json` - Bundle identifiers updated to `com.ejar.app`
- ✅ `services/authService.js` - Redirect URI updated to `com.ejar.app://auth/callback`
- ✅ `GOOGLE_AUTH_SETUP.md` - Documentation updated

## ❌ Manual Updates Required (By You)

### Step 1: Update Google Cloud Console

You need to **recreate** your OAuth client IDs with the new bundle identifier:

#### A. Delete Old iOS OAuth Client (Optional but Recommended)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find the iOS client with bundle ID `com.Ejar.app`
4. Click the trash icon to delete it

#### B. Create New iOS OAuth Client
1. Click **Create Credentials** → **OAuth client ID**
2. Select **iOS** as application type
3. Fill in:
   - **Name**: Ejar iOS
   - **Bundle ID**: `com.ejar.app` ← **NEW IDENTIFIER**
4. Click **Create**
5. **COPY THE NEW iOS CLIENT ID** - you'll paste this into Supabase

#### C. Delete Old Android OAuth Client (Optional but Recommended)
1. Find the Android client with package name `com.Ejar.app`
2. Click the trash icon to delete it

#### D. Create New Android OAuth Client
1. Click **Create Credentials** → **OAuth client ID**
2. Select **Android** as application type
3. Fill in:
   - **Name**: Ejar Android
   - **Package name**: `com.ejar.app` ← **NEW IDENTIFIER**
   - **SHA-1 certificate fingerprint**: Use the SAME fingerprint as before
     ```bash
     # Get SHA-1 (macOS/Linux):
     keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey -storepass android -keypass android | grep SHA1
     
     # Get SHA-1 (Windows):
     keytool -keystore %USERPROFILE%\.android\debug.keystore -list -v -alias androiddebugkey -storepass android -keypass android | findstr SHA1
     ```
4. Click **Create**
5. **COPY THE NEW ANDROID CLIENT ID** - you'll paste this into Supabase

#### E. Verify Web OAuth Client (Should NOT Change)
1. Find your Web OAuth client
2. Verify **Authorized redirect URIs** includes:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
3. This should NOT have changed - keep it as is
4. If you don't have a web client, follow Part 2E in `GOOGLE_AUTH_SETUP.md`

---

### Step 2: Update Supabase Dashboard

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Ejar project
3. Navigate to **Authentication** → **Providers** → **Google**

#### Update These Fields:

**Main OAuth Credentials (should already be set):**
- ✅ **Client ID (for OAuth)**: Keep your Web Client ID
- ✅ **Client Secret (for OAuth)**: Keep your Web Client Secret

**Additional Client IDs (MUST BE UPDATED):**
- 🔴 **iOS Client ID**: Paste the **NEW iOS Client ID** from Step 1B
- 🔴 **Android Client ID**: Paste the **NEW Android Client ID** from Step 1D

**Authorized Client IDs:**
- 🔴 Add all three Client IDs (iOS, Android, Web) separated by commas
- Make sure you're using the **NEW** iOS and Android IDs

**Redirect URLs (CRITICAL - MUST BE UPDATED):**
- 🔴 Change from: `com.Ejar.app://auth/callback`
- 🔴 Change to: `com.ejar.app://auth/callback` ← **NEW REDIRECT URI**

4. Click **Save**
5. **WAIT 5-10 MINUTES** for changes to propagate

---

## Testing After Updates

### Test on iOS:
1. Open Expo Go on your iPhone
2. Scan the QR code from terminal
3. Navigate to Login screen
4. Tap "Sign up with Google"
5. **Expected**: Google sign-in page opens
6. **Expected**: After login, redirects back to Ejar successfully
7. **Error means**: Redirect URI still not configured correctly

### Test on Android:
1. Open Expo Go on your Android device
2. Scan the QR code from terminal
3. Navigate to Login screen
4. Tap "Sign up with Google"
5. **Expected**: Google sign-in page opens
6. **Expected**: After login, redirects back to Ejar successfully
7. **Error means**: Package name or SHA-1 not configured correctly

---

## Common Errors After Bundle ID Change

### ❌ "Invalid Redirect URI" Error
**Cause**: Supabase still has `com.Ejar.app://auth/callback`  
**Fix**: Update Redirect URLs in Supabase to `com.ejar.app://auth/callback`

### ❌ "Client ID Not Found" Error
**Cause**: Using old iOS/Android Client IDs with new bundle identifier  
**Fix**: Recreate OAuth clients in Google Cloud Console with new bundle ID

### ❌ "Sign In Failed" Error
**Cause**: Client IDs not updated in Supabase  
**Fix**: Paste new iOS and Android Client IDs into Supabase Additional Client IDs

### ❌ Authentication works but shows wrong app name
**Cause**: OAuth consent screen still says "Ejar"  
**Fix**: Google Cloud Console → OAuth consent screen → Change app name to "Ejar"

---

## Quick Checklist

Before testing Google OAuth, verify:

- [ ] Created NEW iOS OAuth client with bundle ID `com.ejar.app`
- [ ] Created NEW Android OAuth client with package `com.ejar.app`
- [ ] Web OAuth client still has Supabase callback URL
- [ ] Updated iOS Client ID in Supabase (Additional Client IDs)
- [ ] Updated Android Client ID in Supabase (Additional Client IDs)
- [ ] Updated all three in "Authorized Client IDs" in Supabase
- [ ] Changed Redirect URLs to `com.ejar.app://auth/callback` in Supabase
- [ ] Clicked "Save" in Supabase
- [ ] Waited 5-10 minutes for changes to propagate
- [ ] Restarted the Expo app

---

## Summary

**What Changed:**
- Bundle identifier: `com.Ejar.app` → `com.ejar.app`
- Redirect URI: `com.Ejar.app://auth/callback` → `com.ejar.app://auth/callback`

**What You Must Do:**
1. Recreate iOS and Android OAuth clients in Google Cloud Console
2. Update Supabase with new Client IDs and Redirect URL
3. Wait and test

**Expected Time:** 10-15 minutes + 5-10 minutes propagation delay

---

## Need Help?

If you're still getting errors after following these steps:
1. Double-check every field has the NEW bundle identifier
2. Make sure you waited at least 5 minutes after saving in Supabase
3. Try clearing the Expo Go cache and reopening the app
4. Check the Supabase logs for specific error messages
5. Verify the Web OAuth client has the Supabase callback URL
