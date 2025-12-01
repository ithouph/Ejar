import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { StickyHeader } from "../components/StickyHeader";
import { HotelCard } from "../components/Card";
import { useTheme } from "../hooks/useTheme";
import { useScreenInsets } from "../hooks/useScreenInsets";
import { useAuth } from "../contexts/AuthContext";
import {
  Spacing,
  layoutStyles,
  spacingStyles,
  listStyles,
} from "../theme";
import { posts as postsApi } from "../services/database";

export default function Posts({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user } = useAuth();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadMyPosts();
  }, [user]);

  const loadMyPosts = async () => {
    try {
      setLoading(true);
      if (user) {
        const posts = await postsApi.getByUser(user.id);
        setMyPosts(posts || []);
      }
    } catch (error) {
      console.error("Error loading my posts:", error);
      Alert.alert(
        "Error Loading Posts",
        "Unable to load your posts. Please try again.",
        [{ text: "OK" }]
      );
      setMyPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const EmptyState = () => (
    <View
      style={[
        layoutStyles.center,
        { paddingVertical: Spacing["3xl"], paddingHorizontal: Spacing.xl },
      ]}
    >
      <Feather
        name="inbox"
        size={48}
        color={theme.textSecondary}
        style={{ marginBottom: Spacing.md }}
      />
      <ThemedText
        type="h3"
        style={{ marginBottom: Spacing.xs, textAlign: "center" }}
      >
        No posts yet
      </ThemedText>
      <ThemedText
        type="body"
        style={{ color: theme.textSecondary, textAlign: "center", marginBottom: Spacing.lg }}
      >
        Start by creating a new listing
      </ThemedText>
      <Pressable
        onPress={() => navigation.navigate("AddPost")}
        style={[
          spacingStyles.pxMd,
          spacingStyles.pyMd,
          { backgroundColor: theme.primary, borderRadius: 8 },
        ]}
      >
        <ThemedText style={{ color: theme.background, fontWeight: "600" }}>
          Create Post
        </ThemedText>
      </Pressable>
    </View>
  );

  return (
    <ThemedView style={layoutStyles.container}>
      <View
        style={[
          spacingStyles.pxLg,
          spacingStyles.ptMd,
          {
            paddingTop: insets.top + Spacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: Spacing.lg,
          }}
        >
          <ThemedText type="h2">My Listings</ThemedText>
          <Pressable
            onPress={() => navigation.navigate("AddPost")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.primary + "20",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="plus" size={20} color={theme.primary} />
          </Pressable>
        </View>
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
      ) : myPosts.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={myPosts}
          contentContainerStyle={{
            paddingHorizontal: Spacing.lg,
            paddingVertical: Spacing.lg,
            paddingBottom: insets.bottom + Spacing.xl,
          }}
          renderItem={({ item }) => (
            <View style={{ marginBottom: Spacing.lg }}>
              <HotelCard
                item={item}
                onPress={() =>
                  navigation.navigate("PostDetail", { post: item })
                }
                onFavoritePress={() => {}}
                isFavorite={favorites.includes(item.id)}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}
