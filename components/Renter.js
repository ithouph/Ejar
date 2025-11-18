import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../theme/global';

export function AgentCard({ agent, onMessage, onCall }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <ThemedText type="h2" style={styles.title}>
        Listing Agent
      </ThemedText>
      <View style={styles.content}>
        <Image source={{ uri: agent.photo }} style={styles.photo} />
        <View style={styles.info}>
          <ThemedText type="bodyLarge" style={styles.name}>
            {agent.name}
          </ThemedText>
          <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
            {agent.role}
          </ThemedText>
        </View>
        <View style={styles.actions}>
          <Pressable
            onPress={onMessage}
            style={[styles.actionButton, { borderColor: theme.primary }]}
          >
            <Feather name="message-circle" size={20} color={theme.primary} />
          </Pressable>
          <Pressable
            onPress={onCall}
            style={[styles.actionButton, { borderColor: theme.primary }]}
          >
            <Feather name="phone" size={20} color={theme.primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    marginVertical: Spacing.md,
  },
  title: {
    marginBottom: Spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  photo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
