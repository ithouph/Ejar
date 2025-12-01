import React, { useState, useEffect } from "react";
import { View, Pressable, TextInput, Alert, ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useTheme } from "../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Spacing,
  inputStyles,
  buttonStyles,
  layoutStyles,
  spacingStyles,
} from "../theme";
import { useAuth } from "../contexts/AuthContext";
import { users as usersApi } from "../services/database";

function InfoField({ label, value, editable = false, onChangeText, theme }) {
  return (
    <View style={inputStyles.container}>
      <ThemedText
        type="bodySmall"
        style={[inputStyles.label, { color: theme.textSecondary }]}
      >
        {label}
      </ThemedText>
      <TextInput
        style={[
          inputStyles.input,
          {
            backgroundColor: theme.surface,
            color: theme.textPrimary,
            borderColor: theme.border,
            opacity: editable ? 1 : 0.6,
          },
        ]}
        value={value?.toString() || ""}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={theme.textSecondary}
        editable={editable}
        selectTextOnFocus={editable}
        keyboardType={label.includes("Post") ? "number-pad" : "default"}
      />
    </View>
  );
}

export default function EditProfile({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, refreshUser } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [postLimit, setPostLimit] = useState("");
  const [postsCount, setPostsCount] = useState("");
  const [isMember, setIsMember] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const userDetails = await usersApi.getUser(user.id);

      if (userDetails) {
        setPhoneNumber(userDetails.phone_number || "");
        setWhatsappPhone(userDetails.whatsapp_phone || "");
        setPostLimit(userDetails.post_limit?.toString() || "0");
        setPostsCount(userDetails.posts_count?.toString() || "0");
        setIsMember(userDetails.is_member ? "Yes" : "No");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // Only whatsapp_phone is editable
      const updateData = {
        whatsapp_phone: whatsappPhone || null,
      };

      await usersApi.updateUser(user.id, updateData);

      await new Promise((resolve) => setTimeout(resolve, 500));

      await refreshUser();
      await loadUserProfile();

      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving profile:", error);
      const message = error.message || "Failed to update profile. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={[layoutStyles.container, layoutStyles.columnCenter]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={layoutStyles.container}>
      <View
        style={[
          layoutStyles.header,
          {
            backgroundColor: theme.background,
            paddingTop: insets.top + Spacing.md,
            justifyContent: "space-between",
          },
        ]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={buttonStyles.icon}
        >
          <Feather name="arrow-left" size={24} color={theme.textPrimary} />
        </Pressable>
        <ThemedText type="h2" style={{ fontWeight: "600" }}>
          My Profile
        </ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={[
          spacingStyles.pbXl,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Information Section */}
        <View style={[layoutStyles.sectionPadded, spacingStyles.pbXl]}>
          <ThemedText
            type="h3"
            style={{ fontWeight: "700", marginBottom: Spacing.xs }}
          >
            Account Information
          </ThemedText>

          <InfoField
            label="Phone Number"
            value={phoneNumber}
            editable={false}
            theme={theme}
          />

          <InfoField
            label="WhatsApp Number"
            value={whatsappPhone}
            editable={true}
            onChangeText={setWhatsappPhone}
            theme={theme}
          />
        </View>

        {/* Account Status Section */}
        <View style={[layoutStyles.sectionPadded, spacingStyles.pbXl]}>
          <ThemedText
            type="h3"
            style={{ fontWeight: "700", marginBottom: Spacing.xs }}
          >
            Account Status
          </ThemedText>

          <InfoField
            label="Posts Count"
            value={postsCount}
            editable={false}
            theme={theme}
          />

          <InfoField
            label="Post Limit"
            value={postLimit}
            editable={false}
            theme={theme}
          />

          <InfoField
            label="Member"
            value={isMember}
            editable={false}
            theme={theme}
          />

          <InfoField
            label="Hit Limit"
            value={hitLimit}
            editable={false}
            theme={theme}
          />
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={[
            buttonStyles.primaryLarge,
            spacingStyles.mxLg,
            spacingStyles.mtMd,
            {
              backgroundColor: saving ? theme.textSecondary : theme.primary,
              marginBottom: Spacing["2xl"],
              opacity: saving ? 0.7 : 1,
            },
          ]}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <ThemedText
              type="bodyLarge"
              lightColor="#FFF"
              darkColor="#FFF"
              style={{ fontWeight: "600" }}
            >
              Save Changes
            </ThemedText>
          )}
        </Pressable>
      </KeyboardAwareScrollView>
    </ThemedView>
  );
}
