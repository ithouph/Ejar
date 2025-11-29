import React, { useState, useEffect } from "react";
import { FlatList, View, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { StickyHeader } from "../components/StickyHeader";
import { StarRating } from "../components/Review";
import { useTheme } from "../hooks/useTheme";
import { useScreenInsets } from "../hooks/useScreenInsets";
import { Spacing, BorderRadius, reviewPageStyles as styles } from "../theme/global";
import { useAuth } from "../contexts/AuthContext";
import { reviews as reviewsApi } from "../services/database";

function ReviewItem({ review, index }) {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(600)}
    >
      <View style={[styles.reviewCard, { backgroundColor: theme.surface }]}>
        <View style={styles.reviewHeader}>
          <View style={styles.propertyInfo}>
            <ThemedText type="bodyLarge" style={styles.propertyName} numberOfLines={1}>
              {review.propertyName}
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              {review.date}
            </ThemedText>
          </View>
          <View style={[styles.ratingBadge, { backgroundColor: theme.primary + "15" }]}>
            <Feather name="star" size={14} color={theme.primary} />
            <ThemedText type="caption" style={{ color: theme.primary, fontWeight: "700" }}>
              {review.rating.toFixed(1)}
            </ThemedText>
          </View>
        </View>
        <ThemedText
          type="body"
          style={[styles.comment, { color: theme.textSecondary }]}
        >
          {review.comment}
        </ThemedText>
      </View>
    </Animated.View>
  );
}

export default function Review({ navigation }) {
  const insets = useScreenInsets();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

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
      console.error("Error loading reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <View style={[styles.emptyIconContainer, { backgroundColor: theme.primary + "15" }]}>
            <Feather name="star" size={64} color={theme.primary} />
          </View>
          <ThemedText type="h2" style={styles.emptyTitle}>
            No Reviews Yet
          </ThemedText>
          <ThemedText type="body" style={[styles.emptyText, { color: theme.textSecondary }]}>
            You haven't written any reviews yet. Book a property and share your experience!
          </ThemedText>
        </Animated.View>
      </View>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <StickyHeader
          title="My Reviews"
          theme={theme}
          scrollY={scrollY}
          insets={insets}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StickyHeader
        title="My Reviews"
        theme={theme}
        scrollY={scrollY}
        insets={insets}
      />

      <FlatList
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        data={reviews}
        renderItem={({ item, index }) => <ReviewItem review={item} index={index} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: Spacing.xl * 3.5,
            paddingBottom: insets.bottom + Spacing.xl + (Spacing.tabBarHeight || 80),
          },
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}
