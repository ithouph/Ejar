-- ============================================
-- EJAR MARKETPLACE - COMPREHENSIVE SEED DATA
-- All tables populated with proper UUIDs
-- Users for all roles: Guest, Normal, Member, Ex-Member, Leader
-- Run this AFTER DATABASE_SETUP.sql
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CITIES (Mauritanian Cities)
-- Use ON CONFLICT to handle existing cities from SETUP.sql
-- ============================================
INSERT INTO cities (id, name, region, is_active) VALUES
  ('c1111111-1111-1111-1111-111111111101', 'Nouakchott', 'Nouakchott Region', true),
  ('c1111111-1111-1111-1111-111111111102', 'Nouadhibou', 'Dakhlet Nouadhibou', true),
  ('c1111111-1111-1111-1111-111111111103', 'Kiffa', 'Assaba', true),
  ('c1111111-1111-1111-1111-111111111104', 'Kaédi', 'Gorgol', true),
  ('c1111111-1111-1111-1111-111111111105', 'Rosso', 'Trarza', true),
  ('c1111111-1111-1111-1111-111111111106', 'Zouérat', 'Tiris Zemmour', true),
  ('c1111111-1111-1111-1111-111111111107', 'Atar', 'Adrar', true),
  ('c1111111-1111-1111-1111-111111111108', 'Néma', 'Hodh Ech Chargui', true),
  ('c1111111-1111-1111-1111-111111111109', 'Sélibaby', 'Guidimaka', true),
  ('c1111111-1111-1111-1111-111111111110', 'Aleg', 'Brakna', true),
  ('c1111111-1111-1111-1111-111111111111', 'Tidjikja', 'Tagant', true),
  ('c1111111-1111-1111-1111-111111111112', 'Ayoun el Atrous', 'Hodh El Gharbi', true)
ON CONFLICT (name) DO UPDATE SET 
  id = EXCLUDED.id,
  region = EXCLUDED.region,
  is_active = EXCLUDED.is_active;

-- ============================================
-- 2. SERVICE CATEGORIES
-- Note: No slug column in this table
-- ============================================
INSERT INTO service_categories (id, name, type, description, metadata) VALUES
  ('ca222222-2222-2222-2222-222222222201', 'Property', 'property', 'Real estate listings including houses, apartments, and land', '{"icon": "home", "sort_order": 1}'),
  ('ca222222-2222-2222-2222-222222222202', 'Phones', 'electronics', 'Mobile phones and accessories', '{"icon": "smartphone", "sort_order": 2}'),
  ('ca222222-2222-2222-2222-222222222203', 'Laptops', 'electronics', 'Laptops and notebooks', '{"icon": "monitor", "sort_order": 3}'),
  ('ca222222-2222-2222-2222-222222222204', 'Electronics', 'electronics', 'TVs, cameras, audio equipment', '{"icon": "zap", "sort_order": 4}'),
  ('ca222222-2222-2222-2222-222222222205', 'Cars', 'vehicles', 'Cars and automobiles', '{"icon": "truck", "sort_order": 5}'),
  ('ca222222-2222-2222-2222-222222222206', 'Motorcycles', 'vehicles', 'Motorcycles and scooters', '{"icon": "navigation", "sort_order": 6}'),
  ('ca222222-2222-2222-2222-222222222207', 'Furniture', 'home', 'Home and office furniture', '{"icon": "box", "sort_order": 7}'),
  ('ca222222-2222-2222-2222-222222222208', 'Services', 'services', 'Professional services', '{"icon": "briefcase", "sort_order": 8}'),
  ('ca222222-2222-2222-2222-222222222209', 'Others', 'other', 'Miscellaneous items', '{"icon": "package", "sort_order": 9}')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. LISTING TYPES
-- Use ON CONFLICT (slug) to handle existing data from SETUP.sql
-- ============================================
INSERT INTO listing_types (id, name, slug, icon, sort_order, is_active) VALUES
  ('lt333333-3333-3333-3333-333333333301', 'For Rent', 'rent', 'key', 1, true),
  ('lt333333-3333-3333-3333-333333333302', 'For Sale', 'sale', 'tag', 2, true),
  ('lt333333-3333-3333-3333-333333333303', 'Short-Term', 'short_term', 'clock', 3, true),
  ('lt333333-3333-3333-3333-333333333304', 'Daily Rental', 'daily', 'calendar', 4, true),
  ('lt333333-3333-3333-3333-333333333305', 'Lease to Own', 'lease_to_own', 'home', 5, true)
ON CONFLICT (slug) DO UPDATE SET
  id = EXCLUDED.id,
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order;

