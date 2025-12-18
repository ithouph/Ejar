-- ============================================
-- EJAR MARKETPLACE - SEED DATA
-- Run this AFTER DATABASE_SETUP.sql
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- IMPORTANT: Get existing IDs from SETUP tables
-- The SETUP.sql already creates cities, categories, listing_types, etc.
-- We need to use those existing IDs for our seed data
-- ============================================

-- ============================================
-- 1. USERS - ALL ROLES
-- Using the first city from the cities table for all users
-- ============================================

-- GUEST USER (Default user for "Continue as Guest")
-- Uses auto-generated UUID instead of hardcoded ID
-- The guest user is identified by phone number '+22200000000'
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, profile_photo_url
) 
SELECT 
    uuid_generate_v4(),
    '+22200000000',
    '+22200000000',
    'Guest',
    'User',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'normal',
    0.00,
    0,
    NULL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE phone = '+22200000000');

-- NORMAL USER 1 - Active user with balance (Nouakchott)
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, free_posts_used, total_posts_created
) 
SELECT 
    'u1111111-1111-1111-1111-111111111111',
    '+22212345678',
    '+22212345678',
    'Ahmed',
    'Mohamed',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'normal',
    5000.00,
    3,
    2,
    5
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 'u1111111-1111-1111-1111-111111111111');

-- NORMAL USER 2 - User in Nouadhibou
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, free_posts_used, total_posts_created
) 
SELECT
    'u1111111-1111-1111-1111-111111111112',
    '+22287654321',
    '+22287654321',
    'Fatima',
    'Mint Ahmed',
    (SELECT id FROM cities WHERE name = 'Nouadhibou' LIMIT 1),
    'normal',
    2500.00,
    5,
    0,
    2
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 'u1111111-1111-1111-1111-111111111112');

-- NORMAL USER 3 - New user with no balance (Kaédi)
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, free_posts_used, total_posts_created
) 
SELECT
    'u1111111-1111-1111-1111-111111111113',
    '+22211223344',
    '+22211223344',
    'Oumar',
    'Ba',
    (SELECT id FROM cities WHERE name = 'Kaédi' LIMIT 1),
    'normal',
    0.00,
    5,
    0,
    0
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 'u1111111-1111-1111-1111-111111111113');

-- MEMBER 1 - Active member in Nouakchott
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining,
    member_payment_phone, total_approvals_made, total_earned_from_approvals_mru
) 
SELECT
    'u2222222-2222-2222-2222-222222222221',
    '+22233334444',
    '+22233334444',
    'Sidi',
    'Ould Cheikh',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'member',
    15000.00,
    5,
    '+22233334444',
    45,
    125000.00
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 'u2222222-2222-2222-2222-222222222221');

-- MEMBER 2 - Active member in Nouadhibou
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining,
    member_payment_phone, total_approvals_made, total_earned_from_approvals_mru
) 
SELECT
    'u2222222-2222-2222-2222-222222222222',
    '+22255556666',
    '+22255556666',
    'Mariam',
    'Mint Sidi',
    (SELECT id FROM cities WHERE name = 'Nouadhibou' LIMIT 1),
    'member',
    8500.00,
    4,
    '+22255556666',
    22,
    55000.00
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 'u2222222-2222-2222-2222-222222222222');

-- MEMBER 3 - New member in Atar
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining,
    member_payment_phone, total_approvals_made, total_earned_from_approvals_mru
) 
SELECT
    'u2222222-2222-2222-2222-222222222223',
    '+22277778888',
    '+22277778888',
    'Abdallah',
    'Ould Mohamed',
    (SELECT id FROM cities WHERE name = 'Atar' LIMIT 1),
    'member',
    1200.00,
    5,
    '+22277778888',
    3,
    7500.00
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 'u2222222-2222-2222-2222-222222222223');

