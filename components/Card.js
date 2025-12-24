import React from 'react';
import { StyleSheet, Pressable, Image, View, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, Shadows } from '../theme/global';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SCREEN_WIDTH = Dimensions.get('window').width;

const springConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
};

function formatPrice(price) {
  if (!price && price !== 0) return '';
  return new Intl.NumberFormat('en-US').format(price) + ' MRU';
}

export function HotelCard({ item, onPress, onFavoritePress, isFavorite }) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const imageUri = item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400';
  const title = item.name || item.title || 'Untitled';
  const location = item.location || item.city?.name || 'Nouakchott';

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, animatedStyle, Shadows.medium]}
    >
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.gradient}>
        <Pressable
          onPress={() => onFavoritePress(item.id)}
          style={styles.favoriteButton}
        >
          <Feather
            name={isFavorite ? 'heart' : 'heart'}
            size={20}
            color={isFavorite ? theme.error : '#FFF'}
            style={{ fontWeight: isFavorite ? 'bold' : 'normal' }}
          />
        </Pressable>
        <View style={styles.content}>
          <ThemedText type="bodyLarge" style={styles.name} lightColor="#FFF" darkColor="#FFF">
            {title}
          </ThemedText>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={14} color="#FFF" />
            <ThemedText type="bodySmall" style={styles.location} lightColor="#FFF" darkColor="#FFF">
              {location}
            </ThemedText>
          </View>
          <View style={styles.priceRow}>
            <ThemedText type="h3" style={styles.price} lightColor="#FFF" darkColor="#FFF">
              {formatPrice(item.price)}
            </ThemedText>
            {item.category ? (
              <View style={styles.categoryBadge}>
                <ThemedText type="bodySmall" style={styles.categoryText}>
                  {item.category.name || item.category}
                </ThemedText>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.85,
    height: 280,
    borderRadius: BorderRadius.large,
    marginRight: Spacing.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: Spacing.lg,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: Spacing.xs,
  },
  name: {
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  location: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  rating: {
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  price: {
    fontWeight: '700',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.small,
  },
  categoryText: {
    color: '#FFF',
    textTransform: 'capitalize',
  },
});