-- ============================================
-- 4. PROPERTY TYPES
-- ============================================
INSERT INTO property_types (id, name, slug, icon, sort_order, is_active) VALUES
  ('pt444444-4444-4444-4444-444444444401', 'Apartment', 'apartment', 'home', 1, true),
  ('pt444444-4444-4444-4444-444444444402', 'House', 'house', 'home', 2, true),
  ('pt444444-4444-4444-4444-444444444403', 'Villa', 'villa', 'home', 3, true),
  ('pt444444-4444-4444-4444-444444444404', 'Land', 'land', 'map', 4, true),
  ('pt444444-4444-4444-4444-444444444405', 'Shop', 'shop', 'shopping-bag', 5, true),
  ('pt444444-4444-4444-4444-444444444406', 'Office', 'office', 'briefcase', 6, true),
  ('pt444444-4444-4444-4444-444444444407', 'Warehouse', 'warehouse', 'package', 7, true),
  ('pt444444-4444-4444-4444-444444444408', 'Studio', 'studio', 'home', 8, true)
ON CONFLICT (slug) DO UPDATE SET
  id = EXCLUDED.id,
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order;

-- ============================================
-- 5. AMENITIES
-- ============================================
INSERT INTO amenities (id, name, slug, icon, category, sort_order, is_active) VALUES
  -- Indoor Amenities
  ('am555555-5555-5555-5555-555555555501', 'Wi-Fi', 'wifi', 'wifi', 'indoor', 1, true),
  ('am555555-5555-5555-5555-555555555502', 'Air Conditioning', 'ac', 'wind', 'indoor', 2, true),
  ('am555555-5555-5555-5555-555555555503', 'Parking', 'parking', 'truck', 'indoor', 3, true),
  ('am555555-5555-5555-5555-555555555504', 'Kitchen', 'kitchen', 'coffee', 'indoor', 4, true),
  ('am555555-5555-5555-5555-555555555505', 'Furnished', 'furnished', 'box', 'indoor', 5, true),
  ('am555555-5555-5555-5555-555555555506', 'Water Tank', 'water_tank', 'droplet', 'indoor', 6, true),
  ('am555555-5555-5555-5555-555555555507', 'Generator', 'generator', 'zap', 'indoor', 7, true),
  ('am555555-5555-5555-5555-555555555508', 'Security', 'security', 'shield', 'indoor', 8, true),
  ('am555555-5555-5555-5555-555555555509', 'Elevator', 'elevator', 'arrow-up', 'indoor', 9, true),
  ('am555555-5555-5555-5555-555555555510', 'Garden', 'garden', 'sun', 'indoor', 10, true),
  ('am555555-5555-5555-5555-555555555511', 'Balcony', 'balcony', 'maximize', 'indoor', 11, true),
  ('am555555-5555-5555-5555-555555555512', 'Swimming Pool', 'pool', 'droplet', 'indoor', 12, true),
  -- Nearby Amenities
  ('am555555-5555-5555-5555-555555555521', 'Mosque', 'mosque', 'map-pin', 'nearby', 1, true),
  ('am555555-5555-5555-5555-555555555522', 'School', 'school', 'book', 'nearby', 2, true),
  ('am555555-5555-5555-5555-555555555523', 'Hospital', 'hospital', 'plus-circle', 'nearby', 3, true),
  ('am555555-5555-5555-5555-555555555524', 'Market', 'market', 'shopping-cart', 'nearby', 4, true),
  ('am555555-5555-5555-5555-555555555525', 'Gym', 'gym', 'activity', 'nearby', 5, true),
  ('am555555-5555-5555-5555-555555555526', 'Restaurant', 'restaurant', 'coffee', 'nearby', 6, true),
  ('am555555-5555-5555-5555-555555555527', 'Beach', 'beach', 'sun', 'nearby', 7, true),
  ('am555555-5555-5555-5555-555555555528', 'Bank', 'bank', 'credit-card', 'nearby', 8, true)
ON CONFLICT (slug) DO UPDATE SET
  id = EXCLUDED.id,
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  sort_order = EXCLUDED.sort_order;

-- ============================================
-- 6. USERS - ALL ROLES
-- ============================================

-- GUEST USER (Default user for "Continue as Guest")
-- This is the special guest user that gets loaded when someone presses "Continue as Guest"
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, profile_photo_url
) VALUES (
    'u0000000-0000-0000-0000-000000000001',
    '+22200000001',
    '+22200000001',
    'Guest',
    'User',
    'c1111111-1111-1111-1111-111111111101',
    'normal',
    0.00,
    0,
    NULL
) ON CONFLICT (id) DO NOTHING;

-- NORMAL USER 1 - Active user with balance (Nouakchott)
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, free_posts_used, total_posts_created
) VALUES (
    'u1111111-1111-1111-1111-111111111111',
    '+22212345678',
    '+22212345678',
    'Ahmed',
    'Mohamed',
    'c1111111-1111-1111-1111-111111111101',
    'normal',
    5000.00,
    3,
    2,
    5
) ON CONFLICT (id) DO NOTHING;

-- NORMAL USER 2 - User in Nouadhibou
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, free_posts_used, total_posts_created
) VALUES (
    'u1111111-1111-1111-1111-111111111112',
    '+22287654321',
    '+22287654321',
    'Fatima',
    'Mint Ahmed',
    'c1111111-1111-1111-1111-111111111102',
    'normal',
    2500.00,
    5,
    0,
    2
) ON CONFLICT (id) DO NOTHING;

