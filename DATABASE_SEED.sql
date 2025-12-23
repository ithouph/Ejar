-- ============================================
-- EJAR MARKETPLACE - SEED DATA
-- Run this AFTER DATABASE_SETUP.sql
-- Fills ALL tables with sample data for testing
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS - ALL ROLES (11 users total)
-- Guest, Normal (3), Member (3), Ex-Member (2), Leader (2)
-- ============================================

-- GUEST USER (identified by phone '+22200000000')
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
    '11111111-1111-1111-1111-111111111111',
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
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = '11111111-1111-1111-1111-111111111111');

-- NORMAL USER 2 - User in Nouadhibou
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, free_posts_used, total_posts_created
) 
SELECT
    '11111111-1111-1111-1111-111111111112',
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
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = '11111111-1111-1111-1111-111111111112');

-- NORMAL USER 3 - New user with no balance (Kaédi)
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining, free_posts_used, total_posts_created
) 
SELECT
    '11111111-1111-1111-1111-111111111113',
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
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = '11111111-1111-1111-1111-111111111113');

-- MEMBER 1 - Active member in Nouakchott
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining,
    member_payment_phone, total_approvals_made, total_earned_from_approvals_mru
) 
SELECT
    '22222222-2222-2222-2222-222222222221',
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
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = '22222222-2222-2222-2222-222222222221');

-- MEMBER 2 - Active member in Nouadhibou
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining,
    member_payment_phone, total_approvals_made, total_earned_from_approvals_mru
) 
SELECT
    '22222222-2222-2222-2222-222222222222',
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
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = '22222222-2222-2222-2222-222222222222');

-- MEMBER 3 - New member in Atar
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining,
    member_payment_phone, total_approvals_made, total_earned_from_approvals_mru
) 
SELECT
    '22222222-2222-2222-2222-222222222223',
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
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = '22222222-2222-2222-2222-222222222223');

-- EX-MEMBER 1 - Active subscription in Nouakchott
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining,
    ex_member_is_active, ex_member_activated_at, ex_member_next_payment_due
) 
SELECT
    '33333333-3333-3333-3333-333333333331',
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
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = '33333333-3333-3333-3333-333333333331');

-- EX-MEMBER 2 - Expired subscription in Kiffa
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining,
    ex_member_is_active, ex_member_activated_at, ex_member_next_payment_due
) 
SELECT
    '33333333-3333-3333-3333-333333333332',
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
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = '33333333-3333-3333-3333-333333333332');

-- LEADER 1 - Primary leader in Nouakchott
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining
) 
SELECT
    '44444444-4444-4444-4444-444444444441',
    '+22200001111',
    '+22200001111',
    'Cheikh',
    'Ould Abdallah',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'leader',
    50000.00,
    99
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = '44444444-4444-4444-4444-444444444441');

-- LEADER 2 - Second leader in Nouadhibou
INSERT INTO users (
    id, phone, whatsapp_number, first_name, last_name, city_id,
    role, wallet_balance_mru, free_posts_remaining
) 
SELECT
    '44444444-4444-4444-4444-444444444442',
    '+22200002222',
    '+22200002222',
    'Aminata',
    'Sow',
    (SELECT id FROM cities WHERE name = 'Nouadhibou' LIMIT 1),
    'leader',
    35000.00,
    99
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = '44444444-4444-4444-4444-444444444442');

-- ============================================
-- 2. POSTS - Sample listings (11 posts)
-- ============================================

-- Property Post 1 - Apartment for rent in Nouakchott (PAID, ACTIVE)
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    '66666666-6666-6666-6666-666666666601',
    '11111111-1111-1111-1111-111111111111',
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
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '66666666-6666-6666-6666-666666666601');

-- Property Post 2 - Villa for sale in Nouakchott (FREE POST, ACTIVE)
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    '66666666-6666-6666-6666-666666666602',
    '11111111-1111-1111-1111-111111111111',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    (SELECT id FROM service_categories WHERE name = 'Property' LIMIT 1),
    'Spacious Villa with Garden in Ksar',
    'Luxury 5-bedroom villa with swimming pool, large garden, and generator. Perfect for families.',
    25000000.00,
    ARRAY['https://picsum.photos/400/300?random=3', 'https://picsum.photos/400/300?random=4'],
    true,
    true,
    'active',
    NOW() - INTERVAL '10 days'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '66666666-6666-6666-6666-666666666602');

-- Phone Post - iPhone for sale (PAID, ACTIVE)
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    '66666666-6666-6666-6666-666666666603',
    '11111111-1111-1111-1111-111111111112',
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
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '66666666-6666-6666-6666-666666666603');

-- Laptop Post - MacBook for sale (PAID, ACTIVE)
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    '66666666-6666-6666-6666-666666666604',
    '22222222-2222-2222-2222-222222222221',
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
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '66666666-6666-6666-6666-666666666604');

-- Car Post - Toyota for sale (PAID, ACTIVE)
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    '66666666-6666-6666-6666-666666666605',
    '22222222-2222-2222-2222-222222222222',
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
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '66666666-6666-6666-6666-666666666605');

-- Electronics Post - TV for sale (UNPAID, PENDING_PAYMENT)
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    '66666666-6666-6666-6666-666666666606',
    '11111111-1111-1111-1111-111111111113',
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
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '66666666-6666-6666-6666-666666666606');

