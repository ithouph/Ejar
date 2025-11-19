import { StyleSheet } from 'react-native';
import { Spacing } from './global';

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
