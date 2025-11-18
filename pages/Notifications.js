import React from 'react';
import { StyleSheet, FlatList, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { notificationsData } from '../data/notificationsData';

function NotificationItem({ notification }) {
  const { theme } = useTheme();

  const getIcon = (type) => {
    switch (type) {
      case 'booking': return 'check-circle';
      case 'recommendation': return 'map-pin';
      case 'price': return 'trending-down';
      case 'review': return 'star';
      default: return 'bell';
    }
  };

  return (
    <Pressable
      style={[
        styles.notificationCard,
        {
          backgroundColor: notification.read ? theme.backgroundRoot : theme.surface,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: notification.read ? theme.surface : theme.primary + '20',
          },
        ]}
      >
        <Feather
          name={getIcon(notification.type)}
          size={20}
          color={notification.read ? theme.textSecondary : theme.primary}
        />
      </View>
      <View style={styles.content}>
        <ThemedText type="bodyLarge" style={styles.title}>
          {notification.title}
        </ThemedText>
        <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
          {notification.message}
        </ThemedText>
        <ThemedText type="caption" style={[styles.date, { color: theme.textSecondary }]}>
          {notification.date}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export default function Notifications() {
  const insets = useScreenInsets();

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={notificationsData}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        ListHeaderComponent={
          <ThemedText type="h1" style={styles.header}>
            Notifications
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
  list: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
  },
  title: {
    fontWeight: '600',
  },
  date: {
    marginTop: Spacing.xs,
  },
});
