-- ════════════════════════════════════════════════════════════════════
-- EJAR APP - DATABASE MIGRATIONS
-- ════════════════════════════════════════════════════════════════════
-- 
-- These SQL statements update the Ejar database schema to support
-- all new marketplace features including:
-- - Category-specific posts (phones, laptops, electronics, cars, property)
-- - Nearby amenities for rent house/apartment properties
-- - Land size field for land property type
-- - Enhanced filtering and search capabilities
--
-- INSTRUCTIONS:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and execute these statements in order
-- 4. Verify the changes in the Table Editor
-- ════════════════════════════════════════════════════════════════════

-- ════════════════════════════════════════════════════════════════════
-- 1. ADD CATEGORY CONSTRAINT TO POSTS TABLE
-- ════════════════════════════════════════════════════════════════════
-- Ensure category field only accepts valid values

ALTER TABLE posts
DROP CONSTRAINT IF EXISTS posts_category_check;

ALTER TABLE posts
ADD CONSTRAINT posts_category_check 
CHECK (category IN ('phones', 'laptops', 'electronics', 'cars', 'property'));

-- Make category required (NOT NULL)
ALTER TABLE posts
ALTER COLUMN category SET NOT NULL;

-- Make title required (NOT NULL)
ALTER TABLE posts
ALTER COLUMN title SET NOT NULL;

-- ════════════════════════════════════════════════════════════════════
-- 2. BACKFILL DATA AND ADD PROPERTY-SPECIFIC CONSTRAINTS
-- ════════════════════════════════════════════════════════════════════
-- Clean up existing data before adding constraints

-- First, backfill: set listing_type and property_type to NULL for non-property posts
UPDATE posts
SET listing_type = NULL
WHERE category IS NOT NULL AND category != 'property';

UPDATE posts
SET property_type = NULL
WHERE category IS NOT NULL AND category != 'property';

-- Now add constraints (these will not fail since data is clean)

-- listing_type should only be set for property category
ALTER TABLE posts
DROP CONSTRAINT IF EXISTS posts_listing_type_check;

ALTER TABLE posts
ADD CONSTRAINT posts_listing_type_check
CHECK (
  (category = 'property' AND listing_type IN ('rent', 'sell')) OR
  (category != 'property' AND listing_type IS NULL)
);

-- property_type should only be set for property category
ALTER TABLE posts
DROP CONSTRAINT IF EXISTS posts_property_type_check;

ALTER TABLE posts
ADD CONSTRAINT posts_property_type_check
CHECK (
  (category = 'property' AND property_type IN ('house', 'apartment', 'villa', 'land')) OR
  (category != 'property' AND property_type IS NULL)
);

-- ════════════════════════════════════════════════════════════════════
-- 3. ADD SPECIFICATION VALIDATION TRIGGER
-- ════════════════════════════════════════════════════════════════════
-- This trigger validates specifications based on category and property type

CREATE OR REPLACE FUNCTION validate_post_specifications()
RETURNS TRIGGER AS $$
BEGIN
  -- For property category with land type
  IF NEW.category = 'property' AND NEW.property_type = 'land' THEN
    IF NOT (NEW.specifications ? 'land_size') THEN
      RAISE EXCEPTION 'Land properties must include land_size in specifications';
    END IF;
  END IF;

  -- For property category with rent listing type and house/apartment
  IF NEW.category = 'property' 
     AND NEW.listing_type = 'rent' 
     AND NEW.property_type IN ('house', 'apartment') THEN
    IF NOT (NEW.specifications ? 'nearby_amenities') THEN
      RAISE EXCEPTION 'Rent house/apartment properties must include nearby_amenities in specifications';
    END IF;
    IF jsonb_typeof(NEW.specifications->'nearby_amenities') != 'array' THEN
      RAISE EXCEPTION 'nearby_amenities must be an array';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS validate_post_specifications_trigger ON posts;

-- Create trigger
CREATE TRIGGER validate_post_specifications_trigger
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION validate_post_specifications();

-- ════════════════════════════════════════════════════════════════════
-- 4. ADD INDEXES FOR PERFORMANCE
-- ════════════════════════════════════════════════════════════════════
-- These indexes speed up category filtering, search, and price range queries

CREATE INDEX IF NOT EXISTS idx_posts_category 
ON posts(category);

CREATE INDEX IF NOT EXISTS idx_posts_user_id 
ON posts(user_id);

CREATE INDEX IF NOT EXISTS idx_posts_created_at 
ON posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_price 
ON posts(price) 
WHERE price IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_posts_listing_type 
ON posts(listing_type) 
WHERE listing_type IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_posts_property_type 
ON posts(property_type) 
WHERE property_type IS NOT NULL;

-- ════════════════════════════════════════════════════════════════════
-- 5. ADD TEXT SEARCH INDEX FOR TITLE, CONTENT, AND LOCATION
-- ════════════════════════════════════════════════════════════════════
-- This enables fast full-text search across title, content, and location

