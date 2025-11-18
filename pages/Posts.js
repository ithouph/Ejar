import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Image, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';

function Navbar({ onMenuPress, theme }) {
  return (
    <View style={[styles.navbar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <ThemedText type="h1" style={styles.navTitle}>
        Posts
      </ThemedText>
      <Pressable onPress={onMenuPress} style={styles.menuButton}>
        <Feather name="plus-circle" size={24} color={theme.primary} />
      </Pressable>
    </View>
  );
}

function PostCard({ post, theme }) {
  return (
    <View style={[styles.postCard, { backgroundColor: theme.surface }]}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.userPhoto }} style={styles.userPhoto} />
        <View style={styles.postHeaderInfo}>
          <ThemedText type="bodyLarge" style={styles.userName}>
            {post.userName}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {post.location} • {post.timeAgo}
          </ThemedText>
        </View>
        <Pressable style={styles.moreButton}>
          <Feather name="more-horizontal" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>

      {post.image ? (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      ) : null}

      <View style={styles.postContent}>
        <ThemedText type="bodyLarge" style={styles.postText}>
          {post.text}
        </ThemedText>
      </View>

      <View style={styles.postActions}>
        <Pressable style={styles.actionButton}>
          <Feather name="heart" size={20} color={theme.textSecondary} />
          <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
            {post.likes}
          </ThemedText>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Feather name="message-circle" size={20} color={theme.textSecondary} />
          <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
            {post.comments}
          </ThemedText>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Feather name="share-2" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

function EmptyState({ theme }) {
  return (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconContainer, { backgroundColor: theme.primary + '15' }]}>
        <Feather name="edit-3" size={64} color={theme.primary} />
      </View>
      <ThemedText type="h2" style={styles.emptyTitle}>
        No Posts Yet
      </ThemedText>
      <ThemedText type="bodyLarge" style={[styles.emptyDescription, { color: theme.textSecondary }]}>
        Share your travel experiences, photos, and stories with the community
      </ThemedText>
      <Pressable style={[styles.createButton, { backgroundColor: theme.primary }]}>
        <Feather name="plus" size={20} color="#FFF" />
        <ThemedText type="bodyLarge" lightColor="#FFF" darkColor="#FFF" style={styles.createButtonText}>
          Create Your First Post
        </ThemedText>
      </Pressable>
    </View>
  );
}

export default function Posts({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const [posts, setPosts] = useState([]);

  const handleMenuPress = () => {
    console.log('Create new post');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.navbarContainer, { paddingTop: insets.top }]}>
        <Navbar onMenuPress={handleMenuPress} theme={theme} />
      </View>

      {posts.length === 0 ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: insets.bottom + Spacing.xl,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <EmptyState theme={theme} />
        </ScrollView>
      ) : (
        <FlatList
          data={posts}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom: insets.bottom + Spacing.xl,
            },
          ]}
          renderItem={({ item }) => <PostCard post={item} theme={theme} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbarContainer: {
    zIndex: 10,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  navTitle: {
    fontWeight: '700',
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Spacing.xl,
  },
  listContent: {
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  postCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postHeaderInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  userName: {
    fontWeight: '600',
  },
  moreButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postImage: {
    width: '100%',
    height: 250,
  },
  postContent: {
    padding: Spacing.md,
  },
  postText: {
    lineHeight: 22,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl * 2,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
  },
  createButtonText: {
    fontWeight: '600',
  },
});
