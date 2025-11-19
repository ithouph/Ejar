import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from './global';

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