-- EX-MEMBER 1 - Demoted member in Nouakchott (subscription expired)
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining,
    ex_member_is_active, ex_member_activated_at, ex_member_next_payment_due
) 
SELECT
    'u3333333-3333-3333-3333-333333333331',
    '+22299990001',
    '+22299990001',
    'Mohamed',
    'Lemine',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'ex_member',
    3000.00,
    2,
    true,
    NOW() - INTERVAL '45 days',
    NOW() + INTERVAL '15 days'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 'u3333333-3333-3333-3333-333333333331');

-- EX-MEMBER 2 - Demoted member in Kiffa
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining,
    ex_member_is_active, ex_member_activated_at, ex_member_next_payment_due
) 
SELECT
    'u3333333-3333-3333-3333-333333333332',
    '+22299990002',
    '+22299990002',
    'Aissata',
    'Diallo',
    (SELECT id FROM cities WHERE name = 'Kiffa' LIMIT 1),
    'ex_member',
    4500.00,
    5,
    false,
    NOW() - INTERVAL '60 days',
    NOW() - INTERVAL '15 days'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 'u3333333-3333-3333-3333-333333333332');

-- LEADER 1 - Primary leader in Nouakchott
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining
) 
SELECT
    'u4444444-4444-4444-4444-444444444441',
    '+22200001111',
    '+22200001111',
    'Cheikh',
    'Ould Abdallah',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'leader',
    50000.00,
    99
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 'u4444444-4444-4444-4444-444444444441');

-- LEADER 2 - Second leader in Nouadhibou
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining
) 
SELECT
    'u4444444-4444-4444-4444-444444444442',
    '+22200002222',
    '+22200002222',
    'Aminata',
    'Sow',
    (SELECT id FROM cities WHERE name = 'Nouadhibou' LIMIT 1),
    'leader',
    35000.00,
    99
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 'u4444444-4444-4444-4444-444444444442');

-- ============================================
-- 2. POSTS - Sample listings across categories
-- Using existing category IDs from SETUP
-- ============================================

-- Property Post 1 - Apartment for rent in Nouakchott (PAID, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    'po666666-6666-6666-6666-666666666601',
    'POST-2024-0001',
    'u1111111-1111-1111-1111-111111111111',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    (SELECT id FROM service_categories WHERE name = 'Property' LIMIT 1),
    'Modern 3BR Apartment in Tevragh Zeina',
    'Beautiful fully furnished 3-bedroom apartment with AC, parking, and 24/7 security. Close to embassies and shopping centers.',
    85000.00,
    ARRAY['https://picsum.photos/400/300?random=1', 'https://picsum.photos/400/300?random=2'],
    true,
    false,
    'active',
    NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = 'po666666-6666-6666-6666-666666666601');

-- Property Post 2 - Villa for sale in Nouakchott (FREE POST, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    'po666666-6666-6666-6666-666666666602',
    'POST-2024-0002',
    'u1111111-1111-1111-1111-111111111111',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    (SELECT id FROM service_categories WHERE name = 'Property' LIMIT 1),
    'Spacious Villa with Garden in Ksar',
    'Luxury 5-bedroom villa with swimming pool, large garden, and generator. Perfect for families.',
    250000000.00,
    ARRAY['https://picsum.photos/400/300?random=3', 'https://picsum.photos/400/300?random=4'],
    true,
    true,
    'active',
    NOW() - INTERVAL '10 days'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = 'po666666-6666-6666-6666-666666666602');

-- Phone Post - iPhone for sale (PAID, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    'po666666-6666-6666-6666-666666666603',
    'POST-2024-0003',
    'u1111111-1111-1111-1111-111111111112',
    (SELECT id FROM cities WHERE name = 'Nouadhibou' LIMIT 1),
    (SELECT id FROM service_categories WHERE name = 'Phones' LIMIT 1),
    'iPhone 14 Pro Max 256GB - Like New',
    'Barely used iPhone 14 Pro Max in perfect condition. Comes with original box and charger.',
    450000.00,
    ARRAY['https://picsum.photos/400/300?random=5'],
    true,
    false,
    'active',
    NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = 'po666666-6666-6666-6666-666666666603');