-- NORMAL USER 3 - New user with no balance (Kaédi)
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, free_posts_used, total_posts_created
) VALUES (
    'u1111111-1111-1111-1111-111111111113',
    '+22211223344',
    '+22211223344',
    'Oumar',
    'Ba',
    'c1111111-1111-1111-1111-111111111104',
    'normal',
    0.00,
    5,
    0,
    0
) ON CONFLICT (id) DO NOTHING;

-- MEMBER 1 - Active member in Nouakchott
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining,
    member_payment_phone, member_payment_method, member_started_at, member_approvals_count, member_total_approved_mru
) VALUES (
    'u2222222-2222-2222-2222-222222222221',
    '+22233334444',
    '+22233334444',
    'Sidi',
    'Ould Cheikh',
    'c1111111-1111-1111-1111-111111111101',
    'member',
    15000.00,
    5,
    '+22233334444',
    'Bankily',
    NOW() - INTERVAL '60 days',
    45,
    125000.00
) ON CONFLICT (id) DO NOTHING;

-- MEMBER 2 - Active member in Nouadhibou
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining,
    member_payment_phone, member_payment_method, member_started_at, member_approvals_count, member_total_approved_mru
) VALUES (
    'u2222222-2222-2222-2222-222222222222',
    '+22255556666',
    '+22255556666',
    'Mariam',
    'Mint Sidi',
    'c1111111-1111-1111-1111-111111111102',
    'member',
    8500.00,
    4,
    '+22255556666',
    'Sedad',
    NOW() - INTERVAL '30 days',
    22,
    55000.00
) ON CONFLICT (id) DO NOTHING;

-- MEMBER 3 - New member in Atar
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining,
    member_payment_phone, member_payment_method, member_started_at, member_approvals_count, member_total_approved_mru
) VALUES (
    'u2222222-2222-2222-2222-222222222223',
    '+22277778888',
    '+22277778888',
    'Abdallah',
    'Ould Mohamed',
    'c1111111-1111-1111-1111-111111111107',
    'member',
    1200.00,
    5,
    '+22277778888',
    'Masrvi',
    NOW() - INTERVAL '7 days',
    3,
    7500.00
) ON CONFLICT (id) DO NOTHING;

-- EX-MEMBER 1 - Demoted member in Nouakchott (subscription expired)
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining,
    ex_member_reason, ex_member_demoted_at
) VALUES (
    'u3333333-3333-3333-3333-333333333331',
    '+22299990001',
    '+22299990001',
    'Mohamed',
    'Lemine',
    'c1111111-1111-1111-1111-111111111101',
    'ex_member',
    3000.00,
    2,
    'subscription_expired',
    NOW() - INTERVAL '15 days'
) ON CONFLICT (id) DO NOTHING;

-- EX-MEMBER 2 - Demoted member in Kiffa (manual demotion)
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining,
    ex_member_reason, ex_member_demoted_at
) VALUES (
    'u3333333-3333-3333-3333-333333333332',
    '+22299990002',
    '+22299990002',
    'Aissata',
    'Diallo',
    'c1111111-1111-1111-1111-111111111103',
    'ex_member',
    4500.00,
    5,
    'manual_demotion',
    NOW() - INTERVAL '45 days'
) ON CONFLICT (id) DO NOTHING;

-- LEADER 1 - Primary leader in Nouakchott
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining
) VALUES (
    'u4444444-4444-4444-4444-444444444441',
    '+22200001111',
    '+22200001111',
    'Cheikh',
    'Ould Abdallah',
    'c1111111-1111-1111-1111-111111111101',
    'leader',
    50000.00,
    99
) ON CONFLICT (id) DO NOTHING;

