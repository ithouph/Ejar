-- EJAR DATABASE SEED DATA - SIMPLIFIED
-- Phone number for login + WhatsApp phone
-- With post approval system

-- 1. USERS (Phone number + WhatsApp + Post Limits)
INSERT INTO public.users (id, phone_number, whatsapp_phone, post_limit, posts_count, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', '22212345678', '22212345678', 5, 2, NOW()),
('650e8400-e29b-41d4-a716-446655440002', '22287654321', '22287654321', 5, 3, NOW()),
('650e8400-e29b-41d4-a716-446655440003', '22298765432', '22298765432', 5, 2, NOW()),
('650e8400-e29b-41d4-a716-446655440004', '22256789012', '22256789012', 5, 1, NOW()),
('650e8400-e29b-41d4-a716-446655440005', '22289876543', '22289876543', 5, 2, NOW());

-- 2. WALLET ACCOUNTS
INSERT INTO public.wallet_accounts (id, user_id, balance, currency, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 5000, 'MRU', NOW()),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 12000, 'MRU', NOW()),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', 8500, 'MRU', NOW()),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', 3200, 'MRU', NOW()),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440005', 15000, 'MRU', NOW());

-- 3. CITIES
INSERT INTO public.cities (id, name, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Nouakchott', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Atar', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Chinguetti', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Tidjikja', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Kaédi', NOW());

-- 4. POSTS (Properties, Electronics, Vehicles, Furniture with paid/approval status)
INSERT INTO public.posts (id, user_id, title, description, category, listing_type, property_type, location, price, image_url, images, amenities, specifications, is_paid, is_approved, payment_approved, hit_limit, created_at) VALUES
-- Property Posts
('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Modern Apartment for Rent', '2 bedroom luxury apartment in downtown with AC and parking', 'property', 'rent', 'apartment', 'Nouakchott', 150000, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop'], ARRAY['WiFi', 'Parking', 'AC'], '{"bedrooms": 2, "bathrooms": 1, "size": "120m2", "floor": 3}'::jsonb, true, true, true, false, NOW()),
('850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 'Beautiful Villa for Sale', 'Spacious 4 bedroom villa with garden and pool', 'property', 'buy', 'villa', 'Nouakchott', 2500000, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop'], ARRAY['Pool', 'Garden', 'Garage'], '{"bedrooms": 4, "bathrooms": 3, "size": "450m2", "hasPool": true}'::jsonb, false, false, false, false, NOW()),
('850e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', 'Land Plot for Investment', 'Prime location land in new development area', 'property', 'buy', 'land', 'Atar', 800000, 'https://images.unsplash.com/photo-1500595046891-0573cdc14d95?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1500595046891-0573cdc14d95?w=400&h=400&fit=crop'], ARRAY[], '{"size": "1000m2", "zoned": "residential", "accessible": true}'::jsonb, true, true, true, false, NOW()),

