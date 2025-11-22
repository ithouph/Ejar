# 🔧 Backend Structure Guide

This guide shows you where all the backend files are and how to customize the login/authentication.

## 📁 Backend Folder Structure

```
/
├── config/
│   └── supabase.js              ✅ Supabase database connection
│
├── services/                     ✅ ALL BACKEND LOGIC HERE
│   └── database.js              📦 Unified backend service
│       ├── Auth functions       🔐 Login/logout
│       ├── User profiles        👤 Profile get/update
│       ├── Properties           🏨 Hotels and apartments
│       ├── Favorites            ❤️ Favorite properties
│       ├── Wallet               💰 Balance and transactions
│       ├── Reviews              ⭐ Property reviews
│       ├── Posts                📱 Social marketplace feed
│       ├── Balance Requests     💵 Top-up requests
│       └── Payment Requests     ✅ Member payment approvals
│
├── contexts/
│   └── AuthContext.js           🔒 Manages login state globally
│
├── pages/                        🎨 CUSTOMIZE THESE (Frontend)
│   ├── Welcome.js               - Welcome screen
│   ├── Login.js                 - Login screen (connects to authService)
│   ├── Discover.js              - Property discovery
│   ├── Saved.js                 - Saved favorites
│   └── ...more pages
│
├── theme/                        🎨 DESIGN SYSTEM
│   ├── colors.js                - All colors
│   └── global.js                - Spacing, sizes, styles
│
└── navigation/
    └── MainTabNavigator.js      📍 Bottom tabs
```

---

## 🔐 How Authentication Works

### Flow:
```
User clicks login
    ↓
Login.js calls signInWithGoogle()
    ↓
AuthContext.js receives the call
    ↓
services/authService.js connects to Supabase
    ↓
Supabase handles Google OAuth
    ↓
User is redirected back with token
    ↓
AuthContext updates user state
    ↓
App.js detects user is logged in
    ↓
Automatically shows Main app (tabs)
```

---

## ✏️ How to Customize Login Screen

### Option 1: Change the Design (Easy)
**File:** `pages/Login.js`

- Change colors, text, layout
- All the backend connections are already there
- Just modify the JSX/styles

### Option 2: Add Email/Password Login
**Step 1 - Add to authService.js:**

```javascript
// File: services/authService.js

async signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
},

async signUpWithEmail(email, password, userData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData // Additional user info
    }
  });
  if (error) throw error;
  return data;
}
```

**Step 2 - Add to AuthContext.js:**

```javascript
// File: contexts/AuthContext.js

// Add these functions inside AuthProvider:

const signInWithEmail = async (email, password) => {
  const result = await authService.signInWithEmail(email, password);
  setUser(result.user);
  setSession(result.session);
  await AsyncStorage.setItem('userSession', JSON.stringify(result.session));
  return result;
};

const signUpWithEmail = async (email, password, userData) => {
  const result = await authService.signUpWithEmail(email, password, userData);
  setUser(result.user);
  setSession(result.session);
  await AsyncStorage.setItem('userSession', JSON.stringify(result.session));
  return result;
};

// Export them:
return (
  <AuthContext.Provider value={{
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,    // Add this
    signUpWithEmail,    // Add this
    signOut,
  }}>
```

**Step 3 - Use in Login.js:**

```javascript
// File: pages/Login.js

const { signInWithEmail } = useAuth();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handleEmailLogin = async () => {
  try {
    setLoading(true);
    const result = await signInWithEmail(email, password);
    if (!result?.user) throw new Error('Login failed');
    // App.js will auto-redirect to Main
  } catch (error) {
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false);
  }
};

// Add TextInput fields:
<TextInput
  value={email}
  onChangeText={setEmail}
  placeholder="Email"
  autoCapitalize="none"
/>
<TextInput
  value={password}
  onChangeText={setPassword}
  placeholder="Password"
  secureTextEntry
/>
<Button onPress={handleEmailLogin}>Login</Button>
```

---

## 🎯 Backend Files Explained

### 1. **config/supabase.js**
- Creates the Supabase client
- Uses your API keys from Replit Secrets
- **Don't modify unless changing database**

### 2. **services/authService.js**
- All authentication functions
- Google OAuth
- Email/password (you can add)
- Session management
- **Modify this to add new login methods**

### 3. **contexts/AuthContext.js**
- Manages login state globally
- Provides `user`, `loading`, `session`
- All pages can use `useAuth()` to check if user is logged in
- **Modify this to add new auth functions**

### 4. **pages/Login.js**
- The UI for login screen
- Connects to authService
- **Customize this for your design**

### 5. **App.js**
- Routes between Login and Main app
- Checks if user is logged in
- Shows Welcome/Login when NOT logged in
- Shows Main app when logged in
- **Don't need to modify this**

---

## 🔍 Common Tasks

### Task: Add a Register Screen

1. **Create `pages/Register.js`:**
```javascript
import { useAuth } from '../contexts/AuthContext';

export default function Register({ navigation }) {
  const { signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleRegister = async () => {
    await signUpWithEmail(email, password, { name: 'User' });
  };
  
  return (
    // Your register form UI
  );
}
```

2. **Add to App.js AuthStack:**
```javascript
<Stack.Screen name="Register" component={Register} />
```

3. **Link from Login.js:**
```javascript
<Button onPress={() => navigation.navigate('Register')}>
  Create Account
</Button>
```

### Task: Add Facebook Login

1. **Add to `services/authService.js`:**
```javascript
async signInWithFacebook() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
  });
  if (error) throw error;
  return data;
}
```

2. **Add to `contexts/AuthContext.js`:**
```javascript
const signInWithFacebook = async () => {
  const result = await authService.signInWithFacebook();
  // ... same pattern as Google
};
```

3. **Use in `pages/Login.js`:**
```javascript
const { signInWithFacebook } = useAuth();
<Button onPress={signInWithFacebook}>Login with Facebook</Button>
```

---

## 📝 Quick Reference

| What You Want | File to Edit |
|---------------|-------------|
| Change login button design | `pages/Login.js` (styles) |
| Add email/password login | `services/authService.js` + `contexts/AuthContext.js` |
| Add Facebook/Apple login | `services/authService.js` |
| Check if user is logged in | Use `const { user } = useAuth()` in any page |
| Logout user | Call `signOut()` from `useAuth()` |
| Get user profile | Use `services/userService.js` |
| Change colors/spacing | `theme/colors.js` + `theme/global.js` |

---

## ✅ Current Status

- ✅ Google OAuth ready (needs Supabase setup)
- ✅ AuthContext manages login state
- ✅ App.js routes based on login status
- ✅ All backend services created
- ✅ Login screen UI ready to customize
- ❌ Email/password login (you can add)
- ❌ Register screen (you can add)

---

## 🚀 Next Steps

1. **Customize Login UI** - Edit `pages/Login.js` design
2. **Set up Supabase** - Follow `SUPABASE_SETUP_GUIDE.md`
3. **Test Google Login** - Should work after Supabase setup
4. **Add Email Login** - Follow "Option 2" above
5. **Create Register Screen** - Follow "Common Tasks" above

---

**All backend code is ready!** Just customize the UI in `pages/Login.js` and connect to your design. The routing and authentication flow now works correctly.
