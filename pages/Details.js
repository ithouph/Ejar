import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { Button } from "../components/Button";
import { AgentCard } from "../components/Renter";
import { PropertySpecs, AmenitiesSection } from "../components/Article";
import { StarRating } from "../components/Review";
import { useTheme } from "../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacing, BorderRadius, Shadows } from "../theme/global";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Details({ route, navigation }) {
  const { property } = route.params;
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <FlatList
            data={
              property.photos || [{ url: property.image, category: "Main" }]
            }
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
              );
              setCurrentImageIndex(index);
            }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => navigation.navigate("Poster", { property })}
              >
                <Image source={{ uri: item.url }} style={styles.image} />
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { top: insets.top + Spacing.md }]}
          >
            <Feather name="arrow-left" size={24} color="#FFF" />
          </Pressable>

          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.closeButton, { top: insets.top + Spacing.md }]}
          >
            <Feather name="x" size={24} color="#FFF" />
          </Pressable>

          <Pressable
            style={[styles.favoriteButton, { top: insets.top + Spacing.md }]}
          >
            <Feather name="heart" size={24} color="#FFF" />
          </Pressable>

          <View style={styles.paginationDots}>
            {(property.photos || [{ url: property.image }]).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === currentImageIndex
                        ? "#FFF"
                        : "rgba(255,255,255,0.5)",
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <View style={[styles.badge, { backgroundColor: theme.primary }]}>
            <ThemedText type="caption" lightColor="#FFF" darkColor="#FFF">
              {property.type}
            </ThemedText>
          </View>

          <ThemedText type="h1" style={styles.name}>
            {property.name}
          </ThemedText>

          <View style={styles.locationRow}>
            <Feather name="map-pin" size={16} color={theme.textSecondary} />
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              {property.location}
            </ThemedText>
          </View>

          <View style={styles.ratingRow}>
            <StarRating rating={Math.floor(property.rating)} size={16} />
            <ThemedText type="body" style={styles.ratingText}>
              {property.rating}
            </ThemedText>
            <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
              ({property.reviews} reviews)
            </ThemedText>
          </View>

          <PropertySpecs
            beds={property.beds}
            baths={property.baths}
            sqft={property.sqft}
          />

          <AgentCard
            agent={property.agent}
            onMessage={() => {}}
            onCall={() => {}}
          />

          <AmenitiesSection amenities={property.amenities} />

          <View style={styles.aboutSection}>
            <ThemedText type="h2" style={styles.sectionTitle}>
              Overview
            </ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              {property.description}
            </ThemedText>
          </View>

          {property.photos && property.photos.length > 0 && (
            <View style={styles.photosSection}>
              <ThemedText type="h2" style={styles.sectionTitle}>
                Photos
              </ThemedText>
              <View style={styles.photosGrid}>
                {property.photos.slice(0, 4).map((photo, index) => (
                  <Pressable
                    key={index}
                    onPress={() => navigation.navigate("Poster", { property })}
                  >
                    <Image
                      source={{ uri: photo.url }}
                      style={styles.thumbnail}
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.backgroundRoot,
            paddingBottom: insets.bottom + Spacing.md,
          },
          Shadows.medium,
        ]}
      >
        <View>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            Price
          </ThemedText>
          <ThemedText type="h1" style={{ color: theme.primary }}>
            ${property.price}/{property.priceUnit}
          </ThemedText>
        </View>
        <Button
          onPress={() => navigation.navigate("Feedback")}
          style={styles.bookButton}
        >
          Book
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 350,
    position: "relative",
  },
  image: {
    width: SCREEN_WIDTH,
    height: 350,
  },
  backButton: {
    position: "absolute",
    left: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    right: 60,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButton: {
    position: "absolute",
    right: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  paginationDots: {
    position: "absolute",
    bottom: Spacing.lg,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  name: {
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  ratingText: {
    fontWeight: "600",
  },
  aboutSection: {
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontWeight: "600",
  },
  photosSection: {
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  thumbnail: {
    width: (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.sm) / 2,
    height: 120,
    borderRadius: BorderRadius.medium,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  bookButton: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
});
