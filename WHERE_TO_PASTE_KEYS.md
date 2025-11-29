# 🔑 Where to Paste Your Google OAuth Keys

## You'll Get 2 Keys from Google Cloud Console:

When you create OAuth clients in Google Cloud Console, you'll get:

1. **iOS Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
2. **Android Client ID** (looks like: `987654321-xyz789.apps.googleusercontent.com`)

---

## 📍 Paste Them in Supabase Dashboard

### Step-by-Step:

**1. Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard
   - Select your Ejar project
   - Click **"Authentication"** in left sidebar
   - Click **"Providers"**
   - Find **"Google"** and click it

**2. You'll see a form with several fields:**

```
┌─────────────────────────────────────────────┐
│ Google                                      │
├─────────────────────────────────────────────┤
│                                             │
│ ✅ Enabled  [Toggle Switch]                │
│                                             │
│ Client ID (for OAuth)                       │
│ [Your Web Client ID - KEEP AS IS]          │
│                                             │
│ Client Secret (for OAuth)                   │
│ [Your Web Client Secret - KEEP AS IS]      │
│                                             │
│ Authorized Client IDs                       │
│ ┌─────────────────────────────────────┐    │
│ │ PASTE BOTH IDS HERE ⬅️              │    │
│ │ Separated by comma                  │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ Redirect URLs                               │
│ ┌─────────────────────────────────────┐    │
│ │ com.ejar.app://auth/callback ⬅️     │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ [Skip if null] [✓]                         │
│                                             │
│         [Cancel]  [Save] ⬅️ CLICK THIS     │
└─────────────────────────────────────────────┘
```

---

## ✍️ Exactly What to Type:

### In "Authorized Client IDs" field, paste:
```
YOUR_IOS_CLIENT_ID.apps.googleusercontent.com,YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com
```

**Example:**
```
123456789-abc123.apps.googleusercontent.com,987654321-xyz789.apps.googleusercontent.com
```

⚠️ **Important:** 
- Use a **comma** to separate them (no spaces)
- Include the full Client ID including `.apps.googleusercontent.com`

---

### In "Redirect URLs" field, type:
```
com.ejar.app://auth/callback
```

⚠️ **Important:**
- Type this **exactly** as shown
- Remove any old URLs with `com.Ejarstay.app` if they exist

---

## 🎯 Quick Copy-Paste Format:

**When you get your keys from Google, they'll look like this:**

```
iOS Client ID: 123456789-abc123.apps.googleusercontent.com
Android Client ID: 987654321-xyz789.apps.googleusercontent.com
```

**Create your paste string by combining them:**
```
123456789-abc123.apps.googleusercontent.com,987654321-xyz789.apps.googleusercontent.com
```

**Then paste this string into the "Authorized Client IDs" field in Supabase.**

---

## ✅ Final Checklist:

Before clicking Save:

- [ ] "Authorized Client IDs" has BOTH iOS and Android Client IDs (separated by comma)
- [ ] "Redirect URLs" says `com.ejar.app://auth/callback`
- [ ] NO old `com.Ejarstay.app` URLs remain
- [ ] Click "Save" button
- [ ] Wait 5 minutes for changes to propagate

---

## 🚫 Common Mistakes:

❌ **Don't paste in "Client ID (for OAuth)"** - That's for Web only, leave it as is  
❌ **Don't add spaces** - Use comma only: `id1,id2` not `id1, id2`  
❌ **Don't forget the comma** - Both IDs must be separated  
❌ **Don't use the old bundle ID** - Must be `com.ejar.app` not `com.Ejarstay.app`

---

## ✅ After Saving:

1. **Wait 5 minutes** (important!)
2. **Restart your Expo app** (shake device → reload)
3. **Test "Sign up with Google"**
4. **Should work!** ✅

---

## 🆘 Still Confused?

The keys go in **ONE place only**:
- **Supabase Dashboard** → **Authentication** → **Providers** → **Google** → **"Authorized Client IDs"**

That's it! Just paste both Client IDs separated by a comma, then click Save.
