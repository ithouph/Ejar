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
  { name: 'home', top: '8%', left: '10%', size: 40 },
  { name: 'dollar-sign', top: '12%', right: '15%', size: 36 },
  { name: 'shopping-bag', top: '18%', left: '20%', size: 32 },
  { name: 'search', top: '22%', right: '25%', size: 38 },
  { name: 'heart', top: '28%', left: '15%', size: 34 },
  { name: 'star', top: '32%', right: '18%', size: 30 },
  { name: 'tag', top: '38%', left: '25%', size: 36 },
  { name: 'smartphone', top: '42%', right: '20%', size: 32 },
  { name: 'key', top: '48%', left: '12%', size: 34 },
  { name: 'send', top: '52%', right: '22%', size: 30 },
  { name: 'map-pin', top: '58%', left: '18%', size: 36 },
  { name: 'credit-card', top: '62%', right: '16%', size: 32 },
  { name: 'package', top: '68%', left: '22%', size: 34 },
  { name: 'shopping-cart', top: '72%', right: '20%', size: 30 },
  { name: 'truck', top: '78%', left: '15%', size: 36 },
  { name: 'gift', top: '82%', right: '18%', size: 32 },
];

export default function Welcome({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      {icons.map((icon, index) => (
        <Animated.View
          key={index}
          entering={FadeIn.delay(index * 50)}
          style={[
            styles.icon,
            {
              top: icon.top,
              left: icon.left,
              right: icon.right,
            },
          ]}
        >
          <Feather name={icon.name} size={icon.size} color={theme.textSecondary} opacity={0.15} />
        </Animated.View>
      ))}
      
      <View style={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <Animated.View entering={FadeInDown.delay(400)} style={styles.centerContent}>
          <Feather name="map-pin" size={64} color={theme.primary} />
          <ThemedText type="display" style={styles.title}>
            Welcome to Ejar
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
            Discover properties, buy and sell items, manage your wallet, and share your experiences in one place.
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
