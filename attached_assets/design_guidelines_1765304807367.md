# Ejar Rental Marketplace - Design Guidelines

## 1. Architecture Decisions

### Authentication
**Required**: Full authentication system with city-based onboarding
- **OTP-based phone authentication** (primary method for Mauritanian market)
- **Onboarding flow**: Phone verification → City selection (mandatory) → Profile setup (first/last name, WhatsApp)
- **City selection**: Required before accessing app, searchable dropdown with regions
- **Session persistence**: Maintain login across app restarts
- **4-tier role system**: Visual indicators for Normal, Member, Ex-Member, Leader badges

### Navigation
**Root Navigation**: Tab Bar (5 tabs) + Role-based conditional tabs
- **Tab 1**: Home (property feed)
- **Tab 2**: Search (filters and categories)
- **Tab 3**: Create Post (floating action button - center tab)
- **Tab 4**: Saved (bookmarked properties)
- **Tab 5**: Profile (user account)
- **Conditional Tab (Members only)**: Approvals (visible when role = member AND balance >= 1000 MRU)
- **Conditional Tab (Leader only)**: Dashboard (replaces Approvals for leader role)

**Modal Screens** (Full-screen):
- Post Detail
- Create/Edit Post (multi-step)
- User Profile (other users)
- Wallet/Balance
- Deposit Payment
- Review Submission
- Report Submission
- Category Management (Leader)
- Member Promotion (Leader)

## 2. Screen Specifications

### Home Feed
- **Header**: Transparent, with city selector (left), notifications bell (right)
- **Layout**: Scrollable vertical list with pull-to-refresh
- **Pinned Posts Section**: Yellow badge, appears first in feed
- **Post Cards**: 2-column grid on tablets, single column on phones
- **Safe Area**: Top inset = headerHeight + 16px, Bottom inset = tabBarHeight + 16px
- **Floating Filter Button**: Bottom-right, 56x56px with drop shadow

### Post Detail
- **Header**: Custom navigation with back button (left), share/save icons (right), semi-transparent background over image
- **Layout**: Scrollable with sticky header image gallery
- **Gallery**: Full-width carousel with page indicators, tap for fullscreen
- **Content Sections**: Price (hero), Amenities (icon grid), Description, Location map, Reviews, Poster profile card
- **Action Bar**: Fixed bottom bar with Like (heart), Save (bookmark), WhatsApp, Call buttons
- **Safe Area**: Bottom inset = 80px (action bar) + insets.bottom

### Create Post (Multi-step Form)
- **Header**: Progress indicator (Steps 1-4), Cancel (left), Next/Submit (right)
- **Steps**: 1) Photos upload, 2) Basic info + Category, 3) Amenities selection, 4) Pricing + Post type (Normal/Pinned)
- **Layout**: Scrollable form with keyboard-aware scrolling
- **Submit Button**: Below form, disabled state when validation fails
- **Safe Area**: Bottom inset = 120px (button container) + insets.bottom

### Wallet/Balance Page
- **Header**: Standard with "Balance" title, settings icon (right)
- **Balance Card**: Hero card showing MRU amount, large typography
- **Action Buttons**: Deposit Money (primary), Transaction History (secondary)
- **Transaction List**: Grouped by date, showing type icons, amounts with +/- colors
- **Safe Area**: Top inset = 16px, Bottom inset = tabBarHeight + 16px

### Member Approval Page
- **Header**: Badge count indicator, filter by status dropdown
- **Layout**: Vertical list of pending payments (city-filtered)
- **Payment Card**: User info, amount, screenshot thumbnail, timestamp, Approve (green) / Reject (red) buttons
- **Balance Threshold Warning**: Banner at top when balance < 1000 MRU (buttons disabled)
- **Safe Area**: Standard with tab bar inset

### User Profile (Own)
- **Header**: Transparent with settings icon (right)
- **Profile Section**: Avatar (editable), name, city badge, "Days on Platform" counter, role badge
- **Stats Row**: Posts count, Average rating, Reviews count
- **Tabs**: My Posts, Reviews, Balance, Settings
- **Safe Area**: Top inset = headerHeight + 16px, Bottom inset = tabBarHeight + 16px

### Leader Dashboard
- **Header**: "Leader Dashboard" title with search icon
- **Tabs**: Users, Posts, Categories, Reports, Analytics
- **Search Bar**: Prominent search by phone number
- **User Cards**: Role badge, balance, promote/demote buttons, "View Details" link
- **Safe Area**: Standard with tab bar inset

## 3. Design System

### Color Palette
**Primary Brand Colors**:
- Primary Blue: `#1368E6` (CTAs, links, active states)
- Primary Dark: `#0D4FA3` (pressed states)
- Primary Light: `#E3F2FD` (backgrounds, highlights)

**Role Badge Colors**:
- Normal User: `#6B7280` (gray)
- Member: `#10B981` (green)
- Ex-Member: `#F59E0B` (amber)
- Leader: `#8B5CF6` (purple)

**Status Colors**:
- Success/Approved: `#10B981`
- Pending/Warning: `#F59E0B`
- Error/Rejected: `#EF4444`
- Pinned Post: `#FCD34D` (yellow badge)

