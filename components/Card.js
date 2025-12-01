import React, { useState } from "react";
import { StyleSheet, Pressable, Image, View, Dimensions, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "../theme/global";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SCREEN_WIDTH = Dimensions.get("window").width;

const springConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
};

// Category-specific detail rendering
function getSpecDetails(specs, category) {
  if (!specs) return [];
  const details = [];
  
  if (category === "phones" || specs.battery_health) {
    if (specs.battery_health) details.push(`${specs.battery_health} Battery`);
    if (specs.storage) details.push(specs.storage);
    if (specs.condition) details.push(specs.condition);
  } else if (category === "electronics" || specs.processor) {
    if (specs.processor) details.push(specs.processor);
    if (specs.ram) details.push(`${specs.ram} RAM`);
    if (specs.condition) details.push(specs.condition);
  } else if (category === "cars" || specs.year) {
    if (specs.year) details.push(specs.year);
    if (specs.mileage) details.push(specs.mileage);
    if (specs.fuel_type) details.push(specs.fuel_type);
  }
  
  return details;
}

export function HotelCard({
  item,
  onPress,
  onFavoritePress,
  isFavorite,
  fullWidth = false,
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Extract image URL (supports both single image or array)
  const imageUrl = item.image_url || (Array.isArray(item.images) && item.images.length > 0 
    ? item.images[0] 
    : item.image) || "https://images.unsplash.com/photo-1553531087-84f7ce9c763b?w=500&h=500&fit=crop";

  // Format price for display
  const priceDisplay = item.price ? `$${item.price.toLocaleString()}` : "N/A";

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        fullWidth && styles.cardFullWidth,
        animatedStyle,
        Shadows.medium,
      ]}
    >
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.image}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {imageLoading && !imageError && (
        <View style={[styles.loadingOverlay, { backgroundColor: "rgba(0,0,0,0.3)" }]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      )}
      
      {imageError && (
        <View style={[styles.loadingOverlay, { backgroundColor: theme.background }]}>
          <Feather name="image" size={48} color={theme.textSecondary} />
        </View>
      )}
      
      <View style={[styles.gradient, { backgroundColor: theme.card }]}>
        <Pressable
          onPress={() => onFavoritePress(item.id)}
          style={styles.favoriteButton}
        >
          <Feather
            name={isFavorite ? "heart" : "heart"}
            size={20}
            color={isFavorite ? theme.error : "#FFF"}
            style={{ fontWeight: isFavorite ? "bold" : "normal" }}
          />
        </Pressable>
        <View style={styles.content}>
          <ThemedText
            type="bodyLarge"
            style={styles.name}
            lightColor="#FFF"
            darkColor="#FFF"
            numberOfLines={2}
          >
            {item.title || item.name || "Listing"}
          </ThemedText>
          
          {/* Show category-specific specs */}
          {item.specifications && (
            <View style={styles.specsRow}>
              {item.specifications.battery_health && (
                <ThemedText type="bodySmall" lightColor="#FFF" darkColor="#FFF" style={styles.specText}>
                  🔋 {item.specifications.battery_health}
                </ThemedText>
              )}
              {item.specifications.storage && (
                <ThemedText type="bodySmall" lightColor="#FFF" darkColor="#FFF" style={styles.specText}>
                  💾 {item.specifications.storage}
                </ThemedText>
              )}
              {item.specifications.condition && (
                <ThemedText type="bodySmall" lightColor="#FFF" darkColor="#FFF" style={styles.specText}>
                  ✓ {item.specifications.condition}
                </ThemedText>
              )}
              {item.specifications.year && (
                <ThemedText type="bodySmall" lightColor="#FFF" darkColor="#FFF" style={styles.specText}>
                  📅 {item.specifications.year}
                </ThemedText>
              )}
            </View>
          )}
          
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={14} color="#FFF" />
            <ThemedText
              type="bodySmall"
              style={styles.location}
              lightColor="#FFF"
              darkColor="#FFF"
              numberOfLines={1}
            >
              {item.location || item.category || "Location"}
            </ThemedText>
          </View>
          <View style={[styles.ratingRow, styles.priceTag]}>
            <Feather name="tag" size={14} color="#1E40AF" />
            <ThemedText
              type="bodySmall"
              style={styles.rating}
              lightColor="#1E40AF"
              darkColor="#1E40AF"
            >
              {priceDisplay}
            </ThemedText>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.85,
    height: 280,
    borderRadius: BorderRadius.large,
    marginRight: Spacing.lg,
    overflow: "hidden",
  },
  cardFullWidth: {
    width: "100%",
    marginRight: 0,
    marginBottom: Spacing.md,
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  loadingOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
    justifyContent: "flex-end",
    padding: Spacing.lg,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  favoriteButton: {
    position: "absolute",
    top: Spacing.lg,
    right: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    gap: Spacing.xs,
  },
  name: {
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  location: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  rating: {
    fontWeight: "600",
  },
  priceTag: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.medium,
    alignSelf: "flex-start",
  },
});
