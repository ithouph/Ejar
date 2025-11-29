import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { StickyHeader } from "../components/StickyHeader";
import { HotelCard } from "../components/Card";
import { useScreenInsets } from "../hooks/useScreenInsets";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius, layoutStyles, listStyles } from "../theme/global";
import { favorites as favoritesApi } from "../services/database";

export default function Pinned({ navigation }) {
  const insets = useScreenInsets();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [pinnedProperties, setPinnedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (user) {
      loadPinned();
    } else {
      setLoading(false);
      setPinnedProperties([]);
      setFavorites([]);
    }
  }, [user]);

  const loadPinned = async () => {
    if (!user) {
      setLoading(false);
      setPinnedProperties([]);
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      const favs = await favoritesApi.getAll(user.id);
      const properties = favs.map((fav) => ({
        ...fav.properties,
        id: fav.property_id,
      }));
      setPinnedProperties(properties);
      setFavorites(properties.map((p) => p.id));
    } catch (error) {
      console.error("Error loading pinned:", error);
      Alert.alert(
        "Error Loading Pinned",
        "Unable to load your pinned properties. Please check your internet connection and try again.",
        [{ text: "OK" }]
      );
      setPinnedProperties([]);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id) => {
    const previousFavorites = [...favorites];
    const previousPinnedProperties = [...pinnedProperties];

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
      );

      setPinnedProperties((prev) => prev.filter((item) => item.id !== id));

      if (user) {
        await favoritesApi.toggle(user.id, id);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);

      setFavorites(previousFavorites);
      setPinnedProperties(previousPinnedProperties);

      Alert.alert(
        "Action Failed",
        "Unable to update favorites. Please try again.",
        [{ text: "OK" }]
      );
    }
  };



  function EmptyState() {
    return (
      <View style={[
        layoutStyles.center,
        {
          paddingTop: Spacing.xl * 2,
          paddingVertical: Spacing["3xl"],
          minHeight: 400,
        }
      ]}>
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: theme.primary + "15",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: Spacing.lg,
          }}
        >
          <Feather name="bookmark" size={64} color={theme.primary} />
        </View>
        <ThemedText type="h2" style={{ marginBottom: Spacing.sm, textAlign: "center" }}>
          No Pinned Yet
        </ThemedText>
        <ThemedText
          type="body"
          style={[{ color: theme.textSecondary, textAlign: "center", marginBottom: Spacing.lg }]}
        >
          Save your favorite properties to pin them here
        </ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={layoutStyles.container}>
      <StickyHeader
        title="Pinned"
        theme={theme}
        scrollY={scrollY}
        insets={insets}
        actionIcon="bookmark"
      />

      {loading ? (
        <View style={[layoutStyles.center, { flex: 1 }]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
          scrollEventThrottle={16}
          data={pinnedProperties}
          contentContainerStyle={{
            paddingTop: Spacing.xl * 3.5,
            paddingBottom: insets.bottom + Spacing.xl + (Spacing.tabBarHeight || 80),
          }}
          ListHeaderComponent={
            <Animated.View entering={FadeInDown.delay(100)}>
              <View
                style={[
                  layoutStyles.sectionHeader,
                  {
                    paddingHorizontal: Spacing.lg,
                    paddingVertical: Spacing.lg,
                    backgroundColor: theme.bg,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  }
                ]}
              >
                <ThemedText type="h2">
                  {`All Pinned (${pinnedProperties.length})`}
                </ThemedText>
              </View>
            </Animated.View>
          }
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 50).duration(600)}
              style={[layoutStyles.section, { paddingHorizontal: Spacing.lg }]}
            >
              <HotelCard
                item={item}
                onPress={() =>
                  navigation.navigate("Details", { property: item })
                }
                onFavoritePress={toggleFavorite}
                isFavorite={favorites.includes(item.id)}
                fullWidth
              />
            </Animated.View>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<EmptyState />}
        />
      )}
    </ThemedView>
  );
}