-- Laptop Post - MacBook for sale (PAID, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    'po666666-6666-6666-6666-666666666604',
    'POST-2024-0004',
    'u2222222-2222-2222-2222-222222222221',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    (SELECT id FROM service_categories WHERE name = 'Laptops' LIMIT 1),
    'MacBook Pro M2 14-inch',
    'Professional laptop with M2 chip, 16GB RAM, 512GB SSD. Perfect for developers and designers.',
    720000.00,
    ARRAY['https://picsum.photos/400/300?random=6', 'https://picsum.photos/400/300?random=7'],
    true,
    false,
    'active',
    NOW() - INTERVAL '7 days'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = 'po666666-6666-6666-6666-666666666604');

-- Car Post - Toyota for sale (PAID, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    'po666666-6666-6666-6666-666666666605',
    'POST-2024-0005',
    'u2222222-2222-2222-2222-222222222222',
    (SELECT id FROM cities WHERE name = 'Nouadhibou' LIMIT 1),
    (SELECT id FROM service_categories WHERE name = 'Cars' LIMIT 1),
    'Toyota Land Cruiser 2020 - Excellent Condition',
    'Well-maintained Land Cruiser with full service history. Low mileage, AC working perfectly.',
    8500000.00,
    ARRAY['https://picsum.photos/400/300?random=8', 'https://picsum.photos/400/300?random=9', 'https://picsum.photos/400/300?random=10'],
    true,
    false,
    'active',
    NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = 'po666666-6666-6666-6666-666666666605');

-- Electronics Post - TV for sale (UNPAID, PENDING_PAYMENT)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    'po666666-6666-6666-6666-666666666606',
    'POST-2024-0006',
    'u1111111-1111-1111-1111-111111111113',
    (SELECT id FROM cities WHERE name = 'Kaédi' LIMIT 1),
    (SELECT id FROM service_categories WHERE name = 'Electronics' LIMIT 1),
    'Samsung 55-inch Smart TV',
    '4K UHD Smart TV with HDR. Excellent picture quality. Remote included.',
    180000.00,
    ARRAY['https://picsum.photos/400/300?random=11'],
    false,
    false,
    'pending_payment',
    NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = 'po666666-6666-6666-6666-666666666606');

-- Furniture Post (FREE POST, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    'po666666-6666-6666-6666-666666666607',
    'POST-2024-0007',
    'u3333333-3333-3333-3333-333333333331',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    (SELECT id FROM service_categories WHERE name = 'Furniture' LIMIT 1),
    'Complete Living Room Set',
    'Sofa set with coffee table and side tables. Excellent condition, barely used.',
    120000.00,
    ARRAY['https://picsum.photos/400/300?random=12', 'https://picsum.photos/400/300?random=13'],
    true,
    true,
    'active',
    NOW() - INTERVAL '8 days'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = 'po666666-6666-6666-6666-666666666607');

-- Property in Atar (PAID, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    'po666666-6666-6666-6666-666666666608',
    'POST-2024-0008',
    'u2222222-2222-2222-2222-222222222223',
    (SELECT id FROM cities WHERE name = 'Atar' LIMIT 1),
    (SELECT id FROM service_categories WHERE name = 'Property' LIMIT 1),
    'Traditional House in Atar Old Town',
    'Authentic stone house near the old market. 4 rooms with traditional architecture.',
    35000000.00,
    ARRAY['https://picsum.photos/400/300?random=14'],
    true,
    false,
    'active',
    NOW() - INTERVAL '12 days'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = 'po666666-6666-6666-6666-666666666608');

-- Others Post (FREE POST, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    'po666666-6666-6666-6666-666666666609',
    'POST-2024-0009',
    'u1111111-1111-1111-1111-111111111111',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    (SELECT id FROM service_categories WHERE name = 'Others' LIMIT 1),
    'Professional House Cleaning Service',
    'Experienced cleaning team. We clean apartments, villas, and offices. Daily or weekly service available.',
    5000.00,
    ARRAY['https://picsum.photos/400/300?random=15'],
    true,
    true,
    'active',
    NOW() - INTERVAL '6 days'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = 'po666666-6666-6666-6666-666666666609');

