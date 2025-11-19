import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { HotelCard } from '../components/Card';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing } from '../theme/global';
import { savedList } from '../data/savedList';
import { favoritesService } from '../services/favoritesService';

export default function Saved({ navigation }) {
  const insets = useScreenInsets();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={savedProperties}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <HotelCard
              item={item}
              onPress={() => navigation.navigate('Details', { property: item })}
              onFavoritePress={toggleFavorite}
              isFavorite={favorites.includes(item.id)}
            />
          </View>
        )}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <ThemedText type="h1" style={styles.title}>
            Saved Properties
          </ThemedText>
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
  title: {
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  cardContainer: {
    marginBottom: Spacing.lg,
  },
});