-- LEADER 2 - Second leader in Nouadhibou
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining
) VALUES (
    'u4444444-4444-4444-4444-444444444442',
    '+22200002222',
    '+22200002222',
    'Aminata',
    'Sow',
    'c1111111-1111-1111-1111-111111111102',
    'leader',
    35000.00,
    99
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. POSTS - Sample listings across categories
-- ============================================

-- Property Post 1 - Apartment for rent in Nouakchott (PAID, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
) VALUES (
    'po666666-6666-6666-6666-666666666601',
    'POST-2024-0001',
    'u1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111101',
    'ca222222-2222-2222-2222-222222222201',
    'Modern 3BR Apartment in Tevragh Zeina',
    'Beautiful fully furnished 3-bedroom apartment with AC, parking, and 24/7 security. Close to embassies and shopping centers.',
    85000.00,
    ARRAY['https://picsum.photos/400/300?random=1', 'https://picsum.photos/400/300?random=2'],
    true,
    false,
    'active',
    NOW() - INTERVAL '5 days'
) ON CONFLICT (id) DO NOTHING;

-- Property Post 2 - Villa for sale in Nouakchott (FREE POST, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
) VALUES (
    'po666666-6666-6666-6666-666666666602',
    'POST-2024-0002',
    'u1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111101',
    'ca222222-2222-2222-2222-222222222201',
    'Spacious Villa with Garden in Ksar',
    'Luxury 5-bedroom villa with swimming pool, large garden, and generator. Perfect for families.',
    250000000.00,
    ARRAY['https://picsum.photos/400/300?random=3', 'https://picsum.photos/400/300?random=4'],
    true,
    true,
    'active',
    NOW() - INTERVAL '10 days'
) ON CONFLICT (id) DO NOTHING;

-- Phone Post - iPhone for sale (PAID, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
) VALUES (
    'po666666-6666-6666-6666-666666666603',
    'POST-2024-0003',
    'u1111111-1111-1111-1111-111111111112',
    'c1111111-1111-1111-1111-111111111102',
    'ca222222-2222-2222-2222-222222222202',
    'iPhone 14 Pro Max 256GB - Like New',
    'Barely used iPhone 14 Pro Max in perfect condition. Comes with original box and charger.',
    450000.00,
    ARRAY['https://picsum.photos/400/300?random=5'],
    true,
    false,
    'active',
    NOW() - INTERVAL '3 days'
) ON CONFLICT (id) DO NOTHING;

-- Laptop Post - MacBook for sale (PAID, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
) VALUES (
    'po666666-6666-6666-6666-666666666604',
    'POST-2024-0004',
    'u2222222-2222-2222-2222-222222222221',
    'c1111111-1111-1111-1111-111111111101',
    'ca222222-2222-2222-2222-222222222203',
    'MacBook Pro M2 14-inch',
    'Professional laptop with M2 chip, 16GB RAM, 512GB SSD. Perfect for developers and designers.',
    720000.00,
    ARRAY['https://picsum.photos/400/300?random=6', 'https://picsum.photos/400/300?random=7'],
    true,
    false,
    'active',
    NOW() - INTERVAL '7 days'
) ON CONFLICT (id) DO NOTHING;

-- Car Post - Toyota for sale (PAID, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
) VALUES (
    'po666666-6666-6666-6666-666666666605',
    'POST-2024-0005',
    'u2222222-2222-2222-2222-222222222222',
    'c1111111-1111-1111-1111-111111111102',
    'ca222222-2222-2222-2222-222222222205',
    'Toyota Land Cruiser 2020 - Excellent Condition',
    'Well-maintained Land Cruiser with full service history. Low mileage, AC working perfectly.',
    8500000.00,
    ARRAY['https://picsum.photos/400/300?random=8', 'https://picsum.photos/400/300?random=9', 'https://picsum.photos/400/300?random=10'],
    true,
    false,
    'active',
    NOW() - INTERVAL '2 days'
) ON CONFLICT (id) DO NOTHING;

-- Electronics Post - TV for sale (UNPAID, PENDING)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
) VALUES (
    'po666666-6666-6666-6666-666666666606',
    'POST-2024-0006',
    'u1111111-1111-1111-1111-111111111113',
    'c1111111-1111-1111-1111-111111111104',
    'ca222222-2222-2222-2222-222222222204',
    'Samsung 55-inch Smart TV',
    '4K UHD Smart TV with HDR. Excellent picture quality. Remote included.',
    180000.00,
    ARRAY['https://picsum.photos/400/300?random=11'],
    false,
    false,
    'pending',
    NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO NOTHING;

-- Furniture Post (FREE POST, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
) VALUES (
    'po666666-6666-6666-6666-666666666607',
    'POST-2024-0007',
    'u3333333-3333-3333-3333-333333333331',
    'c1111111-1111-1111-1111-111111111101',
    'ca222222-2222-2222-2222-222222222207',
    'Complete Living Room Set',
    'Sofa set with coffee table and side tables. Excellent condition, barely used.',
    120000.00,
    ARRAY['https://picsum.photos/400/300?random=12', 'https://picsum.photos/400/300?random=13'],
    true,
    true,
    'active',
    NOW() - INTERVAL '8 days'
) ON CONFLICT (id) DO NOTHING;

-- Property in Atar (PAID, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
) VALUES (
    'po666666-6666-6666-6666-666666666608',
    'POST-2024-0008',
    'u2222222-2222-2222-2222-222222222223',
    'c1111111-1111-1111-1111-111111111107',
    'ca222222-2222-2222-2222-222222222201',
    'Traditional House in Atar Old Town',
    'Authentic stone house near the old market. 4 rooms with traditional architecture.',
    35000000.00,
    ARRAY['https://picsum.photos/400/300?random=14'],
    true,
    false,
    'active',
    NOW() - INTERVAL '12 days'
) ON CONFLICT (id) DO NOTHING;

-- Motorcycle Post (PAID, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
) VALUES (
    'po666666-6666-6666-6666-666666666609',
    'POST-2024-0009',
    'u1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111101',
    'ca222222-2222-2222-2222-222222222206',
    'Honda CRF 250 - Perfect for Desert',
    'Reliable motorcycle, perfect for sand and desert conditions. Well maintained.',
    350000.00,
    ARRAY['https://picsum.photos/400/300?random=15'],
    true,
    false,
    'active',
    NOW() - INTERVAL '4 days'
) ON CONFLICT (id) DO NOTHING;

-- Services Post (FREE POST, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
) VALUES (
    'po666666-6666-6666-6666-666666666610',
    'POST-2024-0010',
    'u2222222-2222-2222-2222-222222222221',
    'c1111111-1111-1111-1111-111111111101',
    'ca222222-2222-2222-2222-222222222208',
    'Professional House Cleaning Service',
    'Experienced cleaning team. We clean apartments, villas, and offices. Daily or weekly service available.',
    5000.00,
    ARRAY['https://picsum.photos/400/300?random=16'],
    true,
    true,
    'active',
    NOW() - INTERVAL '6 days'
) ON CONFLICT (id) DO NOTHING;

-- Post from ex-member (EXPIRED)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
) VALUES (
    'po666666-6666-6666-6666-666666666611',
    'POST-2024-0011',
    'u3333333-3333-3333-3333-333333333332',
    'c1111111-1111-1111-1111-111111111103',
    'ca222222-2222-2222-2222-222222222204',
    'Air Conditioner 2.5HP',
    'Powerful AC unit, cools large rooms quickly. 1 year old.',
    95000.00,
    ARRAY['https://picsum.photos/400/300?random=17'],
    true,
    false,
    'expired',
    NOW() - INTERVAL '45 days'
) ON CONFLICT (id) DO NOTHING;

