import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { useAuth } from '../contexts/AuthContext';
import { Spacing, BorderRadius } from '../theme/global';
import { reviews as postReviewsApi } from '../services';

function ReviewCard({ review, theme }) {
  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Feather
            key={star}
            name="star"
            size={16}
            color={star <= rating ? '#FFD700' : theme.border}
            fill={star <= rating ? '#FFD700' : 'transparent'}
          />
        ))}
      </View>
    );
  };

  const userName = review.users?.full_name || 'Unknown User';
  const userPhoto = review.users?.photo_url || 'https://via.placeholder.com/40';
  const postTitle = review.posts?.title || 'Untitled Post';
  const postCategory = review.posts?.category?.name || (typeof review.posts?.category === 'string' ? review.posts?.category : '');

  return (
    <View style={[styles.reviewCard, { backgroundColor: theme.surface }]}>
      <View style={styles.reviewHeader}>
        <Image
          source={{ uri: userPhoto }}
          style={styles.avatar}
        />
        <View style={styles.reviewInfo}>
          <ThemedText type="bodyLarge" style={styles.userName}>
            {userName}
          </ThemedText>
          {renderStars(review.rating)}
        </View>
      </View>

      <ThemedText type="bodyLarge" style={styles.reviewTitle}>
        Review for: {postTitle}
      </ThemedText>

      {review.comment && (
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          {review.comment}
        </ThemedText>
      )}

      {postCategory && (
        <View style={styles.categoryBadge}>
          <ThemedText type="caption" style={{ color: theme.primary }}>
            {postCategory.charAt(0).toUpperCase() + postCategory.slice(1)}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

export default function Reviews() {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      setLoading(true);
      const allReviews = await postReviewsApi.getAll();
      setReviews(allReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Feather name="star" size={64} color={theme.textSecondary} />
      <ThemedText type="h3" style={{ marginTop: Spacing.lg }}>
        No Reviews Yet
      </ThemedText>
      <ThemedText
        type="body"
        style={{ color: theme.textSecondary, textAlign: 'center', marginTop: Spacing.sm }}
      >
        Reviews from users will appear here
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: Spacing.md,
          },
        ]}
      >
        <ThemedText type="h1" style={styles.title}>
          Reviews
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          See what others are saying
        </ThemedText>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={({ item }) => <ReviewCard review={item} theme={theme} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  reviewCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    gap: Spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  userName: {
    fontWeight: '600',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewTitle: {
    fontWeight: '600',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
    backgroundColor: 'rgba(22, 90, 74, 0.1)',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 3,
  },
});
