import React, { useState, useEffect } from 'react';
import { View, ScrollView, FlatList, Pressable, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Header } from '../components/Header';
import { CategoryTabs } from '../components/Filters';
import { HotelCard } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { useAuth } from '../contexts/AuthContext';
import { Spacing, layoutStyles, inputStyles, buttonStyles, modalStyles, spacingStyles, listStyles } from '../theme';
import { propertiesService } from '../services/propertiesService';
import { favoritesService } from '../services/favoritesService';

const PROPERTY_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'apartments', label: 'Apartments' },
];

const AMENITIES_OPTIONS = [
  { id: 'Wi-Fi', label: 'Wi-Fi', icon: 'wifi' },
  { id: 'Air Conditioning', label: 'Air conditioning', icon: 'wind' },
  { id: 'Pool', label: 'Pool', icon: 'droplet' },
  { id: 'Parking', label: 'Parking', icon: 'truck' },
  { id: 'Gym', label: 'Gym', icon: 'activity' },
  { id: 'Kitchen', label: 'Kitchen', icon: 'coffee' },
];

const RATING_OPTIONS = [
  { id: '5', label: '5 Stars', value: 5 },
  { id: '4', label: '4+ Stars', value: 4 },
  { id: '3', label: '3+ Stars', value: 3 },
];