-- Leader test post (PAID, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
) VALUES (
    'po666666-6666-6666-6666-666666666612',
    'POST-2024-0012',
    'u4444444-4444-4444-4444-444444444441',
    'c1111111-1111-1111-1111-111111111101',
    'ca222222-2222-2222-2222-222222222209',
    'Test Post - Platform Demo',
    'This is a test post to demonstrate the platform features.',
    1000.00,
    ARRAY['https://picsum.photos/400/300?random=18'],
    true,
    false,
    'active',
    NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. WALLET TRANSACTIONS
-- ============================================

-- Pending deposit from Normal User 1 (awaiting approval)
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status, created_at
) VALUES (
    'wt777777-7777-7777-7777-777777777701',
    'u1111111-1111-1111-1111-111111111113',
    'c1111111-1111-1111-1111-111111111104',
    'deposit',
    2000.00,
    0.00,
    2000.00,
    'https://picsum.photos/400/600?random=20',
    'Bankily',
    'pending',
    NOW() - INTERVAL '2 hours'
) ON CONFLICT (id) DO NOTHING;

-- Approved deposit for Normal User 1 (member approved)
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status,
    approved_by_user_id, approved_at, created_at
) VALUES (
    'wt777777-7777-7777-7777-777777777702',
    'u1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111101',
    'deposit',
    5000.00,
    0.00,
    5000.00,
    'https://picsum.photos/400/600?random=21',
    'Sedad',
    'approved',
    'u2222222-2222-2222-2222-222222222221',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
) ON CONFLICT (id) DO NOTHING;

-- Post payment transaction
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    post_id, status, created_at
) VALUES (
    'wt777777-7777-7777-7777-777777777703',
    'u1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111101',
    'post_payment',
    10.00,
    5000.00,
    4990.00,
    'po666666-6666-6666-6666-666666666601',
    'approved',
    NOW() - INTERVAL '5 days'
) ON CONFLICT (id) DO NOTHING;

-- Member approval reward
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    status, notes, created_at
) VALUES (
    'wt777777-7777-7777-7777-777777777704',
    'u2222222-2222-2222-2222-222222222221',
    'c1111111-1111-1111-1111-111111111101',
    'approval_reward',
    25.00,
    14975.00,
    15000.00,
    'approved',
    'Reward for approving deposit wt777777-7777-7777-7777-777777777702',
    NOW() - INTERVAL '3 days'
) ON CONFLICT (id) DO NOTHING;

-- Rejected deposit (user provided fake screenshot)
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status,
    rejected_by_user_id, rejection_reason, rejected_at, created_at
) VALUES (
    'wt777777-7777-7777-7777-777777777705',
    'u1111111-1111-1111-1111-111111111112',
    'c1111111-1111-1111-1111-111111111102',
    'deposit',
    10000.00,
    2500.00,
    12500.00,
    'https://picsum.photos/400/600?random=22',
    'Masrvi',
    'rejected',
    'u2222222-2222-2222-2222-222222222222',
    'Payment screenshot appears to be modified or fake',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO NOTHING;

-- Pending deposit in Nouadhibou
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status, created_at
) VALUES (
    'wt777777-7777-7777-7777-777777777706',
    'u1111111-1111-1111-1111-111111111112',
    'c1111111-1111-1111-1111-111111111102',
    'deposit',
    3000.00,
    2500.00,
    5500.00,
    'https://picsum.photos/400/600?random=23',
    'Bankily',
    'pending',
    NOW() - INTERVAL '4 hours'
) ON CONFLICT (id) DO NOTHING;

