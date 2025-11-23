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

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, animatedStyle, Shadows.medium]}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.gradient}>
        <Pressable
          onPress={() => onFavoritePress(item.id)}
          style={styles.favoriteButton}
        >
          <Feather
            name={isFavorite ? 'heart' : 'heart'}
            size={20}
            color={isFavorite ? theme.error : '#FFF'}
            fill={isFavorite ? theme.error : 'transparent'}
          />
        </Pressable>
        <View style={styles.content}>
          <ThemedText type="bodyLarge" style={styles.name} lightColor="#FFF" darkColor="#FFF" numberOfLines={2}>
            {item.title || item.name}
          </ThemedText>
          {item.location ? (
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={14} color="#FFF" />
              <ThemedText type="bodySmall" style={styles.location} lightColor="#FFF" darkColor="#FFF">
                {item.location}
              </ThemedText>
            </View>
          ) : null}
          {item.price ? (
            <View style={styles.priceRow}>
              <ThemedText type="body" style={styles.price} lightColor="#FFF" darkColor="#FFF">
                ${item.price}
              </ThemedText>
            </View>
          ) : null}
          {item.category ? (
            <View style={[styles.categoryBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <ThemedText type="caption" style={styles.categoryText} lightColor="#FFF" darkColor="#FFF">
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </ThemedText>
            </View>
          ) : null}
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
    marginTop: 4,
  },
  price: {
    fontWeight: '700',
    fontSize: 18,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.small,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
