import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { StickyHeader } from "../components/StickyHeader";
import { useTheme } from "../hooks/useTheme";
import { useScreenInsets } from "../hooks/useScreenInsets";
import { Spacing, BorderRadius, settingsPageStyles as styles } from "../theme/global";
import { useAuth } from "../contexts/AuthContext";
import { users as usersApi, wallet as walletApi } from "../services/database";

export default function Settings({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    loadUserProfile();
    loadWalletBalance();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    try {
      const profile = await usersApi.getUser(user.id);
      setUserProfile({
        phone_number: user.phone || "Unknown",
        created_at: user.created_at,
      });
    } catch (error) {
      console.error("Error loading user profile:", error);
      setUserProfile({
        phone_number: user.phone || "Unknown",
        created_at: user.created_at,
      });
    }
  };

  const loadWalletBalance = async () => {
    if (!user) {
      setWalletBalance(0);
      setLoadingBalance(false);
      return;
    }

    try {
      setLoadingBalance(true);
      const walletData = await walletApi.get(user.id);

      if (walletData) {
        const balance = parseFloat(walletData.balance) || 0;
        setWalletBalance(balance);
      } else {
        setWalletBalance(0);
      }
    } catch (error) {
      console.error("Error loading wallet balance:", error);
      setWalletBalance(0);
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleSettingsAction = () => {
    Alert.alert(
      "App Preferences",
      "Choose an option",
      [
        {
          text: "Notifications",
          onPress: () => {
            Alert.alert("Coming Soon", "Notifications settings are coming soon!");
          },
        },
        {
          text: "Privacy Settings",
          onPress: () => {
            Alert.alert("Coming Soon", "Privacy settings are coming soon!");
          },
        },
        {
          text: "About",
          onPress: () => {
            Alert.alert("About Ejar", "Ejar v1.0.0\nMade with ❤️");
          },
        },
        { text: "Cancel", onPress: () => { }, isPreferred: true },
      ]
    );
  };

  const handleMemberApprovals = () => {
    navigation.navigate("MemberApprovals");
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("ℹ️  Logout cancelled");
          },
          isPreferred: true,
        },
        {
          text: "Log Out",
          onPress: async () => {
            try {
              console.log("\n🔴 LOGOUT INITIATED FROM SETTINGS PAGE");
              await signOut();
              // Logout is complete - AuthGate will automatically show Welcome page
              console.log("✅ LOGOUT COMPLETE - App will now show Welcome page");
            } catch (error) {
              console.error("❌ Logout failed:", error);
              Alert.alert("Error", "Failed to log out. Please try again.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <StickyHeader
        title="Settings"
        theme={theme}
        scrollY={scrollY}
        insets={insets}
        actionIcon="sliders"
        onAction={handleSettingsAction}
      />

      <ScrollView
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        contentContainerStyle={[
          { flexGrow: 1 },
          styles.scrollContent,
          {
            paddingTop: Spacing.xl * 3.5,
            paddingBottom: insets.bottom + Spacing.xl + (Spacing.tabBarHeight || 80),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => navigation.navigate("EditProfile")}
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.surface ,
              shadowColor: theme.surface,
            },
          ]}
        >
          <View style={styles.profilePhotoContainer}>
            <Image
              source={{
                uri:
                  userProfile?.photo_url ||
                  user?.user_metadata?.avatar_url ||
                  "https://via.placeholder.com/100",
              }}
              style={styles.profilePhoto}
            />
          </View>
          <View style={styles.profileInfo}>
            <ThemedText
              type="bodyLarge"
              lightColor="#FFF"
              darkColor="#FFF"
              style={styles.profileName}
            >
              {userProfile?.phone_number || user?.phone || "Phone User"}
            </ThemedText>
            <ThemedText
              type="bodySmall"
              lightColor="rgba(255,255,255,0.8)"
              darkColor="rgba(255,255,255,0.8)"
            >
              Ejar Marketplace Member
            </ThemedText>
          </View>
          <Feather name="chevron-right" size={24} color="#FFF" />
        </Pressable>

        <View style={styles.sectionLabel}>
          <ThemedText type="bodyLarge" style={styles.sectionLabelText}>
            My Account
          </ThemedText>
        </View>

        <Pressable
          onPress={() => navigation.navigate("Balance")}
          style={[styles.balanceCard, { backgroundColor: theme.primary }]}
        >
          <View style={styles.balanceContent}>
            <View>
              <ThemedText
                type="caption"
                lightColor="#FFF"
                darkColor="#FFF"
                style={styles.balanceLabel}
              >
                Available Balance
              </ThemedText>
              {loadingBalance ? (
                <ActivityIndicator
                  size="small"
                  color="#FFF"
                  style={{ marginVertical: 8 }}
                />
              ) : (
                <ThemedText
                  type="h1"
                  lightColor="#FFF"
                  darkColor="#FFF"
                  style={styles.balanceAmount}
                >
                  ${walletBalance.toFixed(2)}
                </ThemedText>
              )}
            </View>
            <View style={styles.balanceIcon}>
              <Feather name="dollar-sign" size={40} color="#FFF" />
            </View>
          </View>
        </Pressable>

        <Pressable
          onPress={handleMemberApprovals}
          style={[styles.balanceCard, { backgroundColor: theme.primary + "CC" }]}
        >
          <View style={styles.balanceContent}>
            <View>
              <ThemedText
                type="caption"
                lightColor="#FFF"
                darkColor="#FFF"
                style={styles.balanceLabel}
              >
                Payment Approvals
              </ThemedText>
              <ThemedText
                type="bodyMedium"
                lightColor="#FFF"
                darkColor="#FFF"
                style={styles.balanceAmount}
              >
                Review Pending
              </ThemedText>
            </View>
            <View style={styles.balanceIcon}>
              <Feather name="check-square" size={40} color="#FFF" />
            </View>
          </View>
        </Pressable>

        <View style={styles.sectionLabel}>
          <ThemedText type="bodyLarge" style={styles.sectionLabelText}>
            Help & Legal
          </ThemedText>
        </View>

        <View style={styles.gridContainer}>
          <Animated.View
            entering={FadeInDown.delay(100).duration(600)}
            style={styles.gridItem}
          >
            <Pressable
              style={[styles.gridCard, { backgroundColor: theme.surface }]}
              onPress={() => navigation.navigate("Review")}
            >
              <View
                style={styles.gridIconContainer}
              >
                <Feather name="star" size={24} color={theme.primary} />
              </View>
              <ThemedText type="bodySmall" style={styles.gridTitle}>
                My Reviews
              </ThemedText>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(150).duration(600)}
            style={styles.gridItem}
          >
            <Pressable
              style={[styles.gridCard, { backgroundColor: theme.surface }]}
              onPress={() => navigation.navigate("Support")}
            >
              <View
                style={styles.gridIconContainer}
              >
                <Feather name="headphones" size={24} color={theme.primary} />
              </View>
              <ThemedText type="bodySmall" style={styles.gridTitle}>
                Support
              </ThemedText>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            style={styles.gridItem}
          >
            <Pressable
              style={[styles.gridCard, { backgroundColor: theme.surface }]}
              onPress={() => navigation.navigate("Terms")}
            >
              <View
                style={styles.gridIconContainer}
              >
                <Feather name="file-text" size={24} color={theme.primary} />
              </View>
              <ThemedText type="bodySmall" style={styles.gridTitle}>
                Terms
              </ThemedText>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(250).duration(600)}
            style={styles.gridItem}
          >
            <Pressable
              style={[styles.gridCard, { backgroundColor: theme.surface }]}
              onPress={() => navigation.navigate("Privacy")}
            >
              <View
                style={styles.gridIconContainer}
              >
                <Feather name="shield" size={24} color={theme.primary} />
              </View>
              <ThemedText type="bodySmall" style={styles.gridTitle}>
                Privacy
              </ThemedText>
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.sectionLabel}>
          <ThemedText type="bodyLarge" style={styles.sectionLabelText}>
            Account
          </ThemedText>
        </View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={{ 
            paddingHorizontal: Spacing.xl,
            marginTop: Spacing.lg,
            marginBottom: Spacing.xl
          }}
        >
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              {
                backgroundColor: "#DC2626",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: Spacing.md,
                paddingVertical: Spacing.lg,
                paddingHorizontal: Spacing.xl,
                borderRadius: 12,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Feather name="log-out" size={22} color="#FFF" />
            <ThemedText 
              type="bodyLarge" 
              style={{ 
                color: "#FFF",
                fontWeight: "600",
                letterSpacing: 0.3
              }}
            >
              Log Out
            </ThemedText>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}


