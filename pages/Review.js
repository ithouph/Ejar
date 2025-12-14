import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { StarRating } from '../components/Review';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { useAuth } from '../contexts/AuthContext';
import { reviews as reviewsApi } from '../services';

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
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [user]);

  const loadReviews = async () => {
    if (!user) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userReviews = await reviewsApi.getByUser(user.id);
      setReviews(userReviews || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="star" size={64} color={theme.textSecondary} />
        <ThemedText type="h2" style={{ marginTop: Spacing.md, color: theme.textSecondary }}>
          No Reviews Yet
        </ThemedText>
        <ThemedText type="body" style={{ marginTop: Spacing.sm, color: theme.textSecondary, textAlign: 'center' }}>
          You haven't written any reviews yet. Book a property and share your experience!
        </ThemedText>
      </View>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.loadingContainer, { paddingTop: insets.top + Spacing.xl }]}>
          <ThemedText type="h1" style={styles.title}>
            My Reviews
          </ThemedText>
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: Spacing.xl }} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={reviews}
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
        ListEmptyComponent={renderEmptyState}
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 3,
    paddingHorizontal: Spacing.lg,
  },
  loadingContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
