-- ════════════════════════════════════════════════════════════════════
-- SEED DATA FOR EJAR APP - ALL TABLES
-- ════════════════════════════════════════════════════════════════════
-- This script inserts 10 realistic records into each table
-- Run this in Supabase SQL Editor after running DATABASE_MIGRATIONS.sql
--
-- IMPORTANT: This will create test data with deterministic UUIDs
-- ════════════════════════════════════════════════════════════════════

BEGIN;

-- ════════════════════════════════════════════════════════════════════
-- 1. USERS TABLE (10 users)
-- ════════════════════════════════════════════════════════════════════
-- Using deterministic UUIDs for reproducibility

INSERT INTO users (id, email, full_name, avatar_url, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'ahmed.hassan@email.com', 'Ahmed Hassan', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', NOW() - INTERVAL '60 days', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'fatima.mohamed@email.com', 'Fatima Mohamed', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', NOW() - INTERVAL '55 days', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'ibrahim.ali@email.com', 'Ibrahim Ali', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200', NOW() - INTERVAL '50 days', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'mariam.abdullah@email.com', 'Mariam Abdullah', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', NOW() - INTERVAL '45 days', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'omar.salem@email.com', 'Omar Salem', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', NOW() - INTERVAL '40 days', NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'aisha.mohammed@email.com', 'Aisha Mohammed', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', NOW() - INTERVAL '35 days', NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'hassan.omar@email.com', 'Hassan Omar', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200', NOW() - INTERVAL '30 days', NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'khadija.ahmed@email.com', 'Khadija Ahmed', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', NOW() - INTERVAL '25 days', NOW()),
('550e8400-e29b-41d4-a716-446655440009', 'youssef.ibrahim@email.com', 'Youssef Ibrahim', 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200', NOW() - INTERVAL '20 days', NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'zainab.hassan@email.com', 'Zainab Hassan', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200', NOW() - INTERVAL '15 days', NOW());

-- ════════════════════════════════════════════════════════════════════
-- 2. POSTS TABLE (10 posts - mixed categories)
-- ════════════════════════════════════════════════════════════════════

-- Post 1: Phone (iPhone)
INSERT INTO posts (user_id, title, content, category, price, location, images, specifications, created_at, likes_count, comments_count) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'iPhone 14 Pro - Excellent Condition', 'Latest iPhone 14 Pro in excellent condition. 256GB storage, space black color. Comes with original box and accessories.', 'phones', 450000, 'Nouakchott (Capital city)', 
'["https://images.unsplash.com/photo-1678652197950-91e2ea7c0333?w=800", "https://images.unsplash.com/photo-1678652197742-f5f6e2c5f5f5?w=800"]'::jsonb,
'{"brand": "Apple", "model": "iPhone 14 Pro", "storage": "256GB", "color": "Space Black", "condition": "Excellent"}'::jsonb,
NOW() - INTERVAL '10 days', 5, 3);

-- Post 2: Laptop
INSERT INTO posts (user_id, title, content, category, price, location, images, specifications, created_at, likes_count, comments_count) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'MacBook Pro 2023 - Perfect for Work', 'MacBook Pro 16-inch, M2 Max chip. Perfect for professional work. Barely used, like new condition.', 'laptops', 1200000, 'Nouadhibou (Port-Étienne)', 
'["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"]'::jsonb,
'{"brand": "Apple", "model": "MacBook Pro 16-inch", "processor": "M2 Max", "ram": "32GB", "storage": "1TB SSD", "condition": "Excellent"}'::jsonb,
NOW() - INTERVAL '9 days', 8, 2);

-- Post 3: Electronics
INSERT INTO posts (user_id, title, content, category, price, location, images, specifications, created_at, likes_count, comments_count) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'Sony 65" 4K Smart TV', 'Brand new Sony 65-inch 4K Smart TV. Still in original packaging with full warranty.', 'electronics', 550000, 'Kiffa', 
'["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800"]'::jsonb,
'{"brand": "Sony", "size": "65 inches", "type": "4K Smart TV", "condition": "New", "warranty": "2 years"}'::jsonb,
NOW() - INTERVAL '8 days', 12, 5);

