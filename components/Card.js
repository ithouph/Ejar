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
            style={{ fontWeight: isFavorite ? 'bold' : 'normal' }}
          />
        </Pressable>
        <View style={styles.content}>
          <ThemedText type="bodyLarge" style={styles.name} lightColor="#FFF" darkColor="#FFF">
            {item.name}
          </ThemedText>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={14} color="#FFF" />
            <ThemedText type="bodySmall" style={styles.location} lightColor="#FFF" darkColor="#FFF">
              {item.location}
            </ThemedText>
          </View>
          <View style={styles.ratingRow}>
            <Feather name="star" size={14} color="#FBBF24" />
            <ThemedText type="bodySmall" style={styles.rating} lightColor="#FFF" darkColor="#FFF">
              {item.rating}
            </ThemedText>
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
});
