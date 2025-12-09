import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Image, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { PageHeader } from '../components/Navbar';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { posts as postsApi, savedPosts as savedPostsApi } from '../services/database';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

function CompactPostCard({ post, theme, currentUserId, onDelete, isSaved, onToggleSave, onPress }) {
  const isOwnPost = currentUserId && post.userId === currentUserId;

  const handleDelete = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete(post.id)
        }
      ]
    );
  };

  return (
    <Pressable onPress={onPress} style={[styles.compactPostCard, { backgroundColor: theme.surface }]}>
      {post.image ? (
        <Image source={{ uri: post.image }} style={styles.compactPostImage} />
      ) : (
        <View style={[styles.compactPostImage, { backgroundColor: theme.surfaceHover, alignItems: 'center', justifyContent: 'center' }]}>
          <Feather name="image" size={24} color={theme.textSecondary} />
        </View>
      )}
      <View style={styles.compactPostContent}>
        <ThemedText type="bodySmall" style={styles.compactPostText} numberOfLines={2}>
          {post.title}
        </ThemedText>
        <View style={styles.compactPostMeta}>
          <ThemedText type="caption" style={{ color: theme.textSecondary }} numberOfLines={1}>
            {post.cityName}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.primary, fontWeight: '600' }}>
            {post.price > 0 ? `${post.price} MRU` : 'Free'}
          </ThemedText>
        </View>
        <View style={styles.compactPostActions}>
          <View style={styles.compactActionGroup}>
            <Feather name="heart" size={14} color={theme.textSecondary} />
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              {post.totalFavorites || 0}
            </ThemedText>
          </View>
          <Pressable onPress={onToggleSave}>
            <Feather 
              name="bookmark" 
              size={14} 
              color={isSaved ? theme.primary : theme.textSecondary}
            />
          </Pressable>
          {isOwnPost && (
            <Pressable onPress={handleDelete}>
              <Feather name="trash-2" size={14} color={theme.error || '#EF4444'} />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

function PostCard({ post, theme, currentUserId, onDelete, isSaved, onToggleSave, onPress }) {
  const isOwnPost = currentUserId && post.userId === currentUserId;

  const handleDelete = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete(post.id)
        }
      ]
    );
  };

  return (
    <Pressable onPress={onPress} style={[styles.postCard, { backgroundColor: theme.surface }]}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.userPhoto }} style={styles.userPhoto} />
        <View style={styles.postHeaderInfo}>
          <ThemedText type="bodyLarge" style={styles.userName}>
            {post.userName}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {post.cityName} • {post.timeAgo}
          </ThemedText>
        </View>
        {isOwnPost ? (
          <Pressable style={styles.moreButton} onPress={handleDelete}>
            <Feather name="trash-2" size={20} color={theme.error || '#EF4444'} />
          </Pressable>
        ) : (
          <Pressable style={styles.moreButton}>
            <Feather name="more-horizontal" size={20} color={theme.textSecondary} />
          </Pressable>
        )}
      </View>

      {post.image ? (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      ) : null}

      <View style={styles.postContent}>
        <ThemedText type="bodyLarge" style={styles.postTitle}>
          {post.title}
        </ThemedText>
        {post.description ? (
          <ThemedText type="body" style={[styles.postDescription, { color: theme.textSecondary }]} numberOfLines={2}>
            {post.description}
          </ThemedText>
        ) : null}
        <View style={styles.postPriceRow}>
          <ThemedText type="h3" style={{ color: theme.primary }}>
            {post.price > 0 ? `${post.price} MRU` : 'Free'}
          </ThemedText>
          {post.categoryName && (
            <View style={[styles.categoryBadge, { backgroundColor: theme.primary + '15' }]}>
              <ThemedText type="caption" style={{ color: theme.primary }}>
                {post.categoryName}
              </ThemedText>
            </View>
          )}
        </View>
      </View>

      <View style={styles.postActions}>
        <Pressable style={styles.actionButton}>
          <Feather name="heart" size={20} color={theme.textSecondary} />
          <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
            {post.totalFavorites || 0}
          </ThemedText>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={onToggleSave}>
          <Feather 
            name="bookmark" 
            size={20} 
            color={isSaved ? theme.primary : theme.textSecondary}
          />
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Feather name="share-2" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>
    </Pressable>
  );
}

