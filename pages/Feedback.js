import React from 'react';
import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedView } from '../components/ThemedView';
import { ReviewForm } from '../components/Review';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '../theme/global';

export default function Feedback({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const handleSubmit = (review) => {
    console.log('Review submitted:', review);
    navigation.goBack();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Feather name="x" size={24} color={theme.textPrimary} />
        </Pressable>

        <ReviewForm onSubmit={handleSubmit} />
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
    paddingHorizontal: Spacing.lg,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: Spacing.sm,
  },
});
