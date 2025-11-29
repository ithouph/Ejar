-- EJAR DATABASE SEED DATA
-- Insert dummy data for testing and development

-- 1. CITIES
INSERT INTO public.cities (id, name, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Nouakchott', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Atar', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Chinguetti', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Tidjikja', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Kaédi', NOW());

-- 2. USERS
INSERT INTO public.users (id, phone_number, first_name, last_name, full_name, age, profile_photo_url, whatsapp_number, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', '22212345678', 'Ahmed', 'Mohamed', 'Ahmed Mohamed', 28, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', '22212345678', NOW()),
('650e8400-e29b-41d4-a716-446655440002', '22287654321', 'Fatima', 'Ali', 'Fatima Ali', 26, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', '22287654321', NOW()),
('650e8400-e29b-41d4-a716-446655440003', '22298765432', 'Mohammed', 'Hassan', 'Mohammed Hassan', 32, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', '22298765432', NOW()),
('650e8400-e29b-41d4-a716-446655440004', '22256789012', 'Noor', 'Ibrahim', 'Noor Ibrahim', 24, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', '22256789012', NOW()),
('650e8400-e29b-41d4-a716-446655440005', '22289876543', 'Sara', 'Omar', 'Sara Omar', 30, 'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?w=100&h=100&fit=crop', '22289876543', NOW());

-- 3. WALLET ACCOUNTS
INSERT INTO public.wallet_accounts (id, user_id, balance, currency, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 5000, 'MRU', NOW()),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 12000, 'MRU', NOW()),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', 8500, 'MRU', NOW()),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', 3200, 'MRU', NOW()),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440005', 15000, 'MRU', NOW());

-- 4. POSTS (Properties, Electronics, Vehicles, Furniture)
INSERT INTO public.posts (id, user_id, title, description, category, listing_type, property_type, location, price, image_url, images, created_at) VALUES
-- Property Posts
('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Modern Apartment for Rent', '2 bedroom luxury apartment in downtown with AC and parking', 'property', 'rent', 'apartment', 'Nouakchott', 150000, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop'], NOW()),
('850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 'Beautiful Villa for Sale', 'Spacious 4 bedroom villa with garden and pool', 'property', 'buy', 'villa', 'Nouakchott', 2500000, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop'], NOW()),
('850e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', 'Land Plot for Investment', 'Prime location land in new development area', 'property', 'buy', 'land', 'Atar', 800000, 'https://images.unsplash.com/photo-1500595046891-0573cdc14d95?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1500595046891-0573cdc14d95?w=400&h=400&fit=crop'], NOW()),

-- Electronics
('850e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001', 'iPhone 14 Pro - Like New', 'Excellent condition, all accessories included', 'electronics', NULL, NULL, 'Nouakchott', 150000, 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop'], NOW()),
('850e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440002', 'MacBook Pro 16 inch', '2022 model, barely used, perfect for work', 'electronics', NULL, NULL, 'Nouakchott', 550000, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'], NOW()),
('850e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440003', 'Samsung 55 Smart TV', '4K Ultra HD, 2 years old, working perfectly', 'electronics', NULL, NULL, 'Nouakchott', 250000, 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop'], NOW()),

-- Vehicles
('850e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440001', 'Toyota Camry 2020', 'Well-maintained family car, low mileage', 'vehicles', NULL, NULL, 'Nouakchott', 850000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'], NOW()),
('850e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440004', 'Nissan Altima 2019', 'Automatic transmission, excellent condition', 'vehicles', NULL, NULL, 'Nouakchott', 750000, 'https://images.unsplash.com/photo-1609708536965-e82aa63172f0?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1609708536965-e82aa63172f0?w=400&h=400&fit=crop'], NOW()),

-- Furniture
('850e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440002', 'Designer Sofa', 'Modern grey sofa, perfect for living room', 'furniture', NULL, NULL, 'Nouakchott', 200000, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop'], NOW()),
('850e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440005', 'Dining Table Set', 'Wooden dining table with 6 chairs, barely used', 'furniture', NULL, NULL, 'Nouakchott', 350000, 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=400&h=400&fit=crop'], NOW());

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

-- 7. WALLET TRANSACTIONS
INSERT INTO public.wallet_transactions (id, wallet_id, type, amount, description, category, status, created_at) VALUES
('b50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'credit', 10000, 'Money added to wallet', 'topup', 'completed', NOW()),
('b50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'debit', 500, 'Posted an item (fee)', 'posting', 'completed', NOW()),
('b50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440002', 'credit', 20000, 'Money added to wallet', 'topup', 'completed', NOW()),
('b50e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440003', 'debit', 1000, 'Withdrawal', 'withdrawal', 'completed', NOW());

-- 8. SERVICE CATEGORIES
INSERT INTO public.service_categories (id, name, icon, description, active, created_at) VALUES
('c50e8400-e29b-41d4-a716-446655440001', 'Real Estate', 'home', 'Buy, sell, or rent properties', true, NOW()),
('c50e8400-e29b-41d4-a716-446655440002', 'Electronics', 'zap', 'Mobile phones, computers, and gadgets', true, NOW()),
('c50e8400-e29b-41d4-a716-446655440003', 'Vehicles', 'truck', 'Cars, motorcycles, and transportation', true, NOW()),
('c50e8400-e29b-41d4-a716-446655440004', 'Furniture', 'box', 'Household furniture and appliances', true, NOW()),
('c50e8400-e29b-41d4-a716-446655440005', 'Fashion', 'shopping-bag', 'Clothing and accessories', true, NOW());

-- 9. PAYMENT REQUESTS (Admin review examples)
INSERT INTO public.payment_requests (id, user_id, amount, status, payment_method, created_at) VALUES
('d50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 50000, 'pending', 'bank_transfer', NOW()),
('d50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 100000, 'approved', 'mobile_money', NOW());
