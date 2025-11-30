import React from "react";
import { StyleSheet, Pressable, Image, View, Dimensions } from "react-native";
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

export function HotelCard({
  item,
  onPress,
  onFavoritePress,
  isFavorite,
  fullWidth = false,
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  // Extract image URL (supports both single image or array)
  const imageUrl = Array.isArray(item.images) && item.images.length > 0 
    ? item.images[0] 
    : item.image_url || item.image || "https://via.placeholder.com/300";

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
      <Image source={{ uri: imageUrl }} style={styles.image} />
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
          <View style={styles.ratingRow}>
            <Feather name="tag" size={14} color="#FBBF24" />
            <ThemedText
              type="bodySmall"
              style={styles.rating}
              lightColor="#FFF"
              darkColor="#FFF"
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
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: "flex-end",
    padding: Spacing.lg,
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
});
