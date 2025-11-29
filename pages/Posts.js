import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  FlatList,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { StickyHeader } from "../components/StickyHeader";
import { HotelCard } from "../components/Card";
import { useTheme } from "../hooks/useTheme";
import { useScreenInsets } from "../hooks/useScreenInsets";
import { Spacing, BorderRadius, postsPageStyles as styles } from "../theme/global";
import {
  posts as postsApi,
  savedPosts as savedPostsApi,
} from "../services/database";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";

function EmptyState({ theme, onCreatePost }) {
  return (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIconContainer,
          { backgroundColor: theme.primary + "15" },
        ]}
      >
        <Feather name="edit-3" size={64} color={theme.primary} />
      </View>
      <ThemedText type="h2" style={styles.emptyTitle}>
        No Posts Yet
      </ThemedText>
      <ThemedText
        type="bodyLarge"
        style={[styles.emptyDescription, { color: theme.textSecondary }]}
      >
        Share your Ejar experiences, photos, and stories with the community
      </ThemedText>
      <ThemedView style={[styles.createButton, { backgroundColor: theme.primary }]}>
        <Feather name="plus" size={20} color="#FFF" />
        <ThemedText
          type="bodyLarge"
          lightColor="#FFF"
          darkColor="#FFF"
          style={styles.createButtonText}
        >
          Create Your First Post
        </ThemedText>
      </ThemedView>
    </View>
  );
}

export default function Posts({ navigation }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useScreenInsets();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      loadPosts();
      if (user) {
        loadSavedPosts();
      }
    }, [user]),
  );

  async function loadPosts() {
    try {
      setLoading(true);
      const fetchedPosts = await postsApi.getAll();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      Alert.alert("Error", "Unable to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function loadSavedPosts() {
    if (!user) return;
    try {
      const saved = await savedPostsApi.getAll(user.id);
      const savedIds = new Set(saved.map((post) => post.id));
      setSavedPosts(savedIds);
    } catch (error) {
      console.error("Error loading saved posts:", error);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  }

  async function handleDeletePost(postId) {
    try {
      await postsApi.delete(postId, user?.id || "guest");
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
      Alert.alert("Success", "Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", "Failed to delete post. Please try again.");
    }
  }

  async function handleToggleSave(postId) {
    if (!user) {
      Alert.alert("Login Required", "Please login to save posts");
      return;
    }
    try {
      const wasSaved = savedPosts.has(postId);
      setSavedPosts((prev) => {
        const newSaved = new Set(prev);
        if (wasSaved) {
          newSaved.delete(postId);
        } else {
          newSaved.add(postId);
        }
        return newSaved;
      });
      await savedPostsApi.toggle(user.id, postId);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error("Error toggling save:", error);
      setSavedPosts((prev) => {
        const newSaved = new Set(prev);
        if (savedPosts.has(postId)) {
          newSaved.delete(postId);
        } else {
          newSaved.add(postId);
        }
        return newSaved;
      });
      Alert.alert("Error", "Failed to save post. Please try again.");
    }
  }

  const handleViewToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode((prev) => (prev === "list" ? "grid" : "list"));
  };

  const handleMenuPress = () => {
    navigation.navigate("AddPost");
  };

  const handleCreateFirstPost = () => {
    navigation.navigate("AddPost");
  };

  return (
    <ThemedView style={styles.container}>
      <StickyHeader
        title="Posts"
        theme={theme}
        scrollY={scrollY}
        insets={insets}
        actionIcon="plus-circle"
        onAction={handleMenuPress}
      />

      {posts.length === 0 ? (
        <ScrollView
          onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
          scrollEventThrottle={16}
          contentContainerStyle={[
            { flexGrow: 1 },
            styles.scrollContent,
            {
              paddingTop: Spacing.xl * 3.5,
              paddingBottom: insets.bottom + Spacing.xl,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <EmptyState theme={theme} onCreatePost={handleCreateFirstPost} />
        </ScrollView>
      ) : (
        <FlatList
          onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
          scrollEventThrottle={16}
          data={posts}
          numColumns={viewMode === "grid" ? 2 : 1}
          key={viewMode}
          contentContainerStyle={[
            viewMode === "grid" ? styles.gridContent : styles.listContent,
            {
              paddingTop: Spacing.xl * 3.5,
              paddingBottom: insets.bottom + Spacing.xl + (Spacing.tabBarHeight || 80),
            },
          ]}
          columnWrapperStyle={viewMode === "grid" ? styles.row : null}
          renderItem={({ item }) => (
            <HotelCard
              item={{
                ...item,
                name: item.title || item.text,
                rating: item.price ? `$${item.price}` : item.likes,
              }}
              onPress={() =>
                navigation.navigate("PostDetail", { post: item })
              }
              onFavoritePress={handleToggleSave}
              isFavorite={savedPosts.has(item.id)}
              fullWidth={viewMode === "list"}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </ThemedView>
  );
}
