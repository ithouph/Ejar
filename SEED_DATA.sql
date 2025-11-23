-- ═══════════════════════════════════════════════════════════════════
-- EJAR APP - DUMMY DATA SEED SCRIPT
-- ═══════════════════════════════════════════════════════════════════
-- Run this in Supabase Dashboard: SQL Editor → New query → Paste & Run
-- ═══════════════════════════════════════════════════════════════════

-- 1. ADD MORE PROPERTIES (10 new properties)
INSERT INTO properties (title, description, type, location, price_per_night, bedrooms, bathrooms, max_guests, rating, total_reviews)
VALUES 
  ('Beachfront Villa Paradise', 'Stunning oceanfront villa with private pool, direct beach access, and breathtaking sunset views. Perfect for families and groups.', 'Apartment', 'Bali, Indonesia', 350, 4, 3, 8, 4.9, 127),
  ('Downtown Luxury Apartment', 'Modern high-rise apartment in the heart of the city. Walking distance to shopping, dining, and entertainment.', 'Apartment', 'Dubai, UAE', 280, 2, 2, 4, 4.7, 89),
  ('Mountain Retreat Chalet', 'Cozy alpine chalet with fireplace, hot tub, and panoramic mountain views. Ideal for ski season.', 'Hotel', 'Aspen, Colorado', 420, 3, 2, 6, 4.8, 64),
  ('Historic City Center Hotel', 'Boutique hotel in a restored 19th-century building. Elegant rooms with modern amenities.', 'Hotel', 'Paris, France', 195, 1, 1, 2, 4.6, 203),
  ('Tropical Island Resort', 'All-inclusive resort with private beach, water sports, spa, and multiple dining options.', 'Hotel', 'Maldives', 680, NULL, NULL, 2, 5.0, 412),
  ('Urban Loft Studio', 'Trendy studio loft in converted warehouse. Exposed brick, high ceilings, industrial design.', 'Apartment', 'New York, USA', 160, 1, 1, 2, 4.4, 56),
  ('Santorini Cliffside Suite', 'Iconic white-washed suite carved into volcanic cliffs with stunning caldera views.', 'Hotel', 'Santorini, Greece', 520, 1, 1, 2, 4.9, 285),
  ('Safari Lodge & Spa', 'Luxury tented lodge in the heart of the savanna. Wildlife viewing and guided safaris.', 'Hotel', 'Serengeti, Tanzania', 890, 1, 1, 2, 5.0, 156),
  ('Lakeside Cabin Retreat', 'Peaceful cabin surrounded by pine trees with private dock. Perfect for fishing and kayaking.', 'Apartment', 'Lake Tahoe, USA', 240, 2, 1, 4, 4.5, 78),
  ('Tokyo Capsule Hotel', 'Modern capsule hotel in Shibuya. High-tech pods with privacy curtains.', 'Hotel', 'Tokyo, Japan', 45, NULL, NULL, 1, 4.2, 534)
ON CONFLICT (id) DO NOTHING;

-- Get the IDs of newly inserted properties for amenities
-- Note: You'll need to replace these UUIDs with actual IDs from your database

-- 2. ADD AMENITIES (for existing properties)
-- First, let's add amenities for the test properties that already exist

