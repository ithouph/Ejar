import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator, Alert, Pressable, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { HotelCard } from '../components/Card';
import { PageHeader } from '../components/Navbar';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../theme/global';
import { savedPosts as favoritesApi } from '../services';

function CompactCard({ item, onPress, onFavoritePress, isFavorite, theme }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.compactCard, { backgroundColor: theme.surface }]}
    >
      <Image source={{ uri: item.image }} style={styles.compactImage} />
      <View style={styles.compactContent}>
        <ThemedText type="bodySmall" style={styles.compactName} numberOfLines={1}>
          {item.name}
        </ThemedText>
        <View style={styles.compactLocationRow}>
          <Feather name="map-pin" size={12} color={theme.textSecondary} />
          <ThemedText type="caption" style={{ color: theme.textSecondary, flex: 1 }} numberOfLines={1}>
            {item.location}
          </ThemedText>
        </View>
        <View style={styles.compactRatingRow}>
          <Feather name="star" size={12} color="#FBBF24" />
          <ThemedText type="caption" style={styles.compactRating}>
            {item.rating}
          </ThemedText>
        </View>
      </View>
      <Pressable
        onPress={() => onFavoritePress(item.id)}
        style={styles.compactFavoriteButton}
      >
        <Feather
          name={isFavorite ? 'heart' : 'heart'}
          size={16}
          color={isFavorite ? theme.error : theme.textSecondary}
        />
      </Pressable>
    </Pressable>
  );
}

export default function Saved({ navigation }) {
  const insets = useScreenInsets();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('normal');

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setLoading(false);
      setSavedProperties([]);
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) {
      setLoading(false);
      setSavedProperties([]);
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      const favs = await favoritesApi.getAll(user.id);
      const properties = favs.map(fav => ({
        ...fav.properties,
        id: fav.property_id,
      }));
      setSavedProperties(properties);
      setFavorites(properties.map(p => p.id));
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert(
        'Error Loading Favorites',
        'Unable to load your saved properties. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
      setSavedProperties([]);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id) => {
    const previousFavorites = [...favorites];
    const previousSavedProperties = [...savedProperties];
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      setFavorites(prev =>
        prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
      );

      setSavedProperties(prev =>
        prev.filter(item => item.id !== id)
      );

      if (user) {
        await favoritesApi.toggle(user.id, id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      setFavorites(previousFavorites);
      setSavedProperties(previousSavedProperties);

      Alert.alert(
        'Action Failed',
        'Unable to update favorites. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  const toggleViewMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode(prev => prev === 'normal' ? 'compact' : 'normal');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <PageHeader
          title="Saved Properties"
          theme={theme}
          onViewToggle={toggleViewMode}
          viewMode={viewMode}
        />
      </View>
      
      <FlatList
        data={savedProperties}
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
              <CompactCard
                item={item}
                theme={theme}
                onPress={() => navigation.navigate('Details', { property: item })}
                onFavoritePress={toggleFavorite}
                isFavorite={favorites.includes(item.id)}
              />
            );
          }
          return (
            <View style={styles.cardContainer}>
              <HotelCard
                item={item}
                onPress={() => navigation.navigate('Details', { property: item })}
                onFavoritePress={toggleFavorite}
                isFavorite={favorites.includes(item.id)}
              />
            </View>
          );
        }}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={{ paddingVertical: Spacing.xl, alignItems: 'center' }}>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              No saved properties yet
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    zIndex: 10,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.lg,
  },
  gridContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  cardContainer: {
    marginBottom: Spacing.lg,
  },
  compactCard: {
    width: '48%',
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
  },
  compactImage: {
    width: '100%',
    height: 120,
  },
  compactContent: {
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  compactName: {
    fontWeight: '600',
  },
  compactLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  compactRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  compactRating: {
    fontWeight: '600',
  },
  compactFavoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
