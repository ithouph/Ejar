# 🔐 Google OAuth Setup Guide for Ejar

## ⚡ Quick Start (5 Minutes)

You need to update TWO external platforms because the app was rebranded from "EjarStay" to "Ejar":

---

## 📋 Step 1: Google Cloud Console (2 minutes)

### Open Google Cloud Console:
👉 **https://console.cloud.google.com/apis/credentials**

### Create iOS OAuth Client:
1. Click **"+ CREATE CREDENTIALS"** → **OAuth client ID**
2. Application type: **iOS**
3. Name: **Ejar iOS**
4. Bundle ID: **`com.ejar.app`** ⬅️ Copy this exactly
5. Click **CREATE**
6. **📋 COPY the iOS Client ID** (looks like: `123456-abc.apps.googleusercontent.com`)

### Create Android OAuth Client:
1. Click **"+ CREATE CREDENTIALS"** → **OAuth client ID**
2. Application type: **Android**
3. Name: **Ejar Android**
4. Package name: **`com.ejar.app`** ⬅️ Copy this exactly
5. SHA-1 fingerprint: Get it from terminal:
   ```bash
   # macOS/Linux:
   keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey -storepass android -keypass android | grep SHA1
   
   # Windows:
   keytool -keystore %USERPROFILE%\.android\debug.keystore -list -v -alias androiddebugkey -storepass android -keypass android | findstr SHA1
   ```
6. Click **CREATE**
7. **📋 COPY the Android Client ID**

---

## 📋 Step 2: Supabase Dashboard (3 minutes)

### Open Supabase:
👉 **https://supabase.com/dashboard/project/YOUR_PROJECT/auth/providers**

### Update Google Provider:
1. Find **Google** in the provider list
2. Click to expand it

### Paste Your Client IDs:
3. **Authorized Client IDs**: Paste BOTH Client IDs (iOS and Android) separated by comma:
   ```
   YOUR_IOS_CLIENT_ID.apps.googleusercontent.com,YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com
   ```

4. **Redirect URLs**: Update to:
   ```
   com.ejar.app://auth/callback
   ```
   ⚠️ Remove any old URLs with `com.Ejarstay.app`

5. Click **SAVE**

---

## ✅ Step 3: Test (1 minute)

### On Your Phone (Expo Go):
1. Scan the QR code in the terminal
2. Open the app
3. Tap **"Sign up with Google"**
4. ✅ **Should open Google login**
5. ✅ **Should redirect back to app after login**

### If it doesn't work:
- Wait 5 minutes (changes take time to propagate)
- Double-check the bundle ID is **exactly** `com.ejar.app`
- Make sure you pasted BOTH Client IDs in Supabase
- Verify the redirect URL is `com.ejar.app://auth/callback`

---

## 📝 Checklist

Before testing, verify you did ALL of these:

- [ ] Created iOS OAuth client with bundle ID `com.ejar.app`
- [ ] Created Android OAuth client with package `com.ejar.app`
- [ ] Copied BOTH Client IDs
- [ ] Pasted BOTH Client IDs in Supabase "Authorized Client IDs"
- [ ] Updated redirect URL to `com.ejar.app://auth/callback`
- [ ] Clicked "Save" in Supabase
- [ ] Waited 5 minutes

---

## ⏱️ Total Time: ~10 minutes

- Google Cloud Console: 2 min
- Supabase Dashboard: 3 min
- Testing: 1 min
- Waiting for propagation: 5 min

---

## 🆘 Troubleshooting

**"Invalid redirect URI"**
→ Check Supabase redirect URL is `com.ejar.app://auth/callback`

**"Sign in failed"**
→ Wait 5 more minutes, changes are still propagating

**"Client not found"**
→ Verify you pasted the Client IDs in Supabase "Authorized Client IDs"

---

## 💡 Why This Is Needed

Your app's code is **100% ready**, but Google OAuth requires:
1. OAuth clients that match your bundle ID (`com.ejar.app`)
2. Supabase configured with these Client IDs
3. Correct redirect URI configured

These are **external platforms** that require manual configuration. Once done, Google sign-in will work perfectly!

---

## ✅ After Setup

Once configured, users can:
- Sign in with Google ✅
- Access their data securely ✅
- Stay logged in across app restarts ✅
- All data saved to Supabase database ✅
