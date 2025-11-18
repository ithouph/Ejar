import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../theme/global';

export function ReservationCard({ reservation }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <Image source={{ uri: reservation.image }} style={styles.image} />
      <View style={styles.content}>
        <ThemedText type="bodyLarge" style={styles.name}>
          {reservation.name}
        </ThemedText>
        <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
          {reservation.date}
        </ThemedText>
        <ThemedText type="body" style={[styles.price, { color: theme.primary }]}>
          ${reservation.price}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  image: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  name: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  price: {
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
});
