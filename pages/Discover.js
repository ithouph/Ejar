import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Pressable, TextInput, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Header } from '../components/Header';
import { CategoryTabs } from '../components/Filters';
import { HotelCard } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { userData } from '../data/userData';
import { hotelsData, apartmentsData, allPropertiesData } from '../data/cardsData';
import { filterOptions } from '../data/filterData';

export default function Discover({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);

  const getFilteredData = () => {
    if (selectedCategory === 'hotels') {
      return hotelsData.filter(item => item.type === 'Hotel');
    }
    if (selectedCategory === 'apartments') {
      return apartmentsData;
    }
    return allPropertiesData;
  };

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
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
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Header
          userData={userData}
          onSettingsPress={() => navigation.navigate('Settings')}
          onFavoritePress={() => navigation.navigate('Saved')}
          onNotificationsPress={() => navigation.navigate('Notifications')}
        />

        <Pressable 
          style={[styles.searchContainer, { backgroundColor: theme.surface }]}
          onPress={() => setShowFilters(true)}
        >
          <Feather name="search" size={20} color={theme.textSecondary} />
          <ThemedText type="body" style={{ color: theme.textSecondary, flex: 1 }}>
            Find the best for your holiday
          </ThemedText>
          <Feather name="sliders" size={20} color={theme.textSecondary} />
        </Pressable>

        <CategoryTabs
          categories={filterOptions.propertyTypes}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h2">Popular hotels</ThemedText>
            <Pressable>
              <View style={styles.seeAllButton}>
                <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
                  See all
                </ThemedText>
                <Feather name="chevron-right" size={16} color={theme.textSecondary} />
              </View>
            </Pressable>
          </View>

          <FlatList
            data={getFilteredData()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hotelsList}
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
        </View>
      </ScrollView>

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowFilters(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <View style={[styles.modalHeader, { 
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
            style={styles.filterContent}
            contentContainerStyle={[
              styles.filterScrollContent,
              { paddingBottom: insets.bottom + Spacing.xl }
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.filterSection}>
              <ThemedText type="h3" style={styles.filterTitle}>Location</ThemedText>
              <View style={[styles.searchInput, { backgroundColor: theme.surface }]}>
                <Feather name="map-pin" size={20} color={theme.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.textPrimary }]}
                  placeholder="Where are you going?"
                  placeholderTextColor={theme.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <View style={styles.filterSection}>
              <View style={styles.filterHeader}>
                <ThemedText type="h3" style={styles.filterTitle}>Price Range</ThemedText>
                <ThemedText type="body" style={{ color: theme.primary }}>
                  ${priceRange[0]} - ${priceRange[1]}
                </ThemedText>
              </View>
              <View style={styles.priceRangeButtons}>
                <Pressable 
                  style={[styles.priceButton, { backgroundColor: theme.surface }]}
                  onPress={() => setPriceRange([0, 1000])}
                >
                  <ThemedText type="bodySmall">$0 - $1000</ThemedText>
                </Pressable>
                <Pressable 
                  style={[styles.priceButton, { backgroundColor: theme.surface }]}
                  onPress={() => setPriceRange([1000, 3000])}
                >
                  <ThemedText type="bodySmall">$1000 - $3000</ThemedText>
                </Pressable>
                <Pressable 
                  style={[styles.priceButton, { backgroundColor: theme.surface }]}
                  onPress={() => setPriceRange([3000, 5000])}
                >
                  <ThemedText type="bodySmall">$3000+</ThemedText>
                </Pressable>
              </View>
            </View>

            <View style={styles.filterSection}>
              <ThemedText type="h3" style={styles.filterTitle}>Amenities</ThemedText>
              <View style={styles.amenitiesGrid}>
                {filterOptions.amenities.map((amenity) => (
                  <Pressable
                    key={amenity.id}
                    style={[
                      styles.amenityChip,
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

            <View style={styles.filterSection}>
              <ThemedText type="h3" style={styles.filterTitle}>Rating</ThemedText>
              <View style={styles.ratingButtons}>
                {filterOptions.ratings.map((rating) => (
                  <Pressable
                    key={rating.id}
                    style={[
                      styles.ratingButton,
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

          <View style={[styles.modalFooter, { 
            backgroundColor: theme.background,
            paddingBottom: insets.bottom + Spacing.md,
            borderTopColor: theme.border,
          }]}>
            <Pressable 
              style={[styles.applyButton, { backgroundColor: theme.primary }]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: Spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.lg,
    height: 48,
    borderRadius: BorderRadius.medium,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderRadius: BorderRadius.medium,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  section: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  hotelsList: {
    paddingHorizontal: Spacing.lg,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  filterContent: {
    flex: 1,
  },
  filterScrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  filterSection: {
    gap: Spacing.md,
  },
  filterTitle: {
    fontWeight: '600',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRangeButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priceButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  ratingButtons: {
    gap: Spacing.sm,
  },
  ratingButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  modalFooter: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  applyButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
});