-- Furniture Post (FREE POST, ACTIVE)
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    '66666666-6666-6666-6666-666666666607',
    '33333333-3333-3333-3333-333333333331',
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
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '66666666-6666-6666-6666-666666666607');

-- Property in Atar (PAID, ACTIVE)
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    '66666666-6666-6666-6666-666666666608',
    '22222222-2222-2222-2222-222222222223',
    (SELECT id FROM cities WHERE name = 'Atar' LIMIT 1),
    (SELECT id FROM service_categories WHERE name = 'Property' LIMIT 1),
    'Traditional House in Atar Old Town',
    'Authentic stone house near the old market. 4 rooms with traditional architecture.',
    15000000.00,
    ARRAY['https://picsum.photos/400/300?random=14'],
    true,
    false,
    'active',
    NOW() - INTERVAL '12 days'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '66666666-6666-6666-6666-666666666608');

-- Others Post - Service (FREE POST, ACTIVE)
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    '66666666-6666-6666-6666-666666666609',
    '11111111-1111-1111-1111-111111111111',
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
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '66666666-6666-6666-6666-666666666609');

-- Post from ex-member (ENDED)
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, ended_at, created_at
)
SELECT
    '66666666-6666-6666-6666-66666666660a',
    '33333333-3333-3333-3333-333333333332',
    (SELECT id FROM cities WHERE name = 'Kiffa' LIMIT 1),
    (SELECT id FROM service_categories WHERE name = 'Electronics' LIMIT 1),
    'Air Conditioner 2.5HP',
    'Powerful AC unit, cools large rooms quickly. 1 year old.',
    95000.00,
    ARRAY['https://picsum.photos/400/300?random=16'],
    true,
    false,
    'ended',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '45 days'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '66666666-6666-6666-6666-66666666660a');

-- Leader test post (PAID, ACTIVE)
INSERT INTO posts (
    id, user_id, city_id, category_id,
    title, description, price, images,
    paid, was_free_post, status, created_at
)
SELECT
    '66666666-6666-6666-6666-66666666660b',
    '44444444-4444-4444-4444-444444444441',
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
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '66666666-6666-6666-6666-66666666660b');

-- ============================================
-- 3. WALLET TRANSACTIONS (10 transactions)
-- ============================================

-- Pending deposit from Normal User 3 (awaiting approval)
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status, created_at
)
SELECT
    '77777777-7777-7777-7777-777777777701',
    '11111111-1111-1111-1111-111111111113',
    (SELECT id FROM cities WHERE name = 'Kaédi' LIMIT 1),
    'deposit',
    2000.00,
    0.00,
    2000.00,
    'https://picsum.photos/400/600?random=20',
    'Bankily',
    'pending',
    NOW() - INTERVAL '2 hours'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = '77777777-7777-7777-7777-777777777701');

-- Approved deposit for Normal User 1 (member approved)
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status,
    approved_by_member_id, approved_at, created_at
)
SELECT
    '77777777-7777-7777-7777-777777777702',
    '11111111-1111-1111-1111-111111111111',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'deposit',
    5000.00,
    0.00,
    5000.00,
    'https://picsum.photos/400/600?random=21',
    'Sedad',
    'approved',
    '22222222-2222-2222-2222-222222222221',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = '77777777-7777-7777-7777-777777777702');

-- Post payment transaction
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    related_post_id, status, created_at
)
SELECT
    '77777777-7777-7777-7777-777777777703',
    '11111111-1111-1111-1111-111111111111',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'post_payment',
    10.00,
    5000.00,
    4990.00,
    '66666666-6666-6666-6666-666666666601',
    'approved',
    NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = '77777777-7777-7777-7777-777777777703');

-- Member approval reward
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    status, created_at
)
SELECT
    '77777777-7777-7777-7777-777777777704',
    '22222222-2222-2222-2222-222222222221',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'approval_reward',
    25.00,
    14975.00,
    15000.00,
    'approved',
    NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = '77777777-7777-7777-7777-777777777704');

-- Rejected deposit (user provided fake screenshot)
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status,
    approved_by_member_id, rejection_reason, created_at
)
SELECT
    '77777777-7777-7777-7777-777777777705',
    '11111111-1111-1111-1111-111111111112',
    (SELECT id FROM cities WHERE name = 'Nouadhibou' LIMIT 1),
    'deposit',
    10000.00,
    2500.00,
    12500.00,
    'https://picsum.photos/400/600?random=22',
    'Masrvi',
    'rejected',
    '22222222-2222-2222-2222-222222222222',
    'Payment screenshot appears to be modified or fake',
    NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = '77777777-7777-7777-7777-777777777705');

-- Pending deposit in Nouadhibou
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status, created_at
)
SELECT
    '77777777-7777-7777-7777-777777777706',
    '11111111-1111-1111-1111-111111111112',
    (SELECT id FROM cities WHERE name = 'Nouadhibou' LIMIT 1),
    'deposit',
    3000.00,
    2500.00,
    5500.00,
    'https://picsum.photos/400/600?random=23',
    'Bankily',
    'pending',
    NOW() - INTERVAL '4 hours'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = '77777777-7777-7777-7777-777777777706');