function EmptyState({ theme, onCreatePost }) {
  return (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconContainer, { backgroundColor: theme.primary + '15' }]}>
        <Feather name="package" size={64} color={theme.primary} />
      </View>
      <ThemedText type="h2" style={styles.emptyTitle}>
        No Posts Yet
      </ThemedText>
      <ThemedText type="bodyLarge" style={[styles.emptyDescription, { color: theme.textSecondary }]}>
        Create your first listing to start selling on the marketplace
      </ThemedText>
      <Pressable 
        onPress={onCreatePost}
        style={[styles.createButton, { backgroundColor: theme.primary }]}
      >
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
  const { user, profile } = useAuth();
  const insets = useScreenInsets();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [viewMode, setViewMode] = useState('normal');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadUserPosts();
        loadSavedPosts();
      } else {
        setLoading(false);
      }
    }, [user])
  );

  async function loadUserPosts() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedPosts = await postsApi.getByUser(user.id);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadSavedPosts() {
    if (!user) return;

    try {
      const savedIds = await savedPostsApi.getIds(user.id);
      setSavedPosts(new Set(savedIds));
    } catch (error) {
      console.error('Error loading saved posts:', error);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadUserPosts();
    setRefreshing(false);
  }

  async function handleDeletePost(postId) {
    try {
      await postsApi.delete(postId, user?.id);
      setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      Alert.alert('Success', 'Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post. Please try again.');
    }
  }

  async function handleToggleSave(postId) {
    if (!user) {
      Alert.alert('Login Required', 'Please login to save posts');
      return;
    }

    try {
      const wasSaved = savedPosts.has(postId);
      
      setSavedPosts(prev => {
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
      console.error('Error toggling save:', error);
      loadSavedPosts();
      Alert.alert('Error', 'Failed to save post. Please try again.');
    }
  }

  const handleViewToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode(prev => prev === 'normal' ? 'compact' : 'normal');
  };

  const handleMenuPress = () => {
    navigation.navigate('AddPost');
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.navbarContainer, { paddingTop: insets.top }]}>
          <PageHeader title="My Posts" theme={theme} />
        </View>
        <View style={styles.emptyContainer}>
          <Feather name="log-in" size={48} color={theme.textSecondary} />
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
            Please log in to view your posts
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.navbarContainer, { paddingTop: insets.top }]}>
        <PageHeader
          title="My Posts"
          theme={theme}
          onAction={handleMenuPress}
          actionIcon="plus-circle"
          onViewToggle={handleViewToggle}
          viewMode={viewMode}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : posts.length === 0 ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <EmptyState theme={theme} onCreatePost={handleMenuPress} />
        </ScrollView>
      ) : (
        <FlatList
          data={posts}
          numColumns={viewMode === 'compact' ? 2 : 1}
          key={viewMode}
          contentContainerStyle={[
            viewMode === 'compact' ? styles.gridContent : styles.listContent,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          columnWrapperStyle={viewMode === 'compact' ? styles.row : undefined}
          renderItem={({ item }) => {
            if (viewMode === 'compact') {
              return (
                <CompactPostCard
                  post={item}
                  theme={theme}
                  currentUserId={user?.id}
                  onDelete={handleDeletePost}
                  isSaved={savedPosts.has(item.id)}
                  onToggleSave={() => handleToggleSave(item.id)}
                  onPress={() => navigation.navigate('PostDetail', { post: item })}
                />
              );
            }
            return (
              <PostCard 
                post={item} 
                theme={theme} 
                currentUserId={user?.id}
                onDelete={handleDeletePost}
                isSaved={savedPosts.has(item.id)}
                onToggleSave={() => handleToggleSave(item.id)}
                onPress={() => navigation.navigate('PostDetail', { post: item })}
              />
            );
          }}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
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
  scrollContent: {
    flexGrow: 1,
    paddingTop: Spacing.xl,
  },
  listContent: {
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  gridContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    gap: Spacing.xs,
  },
  postTitle: {
    fontWeight: '600',
  },
  postDescription: {
    lineHeight: 20,
  },
  postPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.small,
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
  compactPostCard: {
    width: '48%',
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
  },
  compactPostImage: {
    width: '100%',
    height: 100,
  },
  compactPostContent: {
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  compactPostText: {
    fontWeight: '500',
  },
  compactPostMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactPostActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  compactActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
});
