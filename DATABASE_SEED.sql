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
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. SERVICE CATEGORIES
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
-- ============================================
INSERT INTO listing_types (id, name, slug, icon, sort_order, is_active) VALUES
  ('lt333333-3333-3333-3333-333333333301', 'For Rent', 'rent', 'key', 1, true),
  ('lt333333-3333-3333-3333-333333333302', 'For Sale', 'sale', 'tag', 2, true),
  ('lt333333-3333-3333-3333-333333333303', 'Short-Term', 'short-term', 'clock', 3, true),
  ('lt333333-3333-3333-3333-333333333304', 'Daily Rental', 'daily', 'calendar', 4, true),
  ('lt333333-3333-3333-3333-333333333305', 'Lease to Own', 'lease-to-own', 'home', 5, true)
ON CONFLICT (id) DO NOTHING;

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
ON CONFLICT (id) DO NOTHING;

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
  ('am555555-5555-5555-5555-555555555506', 'Water Tank', 'water-tank', 'droplet', 'indoor', 6, true),
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
ON CONFLICT (id) DO NOTHING;

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
    4
) ON CONFLICT (id) DO NOTHING;

-- NORMAL USER 2 - User with no free posts (Nouadhibou)
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, free_posts_used, total_posts_created
) VALUES (
    'u1111111-1111-1111-1111-111111111112',
    '+22287654321',
    '+22287654321',
    'Fatima',
    'Mint Ali',
    'c1111111-1111-1111-1111-111111111102',
    'normal',
    2500.00,
    0,
    5,
    8
) ON CONFLICT (id) DO NOTHING;

-- NORMAL USER 3 - New user with all free posts (Kaédi)
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, free_posts_used, total_posts_created
) VALUES (
    'u1111111-1111-1111-1111-111111111113',
    '+22211223344',
    '+22211223344',
    'Oumar',
    'Diallo',
    'c1111111-1111-1111-1111-111111111104',
    'normal',
    0.00,
    5,
    0,
    0
) ON CONFLICT (id) DO NOTHING;

-- MEMBER USER 1 - Active member in Nouakchott
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, member_payment_phone, member_terms_conditions,
    wallet_balance_mru, free_posts_remaining, total_posts_created,
    total_approvals_made, total_earned_from_approvals_mru, total_reports_received
) VALUES (
    'u2222222-2222-2222-2222-222222222221',
    '+22233334444',
    '+22233334444',
    'Mariem',
    'Ould Sidi',
    'c1111111-1111-1111-1111-111111111101',
    'member',
    '+22233334444',
    'I agree to process payment approvals fairly and honestly.',
    15000.00,
    0,
    5,
    45,
    2250.00,
    0
) ON CONFLICT (id) DO NOTHING;

-- MEMBER USER 2 - Active member in Nouadhibou
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, member_payment_phone, member_terms_conditions,
    wallet_balance_mru, free_posts_remaining, total_posts_created,
    total_approvals_made, total_earned_from_approvals_mru, total_reports_received
) VALUES (
    'u2222222-2222-2222-2222-222222222222',
    '+22255556666',
    '+22255556666',
    'Sidi',
    'Ould Mohamed',
    'c1111111-1111-1111-1111-111111111102',
    'member',
    '+22255556666',
    'I agree to process payment approvals fairly and honestly.',
    8500.00,
    0,
    3,
    28,
    1400.00,
    1
) ON CONFLICT (id) DO NOTHING;

-- MEMBER USER 3 - Member with low balance (threshold warning) in Atar
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, member_payment_phone, member_terms_conditions,
    wallet_balance_mru, free_posts_remaining, total_posts_created,
    total_approvals_made, total_earned_from_approvals_mru, total_reports_received
) VALUES (
    'u2222222-2222-2222-2222-222222222223',
    '+22277778888',
    '+22277778888',
    'Aminetou',
    'Mint Ahmed',
    'c1111111-1111-1111-1111-111111111107',
    'member',
    '+22277778888',
    'I agree to process payment approvals fairly and honestly.',
    1200.00,
    0,
    2,
    12,
    600.00,
    2
) ON CONFLICT (id) DO NOTHING;