-- Post 4: Car
INSERT INTO posts (user_id, title, content, category, price, location, images, specifications, created_at, likes_count, comments_count) VALUES
('550e8400-e29b-41d4-a716-446655440004', 'Toyota Camry 2020 - Low Mileage', 'Well-maintained Toyota Camry 2020. Low mileage, single owner. Full service history.', 'cars', 2500000, 'Atar', 
'["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"]'::jsonb,
'{"make": "Toyota", "model": "Camry", "year": 2020, "mileage": 45000, "fuel_type": "Petrol", "gear_type": "Automatic", "condition": "Excellent"}'::jsonb,
NOW() - INTERVAL '7 days', 15, 8);

-- Post 5: Property - Rent Apartment (with nearby_amenities)
INSERT INTO posts (user_id, title, content, category, property_type, listing_type, price, location, amenities, images, specifications, created_at, likes_count, comments_count) VALUES
('550e8400-e29b-41d4-a716-446655440005', 'Modern 3BR Apartment for Rent', 'Spacious 3-bedroom apartment in the heart of Nouakchott. Modern amenities, great location.', 'property', 'apartment', 'rent', 80000, 'Nouakchott (Capital city)',
'["wifi", "parking", "ac", "kitchen"]'::jsonb,
'["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]'::jsonb,
'{"bedrooms": 3, "bathrooms": 2, "size_sqft": 1200, "floor": 5, "nearby_amenities": ["mosque", "laundry"]}'::jsonb,
NOW() - INTERVAL '6 days', 20, 12);

-- Post 6: Property - Sell House
INSERT INTO posts (user_id, title, content, category, property_type, listing_type, price, location, amenities, images, specifications, created_at, likes_count, comments_count) VALUES
('550e8400-e29b-41d4-a716-446655440006', 'Beautiful Family House for Sale', 'Stunning 4-bedroom house with garden. Perfect for families. Prime location in Nouadhibou.', 'property', 'house', 'sell', 3500000, 'Nouadhibou (Port-Étienne)',
'["wifi", "parking", "kitchen"]'::jsonb,
'["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"]'::jsonb,
'{"bedrooms": 4, "bathrooms": 3, "size_sqft": 2000, "garden": true, "garage": true}'::jsonb,
NOW() - INTERVAL '5 days', 25, 15);

-- Post 7: Property - Rent House (with nearby_amenities - REQUIRED)
INSERT INTO posts (user_id, title, content, category, property_type, listing_type, price, location, amenities, images, specifications, created_at, likes_count, comments_count) VALUES
('550e8400-e29b-41d4-a716-446655440007', 'Cozy 2BR House for Rent', 'Charming 2-bedroom house in quiet neighborhood. Great for small families.', 'property', 'house', 'rent', 60000, 'Kaédi',
'["wifi", "parking", "ac"]'::jsonb,
'["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"]'::jsonb,
'{"bedrooms": 2, "bathrooms": 1, "size_sqft": 900, "nearby_amenities": ["mosque", "gym"]}'::jsonb,
NOW() - INTERVAL '4 days', 10, 6);

-- Post 8: Property - Land (with land_size - REQUIRED)
INSERT INTO posts (user_id, title, content, category, property_type, listing_type, price, location, images, specifications, created_at, likes_count, comments_count) VALUES
('550e8400-e29b-41d4-a716-446655440008', 'Prime Land for Sale - 500 sqm', 'Prime residential land in developing area. Perfect for building your dream home.', 'property', 'land', 'sell', 1500000, 'Zouerat',
'["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"]'::jsonb,
'{"land_size": "500 sqm", "location_type": "residential", "utilities_available": true}'::jsonb,
NOW() - INTERVAL '3 days', 18, 9);

