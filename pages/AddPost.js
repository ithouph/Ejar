import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Pressable, 
  TextInput, 
  Image,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { 
  posts as postsApi, 
  categories as categoriesApi,
  listingTypes as listingTypesApi,
  propertyTypes as propertyTypesApi,
  amenities as amenitiesApi,
  cities as citiesApi
} from '../services';

const FALLBACK_LISTING_TYPES = [
  { id: 'rent', name: 'For Rent', slug: 'rent', icon: 'key' },
  { id: 'sale', name: 'For Sale', slug: 'sale', icon: 'tag' },
];

const FALLBACK_CATEGORIES = [
  { id: 'phones', name: 'Phones', type: 'electronics', metadata: { icon: 'smartphone', sort_order: 1 } },
  { id: 'laptops', name: 'Laptops', type: 'electronics', metadata: { icon: 'monitor', sort_order: 2 } },
  { id: 'electronics', name: 'Electronics', type: 'electronics', metadata: { icon: 'zap', sort_order: 3 } },
  { id: 'cars', name: 'Cars', type: 'vehicles', metadata: { icon: 'truck', sort_order: 4 } },
  { id: 'property', name: 'Property', type: 'property', metadata: { icon: 'home', sort_order: 5 } },
];

const FALLBACK_PROPERTY_TYPES = [
  { id: 'apartment', name: 'Apartment', slug: 'apartment', icon: 'home' },
  { id: 'house', name: 'House', slug: 'house', icon: 'home' },
  { id: 'villa', name: 'Villa', slug: 'villa', icon: 'home' },
  { id: 'land', name: 'Land', slug: 'land', icon: 'map' },
];

const FALLBACK_AMENITIES = [
  { id: 'wifi', name: 'Wi-Fi', slug: 'wifi', icon: 'wifi', category: 'indoor' },
  { id: 'parking', name: 'Parking', slug: 'parking', icon: 'truck', category: 'indoor' },
  { id: 'ac', name: 'Air Conditioning', slug: 'ac', icon: 'wind', category: 'indoor' },
  { id: 'kitchen', name: 'Kitchen', slug: 'kitchen', icon: 'coffee', category: 'indoor' },
];

const FALLBACK_NEARBY_AMENITIES = [
  { id: 'mosque', name: 'Mosque', slug: 'mosque', icon: 'map-pin', category: 'nearby' },
  { id: 'laundry', name: 'Laundry', slug: 'laundry', icon: 'refresh-cw', category: 'nearby' },
  { id: 'gym', name: 'Gym', slug: 'gym', icon: 'activity', category: 'nearby' },
];

const CONDITION_OPTIONS = ['Excellent', 'Good', 'Fair', 'Poor'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const GEAR_TYPES = ['Automatic', 'Manual'];

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
        keyboardType={keyboardType || 'default'}
        style={[styles.input, { 
          backgroundColor: theme.surface,
          color: theme.textPrimary,
          borderColor: theme.border 
        }]}
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
          backgroundColor: selected ? theme.primary + '20' : theme.surface,
          borderColor: selected ? theme.primary : theme.border,
        }
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