-- EX-MEMBER USER 1 - Inactive subscription (Nouakchott)
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, total_posts_created,
    total_approvals_made, total_earned_from_approvals_mru,
    ex_member_activated_at, ex_member_last_payment_at, ex_member_next_payment_due, ex_member_is_active
) VALUES (
    'u3333333-3333-3333-3333-333333333331',
    '+22299990001',
    '+22299990001',
    'Moussa',
    'Ould Cheikh',
    'c1111111-1111-1111-1111-111111111101',
    'ex_member',
    3000.00,
    5,
    10,
    35,
    1750.00,
    NOW() - INTERVAL '60 days',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '1 day',
    false
) ON CONFLICT (id) DO NOTHING;

-- EX-MEMBER USER 2 - Active subscription (Kiffa)
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, total_posts_created,
    total_approvals_made, total_earned_from_approvals_mru,
    ex_member_activated_at, ex_member_last_payment_at, ex_member_next_payment_due, ex_member_is_active
) VALUES (
    'u3333333-3333-3333-3333-333333333332',
    '+22299990002',
    '+22299990002',
    'Khadija',
    'Mint Ely',
    'c1111111-1111-1111-1111-111111111103',
    'ex_member',
    4500.00,
    5,
    8,
    22,
    1100.00,
    NOW() - INTERVAL '45 days',
    NOW() - INTERVAL '15 days',
    NOW() + INTERVAL '15 days',
    true
) ON CONFLICT (id) DO NOTHING;

-- LEADER USER 1 - Primary leader (Nouakchott)
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, total_posts_created,
    total_approvals_made, total_earned_from_approvals_mru
) VALUES (
    'u4444444-4444-4444-4444-444444444441',
    '+22200001111',
    '+22200001111',
    'Mohamed',
    'Ould Abdallah',
    'c1111111-1111-1111-1111-111111111101',
    'leader',
    50000.00,
    0,
    15,
    120,
    6000.00
) ON CONFLICT (id) DO NOTHING;

-- LEADER USER 2 - Secondary leader (Nouadhibou)
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, total_posts_created,
    total_approvals_made, total_earned_from_approvals_mru
) VALUES (
    'u4444444-4444-4444-4444-444444444442',
    '+22200002222',
    '+22200002222',
    'Aissata',
    'Mint Sow',
    'c1111111-1111-1111-1111-111111111102',
    'leader',
    35000.00,
    0,
    10,
    85,
    4250.00
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. POSTS - Various Categories
-- ============================================

-- Property Posts
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, post_cost_mru, status, total_favorites
) VALUES (
    'po666666-6666-6666-6666-666666666601',
    'u1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111101',
    'ca222222-2222-2222-2222-222222222201',
    'Modern 3BR Apartment in Tevragh Zeina',
    'Spacious apartment with AC, parking, and 24/7 security. Close to shops and restaurants. Features include modern kitchen, balcony with city views, and reliable water/electricity.',
    150000.00,
    ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    true, true, 0.00, 'active', 18
) ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, post_cost_mru, status, total_favorites
) VALUES (
    'po666666-6666-6666-6666-666666666602',
    'u1111111-1111-1111-1111-111111111112',
    'c1111111-1111-1111-1111-111111111101',
    'ca222222-2222-2222-2222-222222222201',
    'Villa with Garden in Ksar',
    'Beautiful villa with 4 bedrooms, large garden, and modern kitchen. Perfect for families. Includes security guard, generator backup, and ample parking space.',
    350000.00,
    ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
    true, false, 10.00, 'active', 32
) ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, post_cost_mru, status, total_favorites
) VALUES (
    'po666666-6666-6666-6666-666666666603',
    'u2222222-2222-2222-2222-222222222221',
    'c1111111-1111-1111-1111-111111111102',
    'ca222222-2222-2222-2222-222222222201',
    'Beachfront Studio Apartment',
    'Cozy studio near the beach with stunning ocean views. Fully furnished with modern amenities. Ideal for singles or couples.',
    85000.00,
    ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    true, false, 10.00, 'active', 24
) ON CONFLICT (id) DO NOTHING;