-- Ex-member subscription charge
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    status, created_at
)
SELECT
    '77777777-7777-7777-7777-777777777707',
    '33333333-3333-3333-3333-333333333331',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'ex_member_subscription',
    500.00,
    3500.00,
    3000.00,
    'approved',
    NOW() - INTERVAL '15 days'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = '77777777-7777-7777-7777-777777777707');

-- Large pending deposit (escalated to leader)
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    payment_screenshot_url, payment_method, status, created_at
)
SELECT
    '77777777-7777-7777-7777-777777777708',
    '22222222-2222-2222-2222-222222222222',
    (SELECT id FROM cities WHERE name = 'Nouadhibou' LIMIT 1),
    'deposit',
    50000.00,
    8500.00,
    58500.00,
    'https://picsum.photos/400/600?random=24',
    'Bankily',
    'assigned_to_leader',
    NOW() - INTERVAL '6 hours'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = '77777777-7777-7777-7777-777777777708');

-- Refund transaction (approved by leader)
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    status, approved_by_leader_id, approved_at, created_at
)
SELECT
    '77777777-7777-7777-7777-777777777709',
    '11111111-1111-1111-1111-111111111111',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'refund',
    10.00,
    4990.00,
    5000.00,
    'approved',
    '44444444-4444-4444-4444-444444444441',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = '77777777-7777-7777-7777-777777777709');

-- Report penalty transaction
INSERT INTO wallet_transactions (
    id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru,
    status, created_at
)
SELECT
    '77777777-7777-7777-7777-77777777770a',
    '22222222-2222-2222-2222-222222222221',
    (SELECT id FROM cities WHERE name = 'Nouakchott' LIMIT 1),
    'report_penalty',
    500.00,
    15500.00,
    15000.00,
    'approved',
    NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM wallet_transactions WHERE id = '77777777-7777-7777-7777-77777777770a');

-- ============================================
-- 4. MEMBER REPORTS (3 reports)
-- ============================================

-- Pending report against Member 2
INSERT INTO member_reports (
    id, reporter_user_id, reported_member_id, transaction_id,
    reason, details, status, created_at
)
SELECT
    '88888888-8888-8888-8888-888888888801',
    '11111111-1111-1111-1111-111111111112',
    '22222222-2222-2222-2222-222222222222',
    '77777777-7777-7777-7777-777777777705',
    'Unfair rejection - payment was valid',
    'I made a legitimate payment of 10,000 MRU via Masrvi. The screenshot is real and shows the transaction reference. The member rejected without proper verification.',
    'pending',
    NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM member_reports WHERE id = '88888888-8888-8888-8888-888888888801');

-- Approved report (member was penalized)
INSERT INTO member_reports (
    id, reporter_user_id, reported_member_id, transaction_id,
    reason, details, status,
    reviewed_by_leader_id, reviewed_at, leader_notes, penalty_charged
)
SELECT
    '88888888-8888-8888-8888-888888888802',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222221',
    '77777777-7777-7777-7777-777777777702',
    'Delayed approval',
    'Member took more than 24 hours to approve my deposit even though the payment was clearly visible.',
    'approved',
    '44444444-4444-4444-4444-444444444441',
    NOW() - INTERVAL '2 days',
    'Member failed to process within SLA. Penalty applied.',
    true
WHERE NOT EXISTS (SELECT 1 FROM member_reports WHERE id = '88888888-8888-8888-8888-888888888802');

-- Rejected report (user complaint was invalid)
INSERT INTO member_reports (
    id, reporter_user_id, reported_member_id, transaction_id,
    reason, details, status,
    reviewed_by_leader_id, reviewed_at, leader_notes, penalty_charged
)
SELECT
    '88888888-8888-8888-8888-888888888803',
    '33333333-3333-3333-3333-333333333331',
    '22222222-2222-2222-2222-222222222222',
    '77777777-7777-7777-7777-777777777706',
    'False rejection claim',
    'The member rejected my valid payment.',
    'rejected',
    '44444444-4444-4444-4444-444444444442',
    NOW() - INTERVAL '5 days',
    'Investigation shows the payment screenshot was cropped and missing transaction reference. Rejection was valid.',
    false
WHERE NOT EXISTS (SELECT 1 FROM member_reports WHERE id = '88888888-8888-8888-8888-888888888803');

-- ============================================
-- 5. NOTIFICATIONS (12 notifications)
-- ============================================

INSERT INTO notifications (id, user_id, type, title, message, data, read, created_at)
SELECT '99999999-9999-9999-9999-999999999901', '11111111-1111-1111-1111-111111111111', 'payment_approved', 'Deposit Approved', 'Your deposit of 5,000 MRU has been approved!', '{"transaction_id": "77777777-7777-7777-7777-777777777702"}'::jsonb, true, NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = '99999999-9999-9999-9999-999999999901');

INSERT INTO notifications (id, user_id, type, title, message, data, read, created_at)
SELECT '99999999-9999-9999-9999-999999999902', '11111111-1111-1111-1111-111111111112', 'payment_rejected', 'Deposit Rejected', 'Your deposit of 10,000 MRU was rejected.', '{"transaction_id": "77777777-7777-7777-7777-777777777705"}'::jsonb, false, NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = '99999999-9999-9999-9999-999999999902');

INSERT INTO notifications (id, user_id, type, title, message, data, read, created_at)
SELECT '99999999-9999-9999-9999-999999999903', '22222222-2222-2222-2222-222222222221', 'approval_reward', 'Reward Earned!', 'You earned 25 MRU for approving a deposit.', '{"transaction_id": "77777777-7777-7777-7777-777777777704"}'::jsonb, true, NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = '99999999-9999-9999-9999-999999999903');

