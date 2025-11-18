# Design Guidelines: Travel Booking & Event Planning App

## Authentication Flow

**Authentication Required**: Google OAuth (SSO)
- **Welcome Screen**: Full-screen with scattered Notion-inspired icons, centered "Get started" button
- **Login/Signup Screen**: Google Sign-In button prominent, "I have an account" secondary option
- **Transition**: Smooth slide/fade animation (300ms) from welcome to login using React Native Reanimated
- **Post-Auth**: Redirect to personalized home page with couple/event details

## Navigation Architecture

**Root Navigation**: Bottom Tab Bar (5 tabs)
- **Tabs**: Discover/Search, Notifications, Favorites (center with floating style), Calendar, Settings
- **Tab Icons**: Use Feather icons from @expo/vector-icons
- **Active State**: Primary color fill with subtle scale animation (1.1x)
- **Tab Bar**: Semi-transparent background with blur effect, height: 60px, safe area padding bottom

**Stack Navigation**: Each tab contains its own stack for deep navigation
- Discover Stack: Home → Detail → Photo Gallery → Feedback
- Settings Stack: Settings → Profile → Edit Profile / Reviews / Support

## Screen Specifications

### Home/Discover Screen
**Header** (Custom, transparent):
- Settings icon (top-left), Favorite heart + Notification bell (top-right)
- Countdown timer badge: "365 days to go" with subtle background pill
- Personalized section: Couple names (Christine & Duncan), event date, location (Miami, FL), circular couple photo
- Safe area top inset: insets.top + 24px

**Main Content** (Scrollable):
- Search bar: Rounded (12px radius), magnifying glass icon, placeholder "Find the best for your holiday"
- Category tabs: Horizontal scroll, pill-shaped with count badges (All, Hotels, Apartments)
- Active tab: Dark background, white text, smooth transition (200ms)
- Hotel cards: Horizontal scroll with pagination dots
  - Card size: Width 85% screen, height 280px
  - Image: Full-width with 16px radius, overlay gradient at bottom
  - Favorite heart icon: Top-right corner with subtle white/transparent background circle
  - Content overlay: Hotel name (bold, 18px), location with pin icon, star rating (4.9 ★)
  - Shadow: offset (0, 4), opacity 0.15, radius 8

**Bottom Safe Area**: tabBarHeight + 24px

### Property Detail Modal
**Presentation**: Full-screen modal with slide-up animation (350ms ease-out)

**Header** (Fixed):
- Back arrow (left), Close X (right), Favorite heart (right of X)
- Transparent background initially, becomes opaque white/dark on scroll

**Content** (Scrollable):
- Hero image carousel: Full-width, swipeable with pagination dots
- Property badge: "Apartment" or "Hotel" pill overlay on image
- Title section: Name (bold, 24px), location with pin icon, star rating + review count
- Specifications row: Icons + text for bedrooms, bathrooms, square footage
- Agent section: Profile photo (48px circle), name, role subtitle, Message + Call buttons (outlined, blue)
- Amenities: Icon grid with Wi-Fi, AC, etc., "+3 more" badge
- About section: Description text (16px, line-height 24px)
- Photo gallery grid: 2 columns, 120px height thumbnails with 8px gap
- Tapping thumbnail: Opens full-screen photo gallery

**Bottom Section** (Sticky):
- Price: Large bold text "$1,600/month" or "$15.99/night"
- Book/Buy button: Full-width, primary blue, height 56px, radius 12px
- Shadow on button: offset (0, 2), opacity 0.20, radius 4
- Safe area bottom: insets.bottom + 24px

### Full-Screen Photo Gallery
**Header**: "Property Photos 📸" title, back button (left)
**Content**: 
- Swipeable images (react-native-swiper or FlatList horizontal pagination)
- Category labels: "Out Door", "Living Room", "Bedroom" pill overlays
- Swipe instruction text: Subtle bottom overlay
- Pagination dots: Bottom center

### Feedback/Report Modal
**Presentation**: Full-screen modal with slide-up animation
**Content**:
- Star rating selector: 5 interactive stars (1-5), yellow fill on selection
- Text input: Multi-line (120px height), placeholder "Share your experience..."
- Submit button: Primary blue, full-width
- Cancel: Header left button

