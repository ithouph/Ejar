-- EJAR DATABASE SEED DATA - COMPLETE TEST DATA
-- ═════════════════════════════════════════════════════════════════════
-- Phone number for login + WhatsApp phone + Post Limits + Member Status
-- Test Accounts:
--   22212345678 (Member - can approve payments) OTP: 0000
--   22287654321 (Regular User) OTP: 0000
--   22298765432 (Regular User) OTP: 0000
--   22256789012 (Regular User) OTP: 0000
--   22289876543 (Member - can approve payments) OTP: 0000
-- ═════════════════════════════════════════════════════════════════════

-- 1. USERS (Phone number + WhatsApp + Post Limits + Member Status + Hit Limit)
INSERT INTO public.users (id, phone_number, whatsapp_phone, post_limit, posts_count, is_member, hit_limit, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', '22212345678', '22212345678', 5, 4, true, false, NOW() - INTERVAL '30 days'),
('650e8400-e29b-41d4-a716-446655440002', '22287654321', '22287654321', 5, 3, false, false, NOW() - INTERVAL '25 days'),
('650e8400-e29b-41d4-a716-446655440003', '22298765432', '22298765432', 5, 2, false, true, NOW() - INTERVAL '20 days'),
('650e8400-e29b-41d4-a716-446655440004', '22256789012', '22256789012', 5, 1, false, false, NOW() - INTERVAL '15 days'),
('650e8400-e29b-41d4-a716-446655440005', '22289876543', '22289876543', 5, 3, true, false, NOW() - INTERVAL '10 days');

-- 2. WALLET ACCOUNTS (MRU Currency)
INSERT INTO public.wallet_accounts (id, user_id, balance, currency, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 25000, 'MRU', NOW() - INTERVAL '30 days'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 12000, 'MRU', NOW() - INTERVAL '25 days'),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', 8500, 'MRU', NOW() - INTERVAL '20 days'),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', 3200, 'MRU', NOW() - INTERVAL '15 days'),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440005', 35000, 'MRU', NOW() - INTERVAL '10 days');

-- 3. CITIES (13 Mauritanian Cities/Regions - Bilingual English/Arabic with codes)
INSERT INTO public.cities (id, name_en, name_ar, code, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Nouakchott', 'نواكشوط', 'NKC', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Dakhlet Nouadhibou', 'داخلت نواديبو', 'DNB', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Assaba', 'العصابة', 'ASB', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Gorgol', 'كوركول', 'GRG', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Brakna', 'البراكنة', 'BRK', NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'Trarza', 'الترارزة', 'TRZ', NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'Adrar', 'أدرار', 'ADR', NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'Tagant', 'تكانت', 'TAG', NOW()),
('550e8400-e29b-41d4-a716-446655440009', 'Guidimaka', 'كيديماغا', 'GDM', NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'Tiris Zemmour', 'تيرس زمور', 'TIZ', NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'Hodh Ech Chargui', 'الحوض الشرقي', 'HEC', NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'Hodh El Gharbi', 'الحوض الغربي', 'HEG', NOW()),
('550e8400-e29b-41d4-a716-446655440013', 'Inchiri', 'إينشيري', 'INC', NOW());

-- 4. POSTS (Properties, Electronics, Vehicles, Furniture with paid/approval status)
-- Note: category_id links to service_categories table
INSERT INTO public.posts (id, user_id, city_id, category_id, title, description, listing_type, property_type, price, image_url, images, amenities, specifications, is_paid, is_approved, payment_approved, hit_limit, likes_count, rating, total_reviews, created_at, updated_at) VALUES
-- Property Posts (category_id: c50e8400-e29b-41d4-a716-446655440001)
('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'c50e8400-e29b-41d4-a716-446655440001', 'Modern Apartment for Rent', '2 bedroom luxury apartment in downtown with AC and parking', 'rent', 'apartment', 150000, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop'], ARRAY['WiFi', 'Parking', 'AC'], '{"bedrooms": 2, "bathrooms": 1, "size": "120m2", "floor": 3}'::jsonb, true, true, true, false, 12, 4.5, 2, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'c50e8400-e29b-41d4-a716-446655440001', 'Beautiful Villa for Sale', 'Spacious 4 bedroom villa with garden and pool', 'buy', 'villa', 2500000, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop'], ARRAY['Pool', 'Garden', 'Garage'], '{"bedrooms": 4, "bathrooms": 3, "size": "450m2", "hasPool": true}'::jsonb, false, false, false, false, 0, 0, 0, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('850e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'c50e8400-e29b-41d4-a716-446655440001', 'Land Plot for Investment', 'Prime location land in new development area', 'buy', 'land', 800000, 'https://images.unsplash.com/photo-1500595046891-0573cdc14d95?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1500595046891-0573cdc14d95?w=400&h=400&fit=crop'], ARRAY[], '{"size": "1000m2", "zoned": "residential", "accessible": true}'::jsonb, true, true, true, false, 5, 0, 0, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),

