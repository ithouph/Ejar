import React, { useState } from 'react';
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
import { postsService } from '../services/postsService';

/**
 * ═══════════════════════════════════════════════════════════════════
 * ADD POST PAGE - Create Property Listing
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Features:
 * - Upload multiple images (up to 5)
 * - Property details (title, description, price, location)
 * - Property type selection (apartment, house, hotel, etc.)
 * - Amenities selection (Wi-Fi, parking, pool, etc.)
 */

const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Apartment', icon: 'home' },
  { id: 'house', label: 'House', icon: 'home' },
  { id: 'hotel', label: 'Hotel', icon: 'home' },
  { id: 'villa', label: 'Villa', icon: 'home' },
];

const AMENITIES = [
  { id: 'wifi', label: 'Wi-Fi', icon: 'wifi' },
  { id: 'parking', label: 'Parking', icon: 'truck' },
  { id: 'pool', label: 'Pool', icon: 'droplet' },
  { id: 'gym', label: 'Gym', icon: 'activity' },
  { id: 'ac', label: 'Air Conditioning', icon: 'wind' },
  { id: 'heating', label: 'Heating', icon: 'sun' },
  { id: 'kitchen', label: 'Kitchen', icon: 'coffee' },
  { id: 'laundry', label: 'Laundry', icon: 'refresh-cw' },
  { id: 'pets', label: 'Pet Friendly', icon: 'heart' },
  { id: 'smoking', label: 'Smoking Allowed', icon: 'alert-circle' },
];

function AmenityChip({ amenity, selected, onPress, theme }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.amenityChip,
        { 
          backgroundColor: selected ? theme.primary + '20' : theme.surface,
          borderColor: selected ? theme.primary : theme.border,
          borderWidth: 1,
        }
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
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('apartment');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handlePickImages() {
    try {
      const selectedImages = await postsService.pickImages(5);
      if (selectedImages.length > 0) {
        setImages(selectedImages);
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

  function toggleAmenity(amenityId) {
    setSelectedAmenities(prev => 
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  }

  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return;
    }

    try {
      setLoading(true);

      const postData = {
        title: title.trim(),
        description: description.trim(),
        price: price ? parseFloat(price) : null,
        location: location.trim(),
        propertyType,
        amenities: selectedAmenities,
        images,
        userName: user?.user_metadata?.full_name || user?.email || 'Anonymous User',
        userPhoto: user?.user_metadata?.avatar_url || 'https://via.placeholder.com/40',
      };

      await postsService.createPost(user?.id || 'guest', postData);

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
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
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
            Property Type
          </ThemedText>
          <View style={styles.typeGrid}>
            {PROPERTY_TYPES.map(type => (
              <Pressable
                key={type.id}
                onPress={() => setPropertyType(type.id)}
                style={[
                  styles.typeChip,
                  { 
                    backgroundColor: propertyType === type.id ? theme.primary + '20' : theme.surface,
                    borderColor: propertyType === type.id ? theme.primary : theme.border,
                    borderWidth: 1,
                  }
                ]}
              >
                <Feather 
                  name={type.icon} 
                  size={20} 
                  color={propertyType === type.id ? theme.primary : theme.textSecondary} 
                />
                <ThemedText 
                  type="body" 
                  style={{ color: propertyType === type.id ? theme.primary : theme.textSecondary }}
                >
                  {type.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="bodyLarge" style={styles.sectionTitle}>
            Details
          </ThemedText>
          
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title (e.g., Beautiful 2BR Apartment)"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { 
              backgroundColor: theme.surface,
              color: theme.textPrimary 
            }]}
          />

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea, { 
              backgroundColor: theme.surface,
              color: theme.textPrimary 
            }]}
          />

          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="Price per night (optional)"
            placeholderTextColor={theme.textSecondary}
            keyboardType="decimal-pad"
            style={[styles.input, { 
              backgroundColor: theme.surface,
              color: theme.textPrimary 
            }]}
          />

          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Location (e.g., Miami, FL)"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { 
              backgroundColor: theme.surface,
              color: theme.textPrimary 
            }]}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="bodyLarge" style={styles.sectionTitle}>
            Amenities & Features
          </ThemedText>
          <View style={styles.amenitiesGrid}>
            {AMENITIES.map(amenity => (
              <AmenityChip
                key={amenity.id}
                amenity={amenity}
                selected={selectedAmenities.includes(amenity.id)}
                onPress={() => toggleAmenity(amenity.id)}
                theme={theme}
              />
            ))}
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    width: 60,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '600',
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  uploadArea: {
    height: 200,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  imagesScroll: {
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  uploadedImage: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.small,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.medium,
  },
  input: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.small,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
    borderRadius: BorderRadius.medium,
  },
});