-- Electronics
('850e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001', 'iPhone 14 Pro - Like New', 'Excellent condition, all accessories included', 'electronics', NULL, NULL, 'Nouakchott', 150000, 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop'], ARRAY[], '{"model": "iPhone 14 Pro", "storage": "256GB", "color": "silver", "condition": "like-new"}'::jsonb, true, true, true, false, NOW()),
('850e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440002', 'MacBook Pro 16 inch', '2022 model, barely used, perfect for work', 'electronics', NULL, NULL, 'Nouakchott', 550000, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'], ARRAY[], '{"model": "MacBook Pro 16", "year": 2022, "ram": "16GB", "storage": "512GB"}'::jsonb, false, false, false, true, NOW()),
('850e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440003', 'Samsung 55 Smart TV', '4K Ultra HD, 2 years old, working perfectly', 'electronics', NULL, NULL, 'Nouakchott', 250000, 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop'], ARRAY[], '{"size": "55 inch", "resolution": "4K", "smartFeatures": true, "age": "2 years"}'::jsonb, true, true, true, false, NOW()),

-- Vehicles
('850e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440001', 'Toyota Camry 2020', 'Well-maintained family car, low mileage', 'vehicles', NULL, NULL, 'Nouakchott', 850000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'], ARRAY[], '{"make": "Toyota", "model": "Camry", "year": 2020, "mileage": "45000km"}'::jsonb, false, false, false, false, NOW()),
('850e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440004', 'Nissan Altima 2019', 'Automatic transmission, excellent condition', 'vehicles', NULL, NULL, 'Nouakchott', 750000, 'https://images.unsplash.com/photo-1609708536965-e82aa63172f0?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1609708536965-e82aa63172f0?w=400&h=400&fit=crop'], ARRAY[], '{"make": "Nissan", "model": "Altima", "year": 2019, "transmission": "automatic"}'::jsonb, true, true, true, false, NOW()),

-- Furniture
('850e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440002', 'Designer Sofa', 'Modern grey sofa, perfect for living room', 'furniture', NULL, NULL, 'Nouakchott', 200000, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop'], ARRAY[], '{"type": "sofa", "color": "grey", "material": "leather", "seats": 3}'::jsonb, false, false, false, false, NOW()),
('850e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440005', 'Dining Table Set', 'Wooden dining table with 6 chairs, barely used', 'furniture', NULL, NULL, 'Nouakchott', 350000, 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=400&h=400&fit=crop'], ARRAY[], '{"type": "dining-set", "material": "wood", "seats": 6, "condition": "barely-used"}'::jsonb, true, true, true, false, NOW());

-- 5. REVIEWS
INSERT INTO public.reviews (id, user_id, post_id, rating, comment, created_at) VALUES
('950e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', 5, 'Great apartment, very clean and safe location!', NOW()),
('950e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440001', 4, 'Good apartment but a bit noisy at night', NOW()),
('950e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440004', 5, 'iPhone is in perfect condition, highly recommend!', NOW()),
('950e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440007', 4, 'Good car, reliable and efficient', NOW());

-- 6. SAVED POSTS
INSERT INTO public.saved_posts (id, user_id, post_id, created_at) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440002', NOW()),
('a50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440004', NOW()),
('a50e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440007', NOW()),
('a50e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440009', NOW());

-- 7. FAVORITES
INSERT INTO public.favorites (id, user_id, post_id, created_at) VALUES
('d50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440002', NOW()),
('d50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440004', NOW()),
('d50e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440001', NOW()),
('d50e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440009', NOW());

-- 8. WALLET TRANSACTIONS
INSERT INTO public.wallet_transactions (id, wallet_id, type, amount, description, category, status, created_at) VALUES
('b50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'credit', 10000, 'Money added to wallet', 'topup', 'completed', NOW()),
('b50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'debit', 500, 'Posted an item (fee)', 'posting', 'completed', NOW()),
('b50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440002', 'credit', 20000, 'Money added to wallet', 'topup', 'completed', NOW()),
('b50e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440003', 'debit', 1000, 'Withdrawal', 'withdrawal', 'completed', NOW());

-- 9. SERVICE CATEGORIES
INSERT INTO public.service_categories (id, name, icon, description, active, created_at) VALUES
('c50e8400-e29b-41d4-a716-446655440001', 'Real Estate', 'home', 'Buy, sell, or rent properties', true, NOW()),
('c50e8400-e29b-41d4-a716-446655440002', 'Electronics', 'zap', 'Mobile phones, computers, and gadgets', true, NOW()),
('c50e8400-e29b-41d4-a716-446655440003', 'Vehicles', 'truck', 'Cars, motorcycles, and transportation', true, NOW()),
('c50e8400-e29b-41d4-a716-446655440004', 'Furniture', 'box', 'Household furniture and appliances', true, NOW());

-- 10. PAYMENT REQUESTS (Post approval system)
INSERT INTO public.payment_requests (id, user_id, post_id, amount, status, payment_method, created_at) VALUES
('f50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', 5000, 'pending', 'bank_transfer', NOW()),
('f50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440005', 3000, 'pending', 'mobile_money', NOW());
