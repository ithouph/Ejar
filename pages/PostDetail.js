import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Image, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { reviews as postReviewsApi } from '../services';

export default function PostDetail({ route, navigation }) {
  const { post } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useScreenInsets();

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [post.id]);

  async function loadReviews() {
    try {
      setLoadingReviews(true);
      const data = await postReviewsApi.getForPost(post.id);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  }

  async function handleSubmitReview() {
    if (!user) {
      Alert.alert('Error', 'Please log in to leave a review');
      return;
    }

    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Error', 'Please write a comment');
      return;
    }

    try {
      setSubmitting(true);
      await postReviewsApi.add(user.id, post.id, {
        rating,
        comment: comment.trim(),
      });

      setRating(0);
      setComment('');
      loadReviews();
      Alert.alert('Success', 'Your review has been submitted!');
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function renderCategoryDetails() {
    const specs = post.specifications || {};

    switch (post.category) {
      case 'phones':
        return (
          <View style={styles.detailsSection}>
            <ThemedText type="h3" style={styles.detailsTitle}>
              Phone Specifications
            </ThemedText>
            {specs.model ? <DetailRow label="Model" value={specs.model} theme={theme} /> : null}
            {specs.battery_health ? <DetailRow label="Battery Health" value={specs.battery_health} theme={theme} /> : null}
            {specs.storage ? <DetailRow label="Storage" value={specs.storage} theme={theme} /> : null}
            {specs.color ? <DetailRow label="Color" value={specs.color} theme={theme} /> : null}
            {specs.condition ? <DetailRow label="Condition" value={specs.condition} theme={theme} /> : null}
          </View>
        );

      case 'laptops':
        return (
          <View style={styles.detailsSection}>
            <ThemedText type="h3" style={styles.detailsTitle}>
              Laptop Specifications
            </ThemedText>
            {specs.model ? <DetailRow label="Model" value={specs.model} theme={theme} /> : null}
            {specs.processor ? <DetailRow label="Processor" value={specs.processor} theme={theme} /> : null}
            {specs.ram ? <DetailRow label="RAM" value={specs.ram} theme={theme} /> : null}
            {specs.storage ? <DetailRow label="Storage" value={specs.storage} theme={theme} /> : null}
            {specs.condition ? <DetailRow label="Condition" value={specs.condition} theme={theme} /> : null}
          </View>
        );

      case 'electronics':
        return (
          <View style={styles.detailsSection}>
            <ThemedText type="h3" style={styles.detailsTitle}>
              Electronics Details
            </ThemedText>
            {specs.brand ? <DetailRow label="Brand" value={specs.brand} theme={theme} /> : null}
            {specs.warranty ? <DetailRow label="Warranty" value={specs.warranty} theme={theme} /> : null}
            {specs.condition ? <DetailRow label="Condition" value={specs.condition} theme={theme} /> : null}
          </View>
        );

      case 'cars':
        return (
          <View style={styles.detailsSection}>
            <ThemedText type="h3" style={styles.detailsTitle}>
              Car Details
            </ThemedText>
            {specs.make ? <DetailRow label="Make / Model" value={specs.make} theme={theme} /> : null}
            {specs.model ? <DetailRow label="Model Details" value={specs.model} theme={theme} /> : null}
            {specs.year ? <DetailRow label="Year" value={specs.year} theme={theme} /> : null}
            {specs.mileage ? <DetailRow label="Mileage" value={specs.mileage} theme={theme} /> : null}
            {specs.fuel_type ? <DetailRow label="Fuel Type" value={specs.fuel_type} theme={theme} /> : null}
            {specs.gear_type ? <DetailRow label="Gear Type" value={specs.gear_type} theme={theme} /> : null}
            {specs.condition ? <DetailRow label="Condition" value={specs.condition} theme={theme} /> : null}
          </View>
        );

      case 'property':
        return (
          <View style={styles.detailsSection}>
            <ThemedText type="h3" style={styles.detailsTitle}>
              Property Details
            </ThemedText>
            {specs.property_type ? <DetailRow label="Type" value={specs.property_type} theme={theme} /> : null}
            {specs.bedrooms ? <DetailRow label="Bedrooms" value={specs.bedrooms} theme={theme} /> : null}
            {specs.bathrooms ? <DetailRow label="Bathrooms" value={specs.bathrooms} theme={theme} /> : null}
            {specs.size_sqft ? <DetailRow label="Size" value={`${specs.size_sqft} sq ft`} theme={theme} /> : null}
            
            {post.listingType === 'rent' ? (
              <>
                {specs.monthly_rent ? <DetailRow label="Monthly Rent" value={`$${specs.monthly_rent}`} theme={theme} /> : null}
                {specs.deposit ? <DetailRow label="Deposit" value={`$${specs.deposit}`} theme={theme} /> : null}
                {specs.min_contract_duration ? <DetailRow label="Min Contract" value={specs.min_contract_duration} theme={theme} /> : null}
                {specs.furnished ? <DetailRow label="Furnished" value={specs.furnished} theme={theme} /> : null}
              </>
            ) : (
              <>
                {specs.sale_price ? <DetailRow label="Sale Price" value={`$${specs.sale_price}`} theme={theme} /> : null}
                {specs.ownership_type ? <DetailRow label="Ownership" value={specs.ownership_type} theme={theme} /> : null}
                {specs.property_age ? <DetailRow label="Property Age" value={specs.property_age} theme={theme} /> : null}
                {specs.payment_options ? <DetailRow label="Payment Options" value={specs.payment_options} theme={theme} /> : null}
              </>
            )}

            {specs.amenities && specs.amenities.length > 0 ? (
              <View style={{ marginTop: Spacing.sm }}>
                <ThemedText type="bodySmall" style={{ color: theme.textSecondary, marginBottom: Spacing.xs }}>
                  Amenities
                </ThemedText>
                <View style={styles.amenitiesContainer}>
                  {specs.amenities.map((amenity, index) => (
                    <View key={index} style={[styles.amenityChip, { backgroundColor: theme.primary + '20', borderColor: theme.primary }]}>
                      <ThemedText type="caption" style={{ color: theme.primary }}>
                        {amenity}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        );

      default:
        return null;
    }
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Feather name="arrow-left" size={24} color={theme.textPrimary} />
        </Pressable>
        <ThemedText type="bodyLarge" style={styles.headerTitle}>
          Post Details
        </ThemedText>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {post.images && post.images.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
            {post.images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.postImage} />
            ))}
          </ScrollView>
        ) : post.image ? (
          <Image source={{ uri: post.image }} style={styles.postImage} />
        ) : null}

        <View style={styles.contentSection}>
          <View style={styles.postHeader}>
            <Image source={{ uri: post.userPhoto }} style={styles.userPhoto} />
            <View style={{ flex: 1 }}>
              <ThemedText type="body" style={styles.userName}>
                {post.userName}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                {post.timeAgo}
              </ThemedText>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
              <ThemedText type="caption" style={{ color: theme.primary, fontWeight: '600' }}>
                {post.listingType}
              </ThemedText>
            </View>
          </View>

          <ThemedText type="h2" style={styles.title}>
            {post.title}
          </ThemedText>

          <ThemedText type="body" style={styles.description}>
            {post.text}
          </ThemedText>

          {post.price ? (
            <View style={styles.priceContainer}>
              <ThemedText type="h3" style={{ color: theme.primary }}>
                ${post.price}
              </ThemedText>
            </View>
          ) : null}

          {post.location ? (
            <View style={styles.locationContainer}>
              <Feather name="map-pin" size={16} color={theme.textSecondary} />
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                {post.location}
              </ThemedText>
            </View>
          ) : null}
        </View>

        {renderCategoryDetails()}

        <View style={[styles.reviewSection, { borderTopColor: theme.border }]}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Reviews ({reviews.length})
          </ThemedText>

          {loadingReviews ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : reviews.length > 0 ? (
            reviews.map(review => (
              <View key={review.id} style={[styles.reviewCard, { backgroundColor: theme.surface }]}>
                <View style={styles.reviewHeader}>
                  <Image 
                    source={{ uri: review.users?.photo_url || 'https://via.placeholder.com/40' }} 
                    style={styles.reviewUserPhoto} 
                  />
                  <View style={{ flex: 1 }}>
                    <ThemedText type="body" style={styles.reviewUserName}>
                      {review.users?.full_name || review.users?.email || 'Anonymous'}
                    </ThemedText>
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Feather
                          key={star}
                          name="star"
                          size={14}
                          color={star <= review.rating ? '#FFD700' : theme.border}
                          fill={star <= review.rating ? '#FFD700' : 'transparent'}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <ThemedText type="body" style={styles.reviewComment}>
                  {review.comment}
                </ThemedText>
              </View>
            ))
          ) : (
            <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: 'center', marginVertical: Spacing.lg }}>
              No reviews yet. Be the first to review!
            </ThemedText>
          )}
        </View>

        <View style={[styles.addReviewSection, { backgroundColor: theme.surface }]}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Leave a Review
          </ThemedText>

          <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
            Rating
          </ThemedText>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <Pressable key={star} onPress={() => setRating(star)} style={styles.starButton}>
                <Feather
                  name="star"
                  size={32}
                  color={star <= rating ? '#FFD700' : theme.border}
                  fill={star <= rating ? '#FFD700' : 'transparent'}
                />
              </Pressable>
            ))}
          </View>

          <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
            Comment
          </ThemedText>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Share your experience..."
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={4}
            style={[
              styles.textArea,
              {
                backgroundColor: theme.background,
                color: theme.textPrimary,
                borderColor: theme.border,
              }
            ]}
          />

          <Pressable
            onPress={handleSubmitReview}
            disabled={submitting}
            style={[styles.submitButton, { backgroundColor: theme.primary }]}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <ThemedText type="body" style={{ color: '#FFF', fontWeight: '600' }}>
                Submit Review
              </ThemedText>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function DetailRow({ label, value, theme }) {
  return (
    <View style={styles.detailRow}>
      <ThemedText type="bodySmall" style={{ color: theme.textSecondary, flex: 1 }}>
        {label}
      </ThemedText>
      <ThemedText type="body" style={{ fontWeight: '500', flex: 2 }}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    width: 40,
  },
  headerTitle: {
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    gap: Spacing.lg,
  },
  imageGallery: {
    maxHeight: 300,
  },
  postImage: {
    width: 300,
    height: 300,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.medium,
  },
  contentSection: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  userPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userName: {
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
  title: {
    fontWeight: '700',
  },
  description: {
    lineHeight: 24,
  },
  priceContainer: {
    paddingVertical: Spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailsSection: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  detailsTitle: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  amenityChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
  },
  reviewSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  reviewCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    gap: Spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reviewUserPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewUserName: {
    fontWeight: '600',
  },
  starsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  reviewComment: {
    lineHeight: 20,
  },
  addReviewSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.medium,
    gap: Spacing.md,
  },
  label: {
    fontWeight: '500',
    marginTop: Spacing.sm,
  },
  starButton: {
    padding: Spacing.xs,
  },
  textArea: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
});
