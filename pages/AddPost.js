import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../contexts/AuthContext";
import { useScreenInsets } from "../hooks/useScreenInsets";
import { Spacing, BorderRadius } from "../theme/global";
import { posts as postsApi } from "../services/database";

const CATEGORIES = [
  { id: "phones", label: "Phones", icon: "smartphone" },
  { id: "electronics", label: "Electronics", icon: "zap" },
  { id: "property", label: "Property", icon: "home" },
  { id: "cars", label: "Cars", icon: "truck" },
  { id: "others", label: "Others", icon: "box" },
];

const LOCATIONS = [
  "Adel Bagrou", "Akjoujt", "Aleg", "Atar", "Ayoun el Atrous",
  "Bassikounou", "Bir Moghrein", "Bogué", "Bou Mdeid", "Boutilimit",
  "Chinguetti", "Fdérik", "Guerou", "Kaédi", "Kiffa", "M'bout", "Néma",
  "Nouadhibou", "Nouakchott", "Ouadane", "Oualata", "Rosso", "Sélibaby",
  "Tidjikdja", "Timbédra", "Zouerat",
];

function InputField({ label, value, onChangeText, placeholder, keyboardType, theme }) {
  return (
    <View style={styles.inputContainer}>
      <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        keyboardType={keyboardType || "default"}
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            color: theme.textPrimary,
            borderColor: theme.border,
          },
        ]}
      />
    </View>
  );
}

function LocationAutocomplete({ label, value, onChangeText, onSelect, theme }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);

  const handleTextChange = (text) => {
    onChangeText(text);
    if (text.trim().length > 0) {
      const filtered = LOCATIONS.filter((location) =>
        location.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowDropdown(true);
    } else {
      setFilteredLocations([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (location) => {
    onSelect(location);
    setShowDropdown(false);
  };

  return (
    <View style={styles.inputContainer}>
      <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={handleTextChange}
        placeholder="Search for a location..."
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            color: theme.textPrimary,
            borderColor: theme.border,
          },
        ]}
      />
      {showDropdown && filteredLocations.length > 0 && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {filteredLocations.map((location, index) => (
              <Pressable
                key={index}
                onPress={() => handleSelect(location)}
                style={[styles.dropdownItem, { borderBottomColor: theme.border }]}
              >
                <ThemedText type="body" style={{ color: theme.textPrimary }}>
                  {location}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

export default function AddPost({ navigation }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useScreenInsets();

  const [category, setCategory] = useState("phones");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handlePickImages() {
    try {
      const selectedImages = await postsApi.pickImages(5);
      if (selectedImages.length > 0) {
        const imageUris = selectedImages.map((img) => (typeof img === "string" ? img : img.uri));
        setImages(imageUris);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick images. Please try again.");
    }
  }

  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert("Missing Information", "Please enter a title");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Missing Information", "Please enter a description");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Missing Information", "Please select a location");
      return;
    }
    if (!price.trim()) {
      Alert.alert("Missing Information", "Please enter a price");
      return;
    }
    if (images.length < 1) {
      Alert.alert("Add Images", "Please add at least 1 image");
      return;
    }

    try {
      setLoading(true);

      const postData = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        location: location.trim(),
        images: images,
        category: category,
        is_approved: true,
      };

      console.log("📤 Creating post:", postData);
      const createdPost = await postsApi.create(user?.id, postData);

      if (!createdPost) {
        Alert.alert("Error", "Failed to create post");
        return;
      }

      console.log("✅ Post created:", createdPost.id);

      Alert.alert(
        "Success!",
        "Your post is now live!",
        [
          {
            text: "View My Posts",
            onPress: () => navigation.goBack(),
          },
        ]
      );

      setTitle("");
      setDescription("");
      setPrice("");
      setLocation("");
      setImages([]);
      setCategory("phones");
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", error.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Feather name="x" size={24} color={theme.textPrimary} />
        </Pressable>
        <ThemedText type="bodyLarge" style={styles.headerTitle}>
          Create Post
        </ThemedText>
        <Pressable onPress={handleSubmit} disabled={loading} style={styles.headerButton}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <ThemedText type="body" style={{ color: theme.primary, fontWeight: "600" }}>
              Post
            </ThemedText>
          )}
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Selection */}
        <View style={styles.section}>
          <ThemedText type="bodyLarge" style={styles.sectionTitle}>
            Category
          </ThemedText>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: category === cat.id ? theme.primary + "20" : theme.surface,
                    borderColor: category === cat.id ? theme.primary : theme.border,
                  },
                ]}
              >
                <Feather
                  name={cat.icon}
                  size={20}
                  color={category === cat.id ? theme.primary : theme.textSecondary}
                />
                <ThemedText
                  type="bodySmall"
                  style={{
                    color: category === cat.id ? theme.primary : theme.textSecondary,
                  }}
                >
                  {cat.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <View style={styles.photoHeaderRow}>
            <ThemedText type="bodyLarge" style={styles.sectionTitle}>
              Photos
            </ThemedText>
            <ThemedText type="bodySmall" style={{ color: images.length > 0 ? theme.primary : theme.textSecondary }}>
              {images.length} added
            </ThemedText>
          </View>

          {images.length > 0 ? (
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
                {images.map((uri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri }} style={styles.uploadedImage} />
                    <Pressable
                      onPress={() => setImages(images.filter((_, i) => i !== index))}
                      style={styles.removeImageButton}
                    >
                      <Feather name="x" size={16} color="#FFF" />
                    </Pressable>
                  </View>
                ))}
                {images.length < 5 && (
                  <Pressable
                    onPress={handlePickImages}
                    style={[styles.addImageButton, { backgroundColor: theme.surface }]}
                  >
                    <Feather name="plus" size={32} color={theme.textSecondary} />
                  </Pressable>
                )}
              </ScrollView>
            </View>
          ) : (
            <Pressable onPress={handlePickImages} style={[styles.uploadArea, { backgroundColor: theme.surface }]}>
              <Feather name="image" size={48} color={theme.textSecondary} />
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                Tap to add photos
              </ThemedText>
            </Pressable>
          )}
        </View>

        {/* Basic Details */}
        <View style={styles.section}>
          <ThemedText type="bodyLarge" style={styles.sectionTitle}>
            Details
          </ThemedText>

          <InputField
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Item title"
            theme={theme}
          />

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={4}
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
          />

          <InputField
            label="Price"
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
            keyboardType="numeric"
            theme={theme}
          />

          <LocationAutocomplete
            label="Location"
            value={location}
            onChangeText={setLocation}
            onSelect={setLocation}
            theme={theme}
          />
        </View>
      </KeyboardAwareScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    width: 60,
  },
  headerTitle: {
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontWeight: "700",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
  },
  inputContainer: {
    gap: Spacing.xs,
  },
  label: {
    fontWeight: "500",
  },
  input: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: BorderRadius.small,
    marginTop: Spacing.xs,
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  photoHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imagesScroll: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  imageContainer: {
    marginRight: Spacing.sm,
    position: "relative",
  },
  uploadedImage: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.medium,
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 4,
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadArea: {
    height: 200,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
});