-- Post from ex-member (ENDED)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    'po666666-6666-6666-6666-666666666610',
    'POST-2024-0010',
    'u3333333-3333-3333-3333-333333333332',
    (SELECT id FROM cities WHERE name = 'Kiffa' LIMIT 1),
    (SELECT id FROM service_categories WHERE name = 'Electronics' LIMIT 1),
    'Air Conditioner 2.5HP',
    'Powerful AC unit, cools large rooms quickly. 1 year old.',
    95000.00,
    ARRAY['https://picsum.photos/400/300?random=16'],
    true,
    false,
    'ended',
    NOW() - INTERVAL '45 days'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = 'po666666-6666-6666-6666-666666666610');

-- Leader test post (PAID, ACTIVE)
INSERT INTO posts (
    id, display_id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    'po666666-6666-6666-6666-666666666611',
    'POST-2024-0011',
    'u4444444-4444-4444-4444-444444444441',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    (SELECT id FROM service_categories WHERE name = 'Others' LIMIT 1),
    'Test Post - Platform Demo',
    'This is a test post to demonstrate the platform features.',
    1000.00,
    ARRAY['https://picsum.photos/400/300?random=17'],
    true,
    false,
    'active',
    NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = 'po666666-6666-6666-6666-666666666611');

-- ============================================
-- 3. WALLET TRANSACTIONS
-- Using correct column names from schema
-- ============================================

-- Pending deposit from Normal User 3 (awaiting approval)
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status, created_at
)
SELECT
    'wt777777-7777-7777-7777-777777777701',
    'u1111111-1111-1111-1111-111111111113',
    (SELECT id FROM cities WHERE name = 'Kaédi' LIMIT 1),
    'deposit',
    2000.00,
    0.00,
    2000.00,
    'https://picsum.photos/400/600?random=20',
    'Bankily',
    'pending',
    NOW() - INTERVAL '2 hours'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = 'wt777777-7777-7777-7777-777777777701');

-- Approved deposit for Normal User 1 (member approved)
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status,
    approved_by_member_id, approved_at, created_at
)
SELECT
    'wt777777-7777-7777-7777-777777777702',
    'u1111111-1111-1111-1111-111111111111',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
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
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = 'wt777777-7777-7777-7777-777777777702');

-- Post payment transaction
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    related_post_id, status, created_at
)
SELECT
    'wt777777-7777-7777-7777-777777777703',
    'u1111111-1111-1111-1111-111111111111',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'post_payment',
    10.00,
    5000.00,
    4990.00,
    'po666666-6666-6666-6666-666666666601',
    'approved',
    NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = 'wt777777-7777-7777-7777-777777777703');

-- Member approval reward
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    status, notes, created_at
)
SELECT
    'wt777777-7777-7777-7777-777777777704',
    'u2222222-2222-2222-2222-222222222221',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'approval_reward',
    25.00,
    14975.00,
    15000.00,
    'approved',
    'Reward for approving deposit wt777777-7777-7777-7777-777777777702',
    NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = 'wt777777-7777-7777-7777-777777777704');

-- Rejected deposit (user provided fake screenshot)
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status,
    approved_by_member_id, rejection_reason, rejected_at, created_at
)
SELECT
    'wt777777-7777-7777-7777-777777777705',
    'u1111111-1111-1111-1111-111111111112',
    (SELECT id FROM cities WHERE name = 'Nouadhibou' LIMIT 1),
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
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = 'wt777777-7777-7777-7777-777777777705');

-- Pending deposit in Nouadhibou
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status, created_at
)
SELECT
    'wt777777-7777-7777-7777-777777777706',
    'u1111111-1111-1111-1111-111111111112',
    (SELECT id FROM cities WHERE name = 'Nouadhibou' LIMIT 1),
    'deposit',
    3000.00,
    2500.00,
    5500.00,
    'https://picsum.photos/400/600?random=23',
    'Bankily',
    'pending',
    NOW() - INTERVAL '4 hours'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = 'wt777777-7777-7777-7777-777777777706');

