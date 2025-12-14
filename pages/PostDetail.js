import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Pressable, Dimensions, FlatList, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, BorderRadius } from '../theme/global';

const SCREEN_WIDTH = Dimensions.get('window').width;

function formatPrice(price) {
  if (!price && price !== 0) return '';
  return new Intl.NumberFormat('en-US').format(price) + ' MRU';
}

export default function PostDetail({ route, navigation }) {
  const { post } = route.params;
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = post.images && post.images.length > 0 
    ? post.images 
    : [post.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'];
  
  const title = post.name || post.title || 'Untitled';
  const location = post.location || post.city?.name || 'Nouakchott';
  const description = post.description || 'No description provided.';
  const category = post.category || 'others';
  const whatsappNumber = post.user?.whatsapp_number || post.whatsapp_number || '+22200000000';

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hello, I'm interested in your listing: ${title}`);
    const url = `whatsapp://send?phone=${whatsappNumber.replace(/\+/g, '')}&text=${message}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('WhatsApp not available', 'Please install WhatsApp to contact the seller.');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Could not open WhatsApp.');
      });
  };

  const handleCall = () => {
    const phoneNumber = post.user?.phone || whatsappNumber;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentImageIndex(index);
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { top: insets.top + Spacing.md }]}
          >
            <Feather name="arrow-left" size={24} color="#FFF" />
          </Pressable>
          
          <Pressable
            style={[styles.shareButton, { top: insets.top + Spacing.md }]}
          >
            <Feather name="share" size={20} color="#FFF" />
          </Pressable>

          {images.length > 1 ? (
            <View style={styles.paginationDots}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: index === currentImageIndex ? '#FFF' : 'rgba(255,255,255,0.5)',
                    },
                  ]}
                />
              ))}
            </View>
          ) : null}

          <View style={styles.imageCounter}>
            <ThemedText type="bodySmall" lightColor="#FFF" darkColor="#FFF">
              {currentImageIndex + 1}/{images.length}
            </ThemedText>
          </View>
        </View>

        <View style={styles.content}>
          <View style={[styles.categoryBadge, { backgroundColor: theme.primary + '20' }]}>
            <ThemedText type="caption" style={{ color: theme.primary, textTransform: 'capitalize' }}>
              {category}
            </ThemedText>
          </View>

          <ThemedText type="h1" style={styles.title}>
            {title}
          </ThemedText>

          <View style={styles.locationRow}>
            <Feather name="map-pin" size={16} color={theme.textSecondary} />
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              {location}
            </ThemedText>
          </View>

          <View style={styles.priceContainer}>
            <ThemedText type="h1" style={{ color: theme.primary }}>
              {formatPrice(post.price)}
            </ThemedText>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              Description
            </ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary, lineHeight: 24 }}>
              {description}
            </ThemedText>
          </View>

          {post.condition ? (
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: theme.surface }]}>
                <Feather name="check-circle" size={20} color={theme.primary} />
              </View>
              <View>
                <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>Condition</ThemedText>
                <ThemedText type="body" style={{ textTransform: 'capitalize' }}>{post.condition}</ThemedText>
              </View>
            </View>
          ) : null}

          {post.created_at ? (
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: theme.surface }]}>
                <Feather name="calendar" size={20} color={theme.primary} />
              </View>
              <View>
                <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>Posted</ThemedText>
                <ThemedText type="body">{new Date(post.created_at).toLocaleDateString()}</ThemedText>
              </View>
            </View>
          ) : null}

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              Seller
            </ThemedText>
            <View style={styles.sellerRow}>
              <View style={[styles.sellerAvatar, { backgroundColor: theme.primary }]}>
                <ThemedText type="h3" lightColor="#FFF" darkColor="#FFF">
                  {(post.user?.first_name || 'S')[0].toUpperCase()}
                </ThemedText>
              </View>
              <View style={styles.sellerInfo}>
                <ThemedText type="body" style={{ fontWeight: '600' }}>
                  {post.user?.first_name ? `${post.user.first_name} ${post.user.last_name || ''}` : 'Seller'}
                </ThemedText>
                <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
                  {location}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { 
            backgroundColor: theme.background, 
            paddingBottom: insets.bottom + Spacing.md,
            borderTopColor: theme.border,
          },
        ]}
      >
        <Pressable
          style={[styles.callButton, { backgroundColor: theme.surface }]}
          onPress={handleCall}
        >
          <Feather name="phone" size={20} color={theme.primary} />
        </Pressable>
        <Pressable
          style={[styles.whatsappButton, { backgroundColor: '#25D366' }]}
          onPress={handleWhatsApp}
        >
          <Feather name="message-circle" size={20} color="#FFF" />
          <ThemedText type="body" lightColor="#FFF" darkColor="#FFF" style={{ fontWeight: '600' }}>
            WhatsApp
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 350,
    position: 'relative',
  },
  image: {
    width: SCREEN_WIDTH,
    height: 350,
  },
  backButton: {
    position: 'absolute',
    left: Spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    position: 'absolute',
    right: Spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationDots: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  imageCounter: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  title: {
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  priceContainer: {
    marginTop: Spacing.xs,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  detailIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerInfo: {
    flex: 1,
    gap: Spacing.xs / 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  callButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
});
