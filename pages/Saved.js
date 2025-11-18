import React, { useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { HotelCard } from '../components/Card';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing } from '../theme/global';
import { savedList } from '../data/savedList';

export default function Saved({ navigation }) {
  const insets = useScreenInsets();
  const [favorites, setFavorites] = useState(savedList.map(item => item.id));

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={savedList}
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
