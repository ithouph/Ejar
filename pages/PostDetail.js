import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Image,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../contexts/AuthContext";
import { useScreenInsets } from "../hooks/useScreenInsets";
import { Spacing, BorderRadius, Shadows } from "../theme/global";
import { postReviews as postReviewsApi } from "../services/database";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function PostDetail({ route, navigation }) {
  const { post } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useScreenInsets();

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [post.id]);

  async function loadReviews() {
    try {
      setLoadingReviews(true);
      const data = await postReviewsApi.getForPost(post.id);
      setReviews(data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  }

  async function handleSubmitReview() {
    if (!user) {
      Alert.alert("Error", "Please log in to leave a review");
      return;
    }
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }
    if (!comment.trim()) {
      Alert.alert("Error", "Please write a comment");
      return;
    }
    try {
      setSubmitting(true);
      await postReviewsApi.add(user.id, post.id, {
        rating,
        comment: comment.trim(),
      });
      setRating(0);
      setComment("");
      setReviewModalVisible(false);
      loadReviews();
      Alert.alert("Success", "Your review has been submitted!");
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Helper to render a grid item
  const GridItem = ({ icon, label, value }) => (
    <View style={[styles.gridItem, { backgroundColor: theme.surface }]}>
      <Feather name={icon} size={20} color={theme.primary} />
      <ThemedText type="h3" style={{ marginTop: Spacing.xs }}>
        {value}
      </ThemedText>
      <ThemedText type="caption" style={{ color: theme.textSecondary }}>
        {label}
      </ThemedText>
    </View>
  );

  function renderCategoryGrid() {
    const specs = post.specifications || {};
    const items = [];

    switch (post.category) {
      case "property":
        if (specs.bedrooms) items.push({ icon: "layout", label: "Bedrooms", value: specs.bedrooms });
        if (specs.bathrooms) items.push({ icon: "droplet", label: "Bathrooms", value: specs.bathrooms });
        if (specs.size_sqft) items.push({ icon: "maximize", label: "Area (sqft)", value: specs.size_sqft });
        if (specs.property_type) items.push({ icon: "home", label: "Type", value: specs.property_type });
        if (specs.furnished) items.push({ icon: "coffee", label: "Furnished", value: specs.furnished });
        if (specs.property_age) items.push({ icon: "clock", label: "Built in", value: specs.property_age });
        break;
      case "cars":
        if (specs.year) items.push({ icon: "calendar", label: "Year", value: specs.year });
        if (specs.mileage) items.push({ icon: "map", label: "Mileage", value: specs.mileage });
        if (specs.gear_type) items.push({ icon: "settings", label: "Gear", value: specs.gear_type });
        if (specs.fuel_type) items.push({ icon: "zap", label: "Fuel", value: specs.fuel_type });
        if (specs.make) items.push({ icon: "truck", label: "Make", value: specs.make });
        break;
      case "phones":
      case "laptops":
      case "electronics":
        if (specs.model) items.push({ icon: "smartphone", label: "Model", value: specs.model });
        if (specs.storage) items.push({ icon: "hard-drive", label: "Storage", value: specs.storage });
        if (specs.condition) items.push({ icon: "check-circle", label: "Condition", value: specs.condition });
        if (specs.battery_health) items.push({ icon: "battery", label: "Battery", value: specs.battery_health });
        if (specs.ram) items.push({ icon: "cpu", label: "RAM", value: specs.ram });
        break;
    }

    if (items.length === 0) return null;

    return (
      <View style={styles.gridContainer}>
        <ThemedText type="h3" style={styles.sectionTitle}>
          Property Details
        </ThemedText>
        <View style={styles.grid}>
          {items.map((item, index) => (
            <GridItem key={index} {...item} />
          ))}
        </View>

        {/* Amenities Section */}
        {specs.amenities && specs.amenities.length > 0 && (
          <View style={{ marginTop: Spacing.lg }}>
            <ThemedText type="h3" style={[styles.sectionTitle, { marginBottom: Spacing.md }]}>
              Amenities
            </ThemedText>
            <View style={styles.amenitiesContainer}>
              {specs.amenities.map((amenity, index) => (
                <View
                  key={index}
                  style={[
                    styles.amenityChip,
                    {
                      backgroundColor: theme.primary + "10",
                      borderColor: theme.primary + "40",
                    },
                  ]}
                >
                  <Feather name="check" size={14} color={theme.primary} />
                  <ThemedText type="bodySmall" style={{ color: theme.primary }}>
                    {amenity}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Additional Info Section (Deposit, Warranty, etc.) */}
        <View style={{ marginTop: Spacing.lg, gap: Spacing.sm }}>
          {specs.monthly_rent && (
            <DetailRow label="Monthly Rent" value={`$${specs.monthly_rent}`} theme={theme} />
          )}
          {specs.deposit && (
            <DetailRow label="Deposit" value={`$${specs.deposit}`} theme={theme} />
          )}
          {specs.min_contract_duration && (
            <DetailRow label="Min Contract" value={specs.min_contract_duration} theme={theme} />
          )}
          {specs.warranty && (
            <DetailRow label="Warranty" value={specs.warranty} theme={theme} />
          )}
          {specs.brand && (
            <DetailRow label="Brand" value={specs.brand} theme={theme} />
          )}
        </View>
      </View>
    );
  }

  function DetailRow({ label, value, theme }) {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: Spacing.xs }}>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>{label}</ThemedText>
        <ThemedText type="body" style={{ fontWeight: "600" }}>{value}</ThemedText>
      </View>
    );
  }

  const images = post.images && post.images.length > 0 ? post.images : [post.image];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Image Section */}
        <View style={styles.imageHeader}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentImageIndex(index);
            }}
          >
            {images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.headerImage} />
            ))}
          </ScrollView>

          {/* Gradient Overlay */}
          <View style={styles.gradientOverlay} />

          {/* Top Buttons */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.iconButton, { top: insets.top + Spacing.md, left: Spacing.lg }]}
          >
            <Feather name="arrow-left" size={24} color="#FFF" />
          </Pressable>
          <Pressable
            style={[styles.iconButton, { top: insets.top + Spacing.md, right: Spacing.lg }]}
          >
            <Feather name="heart" size={24} color="#FFF" />
          </Pressable>

          {/* Overlaid Info */}
          <View style={styles.overlayInfo}>
            <View style={styles.priceTag}>
              <ThemedText type="h3" style={{ color: "#FFF" }}>
                {post.listingType === "rent" ? "Rent" : "Sell"}
              </ThemedText>
              <ThemedText type="h2" style={{ color: "#FFF", fontWeight: "700" }}>
                {post.price ? `$${post.price}` : "Contact for Price"}
                {post.listingType === "rent" && <ThemedText type="bodySmall" style={{ color: "#FFF" }}>/ Month</ThemedText>}
              </ThemedText>
            </View>
          </View>

          {/* Pagination Dots */}
          {images.length > 1 && (
            <View style={styles.pagination}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    { backgroundColor: index === currentImageIndex ? "#FFF" : "rgba(255,255,255,0.5)" }
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Content Body */}
        <View style={[styles.contentBody, { backgroundColor: theme.background }]}>
          {/* Title & Location */}
          <View style={styles.titleSection}>
            <View>
              <ThemedText type="h2" style={styles.title}>{post.title}</ThemedText>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={14} color={theme.textSecondary} />
                <ThemedText type="body" style={{ color: theme.textSecondary }}>
                  {post.location}
                </ThemedText>
              </View>
            </View>
            <View style={[styles.ratingBadge, { backgroundColor: theme.surface }]}>
              <Feather name="star" size={14} color="#FBBF24" />
              <ThemedText type="bodySmall" style={{ fontWeight: "700" }}>4.0</ThemedText>
            </View>
          </View>

          {/* Photos Preview */}
          {images.length > 0 && (
            <View style={styles.photosSection}>
              <View style={styles.sectionHeader}>
                <ThemedText type="h3">Photos</ThemedText>
                <ThemedText type="bodySmall" style={{ color: theme.primary }}>See all</ThemedText>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: Spacing.sm }}>
                {images.map((img, index) => (
                  <Image key={index} source={{ uri: img }} style={styles.thumbnail} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Grid Details */}
          {renderCategoryGrid()}

          {/* Description */}
          <View style={styles.descriptionSection}>
            <ThemedText type="body" style={{ color: theme.textSecondary, lineHeight: 24 }}>
              {post.text || post.description}
            </ThemedText>
          </View>

          {/* User Info */}
          <View style={[styles.userCard, { backgroundColor: theme.surface }]}>
            <Image source={{ uri: post.userPhoto }} style={styles.userPhoto} />
            <View style={{ flex: 1 }}>
              <ThemedText type="h3">{post.userName}</ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>Owner</ThemedText>
            </View>
            <View style={[styles.contactButton, { backgroundColor: theme.primary }]}>
              <Feather name="message-circle" size={20} color="#FFF" />
            </View>
            <View style={[styles.contactButton, { backgroundColor: theme.success }]}>
              <Feather name="phone" size={20} color="#FFF" />
            </View>
          </View>

          {/* Reviews Section */}
          <View style={styles.reviewSection}>
            <View style={styles.sectionHeader}>
              <ThemedText type="h3" style={styles.sectionTitle}>Reviews ({reviews.length})</ThemedText>
              <Pressable onPress={() => setReviewModalVisible(true)}>
                <ThemedText type="bodySmall" style={{ color: theme.primary, fontWeight: "600" }}>
                  + Add Review
                </ThemedText>
              </Pressable>
            </View>
            {reviews.length === 0 && (
              <ThemedText type="body" style={{ color: theme.textSecondary, fontStyle: "italic" }}>
                No reviews yet.
              </ThemedText>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Review Modal */}
      <Modal
        visible={reviewModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.reviewModal, { backgroundColor: theme.card }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Feather name="message-circle" size={24} color={theme.primary} />
              <ThemedText type="h2" style={{ marginTop: Spacing.sm }}>Feedback</ThemedText>
              <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.xs }}>
                Tell us how you feel about our App
              </ThemedText>
            </View>

            {/* Star Rating */}
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setRating(star)}>
                  <Feather
                    name="star"
                    size={40}
                    color={star <= rating ? "#FBBF24" : "#D1D5DB"}
                    style={{ marginHorizontal: 4 }}
                  />
                </Pressable>
              ))}
            </View>

            {/* Review Input */}
            <View style={{ marginTop: Spacing.xl }}>
              <ThemedText type="bodySmall" style={{ marginBottom: Spacing.sm, color: theme.textSecondary }}>
                Write your review
              </ThemedText>
              <TextInput
                style={[
                  styles.reviewInput,
                  {
                    backgroundColor: theme.surface,
                    color: theme.textPrimary,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Share your experience..."
                placeholderTextColor={theme.textSecondary}
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.surface }]}
                onPress={() => {
                  setReviewModalVisible(false);
                  setRating(0);
                  setComment("");
                }}
              >
                <ThemedText type="body" style={{ color: theme.textSecondary }}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={handleSubmitReview}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <ThemedText type="body" style={{ color: "#FFF", fontWeight: "600" }}>Submit</ThemedText>
                )}
              </Pressable>
            </View>

            <ThemedText type="caption" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.md }}>
              * Please submit a review to let
            </ThemedText>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageHeader: {
    height: 350,
    width: "100%",
    position: "relative",
  },
  headerImage: {
    width: SCREEN_WIDTH,
    height: 350,
    resizeMode: "cover",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  iconButton: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayInfo: {
    position: "absolute",
    bottom: 40,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  priceTag: {
    gap: Spacing.xs,
  },
  pagination: {
    position: "absolute",
    bottom: Spacing.lg,
    flexDirection: "row",
    alignSelf: "center",
    gap: 6,
  },
  dot: {
    width: 20,
    height: 4,
    borderRadius: 2,
  },
  contentBody: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: Spacing.md,
  },
  gridContainer: {
    gap: Spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  gridItem: {
    width: (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.md * 2) / 3,
    padding: Spacing.md,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: 20,
    gap: Spacing.md,
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewSection: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontWeight: "700",
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  reviewModal: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    padding: Spacing.xl,
    ...Shadows.medium,
  },
  modalHeader: {
    alignItems: "center",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
  reviewInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
    minHeight: 100,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
