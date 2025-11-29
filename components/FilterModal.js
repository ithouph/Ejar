import React, { useRef, useEffect } from "react";
import { View, ScrollView, Modal, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useTheme } from "../hooks/useTheme";
import { useScreenInsets } from "../hooks/useScreenInsets";
import {
  Spacing,
  layoutStyles,
  inputStyles,
  buttonStyles,
  spacingStyles,
} from "../theme";

const CATEGORY_OPTIONS = [
  { id: "property", label: "Property" },
  { id: "apartment", label: "Apartment" },
  { id: "house", label: "House" },
  { id: "villa", label: "Villa" },
  { id: "resort", label: "Resort" },
  { id: "hotel", label: "Hotel" },
];

const DURATION_OPTIONS = [
  { id: "1", label: "1hr" },
  { id: "2", label: "2hr" },
  { id: "3", label: "3hr" },
  { id: "4", label: "4hr" },
  { id: "5", label: "5hr" },
];

const AMENITIES_OPTIONS = [
  { id: "Wi-Fi", label: "Wi-Fi", icon: "wifi" },
  { id: "Air Conditioning", label: "Air conditioning", icon: "wind" },
  { id: "Pool", label: "Pool", icon: "droplet" },
  { id: "Parking", label: "Parking", icon: "truck" },
  { id: "Gym", label: "Gym", icon: "activity" },
  { id: "Kitchen", label: "Kitchen", icon: "coffee" },
];

const RATING_OPTIONS = [
  { id: "5", label: "5 Stars", value: 5 },
  { id: "4", label: "4+ Stars", value: 4 },
  { id: "3", label: "3+ Stars", value: 3 },
];

