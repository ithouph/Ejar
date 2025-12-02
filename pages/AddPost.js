import React, { useState, useEffect } from "react";
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
import { posts as postsApi, users as usersApi, cities as citiesApi, categories as categoriesApi } from "../services/database";

const LISTING_TYPES = [
  { id: "rent", label: "Rent" },
  { id: "sell", label: "Sell" },
];

// Category icons mapping
const CATEGORY_ICONS = {
  Phones: "smartphone",
  Laptops: "monitor",
  Electronics: "zap",
  Cars: "truck",
  Property: "home",
  Others: "box",
};

const PROPERTY_TYPES = [
  { id: "apartment", label: "Apartment" },
  { id: "house", label: "House" },
  { id: "villa", label: "Villa" },
  { id: "land", label: "Land" },
];

const AMENITIES = [
  { id: "wifi", label: "Wi-Fi", icon: "wifi" },
  { id: "parking", label: "Parking", icon: "truck" },
  { id: "ac", label: "Air Conditioning", icon: "wind" },
  { id: "kitchen", label: "Kitchen", icon: "coffee" },
];

const NEARBY_AMENITIES = [
  { id: "mosque", label: "Mosque", icon: "map-pin" },
  { id: "laundry", label: "Laundry", icon: "refresh-cw" },
  { id: "gym", label: "Gym", icon: "activity" },
];

const CONDITION_OPTIONS = ["Excellent", "Good", "Fair", "Poor"];
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid"];
const GEAR_TYPES = ["Automatic", "Manual"];