-- Ex-member subscription charge
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    status, notes, created_at
)
SELECT
    'wt777777-7777-7777-7777-777777777707',
    'u3333333-3333-3333-3333-333333333331',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'ex_member_subscription',
    500.00,
    3500.00,
    3000.00,
    'approved',
    'Monthly ex-member subscription fee',
    NOW() - INTERVAL '15 days'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = 'wt777777-7777-7777-7777-777777777707');

-- Large pending deposit (escalated to leader)
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status, is_escalated, created_at
)
SELECT
    'wt777777-7777-7777-7777-777777777708',
    'u2222222-2222-2222-2222-222222222222',
    (SELECT id FROM cities WHERE name = 'Nouadhibou' LIMIT 1),
    'deposit',
    50000.00,
    8500.00,
    58500.00,
    'https://picsum.photos/400/600?random=24',
    'Bankily',
    'pending',
    true,
    NOW() - INTERVAL '6 hours'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = 'wt777777-7777-7777-7777-777777777708');

-- Refund transaction
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    status, notes, approved_by_leader_id, approved_at, created_at
)
SELECT
    'wt777777-7777-7777-7777-777777777709',
    'u1111111-1111-1111-1111-111111111111',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'refund',
    10.00,
    4990.00,
    5000.00,
    'approved',
    'Refund for duplicate post payment',
    'u4444444-4444-4444-4444-444444444441',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = 'wt777777-7777-7777-7777-777777777709');

-- ============================================
-- 4. MEMBER REPORTS (Unfair rejection complaints)
-- ============================================

-- Pending report against Member 2
INSERT INTO member_reports (
    id, reporter_user_id, reported_member_id, transaction_id,
    reason, details, status, created_at
)
SELECT
    'mr888888-8888-8888-8888-888888888801',
    'u1111111-1111-1111-1111-111111111112',
    'u2222222-2222-2222-2222-222222222222',
    'wt777777-7777-7777-7777-777777777705',
    'Unfair rejection - payment was valid',
    'I made a legitimate payment of 10,000 MRU via Masrvi. The screenshot is real and shows the transaction reference. The member rejected without proper verification.',
    'pending',
    NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM member_reports WHERE id = 'mr888888-8888-8888-8888-888888888801');

-- Approved report (member was penalized)
INSERT INTO member_reports (
    id, reporter_user_id, reported_member_id, transaction_id,
    reason, details, status,
    reviewed_by_user_id, reviewed_at, review_notes, penalty_applied
)
SELECT
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
WHERE NOT EXISTS (SELECT 1 FROM member_reports WHERE id = 'mr888888-8888-8888-8888-888888888802');

-- Rejected report (user complaint was invalid)
INSERT INTO member_reports (
    id, reporter_user_id, reported_member_id, transaction_id,
    reason, details, status,
    reviewed_by_user_id, reviewed_at, review_notes, penalty_applied
)
SELECT
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
WHERE NOT EXISTS (SELECT 1 FROM member_reports WHERE id = 'mr888888-8888-8888-8888-888888888803');

-- ============================================
-- 5. NOTIFICATIONS
-- ============================================

INSERT INTO notifications (id, user_id, type, title, message, data, is_read, created_at)
SELECT 'nt999999-9999-9999-9999-999999999901', 'u1111111-1111-1111-1111-111111111111', 'deposit_approved', 'Deposit Approved', 'Your deposit of 5,000 MRU has been approved!', '{"transaction_id": "wt777777-7777-7777-7777-777777777702"}', true, NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = 'nt999999-9999-9999-9999-999999999901');

INSERT INTO notifications (id, user_id, type, title, message, data, is_read, created_at)
SELECT 'nt999999-9999-9999-9999-999999999902', 'u1111111-1111-1111-1111-111111111112', 'deposit_rejected', 'Deposit Rejected', 'Your deposit of 10,000 MRU was rejected.', '{"transaction_id": "wt777777-7777-7777-7777-777777777705"}', false, NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = 'nt999999-9999-9999-9999-999999999902');