**Neutral Colors**:
- Background: `#F9FAFB`
- Card Background: `#FFFFFF`
- Border: `#E5E7EB`
- Text Primary: `#111827`
- Text Secondary: `#6B7280`
- Text Tertiary: `#9CA3AF`

**Currency Display**:
- Positive Amount: `#10B981` (green, for earnings)
- Negative Amount: `#EF4444` (red, for deductions)
- Balance Display: `#111827` (dark, large weight)

### Typography
**Font Family**: System default (SF Pro for iOS, Roboto for Android)
- **Hero/Balance**: 32px, Bold (MRU amounts)
- **H1**: 24px, Bold (page titles)
- **H2**: 20px, Semibold (section headers)
- **H3**: 18px, Semibold (card titles)
- **Body**: 16px, Regular (descriptions)
- **Caption**: 14px, Regular (metadata, timestamps)
- **Small**: 12px, Regular (labels, badges)

**Currency Formatting**: Always show "MRU" suffix, use thousand separators (e.g., "1,000 MRU")

### Spacing
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px

### Component Styles
**Post Card**:
- Border radius: 12px
- Elevation/Shadow: shadowOffset (0, 2), shadowOpacity 0.1, shadowRadius 4
- Image aspect ratio: 16:9
- Like/Save counters: Top-right overlay with semi-transparent background
- Pinned badge: Top-left, yellow with "Pinned" text

**Buttons**:
- Primary: Blue background, white text, 48px height, 8px border radius
- Secondary: White background, blue border, blue text
- Destructive: Red background, white text
- Icon-only: 44x44px minimum, circular background on press
- Floating Action: 56x56px, blue, white icon, drop shadow (0, 2, 0.1, 2)

**Input Fields**:
- Height: 48px
- Border: 1px solid `#E5E7EB`, focus state: 2px solid `#1368E6`
- Border radius: 8px
- Padding: 12px horizontal
- Error state: Red border with error message below

**Badges**:
- Role badges: 6px border radius, 4px padding vertical, 8px horizontal
- Count badges (likes, saves): Circular or pill-shaped, white text on semi-transparent dark background

## 4. Visual Design

### Icons
- Use **Feather icons** from `@expo/vector-icons` for all standard actions
- Custom category icons stored in database (amenities, property types)
- Icon sizes: 20px (inline), 24px (buttons), 32px (feature icons)

### Images
**Required Assets**:
- City placeholder icons (8 cities for Mauritania)
- Category icons (amenities: WiFi, Parking, AC, etc.)
- Empty states illustrations (no posts, no saved items, no notifications)
- Role badges (member, ex-member, leader)
- Payment method icons (bank transfer, mobile money)

**User-generated**:
- Property photos (multiple per post)
- Payment screenshot uploads
- User avatars (generated or uploaded)

### Touchable Feedback
- Cards: Scale 0.98 + opacity 0.8 on press
- Buttons: Darken background 10% on press
- Icon buttons: Circular highlight background (8% opacity) on press
- Like button: Heart fill animation (scale + color change)
- Save button: Bookmark fill animation

### Drop Shadows
- Cards: shadowOffset (0, 1), shadowOpacity 0.05, shadowRadius 2
- Floating buttons: shadowOffset (0, 2), shadowOpacity 0.10, shadowRadius 2
- Modals: shadowOffset (0, 4), shadowOpacity 0.15, shadowRadius 8

## 5. Interaction Design

### Gestures
- **Swipe right** on post card: Quick save
- **Long press** on post: Share menu
- **Pull to refresh**: Home feed, My Posts, Saved
- **Pinch to zoom**: Image galleries

### Animations
- **Screen transitions**: Slide from right (300ms)
- **Modal presentation**: Slide from bottom (300ms)
- **Like animation**: Scale 1.2 → 1.0, color red (200ms)
- **Save animation**: Bounce effect (300ms)
- **Balance update**: Count-up animation when amount changes

### Loading States
- **Skeleton screens** for post cards during initial load
- **Shimmer effect** on placeholders
- **Pull-to-refresh** spinner at top of scrollable lists
- **Inline spinners** for button actions (Approve/Reject)

### Error Handling
- **Toast notifications** for temporary errors (bottom, 3s auto-dismiss)
- **Inline validation** on form fields (real-time)
- **Alert dialogs** for critical actions (delete post, reject payment)
- **Empty states** with illustrations and helpful CTAs

## 6. Accessibility

### Requirements
- **Touch targets**: Minimum 44x44px for all interactive elements
- **Contrast ratios**: WCAG AA minimum (4.5:1 for text, 3:1 for large text)
- **Focus indicators**: 3px blue outline on focused elements
- **Screen reader labels**: Meaningful labels for all buttons and inputs
- **Form validation**: Clear error messages with suggestions
- **Alternative text**: For all images and icons
- **Font scaling**: Support dynamic type sizes

### Localization Considerations
- **RTL support**: Design works for Arabic layout (future enhancement)
- **Currency formatting**: Always display "MRU" with thousand separators
- **Date formatting**: Use relative dates (e.g., "2 days ago") with full date on tap
- **Phone number formatting**: Support Mauritanian format (+222 XX XX XX XX)