-- For Test Hotel - Ejar Connection Test (you'll need to replace the UUID)
INSERT INTO amenities (property_id, name, icon)
SELECT id, 'Wi-Fi', 'wifi' FROM properties WHERE title = 'Test Hotel - Ejar Connection Test'
UNION ALL
SELECT id, 'Pool', 'droplet' FROM properties WHERE title = 'Test Hotel - Ejar Connection Test'
UNION ALL
SELECT id, 'Parking', 'car' FROM properties WHERE title = 'Test Hotel - Ejar Connection Test'
UNION ALL
SELECT id, 'Air Conditioning', 'wind' FROM properties WHERE title = 'Test Hotel - Ejar Connection Test';

-- For Luxury Beach Resort
INSERT INTO amenities (property_id, name, icon)
SELECT id, 'Wi-Fi', 'wifi' FROM properties WHERE title = 'Luxury Beach Resort'
UNION ALL
SELECT id, 'Pool', 'droplet' FROM properties WHERE title = 'Luxury Beach Resort'
UNION ALL
SELECT id, 'Spa', 'heart' FROM properties WHERE title = 'Luxury Beach Resort'
UNION ALL
SELECT id, 'Restaurant', 'coffee' FROM properties WHERE title = 'Luxury Beach Resort'
UNION ALL
SELECT id, 'Beach Access', 'sun' FROM properties WHERE title = 'Luxury Beach Resort';

-- For newly added Beachfront Villa Paradise
INSERT INTO amenities (property_id, name, icon)
SELECT id, 'Wi-Fi', 'wifi' FROM properties WHERE title = 'Beachfront Villa Paradise'
UNION ALL
SELECT id, 'Pool', 'droplet' FROM properties WHERE title = 'Beachfront Villa Paradise'
UNION ALL
SELECT id, 'Kitchen', 'coffee' FROM properties WHERE title = 'Beachfront Villa Paradise'
UNION ALL
SELECT id, 'Parking', 'car' FROM properties WHERE title = 'Beachfront Villa Paradise'
UNION ALL
SELECT id, 'Air Conditioning', 'wind' FROM properties WHERE title = 'Beachfront Villa Paradise';

-- For Downtown Luxury Apartment
INSERT INTO amenities (property_id, name, icon)
SELECT id, 'Wi-Fi', 'wifi' FROM properties WHERE title = 'Downtown Luxury Apartment'
UNION ALL
SELECT id, 'Gym', 'activity' FROM properties WHERE title = 'Downtown Luxury Apartment'
UNION ALL
SELECT id, 'Parking', 'car' FROM properties WHERE title = 'Downtown Luxury Apartment'
UNION ALL
SELECT id, 'Air Conditioning', 'wind' FROM properties WHERE title = 'Downtown Luxury Apartment';

-- For Mountain Retreat Chalet
INSERT INTO amenities (property_id, name, icon)
SELECT id, 'Wi-Fi', 'wifi' FROM properties WHERE title = 'Mountain Retreat Chalet'
UNION ALL
SELECT id, 'Fireplace', 'zap' FROM properties WHERE title = 'Mountain Retreat Chalet'
UNION ALL
SELECT id, 'Hot Tub', 'droplet' FROM properties WHERE title = 'Mountain Retreat Chalet'
UNION ALL
SELECT id, 'Kitchen', 'coffee' FROM properties WHERE title = 'Mountain Retreat Chalet';

-- For Santorini Cliffside Suite
INSERT INTO amenities (property_id, name, icon)
SELECT id, 'Wi-Fi', 'wifi' FROM properties WHERE title = 'Santorini Cliffside Suite'
UNION ALL
SELECT id, 'Pool', 'droplet' FROM properties WHERE title = 'Santorini Cliffside Suite'
UNION ALL
SELECT id, 'Breakfast', 'coffee' FROM properties WHERE title = 'Santorini Cliffside Suite'
UNION ALL
SELECT id, 'Air Conditioning', 'wind' FROM properties WHERE title = 'Santorini Cliffside Suite';

-- For Tropical Island Resort
INSERT INTO amenities (property_id, name, icon)
SELECT id, 'Wi-Fi', 'wifi' FROM properties WHERE title = 'Tropical Island Resort'
UNION ALL
SELECT id, 'Pool', 'droplet' FROM properties WHERE title = 'Tropical Island Resort'
UNION ALL
SELECT id, 'Spa', 'heart' FROM properties WHERE title = 'Tropical Island Resort'
UNION ALL
SELECT id, 'Restaurant', 'coffee' FROM properties WHERE title = 'Tropical Island Resort'
UNION ALL
SELECT id, 'Beach Access', 'sun' FROM properties WHERE title = 'Tropical Island Resort';

-- ═══════════════════════════════════════════════════════════════════
-- VERIFICATION QUERIES
-- ═══════════════════════════════════════════════════════════════════

-- Check how many properties exist
SELECT COUNT(*) as total_properties FROM properties;

-- Check how many amenities exist
SELECT COUNT(*) as total_amenities FROM amenities;

-- Show all properties with their amenity count
SELECT 
  p.title,
  p.type,
  p.location,
  p.price_per_night,
  p.rating,
  COUNT(a.id) as amenity_count
FROM properties p
LEFT JOIN amenities a ON p.id = a.property_id
GROUP BY p.id, p.title, p.type, p.location, p.price_per_night, p.rating
ORDER BY p.created_at DESC;

-- ═══════════════════════════════════════════════════════════════════
-- NOTES
-- ═══════════════════════════════════════════════════════════════════
-- 
-- User-Specific Data (requires authentication):
-- - reviews: Users must be logged in to create reviews
-- - favorites: Users must be logged in to save favorites
-- - wallet: Created automatically when user signs up
-- - wallet_transactions: Created when user adds/uses balance
-- - posts: Users must be logged in to create posts
-- - user_profiles: Created automatically after Google OAuth
-- - wedding_events: Users can create after logging in
--
-- After running this script:
-- 1. You'll have 12 properties total (2 existing + 10 new)
-- 2. Each property will have 4-5 amenities
-- 3. Log in with Google OAuth to add reviews, favorites, etc.
--
-- ═══════════════════════════════════════════════════════════════════
