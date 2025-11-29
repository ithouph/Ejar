import React from "react";
import { StyleSheet, Pressable, ScrollView, View, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";
import { useTheme } from "../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacing } from "../theme/global";

export default function Feedback({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [feedback, setFeedback] = React.useState("");

  const handleSubmit = () => {
    console.log("Feedback submitted:", feedback);
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
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Feather name="x" size={24} color={theme.textPrimary} />
        </Pressable>

        <ThemedText style={styles.title}>Send Feedback</ThemedText>
        <TextInput
          placeholder="Tell us what you think..."
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.textPrimary, borderColor: theme.border }]}
          multiline
          numberOfLines={6}
          value={feedback}
          onChangeText={setFeedback}
        />
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <ThemedText style={styles.submitText}>Submit</ThemedText>
        </Pressable>
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
    alignSelf: "flex-end",
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#333",
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
});
