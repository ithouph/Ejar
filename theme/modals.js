import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from './global';

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
