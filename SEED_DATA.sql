-- ═══════════════════════════════════════════════════════════════════
-- EJAR APP - COMPREHENSIVE DUMMY DATA SEED SCRIPT
-- ═══════════════════════════════════════════════════════════════════
-- This script populates all tables defined in database_setup_clean.sql
-- and includes additional columns required by the application logic.
-- 
-- TABLES POPULATED:
-- 1. users
-- 2. wallet_accounts
-- 3. service_categories
-- 4. cities
-- 5. posts (Properties, Cars, Electronics)
-- 6. posts_photos
-- 7. reviews
-- 8. favorites
-- 9. wallet_transactions
-- 10. payment_requests
-- 11. support_messages
-- ═══════════════════════════════════════════════════════════════════

-- 1. USERS
-- Creating 5 dummy users
INSERT INTO users (id, email, full_name, mobile, photo_url, google_id)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'alice@example.com', 'Alice Johnson', '+15550101', 'https://i.pravatar.cc/150?u=alice', 'google_alice'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'bob@example.com', 'Bob Smith', '+15550102', 'https://i.pravatar.cc/150?u=bob', 'google_bob'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'charlie@example.com', 'Charlie Brown', '+15550103', 'https://i.pravatar.cc/150?u=charlie', 'google_charlie'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'diana@example.com', 'Diana Prince', '+15550104', 'https://i.pravatar.cc/150?u=diana', 'google_diana'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'evan@example.com', 'Evan Wright', '+15550105', 'https://i.pravatar.cc/150?u=evan', 'google_evan')
ON CONFLICT (email) DO NOTHING;