INSERT INTO notifications (id, user_id, type, title, message, data, read, created_at)
SELECT '99999999-9999-9999-9999-999999999904', '22222222-2222-2222-2222-222222222222', 'report_filed', 'Report Filed Against You', 'A user has filed a report against your rejection decision.', '{"report_id": "88888888-8888-8888-8888-888888888801"}'::jsonb, false, NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = '99999999-9999-9999-9999-999999999904');

INSERT INTO notifications (id, user_id, type, title, message, data, read, created_at)
SELECT '99999999-9999-9999-9999-999999999905', '44444444-4444-4444-4444-444444444441', 'no_member_in_city', 'Escalated Deposit', 'A large deposit (50,000 MRU) requires your review.', '{"transaction_id": "77777777-7777-7777-7777-777777777708"}'::jsonb, false, NOW() - INTERVAL '6 hours'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = '99999999-9999-9999-9999-999999999905');

INSERT INTO notifications (id, user_id, type, title, message, data, read, created_at)
SELECT '99999999-9999-9999-9999-999999999906', '33333333-3333-3333-3333-333333333331', 'subscription_expired', 'Subscription Expiring', 'Your ex-member subscription will expire in 5 days.', '{}'::jsonb, false, NOW() - INTERVAL '10 days'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = '99999999-9999-9999-9999-999999999906');

INSERT INTO notifications (id, user_id, type, title, message, data, read, created_at)
SELECT '99999999-9999-9999-9999-999999999907', '11111111-1111-1111-1111-111111111111', 'post_created', 'Post Created', 'Your listing has been published successfully.', '{"post_id": "66666666-6666-6666-6666-666666666601"}'::jsonb, true, NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = '99999999-9999-9999-9999-999999999907');

INSERT INTO notifications (id, user_id, type, title, message, data, read, created_at)
SELECT '99999999-9999-9999-9999-999999999908', '22222222-2222-2222-2222-222222222221', 'penalty_charged', 'Penalty Applied', 'A penalty of 500 MRU has been deducted for delayed processing.', '{"report_id": "88888888-8888-8888-8888-888888888802"}'::jsonb, true, NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = '99999999-9999-9999-9999-999999999908');

INSERT INTO notifications (id, user_id, type, title, message, data, read, created_at)
SELECT '99999999-9999-9999-9999-999999999909', '11111111-1111-1111-1111-111111111113', 'role_promoted', 'Welcome to Ejar!', 'Start by posting your first listing. You have 5 free posts!', '{}'::jsonb, false, NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = '99999999-9999-9999-9999-999999999909');

INSERT INTO notifications (id, user_id, type, title, message, data, read, created_at)
SELECT '99999999-9999-9999-9999-99999999990a', '44444444-4444-4444-4444-444444444441', 'report_filed', 'Pending Report', 'A new unfair rejection report requires your attention.', '{"report_id": "88888888-8888-8888-8888-888888888801"}'::jsonb, false, NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = '99999999-9999-9999-9999-99999999990a');

INSERT INTO notifications (id, user_id, type, title, message, data, read, created_at)
SELECT '99999999-9999-9999-9999-99999999990b', '22222222-2222-2222-2222-222222222221', 'role_promoted', 'You are now a Member!', 'You have been promoted to member. You can now approve deposit requests in your city.', '{}'::jsonb, true, NOW() - INTERVAL '60 days'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = '99999999-9999-9999-9999-99999999990b');

INSERT INTO notifications (id, user_id, type, title, message, data, read, created_at)
SELECT '99999999-9999-9999-9999-99999999990c', '33333333-3333-3333-3333-333333333331', 'role_demoted', 'Membership Status Changed', 'Your membership has been converted to ex-member. Activate subscription to continue posting.', '{}'::jsonb, true, NOW() - INTERVAL '15 days'
WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE id = '99999999-9999-9999-9999-99999999990c');

-- ============================================
-- 6. SAVED POSTS (Favorites)
-- ============================================

INSERT INTO saved_posts (user_id, post_id, created_at)
SELECT '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666603', NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE user_id = '11111111-1111-1111-1111-111111111111' AND post_id = '66666666-6666-6666-6666-666666666603');

INSERT INTO saved_posts (user_id, post_id, created_at)
SELECT '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666605', NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE user_id = '11111111-1111-1111-1111-111111111111' AND post_id = '66666666-6666-6666-6666-666666666605');

INSERT INTO saved_posts (user_id, post_id, created_at)
SELECT '11111111-1111-1111-1111-111111111112', '66666666-6666-6666-6666-666666666601', NOW() - INTERVAL '4 days'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE user_id = '11111111-1111-1111-1111-111111111112' AND post_id = '66666666-6666-6666-6666-666666666601');

INSERT INTO saved_posts (user_id, post_id, created_at)
SELECT '11111111-1111-1111-1111-111111111112', '66666666-6666-6666-6666-666666666604', NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE user_id = '11111111-1111-1111-1111-111111111112' AND post_id = '66666666-6666-6666-6666-666666666604');

