import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';

export default function Privacy() {
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
          Privacy Policy
        </ThemedText>

        <ThemedText type="bodySmall" style={[styles.date, { color: theme.textSecondary }]}>
          Last updated: November 2024
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            1. Information We Collect
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            We collect information you provide directly to us, such as your name, email address, phone number, and payment information when you create an account or make a booking.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            2. How We Use Your Information
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            We use the information we collect to process bookings, communicate with you, improve our services, and comply with legal obligations.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            3. Information Sharing
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            We do not sell your personal information. We share your information only with property owners to complete bookings and with service providers who assist in operating our platform.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            4. Data Security
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            5. Your Rights
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            You have the right to access, correct, or delete your personal information. You can manage your account settings or contact us to exercise these rights.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            6. Cookies and Tracking
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            We use cookies and similar tracking technologies to improve your experience, analyze usage patterns, and deliver personalized content.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            7. Children's Privacy
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            8. Changes to This Policy
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </ThemedText>
        </View>

        <View style={[styles.contactBox, { backgroundColor: theme.surface }]}>
          <ThemedText type="bodyLarge" style={styles.contactTitle}>
            Privacy concerns?
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Contact us at privacy@ejar.com
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
