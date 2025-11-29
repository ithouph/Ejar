import React from "react";
import { View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { Button } from "../components/Button";
import { useTheme } from "../hooks/useTheme";
import { Spacing } from "../theme/global";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const icons = [
  { name: "home", top: "10%", left: "15%" }, // Dashboard / Home
  { name: "shopping-cart", top: "15%", right: "20%" }, // Buy / Marketplace
  { name: "tag", top: "25%", left: "25%" }, // Sell / Listing
  { name: "dollar-sign", top: "30%", right: "15%" }, // Payments / Wallet
  { name: "map", top: "45%", left: "10%" }, // Map / Nearby properties
  { name: "search", top: "50%", right: "25%" }, // Search
  { name: "heart", top: "65%", left: "20%" }, // Favorites / Wishlist
  { name: "users", top: "70%", right: "18%" }, // Members / Community
];

export default function Welcome({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={{ flex: 1 }}>
      {icons.map((icon, index) => (
        <Animated.View
          key={index}
          entering={FadeIn.delay(index * 200).duration(1800)}
          style={[
            {
              position: "absolute",
              top: icon.top,
              left: icon.left,
              right: icon.right,
            },
          ]}
        >
          <Feather
            name={icon.name}
            size={28}
            color={theme.textSecondary}
            opacity={0.2}
          />
        </Animated.View>
      ))}

      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          paddingHorizontal: Spacing.xl,
          paddingTop: Spacing["3xl"],
          paddingBottom: insets.bottom + Spacing.xl,
        }}
      >
        <Animated.View
          entering={FadeInDown.delay(400)}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: Spacing.lg,
          }}
        >
          <Feather name="map-pin" size={64} color={theme.primary} />
          <ThemedText
            type="display"
            style={{
              textAlign: "center",
            }}
          >
            Welcome to Ejar
          </ThemedText>
          <ThemedText
            type="body"
            style={{
              textAlign: "center",
              paddingHorizontal: Spacing.lg,
              color: theme.textSecondary,
            }}
          >
            Immerse yourself in the world of hotels and communicate with friends
            using only quotes from famous works.
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(600)}
          style={{
            paddingBottom: Spacing.xl,
          }}
        >
          <Button onPress={() => navigation.navigate("Login")}>
            Get started
          </Button>
        </Animated.View>
      </View>
    </ThemedView>
  );
}