INSERT INTO saved_posts (user_id, post_id, created_at)
SELECT '22222222-2222-2222-2222-222222222221', '66666666-6666-6666-6666-666666666608', NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE user_id = '22222222-2222-2222-2222-222222222221' AND post_id = '66666666-6666-6666-6666-666666666608');

INSERT INTO saved_posts (user_id, post_id, created_at)
SELECT '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666602', NOW() - INTERVAL '6 days'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE user_id = '22222222-2222-2222-2222-222222222222' AND post_id = '66666666-6666-6666-6666-666666666602');

INSERT INTO saved_posts (user_id, post_id, created_at)
SELECT '33333333-3333-3333-3333-333333333331', '66666666-6666-6666-6666-666666666609', NOW() - INTERVAL '7 days'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE user_id = '33333333-3333-3333-3333-333333333331' AND post_id = '66666666-6666-6666-6666-666666666609');

INSERT INTO saved_posts (user_id, post_id, created_at)
SELECT '44444444-4444-4444-4444-444444444441', '66666666-6666-6666-6666-666666666605', NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM saved_posts WHERE user_id = '44444444-4444-4444-4444-444444444441' AND post_id = '66666666-6666-6666-6666-666666666605');

-- ============================================
-- 7. REVIEWS (5 reviews)
-- ============================================

INSERT INTO reviews (id, post_id, user_id, rating, comment, created_at)
SELECT 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', '66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111112', 5, 'Excellent apartment! Very clean and the owner was very helpful.', NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001');

INSERT INTO reviews (id, post_id, user_id, rating, comment, created_at)
SELECT 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002', '66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222222', 4, 'Good location, nice furniture. AC was a bit noisy but overall great.', NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002');

INSERT INTO reviews (id, post_id, user_id, rating, comment, created_at)
SELECT 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003', '66666666-6666-6666-6666-666666666603', '11111111-1111-1111-1111-111111111111', 5, 'Phone was exactly as described. Fast transaction!', NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003');

INSERT INTO reviews (id, post_id, user_id, rating, comment, created_at)
SELECT 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa004', '66666666-6666-6666-6666-666666666605', '22222222-2222-2222-2222-222222222221', 5, 'Great car, excellent condition. Seller was honest about everything.', NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa004');

INSERT INTO reviews (id, post_id, user_id, rating, comment, created_at)
SELECT 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa005', '66666666-6666-6666-6666-666666666609', '11111111-1111-1111-1111-111111111112', 4, 'Professional service, they did a great job cleaning my apartment.', NOW() - INTERVAL '4 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa005');

-- ============================================
-- 8. ROLE CHANGE LOGS (5 logs)
-- ============================================