INSERT INTO notifications (id, user_id, type, title, message, data, is_read, created_at)
SELECT 'nt999999-9999-9999-9999-999999999903', 'u2222222-2222-2222-2222-222222222221', 'new_deposit_request', 'New Deposit Request', 'A user in your city submitted a deposit request.', '{"transaction_id": "wt777777-7777-7777-7777-777777777701"}', false, NOW() - INTERVAL '2 hours'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = 'nt999999-9999-9999-9999-999999999903');

INSERT INTO notifications (id, user_id, type, title, message, data, is_read, created_at)
SELECT 'nt999999-9999-9999-9999-999999999904', 'u2222222-2222-2222-2222-222222222222', 'report_filed', 'Report Filed Against You', 'A user has filed a report against your rejection decision.', '{"report_id": "mr888888-8888-8888-8888-888888888801"}', false, NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = 'nt999999-9999-9999-9999-999999999904');

INSERT INTO notifications (id, user_id, type, title, message, data, is_read, created_at)
SELECT 'nt999999-9999-9999-9999-999999999905', 'u4444444-4444-4444-4444-444444444441', 'escalated_deposit', 'Escalated Deposit', 'A large deposit (50,000 MRU) requires your review.', '{"transaction_id": "wt777777-7777-7777-7777-777777777708"}', false, NOW() - INTERVAL '6 hours'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = 'nt999999-9999-9999-9999-999999999905');

INSERT INTO notifications (id, user_id, type, title, message, data, is_read, created_at)
SELECT 'nt999999-9999-9999-9999-999999999906', 'u3333333-3333-3333-3333-333333333331', 'subscription_reminder', 'Subscription Expiring', 'Your ex-member subscription will expire in 5 days.', '{}', false, NOW() - INTERVAL '10 days'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = 'nt999999-9999-9999-9999-999999999906');

INSERT INTO notifications (id, user_id, type, title, message, data, is_read, created_at)
SELECT 'nt999999-9999-9999-9999-999999999907', 'u1111111-1111-1111-1111-111111111111', 'post_expired', 'Post Expired', 'Your post has expired. Renew it to keep it visible.', '{"post_id": "po666666-6666-6666-6666-666666666601"}', false, NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = 'nt999999-9999-9999-9999-999999999907');

INSERT INTO notifications (id, user_id, type, title, message, data, is_read, created_at)
SELECT 'nt999999-9999-9999-9999-999999999908', 'u2222222-2222-2222-2222-222222222221', 'approval_reward', 'Reward Earned!', 'You earned 25 MRU for approving a deposit.', '{"transaction_id": "wt777777-7777-7777-7777-777777777704"}', true, NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = 'nt999999-9999-9999-9999-999999999908');

INSERT INTO notifications (id, user_id, type, title, message, data, is_read, created_at)
SELECT 'nt999999-9999-9999-9999-999999999909', 'u1111111-1111-1111-1111-111111111113', 'welcome', 'Welcome to Ejar!', 'Start by posting your first listing. You have 5 free posts!', '{}', false, NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = 'nt999999-9999-9999-9999-999999999909');

INSERT INTO notifications (id, user_id, type, title, message, data, is_read, created_at)
SELECT 'nt999999-9999-9999-9999-999999999910', 'u4444444-4444-4444-4444-444444444441', 'pending_report', 'Pending Report', 'A new unfair rejection report requires your attention.', '{"report_id": "mr888888-8888-8888-8888-888888888801"}', false, NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = 'nt999999-9999-9999-9999-999999999910');

-- ============================================
-- 6. SAVED POSTS (Favorites)
-- ============================================

INSERT INTO saved_posts (id, user_id, post_id, created_at)
SELECT 'sp101010-1010-1010-1010-101010101001', 'u1111111-1111-1111-1111-111111111111', 'po666666-6666-6666-6666-666666666603', NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE id = 'sp101010-1010-1010-1010-101010101001');

INSERT INTO saved_posts (id, user_id, post_id, created_at)
SELECT 'sp101010-1010-1010-1010-101010101002', 'u1111111-1111-1111-1111-111111111111', 'po666666-6666-6666-6666-666666666605', NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE id = 'sp101010-1010-1010-1010-101010101002');