-- Ex-member subscription charge
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    status, notes, created_at
) VALUES (
    'wt777777-7777-7777-7777-777777777707',
    'u3333333-3333-3333-3333-333333333331',
    'c1111111-1111-1111-1111-111111111101',
    'ex_member_subscription',
    500.00,
    3500.00,
    3000.00,
    'approved',
    'Monthly ex-member subscription fee',
    NOW() - INTERVAL '15 days'
) ON CONFLICT (id) DO NOTHING;

-- Large pending deposit (escalated to leader)
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status, is_escalated, created_at
) VALUES (
    'wt777777-7777-7777-7777-777777777708',
    'u2222222-2222-2222-2222-222222222222',
    'c1111111-1111-1111-1111-111111111102',
    'deposit',
    50000.00,
    8500.00,
    58500.00,
    'https://picsum.photos/400/600?random=24',
    'Bankily',
    'pending',
    true,
    NOW() - INTERVAL '6 hours'
) ON CONFLICT (id) DO NOTHING;

-- Refund transaction
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    status, notes, approved_by_user_id, approved_at, created_at
) VALUES (
    'wt777777-7777-7777-7777-777777777709',
    'u1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111101',
    'refund',
    10.00,
    4990.00,
    5000.00,
    'approved',
    'Refund for duplicate post payment',
    'u4444444-4444-4444-4444-444444444441',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 9. MEMBER REPORTS (Unfair rejection complaints)
-- ============================================

-- Pending report against Member 2
INSERT INTO member_reports (
    id, reporter_user_id, reported_member_id, transaction_id,
    reason, details, status, created_at
) VALUES (
    'mr888888-8888-8888-8888-888888888801',
    'u1111111-1111-1111-1111-111111111112',
    'u2222222-2222-2222-2222-222222222222',
    'wt777777-7777-7777-7777-777777777705',
    'Unfair rejection - payment was valid',
    'I made a legitimate payment of 10,000 MRU via Masrvi. The screenshot is real and shows the transaction reference. The member rejected without proper verification.',
    'pending',
    NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO NOTHING;

-- Approved report (member was penalized)
INSERT INTO member_reports (
    id, reporter_user_id, reported_member_id, transaction_id,
    reason, details, status,
    reviewed_by_user_id, reviewed_at, review_notes, penalty_applied
) VALUES (
    'mr888888-8888-8888-8888-888888888802',
    'u1111111-1111-1111-1111-111111111111',
    'u2222222-2222-2222-2222-222222222221',
    'wt777777-7777-7777-7777-777777777702',
    'Delayed approval',
    'Member took more than 24 hours to approve my deposit even though the payment was clearly visible.',
    'approved',
    'u4444444-4444-4444-4444-444444444441',
    NOW() - INTERVAL '2 days',
    'Member failed to process within SLA. Penalty applied.',
    true
) ON CONFLICT (id) DO NOTHING;

-- Rejected report (user complaint was invalid)
INSERT INTO member_reports (
    id, reporter_user_id, reported_member_id, transaction_id,
    reason, details, status,
    reviewed_by_user_id, reviewed_at, review_notes, penalty_applied
) VALUES (
    'mr888888-8888-8888-8888-888888888803',
    'u3333333-3333-3333-3333-333333333331',
    'u2222222-2222-2222-2222-222222222222',
    'wt777777-7777-7777-7777-777777777706',
    'False rejection claim',
    'The member rejected my valid payment.',
    'rejected',
    'u4444444-4444-4444-4444-444444444442',
    NOW() - INTERVAL '5 days',
    'Investigation shows the payment screenshot was cropped and missing transaction reference. Rejection was valid.',
    false
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 10. NOTIFICATIONS
-- ============================================

INSERT INTO notifications (id, user_id, type, title, message, data, is_read, created_at) VALUES
  ('nt999999-9999-9999-9999-999999999901', 'u1111111-1111-1111-1111-111111111111', 'deposit_approved', 'Deposit Approved', 'Your deposit of 5,000 MRU has been approved!', '{"transaction_id": "wt777777-7777-7777-7777-777777777702"}', true, NOW() - INTERVAL '3 days'),
  ('nt999999-9999-9999-9999-999999999902', 'u1111111-1111-1111-1111-111111111112', 'deposit_rejected', 'Deposit Rejected', 'Your deposit of 10,000 MRU was rejected. Reason: Payment screenshot appears to be modified.', '{"transaction_id": "wt777777-7777-7777-7777-777777777705"}', false, NOW() - INTERVAL '1 day'),
  ('nt999999-9999-9999-9999-999999999903', 'u2222222-2222-2222-2222-222222222221', 'new_deposit_request', 'New Deposit Request', 'A user in your city submitted a deposit request.', '{"transaction_id": "wt777777-7777-7777-7777-777777777701"}', false, NOW() - INTERVAL '2 hours'),
  ('nt999999-9999-9999-9999-999999999904', 'u2222222-2222-2222-2222-222222222222', 'report_filed', 'Report Filed Against You', 'A user has filed a report against your rejection decision.', '{"report_id": "mr888888-8888-8888-8888-888888888801"}', false, NOW() - INTERVAL '1 day'),
  ('nt999999-9999-9999-9999-999999999905', 'u4444444-4444-4444-4444-444444444441', 'escalated_deposit', 'Escalated Deposit', 'A large deposit (50,000 MRU) requires your review.', '{"transaction_id": "wt777777-7777-7777-7777-777777777708"}', false, NOW() - INTERVAL '6 hours'),
  ('nt999999-9999-9999-9999-999999999906', 'u3333333-3333-3333-3333-333333333331', 'subscription_reminder', 'Subscription Expiring', 'Your ex-member subscription will expire in 5 days.', '{}', false, NOW() - INTERVAL '10 days'),
  ('nt999999-9999-9999-9999-999999999907', 'u1111111-1111-1111-1111-111111111111', 'post_expired', 'Post Expired', 'Your post "Modern 3BR Apartment" has expired. Renew it to keep it visible.', '{"post_id": "po666666-6666-6666-6666-666666666601"}', false, NOW() - INTERVAL '2 days'),
  ('nt999999-9999-9999-9999-999999999908', 'u2222222-2222-2222-2222-222222222221', 'approval_reward', 'Reward Earned!', 'You earned 25 MRU for approving a deposit.', '{"transaction_id": "wt777777-7777-7777-7777-777777777704"}', true, NOW() - INTERVAL '3 days'),
  ('nt999999-9999-9999-9999-999999999909', 'u1111111-1111-1111-1111-111111111113', 'welcome', 'Welcome to Ejar!', 'Start by posting your first listing. You have 5 free posts!', '{}', false, NOW() - INTERVAL '1 day'),
  ('nt999999-9999-9999-9999-999999999910', 'u4444444-4444-4444-4444-444444444441', 'pending_report', 'Pending Report', 'A new unfair rejection report requires your attention.', '{"report_id": "mr888888-8888-8888-8888-888888888801"}', false, NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 11. SAVED POSTS (Favorites)
-- ============================================

INSERT INTO saved_posts (id, user_id, post_id, created_at) VALUES
  ('sp101010-1010-1010-1010-101010101001', 'u1111111-1111-1111-1111-111111111111', 'po666666-6666-6666-6666-666666666603', NOW() - INTERVAL '2 days'),
  ('sp101010-1010-1010-1010-101010101002', 'u1111111-1111-1111-1111-111111111111', 'po666666-6666-6666-6666-666666666605', NOW() - INTERVAL '1 day'),
  ('sp101010-1010-1010-1010-101010101003', 'u1111111-1111-1111-1111-111111111112', 'po666666-6666-6666-6666-666666666601', NOW() - INTERVAL '4 days'),
  ('sp101010-1010-1010-1010-101010101004', 'u1111111-1111-1111-1111-111111111112', 'po666666-6666-6666-6666-666666666604', NOW() - INTERVAL '3 days'),
  ('sp101010-1010-1010-1010-101010101005', 'u2222222-2222-2222-2222-222222222221', 'po666666-6666-6666-6666-666666666608', NOW() - INTERVAL '5 days'),
  ('sp101010-1010-1010-1010-101010101006', 'u2222222-2222-2222-2222-222222222222', 'po666666-6666-6666-6666-666666666602', NOW() - INTERVAL '6 days'),
  ('sp101010-1010-1010-1010-101010101007', 'u3333333-3333-3333-3333-333333333331', 'po666666-6666-6666-6666-666666666609', NOW() - INTERVAL '7 days'),
  ('sp101010-1010-1010-1010-101010101008', 'u4444444-4444-4444-4444-444444444441', 'po666666-6666-6666-6666-666666666605', NOW() - INTERVAL '1 day'),
  ('sp101010-1010-1010-1010-101010101009', 'u0000000-0000-0000-0000-000000000001', 'po666666-6666-6666-6666-666666666601', NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 12. REVIEWS
-- ============================================

INSERT INTO reviews (id, post_id, user_id, rating, comment, created_at) VALUES
  ('rv121212-1212-1212-1212-121212121201', 'po666666-6666-6666-6666-666666666601', 'u1111111-1111-1111-1111-111111111112', 5, 'Excellent apartment! Very clean and the owner was very helpful.', NOW() - INTERVAL '3 days'),
  ('rv121212-1212-1212-1212-121212121202', 'po666666-6666-6666-6666-666666666601', 'u2222222-2222-2222-2222-222222222222', 4, 'Good location, nice furniture. AC was a bit noisy but overall great.', NOW() - INTERVAL '2 days'),
  ('rv121212-1212-1212-1212-121212121203', 'po666666-6666-6666-6666-666666666603', 'u1111111-1111-1111-1111-111111111111', 5, 'Phone was exactly as described. Fast transaction!', NOW() - INTERVAL '1 day'),
  ('rv121212-1212-1212-1212-121212121204', 'po666666-6666-6666-6666-666666666605', 'u2222222-2222-2222-2222-222222222221', 5, 'Great car, excellent condition. Seller was honest about everything.', NOW() - INTERVAL '1 day'),
  ('rv121212-1212-1212-1212-121212121205', 'po666666-6666-6666-6666-666666666610', 'u1111111-1111-1111-1111-111111111112', 4, 'Professional service, they did a great job cleaning my apartment.', NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 13. ROLE CHANGE LOGS
-- ============================================

INSERT INTO role_change_logs (id, user_id, from_role, to_role, changed_by_user_id, reason, created_at) VALUES
  ('rc131313-1313-1313-1313-131313131301', 'u2222222-2222-2222-2222-222222222221', 'normal', 'member', 'u4444444-4444-4444-4444-444444444441', 'Promoted to member after verification', NOW() - INTERVAL '60 days'),
  ('rc131313-1313-1313-1313-131313131302', 'u2222222-2222-2222-2222-222222222222', 'normal', 'member', 'u4444444-4444-4444-4444-444444444441', 'Promoted to member for Nouadhibou region', NOW() - INTERVAL '30 days'),
  ('rc131313-1313-1313-1313-131313131303', 'u3333333-3333-3333-3333-333333333331', 'member', 'ex_member', NULL, 'Subscription expired - automatic demotion', NOW() - INTERVAL '15 days'),
  ('rc131313-1313-1313-1313-131313131304', 'u3333333-3333-3333-3333-333333333332', 'member', 'ex_member', 'u4444444-4444-4444-4444-444444444441', 'Manual demotion due to inactivity', NOW() - INTERVAL '45 days'),
  ('rc131313-1313-1313-1313-131313131305', 'u2222222-2222-2222-2222-222222222223', 'normal', 'member', 'u4444444-4444-4444-4444-444444444442', 'New member for Atar region', NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 14. SUBSCRIPTION HISTORY (for ex-members)
-- ============================================

INSERT INTO subscription_history (id, user_id, action, amount_charged_mru, balance_before_mru, balance_after_mru, created_at) VALUES
  ('sh141414-1414-1414-1414-141414141401', 'u3333333-3333-3333-3333-333333333331', 'activated', 500.00, 3500.00, 3000.00, NOW() - INTERVAL '15 days'),
  ('sh141414-1414-1414-1414-141414141402', 'u3333333-3333-3333-3333-333333333332', 'expired', NULL, NULL, NULL, NOW() - INTERVAL '45 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 15. POST AMENITIES (Link posts to amenities)
-- ============================================

-- Apartment post amenities
INSERT INTO post_amenities (post_id, amenity_id) VALUES
  ('po666666-6666-6666-6666-666666666601', 'am555555-5555-5555-5555-555555555501'),
  ('po666666-6666-6666-6666-666666666601', 'am555555-5555-5555-5555-555555555502'),
  ('po666666-6666-6666-6666-666666666601', 'am555555-5555-5555-5555-555555555503'),
  ('po666666-6666-6666-6666-666666666601', 'am555555-5555-5555-5555-555555555505'),
  ('po666666-6666-6666-6666-666666666601', 'am555555-5555-5555-5555-555555555508')
ON CONFLICT DO NOTHING;

-- Villa post amenities
INSERT INTO post_amenities (post_id, amenity_id) VALUES
  ('po666666-6666-6666-6666-666666666602', 'am555555-5555-5555-5555-555555555501'),
  ('po666666-6666-6666-6666-666666666602', 'am555555-5555-5555-5555-555555555502'),
  ('po666666-6666-6666-6666-666666666602', 'am555555-5555-5555-5555-555555555503'),
  ('po666666-6666-6666-6666-666666666602', 'am555555-5555-5555-5555-555555555507'),
  ('po666666-6666-6666-6666-666666666602', 'am555555-5555-5555-5555-555555555510'),
  ('po666666-6666-6666-6666-666666666602', 'am555555-5555-5555-5555-555555555512')
ON CONFLICT DO NOTHING;

-- Atar house amenities
INSERT INTO post_amenities (post_id, amenity_id) VALUES
  ('po666666-6666-6666-6666-666666666608', 'am555555-5555-5555-5555-555555555504'),
  ('po666666-6666-6666-6666-666666666608', 'am555555-5555-5555-5555-555555555506'),
  ('po666666-6666-6666-6666-666666666608', 'am555555-5555-5555-5555-555555555521'),
  ('po666666-6666-6666-6666-666666666608', 'am555555-5555-5555-5555-555555555524')
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA COMPLETE
-- ============================================
-- Total records created:
-- - 12 Cities
-- - 9 Service Categories
-- - 5 Listing Types
-- - 8 Property Types
-- - 20 Amenities
-- - 11 Users (1 Guest, 3 Normal, 3 Member, 2 Ex-Member, 2 Leader)
-- - 12 Posts
-- - 9 Wallet Transactions
-- - 3 Member Reports
-- - 10 Notifications
-- - 9 Saved Posts
-- - 5 Reviews
-- - 5 Role Change Logs
-- - 2 Subscription History
-- - 15 Post-Amenity Links
-- ============================================