-- Post 9: Phone (Samsung)
INSERT INTO posts (user_id, title, content, category, price, location, images, specifications, created_at, likes_count, comments_count) VALUES
('550e8400-e29b-41d4-a716-446655440009', 'Samsung Galaxy S23 Ultra', 'Latest Samsung flagship. 512GB storage, pristine condition with warranty.', 'phones', 500000, 'Rosso', 
'["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"]'::jsonb,
'{"brand": "Samsung", "model": "Galaxy S23 Ultra", "storage": "512GB", "color": "Phantom Black", "condition": "Excellent"}'::jsonb,
NOW() - INTERVAL '2 days', 7, 4);

-- Post 10: Property - Villa for Rent
INSERT INTO posts (user_id, title, content, category, property_type, listing_type, price, location, amenities, images, specifications, created_at, likes_count, comments_count) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Luxury Villa for Rent', 'Stunning luxury villa with pool and garden. 5 bedrooms, modern design.', 'property', 'villa', 'rent', 150000, 'Boutilimit',
'["wifi", "parking", "ac", "kitchen"]'::jsonb,
'["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"]'::jsonb,
'{"bedrooms": 5, "bathrooms": 4, "size_sqft": 3500, "pool": true, "garden": true}'::jsonb,
NOW() - INTERVAL '1 day', 30, 20);

-- ════════════════════════════════════════════════════════════════════
-- 3. WALLET ACCOUNTS TABLE (10 accounts - one per user)
-- ════════════════════════════════════════════════════════════════════

INSERT INTO wallet_accounts (user_id, balance, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 50000, NOW() - INTERVAL '60 days', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 75000, NOW() - INTERVAL '55 days', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 120000, NOW() - INTERVAL '50 days', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 30000, NOW() - INTERVAL '45 days', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 95000, NOW() - INTERVAL '40 days', NOW()),
('550e8400-e29b-41d4-a716-446655440006', 200000, NOW() - INTERVAL '35 days', NOW()),
('550e8400-e29b-41d4-a716-446655440007', 45000, NOW() - INTERVAL '30 days', NOW()),
('550e8400-e29b-41d4-a716-446655440008', 80000, NOW() - INTERVAL '25 days', NOW()),
('550e8400-e29b-41d4-a716-446655440009', 150000, NOW() - INTERVAL '20 days', NOW()),
('550e8400-e29b-41d4-a716-446655440010', 60000, NOW() - INTERVAL '15 days', NOW());

-- ════════════════════════════════════════════════════════════════════
-- 4. SAVED POSTS TABLE (10 saved posts)
-- ════════════════════════════════════════════════════════════════════

INSERT INTO saved_posts (user_id, post_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM posts WHERE title LIKE 'iPhone 14 Pro%' LIMIT 1), NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM posts WHERE title LIKE 'MacBook Pro%' LIMIT 1), NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM posts WHERE title LIKE 'Sony 65"%' LIMIT 1), NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM posts WHERE title LIKE 'Toyota Camry%' LIMIT 1), NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM posts WHERE title LIKE 'Modern 3BR%' LIMIT 1), NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM posts WHERE title LIKE 'Beautiful Family%' LIMIT 1), NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM posts WHERE title LIKE 'Cozy 2BR%' LIMIT 1), NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM posts WHERE title LIKE 'Prime Land%' LIMIT 1), NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440009', (SELECT id FROM posts WHERE title LIKE 'Samsung Galaxy%' LIMIT 1), NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440010', (SELECT id FROM posts WHERE title LIKE 'Luxury Villa%' LIMIT 1), NOW() - INTERVAL '1 day');

-- ════════════════════════════════════════════════════════════════════
-- 5. PROPERTY REVIEWS TABLE (10 reviews)
-- ════════════════════════════════════════════════════════════════════

