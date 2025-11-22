import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Image, FlatList, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { PageHeader } from '../components/Navbar';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { posts as postsApi } from '../services/database';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

function CompactPostCard({ post, theme, currentUserId, onDelete, isSaved, onToggleSave }) {
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
    <View style={[styles.compactPostCard, { backgroundColor: theme.surface }]}>
      {post.image ? (
        <Image source={{ uri: post.image }} style={styles.compactPostImage} />
      ) : null}
      <View style={styles.compactPostContent}>
        <View style={styles.compactPostHeader}>
          <Image source={{ uri: post.userPhoto }} style={styles.compactUserPhoto} />
          <View style={{ flex: 1 }}>
            <ThemedText type="bodySmall" style={styles.compactUserName} numberOfLines={1}>
              {post.userName}
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }} numberOfLines={1}>
              {post.timeAgo}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="bodySmall" style={styles.compactPostText} numberOfLines={2}>
          {post.text}
        </ThemedText>
        <View style={styles.compactPostActions}>
          <View style={styles.compactActionGroup}>
            <Feather name="heart" size={14} color={theme.textSecondary} />
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              {post.likes}
            </ThemedText>
          </View>
          <View style={styles.compactActionGroup}>
            <Feather name="message-circle" size={14} color={theme.textSecondary} />
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              {post.comments}
            </ThemedText>
          </View>
          <Pressable onPress={onToggleSave}>
            <Feather 
              name="bookmark" 
              size={14} 
              color={isSaved ? theme.primary : theme.textSecondary}
            />
          </Pressable>
        </View>
      </View>
      {isOwnPost ? (
        <Pressable style={styles.compactDeleteButton} onPress={handleDelete}>
          <Feather name="trash-2" size={14} color={theme.error || '#EF4444'} />
        </Pressable>
      ) : null}
    </View>
  );
}

function PostCard({ post, theme, currentUserId, onDelete, isSaved, onToggleSave }) {
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
        <Pressable style={styles.actionButton} onPress={onToggleSave}>
          <Feather 
            name={isSaved ? "bookmark" : "bookmark"} 
            size={20} 
            color={isSaved ? theme.primary : theme.textSecondary}
            fill={isSaved ? theme.primary : 'transparent'}
          />
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Feather name="share-2" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

function EmptyState({ theme, onCreatePost }) {
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
  const { user } = useAuth();
  const insets = useScreenInsets();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [viewMode, setViewMode] = useState('normal');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadPosts();
    }, [])
  );

  async function loadPosts() {
    try {
      setLoading(true);
      const fetchedPosts = await postsApi.getAll();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      Alert.alert('Error', 'Unable to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  }

  async function handleDeletePost(postId) {
    try {
      await postsApi.delete(postId, user?.id || 'guest');
      setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      Alert.alert('Success', 'Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post. Please try again.');
    }
  }

  function handleToggleSave(postId) {
    setSavedPosts(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(postId)) {
        newSaved.delete(postId);
      } else {
        newSaved.add(postId);
      }
      return newSaved;
    });
  }

  const handleViewToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode(prev => prev === 'normal' ? 'compact' : 'normal');
  };

  const handleMenuPress = () => {
    navigation.navigate('AddPost');
  };

  const handleCreateFirstPost = () => {
    navigation.navigate('AddPost');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.navbarContainer, { paddingTop: insets.top }]}>
        <PageHeader
          title="Posts"
          theme={theme}
          onAction={handleMenuPress}
          actionIcon="plus-circle"
          onViewToggle={handleViewToggle}
          viewMode={viewMode}
        />
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
          <EmptyState theme={theme} onCreatePost={handleCreateFirstPost} />
        </ScrollView>
      ) : (
        <FlatList
          data={posts}
          numColumns={viewMode === 'compact' ? 2 : 1}
          key={viewMode}
          contentContainerStyle={[
            viewMode === 'compact' ? styles.gridContent : styles.listContent,
            {
              paddingBottom: insets.bottom + Spacing.xl,
            },
          ]}
          columnWrapperStyle={viewMode === 'compact' ? styles.row : null}
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
  compactPostCard: {
    width: '48%',
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
  },
  compactPostImage: {
    width: '100%',
    height: 120,
  },
  compactPostContent: {
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  compactPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  compactUserPhoto: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  compactUserName: {
    fontWeight: '600',
  },
  compactPostText: {
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  compactPostActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  compactActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactDeleteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
