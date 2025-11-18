import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Pressable, TextInput } from 'react-native';
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

        <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
          <Feather name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Find the best for your holiday"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

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
});
