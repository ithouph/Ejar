import React from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../theme/global';

export function CategoryTabs({ categories, selectedCategory, onSelectCategory }) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsContainer}
    >
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        return (
          <Pressable
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            style={[
              styles.tab,
              {
                backgroundColor: isSelected ? theme.textPrimary : theme.surface,
              },
            ]}
          >
            <ThemedText
              type="body"
              style={[
                styles.tabText,
                {
                  color: isSelected ? theme.buttonText : theme.textPrimary,
                },
              ]}
            >
              {category.label} {category.count}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  tabText: {
    fontWeight: '600',
  },
});
