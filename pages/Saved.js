import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator, Alert, Pressable, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { HotelCard } from '../components/Card';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../theme/global';
import { savedList } from '../data/savedList';
import { favoritesService } from '../services/favoritesService';

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
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      if (user) {
        const favs = await favoritesService.getFavorites(user.id);
        const properties = favs.map(fav => ({
          ...fav.properties,
          id: fav.property_id,
        }));
        setSavedProperties(properties.length > 0 ? properties : savedList);
        setFavorites(properties.map(p => p.id));
      } else {
        setSavedProperties(savedList);
        setFavorites(savedList.map(item => item.id));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setSavedProperties(savedList);
      setFavorites(savedList.map(item => item.id));
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
        await favoritesService.toggleFavorite(user.id, id);
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
      <FlatList
        data={savedProperties}
        numColumns={viewMode === 'compact' ? 2 : 1}
        key={viewMode}
        contentContainerStyle={[
          viewMode === 'compact' ? styles.gridContent : styles.listContent,
          {
            paddingTop: insets.top + Spacing.xl,
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
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="h1" style={styles.title}>
              Saved Properties
            </ThemedText>
            <Pressable 
              onPress={toggleViewMode}
              style={[styles.viewToggle, { backgroundColor: theme.surface }]}
            >
              <Feather 
                name={viewMode === 'normal' ? 'grid' : 'list'} 
                size={20} 
                color={theme.primary} 
              />
            </Pressable>
          </View>
        }
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
  listContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  gridContent: {
    paddingHorizontal: Spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: {
    fontWeight: '700',
  },
  viewToggle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
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
