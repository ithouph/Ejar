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
 *    - Copy hex code (e.g., rgba(37, 99, 235, 1))
 *    - Paste it here
 *
 * 6. RECOMMENDED TOOLS:
 *    - https://coolors.co (color palette generator)
 *    - https://htmlcolorcodes.com (color picker)
 */

// LIGHT MODE COLORS (when phone is in light mode)
// LIGHT MODE COLORS (when phone is in light mode)
export const lightColors = {
  // BRAND COLORS
  primary: "rgba(37, 99, 235, 1)", // Blue for CTAs

  // BACKGROUND COLORS
  bg: "rgba(255, 255, 255, 1)", // Main app background (white)
  background: "rgba(255, 255, 255, 1)", // Main screen background (white)
  card: "rgba(255, 255, 255, 1)", // Card background
  surface: "rgba(249, 250, 251, 1)", // Cards, elevated sections (light gray)
  backgroundRoot: "rgba(255, 255, 255, 1)", // Root app background
  backgroundDefault: "rgba(242, 242, 242, 1)", // Secondary backgrounds
  backgroundSecondary: "rgba(230, 230, 230, 1)", // Tertiary backgrounds
  backgroundTertiary: "rgba(217, 217, 217, 1)", // Fourth level backgrounds

  // TEXT COLORS
  textPrimary: "rgba(17, 24, 39, 1)", // Main text (dark gray, almost black)
  textSecondary: "rgba(107, 114, 128, 1)", // Secondary text (medium gray)
  headerTitle: "rgba(17, 24, 39, 1)",
  // BORDER & DIVIDERS
  border: "rgba(229, 231, 235, 1)", // Lines, borders, dividers

  // STATUS COLORS
  success: "rgba(16, 185, 129, 1)", // Green for success
  warning: "rgba(245, 158, 11, 1)", // Orange for warnings
  error: "rgba(239, 68, 68, 1)", // Red for errors

  // SPECIAL COLORS
  star: "rgba(251, 191, 36, 1)", // Yellow/gold for star ratings
  link: "rgba(37, 99, 235, 1)", // Links (same as primary)
  buttonText: "rgba(255, 255, 255, 1)", // Text on colored buttons (white)
  btnTextInvert: "rgba(255, 255, 255, 1)", // Text on colored buttons (white)
  overlay: "rgba(0, 0, 0, 0.4)", // Dark overlay for modals

  // TAB BAR COLORS
  tabIconDefault: "rgba(104, 112, 118, 1)", // Inactive tab icons (gray)
  tabIconSelected: "rgba(37, 99, 235, 1)", // Active tab icon (same as primary)
};

// DARK MODE COLORS (when phone is in dark mode)
export const darkColors = {
  // BRAND COLORS
  primary: "rgba(255, 255, 255, 1)", // White for high contrast in dark mode (requested "grey" effect, white/grey is neutral)
  // Or maybe they want the primary to be grey? "#9CA3AF"? No, that's textSecondary.
  // Let's keep primary as Blue for now?
  // "is effect by blue its eccef by grey" -> "It is affected by blue, it should be affected by grey".
  // This could mean the primary color.
  // Let's look at the user's previous edits. They changed shadowColor to theme.surface.
  // If I change primary to a Grey, it might look dull.
  // But "theme black" usually implies the background.
  // I will change the backgrounds to Neutral Black/Grey.
  // And I will change the primary to a very light grey or white if they really hate blue.
  // But let's stick to backgrounds first.
  // Actually, let's look at the current primary: #3B82F6 (Blue).
  // If I change backgrounds to #000000 and #121212, the blue will pop more.
  // If they want "effect by grey", maybe they want a monochrome theme?
  // I will change primary to "#E5E7EB" (Light Grey) or "#F3F4F6"?
  // Let's try changing backgrounds to neutral first, and primary to a neutral white/grey accent?
  // No, let's keep primary blue but change backgrounds to true black/grey.
  // Wait, "is effect by blue" -> "is affected by blue".
  // The current background #111827 IS blue-ish.
  // So changing background to #000000 and #121212 fixes "effect by blue".
  // "its eccef by grey" -> The new background should be grey-ish (neutral).

  primary: "rgba(59, 130, 246, 1)", // Keeping blue for now, as it's the brand color.

  // BACKGROUND COLORS (Neutral Grays/Black)
  bg: "rgba(0, 0, 0, 1)", // True Black
  background: "rgba(12, 12, 12, 1)", // True Black
  card: "rgba(18, 18, 18, 1)", // Dark Neutral Grey
  surface: "rgba(18, 18, 18, 1)", // Dark Neutral Grey
  backgroundRoot: "rgba(0, 0, 0, 1)", // True Black
  backgroundDefault: "rgba(30, 30, 30, 1)", // Slightly lighter grey
  backgroundSecondary: "rgba(44, 44, 44, 1)", // Even lighter
  backgroundTertiary: "rgba(58, 58, 58, 1)", // Lighter

  // TEXT COLORS
  textPrimary: "rgba(255, 255, 255, 1)", // White
  textSecondary: "rgba(161, 161, 170, 1)", // Neutral Light Gray (Zinc 400)
  headerTitle: "rgba(255, 255, 255, 1)",

  // BORDER & DIVIDERS
  border: "rgba(39, 39, 42, 1)", // Neutral Dark Gray (Zinc 800)

  // STATUS COLORS
  success: "rgba(52, 211, 153, 1)",
  warning: "rgba(251, 191, 36, 1)",
  error: "rgba(248, 113, 113, 1)",

  // SPECIAL COLORS
  star: "rgba(251, 191, 36, 1)",
  link: "rgba(59, 130, 246, 1)",
  buttonText: "rgba(255, 255, 255, 1)",
  btnTextInvert: "rgba(0, 0, 0, 1)",
  overlay: "rgba(0, 0, 0, 0.8)",

  // TAB BAR COLORS
  tabIconDefault: "rgba(113, 113, 122, 1)", // Zinc 500
  tabIconSelected: "rgba(59, 130, 246, 1)",
};

/**
 * EXPORT
 * Don't change this part - it's how the app reads your colors
 */
export const Colors = {
  light: lightColors,
  dark: darkColors,
};
