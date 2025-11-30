import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { Spacing } from '../theme/global';

export function TabBarIcon({ name, color, focused }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: focused ? 1.1 : scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle]}>
      <Feather name={name} size={24} color={color} />
    </Animated.View>
  );
}

export function PageHeader({ title, theme, onBack, onAction, actionIcon, onViewToggle, viewMode }) {
  return (
    <View style={[styles.pageHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.headerButton}>
          <Feather name="arrow-left" size={24} color={theme.textPrimary} />
        </Pressable>
      ) : (
        <View style={styles.headerButton} />
      )}
      
      <ThemedText type="h1" style={styles.headerTitle}>
        {title}
      </ThemedText>
      
      <View style={styles.headerActions}>
        {onViewToggle ? (
          <Pressable onPress={onViewToggle} style={styles.headerButton}>
            <Feather 
              name={viewMode === 'normal' ? 'grid' : 'list'} 
              size={20} 
              color={theme.primary} 
            />
          </Pressable>
        ) : null}
        
        {onAction ? (
          <Pressable onPress={onAction} style={styles.headerButton}>
            <Feather name={actionIcon || 'plus-circle'} size={24} color={theme.primary} />
          </Pressable>
        ) : actionIcon ? (
          <View style={styles.headerButton} />
        ) : null}
      </View>
    </View>
  );
}

export function SimpleHeader({ title, theme, onClose }) {
  return (
    <View style={[styles.simpleHeader, { backgroundColor: theme.background }]}>
      <ThemedText type="h1" style={styles.simpleTitle}>
        {title}
      </ThemedText>
      {onClose ? (
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Feather name="x" size={24} color={theme.textPrimary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  simpleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  simpleTitle: {
    fontWeight: '700',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
