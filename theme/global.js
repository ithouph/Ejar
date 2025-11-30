import { StyleSheet } from 'react-native';

/**
 * ═══════════════════════════════════════════════════════════════════
 * SPACING CONSTANTS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Controls padding, margins, and gaps throughout the app.
 * 
 * CUSTOMIZATION:
 * - Make numbers bigger for more space
 * - Make numbers smaller for less space
 * - Keep proportional (xs < sm < md < lg < xl)
 * 
 * EXAMPLES:
 * xs: 4   - Tiny spacing between related items
 * sm: 8   - Small spacing
 * md: 12  - Medium spacing (most common)
 * lg: 16  - Large spacing between sections
 * xl: 24  - Extra large spacing
 * 2xl: 32 - Double extra large
 * 3xl: 48 - Triple extra large (screen padding)
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  
  // COMPONENT HEIGHTS
  inputHeight: 48,      // Height of text inputs
  buttonHeight: 56,     // Height of large buttons
  tabBarHeight: 60,     // Height of bottom tab bar
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * BORDER RADIUS (ROUNDED CORNERS)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * CUSTOMIZATION:
 * - Increase for more rounded corners
 * - Decrease for sharper corners
 * - Set to 0 for square corners
 * 
 * EXAMPLES:
 * small: 8    - Inputs, small buttons
 * medium: 12  - Cards, primary buttons
 * large: 16   - Modals, images
 * full: 9999  - Circles, pills (fully rounded)
 */
export const BorderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  full: 9999, // Fully rounded (circles)
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * TYPOGRAPHY (TEXT SIZES & WEIGHTS)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * CUSTOMIZATION:
 * - Change fontSize to make text bigger/smaller
 * - fontWeight options: '400' (normal), '600' (semibold), '700' (bold)
 * 
 * WHERE USED:
 * display   - Large welcome text
 * h1        - Screen titles
 * h2        - Section headers
 * bodyLarge - Property names, important text
 * body      - Normal text, descriptions
 * bodySmall - Captions, small labels
 * caption   - Timestamps, tiny text
 */
export const Typography = {
  display: {
    fontSize: 32,      // Large welcome text
    fontWeight: '700', // Bold
  },
  h1: {
    fontSize: 24,      // Screen titles
    fontWeight: '700', // Bold
  },
  h2: {
    fontSize: 20,      // Section headers
    fontWeight: '600', // Semibold
  },
  bodyLarge: {
    fontSize: 18,      // Property names
    fontWeight: '400', // Normal
  },
  body: {
    fontSize: 16,      // Normal text
    fontWeight: '400', // Normal
  },
  bodySmall: {
    fontSize: 14,      // Small text
    fontWeight: '400', // Normal
  },
  caption: {
    fontSize: 12,      // Tiny text
    fontWeight: '400', // Normal
  },
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * SHADOWS (DROP SHADOWS)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Creates depth and elevation.
 * 
 * CUSTOMIZATION:
 * - shadowOpacity: 0-1 (higher = darker shadow)
 * - shadowRadius: 0-20 (higher = more blurred)
 * - elevation: Android shadow (0-20)
 * 
 * NOTE: Shadows don't work well on all backgrounds.
 * Use sparingly for best performance.
 */
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2, // Android
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4, // Android
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 4,
    elevation: 3, // Android
  },
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * BUTTON STYLES
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Pre-made button styles used throughout the app.
 * 
 * TYPES:
 * - primary: Filled button (blue background)
 * - primaryLarge: Larger filled button
 * - secondary: Button with border
 * - outlined: Transparent with border
 * - text: No background, just text
 * - icon: Round icon button
 * - iconSmall: Smaller round icon button
 * - chip: Pill-shaped tag/filter button
 */
export const buttonStyles = StyleSheet.create({
  primary: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLarge: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  outlined: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  text: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full, // Fully rounded
  },
});

/**
 * ═══════════════════════════════════════════════════════════════════
 * INPUT STYLES (TEXT FIELDS, SEARCH BARS, ETC.)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * TYPES:
 * - input: Standard text input
 * - inputLarge: Larger text input
 * - searchInput: Search bar with icon
 * - textarea: Multi-line text input
 * - picker: Dropdown selector
 * - radio: Radio button
 * - checkbox: Checkbox
 */
