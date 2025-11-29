import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useTheme } from "../hooks/useTheme";
import { useScreenInsets } from "../hooks/useScreenInsets";
import { Spacing, BorderRadius } from "../theme/global";

function HelpItem({ icon, title, description, onPress }) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.helpCard, { backgroundColor: theme.surface }]}
    >
      <View
        style={[styles.iconCircle, { backgroundColor: theme.primary + "20" }]}
      >
        <Feather name={icon} size={24} color={theme.primary} />
      </View>
      <View style={styles.helpContent}>
        <ThemedText type="bodyLarge" style={styles.helpTitle}>
          {title}
        </ThemedText>
        <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
          {description}
        </ThemedText>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </Pressable>
  );
}

export default function Support({ navigation }) {
  const insets = useScreenInsets();

  const handleWhatsApp = async () => {
    const phoneNumber = "1234567890";
    const message = "Hi, I need support with Ejar";
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "WhatsApp is not installed on your device");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open WhatsApp");
    }
  };

  const handleEmail = async () => {
    const email = "support@ejar.com";
    const subject = "Support Request";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Email app is not available");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open email");
    }
  };

  const handleFAQ = () => {
    navigation.navigate("FAQ");
  };

  const helpItems = [
    {
      icon: "message-circle",
      title: "WhatsApp Support",
      description: "Chat with us on WhatsApp",
      onPress: handleWhatsApp,
    },
    {
      icon: "mail",
      title: "Email Support",
      description: "Send us an email",
      onPress: handleEmail,
    },
    {
      icon: "help-circle",
      title: "FAQ",
      description: "Find answers to common questions",
      onPress: handleFAQ,
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
          Help & Support
        </ThemedText>

        <ThemedText type="body" style={styles.subtitle}>
          We're here to help you with any questions or concerns.
        </ThemedText>

        <View style={styles.helpList}>
          {helpItems.map((item, index) => (
            <HelpItem
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              onPress={item.onPress}
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
    fontWeight: "700",
  },
  subtitle: {
    opacity: 0.7,
  },
  helpList: {
    gap: Spacing.md,
  },
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    gap: Spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
});
