import React from "react";
import { View, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { ThemedText } from "./ThemedText";
import { Spacing, BorderRadius, buttonStyles } from "../theme/global";

export function SearchOverlay({
  searchContentAnimatedStyle,
  searchContentOpacity,
  buttonsAnimatedStyle,
  searchInputAnimatedStyle,
  theme,
  insets,
  searchInputRef,
  searchQuery,
  onChangeText,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  amenities,
  selectedAmenities,
  toggleAmenity,
}) {
  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: theme.background, // Base color
      opacity: searchContentOpacity.value, // Fade in background
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: searchContentOpacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          paddingTop: insets.top,
        },
        searchContentAnimatedStyle,
      ]}
    >
      {/* Background Layer */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
          backgroundAnimatedStyle,
        ]}
      />

      {/* Search Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.sm, // Match Discover page padding
          gap: Spacing.md,
          borderBottomWidth: 1.5,
          borderBottomColor: theme.border,
        }}
      >
        <Animated.View style={buttonsAnimatedStyle}>
          <Pressable onPress={onClose}>
            <Feather name="arrow-left" size={24} color={theme.textPrimary} />
          </Pressable>
        </Animated.View>

        <Animated.View
          style={[
            {
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.surface,
              borderRadius: BorderRadius.medium,
              paddingHorizontal: Spacing.md,
              borderWidth: 1.5,
              borderColor: theme.border,
            },
            searchInputAnimatedStyle,
          ]}
        >
          <Feather name="search" size={20} color={theme.textSecondary} />
          <TextInput
            ref={searchInputRef}
            style={{
              flex: 1,
              marginLeft: Spacing.sm,
              fontSize: 16,
              color: theme.textPrimary,
              padding: 0,
            }}
            placeholder="Search..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={onChangeText}
          />
          {searchQuery.trim().length > 0 && (
            <View style={{ marginLeft: Spacing.xs, paddingLeft: Spacing.sm, borderLeftWidth: 1, borderLeftColor: theme.border }}>
              <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
                Results
              </ThemedText>
            </View>
          )}
        </Animated.View>

        <Animated.View style={buttonsAnimatedStyle}>
          <Pressable
            style={[
              buttonStyles.icon,
              {
                backgroundColor: theme.primary,
              },
            ]}
            onPress={onClose}
          >
            <Feather name="send" size={20} color="#FFF" />
          </Pressable>
        </Animated.View>
      </View>

      {/* Filter Content */}
      <Animated.ScrollView
        style={contentAnimatedStyle}
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.lg,
          gap: Spacing.lg,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Categories */}
        <View>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>
            Categories
          </ThemedText>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm }}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => onSelectCategory(cat.id)}
                  style={{
                    paddingHorizontal: Spacing.lg,
                    paddingVertical: Spacing.sm,
                    borderRadius: 20,
                    backgroundColor: isSelected ? theme.primary : theme.surface,
                    borderWidth: 1.5,
                    borderColor: isSelected ? theme.primary : theme.border,
                    opacity: isSelected ? 1 : 0.8,
                  }}
                >
                  <ThemedText
                    style={{
                      color: isSelected ? "#FFF" : theme.textPrimary,
                      fontWeight: isSelected ? "600" : "400",
                    }}
                  >
                    {cat.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Price Range */}
        <View>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>
            Price Range
          </ThemedText>
          <View style={{ flexDirection: "row", gap: Spacing.sm }}>
            {[
              { label: "$0 - $1K", range: [0, 1000] },
              { label: "$1K - $3K", range: [1000, 3000] },
              { label: "$3K+", range: [3000, 5000] },
            ].map((option, idx) => {
              const isSelected =
                priceRange[0] === option.range[0] &&
                priceRange[1] === option.range[1];
              return (
                <Pressable
                  key={idx}
                  onPress={() => onPriceChange(option.range)}
                  style={{
                    flex: 1,
                    paddingVertical: Spacing.md,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: BorderRadius.medium,
                    backgroundColor: isSelected ? theme.primary : theme.surface,
                    borderWidth: 1.5,
                    borderColor: isSelected ? theme.primary : theme.border,
                    opacity: isSelected ? 1 : 0.8,
                  }}
                >
                  <ThemedText
                    type="bodySmall"
                    style={{
                      color: isSelected ? "#FFF" : theme.textPrimary,
                      fontWeight: isSelected ? "600" : "400",
                    }}
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Amenities */}
        <View>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>
            Amenities
          </ThemedText>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm }}
          >
            {amenities.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity.id);
              return (
                <Pressable
                  key={amenity.id}
                  onPress={() => toggleAmenity(amenity.id)}
                  style={[
                    buttonStyles.chip,
                    {
                      backgroundColor: isSelected
                        ? theme.primary
                        : theme.surface,
                      borderWidth: 1.5,
                      borderColor: isSelected ? theme.primary : theme.border,
                      opacity: isSelected ? 1 : 0.8,
                    },
                  ]}
                >
                  <Feather
                    name={amenity.icon}
                    size={16}
                    color={isSelected ? "#FFF" : theme.textPrimary}
                  />
                  <ThemedText
                    type="bodySmall"
                    style={{
                      color: isSelected ? "#FFF" : theme.textPrimary,
                      fontWeight: isSelected ? "600" : "400",
                    }}
                  >
                    {amenity.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Animated.ScrollView>
    </Animated.View>
  );
}