INSERT INTO saved_posts (id, user_id, post_id, created_at)
SELECT 'sp101010-1010-1010-1010-101010101003', 'u1111111-1111-1111-1111-111111111112', 'po666666-6666-6666-6666-666666666601', NOW() - INTERVAL '4 days'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE id = 'sp101010-1010-1010-1010-101010101003');

INSERT INTO saved_posts (id, user_id, post_id, created_at)
SELECT 'sp101010-1010-1010-1010-101010101004', 'u1111111-1111-1111-1111-111111111112', 'po666666-6666-6666-6666-666666666604', NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE id = 'sp101010-1010-1010-1010-101010101004');

INSERT INTO saved_posts (id, user_id, post_id, created_at)
SELECT 'sp101010-1010-1010-1010-101010101005', 'u2222222-2222-2222-2222-222222222221', 'po666666-6666-6666-6666-666666666608', NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE id = 'sp101010-1010-1010-1010-101010101005');

INSERT INTO saved_posts (id, user_id, post_id, created_at)
SELECT 'sp101010-1010-1010-1010-101010101006', 'u2222222-2222-2222-2222-222222222222', 'po666666-6666-6666-6666-666666666602', NOW() - INTERVAL '6 days'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE id = 'sp101010-1010-1010-1010-101010101006');

INSERT INTO saved_posts (id, user_id, post_id, created_at)
SELECT 'sp101010-1010-1010-1010-101010101007', 'u3333333-3333-3333-3333-333333333331', 'po666666-6666-6666-6666-666666666609', NOW() - INTERVAL '7 days'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE id = 'sp101010-1010-1010-1010-101010101007');

INSERT INTO saved_posts (id, user_id, post_id, created_at)
SELECT 'sp101010-1010-1010-1010-101010101008', 'u4444444-4444-4444-4444-444444444441', 'po666666-6666-6666-6666-666666666605', NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE id = 'sp101010-1010-1010-1010-101010101008');

-- ============================================
-- 7. REVIEWS
-- ============================================

INSERT INTO reviews (id, post_id, user_id, rating, comment, created_at)
SELECT 'rv121212-1212-1212-1212-121212121201', 'po666666-6666-6666-6666-666666666601', 'u1111111-1111-1111-1111-111111111112', 5, 'Excellent apartment! Very clean and the owner was very helpful.', NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE id = 'rv121212-1212-1212-1212-121212121201');

INSERT INTO reviews (id, post_id, user_id, rating, comment, created_at)
SELECT 'rv121212-1212-1212-1212-121212121202', 'po666666-6666-6666-6666-666666666601', 'u2222222-2222-2222-2222-222222222222', 4, 'Good location, nice furniture. AC was a bit noisy but overall great.', NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE id = 'rv121212-1212-1212-1212-121212121202');

INSERT INTO reviews (id, post_id, user_id, rating, comment, created_at)
SELECT 'rv121212-1212-1212-1212-121212121203', 'po666666-6666-6666-6666-666666666603', 'u1111111-1111-1111-1111-111111111111', 5, 'Phone was exactly as described. Fast transaction!', NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE id = 'rv121212-1212-1212-1212-121212121203');

INSERT INTO reviews (id, post_id, user_id, rating, comment, created_at)
SELECT 'rv121212-1212-1212-1212-121212121204', 'po666666-6666-6666-6666-666666666605', 'u2222222-2222-2222-2222-222222222221', 5, 'Great car, excellent condition. Seller was honest about everything.', NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE id = 'rv121212-1212-1212-1212-121212121204');

INSERT INTO reviews (id, post_id, user_id, rating, comment, created_at)
SELECT 'rv121212-1212-1212-1212-121212121205', 'po666666-6666-6666-6666-666666666609', 'u1111111-1111-1111-1111-111111111112', 4, 'Professional service, they did a great job cleaning my apartment.', NOW() - INTERVAL '4 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE id = 'rv121212-1212-1212-1212-121212121205');

-- ============================================
-- 8. ROLE CHANGE LOGS
-- ============================================

