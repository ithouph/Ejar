import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  POSTS: "ejar_posts",
  WALLET: "ejar_wallet",
  USER_DATA: "ejar_user_data",
  USER_POSTS: "ejar_user_posts",
  SYNC_QUEUE: "ejar_sync_queue",
};

export const localStorageService = {
  // Posts
  async getPosts() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.POSTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting posts from local storage:", error);
      return [];
    }
  },

  async setPosts(posts) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.POSTS,
        JSON.stringify(posts || [])
      );
    } catch (error) {
      console.error("Error setting posts in local storage:", error);
    }
  },

  async addPost(post) {
    try {
      const posts = await this.getPosts();
      const updatedPosts = [post, ...posts];
      await this.setPosts(updatedPosts);
      return updatedPosts;
    } catch (error) {
      console.error("Error adding post to local storage:", error);
    }
  },

  async updatePost(postId, updates) {
    try {
      const posts = await this.getPosts();
      const updated = posts.map((p) =>
        p.id === postId ? { ...p, ...updates } : p
      );
      await this.setPosts(updated);
      return updated;
    } catch (error) {
      console.error("Error updating post in local storage:", error);
    }
  },

  async deletePost(postId) {
    try {
      const posts = await this.getPosts();
      const filtered = posts.filter((p) => p.id !== postId);
      await this.setPosts(filtered);
      return filtered;
    } catch (error) {
      console.error("Error deleting post from local storage:", error);
    }
  },

  // User Posts
  async getUserPosts(userId) {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_POSTS);
      if (!data) return [];
      const allUserPosts = JSON.parse(data);
      return allUserPosts[userId] || [];
    } catch (error) {
      console.error("Error getting user posts from local storage:", error);
      return [];
    }
  },

  async setUserPosts(userId, posts) {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_POSTS);
      const allUserPosts = data ? JSON.parse(data) : {};
      allUserPosts[userId] = posts || [];
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_POSTS,
        JSON.stringify(allUserPosts)
      );
    } catch (error) {
      console.error("Error setting user posts in local storage:", error);
    }
  },

  // Wallet
  async getWallet(userId) {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WALLET);
      if (!data) return null;
      const wallets = JSON.parse(data);
      return wallets[userId] || null;
    } catch (error) {
      console.error("Error getting wallet from local storage:", error);
      return null;
    }
  },

  async setWallet(userId, wallet) {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WALLET);
      const wallets = data ? JSON.parse(data) : {};
      wallets[userId] = wallet;
      await AsyncStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallets));
    } catch (error) {
      console.error("Error setting wallet in local storage:", error);
    }
  },

  // User Data
  async getUserData(userId) {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!data) return null;
      const users = JSON.parse(data);
      return users[userId] || null;
    } catch (error) {
      console.error("Error getting user data from local storage:", error);
      return null;
    }
  },

  async setUserData(userId, userData) {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      const users = data ? JSON.parse(data) : {};
      users[userId] = userData;
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(users));
    } catch (error) {
      console.error("Error setting user data in local storage:", error);
    }
  },

  // Sync Queue - Track changes to sync with backend
  async addToSyncQueue(action, data) {
    try {
      const queue = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      const syncQueue = queue ? JSON.parse(queue) : [];
      syncQueue.push({
        id: Date.now(),
        action,
        data,
        timestamp: new Date().toISOString(),
      });
      await AsyncStorage.setItem(
        STORAGE_KEYS.SYNC_QUEUE,
        JSON.stringify(syncQueue)
      );
    } catch (error) {
      console.error("Error adding to sync queue:", error);
    }
  },

  async getSyncQueue() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting sync queue:", error);
      return [];
    }
  },

  async clearSyncQueue() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
    } catch (error) {
      console.error("Error clearing sync queue:", error);
    }
  },

  // Clear all data
  async clearAll() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error("Error clearing all local storage:", error);
    }
  },
};