export const inputStyles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 14,
  },
  input: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
    fontSize: 16,
    borderWidth: 1,
  },
  inputLarge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.medium,
    fontSize: 16,
    borderWidth: 1,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderRadius: BorderRadius.medium,
  },
  textarea: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * ═══════════════════════════════════════════════════════════════════
 * CARD STYLES (PROPERTY CARDS, PROFILE CARDS, ETC.)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Pre-made card components used throughout the app.
 * 
 * CUSTOMIZATION:
 * - Change borderRadius for sharper/rounder corners
 * - Change padding for more/less space inside cards
 */
export const cardStyles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
  },
  cardLarge: {
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
  },
  cardContent: {
    padding: Spacing.lg,
  },
  cardContentSmall: {
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  cardFooter: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardImageSmall: {
    width: '100%',
    height: 150,
  },
  cardImageLarge: {
    width: '100%',
    height: 250,
  },
  cardImageRound: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cardRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cardColumn: {
    gap: Spacing.md,
  },
});

/**
 * ═══════════════════════════════════════════════════════════════════
 * LAYOUT STYLES (CONTAINERS, ROWS, COLUMNS)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Common layout patterns used throughout the app.
 * 
 * MOST USED:
 * - container: Full screen container
 * - row: Horizontal layout
 * - rowBetween: Horizontal with space between items
 * - column: Vertical layout
 * - center: Center items
 */
export const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: Spacing.lg,
  },
  scrollContentPadded: {
    gap: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  column: {
    flexDirection: 'column',
  },
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: Spacing.md,
  },
  sectionPadded: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
});

/**
 * ═══════════════════════════════════════════════════════════════════
 * SPACING UTILITIES (PADDING & MARGIN)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Bootstrap-like spacing utilities.
 * Use these instead of creating custom styles.
 * 
 * HOW TO USE:
 * - p = padding, m = margin
 * - t = top, b = bottom, l = left, r = right
 * - x = horizontal (left + right)
 * - y = vertical (top + bottom)
 * - Xs, Sm, Md, Lg, Xl, 2xl, 3xl = size
 * 
 * EXAMPLES:
 * - pLg: Padding large (16px) on all sides
 * - mtXl: Margin top extra large (24px)
 * - pxMd: Padding horizontal medium (12px left + right)
 * - mb0: Margin bottom 0
 */
