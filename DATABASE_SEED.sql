-- ============================================
-- EJAR MARKETPLACE - COMPLETE SEED DATA
-- Run this after DATABASE_SETUP.sql
-- ============================================

-- ============================================
-- 1. CITIES (Mauritanian Cities)
-- ============================================
INSERT INTO cities (id, name, region) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Nouakchott', 'Nouakchott'),
  ('11111111-1111-1111-1111-111111111102', 'Nouadhibou', 'Dakhlet Nouadhibou'),
  ('11111111-1111-1111-1111-111111111103', 'Kiffa', 'Assaba'),
  ('11111111-1111-1111-1111-111111111104', 'Kaédi', 'Gorgol'),
  ('11111111-1111-1111-1111-111111111105', 'Rosso', 'Trarza'),
  ('11111111-1111-1111-1111-111111111106', 'Zouérat', 'Tiris Zemmour'),
  ('11111111-1111-1111-1111-111111111107', 'Atar', 'Adrar'),
  ('11111111-1111-1111-1111-111111111108', 'Néma', 'Hodh Ech Chargui'),
  ('11111111-1111-1111-1111-111111111109', 'Sélibaby', 'Guidimaka'),
  ('11111111-1111-1111-1111-111111111110', 'Aleg', 'Brakna')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. SERVICE CATEGORIES
-- ============================================
INSERT INTO service_categories (id, name, slug, type, description, metadata) VALUES
  ('22222222-2222-2222-2222-222222222201', 'Property', 'property', 'property', 'Real estate listings', '{"icon": "home", "sort_order": 1}'),
  ('22222222-2222-2222-2222-222222222202', 'Phones', 'phones', 'electronics', 'Mobile phones and accessories', '{"icon": "smartphone", "sort_order": 2}'),
  ('22222222-2222-2222-2222-222222222203', 'Laptops', 'laptops', 'electronics', 'Laptops and notebooks', '{"icon": "monitor", "sort_order": 3}'),
  ('22222222-2222-2222-2222-222222222204', 'Electronics', 'electronics', 'electronics', 'TVs, cameras, audio equipment', '{"icon": "zap", "sort_order": 4}'),
  ('22222222-2222-2222-2222-222222222205', 'Cars', 'cars', 'vehicles', 'Cars and automobiles', '{"icon": "truck", "sort_order": 5}'),
  ('22222222-2222-2222-2222-222222222206', 'Motorcycles', 'motorcycles', 'vehicles', 'Motorcycles and scooters', '{"icon": "navigation", "sort_order": 6}'),
  ('22222222-2222-2222-2222-222222222207', 'Furniture', 'furniture', 'home', 'Home and office furniture', '{"icon": "box", "sort_order": 7}'),
  ('22222222-2222-2222-2222-222222222208', 'Services', 'services', 'services', 'Professional services', '{"icon": "briefcase", "sort_order": 8}')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. LISTING TYPES
