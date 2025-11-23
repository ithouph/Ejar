import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';

function FAQItem({ question, answer }) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.faqCard, { backgroundColor: theme.surface }]}>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={styles.faqHeader}
      >
        <View style={styles.questionContainer}>
          <ThemedText type="bodyLarge" style={styles.question}>
            {question}
          </ThemedText>
        </View>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.textSecondary}
        />
      </Pressable>
      {expanded && (
        <View style={styles.answerContainer}>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            {answer}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

export default function FAQ() {
  const insets = useScreenInsets();

  const faqs = [
    {
      question: 'How do I book a property?',
      answer: 'Browse our listings, select a property you like, and click the "Book Now" button. Fill in your details and confirm your booking.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and digital wallet payments. You can also use your Ejar wallet balance.',
    },
    {
      question: 'How do I add money to my wallet?',
      answer: 'Go to the Balance page in your profile, tap "Add Balance", enter the amount, upload proof of payment, and wait for admin approval.',
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking up to 24 hours before check-in for a full refund. Cancellations made less than 24 hours before check-in may incur a fee.',
    },
    {
      question: 'How do I contact a property owner?',
      answer: 'On each property listing, you\'ll find contact options including WhatsApp and email. Click the contact button to reach out directly.',
    },
    {
      question: 'What is the wedding planning feature?',
      answer: 'Our wedding planning feature helps you organize your special day. You can manage guest lists, plan events, and coordinate wedding details all in one place.',
    },
    {
      question: 'How do I list my property?',
      answer: 'Go to the Posts section, tap the "+" button, fill in your property details, upload photos, and submit. Your listing will be reviewed and published.',
    },
    {
      question: 'Can I save posts for later?',
      answer: 'Yes! Tap the heart icon on any post to save it. You can view all your saved posts in the Saved section.',
    },
    {
      question: 'How do I leave a review?',
      answer: 'After your stay or purchase, you can create a new post with a rating (1-5 stars) and share your experience with the community.',
    },
    {
      question: 'What categories are available for listings?',
      answer: 'You can list items in the following categories: Phones, Laptops, Electronics, Cars, and Property. Choose Rent or Sell when creating your post.',
    },
    {
      question: 'How do I edit my profile?',
      answer: 'Go to your Profile, tap "Edit Profile", and update your details including name, phone, WhatsApp number, and profile picture.',
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard encryption and secure payment gateways to protect your financial information.',
    },
  ];

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
          Frequently Asked Questions
        </ThemedText>

        <ThemedText type="body" style={styles.subtitle}>
          Find answers to common questions about using Ejar.
        </ThemedText>

        <View style={styles.faqList}>
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
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
    gap: Spacing.lg,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    opacity: 0.7,
  },
  faqList: {
    gap: Spacing.md,
  },
  faqCard: {
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  questionContainer: {
    flex: 1,
  },
  question: {
    fontWeight: '600',
  },
  answerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
});
