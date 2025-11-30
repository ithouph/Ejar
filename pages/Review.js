import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { StarRating } from '../components/Review';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { reviewsData } from '../data/reviewsData';

function ReviewItem({ review }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.reviewCard, { backgroundColor: theme.surface }]}>
      <ThemedText type="bodyLarge" style={styles.propertyName}>
        {review.propertyName}
      </ThemedText>
      <View style={styles.ratingRow}>
        <StarRating rating={review.rating} size={16} />
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          {review.date}
        </ThemedText>
      </View>
      <ThemedText type="body" style={[styles.comment, { color: theme.textSecondary }]}>
        {review.comment}
      </ThemedText>
    </View>
  );
}

export default function Review() {
  const insets = useScreenInsets();

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={reviewsData}
        renderItem={({ item }) => <ReviewItem review={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        ListHeaderComponent={
          <ThemedText type="h1" style={styles.title}>
            My Reviews
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  title: {
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  reviewCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    gap: Spacing.md,
  },
  propertyName: {
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  comment: {
    lineHeight: 22,
  },
});