### Settings Page
**Header**: "Settings" title, standard navigation
**Sections** (Grouped list):
- Profile card: Photo (64px circle), name, email from Google, chevron right
- My Reviews: Icon + text, chevron right
- Notification Preferences: Toggle switches
- Help & Support: Icon + text, chevron right
- Terms of Service: Icon + text, external link icon
- Privacy Policy: Icon + text, external link icon

### Edit Profile Screen
**Header**: "Edit Profile" title, Save button (right, blue text)
**Content** (Scrollable form):
- Profile photo: Centered 120px circle, camera icon overlay for upload
- Basic Details section header
  - Full name input
  - Date of birth picker (iOS native picker)
  - Gender selection: Male/Female radio buttons (custom styled)
- Contact Details section header
  - Mobile number input with country code prefix
  - Email input (pre-filled, gray/disabled)
- Personal Details section header
  - Weight input (kg suffix)
  - Height input (cm suffix)
- Save button: Bottom sticky, full-width blue button if changed

## Design System

### Color Palette
**Light Mode**:
- Primary: #2563EB (blue for CTAs)
- Background: #FFFFFF
- Surface: #F9FAFB
- Text Primary: #111827
- Text Secondary: #6B7280
- Border: #E5E7EB
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444

**Dark Mode**:
- Primary: #3B82F6 (lighter blue)
- Background: #111827
- Surface: #1F2937
- Text Primary: #F9FAFB
- Text Secondary: #9CA3AF
- Border: #374151
- Success: #34D399
- Warning: #FBBF24
- Error: #F87171

**Star Rating**: #FBBF24 (yellow/gold)

### Typography
- **Display**: Bold, 32px, line-height 40px (Welcome screen)
- **Heading 1**: Bold, 24px, line-height 32px (Screen titles)
- **Heading 2**: Semibold, 20px, line-height 28px (Section headers)
- **Body Large**: Regular, 18px, line-height 26px (Property names)
- **Body**: Regular, 16px, line-height 24px (Descriptions)
- **Body Small**: Regular, 14px, line-height 20px (Captions)
- **Caption**: Regular, 12px, line-height 16px (Timestamps, labels)
- **Font Family**: System default (San Francisco iOS, Roboto Android)

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- 2xl: 32px
- 3xl: 48px

### Border Radius
- Small: 8px (inputs, small buttons)
- Medium: 12px (cards, primary buttons)
- Large: 16px (modals, hero images)
- Full: 9999px (circles, pills)

## Visual Design Principles

1. **Imagery**: High-quality property photos are central; use subtle overlays for text readability
2. **Icons**: Feather icon set exclusively, 24px default size, 20px for compact areas
3. **Shadows**: Minimal use; only for floating elements (tab bar, floating buttons, cards)
4. **Animations**: Smooth transitions (200-350ms), spring physics for interactive elements
5. **Touch Targets**: Minimum 44x44px for all interactive elements
6. **Feedback**: Subtle scale (0.95x) on press, opacity change for non-primary actions
7. **Empty States**: Centered icon + message for empty lists/saved items
8. **Loading States**: Skeleton screens for lists, spinner for actions

## Interaction Design

**Card Interactions**:
- Tap card: Navigate to detail with shared element transition (hero image)
- Tap favorite: Heart fill animation with haptic feedback
- Swipe card: Horizontal pagination with momentum scrolling

**Form Inputs**:
- Focus state: Blue border (2px), subtle shadow
- Error state: Red border, error message below (14px, red)
- Disabled: Gray background, reduced opacity (0.6)

**Buttons**:
- Primary: Blue background, white text, 56px height, active state scale 0.97x
- Secondary: Outlined blue border, blue text, 48px height
- Text button: No background, blue text, underline on press

**Modals**:
- Backdrop: 40% black opacity
- Dismissal: Swipe down gesture or tap backdrop (detail modal only)
- Entry: Slide up + fade in (350ms cubic-bezier)

## Accessibility

- **Color Contrast**: Minimum 4.5:1 for text, 3:1 for UI components
- **Font Scaling**: Support dynamic type/font scaling
- **Touch Targets**: 44x44px minimum, adequate spacing between interactive elements
- **Screen Readers**: Meaningful labels for icons, image alt text for property photos
- **Focus Indicators**: Clear visual focus states for keyboard/assistive navigation

## Theme Management

- **Auto-detection**: Use device appearance setting (useColorScheme hook)
- **Transition**: Smooth theme transitions (200ms) for all color properties
- **Persistence**: Save manual theme overrides to secure storage
- **Components**: All components must adapt colors/styles based on active theme