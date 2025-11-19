import { StyleSheet } from 'react-native';

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  inputHeight: 48,
  buttonHeight: 56,
  tabBarHeight: 60,
};

export const BorderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 32,
    fontWeight: '700',
  },
  h1: {
    fontSize: 24,
    fontWeight: '700',
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
  },
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 4,
    elevation: 3,
  },
};

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
    borderRadius: BorderRadius.full,
  },
});

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

export const spacingStyles = StyleSheet.create({
  p0: { padding: 0 },
  pXs: { padding: Spacing.xs },
  pSm: { padding: Spacing.sm },
  pMd: { padding: Spacing.md },
  pLg: { padding: Spacing.lg },
  pXl: { padding: Spacing.xl },
  p2xl: { padding: Spacing['2xl'] },
  p3xl: { padding: Spacing['3xl'] },
  
  pt0: { paddingTop: 0 },
  ptXs: { paddingTop: Spacing.xs },
  ptSm: { paddingTop: Spacing.sm },
  ptMd: { paddingTop: Spacing.md },
  ptLg: { paddingTop: Spacing.lg },
  ptXl: { paddingTop: Spacing.xl },
  pt2xl: { paddingTop: Spacing['2xl'] },
  
  pb0: { paddingBottom: 0 },
  pbXs: { paddingBottom: Spacing.xs },
  pbSm: { paddingBottom: Spacing.sm },
  pbMd: { paddingBottom: Spacing.md },
  pbLg: { paddingBottom: Spacing.lg },
  pbXl: { paddingBottom: Spacing.xl },
  pb2xl: { paddingBottom: Spacing['2xl'] },
  
  pl0: { paddingLeft: 0 },
  plXs: { paddingLeft: Spacing.xs },
  plSm: { paddingLeft: Spacing.sm },
  plMd: { paddingLeft: Spacing.md },
  plLg: { paddingLeft: Spacing.lg },
  plXl: { paddingLeft: Spacing.xl },
  
  pr0: { paddingRight: 0 },
  prXs: { paddingRight: Spacing.xs },
  prSm: { paddingRight: Spacing.sm },
  prMd: { paddingRight: Spacing.md },
  prLg: { paddingRight: Spacing.lg },
  prXl: { paddingRight: Spacing.xl },
  
  px0: { paddingHorizontal: 0 },
  pxXs: { paddingHorizontal: Spacing.xs },
  pxSm: { paddingHorizontal: Spacing.sm },
  pxMd: { paddingHorizontal: Spacing.md },
  pxLg: { paddingHorizontal: Spacing.lg },
  pxXl: { paddingHorizontal: Spacing.xl },
  
  py0: { paddingVertical: 0 },
  pyXs: { paddingVertical: Spacing.xs },
  pySm: { paddingVertical: Spacing.sm },
  pyMd: { paddingVertical: Spacing.md },
  pyLg: { paddingVertical: Spacing.lg },
  pyXl: { paddingVertical: Spacing.xl },
  
  m0: { margin: 0 },
  mXs: { margin: Spacing.xs },
  mSm: { margin: Spacing.sm },
  mMd: { margin: Spacing.md },
  mLg: { margin: Spacing.lg },
  mXl: { margin: Spacing.xl },
  
  mt0: { marginTop: 0 },
  mtXs: { marginTop: Spacing.xs },
  mtSm: { marginTop: Spacing.sm },
  mtMd: { marginTop: Spacing.md },
  mtLg: { marginTop: Spacing.lg },
  mtXl: { marginTop: Spacing.xl },
  
  mb0: { marginBottom: 0 },
  mbXs: { marginBottom: Spacing.xs },
  mbSm: { marginBottom: Spacing.sm },
  mbMd: { marginBottom: Spacing.md },
  mbLg: { marginBottom: Spacing.lg },
  mbXl: { marginBottom: Spacing.xl },
  
  ml0: { marginLeft: 0 },
  mlXs: { marginLeft: Spacing.xs },
  mlSm: { marginLeft: Spacing.sm },
  mlMd: { marginLeft: Spacing.md },
  mlLg: { marginLeft: Spacing.lg },
  mlXl: { marginLeft: Spacing.xl },
  
  mr0: { marginRight: 0 },
  mrXs: { marginRight: Spacing.xs },
  mrSm: { marginRight: Spacing.sm },
  mrMd: { marginRight: Spacing.md },
  mrLg: { marginRight: Spacing.lg },
  mrXl: { marginRight: Spacing.xl },
  
  mx0: { marginHorizontal: 0 },
  mxXs: { marginHorizontal: Spacing.xs },
  mxSm: { marginHorizontal: Spacing.sm },
  mxMd: { marginHorizontal: Spacing.md },
  mxLg: { marginHorizontal: Spacing.lg },
  mxXl: { marginHorizontal: Spacing.xl },
  
  my0: { marginVertical: 0 },
  myXs: { marginVertical: Spacing.xs },
  mySm: { marginVertical: Spacing.sm },
  myMd: { marginVertical: Spacing.md },
  myLg: { marginVertical: Spacing.lg },
  myXl: { marginVertical: Spacing.xl },
  
  gapXs: { gap: Spacing.xs },
  gapSm: { gap: Spacing.sm },
  gapMd: { gap: Spacing.md },
  gapLg: { gap: Spacing.lg },
  gapXl: { gap: Spacing.xl },
  gap2xl: { gap: Spacing['2xl'] },
});

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
