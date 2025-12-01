import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { StickyHeader } from "../components/StickyHeader";
import { CategoryTabs } from "../components/Filters";
import { HotelCard } from "../components/Card";
import { SearchOverlay } from "../components/SearchOverlay";
import { useTheme } from "../hooks/useTheme";
import { useScreenInsets } from "../hooks/useScreenInsets";
import { useAuth } from "../contexts/AuthContext";
import {
  Spacing,
  layoutStyles,
  inputStyles,
  spacingStyles,
  listStyles,
  BorderRadius,
} from "../theme";
import {
  posts as postsApi,
  savedPosts as savedPostsApi,
} from "../services/database";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "property", label: "Property" },
  { id: "phones", label: "Phones" },
  { id: "electronics", label: "Electronics" },
  { id: "others", label: "Others" },
];

const AMENITIES_OPTIONS = [
  { id: "Wi-Fi", label: "Wi-Fi", icon: "wifi" },
  { id: "Air Conditioning", label: "Air conditioning", icon: "wind" },
  { id: "Pool", label: "Pool", icon: "droplet" },
  { id: "Parking", label: "Parking", icon: "truck" },
  { id: "Gym", label: "Gym", icon: "activity" },
  { id: "Kitchen", label: "Kitchen", icon: "coffee" },
];

export default function Discover({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  // Animated values for search overlay
  const searchContentOpacity = useSharedValue(0);
  const mainContentOpacity = useSharedValue(1);

  useEffect(() => {
    loadData();
  }, [user, selectedCategory, priceRange, selectedRating, searchQuery]);

  // Handle search state changes
  useEffect(() => {
    if (isSearching) {
      searchContentOpacity.value = withTiming(1, { duration: 300 });
      mainContentOpacity.value = withTiming(0, { duration: 300 });
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      searchContentOpacity.value = withTiming(0, { duration: 300 });
      mainContentOpacity.value = withTiming(1, { duration: 300 });
      searchInputRef.current?.blur();
    }
  }, [isSearching]);

  // Animated styles
  const searchContentAnimatedStyle = useAnimatedStyle(() => ({
    pointerEvents: isSearching ? "auto" : "none",
    zIndex: isSearching ? 100 : -1,
  }));

  const mainContentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: mainContentOpacity.value,
    pointerEvents: isSearching ? "none" : "auto",
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: searchContentOpacity.value,
    transform: [{ translateX: interpolate(searchContentOpacity.value, [0, 1], [20, 0]) }],
  }));

  const searchInputAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(searchContentOpacity.value, [0, 1], [40, 48]),
  }));

  const loadData = async () => {
    try {
      setLoading(true);
      let postsData = [];
      
      if (selectedCategory === "all") {
        postsData = await postsApi.getAllApproved();
      } else if (selectedCategory === "property") {
        postsData = await postsApi.getByCategory("property");
      } else if (selectedCategory === "phones") {
        postsData = await postsApi.getByCategory("phones");
      } else if (selectedCategory === "electronics") {
        postsData = await postsApi.getByCategory("electronics");
      } else if (selectedCategory === "others") {
        postsData = await postsApi.getAllApproved();
      }

      if (searchQuery.trim()) {
        postsData = await postsApi.search(searchQuery.trim());
      }

      setPosts(postsData || []);
      setFavorites([]);
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("Error Loading Posts", "Unable to load posts. Please try again.", [{ text: "OK" }]);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    if (selectedAmenities.length === 0) return posts;
    return posts.filter((item) =>
      selectedAmenities.every((a) => (item.amenities || []).includes(a))
    );
  };

  const toggleSaved = async (id) => {
    const previousFavorites = [...favorites];
    const wasAdding = !favorites.includes(id);

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
      );

      if (user) {
        await savedPostsApi.toggle(user.id, id);
      } else if (wasAdding) {
        setFavorites(previousFavorites);
        Alert.alert("Sign in required", "Please sign in to save posts.");
      }
    } catch (error) {
      console.error("Error toggling saved:", error);
      setFavorites(previousFavorites);
      Alert.alert("Action Failed", "Unable to save post. Please try again.");
    }
  };

  const toggleAmenity = (id) =>
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  const EmptyState = () => (
    <View style={[layoutStyles.center, { paddingVertical: Spacing["3xl"] }]}>
      <Feather name="search" size={48} color={theme.textSecondary} style={{ marginBottom: Spacing.md }} />
      <ThemedText type="h3" style={{ marginBottom: Spacing.xs, textAlign: "center" }}>
        No results found
      </ThemedText>
      <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center" }}>
        Try adjusting your search or filters
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={layoutStyles.container}>
      <StickyHeader
        title="Explore"
        theme={theme}
        scrollY={scrollY}
        insets={insets}
        actionIcon="search"
        onAction={() => setIsSearching(true)}
      />

      <View style={{ paddingTop: Spacing.md, paddingHorizontal: Spacing.lg }}>
        <CategoryTabs
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>

      {loading ? (
        <View style={[layoutStyles.center, { flex: 1 }]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
          scrollEventThrottle={16}
          data={getFilteredData()}
          contentContainerStyle={{
            paddingHorizontal: Spacing.lg,
            paddingVertical: Spacing.lg,
            paddingBottom: insets.bottom + Spacing.xl + (Spacing.tabBarHeight || 80),
          }}
          renderItem={({ item }) => (
            <View style={{ marginBottom: Spacing.lg }}>
              <HotelCard
                item={item}
                onPress={() => navigation.navigate("PostDetail", { post: item })}
                onFavoritePress={toggleSaved}
                isFavorite={favorites.includes(item.id)}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyState}
        />
      )}

      <SearchOverlay
        searchContentAnimatedStyle={searchContentAnimatedStyle}
        searchContentOpacity={searchContentOpacity}
        buttonsAnimatedStyle={buttonsAnimatedStyle}
        searchInputAnimatedStyle={searchInputAnimatedStyle}
        theme={theme}
        insets={insets}
        searchInputRef={searchInputRef}
        searchQuery={searchQuery}
        onChangeText={setSearchQuery}
        onClose={() => setIsSearching(false)}
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        amenities={AMENITIES_OPTIONS}
        selectedAmenities={selectedAmenities}
        toggleAmenity={toggleAmenity}
      />
    </ThemedView>
  );
}