export default function Discover({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user, selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const filters = {};
      if (selectedCategory === 'hotels') {
        filters.type = 'Hotel';
      } else if (selectedCategory === 'apartments') {
        filters.type = 'Apartment';
      }

      const [propertiesData, favoriteIds] = await Promise.all([
        propertiesService.getProperties(filters),
        user ? favoritesService.getFavoriteIds(user.id) : Promise.resolve([]),
      ]);

      setProperties(propertiesData || []);
      setFavorites(favoriteIds || []);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert(
        'Error Loading Properties',
        'Unable to load properties. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    let filtered = properties;
    
    if (selectedCategory === 'hotels') {
      filtered = filtered.filter(item => item.type === 'Hotel');
    } else if (selectedCategory === 'apartments') {
      filtered = filtered.filter(item => item.type === 'Apartment');
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 5000) {
      filtered = filtered.filter(item => 
        item.price >= priceRange[0] && item.price <= priceRange[1]
      );
    }
    
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(item => 
        selectedAmenities.every(amenity => 
          item.amenities?.includes(amenity)
        )
      );
    }
    
    if (selectedRating) {
      filtered = filtered.filter(item => item.rating >= selectedRating);
    }
    
    return filtered;
  };

  const toggleFavorite = async (id) => {
    const previousFavorites = [...favorites];
    const wasAdding = !favorites.includes(id);
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      setFavorites(prev =>
        prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
      );

      if (user) {
        await favoritesService.toggleFavorite(user.id, id);
      } else if (wasAdding) {
        setFavorites(previousFavorites);
        Alert.alert(
          'Sign in required',
          'Please sign in to save your favorites across devices.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      setFavorites(previousFavorites);

      Alert.alert(
        'Action Failed',
        wasAdding 
          ? 'Unable to add to favorites. Please try again.'
          : 'Unable to remove from favorites. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const toggleAmenity = (id) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 5000]);
    setSelectedAmenities([]);
    setSelectedRating(null);
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  return (
    <ThemedView style={layoutStyles.container}>
      <ScrollView
        style={layoutStyles.scrollView}
        contentContainerStyle={[
          layoutStyles.scrollContent,
          { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Header
          userData={{
            name: user?.user_metadata?.full_name || 'Guest',
            photo: user?.user_metadata?.avatar_url || null,
          }}
          onSettingsPress={() => navigation.navigate('Settings')}
          onFavoritePress={() => navigation.navigate('Saved')}
          onNotificationsPress={() => navigation.navigate('Notifications')}
        />

        <View style={[spacingStyles.mxLg, spacingStyles.mbMd]}>
          <View style={[inputStyles.searchInput, { backgroundColor: theme.surface }]}>
            <Feather name="search" size={20} color={theme.textSecondary} />
            <TextInput
              style={{ 
                flex: 1, 
                fontSize: 16, 
                color: theme.textPrimary,
                paddingVertical: 0,
              }}
              placeholder="Find the best for your holiday"
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchQuery.length > 0 ? (
              <Pressable onPress={() => setSearchQuery('')}>
                <Feather name="x" size={20} color={theme.textSecondary} />
              </Pressable>
            ) : null}
            <Pressable onPress={() => setShowFilters(true)} style={{ marginLeft: Spacing.xs }}>
              <Feather name="sliders" size={20} color={theme.primary} />
            </Pressable>
          </View>
        </View>

        <CategoryTabs
          categories={PROPERTY_TYPES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <View style={layoutStyles.section}>
          <View style={layoutStyles.sectionHeader}>
            <ThemedText type="h2">
              {searchQuery.trim() ? `Search results (${getFilteredData().length})` : 'Popular hotels'}
            </ThemedText>
            {!searchQuery.trim() ? (
              <Pressable>
                <View style={[layoutStyles.rowCenter, spacingStyles.gapXs]}>
                  <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
                    See all
                  </ThemedText>
                  <Feather name="chevron-right" size={16} color={theme.textSecondary} />
                </View>
              </Pressable>
            ) : null}
          </View>

          {loading ? (
            <View style={{ paddingVertical: Spacing.xl, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : getFilteredData().length === 0 ? (
            <View style={{ paddingVertical: Spacing.xxl, alignItems: 'center' }}>
              <Feather name="search" size={48} color={theme.textSecondary} style={{ marginBottom: Spacing.md }} />
              <ThemedText type="h3" style={{ marginBottom: Spacing.xs }}>
                No results found
              </ThemedText>
              <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: 'center' }}>
                Try adjusting your search or filters
              </ThemedText>
            </View>
          ) : (
            <FlatList
              data={getFilteredData()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={listStyles.listHorizontal}
              renderItem={({ item }) => (
                <HotelCard
                  item={item}
                  onPress={() => navigation.navigate('Details', { property: item })}
                  onFavoritePress={toggleFavorite}
                  isFavorite={favorites.includes(item.id)}
                />
              )}
              keyExtractor={item => item.id}
            />
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowFilters(false)}
      >
        <ThemedView style={modalStyles.modalContainer}>
          <View style={[modalStyles.modalHeader, { 
            backgroundColor: theme.background, 
            paddingTop: insets.top + Spacing.md 
          }]}>
            <Pressable onPress={() => setShowFilters(false)}>
              <Feather name="x" size={24} color={theme.textPrimary} />
            </Pressable>
            <ThemedText type="h2">Search Filters</ThemedText>
            <Pressable onPress={clearFilters}>
              <ThemedText type="body" style={{ color: theme.primary }}>Clear</ThemedText>
            </Pressable>
          </View>

          <ScrollView 
            style={modalStyles.modalBody}
            contentContainerStyle={[
              modalStyles.modalScrollContent,
              { paddingBottom: insets.bottom + Spacing.xl }
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={modalStyles.modalSection}>
              <ThemedText type="h3" style={modalStyles.modalSubtitle}>Location</ThemedText>
              <View style={[inputStyles.searchInput, { backgroundColor: theme.surface }]}>
                <Feather name="map-pin" size={20} color={theme.textSecondary} />
                <TextInput
                  style={{ flex: 1, fontSize: 16, color: theme.textPrimary }}
                  placeholder="Where are you going?"
                  placeholderTextColor={theme.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <View style={modalStyles.modalSection}>
              <View style={layoutStyles.rowBetween}>
                <ThemedText type="h3" style={modalStyles.modalSubtitle}>Price Range</ThemedText>
                <ThemedText type="body" style={{ color: theme.primary }}>
                  ${priceRange[0]} - ${priceRange[1]}
                </ThemedText>
              </View>
              <View style={[layoutStyles.row, spacingStyles.gapSm]}>
                <Pressable 
                  style={[buttonStyles.primary, { flex: 1, backgroundColor: theme.surface }]}
                  onPress={() => setPriceRange([0, 1000])}
                >
                  <ThemedText type="bodySmall">$0 - $1000</ThemedText>
                </Pressable>
                <Pressable 
                  style={[buttonStyles.primary, { flex: 1, backgroundColor: theme.surface }]}
                  onPress={() => setPriceRange([1000, 3000])}
                >
                  <ThemedText type="bodySmall">$1000 - $3000</ThemedText>
                </Pressable>
                <Pressable 
                  style={[buttonStyles.primary, { flex: 1, backgroundColor: theme.surface }]}
                  onPress={() => setPriceRange([3000, 5000])}
                >
                  <ThemedText type="bodySmall">$3000+</ThemedText>
                </Pressable>
              </View>
            </View>

            <View style={modalStyles.modalSection}>
              <ThemedText type="h3" style={modalStyles.modalSubtitle}>Amenities</ThemedText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
                {AMENITIES_OPTIONS.map((amenity) => (
                  <Pressable
                    key={amenity.id}
                    style={[
                      buttonStyles.chip,
                      { 
                        backgroundColor: selectedAmenities.includes(amenity.id) 
                          ? theme.primary + '20' 
                          : theme.surface,
                        borderColor: selectedAmenities.includes(amenity.id) 
                          ? theme.primary 
                          : 'transparent',
                        borderWidth: 1,
                      }
                    ]}
                    onPress={() => toggleAmenity(amenity.id)}
                  >
                    <Feather 
                      name={amenity.icon} 
                      size={20} 
                      color={selectedAmenities.includes(amenity.id) ? theme.primary : theme.textSecondary} 
                    />
                    <ThemedText 
                      type="bodySmall" 
                      style={{ 
                        color: selectedAmenities.includes(amenity.id) ? theme.primary : theme.textPrimary 
                      }}
                    >
                      {amenity.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={modalStyles.modalSection}>
              <ThemedText type="h3" style={modalStyles.modalSubtitle}>Rating</ThemedText>
              <View style={spacingStyles.gapSm}>
                {RATING_OPTIONS.map((rating) => (
                  <Pressable
                    key={rating.id}
                    style={[
                      buttonStyles.primary,
                      { 
                        backgroundColor: selectedRating === rating.id 
                          ? theme.primary 
                          : theme.surface 
                      }
                    ]}
                    onPress={() => setSelectedRating(selectedRating === rating.id ? null : rating.id)}
                  >
                    <ThemedText 
                      type="body" 
                      lightColor={selectedRating === rating.id ? '#FFF' : undefined}
                      darkColor={selectedRating === rating.id ? '#FFF' : undefined}
                    >
                      {rating.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={[modalStyles.modalFooter, { 
            backgroundColor: theme.background,
            paddingBottom: insets.bottom + Spacing.md,
            borderTopColor: theme.border,
          }]}>
            <Pressable 
              style={[buttonStyles.primaryLarge, { backgroundColor: theme.primary }]}
              onPress={applyFilters}
            >
              <ThemedText type="bodyLarge" lightColor="#FFF" darkColor="#FFF">
                Apply Filters
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