const LOCATIONS = [
  "Adel Bagrou",
  "Akjoujt",
  "Aleg",
  "Atar",
  "Ayoun el Atrous (Aiún el Atrus)",
  "Bassikounou",
  "Bir Moghrein",
  "Bogué",
  "Bou Mdeid",
  "Boutilimit",
  "Chinguetti",
  "Fdérik",
  "Guerou",
  "Kaédi",
  "Kiffa",
  "M'bout",
  "Néma",
  "Nouadhibou (Port-Étienne)",
  "Nouakchott (Capital city)",
  "Ouadane",
  "Oualata",
  "Rosso",
  "Sélibaby",
  "Tidjikdja",
  "Timbédra",
  "Zouerat",
];

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  theme,
}) {
  return (
    <View style={styles.inputContainer}>
      <ThemedText
        type="bodySmall"
        style={[styles.label, { color: theme.textSecondary }]}
      >
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

function SelectButton({ label, selected, onPress, theme }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.selectButton,
        {
          backgroundColor: selected ? theme.primary + "20" : theme.surface,
          borderColor: selected ? theme.primary : theme.border,
        },
      ]}
    >
      <ThemedText
        type="body"
        style={{ color: selected ? theme.primary : theme.textSecondary }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function LocationAutocomplete({ label, value, onChangeText, onSelect, cities, theme }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);

  const handleTextChange = (text) => {
    onChangeText(text);

    if (text.trim().length > 0) {
      const filtered = cities.filter((city) =>
        city.name_en.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredLocations(filtered);
      setShowDropdown(true);
    } else {
      setFilteredLocations([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (city) => {
    onSelect(city);
    setShowDropdown(false);
    setFilteredLocations([]);
  };

  return (
    <View style={styles.inputContainer}>
      <ThemedText
        type="bodySmall"
        style={[styles.label, { color: theme.textSecondary }]}
      >
        {label}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={handleTextChange}
        placeholder="Search for a city..."
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
      {showDropdown && filteredLocations.length > 0 ? (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <ScrollView
            style={styles.dropdownScroll}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {filteredLocations.map((city, index) => (
              <Pressable
                key={city.id}
                onPress={() => handleSelect(city)}
                style={[
                  styles.dropdownItem,
                  { borderBottomColor: theme.border },
                ]}
              >
                <ThemedText type="body" style={{ color: theme.textPrimary }}>
                  {city.name_en}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

function AmenityChip({ amenity, selected, onPress, theme }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.amenityChip,
        {
          backgroundColor: selected ? theme.primary + "20" : theme.surface,
          borderColor: selected ? theme.primary : theme.border,
        },
      ]}
    >
      <Feather
        name={amenity.icon}
        size={16}
        color={selected ? theme.primary : theme.textSecondary}
      />
      <ThemedText
        type="bodySmall"
        style={{ color: selected ? theme.primary : theme.textSecondary }}
      >
        {amenity.label}
      </ThemedText>
    </Pressable>
  );
}

export default function AddPost({ navigation }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useScreenInsets();

  const [listingType, setListingType] = useState("rent");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [cityId, setCityId] = useState("");
  const [cityName, setCityName] = useState("");
  const [cities, setCities] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cities and categories on component mount
  useEffect(() => {
    loadCities();
    loadCategories();
  }, []);

  async function loadCities() {
    try {
      const citiesList = await citiesApi.getAll();
      setCities(citiesList);
      console.log(`✅ Loaded ${citiesList.length} cities`);
    } catch (error) {
      console.error("Error loading cities:", error);
    }
  }

  async function loadCategories() {
    try {
      const categoriesList = await categoriesApi.getAll();
      setCategories(categoriesList);
      if (categoriesList.length > 0) {
        setCategoryId(categoriesList[0].id);
        setListingType(categoriesList[0].listing_types?.[0] || "rent");
      }
      console.log(`✅ Loaded ${categoriesList.length} categories`);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  const [batteryHealth, setBatteryHealth] = useState("");
  const [storage, setStorage] = useState("");
  const [condition, setCondition] = useState("Good");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");

  const [processor, setProcessor] = useState("");
  const [ram, setRam] = useState("");

  const [brand, setBrand] = useState("");
  const [warranty, setWarranty] = useState("");

  const [make, setMake] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [gearType, setGearType] = useState("Automatic");
  const [fuelType, setFuelType] = useState("Petrol");

  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [sizeSqft, setSizeSqft] = useState("");
  const [propertyType, setPropertyType] = useState("apartment");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedNearbyAmenities, setSelectedNearbyAmenities] = useState([]);
  const [landSize, setLandSize] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [deposit, setDeposit] = useState("");
  const [minContract, setMinContract] = useState("");
  const [furnished, setFurnished] = useState("No");
  const [salePrice, setSalePrice] = useState("");
  const [ownershipType, setOwnershipType] = useState("");
  const [propertyAge, setPropertyAge] = useState("");
  const [paymentOptions, setPaymentOptions] = useState("");

  async function handlePickImages() {
    try {
      const selectedImages = await postsApi.pickImages(5);
      if (selectedImages.length > 0) {
        // Extract URIs from the image objects
        const imageUris = selectedImages.map(img => img.uri);
        // APPEND new images instead of replacing
        setImages(prev => [...prev, ...imageUris].slice(0, 5));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      if (error.message && error.message.includes("Permission")) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library in your device settings to upload images.",
          [{ text: "OK" }],
        );
      } else {
        Alert.alert("Error", "Failed to pick images. Please try again.");
      }
    }
  }

  function toggleAmenity(amenityId) {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId],
    );
  }

  function toggleNearbyAmenity(amenityId) {
    setSelectedNearbyAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId],
    );
  }

  function getCategorySpecifications() {
    const selectedCategory = categories.find(c => c.id === categoryId);
    const categoryName = selectedCategory?.name?.toLowerCase() || "";
    
    switch (categoryName) {
      case "phones":
        return {
          battery_health: batteryHealth,
          storage,
          condition,
          model,
          color,
        };
      case "laptops":
        return {
          processor,
          ram,
          storage,
          condition,
          model,
        };
      case "electronics":
        return {
          brand,
          condition,
          warranty,
        };
      case "cars":
        return {
          make,
          model,
          year,
          mileage,
          gear_type: gearType,
          fuel_type: fuelType,
          condition,
        };
      case "property":
        const commonSpecs = {
          property_type: propertyType,
          amenities: selectedAmenities,
        };

        if (propertyType === "land") {
          commonSpecs.land_size = landSize;
        } else {
          commonSpecs.bedrooms = bedrooms;
          commonSpecs.bathrooms = bathrooms;
          commonSpecs.size_sqft = sizeSqft;
        }

        if (
          listingType === "rent" &&
          (propertyType === "house" || propertyType === "apartment")
        ) {
          commonSpecs.nearby_amenities = selectedNearbyAmenities;
        }

        if (listingType === "rent") {
          return {
            ...commonSpecs,
            monthly_rent: monthlyRent,
            deposit,
            min_contract_duration: minContract,
            furnished,
          };
        } else {
          return {
            ...commonSpecs,
            sale_price: salePrice,
            ownership_type: ownershipType,
            property_age: propertyAge,
            payment_options: paymentOptions,
          };
        }
      default:
        return {};
    }
  }

  async function handleSubmit() {
    // Validate user is logged in
    if (!user?.id) {
      Alert.alert("Error", "You must be logged in to create a post");
      return;
    }

    if (!categoryId) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    if (!cityId) {
      Alert.alert("Error", "Please select a city");
      return;
    }

    if (images.length < 1) {
      Alert.alert("Error", "Please add at least 1 image");
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    try {
      setLoading(true);

      // Check if user has posting limit remaining
      if (!user || !user.id) {
        Alert.alert("Error", "User not logged in properly");
        return;
      }

      if (user.post_limit <= 0) {
        Alert.alert(
          "Posting Limit Reached",
          "You've reached your posting limit. Please make a payment to add more posts."
        );
        return;
      }

      console.log("📝 Creating post with userId:", user?.id);
      console.log("📝 Category ID:", categoryId);
      console.log("📝 Title:", title);
      console.log("📝 City ID:", cityId);
      console.log("📝 User post_limit:", user.post_limit);

      // Find the selected category to get its name
      const selectedCategory = categories.find(c => c.id === categoryId);
      const categoryName = selectedCategory?.name?.toLowerCase() || "others";

      // Collect all post data with user_id
      const postData = {
        user_id: user?.id, // Explicitly include user_id
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        city_id: cityId, // Use city_id instead of location
        images,
        category: categoryName, // Include category name for CATEGORY_MAP lookup
        listingType,
        specifications: getCategorySpecifications(),
      };

      console.log("📝 Post data prepared:", postData);

      // Create post - backend expects (userId, postData)
      const createdPost = await postsApi.create(user?.id, postData);

      if (!createdPost || createdPost?.error) {
        throw new Error(createdPost?.error || "Failed to create post");
      }

      console.log("✅ Post created successfully:", createdPost?.id);

      // Decrement posting limit locally (UI update)
      // Note: Backend should also update this
      if (user.post_limit > 0) {
        // Optionally call decrementPostLimit but don't block on it
        usersApi.decrementPostLimit(user?.id).catch(err => 
          console.warn("Warning: Could not decrement post limit on server:", err)
        );
      }

      Alert.alert(
        "Post Created Successfully!",
        "Your post is now live on the marketplace!",
        [
          {
            text: "View My Posts",
            onPress: () => navigation.navigate("Posts"),
          },
          {
            text: "Create Another",
            onPress: () => {
              // Reset form
              setTitle("");
              setDescription("");
              setPrice("");
              setLocation("");
              setImages([]);
              setCategory("phones");
            },
          },
        ]
      );
    } catch (error) {
      console.error("❌ Error creating post:", error);
      Alert.alert("Error", error.message || "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function renderCategoryFields() {
    const { theme } = useTheme();

    switch (category) {
      case "phones":
        return (
          <>
            <View style={styles.section}>
              <ThemedText type="bodyLarge" style={styles.sectionTitle}>
                Phone Details
              </ThemedText>
              <InputField
                label="Model"
                value={model}
                onChangeText={setModel}
                placeholder="e.g., iPhone 14 Pro"
                theme={theme}
              />
              <InputField
                label="Battery Health"
                value={batteryHealth}
                onChangeText={setBatteryHealth}
                placeholder="e.g., 95%"
                theme={theme}
              />
              <InputField
                label="Storage"
                value={storage}
                onChangeText={setStorage}
                placeholder="e.g., 256GB"
                theme={theme}
              />
              <InputField
                label="Color"
                value={color}
                onChangeText={setColor}
                placeholder="e.g., Black"
                theme={theme}
              />

              <ThemedText
                type="bodySmall"
                style={[styles.label, { color: theme.textSecondary }]}
              >
                Condition
              </ThemedText>
              <View style={styles.optionsRow}>
                {CONDITION_OPTIONS.map((opt) => (
                  <SelectButton
                    key={opt}
                    label={opt}
                    selected={condition === opt}
                    onPress={() => setCondition(opt)}
                    theme={theme}
                  />
                ))}
              </View>
            </View>
          </>
        );

      case "laptops":
        return (
          <>
            <View style={styles.section}>
              <ThemedText type="bodyLarge" style={styles.sectionTitle}>
                Laptop Details
              </ThemedText>
              <InputField
                label="Model"
                value={model}
                onChangeText={setModel}
                placeholder="e.g., MacBook Pro 16"
                theme={theme}
              />
              <InputField
                label="Processor"
                value={processor}
                onChangeText={setProcessor}
                placeholder="e.g., M2 Pro"
                theme={theme}
              />
              <InputField
                label="RAM"
                value={ram}
                onChangeText={setRam}
                placeholder="e.g., 16GB"
                theme={theme}
              />
              <InputField
                label="Storage"
                value={storage}
                onChangeText={setStorage}
                placeholder="e.g., 512GB SSD"
                theme={theme}
              />

              <ThemedText
                type="bodySmall"
                style={[styles.label, { color: theme.textSecondary }]}
              >
                Condition
              </ThemedText>
              <View style={styles.optionsRow}>
                {CONDITION_OPTIONS.map((opt) => (
                  <SelectButton
                    key={opt}
                    label={opt}
                    selected={condition === opt}
                    onPress={() => setCondition(opt)}
                    theme={theme}
                  />
                ))}
              </View>
            </View>
          </>
        );

      case "electronics":
        return (
          <>
            <View style={styles.section}>
              <ThemedText type="bodyLarge" style={styles.sectionTitle}>
                Electronics Details
              </ThemedText>
              <InputField
                label="Brand"
                value={brand}
                onChangeText={setBrand}
                placeholder="e.g., Sony"
                theme={theme}
              />
              <InputField
                label="Warranty"
                value={warranty}
                onChangeText={setWarranty}
                placeholder="e.g., 1 year"
                theme={theme}
              />

              <ThemedText
                type="bodySmall"
                style={[styles.label, { color: theme.textSecondary }]}
              >
                Condition
              </ThemedText>
              <View style={styles.optionsRow}>
                {CONDITION_OPTIONS.map((opt) => (
                  <SelectButton
                    key={opt}
                    label={opt}
                    selected={condition === opt}
                    onPress={() => setCondition(opt)}
                    theme={theme}
                  />
                ))}
              </View>
            </View>
          </>
        );

      case "cars":
        return (
          <>
            <View style={styles.section}>
              <ThemedText type="bodyLarge" style={styles.sectionTitle}>
                Car Details
              </ThemedText>
              <InputField
                label="Make / Model"
                value={make}
                onChangeText={setMake}
                placeholder="e.g., Toyota Camry"
                theme={theme}
              />
              <InputField
                label="Model Details"
                value={model}
                onChangeText={setModel}
                placeholder="e.g., 2.5L SE"
                theme={theme}
              />
              <InputField
                label="Year"
                value={year}
                onChangeText={setYear}
                placeholder="e.g., 2022"
                keyboardType="numeric"
                theme={theme}
              />
              <InputField
                label="Mileage"
                value={mileage}
                onChangeText={setMileage}
                placeholder="e.g., 25,000 km"
                theme={theme}
              />

              <ThemedText
                type="bodySmall"
                style={[styles.label, { color: theme.textSecondary }]}
              >
                Fuel Type
              </ThemedText>
              <View style={styles.optionsRow}>
                {FUEL_TYPES.map((fuel) => (
                  <SelectButton
                    key={fuel}
                    label={fuel}
                    selected={fuelType === fuel}
                    onPress={() => setFuelType(fuel)}
                    theme={theme}
                  />
                ))}
              </View>

              <ThemedText
                type="bodySmall"
                style={[styles.label, { color: theme.textSecondary }]}
              >
                Gear Type
              </ThemedText>
              <View style={styles.optionsRow}>
                {GEAR_TYPES.map((gear) => (
                  <SelectButton
                    key={gear}
                    label={gear}
                    selected={gearType === gear}
                    onPress={() => setGearType(gear)}
                    theme={theme}
                  />
                ))}
              </View>

              <ThemedText
                type="bodySmall"
                style={[styles.label, { color: theme.textSecondary }]}
              >
                Condition
              </ThemedText>
              <View style={styles.optionsRow}>
                {CONDITION_OPTIONS.map((opt) => (
                  <SelectButton
                    key={opt}
                    label={opt}
                    selected={condition === opt}
                    onPress={() => setCondition(opt)}
                    theme={theme}
                  />
                ))}
              </View>
            </View>
          </>
        );

      case "property":
        return (
          <>
            <View style={styles.section}>
              <ThemedText type="bodyLarge" style={styles.sectionTitle}>
                Property Details
              </ThemedText>

              <ThemedText
                type="bodySmall"
                style={[styles.label, { color: theme.textSecondary }]}
              >
                Property Type
              </ThemedText>
              <View style={styles.optionsRow}>
                {PROPERTY_TYPES.map((type) => (
                  <SelectButton
                    key={type.id}
                    label={type.label}
                    selected={propertyType === type.id}
                    onPress={() => setPropertyType(type.id)}
                    theme={theme}
                  />
                ))}
              </View>

              {propertyType === "land" ? (
                <InputField
                  label="Land Size (sq m)"
                  value={landSize}
                  onChangeText={setLandSize}
                  placeholder="e.g., 500"
                  keyboardType="numeric"
                  theme={theme}
                />
              ) : (
                <>
                  <InputField
                    label="Bedrooms"
                    value={bedrooms}
                    onChangeText={setBedrooms}
                    placeholder="e.g., 3"
                    keyboardType="numeric"
                    theme={theme}
                  />
                  <InputField
                    label="Bathrooms"
                    value={bathrooms}
                    onChangeText={setBathrooms}
                    placeholder="e.g., 2"
                    keyboardType="numeric"
                    theme={theme}
                  />
                  <InputField
                    label="Size (sq ft)"
                    value={sizeSqft}
                    onChangeText={setSizeSqft}
                    placeholder="e.g., 1500"
                    keyboardType="numeric"
                    theme={theme}
                  />
                </>
              )}

              <ThemedText
                type="bodySmall"
                style={[styles.label, { color: theme.textSecondary }]}
              >
                Amenities
              </ThemedText>
              <View style={styles.amenitiesGrid}>
                {AMENITIES.map((amenity) => (
                  <AmenityChip
                    key={amenity.id}
                    amenity={amenity}
                    selected={selectedAmenities.includes(amenity.id)}
                    onPress={() => toggleAmenity(amenity.id)}
                    theme={theme}
                  />
                ))}
              </View>

              {listingType === "rent" &&
                (propertyType === "house" || propertyType === "apartment") && (
                  <>
                    <ThemedText
                      type="bodySmall"
                      style={[
                        styles.label,
                        { color: theme.textSecondary, marginTop: Spacing.md },
                      ]}
                    >
                      Nearby
                    </ThemedText>
                    <View style={styles.amenitiesGrid}>
                      {NEARBY_AMENITIES.map((amenity) => (
                        <AmenityChip
                          key={amenity.id}
                          amenity={amenity}
                          selected={selectedNearbyAmenities.includes(
                            amenity.id,
                          )}
                          onPress={() => toggleNearbyAmenity(amenity.id)}
                          theme={theme}
                        />
                      ))}
                    </View>
                  </>
                )}

              {listingType === "rent" ? (
                <>
                  <ThemedText type="h3" style={styles.subsectionTitle}>
                    Rental Details
                  </ThemedText>
                  <InputField
                    label="Monthly Rent"
                    value={monthlyRent}
                    onChangeText={setMonthlyRent}
                    placeholder="e.g., 2500"
                    keyboardType="numeric"
                    theme={theme}
                  />
                  <InputField
                    label="Deposit Amount"
                    value={deposit}
                    onChangeText={setDeposit}
                    placeholder="e.g., 5000"
                    keyboardType="numeric"
                    theme={theme}
                  />
                  <InputField
                    label="Min Contract Duration"
                    value={minContract}
                    onChangeText={setMinContract}
                    placeholder="e.g., 12 months"
                    theme={theme}
                  />

                  <ThemedText
                    type="bodySmall"
                    style={[styles.label, { color: theme.textSecondary }]}
                  >
                    Furnished
                  </ThemedText>
                  <View style={styles.optionsRow}>
                    <SelectButton
                      label="Yes"
                      selected={furnished === "Yes"}
                      onPress={() => setFurnished("Yes")}
                      theme={theme}
                    />
                    <SelectButton
                      label="No"
                      selected={furnished === "No"}
                      onPress={() => setFurnished("No")}
                      theme={theme}
                    />
                    <SelectButton
                      label="Partially"
                      selected={furnished === "Partially"}
                      onPress={() => setFurnished("Partially")}
                      theme={theme}
                    />
                  </View>
                </>
              ) : (
                <>
                  <ThemedText type="h3" style={styles.subsectionTitle}>
                    Sale Details
                  </ThemedText>
                  <InputField
                    label="Sale Price"
                    value={salePrice}
                    onChangeText={setSalePrice}
                    placeholder="e.g., 500000"
                    keyboardType="numeric"
                    theme={theme}
                  />
                  <InputField
                    label="Ownership Type"
                    value={ownershipType}
                    onChangeText={setOwnershipType}
                    placeholder="e.g., Freehold"
                    theme={theme}
                  />
                  <InputField
                    label="Property Age"
                    value={propertyAge}
                    onChangeText={setPropertyAge}
                    placeholder="e.g., 5 years"
                    theme={theme}
                  />
                  <InputField
                    label="Payment Options"
                    value={paymentOptions}
                    onChangeText={setPaymentOptions}
                    placeholder="e.g., Cash, Installments"
                    theme={theme}
                  />
                </>
              )}
            </View>
          </>
        );

      default:
        return null;
    }
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Feather name="x" size={24} color={theme.textPrimary} />
        </Pressable>
        <ThemedText type="bodyLarge" style={styles.headerTitle}>
          Create Post
        </ThemedText>
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={styles.headerButton}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <ThemedText
              type="body"
              style={{ color: theme.primary, fontWeight: "600" }}
            >
              Post
            </ThemedText>
          )}
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <ThemedText type="bodyLarge" style={styles.sectionTitle}>
            Category
          </ThemedText>
          <View style={styles.typeGrid}>
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => {
                  setCategoryId(cat.id);
                  setListingType(cat.listing_types?.[0] || "rent");
                }}
                style={[
                  styles.typeChip,
                  {
                    backgroundColor:
                      categoryId === cat.id
                        ? theme.primary + "20"
                        : theme.surface,
                    borderColor:
                      categoryId === cat.id ? theme.primary : theme.border,
                  },
                ]}
              >
                <Feather
                  name={CATEGORY_ICONS[cat.name] || "box"}
                  size={20}
                  color={
                    categoryId === cat.id ? theme.primary : theme.textSecondary
                  }
                />
                <ThemedText
                  type="body"
                  style={{
                    color:
                      categoryId === cat.id ? theme.primary : theme.textSecondary,
                  }}
                >
                  {cat.name}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="bodyLarge" style={styles.sectionTitle}>
            Listing Type
          </ThemedText>
          <View style={styles.optionsRow}>
            {LISTING_TYPES.map((type) => (
              <SelectButton
                key={type.id}
                label={type.label}
                selected={listingType === type.id}
                onPress={() => setListingType(type.id)}
                theme={theme}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="bodyLarge" style={styles.sectionTitle}>
            Photos
          </ThemedText>

          {images.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesScroll}
            >
              {images.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.uploadedImage} />
                  <Pressable
                    onPress={() =>
                      setImages(images.filter((_, i) => i !== index))
                    }
                    style={styles.removeImageButton}
                  >
                    <Feather name="x" size={16} color="#FFF" />
                  </Pressable>
                </View>
              ))}
              {images.length < 5 && (
                <Pressable
                  onPress={handlePickImages}
                  style={[
                    styles.addImageButton,
                    { backgroundColor: theme.surface },
                  ]}
                >
                  <Feather name="plus" size={32} color={theme.textSecondary} />
                </Pressable>
              )}
            </ScrollView>
          ) : (
            <Pressable
              onPress={handlePickImages}
              style={[styles.uploadArea, { backgroundColor: theme.surface }]}
            >
              <Feather name="image" size={48} color={theme.textSecondary} />
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                Tap to add photos (up to 5)
              </ThemedText>
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="bodyLarge" style={styles.sectionTitle}>
            Basic Details
          </ThemedText>

          <InputField
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., iPhone 14 Pro - Excellent Condition"
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
            placeholder="e.g., 1000"
            keyboardType="numeric"
            theme={theme}
          />

          <LocationAutocomplete
            label="Location"
            value={cityName}
            onChangeText={setCityName}
            onSelect={(city) => {
              setCityId(city.id);
              setCityName(city.name_en);
            }}
            cities={cities}
            theme={theme}
          />
        </View>

        {renderCategoryFields()}
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
    marginBottom: Spacing.xs,
  },
  subsectionTitle: {
    fontWeight: "600",
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  typeChip: {
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
    zIndex: 1,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: Spacing.sm,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  selectButton: {
    flex: 1,
    minWidth: "30%",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
    alignItems: "center",
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
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