-- Phone Posts
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, post_cost_mru, status, total_favorites
) VALUES (
    'po666666-6666-6666-6666-666666666604',
    'u1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111101',
    'ca222222-2222-2222-2222-222222222202',
    'iPhone 15 Pro Max 256GB',
    'Brand new iPhone 15 Pro Max, natural titanium color. Sealed box with warranty. Includes original accessories and receipt.',
    45000.00,
    ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'],
    true, true, 0.00, 'active', 45
) ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, post_cost_mru, status, total_favorites
) VALUES (
    'po666666-6666-6666-6666-666666666605',
    'u1111111-1111-1111-1111-111111111112',
    'c1111111-1111-1111-1111-111111111102',
    'ca222222-2222-2222-2222-222222222202',
    'Samsung Galaxy S24 Ultra',
    'Samsung Galaxy S24 Ultra 512GB, phantom black. Used for 2 months, excellent condition. Includes S Pen and original charger.',
    38000.00,
    ARRAY['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
    true, false, 10.00, 'active', 28
) ON CONFLICT (id) DO NOTHING;

-- Laptop Posts
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, post_cost_mru, status, total_favorites
) VALUES (
    'po666666-6666-6666-6666-666666666606',
    'u2222222-2222-2222-2222-222222222222',
    'c1111111-1111-1111-1111-111111111101',
    'ca222222-2222-2222-2222-222222222203',
    'MacBook Pro M3 14-inch',
    'MacBook Pro 14-inch with M3 chip, 16GB RAM, 512GB SSD. Space gray, like new condition. Perfect for professionals and creatives.',
    65000.00,
    ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
    true, false, 10.00, 'active', 38
) ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, post_cost_mru, status, total_favorites
) VALUES (
    'po666666-6666-6666-6666-666666666607',
    'u3333333-3333-3333-3333-333333333332',
    'c1111111-1111-1111-1111-111111111103',
    'ca222222-2222-2222-2222-222222222203',
    'Dell XPS 15 Business Laptop',
    'Dell XPS 15, Intel i7, 32GB RAM, 1TB SSD. Great for business and gaming. Includes carrying case and original charger.',
    42000.00,
    ARRAY['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800'],
    true, true, 0.00, 'active', 15
) ON CONFLICT (id) DO NOTHING;

-- Car Posts
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, post_cost_mru, status, total_favorites
) VALUES (
    'po666666-6666-6666-6666-666666666608',
    'u4444444-4444-4444-4444-444444444441',
    'c1111111-1111-1111-1111-111111111101',
    'ca222222-2222-2222-2222-222222222205',
    'Toyota Land Cruiser 2022',
    'Toyota Land Cruiser VXR 2022, white color, fully loaded. Only 25,000 km, excellent condition. Perfect for Mauritanian roads.',
    2500000.00,
    ARRAY['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800'],
    true, false, 10.00, 'active', 56
) ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, post_cost_mru, status, total_favorites
) VALUES (
    'po666666-6666-6666-6666-666666666609',
    'u2222222-2222-2222-2222-222222222221',
    'c1111111-1111-1111-1111-111111111101',
    'ca222222-2222-2222-2222-222222222205',
    'Honda Accord 2021',
    'Honda Accord Sport 2021, silver metallic. Low mileage, single owner. Full service history, very clean.',
    850000.00,
    ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'],
    true, false, 10.00, 'active', 22
) ON CONFLICT (id) DO NOTHING;

-- Electronics Posts
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, post_cost_mru, status, total_favorites
) VALUES (
    'po666666-6666-6666-6666-666666666610',
    'u1111111-1111-1111-1111-111111111113',
    'c1111111-1111-1111-1111-111111111104',
    'ca222222-2222-2222-2222-222222222204',
    'Sony 65-inch 4K Smart TV',
    'Sony Bravia 65-inch 4K HDR Smart TV. Excellent picture quality. Includes wall mount and original remote.',
    35000.00,
    ARRAY['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'],
    true, true, 0.00, 'active', 19
) ON CONFLICT (id) DO NOTHING;