function CityPicker({ label, selectedCity, onSelect, cities, theme }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <Pressable
        onPress={() => setShowDropdown(!showDropdown)}
        style={[styles.input, styles.pickerButton, { 
          backgroundColor: theme.surface,
          borderColor: theme.border 
        }]}
      >
        <ThemedText 
          type="body" 
          style={{ color: selectedCity ? theme.textPrimary : theme.textSecondary }}
        >
          {selectedCity ? selectedCity.name : 'Select a city...'}
        </ThemedText>
        <Feather 
          name={showDropdown ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={theme.textSecondary} 
        />
      </Pressable>
      {showDropdown ? (
        <View style={[styles.dropdown, { 
          backgroundColor: theme.surface,
          borderColor: theme.border 
        }]}>
          <ScrollView 
            style={styles.dropdownScroll}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {cities.map((city, index) => (
              <Pressable
                key={city.id || index}
                onPress={() => {
                  onSelect(city);
                  setShowDropdown(false);
                }}
                style={[
                  styles.dropdownItem, 
                  { 
                    borderBottomColor: theme.border,
                    backgroundColor: selectedCity?.id === city.id ? theme.primary + '15' : 'transparent'
                  }
                ]}
              >
                <ThemedText type="body" style={{ color: theme.textPrimary }}>
                  {city.name}
                </ThemedText>
                {selectedCity?.id === city.id ? (
                  <Feather name="check" size={18} color={theme.primary} />
                ) : null}
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
          backgroundColor: selected ? theme.primary + '20' : theme.surface,
          borderColor: selected ? theme.primary : theme.border,
        }
      ]}
    >
      <Feather 
        name={amenity.icon || 'check'} 
        size={16} 
        color={selected ? theme.primary : theme.textSecondary} 
      />
      <ThemedText 
        type="bodySmall" 
        style={{ color: selected ? theme.primary : theme.textSecondary }}
      >
        {amenity.name}
      </ThemedText>
    </Pressable>
  );
}

function LoadingScreen({ theme }) {
  return (
    <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={theme.primary} />
      <ThemedText type="body" style={{ marginTop: Spacing.md, color: theme.textSecondary }}>
        Loading form data...
      </ThemedText>
    </View>
  );
}

export default function AddPost({ navigation }) {
  const { theme } = useTheme();
  const { user, profile } = useAuth();
  const insets = useScreenInsets();
  
  const [dataLoading, setDataLoading] = useState(true);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [categories, setCategories] = useState([]);
  const [listingTypeOptions, setListingTypeOptions] = useState([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);
  const [indoorAmenities, setIndoorAmenities] = useState([]);
  const [nearbyAmenities, setNearbyAmenities] = useState([]);
  const [cities, setCities] = useState([]);

  const [listingType, setListingType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [batteryHealth, setBatteryHealth] = useState('');
  const [storage, setStorage] = useState('');
  const [condition, setCondition] = useState('Good');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');

  const [processor, setProcessor] = useState('');
  const [ram, setRam] = useState('');
  
  const [brand, setBrand] = useState('');
  const [warranty, setWarranty] = useState('');
  
  const [make, setMake] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [gearType, setGearType] = useState('Automatic');
  const [fuelType, setFuelType] = useState('Petrol');

  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [sizeSqft, setSizeSqft] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedNearbyAmenities, setSelectedNearbyAmenities] = useState([]);
  const [landSize, setLandSize] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [minContract, setMinContract] = useState('');
  const [furnished, setFurnished] = useState('No');
  const [salePrice, setSalePrice] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
  const [propertyAge, setPropertyAge] = useState('');
  const [paymentOptions, setPaymentOptions] = useState('');

  useEffect(() => {
    loadFormData();
  }, []);

  useEffect(() => {
    setSelectedAmenities([]);
    setSelectedNearbyAmenities([]);
  }, [usingFallbackData]);

  async function loadFormData() {
    try {
      setDataLoading(true);
      
      const [
        categoriesData,
        listingTypesData,
        propertyTypesData,
        amenitiesData,
        citiesData
      ] = await Promise.all([
        categoriesApi.getAll().catch(() => null),
        listingTypesApi.getAll().catch(() => null),
        propertyTypesApi.getAll().catch(() => null),
        amenitiesApi.getAll().catch(() => null),
        citiesApi.getAll().catch(() => null)
      ]);

      const hasDbCategories = categoriesData && categoriesData.length > 0;
      const hasDbListingTypes = listingTypesData && listingTypesData.length > 0;
      const hasDbPropertyTypes = propertyTypesData && propertyTypesData.length > 0;
      const hasDbAmenities = amenitiesData && amenitiesData.length > 0;
      
      const isFallback = !hasDbCategories || !hasDbListingTypes || !hasDbPropertyTypes || !hasDbAmenities;
      setUsingFallbackData(isFallback);

      const cats = hasDbCategories
        ? categoriesData.sort((a, b) => (a.metadata?.sort_order || 99) - (b.metadata?.sort_order || 99))
        : FALLBACK_CATEGORIES;
      setCategories(cats);
      if (cats.length > 0) {
        setSelectedCategory(cats[0]);
      }

      const listTypes = hasDbListingTypes ? listingTypesData : FALLBACK_LISTING_TYPES;
      setListingTypeOptions(listTypes);
      if (listTypes.length > 0) {
        setListingType(listTypes[0].slug);
      }

      const propTypes = hasDbPropertyTypes ? propertyTypesData : FALLBACK_PROPERTY_TYPES;
      setPropertyTypeOptions(propTypes);
      if (propTypes.length > 0) {
        setPropertyType(propTypes[0].slug);
      }

      if (hasDbAmenities) {
        setIndoorAmenities(amenitiesData.filter(a => a.category === 'indoor'));
        setNearbyAmenities(amenitiesData.filter(a => a.category === 'nearby'));
      } else {
        setIndoorAmenities(FALLBACK_AMENITIES);
        setNearbyAmenities(FALLBACK_NEARBY_AMENITIES);
      }

      setCities(citiesData || []);

    } catch (error) {
      console.error('Error loading form data:', error);
      setUsingFallbackData(true);
      setCategories(FALLBACK_CATEGORIES);
      setSelectedCategory(FALLBACK_CATEGORIES[0]);
      setListingTypeOptions(FALLBACK_LISTING_TYPES);
      setListingType(FALLBACK_LISTING_TYPES[0].slug);
      setPropertyTypeOptions(FALLBACK_PROPERTY_TYPES);
      setPropertyType(FALLBACK_PROPERTY_TYPES[0].slug);
      setIndoorAmenities(FALLBACK_AMENITIES);
      setNearbyAmenities(FALLBACK_NEARBY_AMENITIES);
    } finally {
      setDataLoading(false);
    }
  }

  function isUuid(str) {
    if (!str || typeof str !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  async function handlePickImages() {
    try {
      const remainingSlots = 5 - images.length;
      if (remainingSlots <= 0) {
        Alert.alert('Limit Reached', 'You can add up to 5 images per post.');
        return;
      }
      const selectedImages = await postsApi.pickImages(remainingSlots);
      if (selectedImages.length > 0) {
        setImages(prev => [...prev, ...selectedImages].slice(0, 5));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      if (error.message && error.message.includes('Permission')) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library in your device settings to upload images.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to pick images. Please try again.');
      }
    }
  }

  function getAmenityKey(amenity) {
    if (!usingFallbackData && isUuid(amenity.id)) {
      return amenity.id;
    }
    return amenity.slug || amenity.name?.toLowerCase().replace(/\s+/g, '-') || amenity.id;
  }

  function toggleAmenity(amenity) {
    const key = getAmenityKey(amenity);
    setSelectedAmenities(prev => 
      prev.includes(key)
        ? prev.filter(id => id !== key)
        : [...prev, key]
    );
  }

  function toggleNearbyAmenity(amenity) {
    const key = getAmenityKey(amenity);
    setSelectedNearbyAmenities(prev => 
      prev.includes(key)
        ? prev.filter(id => id !== key)
        : [...prev, key]
    );
  }

  function getCategorySlug() {
    if (!selectedCategory) return '';
    return selectedCategory.slug || selectedCategory.name?.toLowerCase().replace(/\s+/g, '-') || '';
  }

  function getCategoryType() {
    if (!selectedCategory) return '';
    return selectedCategory.type || selectedCategory.name?.toLowerCase() || '';
  }

  function getCategorySpecifications() {
    const catType = getCategoryType();
    const catSlug = getCategorySlug();
    
    if (catType === 'electronics' && catSlug.includes('phone')) {
      return {
        battery_health: batteryHealth,
        storage,
        condition,
        model,
        color,
      };
    }
    
    if (catType === 'electronics' && catSlug.includes('laptop')) {
      return {
        processor,
        ram,
        storage,
        condition,
        model,
      };
    }
    
    if (catType === 'electronics') {
      return {
        brand,
        condition,
        warranty,
      };
    }
    
    if (catType === 'vehicles') {
      return {
        make,
        model,
        year,
        mileage,
        gear_type: gearType,
        fuel_type: fuelType,
        condition,
      };
    }
    
    if (catType === 'property') {
      const getAmenityNames = (ids, amenitiesList) => {
        return ids.map(id => {
          const amenity = amenitiesList.find(a => getAmenityKey(a) === id);
          return amenity?.name || id;
        }).filter(Boolean);
      };

      const commonSpecs = {
        property_type: propertyType,
        amenities: getAmenityNames(selectedAmenities, indoorAmenities),
      };

      if (propertyType === 'land') {
        commonSpecs.land_size = landSize;
      } else {
        commonSpecs.bedrooms = bedrooms;
        commonSpecs.bathrooms = bathrooms;
        commonSpecs.size_sqft = sizeSqft;
      }
      
      if (listingType === 'rent' && (propertyType === 'house' || propertyType === 'apartment')) {
        commonSpecs.nearby_amenities = getAmenityNames(selectedNearbyAmenities, nearbyAmenities);
      }
      
      if (listingType === 'rent') {
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
    }
    
    return {};
  }

  async function handleSubmit() {
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter a title');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Please enter a description');
      return;
    }

    if (!selectedCity) {
      setErrorMessage('Please select a city');
      return;
    }

    if (images.length < 2) {
      setErrorMessage('Please add at least 2 photos');
      return;
    }

    try {
      setLoading(true);

      const categoryId = isUuid(selectedCategory?.id) ? selectedCategory.id : null;
      const categorySlug = getCategorySlug();

      const postData = {
        title: title.trim(),
        description: description.trim(),
        price: price ? parseFloat(price) : null,
        cityId: selectedCity?.id || null,
        images,
        categoryId,
      };

      const newPost = await postsApi.create(user?.id || 'guest', postData);

      if (selectedAmenities.length > 0 && newPost?.id && !usingFallbackData) {
        const validAmenityIds = selectedAmenities.filter(id => isUuid(id));
        if (validAmenityIds.length > 0) {
          try {
            await amenitiesApi.savePostAmenities(newPost.id, validAmenityIds);
          } catch (amenityError) {
            console.error('Error saving amenities:', amenityError);
          }
        }
      }

      Alert.alert(
        'Success',
        'Your post has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
      navigation.goBack();
    } catch (error) {
      console.error('Error creating post:', error);
      setErrorMessage(error.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function getCategoryIcon(cat) {
    if (cat.metadata?.icon) return cat.metadata.icon;
    const name = cat.name?.toLowerCase() || '';
    if (name.includes('phone')) return 'smartphone';
    if (name.includes('laptop')) return 'monitor';
    if (name.includes('electronic')) return 'zap';
    if (name.includes('car') || name.includes('vehicle')) return 'truck';
    if (name.includes('property')) return 'home';
    if (name.includes('furniture')) return 'box';
    return 'package';
  }

  function isPropertyCategory() {
    if (!selectedCategory) return false;
    return selectedCategory.type === 'property' || selectedCategory.name?.toLowerCase() === 'property';
  }

  function isCarsCategory() {
    if (!selectedCategory) return false;
    return selectedCategory.type === 'vehicles' || selectedCategory.name?.toLowerCase()?.includes('car');
  }

  function isPhonesCategory() {
    if (!selectedCategory) return false;
    return selectedCategory.name?.toLowerCase()?.includes('phone');
  }

  function isLaptopsCategory() {
    if (!selectedCategory) return false;
    return selectedCategory.name?.toLowerCase()?.includes('laptop');
  }

  function isElectronicsCategory() {
    if (!selectedCategory) return false;
    return selectedCategory.type === 'electronics' && !isPhonesCategory() && !isLaptopsCategory();
  }

  function renderCategoryFields() {
    if (isPhonesCategory()) {
      return (
        <View style={styles.section}>
          <ThemedText type="bodyLarge" style={styles.sectionTitle}>
            Phone Details
          </ThemedText>
          <InputField label="Model" value={model} onChangeText={setModel} placeholder="e.g., iPhone 14 Pro" theme={theme} />
          <InputField label="Battery Health" value={batteryHealth} onChangeText={setBatteryHealth} placeholder="e.g., 95%" theme={theme} />
          <InputField label="Storage" value={storage} onChangeText={setStorage} placeholder="e.g., 256GB" theme={theme} />
          <InputField label="Color" value={color} onChangeText={setColor} placeholder="e.g., Black" theme={theme} />
          
          <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
            Condition
          </ThemedText>
          <View style={styles.optionsRow}>
            {CONDITION_OPTIONS.map(opt => (
              <SelectButton key={opt} label={opt} selected={condition === opt} onPress={() => setCondition(opt)} theme={theme} />
            ))}
          </View>
        </View>
      );
    }

    if (isLaptopsCategory()) {
      return (
        <View style={styles.section}>
          <ThemedText type="bodyLarge" style={styles.sectionTitle}>
            Laptop Details
          </ThemedText>
          <InputField label="Model" value={model} onChangeText={setModel} placeholder="e.g., MacBook Pro 16" theme={theme} />
          <InputField label="Processor" value={processor} onChangeText={setProcessor} placeholder="e.g., M2 Pro" theme={theme} />
          <InputField label="RAM" value={ram} onChangeText={setRam} placeholder="e.g., 16GB" theme={theme} />
          <InputField label="Storage" value={storage} onChangeText={setStorage} placeholder="e.g., 512GB SSD" theme={theme} />
          
          <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
            Condition
          </ThemedText>
          <View style={styles.optionsRow}>
            {CONDITION_OPTIONS.map(opt => (
              <SelectButton key={opt} label={opt} selected={condition === opt} onPress={() => setCondition(opt)} theme={theme} />
            ))}
          </View>
        </View>
      );
    }

    if (isElectronicsCategory()) {
      return (
        <View style={styles.section}>
          <ThemedText type="bodyLarge" style={styles.sectionTitle}>
            Electronics Details
          </ThemedText>
          <InputField label="Brand" value={brand} onChangeText={setBrand} placeholder="e.g., Sony" theme={theme} />
          <InputField label="Warranty" value={warranty} onChangeText={setWarranty} placeholder="e.g., 1 year" theme={theme} />
          
          <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
            Condition
          </ThemedText>
          <View style={styles.optionsRow}>
            {CONDITION_OPTIONS.map(opt => (
              <SelectButton key={opt} label={opt} selected={condition === opt} onPress={() => setCondition(opt)} theme={theme} />
            ))}
          </View>
        </View>
      );
    }

    if (isCarsCategory()) {
      return (
        <View style={styles.section}>
          <ThemedText type="bodyLarge" style={styles.sectionTitle}>
            Car Details
          </ThemedText>
          <InputField label="Make / Model" value={make} onChangeText={setMake} placeholder="e.g., Toyota Camry" theme={theme} />
          <InputField label="Model Details" value={model} onChangeText={setModel} placeholder="e.g., 2.5L SE" theme={theme} />
          <InputField label="Year" value={year} onChangeText={setYear} placeholder="e.g., 2022" keyboardType="numeric" theme={theme} />
          <InputField label="Mileage" value={mileage} onChangeText={setMileage} placeholder="e.g., 25,000 km" theme={theme} />
          
          <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
            Fuel Type
          </ThemedText>
          <View style={styles.optionsRow}>
            {FUEL_TYPES.map(fuel => (
              <SelectButton key={fuel} label={fuel} selected={fuelType === fuel} onPress={() => setFuelType(fuel)} theme={theme} />
            ))}
          </View>

          <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
            Gear Type
          </ThemedText>
          <View style={styles.optionsRow}>
            {GEAR_TYPES.map(gear => (
              <SelectButton key={gear} label={gear} selected={gearType === gear} onPress={() => setGearType(gear)} theme={theme} />
            ))}
          </View>

          <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
            Condition
          </ThemedText>
          <View style={styles.optionsRow}>
            {CONDITION_OPTIONS.map(opt => (
              <SelectButton key={opt} label={opt} selected={condition === opt} onPress={() => setCondition(opt)} theme={theme} />
            ))}
          </View>
        </View>
      );
    }

    if (isPropertyCategory()) {
      return (
        <>
          <View style={styles.section}>
            <ThemedText type="bodyLarge" style={styles.sectionTitle}>
              Listing Type
            </ThemedText>
            <View style={styles.optionsRow}>
              {listingTypeOptions.map(type => (
                <SelectButton 
                  key={type.id || type.slug} 
                  label={type.name} 
                  selected={listingType === (type.slug || type.id)} 
                  onPress={() => setListingType(type.slug || type.id)} 
                  theme={theme} 
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="bodyLarge" style={styles.sectionTitle}>
              Property Details
            </ThemedText>
            
            <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
              Property Type
            </ThemedText>
            <View style={styles.optionsRow}>
              {propertyTypeOptions.map(type => (
                <SelectButton 
                  key={type.id || type.slug} 
                  label={type.name} 
                  selected={propertyType === (type.slug || type.id)} 
                  onPress={() => setPropertyType(type.slug || type.id)} 
                  theme={theme} 
                />
              ))}
            </View>

            {propertyType === 'land' ? (
              <InputField label="Land Size (sq m)" value={landSize} onChangeText={setLandSize} placeholder="e.g., 500" keyboardType="numeric" theme={theme} />
            ) : (
              <>
                <InputField label="Bedrooms" value={bedrooms} onChangeText={setBedrooms} placeholder="e.g., 3" keyboardType="numeric" theme={theme} />
                <InputField label="Bathrooms" value={bathrooms} onChangeText={setBathrooms} placeholder="e.g., 2" keyboardType="numeric" theme={theme} />
                <InputField label="Size (sq ft)" value={sizeSqft} onChangeText={setSizeSqft} placeholder="e.g., 1500" keyboardType="numeric" theme={theme} />
              </>
            )}

            {indoorAmenities.length > 0 && (
              <>
                <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
                  Amenities
                </ThemedText>
                <View style={styles.amenitiesGrid}>
                  {indoorAmenities.map(amenity => (
                    <AmenityChip
                      key={getAmenityKey(amenity)}
                      amenity={amenity}
                      selected={selectedAmenities.includes(getAmenityKey(amenity))}
                      onPress={() => toggleAmenity(amenity)}
                      theme={theme}
                    />
                  ))}
                </View>
              </>
            )}

            {listingType === 'rent' && (propertyType === 'house' || propertyType === 'apartment') && nearbyAmenities.length > 0 && (
              <>
                <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary, marginTop: Spacing.md }]}>
                  Nearby
                </ThemedText>
                <View style={styles.amenitiesGrid}>
                  {nearbyAmenities.map(amenity => (
                    <AmenityChip
                      key={getAmenityKey(amenity)}
                      amenity={amenity}
                      selected={selectedNearbyAmenities.includes(getAmenityKey(amenity))}
                      onPress={() => toggleNearbyAmenity(amenity)}
                      theme={theme}
                    />
                  ))}
                </View>
              </>
            )}

            {listingType === 'rent' ? (
              <>
                <ThemedText type="h3" style={styles.subsectionTitle}>
                  Rental Details
                </ThemedText>
                <InputField label="Monthly Rent" value={monthlyRent} onChangeText={setMonthlyRent} placeholder="e.g., 2500" keyboardType="numeric" theme={theme} />
                <InputField label="Deposit Amount" value={deposit} onChangeText={setDeposit} placeholder="e.g., 5000" keyboardType="numeric" theme={theme} />
                <InputField label="Min Contract Duration" value={minContract} onChangeText={setMinContract} placeholder="e.g., 12 months" theme={theme} />
                
                <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
                  Furnished
                </ThemedText>
                <View style={styles.optionsRow}>
                  <SelectButton label="Yes" selected={furnished === 'Yes'} onPress={() => setFurnished('Yes')} theme={theme} />
                  <SelectButton label="No" selected={furnished === 'No'} onPress={() => setFurnished('No')} theme={theme} />
                  <SelectButton label="Partially" selected={furnished === 'Partially'} onPress={() => setFurnished('Partially')} theme={theme} />
                </View>
              </>
            ) : (
              <>
                <ThemedText type="h3" style={styles.subsectionTitle}>
                  Sale Details
                </ThemedText>
                <InputField label="Sale Price" value={salePrice} onChangeText={setSalePrice} placeholder="e.g., 500000" keyboardType="numeric" theme={theme} />
                <InputField label="Ownership Type" value={ownershipType} onChangeText={setOwnershipType} placeholder="e.g., Freehold" theme={theme} />
                <InputField label="Property Age" value={propertyAge} onChangeText={setPropertyAge} placeholder="e.g., 5 years" theme={theme} />
                <InputField label="Payment Options" value={paymentOptions} onChangeText={setPaymentOptions} placeholder="e.g., Cash, Installments" theme={theme} />
              </>
            )}
          </View>
        </>
      );
    }

    return null;
  }

  if (dataLoading) {
    return <LoadingScreen theme={theme} />;
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
            <ThemedText type="body" style={{ color: theme.primary, fontWeight: '600' }}>
              Post
            </ThemedText>
          )}
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {errorMessage ? (
          <View style={[styles.errorBanner, { backgroundColor: '#fee2e2', borderColor: '#fecaca' }]}>
            <Feather name="alert-circle" size={18} color="#dc2626" />
            <ThemedText type="body" style={{ color: '#dc2626', flex: 1, marginLeft: Spacing.sm }}>
              {errorMessage}
            </ThemedText>
            <Pressable onPress={() => setErrorMessage('')}>
              <Feather name="x" size={18} color="#dc2626" />
            </Pressable>
          </View>
        ) : null}

        <View style={styles.section}>
          <ThemedText type="bodyLarge" style={styles.sectionTitle}>
            Category
          </ThemedText>
          <View style={styles.typeGrid}>
            {categories.map(cat => {
              const icon = getCategoryIcon(cat);
              const isSelected = selectedCategory?.id === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.typeChip,
                    { 
                      backgroundColor: isSelected ? theme.primary + '20' : theme.surface,
                      borderColor: isSelected ? theme.primary : theme.border,
                    }
                  ]}
                >
                  <Feather 
                    name={icon} 
                    size={20} 
                    color={isSelected ? theme.primary : theme.textSecondary} 
                  />
                  <ThemedText 
                    type="body" 
                    style={{ color: isSelected ? theme.primary : theme.textSecondary }}
                  >
                    {cat.name}
                  </ThemedText>
                </Pressable>
              );
            })}
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
              }
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

          <CityPicker
            label="City"
            selectedCity={selectedCity}
            onSelect={setSelectedCity}
            cities={cities}
            theme={theme}
          />
        </View>

        {renderCategoryFields()}

        <View style={{ height: Spacing.xl }} />
      </KeyboardAwareScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    padding: Spacing.xs,
    minWidth: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  subsectionTitle: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  uploadArea: {
    height: 150,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  imagesScroll: {
    flexGrow: 0,
  },
  imageContainer: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    marginBottom: Spacing.xs,
  },
  input: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: Spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  selectButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
});