-- Create text search configuration (optional, improves search quality)
CREATE INDEX IF NOT EXISTS idx_posts_text_search 
ON posts 
USING gin(to_tsvector('english', 
  COALESCE(title, '') || ' ' || 
  COALESCE(content, '') || ' ' || 
  COALESCE(location, '')
));

-- ════════════════════════════════════════════════════════════════════
-- 6. ADD COMMENTS FOR DOCUMENTATION
-- ════════════════════════════════════════════════════════════════════
-- Document the purpose of each field

COMMENT ON COLUMN posts.category IS 
'Post category: phones, laptops, electronics, cars, or property';

COMMENT ON COLUMN posts.property_type IS 
'Property type (for category=property only): house, apartment, villa, or land';

COMMENT ON COLUMN posts.listing_type IS 
'Listing type (for category=property only): rent or sell';

COMMENT ON COLUMN posts.amenities IS 
'Main amenities array (Wi-Fi, Parking, AC, Kitchen) - stored as JSONB array';

COMMENT ON COLUMN posts.specifications IS 
'Category-specific details stored as JSONB. Structure varies by category.
- For property+rent+house/apartment: includes nearby_amenities array
- For property+land: includes land_size instead of bedrooms/bathrooms
- For phones: battery_health, storage, condition, model, color
- For laptops: processor, ram, storage, condition, model
- For electronics: brand, condition, warranty
- For cars: make, model, year, mileage, gear_type, fuel_type, condition';

-- ════════════════════════════════════════════════════════════════════
-- 7. ENSURE PROPER DEFAULT VALUES
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE posts
ALTER COLUMN amenities SET DEFAULT '[]'::jsonb;

ALTER TABLE posts
ALTER COLUMN specifications SET DEFAULT '{}'::jsonb;

ALTER TABLE posts
ALTER COLUMN images SET DEFAULT '[]'::jsonb;

-- Don't set default for listing_type since it should only be set for property category
ALTER TABLE posts
ALTER COLUMN listing_type DROP DEFAULT;

ALTER TABLE posts
ALTER COLUMN likes_count SET DEFAULT 0;

ALTER TABLE posts
ALTER COLUMN comments_count SET DEFAULT 0;

-- ════════════════════════════════════════════════════════════════════
-- 8. VERIFY MIGRATIONS
-- ════════════════════════════════════════════════════════════════════
-- Run these queries to verify everything is set up correctly

-- Check constraints
SELECT
  tc.constraint_name,
  tc.table_name,
  cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'posts'
  AND tc.constraint_type = 'CHECK';

-- Check indexes
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'posts'
ORDER BY indexname;

-- Check column comments
SELECT
  column_name,
  col_description((table_schema||'.'||table_name)::regclass::oid, ordinal_position) as column_comment
FROM information_schema.columns
WHERE table_name = 'posts'
  AND col_description((table_schema||'.'||table_name)::regclass::oid, ordinal_position) IS NOT NULL
ORDER BY ordinal_position;

-- Check triggers
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'posts';

-- ════════════════════════════════════════════════════════════════════
-- 9. SAMPLE DATA FOR TESTING
-- ════════════════════════════════════════════════════════════════════
-- Insert sample posts to test the new schema (optional)

-- Example: Phone post
-- INSERT INTO posts (user_id, title, category, price, location, specifications)
-- VALUES (
--   (SELECT id FROM users LIMIT 1),
--   'iPhone 14 Pro - Excellent Condition',
--   'phones',
--   899.99,
--   'Dubai, UAE',
--   '{"model": "iPhone 14 Pro", "storage": "256GB", "battery_health": "95%", "condition": "Excellent", "color": "Space Black"}'::jsonb
-- );

-- Example: Property post - Rent House with nearby amenities
-- INSERT INTO posts (user_id, title, category, listing_type, property_type, price, location, amenities, specifications)
-- VALUES (
--   (SELECT id FROM users LIMIT 1),
--   'Beautiful 3BR House for Rent',
--   'property',
--   'rent',
--   'house',
--   2500,
--   'Dubai Marina, Dubai',
--   '["Wi-Fi", "Parking", "AC", "Kitchen"]'::jsonb,
--   '{"bedrooms": "3", "bathrooms": "2", "size_sqft": "1800", "property_type": "house", "monthly_rent": "2500", "deposit": "5000", "furnished": "Yes", "nearby_amenities": ["mosque", "gym", "laundry"]}'::jsonb
-- );

-- Example: Property post - Land with land_size
-- INSERT INTO posts (user_id, title, category, listing_type, property_type, price, location, specifications)
-- VALUES (
--   (SELECT id FROM users LIMIT 1),
--   'Residential Land for Sale',
--   'property',
--   'sell',
--   'land',
--   350000,
--   'Al Ain, UAE',
--   '{"property_type": "land", "land_size": "750", "sale_price": "350000", "ownership_type": "Freehold", "zoning": "Residential"}'::jsonb
-- );

-- ════════════════════════════════════════════════════════════════════
-- END OF MIGRATIONS
-- ════════════════════════════════════════════════════════════════════
