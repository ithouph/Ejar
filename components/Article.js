import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../theme/global';

export function PropertySpecs({ beds, baths, sqft }) {
  const { theme } = useTheme();

  const specs = [
    { icon: 'home', label: `${beds} Beds` },
    { icon: 'droplet', label: `${baths} Bath` },
    { icon: 'maximize', label: `${sqft} sqft` },
  ];

  return (
    <View style={styles.container}>
      {specs.map((spec, index) => (
        <View key={index} style={styles.spec}>
          <Feather name={spec.icon} size={20} color={theme.textSecondary} />
          <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
            {spec.label}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

export function AmenitiesSection({ amenities }) {
  const { theme } = useTheme();
  const displayAmenities = amenities.slice(0, 2);
  const remaining = amenities.length - 2;

  return (
    <View style={styles.amenitiesContainer}>
      <ThemedText type="h2" style={styles.title}>
        Amenities
      </ThemedText>
      <View style={styles.amenitiesGrid}>
        <View style={[styles.amenityChip, { backgroundColor: theme.surface }]}>
          <Feather name="wifi" size={20} color={theme.textPrimary} />
          <ThemedText type="bodySmall">Wi-Fi</ThemedText>
        </View>
        <View style={[styles.amenityChip, { backgroundColor: theme.surface }]}>
          <Feather name="wind" size={20} color={theme.textPrimary} />
          <ThemedText type="bodySmall">Air conditioning</ThemedText>
        </View>
        {remaining > 0 && (
          <View style={[styles.amenityChip, { backgroundColor: theme.surface }]}>
            <ThemedText type="bodySmall" style={{ color: theme.primary }}>
              +{remaining} more
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  spec: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  amenitiesContainer: {
    paddingVertical: Spacing.md,
  },
  title: {
    marginBottom: Spacing.md,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
});