export const spacingStyles = StyleSheet.create({
  // PADDING - ALL SIDES
  p0: { padding: 0 },
  pXs: { padding: Spacing.xs },
  pSm: { padding: Spacing.sm },
  pMd: { padding: Spacing.md },
  pLg: { padding: Spacing.lg },
  pXl: { padding: Spacing.xl },
  p2xl: { padding: Spacing['2xl'] },
  p3xl: { padding: Spacing['3xl'] },
  
  // PADDING - TOP
  pt0: { paddingTop: 0 },
  ptXs: { paddingTop: Spacing.xs },
  ptSm: { paddingTop: Spacing.sm },
  ptMd: { paddingTop: Spacing.md },
  ptLg: { paddingTop: Spacing.lg },
  ptXl: { paddingTop: Spacing.xl },
  pt2xl: { paddingTop: Spacing['2xl'] },
  
  // PADDING - BOTTOM
  pb0: { paddingBottom: 0 },
  pbXs: { paddingBottom: Spacing.xs },
  pbSm: { paddingBottom: Spacing.sm },
  pbMd: { paddingBottom: Spacing.md },
  pbLg: { paddingBottom: Spacing.lg },
  pbXl: { paddingBottom: Spacing.xl },
  pb2xl: { paddingBottom: Spacing['2xl'] },
  
  // PADDING - LEFT
  pl0: { paddingLeft: 0 },
  plXs: { paddingLeft: Spacing.xs },
  plSm: { paddingLeft: Spacing.sm },
  plMd: { paddingLeft: Spacing.md },
  plLg: { paddingLeft: Spacing.lg },
  plXl: { paddingLeft: Spacing.xl },
  
  // PADDING - RIGHT
  pr0: { paddingRight: 0 },
  prXs: { paddingRight: Spacing.xs },
  prSm: { paddingRight: Spacing.sm },
  prMd: { paddingRight: Spacing.md },
  prLg: { paddingRight: Spacing.lg },
  prXl: { paddingRight: Spacing.xl },
  
  // PADDING - HORIZONTAL (left + right)
  px0: { paddingHorizontal: 0 },
  pxXs: { paddingHorizontal: Spacing.xs },
  pxSm: { paddingHorizontal: Spacing.sm },
  pxMd: { paddingHorizontal: Spacing.md },
  pxLg: { paddingHorizontal: Spacing.lg },
  pxXl: { paddingHorizontal: Spacing.xl },
  
  // PADDING - VERTICAL (top + bottom)
  py0: { paddingVertical: 0 },
  pyXs: { paddingVertical: Spacing.xs },
  pySm: { paddingVertical: Spacing.sm },
  pyMd: { paddingVertical: Spacing.md },
  pyLg: { paddingVertical: Spacing.lg },
  pyXl: { paddingVertical: Spacing.xl },
  
  // MARGIN - ALL SIDES
  m0: { margin: 0 },
  mXs: { margin: Spacing.xs },
  mSm: { margin: Spacing.sm },
  mMd: { margin: Spacing.md },
  mLg: { margin: Spacing.lg },
  mXl: { margin: Spacing.xl },
  
  // MARGIN - TOP
  mt0: { marginTop: 0 },
  mtXs: { marginTop: Spacing.xs },
  mtSm: { marginTop: Spacing.sm },
  mtMd: { marginTop: Spacing.md },
  mtLg: { marginTop: Spacing.lg },
  mtXl: { marginTop: Spacing.xl },
  
  // MARGIN - BOTTOM
  mb0: { marginBottom: 0 },
  mbXs: { marginBottom: Spacing.xs },
  mbSm: { marginBottom: Spacing.sm },
  mbMd: { marginBottom: Spacing.md },
  mbLg: { marginBottom: Spacing.lg },
  mbXl: { marginBottom: Spacing.xl },
  
  // MARGIN - LEFT
  ml0: { marginLeft: 0 },
  mlXs: { marginLeft: Spacing.xs },
  mlSm: { marginLeft: Spacing.sm },
  mlMd: { marginLeft: Spacing.md },
  mlLg: { marginLeft: Spacing.lg },
  mlXl: { marginLeft: Spacing.xl },
  
  // MARGIN - RIGHT
  mr0: { marginRight: 0 },
  mrXs: { marginRight: Spacing.xs },
  mrSm: { marginRight: Spacing.sm },
  mrMd: { marginRight: Spacing.md },
  mrLg: { marginRight: Spacing.lg },
  mrXl: { marginRight: Spacing.xl },
  
  // MARGIN - HORIZONTAL (left + right)
  mx0: { marginHorizontal: 0 },
  mxXs: { marginHorizontal: Spacing.xs },
  mxSm: { marginHorizontal: Spacing.sm },
  mxMd: { marginHorizontal: Spacing.md },
  mxLg: { marginHorizontal: Spacing.lg },
  mxXl: { marginHorizontal: Spacing.xl },
  
  // MARGIN - VERTICAL (top + bottom)
  my0: { marginVertical: 0 },
  myXs: { marginVertical: Spacing.xs },
  mySm: { marginVertical: Spacing.sm },
  myMd: { marginVertical: Spacing.md },
  myLg: { marginVertical: Spacing.lg },
  myXl: { marginVertical: Spacing.xl },
  
  // GAP (space between children)
  gapXs: { gap: Spacing.xs },
  gapSm: { gap: Spacing.sm },
  gapMd: { gap: Spacing.md },
  gapLg: { gap: Spacing.lg },
  gapXl: { gap: Spacing.xl },
  gap2xl: { gap: Spacing['2xl'] },
});

/**
 * ═══════════════════════════════════════════════════════════════════
 * MODAL STYLES (POPUPS, BOTTOM SHEETS)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Used for filters, forms, and other modal popups.
 */
export const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.large,
    borderTopRightRadius: BorderRadius.large,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  modalBody: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  modalFooter: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  modalSection: {
    gap: Spacing.md,
  },
  modalTitle: {
    fontWeight: '600',
  },
  modalSubtitle: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
});

/**
 * ═══════════════════════════════════════════════════════════════════
 * LIST STYLES (FLATLIST, SCROLLVIEW)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Used for lists of items like properties, reviews, transactions.
 */
export const listStyles = StyleSheet.create({
  listHorizontal: {
    paddingHorizontal: Spacing.lg,
  },
  listVertical: {
    gap: Spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  listItemWithBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  listItemContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  listItemImageSquare: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
});