-- ============================================
INSERT INTO listing_types (id, name, slug, icon, sort_order, is_active) VALUES
  ('33333333-3333-3333-3333-333333333301', 'For Rent', 'rent', 'key', 1, true),
  ('33333333-3333-3333-3333-333333333302', 'For Sale', 'sale', 'tag', 2, true),
  ('33333333-3333-3333-3333-333333333303', 'Short-Term', 'short-term', 'clock', 3, true),
  ('33333333-3333-3333-3333-333333333304', 'Daily Rental', 'daily', 'calendar', 4, true),
  ('33333333-3333-3333-3333-333333333305', 'Lease to Own', 'lease-to-own', 'home', 5, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. PROPERTY TYPES
-- ============================================
INSERT INTO property_types (id, name, slug, icon, sort_order, is_active) VALUES
  ('44444444-4444-4444-4444-444444444401', 'Apartment', 'apartment', 'home', 1, true),
  ('44444444-4444-4444-4444-444444444402', 'House', 'house', 'home', 2, true),
  ('44444444-4444-4444-4444-444444444403', 'Villa', 'villa', 'home', 3, true),
  ('44444444-4444-4444-4444-444444444404', 'Land', 'land', 'map', 4, true),
  ('44444444-4444-4444-4444-444444444405', 'Shop', 'shop', 'shopping-bag', 5, true),
  ('44444444-4444-4444-4444-444444444406', 'Office', 'office', 'briefcase', 6, true),
  ('44444444-4444-4444-4444-444444444407', 'Warehouse', 'warehouse', 'package', 7, true),
  ('44444444-4444-4444-4444-444444444408', 'Studio', 'studio', 'home', 8, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. AMENITIES
-- ============================================
INSERT INTO amenities (id, name, slug, icon, category, sort_order, is_active) VALUES
  -- Indoor Amenities
  ('55555555-5555-5555-5555-555555555501', 'Wi-Fi', 'wifi', 'wifi', 'indoor', 1, true),
  ('55555555-5555-5555-5555-555555555502', 'Air Conditioning', 'ac', 'wind', 'indoor', 2, true),
  ('55555555-5555-5555-5555-555555555503', 'Parking', 'parking', 'truck', 'indoor', 3, true),
  ('55555555-5555-5555-5555-555555555504', 'Kitchen', 'kitchen', 'coffee', 'indoor', 4, true),
  ('55555555-5555-5555-5555-555555555505', 'Furnished', 'furnished', 'box', 'indoor', 5, true),
  ('55555555-5555-5555-5555-555555555506', 'Water Tank', 'water-tank', 'droplet', 'indoor', 6, true),
  ('55555555-5555-5555-5555-555555555507', 'Generator', 'generator', 'zap', 'indoor', 7, true),
  ('55555555-5555-5555-5555-555555555508', 'Security', 'security', 'shield', 'indoor', 8, true),
  ('55555555-5555-5555-5555-555555555509', 'Elevator', 'elevator', 'arrow-up', 'indoor', 9, true),
  ('55555555-5555-5555-5555-555555555510', 'Garden', 'garden', 'sun', 'indoor', 10, true),
  -- Nearby Amenities
  ('55555555-5555-5555-5555-555555555511', 'Mosque', 'mosque', 'map-pin', 'nearby', 1, true),
  ('55555555-5555-5555-5555-555555555512', 'School', 'school', 'book', 'nearby', 2, true),
  ('55555555-5555-5555-5555-555555555513', 'Hospital', 'hospital', 'plus', 'nearby', 3, true),
  ('55555555-5555-5555-5555-555555555514', 'Supermarket', 'supermarket', 'shopping-cart', 'nearby', 4, true),
  ('55555555-5555-5555-5555-555555555515', 'Restaurant', 'restaurant', 'coffee', 'nearby', 5, true),
  ('55555555-5555-5555-5555-555555555516', 'Bank', 'bank', 'dollar-sign', 'nearby', 6, true),
  ('55555555-5555-5555-5555-555555555517', 'Gym', 'gym', 'activity', 'nearby', 7, true),
  ('55555555-5555-5555-5555-555555555518', 'Pharmacy', 'pharmacy', 'heart', 'nearby', 8, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. CATEGORY FIELDS (Dynamic Form Fields)
-- ============================================
INSERT INTO category_fields (id, category_id, field_name, field_type, field_label, is_required, options, sort_order) VALUES
  -- Property fields
  ('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222201', 'bedrooms', 'number', 'Bedrooms', true, NULL, 1),
  ('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222201', 'bathrooms', 'number', 'Bathrooms', true, NULL, 2),
  ('66666666-6666-6666-6666-666666666603', '22222222-2222-2222-2222-222222222201', 'area_sqm', 'number', 'Area (sqm)', false, NULL, 3),
  ('66666666-6666-6666-6666-666666666604', '22222222-2222-2222-2222-222222222201', 'floor', 'number', 'Floor Number', false, NULL, 4),
  -- Phone fields
  ('66666666-6666-6666-6666-666666666610', '22222222-2222-2222-2222-222222222202', 'brand', 'text', 'Brand', true, NULL, 1),
  ('66666666-6666-6666-6666-666666666611', '22222222-2222-2222-2222-222222222202', 'model', 'text', 'Model', true, NULL, 2),
  ('66666666-6666-6666-6666-666666666612', '22222222-2222-2222-2222-222222222202', 'storage', 'select', 'Storage', true, '["64GB", "128GB", "256GB", "512GB", "1TB"]', 3),
  ('66666666-6666-6666-6666-666666666613', '22222222-2222-2222-2222-222222222202', 'condition', 'select', 'Condition', true, '["Excellent", "Good", "Fair", "Poor"]', 4),
  -- Car fields
  ('66666666-6666-6666-6666-666666666620', '22222222-2222-2222-2222-222222222205', 'year', 'number', 'Year', true, NULL, 1),
  ('66666666-6666-6666-6666-666666666621', '22222222-2222-2222-2222-222222222205', 'mileage', 'number', 'Mileage (km)', true, NULL, 2),
  ('66666666-6666-6666-6666-666666666622', '22222222-2222-2222-2222-222222222205', 'fuel_type', 'select', 'Fuel Type', true, '["Petrol", "Diesel", "Electric", "Hybrid"]', 3),
  ('66666666-6666-6666-6666-666666666623', '22222222-2222-2222-2222-222222222205', 'gear_type', 'select', 'Transmission', true, '["Automatic", "Manual"]', 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. USERS (All Roles)
-- ============================================
INSERT INTO users (id, phone, first_name, last_name, city_id, whatsapp_number, role, wallet_balance_mru, free_posts_remaining, free_posts_used, total_posts, total_approvals, total_reports_received) VALUES
  -- Leader
  ('77777777-7777-7777-7777-777777777701', '+22212345001', 'Mohamed', 'Ould Ahmed', '11111111-1111-1111-1111-111111111101', '+22212345001', 'leader', 50000.00, 5, 0, 0, 0, 0),
  -- Members (different cities)
  ('77777777-7777-7777-7777-777777777702', '+22212345002', 'Fatima', 'Mint Ali', '11111111-1111-1111-1111-111111111101', '+22212345002', 'member', 15000.00, 0, 5, 12, 45, 1),
  ('77777777-7777-7777-7777-777777777703', '+22212345003', 'Ahmed', 'Ould Sidi', '11111111-1111-1111-1111-111111111102', '+22212345003', 'member', 8500.00, 0, 5, 8, 23, 0),
  ('77777777-7777-7777-7777-777777777704', '+22212345004', 'Aisha', 'Mint Mohamed', '11111111-1111-1111-1111-111111111103', '+22212345004', 'member', 3200.00, 0, 5, 5, 12, 0),
  -- Ex-Members
  ('77777777-7777-7777-7777-777777777705', '+22212345005', 'Ibrahim', 'Ould Cheikh', '11111111-1111-1111-1111-111111111101', '+22212345005', 'ex_member', 2500.00, 0, 5, 15, 0, 2),
  ('77777777-7777-7777-7777-777777777706', '+22212345006', 'Mariam', 'Mint Abdallah', '11111111-1111-1111-1111-111111111102', '+22212345006', 'ex_member', 1800.00, 0, 5, 7, 0, 0),
  -- Normal Users (various states)
  ('77777777-7777-7777-7777-777777777707', '+22212345007', 'Oumar', 'Diallo', '11111111-1111-1111-1111-111111111101', '+22212345007', 'normal', 500.00, 3, 2, 2, 0, 0),
  ('77777777-7777-7777-7777-777777777708', '+22212345008', 'Aminata', 'Ba', '11111111-1111-1111-1111-111111111101', '+22212345008', 'normal', 1200.00, 0, 5, 7, 0, 0),
  ('77777777-7777-7777-7777-777777777709', '+22212345009', 'Sidi', 'Ould Brahim', '11111111-1111-1111-1111-111111111102', '+22212345009', 'normal', 3000.00, 5, 0, 0, 0, 0),
  ('77777777-7777-7777-7777-777777777710', '+22212345010', 'Khadija', 'Mint Salem', '11111111-1111-1111-1111-111111111103', '+22212345010', 'normal', 150.00, 1, 4, 4, 0, 0),
  ('77777777-7777-7777-7777-777777777711', '+22212345011', 'Moussa', 'Kane', '11111111-1111-1111-1111-111111111104', '+22212345011', 'normal', 0.00, 5, 0, 0, 0, 0),
  ('77777777-7777-7777-7777-777777777712', '+22212345012', 'Zeinab', 'Mint Ely', '11111111-1111-1111-1111-111111111101', '+22212345012', 'normal', 750.00, 2, 3, 3, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. POSTS (Various states)
-- ============================================
INSERT INTO posts (id, display_id, user_id, city_id, category_id, title, description, price, images, status, paid, was_free_post, post_cost_mru, listing_type, specifications, total_favorites) VALUES
  -- Active paid posts
  ('88888888-8888-8888-8888-888888888801', 'EJ-001', '77777777-7777-7777-7777-777777777702', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', 'Modern 3BR Apartment in Tevragh Zeina', 'Spacious apartment with AC, parking, and 24/7 security. Close to shops and restaurants. Newly renovated with modern finishes.', 150000.00, '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]', 'active', true, false, 10.00, 'rent', '{"bedrooms": 3, "bathrooms": 2, "area_sqm": 120, "floor": 2}', 24),
  ('88888888-8888-8888-8888-888888888802', 'EJ-002', '77777777-7777-7777-7777-777777777702', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', 'Villa with Garden in Ksar', 'Beautiful villa with 4 bedrooms, large garden, and modern kitchen. Perfect for families. Quiet neighborhood.', 350000.00, '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"]', 'active', true, true, 0.00, 'sale', '{"bedrooms": 4, "bathrooms": 3, "area_sqm": 280, "floor": 0}', 45),
  ('88888888-8888-8888-8888-888888888803', 'EJ-003', '77777777-7777-7777-7777-777777777703', '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222202', 'iPhone 14 Pro Max 256GB', 'Like new condition, with original box and accessories. Battery health 98%. No scratches or dents.', 85000.00, '["https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800"]', 'active', true, false, 10.00, 'sale', '{"brand": "Apple", "model": "iPhone 14 Pro Max", "storage": "256GB", "condition": "Excellent"}', 18),
  ('88888888-8888-8888-8888-888888888804', 'EJ-004', '77777777-7777-7777-7777-777777777707', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222205', 'Toyota Camry 2020', 'Well maintained, low mileage, full service history. AC, power windows, leather seats. Single owner.', 1200000.00, '["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"]', 'active', true, true, 0.00, 'sale', '{"year": 2020, "mileage": 45000, "fuel_type": "Petrol", "gear_type": "Automatic", "condition": "Excellent"}', 32),
  ('88888888-8888-8888-8888-888888888805', 'EJ-005', '77777777-7777-7777-7777-777777777708', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222203', 'MacBook Pro M2 2023', 'Perfect condition, barely used. 16GB RAM, 512GB SSD. Includes charger and original box.', 120000.00, '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"]', 'active', true, false, 10.00, 'sale', '{"brand": "Apple", "model": "MacBook Pro M2", "ram": "16GB", "storage": "512GB", "condition": "Excellent"}', 15),
  ('88888888-8888-8888-8888-888888888806', 'EJ-006', '77777777-7777-7777-7777-777777777704', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222201', 'Office Space in Kiffa Center', 'Prime location office space, 80sqm with reception area. Air conditioned, furnished optional.', 45000.00, '["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"]', 'active', true, true, 0.00, 'rent', '{"area_sqm": 80, "floor": 1}', 8),
  ('88888888-8888-8888-8888-888888888807', 'EJ-007', '77777777-7777-7777-7777-777777777712', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222204', 'Samsung 65" Smart TV', '4K UHD Smart TV, 2022 model. Perfect condition with wall mount included. Remote and original box.', 35000.00, '["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800"]', 'active', true, true, 0.00, 'sale', '{"brand": "Samsung", "model": "65\" 4K UHD", "condition": "Excellent"}', 11),
  -- Pending posts (not yet reviewed)
  ('88888888-8888-8888-8888-888888888808', 'EJ-008', '77777777-7777-7777-7777-777777777710', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222202', 'Samsung Galaxy S23 Ultra', 'Brand new sealed box. 512GB storage, Phantom Black color.', 75000.00, '["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"]', 'pending', true, false, 10.00, 'sale', '{"brand": "Samsung", "model": "Galaxy S23 Ultra", "storage": "512GB", "condition": "Excellent"}', 0),
  -- Inactive/deleted posts
  ('88888888-8888-8888-8888-888888888809', 'EJ-009', '77777777-7777-7777-7777-777777777705', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', 'Studio Apartment - SOLD', 'Cozy studio in central location. Great for singles or couples.', 80000.00, '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]', 'deleted', true, true, 0.00, 'rent', '{"bedrooms": 0, "bathrooms": 1, "area_sqm": 35}', 5),
  -- More active posts for variety
  ('88888888-8888-8888-8888-888888888810', 'EJ-010', '77777777-7777-7777-7777-777777777703', '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222201', 'Beachfront Villa in Nouadhibou', 'Stunning ocean views, 5 bedrooms, private beach access. Ideal for vacation rental.', 500000.00, '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"]', 'active', true, false, 10.00, 'sale', '{"bedrooms": 5, "bathrooms": 4, "area_sqm": 350}', 67),
  ('88888888-8888-8888-8888-888888888811', 'EJ-011', '77777777-7777-7777-7777-777777777708', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222206', 'Honda CBR 600RR 2019', 'Sport motorcycle in excellent condition. Low mileage, well maintained.', 180000.00, '["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800"]', 'active', true, false, 10.00, 'sale', '{"year": 2019, "mileage": 12000, "condition": "Excellent"}', 22),
  ('88888888-8888-8888-8888-888888888812', 'EJ-012', '77777777-7777-7777-7777-777777777702', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222207', 'Complete Living Room Set', 'Modern sofa set with coffee table and TV stand. Excellent condition, 2 years old.', 45000.00, '["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"]', 'active', true, false, 10.00, 'sale', '{"condition": "Good"}', 9)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 9. POST AMENITIES
-- ============================================
INSERT INTO post_amenities (post_id, amenity_id) VALUES
  -- Apartment in Tevragh Zeina
  ('88888888-8888-8888-8888-888888888801', '55555555-5555-5555-5555-555555555501'),
  ('88888888-8888-8888-8888-888888888801', '55555555-5555-5555-5555-555555555502'),
  ('88888888-8888-8888-8888-888888888801', '55555555-5555-5555-5555-555555555503'),
  ('88888888-8888-8888-8888-888888888801', '55555555-5555-5555-5555-555555555508'),
  ('88888888-8888-8888-8888-888888888801', '55555555-5555-5555-5555-555555555511'),
  ('88888888-8888-8888-8888-888888888801', '55555555-5555-5555-5555-555555555514'),
  -- Villa with Garden
  ('88888888-8888-8888-8888-888888888802', '55555555-5555-5555-5555-555555555501'),
  ('88888888-8888-8888-8888-888888888802', '55555555-5555-5555-5555-555555555502'),
  ('88888888-8888-8888-8888-888888888802', '55555555-5555-5555-5555-555555555503'),
  ('88888888-8888-8888-8888-888888888802', '55555555-5555-5555-5555-555555555505'),
  ('88888888-8888-8888-8888-888888888802', '55555555-5555-5555-5555-555555555506'),
  ('88888888-8888-8888-8888-888888888802', '55555555-5555-5555-5555-555555555507'),
  ('88888888-8888-8888-8888-888888888802', '55555555-5555-5555-5555-555555555510'),
  -- Office Space
  ('88888888-8888-8888-8888-888888888806', '55555555-5555-5555-5555-555555555501'),
  ('88888888-8888-8888-8888-888888888806', '55555555-5555-5555-5555-555555555502'),
  ('88888888-8888-8888-8888-888888888806', '55555555-5555-5555-5555-555555555509'),
  -- Beachfront Villa
  ('88888888-8888-8888-8888-888888888810', '55555555-5555-5555-5555-555555555501'),
  ('88888888-8888-8888-8888-888888888810', '55555555-5555-5555-5555-555555555502'),
  ('88888888-8888-8888-8888-888888888810', '55555555-5555-5555-5555-555555555503'),
  ('88888888-8888-8888-8888-888888888810', '55555555-5555-5555-5555-555555555505'),
  ('88888888-8888-8888-8888-888888888810', '55555555-5555-5555-5555-555555555508'),
  ('88888888-8888-8888-8888-888888888810', '55555555-5555-5555-5555-555555555510')
ON CONFLICT DO NOTHING;

-- ============================================
-- 10. WALLET TRANSACTIONS
-- ============================================
INSERT INTO wallet_transactions (id, user_id, city_id, type, amount_mru, balance_before_mru, balance_after_mru, status, payment_method, payment_screenshot_url, assigned_member_id, approved_by_member_id, approved_at, rejection_reason, related_post_id) VALUES
  -- Approved deposits
  ('99999999-9999-9999-9999-999999999901', '77777777-7777-7777-7777-777777777707', '11111111-1111-1111-1111-111111111101', 'deposit', 1000.00, 0.00, 1000.00, 'approved', 'bankily', 'https://example.com/screenshot1.jpg', '77777777-7777-7777-7777-777777777702', '77777777-7777-7777-7777-777777777702', NOW() - INTERVAL '5 days', NULL, NULL),
  ('99999999-9999-9999-9999-999999999902', '77777777-7777-7777-7777-777777777708', '11111111-1111-1111-1111-111111111101', 'deposit', 2000.00, 0.00, 2000.00, 'approved', 'sedad', 'https://example.com/screenshot2.jpg', '77777777-7777-7777-7777-777777777702', '77777777-7777-7777-7777-777777777702', NOW() - INTERVAL '10 days', NULL, NULL),
  ('99999999-9999-9999-9999-999999999903', '77777777-7777-7777-7777-777777777709', '11111111-1111-1111-1111-111111111102', 'deposit', 3000.00, 0.00, 3000.00, 'approved', 'masrvi', 'https://example.com/screenshot3.jpg', '77777777-7777-7777-7777-777777777703', '77777777-7777-7777-7777-777777777703', NOW() - INTERVAL '3 days', NULL, NULL),
  -- Pending deposits (waiting for approval)
  ('99999999-9999-9999-9999-999999999904', '77777777-7777-7777-7777-777777777711', '11111111-1111-1111-1111-111111111104', 'deposit', 500.00, 0.00, 0.00, 'pending', 'bankily', 'https://example.com/screenshot4.jpg', NULL, NULL, NULL, NULL, NULL),
  ('99999999-9999-9999-9999-999999999905', '77777777-7777-7777-7777-777777777712', '11111111-1111-1111-1111-111111111101', 'deposit', 1500.00, 750.00, 750.00, 'pending', 'sedad', 'https://example.com/screenshot5.jpg', '77777777-7777-7777-7777-777777777702', NULL, NULL, NULL, NULL),
  -- Escalated to leader (no member in city)
  ('99999999-9999-9999-9999-999999999906', '77777777-7777-7777-7777-777777777711', '11111111-1111-1111-1111-111111111104', 'deposit', 2000.00, 0.00, 0.00, 'assigned_to_leader', 'masrvi', 'https://example.com/screenshot6.jpg', NULL, NULL, NULL, NULL, NULL),
  -- Rejected deposit
  ('99999999-9999-9999-9999-999999999907', '77777777-7777-7777-7777-777777777710', '11111111-1111-1111-1111-111111111103', 'deposit', 1000.00, 150.00, 150.00, 'rejected', 'bankily', 'https://example.com/screenshot7.jpg', '77777777-7777-7777-7777-777777777704', '77777777-7777-7777-7777-777777777704', NOW() - INTERVAL '2 days', 'Payment screenshot is unclear', NULL),
  -- Post payments
  ('99999999-9999-9999-9999-999999999910', '77777777-7777-7777-7777-777777777702', '11111111-1111-1111-1111-111111111101', 'post_payment', -10.00, 15010.00, 15000.00, 'approved', NULL, NULL, NULL, NULL, NOW() - INTERVAL '1 day', NULL, '88888888-8888-8888-8888-888888888801'),
  ('99999999-9999-9999-9999-999999999911', '77777777-7777-7777-7777-777777777708', '11111111-1111-1111-1111-111111111101', 'post_payment', -10.00, 1210.00, 1200.00, 'approved', NULL, NULL, NULL, NULL, NOW() - INTERVAL '4 days', NULL, '88888888-8888-8888-8888-888888888805'),
  -- Member approval rewards
  ('99999999-9999-9999-9999-999999999920', '77777777-7777-7777-7777-777777777702', '11111111-1111-1111-1111-111111111101', 'approval_reward', 5.00, 14995.00, 15000.00, 'approved', NULL, NULL, NULL, NULL, NOW() - INTERVAL '5 days', NULL, NULL),
  ('99999999-9999-9999-9999-999999999921', '77777777-7777-7777-7777-777777777702', '11111111-1111-1111-1111-111111111101', 'approval_reward', 5.00, 14990.00, 14995.00, 'approved', NULL, NULL, NULL, NULL, NOW() - INTERVAL '10 days', NULL, NULL),
  ('99999999-9999-9999-9999-999999999922', '77777777-7777-7777-7777-777777777703', '11111111-1111-1111-1111-111111111102', 'approval_reward', 5.00, 8495.00, 8500.00, 'approved', NULL, NULL, NULL, NULL, NOW() - INTERVAL '3 days', NULL, NULL),
  -- Report penalty
  ('99999999-9999-9999-9999-999999999930', '77777777-7777-7777-7777-777777777705', '11111111-1111-1111-1111-111111111101', 'report_penalty', -500.00, 3000.00, 2500.00, 'approved', NULL, NULL, NULL, NULL, NOW() - INTERVAL '15 days', NULL, NULL),
  -- Ex-member subscription
  ('99999999-9999-9999-9999-999999999940', '77777777-7777-7777-7777-777777777705', '11111111-1111-1111-1111-111111111101', 'ex_member_subscription', -2000.00, 4500.00, 2500.00, 'approved', NULL, NULL, NULL, NULL, NOW() - INTERVAL '30 days', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 11. MEMBER REPORTS
-- ============================================
INSERT INTO member_reports (id, reporter_user_id, reported_member_id, transaction_id, reason, details, status, reviewed_by_leader_id, reviewed_at, leader_notes, penalty_charged) VALUES
  -- Pending report
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', '77777777-7777-7777-7777-777777777710', '77777777-7777-7777-7777-777777777704', '99999999-9999-9999-9999-999999999907', 'Unfair rejection', 'The payment screenshot was clear and showed the correct amount. I believe this rejection was unfair.', 'pending', NULL, NULL, NULL, false),
  -- Approved report (penalty charged)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002', '77777777-7777-7777-7777-777777777707', '77777777-7777-7777-7777-777777777705', '99999999-9999-9999-9999-999999999930', 'Rejected valid payment', 'The member rejected my payment even though all details were correct.', 'approved', '77777777-7777-7777-7777-777777777701', NOW() - INTERVAL '15 days', 'After review, the payment was clearly valid. Penalty applied.', true),
  -- Rejected report
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003', '77777777-7777-7777-7777-777777777708', '77777777-7777-7777-7777-777777777702', NULL, 'Slow response', 'Member took too long to approve my payment.', 'rejected', '77777777-7777-7777-7777-777777777701', NOW() - INTERVAL '7 days', 'Member responded within acceptable timeframe. No penalty.', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 12. NOTIFICATIONS
-- ============================================
INSERT INTO notifications (id, user_id, type, title, message, data, read) VALUES
  -- Payment notifications
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', '77777777-7777-7777-7777-777777777707', 'payment_approved', 'Payment Approved', 'Your deposit of 1000 MRU has been approved and added to your wallet.', '{"amount": 1000}', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', '77777777-7777-7777-7777-777777777708', 'payment_approved', 'Payment Approved', 'Your deposit of 2000 MRU has been approved and added to your wallet.', '{"amount": 2000}', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb003', '77777777-7777-7777-7777-777777777710', 'payment_rejected', 'Payment Rejected', 'Your deposit of 1000 MRU was rejected. Reason: Payment screenshot is unclear', '{"amount": 1000, "reason": "Payment screenshot is unclear"}', false),
  -- Member reward notifications
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb004', '77777777-7777-7777-7777-777777777702', 'approval_reward', 'Approval Reward', 'You earned 5 MRU for approving a payment.', '{"amount": 5}', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb005', '77777777-7777-7777-7777-777777777703', 'approval_reward', 'Approval Reward', 'You earned 5 MRU for approving a payment.', '{"amount": 5}', false),
  -- Report notifications
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb006', '77777777-7777-7777-7777-777777777704', 'report_filed', 'Report Filed Against You', 'A user has filed a report against you for an unfair payment rejection. A leader will review this report.', NULL, false),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb007', '77777777-7777-7777-7777-777777777705', 'penalty_charged', 'Penalty Charged', 'A penalty of 500 MRU has been deducted from your wallet due to an approved report.', '{"amount": 500}', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb008', '77777777-7777-7777-7777-777777777707', 'report_resolved', 'Report Approved', 'Your report was approved. The member has been charged a 500 MRU penalty.', '{"approved": true}', true),
  -- Post notifications
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb009', '77777777-7777-7777-7777-777777777702', 'post_created', 'Post Created', 'Your post "Modern 3BR Apartment in Tevragh Zeina" has been published. 10 MRU was deducted from your wallet.', '{"postTitle": "Modern 3BR Apartment in Tevragh Zeina", "wasFree": false, "cost": 10}', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb010', '77777777-7777-7777-7777-777777777707', 'post_created', 'Post Created', 'Your post "Toyota Camry 2020" has been published (free post used).', '{"postTitle": "Toyota Camry 2020", "wasFree": true, "cost": 0}', true),
  -- Role change notification
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb011', '77777777-7777-7777-7777-777777777702', 'role_promoted', 'Role Upgraded', 'Congratulations! You have been promoted to Member by Mohamed Ould Ahmed.', '{"newRole": "member"}', true),
  -- Ex-member subscription notification
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb012', '77777777-7777-7777-7777-777777777705', 'subscription_renewed', 'Subscription Renewed', 'Your Ex-Member subscription has been renewed. Next payment due: 2025-01-18.', '{"nextDueDate": "2025-01-18"}', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 13. SAVED POSTS (Favorites)
-- ============================================
INSERT INTO saved_posts (user_id, post_id) VALUES
  ('77777777-7777-7777-7777-777777777707', '88888888-8888-8888-8888-888888888801'),
  ('77777777-7777-7777-7777-777777777707', '88888888-8888-8888-8888-888888888802'),
  ('77777777-7777-7777-7777-777777777708', '88888888-8888-8888-8888-888888888803'),
  ('77777777-7777-7777-7777-777777777708', '88888888-8888-8888-8888-888888888810'),
  ('77777777-7777-7777-7777-777777777709', '88888888-8888-8888-8888-888888888804'),
  ('77777777-7777-7777-7777-777777777710', '88888888-8888-8888-8888-888888888801'),
  ('77777777-7777-7777-7777-777777777710', '88888888-8888-8888-8888-888888888805'),
  ('77777777-7777-7777-7777-777777777711', '88888888-8888-8888-8888-888888888806'),
  ('77777777-7777-7777-7777-777777777712', '88888888-8888-8888-8888-888888888807')
ON CONFLICT DO NOTHING;

-- ============================================
-- 14. REVIEWS
-- ============================================
INSERT INTO reviews (id, post_id, user_id, rating, comment) VALUES
  ('cccccccc-cccc-cccc-cccc-ccccccccc001', '88888888-8888-8888-8888-888888888801', '77777777-7777-7777-7777-777777777707', 5, 'Excellent apartment! Very clean and well maintained.'),
  ('cccccccc-cccc-cccc-cccc-ccccccccc002', '88888888-8888-8888-8888-888888888801', '77777777-7777-7777-7777-777777777708', 4, 'Great location, friendly owner. Highly recommended.'),
  ('cccccccc-cccc-cccc-cccc-ccccccccc003', '88888888-8888-8888-8888-888888888802', '77777777-7777-7777-7777-777777777709', 5, 'Beautiful villa with amazing garden. Perfect for families.'),
  ('cccccccc-cccc-cccc-cccc-ccccccccc004', '88888888-8888-8888-8888-888888888803', '77777777-7777-7777-7777-777777777710', 5, 'Phone was exactly as described. Fast delivery.'),
  ('cccccccc-cccc-cccc-cccc-ccccccccc005', '88888888-8888-8888-8888-888888888804', '77777777-7777-7777-7777-777777777712', 4, 'Good car, minor scratches but overall great value.')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE 'Created: 10 cities, 8 categories, 5 listing types, 8 property types, 18 amenities';
  RAISE NOTICE 'Created: 12 users (1 leader, 3 members, 2 ex-members, 6 normal)';
  RAISE NOTICE 'Created: 12 posts, 14 transactions, 3 reports, 12 notifications';
END $$;
