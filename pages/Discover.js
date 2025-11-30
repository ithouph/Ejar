import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
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
  const [collapsibleHeaderHeight, setCollapsibleHeaderHeight] = useState(0);
  const [pinnedSavedHeight, setPinnedSavedHeight] = useState(0);

  // Search State
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  // Reanimated scroll tracking
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const headerTranslateY = useSharedValue(0);

  // Animation values for fade transition
  const mainContentOpacity = useSharedValue(1);
  const searchContentOpacity = useSharedValue(0);



  useEffect(() => {
    loadData();
  }, [user, selectedCategory, priceRange, selectedRating, searchQuery]);

  // Handle fade animations when isSearching changes
  useEffect(() => {
    if (isSearching) {
      mainContentOpacity.value = withTiming(0, { duration: 300 });
      searchContentOpacity.value = withTiming(1, { duration: 300 });
      // Focus input after animation
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      mainContentOpacity.value = withTiming(1, { duration: 300 });
      searchContentOpacity.value = withTiming(0, { duration: 300 });
      searchInputRef.current?.blur();
    }
  }, [isSearching]);

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

      const favoriteIds = user ? await Promise.resolve([]) : Promise.resolve([]);

      setPosts(postsData || []);
      setFavorites(favoriteIds || []);
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert(
        "Error Loading Posts",
        "Unable to load posts. Please check your internet connection and try again.",
        [{ text: "OK" }]
      );
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
        Alert.alert(
          "Sign in required",
          "Please sign in to save posts across devices.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error toggling saved:", error);

      setFavorites(previousFavorites);

      Alert.alert(
        "Action Failed",
        wasAdding
          ? "Unable to save post. Please try again."
          : "Unable to unsave post. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const toggleAmenity = (id) =>
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  const isDefaultState = () =>
    selectedCategory === "all" &&
    !searchQuery.trim() &&
    selectedAmenities.length === 0 &&
    !selectedRating &&
    priceRange[0] === 0 &&
    priceRange[1] === 5000;

  const isFiltered = () =>
    selectedAmenities.length > 0 ||
    selectedRating ||
    priceRange[0] > 0 ||
    priceRange[1] < 5000;

  const EmptyState = () => (
    <View
      style={[
        layoutStyles.center,
        { paddingVertical: Spacing["3xl"], paddingHorizontal: Spacing.xl },
      ]}
    >
      <Feather
        name="search"
        size={48}
        color={theme.textSecondary}
        style={{ marginBottom: Spacing.md }}
      />
      <ThemedText
        type="h3"
        style={{ marginBottom: Spacing.xs, textAlign: "center" }}
      >
        No results found
      </ThemedText>
      <ThemedText
        type="body"
        style={{ color: theme.textSecondary, textAlign: "center" }}
      >
        Try adjusting your search or filters
      </ThemedText>
    </View>
  );

  const SearchBar = () => (
    <View
      style={[
        spacingStyles.pxLg,
        spacingStyles.mtSm,
      ]}
    >
      <Pressable
        onPress={() => setIsSearching(true)}
        style={[
          inputStyles.searchInput,
          {
            backgroundColor: theme.surface,
            paddingHorizontal: Spacing.md,
            paddingVertical: 0,
            height: 40,
            borderWidth: 1,
            borderColor: theme.border,
          },
        ]}
      >
        <Feather name="search" size={20} color={theme.textSecondary} />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ThemedText style={{ color: searchQuery ? theme.textPrimary : theme.textSecondary }}>
            {searchQuery || "Search..."}
          </ThemedText>
        </View>
        {searchQuery.length > 0 && (
          <Pressable onPress={(e) => {
            e.stopPropagation();
            setSearchQuery("");
          }}>
            <Feather name="x" size={20} color={theme.textSecondary} />
          </Pressable>
        )}
        <View style={{ marginLeft: Spacing.xs }}>
          <Feather name="sliders" size={20} color={theme.primary} />
        </View>
      </Pressable>
    </View>
  );

  // Scroll handler for header animation
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      const diff = currentY - lastScrollY.value;
      scrollY.value = currentY;

      const collapseThreshold = pinnedSavedHeight > 0 ? pinnedSavedHeight - collapsibleHeaderHeight : 200;

      if (currentY > collapseThreshold) {
        if (diff > 0) {
          headerTranslateY.value = withTiming(-collapsibleHeaderHeight, {
            duration: 250,
          });
        } else if (diff < 0 && currentY > collapseThreshold + 20) {
          headerTranslateY.value = withTiming(0, {
            duration: 250,
          });
        }
      } else {
        headerTranslateY.value = withTiming(0, {
          duration: 250,
        });
      }

      lastScrollY.value = currentY;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerTranslateY.value }],
      opacity: interpolate(
        headerTranslateY.value,
        [-collapsibleHeaderHeight, 0],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  const stickySearchAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        headerTranslateY.value,
        [-collapsibleHeaderHeight, 0],
        [1, 0],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(
            headerTranslateY.value,
            [-collapsibleHeaderHeight, 0],
            [0, -20],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const mainContentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: mainContentOpacity.value,
      pointerEvents: isSearching ? "none" : "auto",
    };
  });

  const searchContentAnimatedStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: isSearching ? "auto" : "none",
      zIndex: isSearching ? 100 : -1,
    };
  });

  // Animation for the search input expansion
  const searchInputAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(searchContentOpacity.value, [0, 1], [40, 48]),
      // No scale change, just height expansion
    };
  });

  // Animation for the buttons sliding in
  const buttonsAnimatedStyle = useAnimatedStyle(() => {
    const translate = interpolate(searchContentOpacity.value, [0, 1], [20, 0]);
    return {
      opacity: searchContentOpacity.value,
      transform: [{ translateX: 0 }], // Simplified for stability, opacity handles visibility well
    };
  });

  const CollapsibleHeader = () => (
    <Animated.View
      onLayout={(e) => setCollapsibleHeaderHeight(e.nativeEvent.layout.height)}
      style={[
        {
          overflow: "hidden",
        },
        headerAnimatedStyle,
      ]}
    >
      <SearchBar />
      <CategoryTabs
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </Animated.View>
  );

  const StickySearchBar = () => (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: insets.top,
          left: 0,
          right: 0,
          zIndex: 9,
          backgroundColor: theme.background,
          paddingVertical: Spacing.sm,
        },
        stickySearchAnimatedStyle,
      ]}
    >
      <SearchBar />
    </Animated.View>
  );



  return (
    <ThemedView style={layoutStyles.container}>
      <Animated.View style={[{ flex: 1 }, mainContentAnimatedStyle]}>
        <View style={{ paddingTop: insets.top, zIndex: 10, borderBottomWidth: 1, borderBottomColor: theme.border }}>
          <CollapsibleHeader />
          <StickySearchBar />
        </View>

        <Animated.ScrollView
          style={[layoutStyles.scrollView, { zIndex: 0 }]}
          contentContainerStyle={{
            paddingBottom: insets.bottom + Spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
        >
          <View style={layoutStyles.section}>
            {isDefaultState() && (
              <>
                <View
                  style={[
                    layoutStyles.sectionHeader,
                    {
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: Spacing.md,
                    },
                  ]}
                >
                  <ThemedText type="h2">Pinned Saved</ThemedText>
                  <Pressable
                    onPress={() => navigation.navigate("Pinned")}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: Spacing.xs,
                    }}
                  >
                    <ThemedText
                      type="body"
                      style={{ color: theme.primary, fontWeight: "600" }}
                    >
                      See All
                    </ThemedText>
                    <Feather name="arrow-right" size={18} color={theme.primary} />
                  </Pressable>
                </View>

                {loading ? (
                  <View
                    style={[
                      layoutStyles.center,
                      { paddingVertical: Spacing["3xl"] },
                    ]}
                  >
                    <ActivityIndicator size="large" color={theme.primary} />
                  </View>
                ) : posts.length === 0 ? (
                  <EmptyState />
                ) : (
                  <FlatList
                    data={posts}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={listStyles.listHorizontal}
                    renderItem={({ item }) => (
                      <HotelCard
                        item={item}
                        onPress={() =>
                          navigation.navigate("PostDetail", { post: item })
                        }
                        onFavoritePress={toggleSaved}
                        isFavorite={favorites.includes(item.id)}
                      />
                    )}
                    keyExtractor={(item) => item.id}
                  />
                )}
              </>
            )}
          </View>

          {/* Explore Section - becomes sticky when header collapses */}
          <View
            onLayout={(e) => {
              const { height } = e.nativeEvent.layout;
              if (isDefaultState()) {
                setPinnedSavedHeight(height + Spacing.lg);
              }
            }}
          >
            <View
              style={[
                layoutStyles.sectionHeader,
                spacingStyles.mbMd,
                {
                  paddingVertical: Spacing.lg,
                  borderBottomColor: theme.border,
                },
              ]}
            >
              {searchQuery.trim() && (
                <ThemedText type="h2">
                  {`Search results (${getFilteredData().length})`}
                </ThemedText>
              )}
              {!searchQuery.trim() && isFiltered() && (
                <ThemedText type="h2">
                  {`Results (${getFilteredData().length})`}
                </ThemedText>
              )}
              {isDefaultState() && (
                <ThemedText type="h2">Explore Marketplace</ThemedText>
              )}
            </View>

            <View style={[layoutStyles.section, { paddingVertical: Spacing.lg }]}>
              {getFilteredData().length === 0 ? (
                <EmptyState />
              ) : (
                <FlatList
                  data={getFilteredData()}
                  scrollEnabled={false}
                  contentContainerStyle={[
                    listStyles.listVertical,
                    spacingStyles.mxLg,
                    { paddingTop: 0 },
                  ]}
                  renderItem={({ item }) => (
                    <HotelCard
                      item={item}
                      onPress={() =>
                        navigation.navigate("PostDetail", { post: item })
                      }
                      onFavoritePress={toggleSaved}
                      isFavorite={favorites.includes(item.id)}
                      fullWidth
                    />
                  )}
                  keyExtractor={(item) => item.id}
                />
              )}
            </View>
          </View>
        </Animated.ScrollView>
      </Animated.View>

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