-- 2. WALLET ACCOUNTS
-- Creating wallets for each user
INSERT INTO wallet_accounts (id, user_id, balance, currency)
VALUES
  (gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1500.00, 'MRU'),
  (gen_random_uuid(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 250.50, 'MRU'),
  (gen_random_uuid(), 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 0.00, 'MRU'),
  (gen_random_uuid(), 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 5000.00, 'MRU'),
  (gen_random_uuid(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 75.00, 'MRU')
ON CONFLICT (user_id) DO NOTHING;

-- 3. SERVICE CATEGORIES
INSERT INTO service_categories (name, icon, description, active)
VALUES
  ('Property', 'home', 'Apartments, Villas, and Lands', true),
  ('Cars', 'truck', 'Sedans, SUVs, and Luxury Cars', true),
  ('Phones', 'smartphone', 'Mobile Phones and Accessories', true),
  ('Laptops', 'monitor', 'Laptops and Computers', true),
  ('Electronics', 'cpu', 'Cameras, Audio, and Gadgets', true)
ON CONFLICT DO NOTHING; -- Assuming name constraint or just skip

-- 4. CITIES
INSERT INTO cities (name)
VALUES
  ('Nouakchott'),
  ('Nouadhibou'),
  ('Kiffa'),
  ('Rosso'),
  ('Zouerat')
ON CONFLICT DO NOTHING;

-- 5. POSTS
-- Inserting a mix of Property, Cars, and Electronics
-- Note: Assuming columns 'category', 'listing_type', 'price', 'images', 'specifications', 'amenities' exist in the target DB
-- as they are used by the app, even if missing from database_setup_clean.sql.

INSERT INTO posts (
  id, user_id, title, description, type, category, listing_type, 
  location, price, images, specifications, amenities, 
  likes_count, rating, total_reviews
)
VALUES
  -- POST 1: Property (Rent)
  (
    gen_random_uuid(), 
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Alice
    'Luxury Apartment in Tevragh Zeina', 
    'Spacious 3-bedroom apartment with modern amenities, located in the heart of the city. Close to supermarkets and embassies.', 
    'Apartment', -- type (legacy)
    'property', -- category
    'rent', -- listing_type
    'Tevragh Zeina, Nouakchott', 
    15000, 
    ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'], 
    '{"bedrooms": 3, "bathrooms": 2, "size_sqft": 1500, "furnished": "Yes", "property_type": "apartment", "monthly_rent": 15000, "deposit": 30000}'::jsonb, 
    ARRAY['WiFi', 'AC', 'Parking', 'Security'], 
    12, 4.5, 3
  ),
  -- POST 2: Car (Sell)
  (
    gen_random_uuid(), 
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', -- Bob
    'Toyota Land Cruiser 2022', 
    'Pristine condition, low mileage. Full option V8. Maintained at dealership.', 
    'Car', 
    'cars', 
    'sell', 
    'Nouadhibou', 
    2500000, 
    ARRAY['https://images.unsplash.com/photo-1594502184342-28ef379c3c27', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf'], 
    '{"make": "Toyota", "model": "Land Cruiser", "year": 2022, "mileage": "15000 km", "fuel_type": "Petrol", "gear_type": "Automatic", "color": "White"}'::jsonb, 
    ARRAY['GPS', 'Leather Seats', 'Sunroof'], 
    45, 5.0, 8
  ),
  -- POST 3: Phone (Sell)
  (
    gen_random_uuid(), 
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', -- Charlie
    'iPhone 14 Pro Max - 256GB', 
    'Deep Purple, barely used. Comes with box and original cable. Battery health 98%.', 
    'Electronics', 
    'phones', 
    'sell', 
    'Kiffa', 
    45000, 
    ARRAY['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb', 'https://images.unsplash.com/photo-1696446701796-da61225697cc'], 
    '{"brand": "Apple", "model": "iPhone 14 Pro Max", "storage": "256GB", "condition": "Used - Like New", "battery_health": "98%"}'::jsonb, 
    ARRAY['Warranty'], 
    5, 4.0, 1
  ),
  -- POST 4: Property (Sell)
  (
    gen_random_uuid(), 
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', -- Diana
    'Modern Villa with Pool', 
    'Beautiful 5-bedroom villa with private swimming pool and garden. Quiet neighborhood.', 
    'Villa', 
    'property', 
    'sell', 
    'Las Palmas, Nouakchott', 
    12000000, 
    ARRAY['https://images.unsplash.com/photo-1613977257377-23b77defcd3b', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d'], 
    '{"bedrooms": 5, "bathrooms": 4, "size_sqft": 4000, "property_type": "villa", "property_age": "2020"}'::jsonb, 
    ARRAY['Pool', 'Garden', 'Garage', 'Maid Room'], 
    89, 4.8, 15
  ),
  -- POST 5: Laptop (Sell)
  (
    gen_random_uuid(), 
    'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', -- Evan
    'MacBook Air M2', 
    'Midnight color, 8GB RAM, 256GB SSD. Perfect for students.', 
    'Electronics', 
    'laptops', 
    'sell', 
    'Rosso', 
    38000, 
    ARRAY['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9'], 
    '{"brand": "Apple", "model": "MacBook Air M2", "ram": "8GB", "storage": "256GB", "condition": "New"}'::jsonb, 
    ARRAY['Warranty'], 
    8, 0, 0
  );

-- 6. POST PHOTOS (Populating separate table if needed, though 'images' array in posts is often used)
-- Syncing with posts table for completeness
INSERT INTO posts_photos (post_id, url, category, order_index)
SELECT id, unnest(images), 'Main', 0
FROM posts;

-- 7. REVIEWS
INSERT INTO reviews (id, post_id, user_id, rating, comment)
SELECT
  gen_random_uuid(),
  p.id,
  u.id,
  floor(random() * 2 + 4)::int, -- Rating 4 or 5
  'Great item! Highly recommended.'
FROM posts p
CROSS JOIN users u
WHERE random() < 0.3 -- Randomly assign reviews
ON CONFLICT DO NOTHING;

-- 8. FAVORITES
INSERT INTO favorites (id, post_id, user_id)
SELECT
  gen_random_uuid(),
  p.id,
  u.id
FROM posts p
CROSS JOIN users u
WHERE random() < 0.2 -- Randomly assign favorites
ON CONFLICT DO NOTHING;

-- 9. WALLET TRANSACTIONS
INSERT INTO wallet_transactions (id, wallet_id, type, amount, description, category, status)
SELECT
  gen_random_uuid(),
  w.id,
  'credit',
  1000.00,
  'Initial Deposit',
  'deposit',
  'completed'
FROM wallet_accounts w;

-- 10. PAYMENT REQUESTS
INSERT INTO payment_requests (id, user_id, amount, status, payment_method, transaction_id)
VALUES
  (gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 500.00, 'pending', 'Bank Transfer', 'TXN123456'),
  (gen_random_uuid(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 1000.00, 'approved', 'Bankily', 'TXN789012');

-- 11. SUPPORT MESSAGES
INSERT INTO support_messages (id, user_id, payment_request_id, message, sender_type)
SELECT
  gen_random_uuid(),
  user_id,
  id,
  'I have transferred the amount, please check.',
  'user'
FROM payment_requests
WHERE status = 'pending';

-- 12. SAVED POSTS
INSERT INTO saved_posts (id, user_id, post_id)
SELECT
  gen_random_uuid(),
  u.id,
  p.id
FROM posts p
CROSS JOIN users u
WHERE random() < 0.15 -- Randomly save posts
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════
-- VERIFICATION
-- ═══════════════════════════════════════════════════════════════════
SELECT 'Users' as table_name, count(*) FROM users
UNION ALL
SELECT 'Posts', count(*) FROM posts
UNION ALL
SELECT 'Reviews', count(*) FROM reviews
UNION ALL
SELECT 'Wallets', count(*) FROM wallet_accounts
UNION ALL
SELECT 'Saved Posts', count(*) FROM saved_posts;
