import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useTheme } from "../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacing, BorderRadius } from "../theme/global";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function Poster({ route, navigation }) {
  const { property } = route.params;
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);

  const photos = property.photos || [{ url: property.image, category: "Main" }];

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={theme.textPrimary} />
        </Pressable>
        <ThemedText type="bodyLarge">Property Photos</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={photos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
          );
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.url }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.categoryBadge}>
              <ThemedText
                type="bodyLarge"
                lightColor="#FFF"
                darkColor="#FFF"
                style={styles.categoryText}
              >
                {item.category}
              </ThemedText>
              <ThemedText type="caption" lightColor="#FFF" darkColor="#FFF">
                Swipe
              </ThemedText>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <View
        style={[styles.paginationDots, { bottom: insets.bottom + Spacing.xl }]}
      >
        {photos.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? theme.primary : theme.border,
              },
            ]}
          />
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 120,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  image: {
    width: SCREEN_WIDTH - Spacing.xl * 2,
    height: SCREEN_HEIGHT - 200,
    borderRadius: BorderRadius.large,
  },
  categoryBadge: {
    position: "absolute",
    bottom: Spacing["3xl"],
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontWeight: "700",
  },
  paginationDots: {
    position: "absolute",
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
});