export const FilterModal = ({
  visible,
  onClose,
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceChange,
  selectedAmenities,
  onAmenityToggle,
  selectedRating,
  onRatingChange,
  selectedCategory,
  onCategoryChange,
  selectedDuration,
  onDurationChange,
  onClear,
  onApply,
}) => {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const searchInputRef = useRef(null);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (visible && searchInputRef.current) {
      // Small delay to ensure modal animation has started
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  }, [visible]);

  const PriceOption = ({ range, label, selected }) => (
    <Pressable
      style={[
        buttonStyles.primary,
        {
          flex: 1,
          backgroundColor: selected ? theme.primary : theme.surface,
          borderColor: selected ? theme.primary : theme.border,
          borderWidth: 1.5,
          opacity: selected ? 1 : 0.7,
        },
      ]}
      onPress={() => onPriceChange(range)}
    >
      <ThemedText
        type="bodySmall"
        style={{
          color: selected ? "#FFF" : theme.textPrimary,
          fontWeight: selected ? "600" : "400",
        }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );

  const AmenityChip = ({ amenity }) => {
    const isSelected = selectedAmenities.includes(amenity.id);
    return (
      <Pressable
        style={[
          buttonStyles.chip,
          {
            backgroundColor: isSelected ? theme.primary : theme.surface,
            borderColor: isSelected ? theme.primary : theme.border,
            borderWidth: 1.5,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.md,
          },
        ]}
        onPress={() => onAmenityToggle(amenity.id)}
      >
        <Feather
          name={amenity.icon}
          size={22}
          color={isSelected ? "#FFF" : theme.textPrimary}
          style={{ marginBottom: Spacing.xs }}
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
  };

  const CategoryButton = ({ category }) => {
    const isSelected = selectedCategory === category.id;
    return (
      <Pressable
        style={[
          buttonStyles.primary,
          {
            backgroundColor: isSelected ? theme.primary : theme.surface,
            borderColor: isSelected ? theme.primary : theme.border,
            borderWidth: 1.5,
            paddingVertical: Spacing.md,
            borderRadius: 20,
            opacity: isSelected ? 1 : 0.8,
          },
        ]}
        onPress={() => onCategoryChange(isSelected ? null : category.id)}
      >
        <ThemedText
          type="body"
          style={{
            color: isSelected ? "#FFF" : theme.textPrimary,
            fontWeight: isSelected ? "600" : "400",
          }}
        >
          {category.label}
        </ThemedText>
      </Pressable>
    );
  };

  const DurationButton = ({ duration }) => {
    const isSelected = selectedDuration === duration.id;
    return (
      <Pressable
        style={[
          buttonStyles.primary,
          {
            backgroundColor: isSelected ? theme.primary : theme.surface,
            borderColor: isSelected ? theme.primary : theme.border,
            borderWidth: 1.5,
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            borderRadius: 12,
            opacity: isSelected ? 1 : 0.8,
          },
        ]}
        onPress={() => onDurationChange(isSelected ? null : duration.id)}
      >
        <ThemedText
          type="bodySmall"
          style={{
            color: isSelected ? "#FFF" : theme.textPrimary,
            fontWeight: isSelected ? "600" : "400",
          }}
        >
          {duration.label}
        </ThemedText>
      </Pressable>
    );
  };

  const RatingButton = ({ rating }) => {
    const isSelected = selectedRating === rating.id;
    return (
      <Pressable
        style={[
          buttonStyles.primary,
          {
            backgroundColor: isSelected ? theme.primary : theme.surface,
            borderColor: isSelected ? theme.primary : theme.border,
            borderWidth: 1.5,
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: Spacing.md,
            opacity: isSelected ? 1 : 0.8,
          },
        ]}
        onPress={() => onRatingChange(isSelected ? null : rating.id)}
      >
        <Feather
          name="star"
          size={18}
          color={isSelected ? "#FFF" : theme.primary}
          fill={isSelected ? "#FFF" : "none"}
          style={{ marginRight: Spacing.sm }}
        />
        <ThemedText
          type="body"
          style={{
            color: isSelected ? "#FFF" : theme.textPrimary,
            fontWeight: isSelected ? "600" : "400",
          }}
        >
          {rating.label}
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <Animated.View
          entering={SlideInDown}
          style={{
            maxHeight: "85%",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            overflow: "hidden",
          }}
        >
          <ThemedView style={{ minHeight: "100%" }}>
            <View
              style={{
                paddingTop: Spacing.lg,
                paddingBottom: Spacing.md,
                paddingHorizontal: Spacing.lg,
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
                backgroundColor: theme.background,
              }}
            >
              {/* Back Arrow */}
              <View
                style={{
                  position: "absolute",
                  top: Spacing.md,
                  left: Spacing.lg,
                  zIndex: 10,
                }}
              >
                <Pressable onPress={onClose} style={{ padding: Spacing.sm }}>
                  <Feather
                    name="arrow-left"
                    size={26}
                    color={theme.textPrimary}
                  />
                </Pressable>
              </View>

              {/* Close Button */}
              <View
                style={{
                  position: "absolute",
                  top: Spacing.md,
                  right: Spacing.lg,
                }}
              >
                <Pressable onPress={onClose} style={{ padding: Spacing.sm }}>
                  <Feather name="x" size={26} color={theme.textPrimary} />
                </Pressable>
              </View>

              {/* Handle */}
              <View
                style={{
                  alignSelf: "center",
                  width: 32,
                  height: 4,
                  backgroundColor: theme.border,
                  borderRadius: 2,
                  marginBottom: Spacing.md,
                }}
              />

              {/* Search Input */}
              <View
                style={[
                  inputStyles.searchInput,
                  {
                    backgroundColor: theme.surface,
                    paddingHorizontal: Spacing.md,
                    marginBottom: Spacing.sm,
                  },
                ]}
              >
                <Feather name="search" size={20} color={theme.textSecondary} />
                <TextInput
                  ref={searchInputRef}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: theme.textPrimary,
                  }}
                  placeholder="Search marketplace..."
                  placeholderTextColor={theme.textSecondary}
                  value={searchQuery}
                  onChangeText={onSearchChange}
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => onSearchChange("")}>
                    <Feather name="x" size={20} color={theme.textSecondary} />
                  </Pressable>
                )}
              </View>

              <ThemedText
                type="h3"
                style={{ fontWeight: "700", textAlign: "center" }}
              >
                Filters
              </ThemedText>
            </View>

            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: Spacing.lg,
                paddingVertical: Spacing.lg,
                paddingBottom: Spacing.xl,
              }}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View entering={FadeIn.delay(100)}>
                <View style={{ marginBottom: Spacing.xl }}>
                  <View
                    style={[
                      layoutStyles.row,
                      { alignItems: "center", marginBottom: Spacing.md },
                    ]}
                  >
                    <Feather
                      name="home"
                      size={20}
                      color={theme.textSecondary}
                      style={{ marginRight: Spacing.sm }}
                    />
                    <ThemedText type="h3" style={{ fontWeight: "600" }}>
                      Category
                    </ThemedText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: Spacing.md,
                    }}
                  >
                    {CATEGORY_OPTIONS.map((category) => (
                      <View key={category.id} style={{ width: "48%" }}>
                        <CategoryButton category={category} />
                      </View>
                    ))}
                  </View>
                </View>
              </Animated.View>

              <Animated.View entering={FadeIn.delay(200)}>
                <View style={{ marginBottom: Spacing.xl }}>
                  <View
                    style={[
                      layoutStyles.row,
                      { alignItems: "center", marginBottom: Spacing.md },
                    ]}
                  >
                    <Feather
                      name="dollar-sign"
                      size={20}
                      color={theme.textSecondary}
                      style={{ marginRight: Spacing.sm }}
                    />
                    <ThemedText
                      type="h3"
                      style={{ fontWeight: "600", flex: 1 }}
                    >
                      Price Range
                    </ThemedText>
                    <ThemedText
                      type="bodySmall"
                      style={{ color: theme.primary, fontWeight: "600" }}
                    >
                      ${priceRange[0]} - ${priceRange[1]}
                    </ThemedText>
                  </View>
                  <View style={[layoutStyles.row, { gap: Spacing.sm }]}>
                    <PriceOption
                      range={[0, 1000]}
                      label="$0 - $1K"
                      selected={priceRange[0] === 0 && priceRange[1] === 1000}
                    />
                    <PriceOption
                      range={[1000, 3000]}
                      label="$1K - $3K"
                      selected={
                        priceRange[0] === 1000 && priceRange[1] === 3000
                      }
                    />
                    <PriceOption
                      range={[3000, 5000]}
                      label="$3K+"
                      selected={
                        priceRange[0] === 3000 && priceRange[1] === 5000
                      }
                    />
                  </View>
                </View>
              </Animated.View>

              <Animated.View entering={FadeIn.delay(250)}>
                <View style={{ marginBottom: Spacing.xl }}>
                  <View
                    style={[
                      layoutStyles.row,
                      { alignItems: "center", marginBottom: Spacing.md },
                    ]}
                  >
                    <Feather
                      name="grid"
                      size={20}
                      color={theme.textSecondary}
                      style={{ marginRight: Spacing.sm }}
                    />
                    <ThemedText type="h3" style={{ fontWeight: "600" }}>
                      Amenities
                    </ThemedText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: Spacing.md,
                    }}
                  >
                    {AMENITIES_OPTIONS.map((amenity) => (
                      <View key={amenity.id} style={{ width: "48%" }}>
                        <AmenityChip amenity={amenity} />
                      </View>
                    ))}
                  </View>
                </View>
              </Animated.View>

              <Animated.View entering={FadeIn.delay(300)}>
                <View>
                  <View
                    style={[
                      layoutStyles.row,
                      { alignItems: "center", marginBottom: Spacing.md },
                    ]}
                  >
                    <Feather
                      name="star"
                      size={20}
                      color={theme.textSecondary}
                      style={{ marginRight: Spacing.sm }}
                    />
                    <ThemedText type="h3" style={{ fontWeight: "600" }}>
                      Rating
                    </ThemedText>
                  </View>
                  <View style={{ gap: Spacing.sm }}>
                    {RATING_OPTIONS.map((rating) => (
                      <RatingButton key={rating.id} rating={rating} />
                    ))}
                  </View>
                </View>
              </Animated.View>
            </ScrollView>

            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                paddingHorizontal: Spacing.lg,
                paddingVertical: Spacing.md,
                paddingBottom: insets.bottom + Spacing.md,
                backgroundColor: theme.backgroundRoot,
                borderTopWidth: 1,
                borderTopColor: theme.border,
                flexDirection: "row",
                gap: Spacing.md,
                alignItems: "center",
              }}
            >
              <Pressable
                style={[
                  {
                    flex: 1,
                    paddingVertical: Spacing.md,
                    paddingHorizontal: Spacing.lg,
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    borderWidth: 1.5,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
                onPress={onClose}
              >
                <ThemedText
                  type="body"
                  style={{ color: theme.textPrimary, fontWeight: "600" }}
                >
                  Cancel
                </ThemedText>
              </Pressable>
              <Pressable
                style={[
                  {
                    flex: 1.5,
                    paddingVertical: Spacing.md,
                    paddingHorizontal: Spacing.lg,
                    backgroundColor: theme.primary,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
                onPress={onApply}
              >
                <ThemedText
                  type="body"
                  lightColor="#FFF"
                  darkColor="#FFF"
                  style={{ fontWeight: "700" }}
                >
                  Apply Filters
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </Animated.View>
      </View>
    </Modal>
  );
};
