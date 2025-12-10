import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator, Alert, TextInput, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../theme/global';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { cities as citiesApi } from '../services';

export default function CompleteProfile({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, completeRegistration } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [whatsapp, setWhatsapp] = useState(user?.phone?.replace('+222', '') || '');
  const [selectedCity, setSelectedCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [showCities, setShowCities] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const data = await citiesApi.getAll();
      setCities(data);
    } catch (error) {
      console.error('Error loading cities:', error);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleComplete = async () => {
    if (!firstName.trim()) {
      Alert.alert('Required', 'Please enter your first name');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Required', 'Please enter your last name');
      return;
    }
    if (!selectedCity) {
      Alert.alert('Required', 'Please select your city');
      return;
    }

    try {
      setLoading(true);
      await completeRegistration({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        whatsapp_number: whatsapp ? '+222' + whatsapp.replace(/[^\d]/g, '') : user?.phone,
        city_id: selectedCity.id,
      });
    } catch (error) {
      console.error('Complete profile error:', error);
      Alert.alert(
        'Error',
        error.message || 'Unable to complete registration. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={[
          styles.content, 
          { paddingTop: insets.top + Spacing['2xl'], paddingBottom: insets.bottom + Spacing.xl }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <ThemedText type="h1" style={styles.title}>
            Complete Profile
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Let's finish setting up your account
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} style={styles.form}>
          <View style={styles.inputContainer}>
            <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
              First Name
            </ThemedText>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { 
                backgroundColor: theme.surface, 
                color: theme.textPrimary, 
                borderColor: theme.border 
              }]}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
              Last Name
            </ThemedText>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { 
                backgroundColor: theme.surface, 
                color: theme.textPrimary, 
                borderColor: theme.border 
              }]}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
              WhatsApp Number
            </ThemedText>
            <View style={[styles.phoneInputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <ThemedText type="body" style={styles.countryCode}>+222</ThemedText>
              <TextInput
                value={whatsapp}
                onChangeText={(text) => setWhatsapp(text.replace(/[^\d]/g, ''))}
                placeholder="12345678"
                placeholderTextColor={theme.textSecondary}
                keyboardType="phone-pad"
                style={[styles.phoneInput, { color: theme.textPrimary }]}
                maxLength={10}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
              City
            </ThemedText>
            <Pressable
              onPress={() => setShowCities(!showCities)}
              style={[styles.selectButton, { 
                backgroundColor: theme.surface, 
                borderColor: theme.border 
              }]}
            >
              <ThemedText type="body" style={{ color: selectedCity ? theme.textPrimary : theme.textSecondary }}>
                {selectedCity ? selectedCity.name : 'Select your city'}
              </ThemedText>
              <Feather 
                name={showCities ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={theme.textSecondary} 
              />
            </Pressable>
            
            {showCities && (
              <View style={[styles.citiesList, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                {loadingCities ? (
                  <ActivityIndicator size="small" color={theme.primary} style={{ padding: Spacing.lg }} />
                ) : (
                  cities.map((city) => (
                    <Pressable
                      key={city.id}
                      onPress={() => {
                        setSelectedCity(city);
                        setShowCities(false);
                      }}
                      style={[
                        styles.cityItem,
                        { borderBottomColor: theme.border },
                        selectedCity?.id === city.id && { backgroundColor: theme.surfaceHover }
                      ]}
                    >
                      <ThemedText type="body">{city.name}</ThemedText>
                      {city.region && (
                        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                          {city.region}
                        </ThemedText>
                      )}
                    </Pressable>
                  ))
                )}
              </View>
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600)} style={styles.footer}>
          <Pressable
            onPress={handleComplete}
            disabled={loading}
            style={[
              styles.primaryButton, 
              { 
                backgroundColor: theme.primary, 
                opacity: loading ? 0.6 : 1 
              }
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Feather name="check" size={20} color="#FFFFFF" />
                <ThemedText type="body" style={styles.primaryButtonText}>
                  Complete Registration
                </ThemedText>
              </>
            )}
          </Pressable>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    gap: Spacing['2xl'],
  },
  header: {
    gap: Spacing.sm,
  },
  title: {
    fontWeight: '700',
  },
  form: {
    gap: Spacing.lg,
  },
  inputContainer: {
    gap: Spacing.xs,
  },
  label: {
    fontWeight: '500',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
  },
  countryCode: {
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  phoneInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
  },
  citiesList: {
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.xs,
    maxHeight: 200,
  },
  cityItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: Spacing.lg,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    height: 56,
    borderRadius: BorderRadius.medium,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