-- Electronics (category_id: c50e8400-e29b-41d4-a716-446655440002)
('850e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'c50e8400-e29b-41d4-a716-446655440002', 'iPhone 14 Pro - Like New', 'Excellent condition, all accessories included', NULL, NULL, 150000, 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop'], ARRAY[], '{"model": "iPhone 14 Pro", "storage": "256GB", "color": "silver", "condition": "like-new"}'::jsonb, true, true, true, false, 8, 5, 1, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('850e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'c50e8400-e29b-41d4-a716-446655440002', 'MacBook Pro 16 inch', '2022 model, barely used, perfect for work', NULL, NULL, 550000, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'], ARRAY[], '{"model": "MacBook Pro 16", "year": 2022, "ram": "16GB", "storage": "512GB"}'::jsonb, false, false, false, true, 0, 0, 0, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('850e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'c50e8400-e29b-41d4-a716-446655440002', 'Samsung 55 Smart TV', '4K Ultra HD, 2 years old, working perfectly', NULL, NULL, 250000, 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop'], ARRAY[], '{"size": "55 inch", "resolution": "4K", "smartFeatures": true, "age": "2 years"}'::jsonb, true, true, true, false, 3, 0, 0, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Vehicles (category_id: c50e8400-e29b-41d4-a716-446655440003)
('850e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'c50e8400-e29b-41d4-a716-446655440003', 'Toyota Camry 2020', 'Well-maintained family car, low mileage', NULL, NULL, 850000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'], ARRAY[], '{"make": "Toyota", "model": "Camry", "year": 2020, "mileage": "45000km"}'::jsonb, false, false, false, false, 2, 4, 1, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('850e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'c50e8400-e29b-41d4-a716-446655440003', 'Nissan Altima 2019', 'Automatic transmission, excellent condition', NULL, NULL, 750000, 'https://images.unsplash.com/photo-1609708536965-e82aa63172f0?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1609708536965-e82aa63172f0?w=400&h=400&fit=crop'], ARRAY[], '{"make": "Nissan", "model": "Altima", "year": 2019, "transmission": "automatic"}'::jsonb, true, true, true, false, 6, 0, 0, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

-- Furniture (category_id: c50e8400-e29b-41d4-a716-446655440004)
('850e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'c50e8400-e29b-41d4-a716-446655440004', 'Designer Sofa', 'Modern grey sofa, perfect for living room', NULL, NULL, 200000, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop'], ARRAY[], '{"type": "sofa", "color": "grey", "material": "leather", "seats": 3}'::jsonb, false, false, false, false, 1, 0, 0, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
('850e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'c50e8400-e29b-41d4-a716-446655440004', 'Dining Table Set', 'Wooden dining table with 6 chairs, barely used', NULL, NULL, 350000, 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=400&h=400&fit=crop', ARRAY['https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=400&h=400&fit=crop'], ARRAY[], '{"type": "dining-set", "material": "wood", "seats": 6, "condition": "barely-used"}'::jsonb, true, true, true, false, 4, 0, 0, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

-- 5. REVIEWS
INSERT INTO public.reviews (id, user_id, post_id, rating, comment, created_at, updated_at) VALUES
('950e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', 5, 'Great apartment, very clean and safe location!', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('950e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440001', 4, 'Good apartment but a bit noisy at night', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('950e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440004', 5, 'iPhone is in perfect condition, highly recommend!', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('950e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440007', 4, 'Good car, reliable and efficient', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

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
-- Status: pending (awaiting member approval), approved (member approved), rejected (member denied)
INSERT INTO public.payment_requests (id, user_id, post_id, amount, status, payment_method, transaction_id, processed_by, admin_notes, rejection_reason, processed_at, created_at, updated_at) VALUES
-- PENDING PAYMENTS (awaiting member review)
('f50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', 5000, 'pending', 'bank_transfer', NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('f50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440005', 3000, 'pending', 'mobile_money', NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('f50e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440003', 2500, 'pending', 'bank_transfer', NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),

-- APPROVED PAYMENTS (member approved)
('f50e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 4500, 'approved', 'bank_transfer', 'TXN001', '650e8400-e29b-41d4-a716-446655440001', 'Approved - good quality images', NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),
('f50e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440004', 3500, 'approved', 'mobile_money', 'TXN002', '650e8400-e29b-41d4-a716-446655440005', 'Approved - excellent condition', NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days'),

-- REJECTED PAYMENTS (member denied)
('f50e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440009', 2000, 'rejected', 'bank_transfer', NULL, '650e8400-e29b-41d4-a716-446655440001', NULL, 'Images quality too low', NOW() - INTERVAL '7 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days');
