import React, { useState } from "react";
import { View, StyleSheet, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius } from "../theme/global";

export function StarRating({
  rating,
  onRatingChange,
  editable = false,
  size = 24,
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => editable && onRatingChange(star)}
          disabled={!editable}
        >
          <Feather
            name="star"
            size={size}
            color={star <= rating ? "#FBBF24" : theme.border}
            style={{ fontWeight: star <= rating ? "bold" : "normal" }}
          />
        </Pressable>
      ))}
    </View>
  );
}

export function ReviewForm({ onSubmit }) {
  const { theme } = useTheme();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit({ rating, comment });
      setRating(0);
      setComment("");
    }
  };

  return (
    <View style={styles.formContainer}>
      <ThemedText type="h2" style={styles.formTitle}>
        Tell us how you feel about our App
      </ThemedText>
      <StarRating
        rating={rating}
        onRatingChange={setRating}
        editable
        size={32}
      />
      <ThemedText
        type="bodySmall"
        style={[styles.label, { color: theme.textSecondary }]}
      >
        Write your review
      </ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            color: theme.textPrimary,
            borderColor: theme.border,
          },
        ]}
        placeholder="Share your experience..."
        placeholderTextColor={theme.textSecondary}
        multiline
        numberOfLines={4}
        value={comment}
        onChangeText={setComment}
      />
      <Pressable
        onPress={handleSubmit}
        style={[
          styles.submitButton,
          {
            backgroundColor: rating > 0 ? theme.primary : theme.border,
          },
        ]}
        disabled={rating === 0}
      >
        <ThemedText
          type="body"
          style={[styles.submitText, { color: theme.buttonText }]}
        >
          Submit
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  starsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  formContainer: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  formTitle: {
    textAlign: "center",
  },
  label: {
    marginTop: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    minHeight: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    height: 56,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    fontWeight: "600",
  },
});
