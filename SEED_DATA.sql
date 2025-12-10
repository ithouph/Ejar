-- ═══════════════════════════════════════════════════════════════════
-- EJAR APP - DUMMY DATA SEED SCRIPT
-- ═══════════════════════════════════════════════════════════════════
-- Run this in Supabase Dashboard: SQL Editor → New query → Paste & Run
-- Requires: DATABASE_SETUP.sql to be run first
-- ═══════════════════════════════════════════════════════════════════

-- 1. INSERT MAURITANIAN CITIES
INSERT INTO cities (name, region, is_active) VALUES
('Nouakchott', 'Nouakchott', true),
('Nouadhibou', 'Dakhlet Nouadhibou', true),
('Kaédi', 'Gorgol', true),
('Zouérat', 'Tiris Zemmour', true),
('Rosso', 'Trarza', true),
('Atar', 'Adrar', true),
('Kiffa', 'Assaba', true),
('Néma', 'Hodh Ech Chargui', true),
('Aleg', 'Brakna', true),
('Sélibaby', 'Guidimaka', true),
('Aioun el Atrouss', 'Hodh El Gharbi', true),
('Tidjikja', 'Tagant', true),
('Akjoujt', 'Inchiri', true)
ON CONFLICT (name) DO NOTHING;

-- 2. INSERT SERVICE CATEGORIES
INSERT INTO service_categories (name, type, description, metadata) VALUES
('Property', 'marketplace', 'Houses, apartments, land for rent or sale', '{"icon": "home", "color": "#165A4A"}'),
('Phones', 'marketplace', 'Mobile phones and accessories', '{"icon": "smartphone", "color": "#3B82F6"}'),
('Laptops', 'marketplace', 'Laptops and computers', '{"icon": "monitor", "color": "#8B5CF6"}'),
('Electronics', 'marketplace', 'TVs, appliances, gadgets', '{"icon": "zap", "color": "#F59E0B"}'),
('Cars', 'marketplace', 'Vehicles for rent or sale', '{"icon": "truck", "color": "#EF4444"}')
ON CONFLICT DO NOTHING;

-- 3. INSERT TEST USERS (for development only)
-- Note: These use placeholder UUIDs. In production, users are created via OTP auth.

-- First get a city ID for test users
DO $$
DECLARE
    nouakchott_id UUID;
    nouadhibou_id UUID;
    test_user1_id UUID;
    test_user2_id UUID;
    test_member_id UUID;
    property_cat_id UUID;
    phones_cat_id UUID;
    cars_cat_id UUID;