INSERT INTO property_reviews (post_id, user_id, rating, review_text, created_at) VALUES
((SELECT id FROM posts WHERE title LIKE 'Modern 3BR%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440001', 5, 'Amazing apartment! Great location and modern amenities. Highly recommend!', NOW() - INTERVAL '3 days'),
((SELECT id FROM posts WHERE title LIKE 'Beautiful Family%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440002', 4, 'Nice house with good space. A bit pricey but worth it for the location.', NOW() - INTERVAL '3 days'),
((SELECT id FROM posts WHERE title LIKE 'Cozy 2BR%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440003', 5, 'Perfect for a small family. Quiet neighborhood and friendly landlord.', NOW() - INTERVAL '2 days'),
((SELECT id FROM posts WHERE title LIKE 'Prime Land%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440004', 4, 'Good investment opportunity. Location is developing fast.', NOW() - INTERVAL '2 days'),
((SELECT id FROM posts WHERE title LIKE 'Luxury Villa%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440005', 5, 'Absolutely stunning! The pool and garden are beautiful. Dream home!', NOW() - INTERVAL '1 day'),
((SELECT id FROM posts WHERE title LIKE 'iPhone 14 Pro%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440006', 4, 'Great phone in excellent condition. Fast delivery and good communication.', NOW() - INTERVAL '5 days'),
((SELECT id FROM posts WHERE title LIKE 'MacBook Pro%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440007', 5, 'Perfect laptop for work. Like new condition as described.', NOW() - INTERVAL '4 days'),
((SELECT id FROM posts WHERE title LIKE 'Sony 65"%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440008', 5, 'Amazing picture quality! Still in warranty. Great deal!', NOW() - INTERVAL '4 days'),
((SELECT id FROM posts WHERE title LIKE 'Toyota Camry%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440009', 4, 'Reliable car, well maintained. Minor scratches but overall excellent.', NOW() - INTERVAL '3 days'),
((SELECT id FROM posts WHERE title LIKE 'Samsung Galaxy%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440010', 5, 'Latest model at great price. Battery life is amazing!', NOW() - INTERVAL '1 day');

-- ════════════════════════════════════════════════════════════════════
-- 6. WALLET TRANSACTIONS TABLE (10 transactions)
-- ════════════════════════════════════════════════════════════════════

INSERT INTO wallet_transactions (user_id, transaction_type, amount, description, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'deposit', 50000, 'Initial wallet deposit', NOW() - INTERVAL '55 days'),
('550e8400-e29b-41d4-a716-446655440002', 'deposit', 100000, 'Balance top-up via bank transfer', NOW() - INTERVAL '50 days'),
('550e8400-e29b-41d4-a716-446655440002', 'debit', -25000, 'Payment for listing promotion', NOW() - INTERVAL '48 days'),
('550e8400-e29b-41d4-a716-446655440003', 'deposit', 120000, 'Initial wallet funding', NOW() - INTERVAL '45 days'),
('550e8400-e29b-41d4-a716-446655440004', 'deposit', 30000, 'Top-up via credit card', NOW() - INTERVAL '40 days'),
('550e8400-e29b-41d4-a716-446655440005', 'deposit', 95000, 'Bank transfer deposit', NOW() - INTERVAL '35 days'),
('550e8400-e29b-41d4-a716-446655440006', 'deposit', 200000, 'Large deposit for multiple listings', NOW() - INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440007', 'deposit', 45000, 'Initial balance', NOW() - INTERVAL '25 days'),
('550e8400-e29b-41d4-a716-446655440008', 'deposit', 80000, 'Top-up request approved', NOW() - INTERVAL '20 days'),
('550e8400-e29b-41d4-a716-446655440009', 'deposit', 150000, 'Business account funding', NOW() - INTERVAL '15 days');

-- ════════════════════════════════════════════════════════════════════
-- 7. BALANCE REQUESTS TABLE (10 requests)
-- ════════════════════════════════════════════════════════════════════

INSERT INTO balance_requests (user_id, amount, status, proof_image_url, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 50000, 'approved', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', NOW() - INTERVAL '56 days', NOW() - INTERVAL '55 days'),
('550e8400-e29b-41d4-a716-446655440002', 100000, 'approved', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400', NOW() - INTERVAL '51 days', NOW() - INTERVAL '50 days'),
('550e8400-e29b-41d4-a716-446655440003', 120000, 'approved', 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400', NOW() - INTERVAL '46 days', NOW() - INTERVAL '45 days'),
('550e8400-e29b-41d4-a716-446655440004', 30000, 'approved', 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400', NOW() - INTERVAL '41 days', NOW() - INTERVAL '40 days'),
('550e8400-e29b-41d4-a716-446655440005', 95000, 'pending', 'https://images.unsplash.com/photo-1633158829875-e5316a358c6f?w=400', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440006', 200000, 'approved', 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400', NOW() - INTERVAL '31 days', NOW() - INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440007', 45000, 'approved', 'https://images.unsplash.com/photo-1559521783-1d1599583485?w=400', NOW() - INTERVAL '26 days', NOW() - INTERVAL '25 days'),
('550e8400-e29b-41d4-a716-446655440008', 80000, 'rejected', 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400', NOW() - INTERVAL '21 days', NOW() - INTERVAL '20 days'),
('550e8400-e29b-41d4-a716-446655440009', 150000, 'pending', 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=400', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440010', 60000, 'approved', 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=400', NOW() - INTERVAL '16 days', NOW() - INTERVAL '15 days');

-- ════════════════════════════════════════════════════════════════════
-- 8. PAYMENT REQUESTS TABLE (10 requests)
-- ════════════════════════════════════════════════════════════════════
-- Payment requests assigned to members for approval

INSERT INTO payment_requests (member_id, amount, description, requester_name, requester_id, status, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 50000, 'Supplier invoice payment for October delivery', 'Ahmed Hassan', '550e8400-e29b-41d4-a716-446655440005', 'pending', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440002', 120000, 'Equipment rental payment - November', 'Fatima Mohamed', '550e8400-e29b-41d4-a716-446655440006', 'pending', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440003', 75000, 'Marketing campaign invoice - Q4', 'Ibrahim Ali', '550e8400-e29b-41d4-a716-446655440007', 'approved', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440001', 200000, 'Office renovation contractor payment', 'Mariam Abdullah', '550e8400-e29b-41d4-a716-446655440008', 'pending', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440004', 30000, 'Monthly software subscription renewal', 'Omar Salem', '550e8400-e29b-41d4-a716-446655440009', 'approved', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440002', 95000, 'Consulting services payment - October', 'Aisha Mohammed', '550e8400-e29b-41d4-a716-446655440010', 'rejected', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days'),
('550e8400-e29b-41d4-a716-446655440005', 150000, 'Training program invoice - Q4', 'Hassan Omar', '550e8400-e29b-41d4-a716-446655440001', 'pending', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440003', 85000, 'Legal services retainer - November', 'Khadija Ahmed', '550e8400-e29b-41d4-a716-446655440002', 'approved', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440004', 60000, 'Utility bills payment - October', 'Youssef Ibrahim', '550e8400-e29b-41d4-a716-446655440003', 'pending', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440005', 110000, 'Insurance premium - Annual renewal', 'Zainab Hassan', '550e8400-e29b-41d4-a716-446655440004', 'pending', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days');

COMMIT;

-- ════════════════════════════════════════════════════════════════════
-- VERIFICATION QUERIES
-- ════════════════════════════════════════════════════════════════════
-- Run these to verify the data was inserted correctly

SELECT 'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Posts', COUNT(*) FROM posts
UNION ALL
SELECT 'Wallet Accounts', COUNT(*) FROM wallet_accounts
UNION ALL
SELECT 'Saved Posts', COUNT(*) FROM saved_posts
UNION ALL
SELECT 'Property Reviews', COUNT(*) FROM property_reviews
UNION ALL
SELECT 'Wallet Transactions', COUNT(*) FROM wallet_transactions
UNION ALL
SELECT 'Balance Requests', COUNT(*) FROM balance_requests
UNION ALL
SELECT 'Payment Requests', COUNT(*) FROM payment_requests;

-- Check that property posts have proper specifications
SELECT 
  title,
  category,
  property_type,
  listing_type,
  specifications->'nearby_amenities' as nearby_amenities,
  specifications->'land_size' as land_size
FROM posts
WHERE category = 'property'
ORDER BY created_at DESC;
