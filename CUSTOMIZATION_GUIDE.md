# 🎨 Easy Customization Guide

This guide shows you how to customize your TravelStay app without touching the backend code.

## 📱 Navigation Customization

### Change Tab Order or Icons
**File:** `navigation/MainTabNavigator.js`

```javascript
// TO CHANGE TAB ORDER: Just move the <Tab.Screen> blocks up or down

// TO CHANGE ICONS: Edit the "name" prop
<TabBarIcon name="home" color={color} focused={focused} />
// Change "home" to any icon from: icons.expo.fyi

// TO SHOW TEXT LABELS: Change this line
tabBarShowLabel: false,  // Change to true
```

### Change Starting Screen
**File:** `App.js`

```javascript
// Change this line to start on a different screen:
initialRouteName="Welcome"  

// Options:
// "Welcome" - Start at welcome screen (default)
// "Login" - Skip welcome, go straight to login
// "Main" - Skip login for testing (goes to main app)
```

---

## 🎨 Color Customization

### Change Brand Colors
**File:** `theme/colors.js`

```javascript
// LIGHT MODE
export const lightColors = {
  primary: '#2563EB',  // Main blue - change this!
  // ... more colors
};

// DARK MODE
export const darkColors = {
  primary: '#3B82F6',  // Lighter blue - change this!
  // ... more colors
};
```

**Quick Color Pickers:**
- https://coolors.co (generate palettes)
- https://htmlcolorcodes.com (pick colors)

### Common Color Changes

| What to Change | Edit This |
|----------------|-----------|
| Button color | `primary` |
| Background | `background` |
| Text color | `textPrimary`, `textSecondary` |
| Success/Error | `success`, `error`, `warning` |
| Tab icons | `tabIconDefault`, `tabIconSelected` |

---

## 📏 Spacing & Sizing

### Change Spacing Throughout App
**File:** `theme/global.js`

```javascript
export const Spacing = {
  xs: 4,   // Make bigger for more space
  sm: 8,   // Make smaller for less space
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};
```

### Change Rounded Corners
**File:** `theme/global.js`

```javascript
export const BorderRadius = {
  small: 8,    // Increase for more rounded
  medium: 12,  // Decrease for sharper corners
  large: 16,   // Set to 0 for square
  full: 9999,  // Always fully rounded
};
```

### Change Text Sizes
**File:** `theme/global.js`

```javascript
export const Typography = {
  display: { fontSize: 32 },  // Large welcome text
  h1: { fontSize: 24 },       // Screen titles
  h2: { fontSize: 20 },       // Section headers
  body: { fontSize: 16 },     // Normal text
  caption: { fontSize: 12 },  // Small text
};
```

---

## 🎯 Quick Customization Checklist

### ✅ Change App Colors (5 minutes)
1. Open `theme/colors.js`
2. Pick your brand color from coolors.co
3. Replace `primary` in light and dark modes
4. Save and refresh!

### ✅ Change Tab Icons (2 minutes)
1. Open `navigation/MainTabNavigator.js`
2. Find the tab you want to change
3. Replace icon name (find icons at icons.expo.fyi)
4. Save!

### ✅ Adjust Spacing (3 minutes)
1. Open `theme/global.js`
2. Change `Spacing` values (bigger = more space)
3. Save!

### ✅ Make Corners More/Less Rounded (1 minute)
1. Open `theme/global.js`
2. Change `BorderRadius` values
3. Save!

---

## 📂 File Map

| File | What it Controls |
|------|------------------|
| `theme/colors.js` | **All colors** (light/dark mode) |
| `theme/global.js` | **Spacing, sizes, rounded corners** |
| `navigation/MainTabNavigator.js` | **Bottom tabs** (order, icons, labels) |
| `App.js` | **Starting screen** (Welcome/Login/Main) |

---

## 💡 Tips

1. **Start small** - Change one thing at a time
2. **Test both modes** - Check light and dark mode
3. **Use the comments** - Each file has detailed comments
4. **Keep it consistent** - Use the same spacing/colors throughout
5. **Save often** - The app auto-refreshes when you save

---

## 🚫 What NOT to Change

- Don't edit files in `/services` (that's the backend)
- Don't touch `/config/supabase.js` (database connection)
- Don't modify `/contexts/AuthContext.js` (authentication)
- Avoid changing `/components` unless you know React Native

---

## ❓ Quick Help

**Q: How do I find icon names?**  
A: Visit icons.expo.fyi and search. All Feather icons work!

**Q: My changes aren't showing?**  
A: Save the file and wait 2-3 seconds. Expo hot-reloads automatically.

**Q: How do I reset to original?**  
A: Use Git to revert changes, or ask for the original values.

**Q: Can I add a 6th tab?**  
A: Yes! Copy any `<Tab.Screen>` block in MainTabNavigator.js and customize it.

---

## 🎨 Example: Complete Brand Change

Let's say you want a purple theme instead of blue:

1. **Change colors** (`theme/colors.js`):
   ```javascript
   primary: '#8B5CF6',  // Purple for light mode
   primary: '#A78BFA',  // Lighter purple for dark mode
   ```

2. **Done!** All buttons, links, and highlights are now purple.

---

**Need more help?** All files have detailed comments explaining every option!