BEGIN
    -- Get city IDs
    SELECT id INTO nouakchott_id FROM cities WHERE name = 'Nouakchott';
    SELECT id INTO nouadhibou_id FROM cities WHERE name = 'Nouadhibou';
    
    -- Get category IDs
    SELECT id INTO property_cat_id FROM service_categories WHERE name = 'Property';
    SELECT id INTO phones_cat_id FROM service_categories WHERE name = 'Phones';
    SELECT id INTO cars_cat_id FROM service_categories WHERE name = 'Cars';

    -- Insert test users
    INSERT INTO users (phone, whatsapp_number, first_name, last_name, city_id, role, wallet_balance_mru, free_posts_remaining)
    VALUES 
        ('+22212345678', '+22212345678', 'Ahmed', 'Mohamed', nouakchott_id, 'normal', 5000.00, 5),
        ('+22223456789', '+22223456789', 'Fatima', 'Mint Ali', nouakchott_id, 'normal', 2500.00, 3),
        ('+22234567890', '+22234567890', 'Omar', 'Ould Cheikh', nouadhibou_id, 'member', 10000.00, 5)
    ON CONFLICT (phone) DO NOTHING
    RETURNING id INTO test_user1_id;

    -- Get user IDs for posts
    SELECT id INTO test_user1_id FROM users WHERE phone = '+22212345678';
    SELECT id INTO test_user2_id FROM users WHERE phone = '+22223456789';
    SELECT id INTO test_member_id FROM users WHERE phone = '+22234567890';

    -- 4. INSERT SAMPLE POSTS
    IF test_user1_id IS NOT NULL AND property_cat_id IS NOT NULL THEN
        INSERT INTO posts (user_id, city_id, category_id, title, description, price, images, status, paid, was_free_post)
        VALUES 
            -- Properties
            (test_user1_id, nouakchott_id, property_cat_id, 
             'Modern 3BR Apartment in Tevragh Zeina', 
             'Spacious apartment with AC, parking, and 24/7 security. Close to shops and restaurants.',
             150000, 
             ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
             'active', true, true),
            
            (test_user1_id, nouakchott_id, property_cat_id, 
             'Villa with Garden in Ksar', 
             'Beautiful villa with 4 bedrooms, large garden, and modern kitchen. Perfect for families.',
             350000, 
             ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
             'active', true, false),

            -- Phones
            (test_user2_id, nouakchott_id, phones_cat_id, 
             'iPhone 14 Pro Max - Like New', 
             '256GB, Deep Purple. Includes charger and original box. Battery health 98%.',
             85000, 
             ARRAY['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400'],
             'active', true, true),

            (test_user2_id, nouakchott_id, phones_cat_id, 
             'Samsung Galaxy S23 Ultra', 
             '512GB, Phantom Black. Perfect condition, used for 3 months only.',
             75000, 
             ARRAY['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400'],
             'active', true, true),

            -- Cars
            (test_member_id, nouadhibou_id, cars_cat_id, 
             'Toyota Land Cruiser 2020', 
             'V8 engine, full options, leather seats. Well maintained with service history.',
             2500000, 
             ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400'],
             'active', true, false),

            (test_member_id, nouadhibou_id, cars_cat_id, 
             'Hilux Double Cabin 2022', 
             'Diesel, 4x4, low mileage. Perfect for desert trips.',
             1800000, 
             ARRAY['https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400'],
             'active', true, true)
        ON CONFLICT DO NOTHING;
    END IF;

    -- 5. INSERT SAMPLE REVIEWS
    IF test_user1_id IS NOT NULL AND test_user2_id IS NOT NULL THEN
        INSERT INTO reviews (user_id, post_id, rating, comment)
        SELECT 
            test_user2_id,
            p.id,
            4,
            'Great property, exactly as described. Owner was very helpful.'
        FROM posts p 
        WHERE p.user_id = test_user1_id 
        LIMIT 1
        ON CONFLICT DO NOTHING;
    END IF;

END $$;

-- ═══════════════════════════════════════════════════════════════════
-- VERIFICATION QUERIES
-- ═══════════════════════════════════════════════════════════════════

-- Check cities
SELECT name, region FROM cities ORDER BY name;

-- Check categories
SELECT name, type FROM service_categories;

-- Check users
SELECT first_name, last_name, phone, role, wallet_balance_mru 
FROM users ORDER BY created_at;

-- Check posts with category and city
SELECT 
    p.title,
    p.price,
    c.name as city,
    sc.name as category,
    u.first_name || ' ' || u.last_name as seller
FROM posts p
JOIN cities c ON p.city_id = c.id
LEFT JOIN service_categories sc ON p.category_id = sc.id
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- ═══════════════════════════════════════════════════════════════════
-- NOTES
-- ═══════════════════════════════════════════════════════════════════
-- 
-- Test Phone Numbers:
-- +22212345678 - Normal user (Ahmed)
-- +22223456789 - Normal user (Fatima)
-- +22234567890 - Member user (Omar)
--
-- For testing without Supabase Phone Auth:
-- The app has a console OTP fallback mode for development.
-- Enter any phone number and check the console for the OTP code.
--
-- ═══════════════════════════════════════════════════════════════════
