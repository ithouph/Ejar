/**
 * THEME COLORS
 * 
 * This file controls ALL colors in the app.
 * The app automatically switches between light and dark mode.
 * 
 * EASY CUSTOMIZATION GUIDE:
 * 
 * 1. TO CHANGE BRAND COLOR:
 *    - Edit 'primary' in both light and dark
 *    - This affects: buttons, links, active tabs, highlights
 * 
 * 2. TO CHANGE BACKGROUND COLORS:
 *    - background: Main screen background
 *    - surface: Cards and elevated elements
 *    - backgroundDefault/Secondary/Tertiary: Different shades
 * 
 * 3. TO CHANGE TEXT COLORS:
 *    - textPrimary: Main text (headlines, body)
 *    - textSecondary: Less important text (captions, labels)
 * 
 * 4. TO CUSTOMIZE ALERT COLORS:
 *    - success: Green for success messages
 *    - warning: Orange for warnings
 *    - error: Red for errors
 * 
 * 5. TO GET COLOR CODES:
 *    - Use a color picker tool online
 *    - Copy hex code (e.g., #2563EB)
 *    - Paste it here
 * 
 * 6. RECOMMENDED TOOLS:
 *    - https://coolors.co (color palette generator)
 *    - https://htmlcolorcodes.com (color picker)
 */

// LIGHT MODE COLORS (when phone is in light mode)
export const lightColors = {
  // BRAND COLORS
  primary: '#165A4A',              // Main green - buttons, links, active states
  
  // BACKGROUND COLORS
  background: '#FFFFFF',           // Main screen background (white)
  surface: '#F9FAFB',              // Cards, elevated sections (light gray)
  backgroundRoot: '#FFFFFF',       // Root app background
  backgroundDefault: '#F2F2F2',    // Secondary backgrounds
  backgroundSecondary: '#E6E6E6',  // Tertiary backgrounds
  backgroundTertiary: '#D9D9D9',   // Fourth level backgrounds
  
  // TEXT COLORS
  textPrimary: '#111827',          // Main text (dark gray, almost black)
  textSecondary: '#6B7280',        // Secondary text (medium gray)
  
  // BORDER & DIVIDERS
  border: '#E5E7EB',               // Lines, borders, dividers
  
  // STATUS COLORS
  success: '#10B981',              // Green for success
  warning: '#F59E0B',              // Orange for warnings
  error: '#EF4444',                // Red for errors
  
  // SPECIAL COLORS
  star: '#FBBF24',                 // Yellow/gold for star ratings
  link: '#165A4A',                 // Links (same as primary)
  buttonText: '#FFFFFF',           // Text on colored buttons (white)
  overlay: 'rgba(0, 0, 0, 0.4)',  // Dark overlay for modals
  
  // TAB BAR COLORS
  tabIconDefault: '#687076',       // Inactive tab icons (gray)
  tabIconSelected: '#165A4A',      // Active tab icon (same as primary)
};

// DARK MODE COLORS (when phone is in dark mode)
export const darkColors = {
  // BRAND COLORS
  primary: '#1F7A63',              // Lighter green for dark mode
  
  // BACKGROUND COLORS
  background: '#111827',           // Main screen background (dark gray)
  surface: '#1F2937',              // Cards, elevated sections (lighter dark gray)
  backgroundRoot: '#1F2123',       // Root app background
  backgroundDefault: '#2A2C2E',    // Secondary backgrounds
  backgroundSecondary: '#353739',  // Tertiary backgrounds
  backgroundTertiary: '#404244',   // Fourth level backgrounds
  
  // TEXT COLORS
  textPrimary: '#F9FAFB',          // Main text (almost white)
  textSecondary: '#9CA3AF',        // Secondary text (light gray)
  
  // BORDER & DIVIDERS
  border: '#374151',               // Lines, borders, dividers (dark gray)
  
  // STATUS COLORS
  success: '#34D399',              // Green for success (lighter than light mode)
  warning: '#FBBF24',              // Orange for warnings
  error: '#F87171',                // Red for errors (lighter than light mode)
  
  // SPECIAL COLORS
  star: '#FBBF24',                 // Yellow/gold for star ratings (same)
  link: '#1F7A63',                 // Links (same as primary)
  buttonText: '#FFFFFF',           // Text on colored buttons (white)
  overlay: 'rgba(0, 0, 0, 0.6)',  // Darker overlay for modals
  
  // TAB BAR COLORS
  tabIconDefault: '#9BA1A6',       // Inactive tab icons (light gray)
  tabIconSelected: '#1F7A63',      // Active tab icon (same as primary)
};

/**
 * EXPORT
 * Don't change this part - it's how the app reads your colors
 */
export const Colors = {
  light: lightColors,
  dark: darkColors,
};