INSERT INTO role_change_logs (id, user_id, from_role, to_role, changed_by_user_id, reason, created_at)
SELECT 'rc131313-1313-1313-1313-131313131301', 'u2222222-2222-2222-2222-222222222221', 'normal', 'member', 'u4444444-4444-4444-4444-444444444441', 'Promoted to member after verification', NOW() - INTERVAL '60 days'
WHERE NOT EXISTS (SELECT 1 FROM role_change_logs WHERE id = 'rc131313-1313-1313-1313-131313131301');

INSERT INTO role_change_logs (id, user_id, from_role, to_role, changed_by_user_id, reason, created_at)
SELECT 'rc131313-1313-1313-1313-131313131302', 'u2222222-2222-2222-2222-222222222222', 'normal', 'member', 'u4444444-4444-4444-4444-444444444441', 'Promoted to member for Nouadhibou region', NOW() - INTERVAL '30 days'
WHERE NOT EXISTS (SELECT 1 FROM role_change_logs WHERE id = 'rc131313-1313-1313-1313-131313131302');

INSERT INTO role_change_logs (id, user_id, from_role, to_role, changed_by_user_id, reason, created_at)
SELECT 'rc131313-1313-1313-1313-131313131303', 'u3333333-3333-3333-3333-333333333331', 'member', 'ex_member', NULL, 'Subscription expired - automatic demotion', NOW() - INTERVAL '15 days'
WHERE NOT EXISTS (SELECT 1 FROM role_change_logs WHERE id = 'rc131313-1313-1313-1313-131313131303');

INSERT INTO role_change_logs (id, user_id, from_role, to_role, changed_by_user_id, reason, created_at)
SELECT 'rc131313-1313-1313-1313-131313131304', 'u3333333-3333-3333-3333-333333333332', 'member', 'ex_member', 'u4444444-4444-4444-4444-444444444441', 'Manual demotion due to inactivity', NOW() - INTERVAL '45 days'
WHERE NOT EXISTS (SELECT 1 FROM role_change_logs WHERE id = 'rc131313-1313-1313-1313-131313131304');

INSERT INTO role_change_logs (id, user_id, from_role, to_role, changed_by_user_id, reason, created_at)
SELECT 'rc131313-1313-1313-1313-131313131305', 'u2222222-2222-2222-2222-222222222223', 'normal', 'member', 'u4444444-4444-4444-4444-444444444442', 'New member for Atar region', NOW() - INTERVAL '7 days'
WHERE NOT EXISTS (SELECT 1 FROM role_change_logs WHERE id = 'rc131313-1313-1313-1313-131313131305');

-- ============================================
-- 9. SUBSCRIPTION HISTORY (for ex-members)
-- ============================================

INSERT INTO subscription_history (id, user_id, action, amount_charged_mru, balance_before_mru, balance_after_mru, created_at)
SELECT 'sh141414-1414-1414-1414-141414141401', 'u3333333-3333-3333-3333-333333333331', 'activated', 500.00, 3500.00, 3000.00, NOW() - INTERVAL '15 days'
WHERE NOT EXISTS (SELECT 1 FROM subscription_history WHERE id = 'sh141414-1414-1414-1414-141414141401');

INSERT INTO subscription_history (id, user_id, action, amount_charged_mru, balance_before_mru, balance_after_mru, created_at)
SELECT 'sh141414-1414-1414-1414-141414141402', 'u3333333-3333-3333-3333-333333333332', 'expired', NULL, NULL, NULL, NOW() - INTERVAL '45 days'
WHERE NOT EXISTS (SELECT 1 FROM subscription_history WHERE id = 'sh141414-1414-1414-1414-141414141402');

-- ============================================
-- SEED DATA COMPLETE
-- ============================================
-- Total records created:
-- - 11 Users (1 Guest, 3 Normal, 3 Member, 2 Ex-Member, 2 Leader)
-- - 11 Posts
-- - 9 Wallet Transactions
-- - 3 Member Reports
-- - 10 Notifications
-- - 8 Saved Posts
-- - 5 Reviews
-- - 5 Role Change Logs
-- - 2 Subscription History
-- ============================================
