import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Button } from '../components/Button';
import { useTheme } from '../hooks/useTheme';
import { Spacing } from '../theme/global';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const icons = [
  { name: 'home', top: '10%', left: '15%' },
  { name: 'map-pin', top: '15%', right: '20%' },
  { name: 'calendar', top: '25%', left: '25%' },
  { name: 'heart', top: '30%', right: '15%' },
  { name: 'star', top: '45%', left: '10%' },
  { name: 'search', top: '50%', right: '25%' },
  { name: 'globe', top: '65%', left: '20%' },
  { name: 'sun', top: '70%', right: '18%' },
];

export default function Welcome({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      {icons.map((icon, index) => (
        <Animated.View
          key={index}
          entering={FadeIn.delay(index * 100)}
          style={[
            styles.icon,
            {
              top: icon.top,
              left: icon.left,
              right: icon.right,
            },
          ]}
        >
          <Feather name={icon.name} size={24} color={theme.textSecondary} opacity={0.3} />
        </Animated.View>
      ))}
      
      <View style={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <Animated.View entering={FadeInDown.delay(400)} style={styles.centerContent}>
          <Feather name="map-pin" size={64} color={theme.primary} />
          <ThemedText type="display" style={styles.title}>
            Welcome to TravelStay
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
            Immerse yourself in the world of hotels and communicate with friends using only quotes from famous works.
          </ThemedText>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(600)} style={styles.buttonContainer}>
          <Button onPress={() => navigation.navigate('Login')}>
            Get started
          </Button>
        </Animated.View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    position: 'absolute',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['3xl'],
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  buttonContainer: {
    paddingBottom: Spacing.xl,
  },
});
