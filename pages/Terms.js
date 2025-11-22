import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';

export default function Terms() {
  const { theme } = useTheme();
  const insets = useScreenInsets();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <ThemedText type="h1" style={styles.title}>
          Terms of Service
        </ThemedText>

        <ThemedText type="bodySmall" style={[styles.date, { color: theme.textSecondary }]}>
          Last updated: November 2024
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            1. Acceptance of Terms
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            By accessing and using Ejar, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            2. Use of Service
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            Ejar provides a platform for booking hotels and apartments. You agree to use the service only for lawful purposes and in accordance with these terms.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            3. User Accounts
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            4. Booking and Payments
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            All bookings are subject to availability and confirmation. Payment terms and cancellation policies vary by property and will be clearly stated before booking.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            5. Limitation of Liability
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            Ejar acts as an intermediary between users and property owners. We are not responsible for the quality of accommodations or services provided by third-party vendors.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            6. Changes to Terms
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
          </ThemedText>
        </View>

        <View style={[styles.contactBox, { backgroundColor: theme.surface }]}>
          <ThemedText type="bodyLarge" style={styles.contactTitle}>
            Questions about our terms?
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Contact us at legal@ejar.com
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  date: {
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  paragraph: {
    lineHeight: 24,
  },
  contactBox: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.lg,
  },
  contactTitle: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
});