-- Furniture Posts
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, post_cost_mru, status, total_favorites
) VALUES (
    'po666666-6666-6666-6666-666666666611',
    'u2222222-2222-2222-2222-222222222222',
    'c1111111-1111-1111-1111-111111111102',
    'ca222222-2222-2222-2222-222222222207',
    'Complete Living Room Set',
    'Beautiful Arabic-style living room set. Includes 2 sofas, 4 chairs, coffee table, and carpet. Perfect condition.',
    120000.00,
    ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'],
    true, false, 10.00, 'active', 14
) ON CONFLICT (id) DO NOTHING;

-- Pending payment post (unpaid - for testing)
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, post_cost_mru, status, total_favorites
) VALUES (
    'po666666-6666-6666-6666-666666666612',
    'u1111111-1111-1111-1111-111111111112',
    'c1111111-1111-1111-1111-111111111101',
    'ca222222-2222-2222-2222-222222222209',
    'Professional Camera Equipment',
    'Canon EOS R5 with multiple lenses. Perfect for photography enthusiasts.',
    75000.00,
    ARRAY['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'],
    false, false, 10.00, 'pending_payment', 0
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. WALLET TRANSACTIONS
-- ============================================

-- Approved deposit transactions
INSERT INTO wallet_transactions (
    id, user_id, city_id, type,
    amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status,
    approved_by_member_id, approved_at
) VALUES (
    'wt777777-7777-7777-7777-777777777701',
    'u1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111101',
    'deposit',
    5000.00, 0.00, 5000.00,
    'https://example.com/screenshot1.jpg', 'Bankily', 'approved',
    'u2222222-2222-2222-2222-222222222221', NOW() - INTERVAL '10 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO wallet_transactions (
    id, user_id, city_id, type,
    amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status,
    approved_by_member_id, approved_at
) VALUES (
    'wt777777-7777-7777-7777-777777777702',
    'u1111111-1111-1111-1111-111111111112',
    'c1111111-1111-1111-1111-111111111102',
    'deposit',
    3000.00, 0.00, 3000.00,
    'https://example.com/screenshot2.jpg', 'Sedad', 'approved',
    'u2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '15 days'
) ON CONFLICT (id) DO NOTHING;

-- Pending deposit (for member approval testing)
INSERT INTO wallet_transactions (
    id, user_id, city_id, type,
    amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status
) VALUES (
    'wt777777-7777-7777-7777-777777777703',
    'u1111111-1111-1111-1111-111111111113',
    'c1111111-1111-1111-1111-111111111104',
    'deposit',
    2000.00, 0.00, 2000.00,
    'https://example.com/screenshot3.jpg', 'Masrvi', 'pending'
) ON CONFLICT (id) DO NOTHING;

-- Pending deposit in Nouakchott (for member testing)
INSERT INTO wallet_transactions (
    id, user_id, city_id, type,
    amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status,
    assigned_member_id
) VALUES (
    'wt777777-7777-7777-7777-777777777704',
    'u3333333-3333-3333-3333-333333333331',
    'c1111111-1111-1111-1111-111111111101',
    'deposit',
    1500.00, 3000.00, 4500.00,
    'https://example.com/screenshot4.jpg', 'Bankily', 'pending',
    'u2222222-2222-2222-2222-222222222221'
) ON CONFLICT (id) DO NOTHING;

-- Escalated to leader transaction
INSERT INTO wallet_transactions (
    id, user_id, city_id, type,
    amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status
) VALUES (
    'wt777777-7777-7777-7777-777777777705',
    'u2222222-2222-2222-2222-222222222223',
    'c1111111-1111-1111-1111-111111111107',
    'deposit',
    5000.00, 1200.00, 6200.00,
    'https://example.com/screenshot5.jpg', 'Bankily', 'assigned_to_leader'
) ON CONFLICT (id) DO NOTHING;

-- Post payment transaction
INSERT INTO wallet_transactions (
    id, user_id, city_id, type,
    amount_mru, balance_before_mru, balance_after_mru,
    status, related_post_id
) VALUES (
    'wt777777-7777-7777-7777-777777777706',
    'u1111111-1111-1111-1111-111111111112',
    'c1111111-1111-1111-1111-111111111101',
    'post_payment',
    10.00, 2510.00, 2500.00,
    'approved', 'po666666-6666-6666-6666-666666666602'
) ON CONFLICT (id) DO NOTHING;

-- Approval reward transaction
INSERT INTO wallet_transactions (
    id, user_id, city_id, type,
    amount_mru, balance_before_mru, balance_after_mru, status
) VALUES (
    'wt777777-7777-7777-7777-777777777707',
    'u2222222-2222-2222-2222-222222222221',
    'c1111111-1111-1111-1111-111111111101',
    'approval_reward',
    50.00, 14950.00, 15000.00, 'approved'
) ON CONFLICT (id) DO NOTHING;

-- Ex-member subscription payment
INSERT INTO wallet_transactions (
    id, user_id, city_id, type,
    amount_mru, balance_before_mru, balance_after_mru, status
) VALUES (
    'wt777777-7777-7777-7777-777777777708',
    'u3333333-3333-3333-3333-333333333332',
    'c1111111-1111-1111-1111-111111111103',
    'ex_member_subscription',
    500.00, 5000.00, 4500.00, 'approved'
) ON CONFLICT (id) DO NOTHING;

-- Rejected deposit
INSERT INTO wallet_transactions (
    id, user_id, city_id, type,
    amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status,
    approved_by_member_id, rejection_reason
) VALUES (
    'wt777777-7777-7777-7777-777777777709',
    'u1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111101',
    'deposit',
    1000.00, 5000.00, 5000.00,
    'https://example.com/fake-screenshot.jpg', 'Bankily', 'rejected',
    'u2222222-2222-2222-2222-222222222221', 'Payment screenshot appears to be edited or fake.'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 9. MEMBER REPORTS
-- ============================================

-- Pending report
INSERT INTO member_reports (
    id, reporter_user_id, reported_member_id, transaction_id,
    reason, details, status
) VALUES (
    'mr888888-8888-8888-8888-888888888801',
    'u1111111-1111-1111-1111-111111111111',
    'u2222222-2222-2222-2222-222222222221',
    'wt777777-7777-7777-7777-777777777709',
    'Unfair rejection',
    'My payment was legitimate. The screenshot was real and I have the transaction confirmation from Bankily.',
    'pending'
) ON CONFLICT (id) DO NOTHING;

-- Approved report (member was penalized)
INSERT INTO member_reports (
    id, reporter_user_id, reported_member_id, transaction_id,
    reason, details, status,
    reviewed_by_leader_id, reviewed_at, leader_notes, penalty_charged
) VALUES (
    'mr888888-8888-8888-8888-888888888802',
    'u1111111-1111-1111-1111-111111111112',
    'u2222222-2222-2222-2222-222222222222',
    'wt777777-7777-7777-7777-777777777702',
    'Delayed approval',
    'Member took 3 days to approve my legitimate deposit request.',
    'approved',
    'u4444444-4444-4444-4444-444444444441', NOW() - INTERVAL '5 days',
    'Verified that member delayed approval unreasonably. 500 MRU penalty applied.', true
) ON CONFLICT (id) DO NOTHING;

-- Rejected report
INSERT INTO member_reports (
    id, reporter_user_id, reported_member_id, transaction_id,
    reason, details, status,
    reviewed_by_leader_id, reviewed_at, leader_notes, penalty_charged
) VALUES (
    'mr888888-8888-8888-8888-888888888803',
    'u3333333-3333-3333-3333-333333333331',
    'u2222222-2222-2222-2222-222222222221',
    'wt777777-7777-7777-7777-777777777701',
    'False accusation',
    'Member rejected my request unfairly.',
    'rejected',
    'u4444444-4444-4444-4444-444444444442', NOW() - INTERVAL '8 days',
    'After investigation, the member followed correct procedure. Report dismissed.', false
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 10. ROLE CHANGE LOGS
-- ============================================

INSERT INTO role_change_logs (
    id, user_id, changed_by_leader_id,
    previous_role, new_role, user_balance_at_change, reason
) VALUES (
    'rc999999-9999-9999-9999-999999999901',
    'u2222222-2222-2222-2222-222222222221',
    'u4444444-4444-4444-4444-444444444441',
    'normal', 'member', 10000.00,
    'Trusted user with good track record. Has sufficient balance.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO role_change_logs (
    id, user_id, changed_by_leader_id,
    previous_role, new_role, user_balance_at_change, reason
) VALUES (
    'rc999999-9999-9999-9999-999999999902',
    'u3333333-3333-3333-3333-333333333331',
    'u4444444-4444-4444-4444-444444444441',
    'member', 'ex_member', 3000.00,
    'Balance dropped below 1000 MRU threshold. Demoted to ex_member.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO role_change_logs (
    id, user_id, changed_by_leader_id,
    previous_role, new_role, user_balance_at_change, reason
) VALUES (
    'rc999999-9999-9999-9999-999999999903',
    'u4444444-4444-4444-4444-444444444442',
    'u4444444-4444-4444-4444-444444444441',
    'normal', 'leader', 35000.00,
    'Promoted to leader to help manage Nouadhibou region.'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 11. SUBSCRIPTION HISTORY
-- ============================================

INSERT INTO subscription_history (
    id, user_id, action,
    amount_charged_mru, balance_before_mru, balance_after_mru, next_payment_due
) VALUES (
    'sh000000-aaaa-aaaa-aaaa-aaaaaaaaa001',
    'u3333333-3333-3333-3333-333333333332',
    'activated',
    500.00, 5000.00, 4500.00, NOW() + INTERVAL '30 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO subscription_history (
    id, user_id, action,
    amount_charged_mru, balance_before_mru, balance_after_mru, next_payment_due
) VALUES (
    'sh000000-aaaa-aaaa-aaaa-aaaaaaaaa002',
    'u3333333-3333-3333-3333-333333333331',
    'renewed',
    500.00, 3500.00, 3000.00, NOW() + INTERVAL '30 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO subscription_history (
    id, user_id, action,
    amount_charged_mru, balance_before_mru, balance_after_mru, next_payment_due
) VALUES (
    'sh000000-aaaa-aaaa-aaaa-aaaaaaaaa003',
    'u3333333-3333-3333-3333-333333333331',
    'expired',
    0.00, 3000.00, 3000.00, NULL
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 12. NOTIFICATIONS
-- ============================================

INSERT INTO notifications (id, user_id, type, title, message, data, read) VALUES
('no000000-bbbb-bbbb-bbbb-bbbbbbbbb001', 'u1111111-1111-1111-1111-111111111111', 'payment_approved', 'Deposit Approved', 'Your deposit of 5000 MRU has been approved and added to your wallet.', '{"transaction_id": "wt777777-7777-7777-7777-777777777701", "amount": 5000}', true),
('no000000-bbbb-bbbb-bbbb-bbbbbbbbb002', 'u1111111-1111-1111-1111-111111111111', 'payment_rejected', 'Deposit Rejected', 'Your deposit request of 1000 MRU was rejected. Reason: Payment screenshot appears to be edited or fake.', '{"transaction_id": "wt777777-7777-7777-7777-777777777709", "amount": 1000}', true),
('no000000-bbbb-bbbb-bbbb-bbbbbbbbb003', 'u2222222-2222-2222-2222-222222222221', 'approval_reward', 'Reward Earned', 'You earned 50 MRU for approving a deposit request.', '{"amount": 50}', false),
('no000000-bbbb-bbbb-bbbb-bbbbbbbbb004', 'u2222222-2222-2222-2222-222222222221', 'role_promoted', 'Promoted to Member', 'Congratulations! You have been promoted to Member. You can now approve deposit requests in your city.', '{"new_role": "member"}', true),
('no000000-bbbb-bbbb-bbbb-bbbbbbbbb005', 'u3333333-3333-3333-3333-333333333331', 'role_demoted', 'Role Changed to Ex-Member', 'Your role has been changed to Ex-Member. You can still use the app but cannot approve requests.', '{"previous_role": "member", "new_role": "ex_member"}', true),
('no000000-bbbb-bbbb-bbbb-bbbbbbbbb006', 'u3333333-3333-3333-3333-333333333332', 'subscription_renewed', 'Subscription Renewed', 'Your ex-member subscription has been renewed for another 30 days. 500 MRU was deducted.', '{"amount": 500}', false),
('no000000-bbbb-bbbb-bbbb-bbbbbbbbb007', 'u2222222-2222-2222-2222-222222222223', 'member_threshold_warning', 'Low Balance Warning', 'Your balance is approaching the 1000 MRU threshold. Please add funds to maintain your member status.', '{"current_balance": 1200, "threshold": 1000}', false),
('no000000-bbbb-bbbb-bbbb-bbbbbbbbb008', 'u1111111-1111-1111-1111-111111111111', 'post_created', 'Post Published', 'Your post "iPhone 15 Pro Max 256GB" has been published successfully.', '{"post_id": "po666666-6666-6666-6666-666666666604"}', true),
('no000000-bbbb-bbbb-bbbb-bbbbbbbbb009', 'u2222222-2222-2222-2222-222222222221', 'report_filed', 'Report Filed Against You', 'A user has filed a report regarding a rejected deposit. A leader will review this.', '{"report_id": "mr888888-8888-8888-8888-888888888801"}', false),
('no000000-bbbb-bbbb-bbbb-bbbbbbbbb010', 'u1111111-1111-1111-1111-111111111112', 'report_resolved', 'Report Resolved', 'Your report has been reviewed and resolved. The member has been penalized.', '{"report_id": "mr888888-8888-8888-8888-888888888802", "outcome": "approved"}', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 13. SAVED POSTS (Favorites)
-- ============================================

INSERT INTO saved_posts (user_id, post_id) VALUES
('u1111111-1111-1111-1111-111111111111', 'po666666-6666-6666-6666-666666666602'),
('u1111111-1111-1111-1111-111111111111', 'po666666-6666-6666-6666-666666666606'),
('u1111111-1111-1111-1111-111111111111', 'po666666-6666-6666-6666-666666666608'),
('u1111111-1111-1111-1111-111111111112', 'po666666-6666-6666-6666-666666666601'),
('u1111111-1111-1111-1111-111111111112', 'po666666-6666-6666-6666-666666666604'),
('u2222222-2222-2222-2222-222222222221', 'po666666-6666-6666-6666-666666666607'),
('u2222222-2222-2222-2222-222222222222', 'po666666-6666-6666-6666-666666666608'),
('u3333333-3333-3333-3333-333333333331', 'po666666-6666-6666-6666-666666666609'),
('u3333333-3333-3333-3333-333333333332', 'po666666-6666-6666-6666-666666666610')
ON CONFLICT DO NOTHING;

-- ============================================
-- 14. REVIEWS
-- ============================================

INSERT INTO reviews (id, post_id, user_id, rating, comment) VALUES
('rv000000-cccc-cccc-cccc-ccccccccc001', 'po666666-6666-6666-6666-666666666601', 'u1111111-1111-1111-1111-111111111112', 5, 'Excellent apartment! Very clean and well maintained.'),
('rv000000-cccc-cccc-cccc-ccccccccc002', 'po666666-6666-6666-6666-666666666602', 'u2222222-2222-2222-2222-222222222221', 4, 'Great villa with beautiful garden. Highly recommended.'),
('rv000000-cccc-cccc-cccc-ccccccccc003', 'po666666-6666-6666-6666-666666666604', 'u1111111-1111-1111-1111-111111111113', 5, 'Brand new phone as described. Fast delivery.'),
('rv000000-cccc-cccc-cccc-ccccccccc004', 'po666666-6666-6666-6666-666666666606', 'u4444444-4444-4444-4444-444444444441', 5, 'MacBook is in perfect condition. Great seller!'),
('rv000000-cccc-cccc-cccc-ccccccccc005', 'po666666-6666-6666-6666-666666666608', 'u2222222-2222-2222-2222-222222222222', 5, 'Amazing Land Cruiser! Worth every MRU.')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 15. POST AMENITIES (for property posts)
-- ============================================

INSERT INTO post_amenities (post_id, amenity_id) VALUES
-- Apartment post amenities
('po666666-6666-6666-6666-666666666601', 'am555555-5555-5555-5555-555555555501'),
('po666666-6666-6666-6666-666666666601', 'am555555-5555-5555-5555-555555555502'),
('po666666-6666-6666-6666-666666666601', 'am555555-5555-5555-5555-555555555503'),
('po666666-6666-6666-6666-666666666601', 'am555555-5555-5555-5555-555555555506'),
('po666666-6666-6666-6666-666666666601', 'am555555-5555-5555-5555-555555555508'),
-- Villa post amenities
('po666666-6666-6666-6666-666666666602', 'am555555-5555-5555-5555-555555555501'),
('po666666-6666-6666-6666-666666666602', 'am555555-5555-5555-5555-555555555502'),
('po666666-6666-6666-6666-666666666602', 'am555555-5555-5555-5555-555555555503'),
('po666666-6666-6666-6666-666666666602', 'am555555-5555-5555-5555-555555555504'),
('po666666-6666-6666-6666-666666666602', 'am555555-5555-5555-5555-555555555505'),
('po666666-6666-6666-6666-666666666602', 'am555555-5555-5555-5555-555555555507'),
('po666666-6666-6666-6666-666666666602', 'am555555-5555-5555-5555-555555555508'),
('po666666-6666-6666-6666-666666666602', 'am555555-5555-5555-5555-555555555510'),
('po666666-6666-6666-6666-666666666602', 'am555555-5555-5555-5555-555555555511'),
-- Beach studio amenities
('po666666-6666-6666-6666-666666666603', 'am555555-5555-5555-5555-555555555501'),
('po666666-6666-6666-6666-666666666603', 'am555555-5555-5555-5555-555555555502'),
('po666666-6666-6666-6666-666666666603', 'am555555-5555-5555-5555-555555555505'),
('po666666-6666-6666-6666-666666666603', 'am555555-5555-5555-5555-555555555527')
ON CONFLICT DO NOTHING;

-- ============================================
-- GUEST USER CONSTANTS - USE THESE IN YOUR APP
-- ============================================
-- Guest User ID: u0000000-0000-0000-0000-000000000001
-- Guest Phone: +22200000001
-- 
-- When "Continue as Guest" is pressed:
-- 1. Load this user from database
-- 2. Create a session for this user
-- 3. Guest users have limited features (can browse, cannot post)
-- ============================================

-- ============================================
-- USER ROLE SUMMARY
-- ============================================
-- Guest:      u0000000-0000-0000-0000-000000000001 (role: normal, 0 balance, 0 free posts)
-- Normal 1:   u1111111-1111-1111-1111-111111111111 (5000 MRU, 3 free posts, Nouakchott)
-- Normal 2:   u1111111-1111-1111-1111-111111111112 (2500 MRU, 0 free posts, Nouadhibou)
-- Normal 3:   u1111111-1111-1111-1111-111111111113 (0 MRU, 5 free posts, Kaédi)
-- Member 1:   u2222222-2222-2222-2222-222222222221 (Nouakchott, 15000 MRU)
-- Member 2:   u2222222-2222-2222-2222-222222222222 (Nouadhibou, 8500 MRU)
-- Member 3:   u2222222-2222-2222-2222-222222222223 (Atar, 1200 MRU - low balance warning)
-- Ex-Member 1: u3333333-3333-3333-3333-333333333331 (inactive subscription, Nouakchott)
-- Ex-Member 2: u3333333-3333-3333-3333-333333333332 (active subscription, Kiffa)
-- Leader 1:   u4444444-4444-4444-4444-444444444441 (Primary, Nouakchott)
-- Leader 2:   u4444444-4444-4444-4444-444444444442 (Secondary, Nouadhibou)
-- ============================================