INSERT INTO role_change_logs (id, user_id, previous_role, new_role, changed_by_leader_id, user_balance_at_change, reason, created_at)
SELECT 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', '22222222-2222-2222-2222-222222222221', 'normal', 'member', '44444444-4444-4444-4444-444444444441', 5000.00, 'Promoted to member after verification', NOW() - INTERVAL '60 days'
WHERE NOT EXISTS (SELECT 1 FROM role_change_logs WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001');

INSERT INTO role_change_logs (id, user_id, previous_role, new_role, changed_by_leader_id, user_balance_at_change, reason, created_at)
SELECT 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', '22222222-2222-2222-2222-222222222222', 'normal', 'member', '44444444-4444-4444-4444-444444444441', 3000.00, 'Promoted to member for Nouadhibou region', NOW() - INTERVAL '30 days'
WHERE NOT EXISTS (SELECT 1 FROM role_change_logs WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002');

INSERT INTO role_change_logs (id, user_id, previous_role, new_role, changed_by_leader_id, user_balance_at_change, reason, created_at)
SELECT 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb003', '33333333-3333-3333-3333-333333333331', 'member', 'ex_member', NULL, 3500.00, 'Subscription expired - automatic demotion', NOW() - INTERVAL '15 days'
WHERE NOT EXISTS (SELECT 1 FROM role_change_logs WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb003');

INSERT INTO role_change_logs (id, user_id, previous_role, new_role, changed_by_leader_id, user_balance_at_change, reason, created_at)
SELECT 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb004', '33333333-3333-3333-3333-333333333332', 'member', 'ex_member', '44444444-4444-4444-4444-444444444441', 5000.00, 'Manual demotion due to inactivity', NOW() - INTERVAL '45 days'
WHERE NOT EXISTS (SELECT 1 FROM role_change_logs WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb004');

INSERT INTO role_change_logs (id, user_id, previous_role, new_role, changed_by_leader_id, user_balance_at_change, reason, created_at)
SELECT 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb005', '22222222-2222-2222-2222-222222222223', 'normal', 'member', '44444444-4444-4444-4444-444444444442', 1000.00, 'New member for Atar region', NOW() - INTERVAL '7 days'
WHERE NOT EXISTS (SELECT 1 FROM role_change_logs WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb005');

-- ============================================
-- 9. SUBSCRIPTION HISTORY (4 records)
-- ============================================

INSERT INTO subscription_history (id, user_id, action, amount_charged_mru, balance_before_mru, balance_after_mru, next_payment_due, created_at)
SELECT 'cccccccc-cccc-cccc-cccc-ccccccccc001', '33333333-3333-3333-3333-333333333331', 'activated', 500.00, 3500.00, 3000.00, NOW() + INTERVAL '15 days', NOW() - INTERVAL '15 days'
WHERE NOT EXISTS (SELECT 1 FROM subscription_history WHERE id = 'cccccccc-cccc-cccc-cccc-ccccccccc001');

INSERT INTO subscription_history (id, user_id, action, amount_charged_mru, balance_before_mru, balance_after_mru, next_payment_due, created_at)
SELECT 'cccccccc-cccc-cccc-cccc-ccccccccc002', '33333333-3333-3333-3333-333333333332', 'activated', 500.00, 5000.00, 4500.00, NOW() - INTERVAL '45 days', NOW() - INTERVAL '75 days'
WHERE NOT EXISTS (SELECT 1 FROM subscription_history WHERE id = 'cccccccc-cccc-cccc-cccc-ccccccccc002');

INSERT INTO subscription_history (id, user_id, action, amount_charged_mru, balance_before_mru, balance_after_mru, next_payment_due, created_at)
SELECT 'cccccccc-cccc-cccc-cccc-ccccccccc003', '33333333-3333-3333-3333-333333333332', 'expired', NULL, NULL, NULL, NULL, NOW() - INTERVAL '45 days'
WHERE NOT EXISTS (SELECT 1 FROM subscription_history WHERE id = 'cccccccc-cccc-cccc-cccc-ccccccccc003');

INSERT INTO subscription_history (id, user_id, action, amount_charged_mru, balance_before_mru, balance_after_mru, next_payment_due, created_at)
SELECT 'cccccccc-cccc-cccc-cccc-ccccccccc004', '33333333-3333-3333-3333-333333333331', 'renewed', 500.00, 4000.00, 3500.00, NOW() + INTERVAL '45 days', NOW() - INTERVAL '45 days'
WHERE NOT EXISTS (SELECT 1 FROM subscription_history WHERE id = 'cccccccc-cccc-cccc-cccc-ccccccccc004');

-- ============================================
-- 10. CATEGORY FIELDS (Dynamic form fields)
-- ============================================

-- Property category fields
INSERT INTO category_fields (id, category_id, field_key, field_label, field_type, options, placeholder, is_required, sort_order)
SELECT 'dddddddd-dddd-dddd-dddd-ddddddddd001', 
       (SELECT id FROM service_categories WHERE name = 'Property' LIMIT 1),
       'bedrooms', 'Number of Bedrooms', 'select', 
       '["1", "2", "3", "4", "5+"]'::jsonb, 
       'Select bedrooms', true, 1
WHERE NOT EXISTS (SELECT 1 FROM category_fields WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddd001');

INSERT INTO category_fields (id, category_id, field_key, field_label, field_type, options, placeholder, is_required, sort_order)
SELECT 'dddddddd-dddd-dddd-dddd-ddddddddd002', 
       (SELECT id FROM service_categories WHERE name = 'Property' LIMIT 1),
       'bathrooms', 'Number of Bathrooms', 'select', 
       '["1", "2", "3", "4+"]'::jsonb, 
       'Select bathrooms', true, 2
WHERE NOT EXISTS (SELECT 1 FROM category_fields WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddd002');

INSERT INTO category_fields (id, category_id, field_key, field_label, field_type, options, placeholder, is_required, sort_order)
SELECT 'dddddddd-dddd-dddd-dddd-ddddddddd003', 
       (SELECT id FROM service_categories WHERE name = 'Property' LIMIT 1),
       'area_sqm', 'Area (m²)', 'number', NULL, 
       'Enter area in square meters', false, 3
WHERE NOT EXISTS (SELECT 1 FROM category_fields WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddd003');

INSERT INTO category_fields (id, category_id, field_key, field_label, field_type, options, placeholder, is_required, sort_order)
SELECT 'dddddddd-dddd-dddd-dddd-ddddddddd004', 
       (SELECT id FROM service_categories WHERE name = 'Property' LIMIT 1),
       'furnished', 'Furnished', 'checkbox', NULL, NULL, false, 4
WHERE NOT EXISTS (SELECT 1 FROM category_fields WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddd004');

-- Phones category fields
INSERT INTO category_fields (id, category_id, field_key, field_label, field_type, options, placeholder, is_required, sort_order)
SELECT 'dddddddd-dddd-dddd-dddd-ddddddddd005', 
       (SELECT id FROM service_categories WHERE name = 'Phones' LIMIT 1),
       'brand', 'Brand', 'select', 
       '["Apple", "Samsung", "Huawei", "Xiaomi", "Oppo", "Other"]'::jsonb, 
       'Select brand', true, 1
WHERE NOT EXISTS (SELECT 1 FROM category_fields WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddd005');

INSERT INTO category_fields (id, category_id, field_key, field_label, field_type, options, placeholder, is_required, sort_order)
SELECT 'dddddddd-dddd-dddd-dddd-ddddddddd006', 
       (SELECT id FROM service_categories WHERE name = 'Phones' LIMIT 1),
       'storage', 'Storage', 'select', 
       '["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"]'::jsonb, 
       'Select storage', false, 2
WHERE NOT EXISTS (SELECT 1 FROM category_fields WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddd006');

INSERT INTO category_fields (id, category_id, field_key, field_label, field_type, options, placeholder, is_required, sort_order)
SELECT 'dddddddd-dddd-dddd-dddd-ddddddddd007', 
       (SELECT id FROM service_categories WHERE name = 'Phones' LIMIT 1),
       'condition', 'Condition', 'select', 
       '["New", "Like New", "Good", "Fair"]'::jsonb, 
       'Select condition', true, 3
WHERE NOT EXISTS (SELECT 1 FROM category_fields WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddd007');

-- Cars category fields
INSERT INTO category_fields (id, category_id, field_key, field_label, field_type, options, placeholder, is_required, sort_order)
SELECT 'dddddddd-dddd-dddd-dddd-ddddddddd008', 
       (SELECT id FROM service_categories WHERE name = 'Cars' LIMIT 1),
       'brand', 'Brand', 'select', 
       '["Toyota", "Nissan", "Mercedes", "BMW", "Land Rover", "Hyundai", "Kia", "Other"]'::jsonb, 
       'Select brand', true, 1
WHERE NOT EXISTS (SELECT 1 FROM category_fields WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddd008');

INSERT INTO category_fields (id, category_id, field_key, field_label, field_type, options, placeholder, is_required, sort_order)
SELECT 'dddddddd-dddd-dddd-dddd-ddddddddd009', 
       (SELECT id FROM service_categories WHERE name = 'Cars' LIMIT 1),
       'year', 'Year', 'number', NULL, 
       'Enter year', true, 2
WHERE NOT EXISTS (SELECT 1 FROM category_fields WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddd009');

INSERT INTO category_fields (id, category_id, field_key, field_label, field_type, options, placeholder, is_required, sort_order)
SELECT 'dddddddd-dddd-dddd-dddd-ddddddddda0a', 
       (SELECT id FROM service_categories WHERE name = 'Cars' LIMIT 1),
       'mileage_km', 'Mileage (km)', 'number', NULL, 
       'Enter mileage', false, 3
WHERE NOT EXISTS (SELECT 1 FROM category_fields WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddda0a');

INSERT INTO category_fields (id, category_id, field_key, field_label, field_type, options, placeholder, is_required, sort_order)
SELECT 'dddddddd-dddd-dddd-dddd-ddddddddda0b', 
       (SELECT id FROM service_categories WHERE name = 'Cars' LIMIT 1),
       'fuel_type', 'Fuel Type', 'select', 
       '["Petrol", "Diesel", "Hybrid", "Electric"]'::jsonb, 
       'Select fuel type', false, 4
WHERE NOT EXISTS (SELECT 1 FROM category_fields WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddda0b');

-- Laptops category fields
INSERT INTO category_fields (id, category_id, field_key, field_label, field_type, options, placeholder, is_required, sort_order)
SELECT 'dddddddd-dddd-dddd-dddd-ddddddddda0c', 
       (SELECT id FROM service_categories WHERE name = 'Laptops' LIMIT 1),
       'brand', 'Brand', 'select', 
       '["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "Other"]'::jsonb, 
       'Select brand', true, 1
WHERE NOT EXISTS (SELECT 1 FROM category_fields WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddda0c');

INSERT INTO category_fields (id, category_id, field_key, field_label, field_type, options, placeholder, is_required, sort_order)
SELECT 'dddddddd-dddd-dddd-dddd-ddddddddda0d', 
       (SELECT id FROM service_categories WHERE name = 'Laptops' LIMIT 1),
       'ram', 'RAM', 'select', 
       '["4GB", "8GB", "16GB", "32GB", "64GB"]'::jsonb, 
       'Select RAM', false, 2
WHERE NOT EXISTS (SELECT 1 FROM category_fields WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddda0d');

INSERT INTO category_fields (id, category_id, field_key, field_label, field_type, options, placeholder, is_required, sort_order)
SELECT 'dddddddd-dddd-dddd-dddd-ddddddddda0e', 
       (SELECT id FROM service_categories WHERE name = 'Laptops' LIMIT 1),
       'storage', 'Storage', 'select', 
       '["128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD", "1TB HDD", "2TB HDD"]'::jsonb, 
       'Select storage', false, 3
WHERE NOT EXISTS (SELECT 1 FROM category_fields WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddda0e');

-- ============================================
-- 11. POST AMENITIES (Junction table)
-- ============================================

-- Apartment post amenities
INSERT INTO post_amenities (post_id, amenity_id, created_at)
SELECT '66666666-6666-6666-6666-666666666601', 
       (SELECT id FROM amenities WHERE slug = 'wifi' LIMIT 1),
       NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (
    SELECT 1 FROM post_amenities 
    WHERE post_id = '66666666-6666-6666-6666-666666666601' 
    AND amenity_id = (SELECT id FROM amenities WHERE slug = 'wifi' LIMIT 1)
);

INSERT INTO post_amenities (post_id, amenity_id, created_at)
SELECT '66666666-6666-6666-6666-666666666601', 
       (SELECT id FROM amenities WHERE slug = 'ac' LIMIT 1),
       NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (
    SELECT 1 FROM post_amenities 
    WHERE post_id = '66666666-6666-6666-6666-666666666601' 
    AND amenity_id = (SELECT id FROM amenities WHERE slug = 'ac' LIMIT 1)
);

INSERT INTO post_amenities (post_id, amenity_id, created_at)
SELECT '66666666-6666-6666-6666-666666666601', 
       (SELECT id FROM amenities WHERE slug = 'parking' LIMIT 1),
       NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (
    SELECT 1 FROM post_amenities 
    WHERE post_id = '66666666-6666-6666-6666-666666666601' 
    AND amenity_id = (SELECT id FROM amenities WHERE slug = 'parking' LIMIT 1)
);

INSERT INTO post_amenities (post_id, amenity_id, created_at)
SELECT '66666666-6666-6666-6666-666666666601', 
       (SELECT id FROM amenities WHERE slug = 'security' LIMIT 1),
       NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (
    SELECT 1 FROM post_amenities 
    WHERE post_id = '66666666-6666-6666-6666-666666666601' 
    AND amenity_id = (SELECT id FROM amenities WHERE slug = 'security' LIMIT 1)
);

INSERT INTO post_amenities (post_id, amenity_id, created_at)
SELECT '66666666-6666-6666-6666-666666666601', 
       (SELECT id FROM amenities WHERE slug = 'furnished' LIMIT 1),
       NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (
    SELECT 1 FROM post_amenities 
    WHERE post_id = '66666666-6666-6666-6666-666666666601' 
    AND amenity_id = (SELECT id FROM amenities WHERE slug = 'furnished' LIMIT 1)
);

-- Villa post amenities
INSERT INTO post_amenities (post_id, amenity_id, created_at)
SELECT '66666666-6666-6666-6666-666666666602', 
       (SELECT id FROM amenities WHERE slug = 'generator' LIMIT 1),
       NOW() - INTERVAL '10 days'
WHERE NOT EXISTS (
    SELECT 1 FROM post_amenities 
    WHERE post_id = '66666666-6666-6666-6666-666666666602' 
    AND amenity_id = (SELECT id FROM amenities WHERE slug = 'generator' LIMIT 1)
);

INSERT INTO post_amenities (post_id, amenity_id, created_at)
SELECT '66666666-6666-6666-6666-666666666602', 
       (SELECT id FROM amenities WHERE slug = 'parking' LIMIT 1),
       NOW() - INTERVAL '10 days'
WHERE NOT EXISTS (
    SELECT 1 FROM post_amenities 
    WHERE post_id = '66666666-6666-6666-6666-666666666602' 
    AND amenity_id = (SELECT id FROM amenities WHERE slug = 'parking' LIMIT 1)
);

INSERT INTO post_amenities (post_id, amenity_id, created_at)
SELECT '66666666-6666-6666-6666-666666666602', 
       (SELECT id FROM amenities WHERE slug = 'security' LIMIT 1),
       NOW() - INTERVAL '10 days'
WHERE NOT EXISTS (
    SELECT 1 FROM post_amenities 
    WHERE post_id = '66666666-6666-6666-6666-666666666602' 
    AND amenity_id = (SELECT id FROM amenities WHERE slug = 'security' LIMIT 1)
);

-- Atar house amenities
INSERT INTO post_amenities (post_id, amenity_id, created_at)
SELECT '66666666-6666-6666-6666-666666666608', 
       (SELECT id FROM amenities WHERE slug = 'water' LIMIT 1),
       NOW() - INTERVAL '12 days'
WHERE NOT EXISTS (
    SELECT 1 FROM post_amenities 
    WHERE post_id = '66666666-6666-6666-6666-666666666608' 
    AND amenity_id = (SELECT id FROM amenities WHERE slug = 'water' LIMIT 1)
);

INSERT INTO post_amenities (post_id, amenity_id, created_at)
SELECT '66666666-6666-6666-6666-666666666608', 
       (SELECT id FROM amenities WHERE slug = 'electricity' LIMIT 1),
       NOW() - INTERVAL '12 days'
WHERE NOT EXISTS (
    SELECT 1 FROM post_amenities 
    WHERE post_id = '66666666-6666-6666-6666-666666666608' 
    AND amenity_id = (SELECT id FROM amenities WHERE slug = 'electricity' LIMIT 1)
);

INSERT INTO post_amenities (post_id, amenity_id, created_at)
SELECT '66666666-6666-6666-6666-666666666608', 
       (SELECT id FROM amenities WHERE slug = 'mosque' LIMIT 1),
       NOW() - INTERVAL '12 days'
WHERE NOT EXISTS (
    SELECT 1 FROM post_amenities 
    WHERE post_id = '66666666-6666-6666-6666-666666666608' 
    AND amenity_id = (SELECT id FROM amenities WHERE slug = 'mosque' LIMIT 1)
);

INSERT INTO post_amenities (post_id, amenity_id, created_at)
SELECT '66666666-6666-6666-6666-666666666608', 
       (SELECT id FROM amenities WHERE slug = 'market' LIMIT 1),
       NOW() - INTERVAL '12 days'
WHERE NOT EXISTS (
    SELECT 1 FROM post_amenities 
    WHERE post_id = '66666666-6666-6666-6666-666666666608' 
    AND amenity_id = (SELECT id FROM amenities WHERE slug = 'market' LIMIT 1)
);

-- ============================================
-- SEED DATA COMPLETE
-- ============================================
-- Total records:
-- - 11 Users (1 Guest, 3 Normal, 3 Member, 2 Ex-Member, 2 Leader)
-- - 11 Posts (across all categories)
-- - 10 Wallet Transactions
-- - 3 Member Reports
-- - 12 Notifications
-- - 8 Saved Posts
-- - 5 Reviews
-- - 5 Role Change Logs
-- - 4 Subscription History
-- - 14 Category Fields
-- - 12 Post Amenities
-- ============================================
