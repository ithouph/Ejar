-- ============================================
-- EJAR MARKETPLACE - COMPLETE DATABASE SCHEMA
-- 4-Tier User System with City-Based Payment Approvals
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CITIES TABLE
-- ============================================
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    region TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cities_name ON cities(name);
CREATE INDEX idx_cities_is_active ON cities(is_active);

-- ============================================
-- 2. SERVICE CATEGORIES TABLE
-- ============================================
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_service_categories_type ON service_categories(type);
CREATE INDEX idx_service_categories_slug ON service_categories(slug);

-- ============================================
-- 3. USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Information
    phone TEXT UNIQUE NOT NULL,
    whatsapp_number TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    profile_photo_url TEXT,
    
    -- Role System
    role TEXT NOT NULL DEFAULT 'normal' CHECK (role IN ('normal', 'member', 'ex_member', 'leader')),
    
    -- Member-Specific Fields
    member_payment_phone TEXT,
    member_terms_conditions TEXT,
    
    -- Wallet & Posts
    wallet_balance_mru DECIMAL(10,2) DEFAULT 0.00 CHECK (wallet_balance_mru >= 0),
    free_posts_remaining INTEGER DEFAULT 5 CHECK (free_posts_remaining >= 0),
    free_posts_used INTEGER DEFAULT 0,
    total_posts_created INTEGER DEFAULT 0,
    
    -- Member Stats
    total_approvals_made INTEGER DEFAULT 0,
    total_earned_from_approvals_mru DECIMAL(10,2) DEFAULT 0.00,
    total_reports_received INTEGER DEFAULT 0,
    total_report_penalties_paid DECIMAL(10,2) DEFAULT 0.00,
    
    -- Ex-Member Subscription Fields
    ex_member_activated_at TIMESTAMP WITH TIME ZONE,
    ex_member_last_payment_at TIMESTAMP WITH TIME ZONE,
    ex_member_next_payment_due TIMESTAMP WITH TIME ZONE,
    ex_member_is_active BOOLEAN DEFAULT false,
    
    -- Promotion Tracking
    promoted_by_leader_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for users table
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_city_role ON users(city_id, role);
CREATE INDEX idx_users_role_balance ON users(role, wallet_balance_mru);
CREATE INDEX idx_users_ex_member_payment_due ON users(ex_member_next_payment_due) WHERE ex_member_is_active = true;
CREATE INDEX idx_users_whatsapp ON users(whatsapp_number);

-- ============================================
-- 4. POSTS TABLE
-- ============================================
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Display ID for leader view (e.g., POST-2025-0001)
    display_id TEXT UNIQUE,
    
    -- Relationships
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    
    -- Post Content
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    images TEXT[],
    
    -- Payment Status
    paid BOOLEAN DEFAULT false,
    was_free_post BOOLEAN DEFAULT false,
    post_cost_mru DECIMAL(10,2) DEFAULT 0.00,
    
    -- Post Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_payment', 'ended', 'deleted')),
    
    -- Engagement Metrics
    total_favorites INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for posts table
CREATE INDEX idx_posts_paid_status_created ON posts(paid, status, created_at DESC);
CREATE INDEX idx_posts_user_status ON posts(user_id, status);
CREATE INDEX idx_posts_city_status ON posts(city_id, status);
CREATE INDEX idx_posts_display_id ON posts(display_id);
CREATE INDEX idx_posts_category ON posts(category_id);

-- ============================================
-- 5. WALLET TRANSACTIONS TABLE
-- ============================================
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relationships
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    
    -- Transaction Details
    type TEXT NOT NULL CHECK (type IN ('deposit', 'post_payment', 'approval_reward', 'ex_member_subscription', 'report_penalty', 'refund')),
    amount_mru DECIMAL(10,2) NOT NULL,
    balance_before_mru DECIMAL(10,2) NOT NULL,
    balance_after_mru DECIMAL(10,2) NOT NULL,
    
    -- Payment Deposit Fields
    payment_screenshot_url TEXT,
    payment_method TEXT,
    transaction_reference TEXT,
    
    -- Status & Approval
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'assigned_to_leader')),
    assigned_member_id UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_by_member_id UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_by_leader_id UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Related Records
    related_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for wallet_transactions table
CREATE INDEX idx_wallet_trans_user_created ON wallet_transactions(user_id, created_at DESC);
CREATE INDEX idx_wallet_trans_status_city ON wallet_transactions(status, city_id);
CREATE INDEX idx_wallet_trans_assigned_member_status ON wallet_transactions(assigned_member_id, status);
CREATE INDEX idx_wallet_trans_type ON wallet_transactions(type);

-- ============================================
-- 6. MEMBER REPORTS TABLE
-- ============================================
CREATE TABLE member_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Reporter & Reported
    reporter_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_member_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Related Transaction
    transaction_id UUID NOT NULL REFERENCES wallet_transactions(id) ON DELETE CASCADE,
    
    -- Report Details
    reason TEXT NOT NULL,
    details TEXT,
    
    -- Status & Review
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by_leader_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    leader_notes TEXT,
    
    -- Penalty
    penalty_charged BOOLEAN DEFAULT false,
    penalty_transaction_id UUID REFERENCES wallet_transactions(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for member_reports table
CREATE INDEX idx_member_reports_reported_status ON member_reports(reported_member_id, status);
CREATE INDEX idx_member_reports_status_created ON member_reports(status, created_at DESC);
CREATE INDEX idx_member_reports_reporter ON member_reports(reporter_user_id);

-- ============================================
-- 7. SUBSCRIPTION HISTORY TABLE
-- ============================================
CREATE TABLE subscription_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Action Details
    action TEXT NOT NULL CHECK (action IN ('activated', 'renewed', 'expired', 'restored')),
    amount_charged_mru DECIMAL(10,2),
    balance_before_mru DECIMAL(10,2),
    balance_after_mru DECIMAL(10,2),
    next_payment_due TIMESTAMP WITH TIME ZONE,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for subscription_history table
CREATE INDEX idx_subscription_history_user_created ON subscription_history(user_id, created_at DESC);
CREATE INDEX idx_subscription_history_action ON subscription_history(action);

-- ============================================
-- 8. ROLE CHANGE LOGS TABLE
-- ============================================
CREATE TABLE role_change_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User & Leader
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    changed_by_leader_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Role Change
    previous_role TEXT NOT NULL CHECK (previous_role IN ('normal', 'member', 'ex_member', 'leader')),
    new_role TEXT NOT NULL CHECK (new_role IN ('normal', 'member', 'ex_member', 'leader')),
    user_balance_at_change DECIMAL(10,2),
    reason TEXT,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for role_change_logs table
CREATE INDEX idx_role_change_logs_user ON role_change_logs(user_id, created_at DESC);
CREATE INDEX idx_role_change_logs_leader ON role_change_logs(changed_by_leader_id);

-- ============================================
-- 9. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification Details
    type TEXT NOT NULL CHECK (type IN (
        'payment_approved', 'payment_rejected', 'approval_reward', 
        'role_promoted', 'role_demoted', 'subscription_renewed', 
        'subscription_expired', 'report_filed', 'report_resolved', 
        'penalty_charged', 'balance_low', 'post_created', 
        'member_threshold_warning', 'no_member_in_city'
    )),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    
    -- Read Status
    read BOOLEAN DEFAULT false,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for notifications table
CREATE INDEX idx_notifications_user_read_created ON notifications(user_id, read, created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- ============================================
-- 10. SAVED POSTS TABLE (Favorites)
-- ============================================
CREATE TABLE saved_posts (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (user_id, post_id)
);

-- Index for saved_posts table
CREATE INDEX idx_saved_posts_user ON saved_posts(user_id, created_at DESC);
CREATE INDEX idx_saved_posts_post ON saved_posts(post_id);

-- ============================================
-- 11. REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_post ON reviews(post_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update total_favorites count on posts
CREATE OR REPLACE FUNCTION fn_update_post_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE posts SET total_favorites = total_favorites + 1 WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE posts SET total_favorites = total_favorites - 1 WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating favorites count
CREATE TRIGGER trigger_update_post_favorites_count
AFTER INSERT OR DELETE ON saved_posts
FOR EACH ROW
EXECUTE FUNCTION fn_update_post_favorites_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION fn_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at_column();

CREATE TRIGGER trigger_posts_updated_at BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at_column();

CREATE TRIGGER trigger_cities_updated_at BEFORE UPDATE ON cities
FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at_column();

CREATE TRIGGER trigger_wallet_transactions_updated_at BEFORE UPDATE ON wallet_transactions
FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at_column();

CREATE TRIGGER trigger_member_reports_updated_at BEFORE UPDATE ON member_reports
FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at_column();

CREATE TRIGGER trigger_reviews_updated_at BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at_column();

-- Function to generate display_id for posts
CREATE OR REPLACE FUNCTION fn_generate_post_display_id()
RETURNS TRIGGER AS $$
DECLARE
    year_str TEXT;
    seq_num INTEGER;
BEGIN
    year_str := TO_CHAR(NOW(), 'YYYY');
    
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(display_id FROM 'POST-\d{4}-(\d+)') AS INTEGER)), 0) + 1
    INTO seq_num
    FROM posts
    WHERE display_id LIKE 'POST-' || year_str || '-%';
    
    -- Generate new display_id
    NEW.display_id := 'POST-' || year_str || '-' || LPAD(seq_num::TEXT, 4, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate display_id for posts
CREATE TRIGGER trigger_generate_post_display_id
BEFORE INSERT ON posts
FOR EACH ROW
WHEN (NEW.display_id IS NULL)
EXECUTE FUNCTION fn_generate_post_display_id();

-- ============================================
-- SEED DATA - Sample Cities (Mauritania)
-- ============================================
INSERT INTO cities (name, region, is_active) VALUES
('Nouakchott', 'Nouakchott Region', true),
('Nouadhibou', 'Dakhlet Nouadhibou', true),
('Kaédi', 'Gorgol', true),
('Rosso', 'Trarza', true),
('Zouérat', 'Tiris Zemmour', true),
('Atar', 'Adrar', true),
('Kiffa', 'Assaba', true),
('Néma', 'Hodh Ech Chargui', true),
('Aleg', 'Brakna', true),
('Akjoujt', 'Inchiri', true),
('Tidjikja', 'Tagant', true),
('Sélibaby', 'Guidimaka', true),
('Ayoun el Atrous', 'Hodh El Gharbi', true),
('Boutilimit', 'Trarza', true),
('Chinguetti', 'Adrar', true),
('Ouadane', 'Adrar', true),
('Oualata', 'Hodh Ech Chargui', true),
('Timbédra', 'Hodh Ech Chargui', true),
('Bassikounou', 'Hodh Ech Chargui', true),
('Bogué', 'Brakna', true),
('Bir Moghrein', 'Tiris Zemmour', true),
('Fdérik', 'Tiris Zemmour', true),
('Guerou', 'Assaba', true),
('Mbout', 'Gorgol', true),
('Bou Mdeid', 'Tagant', true),
('Adel Bagrou', 'Hodh Ech Chargui', true);

-- ============================================
-- 12. LISTING TYPES TABLE
-- ============================================
CREATE TABLE listing_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_listing_types_slug ON listing_types(slug);
CREATE INDEX idx_listing_types_active ON listing_types(is_active);

-- ============================================
-- 13. PROPERTY TYPES TABLE
-- ============================================
CREATE TABLE property_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_property_types_slug ON property_types(slug);
CREATE INDEX idx_property_types_active ON property_types(is_active);

-- ============================================
-- 14. AMENITIES TABLE
-- ============================================
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    category TEXT NOT NULL CHECK (category IN ('indoor', 'nearby')),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_amenities_slug ON amenities(slug);
CREATE INDEX idx_amenities_category ON amenities(category);
CREATE INDEX idx_amenities_active ON amenities(is_active);

-- ============================================
-- 15. CATEGORY FIELDS TABLE (Dynamic Form Fields)
-- ============================================
CREATE TABLE category_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    field_key TEXT NOT NULL,
    field_label TEXT NOT NULL,
    field_type TEXT NOT NULL CHECK (field_type IN ('text', 'number', 'select', 'multiselect', 'checkbox', 'textarea')),
    options JSONB,
    placeholder TEXT,
    is_required BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_category_fields_category ON category_fields(category_id);
CREATE INDEX idx_category_fields_active ON category_fields(is_active);

-- ============================================
-- 16. POST AMENITIES TABLE (Junction Table)
-- ============================================
CREATE TABLE post_amenities (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (post_id, amenity_id)
);

CREATE INDEX idx_post_amenities_post ON post_amenities(post_id);
CREATE INDEX idx_post_amenities_amenity ON post_amenities(amenity_id);

-- Enable RLS on new tables
ALTER TABLE listing_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_amenities ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Everyone can read
CREATE POLICY listing_types_select_all ON listing_types FOR SELECT USING (is_active = true);
CREATE POLICY property_types_select_all ON property_types FOR SELECT USING (is_active = true);
CREATE POLICY amenities_select_all ON amenities FOR SELECT USING (is_active = true);
CREATE POLICY category_fields_select_all ON category_fields FOR SELECT USING (is_active = true);
CREATE POLICY post_amenities_select_all ON post_amenities FOR SELECT USING (true);
CREATE POLICY post_amenities_insert_own ON post_amenities FOR INSERT WITH CHECK (true);
CREATE POLICY post_amenities_delete_own ON post_amenities FOR DELETE USING (true);

-- ============================================
-- SEED DATA - Service Categories (with icons)
-- ============================================
INSERT INTO service_categories (name, slug, type, description, metadata) VALUES
('Property', 'property', 'property', 'Real estate listings including houses, apartments, and land', '{"icon": "home", "sort_order": 1}'),
('Phones', 'phones', 'electronics', 'Mobile phones and accessories', '{"icon": "smartphone", "sort_order": 2}'),
('Laptops', 'laptops', 'electronics', 'Laptops and computers', '{"icon": "monitor", "sort_order": 3}'),
('Electronics', 'electronics', 'electronics', 'Electronic devices and gadgets', '{"icon": "zap", "sort_order": 4}'),
('Cars', 'cars', 'vehicles', 'Automobiles and vehicles', '{"icon": "truck", "sort_order": 5}'),
('Furniture', 'furniture', 'home', 'Home furniture and decor', '{"icon": "box", "sort_order": 6}'),
('Others', 'others', 'other', 'Miscellaneous items', '{"icon": "package", "sort_order": 7}');

-- ============================================
-- SEED DATA - Listing Types
-- ============================================
INSERT INTO listing_types (name, slug, icon, sort_order) VALUES
('For Rent', 'rent', 'key', 1),
('For Sale', 'sale', 'tag', 2),
('Short-term Rental', 'short_term', 'calendar', 3),
('Daily Rental', 'daily', 'clock', 4);

-- ============================================
-- SEED DATA - Property Types
-- ============================================
INSERT INTO property_types (name, slug, icon, sort_order) VALUES
('Apartment', 'apartment', 'home', 1),
('House', 'house', 'home', 2),
('Villa', 'villa', 'home', 3),
('Land', 'land', 'map', 4),
('Shop', 'shop', 'shopping-bag', 5),
('Office', 'office', 'briefcase', 6),
('Warehouse', 'warehouse', 'package', 7);

-- ============================================
-- SEED DATA - Amenities (Indoor)
-- ============================================
INSERT INTO amenities (name, slug, icon, category, sort_order) VALUES
('Wi-Fi', 'wifi', 'wifi', 'indoor', 1),
('Air Conditioning', 'ac', 'wind', 'indoor', 2),
('Parking', 'parking', 'truck', 'indoor', 3),
('Kitchen', 'kitchen', 'coffee', 'indoor', 4),
('Water', 'water', 'droplet', 'indoor', 5),
('Electricity', 'electricity', 'zap', 'indoor', 6),
('Furnished', 'furnished', 'box', 'indoor', 7),
('Security', 'security', 'shield', 'indoor', 8),
('Generator', 'generator', 'battery', 'indoor', 9),
('Balcony', 'balcony', 'maximize', 'indoor', 10);

-- ============================================
-- SEED DATA - Amenities (Nearby)
-- ============================================
INSERT INTO amenities (name, slug, icon, category, sort_order) VALUES
('Mosque', 'mosque', 'map-pin', 'nearby', 1),
('School', 'school', 'book', 'nearby', 2),
('Hospital', 'hospital', 'plus-circle', 'nearby', 3),
('Market', 'market', 'shopping-cart', 'nearby', 4),
('Gym', 'gym', 'activity', 'nearby', 5),
('Laundry', 'laundry', 'refresh-cw', 'nearby', 6),
('Restaurant', 'restaurant', 'coffee', 'nearby', 7),
('Bank', 'bank', 'credit-card', 'nearby', 8);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

-- Cities: Everyone can read active cities
CREATE POLICY cities_select_all ON cities
FOR SELECT USING (is_active = true);

-- Service Categories: Everyone can read
CREATE POLICY service_categories_select_all ON service_categories
FOR SELECT USING (true);

-- Users: Users can view all users (for public profiles)
CREATE POLICY users_select_all ON users
FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY users_update_own ON users
FOR UPDATE USING (auth.uid() = id);

-- Users can insert themselves (registration)
CREATE POLICY users_insert_own ON users
FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts: Users can view paid & active posts OR their own posts
CREATE POLICY posts_select_policy ON posts
FOR SELECT USING (
    (paid = true AND status = 'active') OR 
    (user_id = auth.uid())
);

-- Posts: Users can insert their own posts (including guest user)
CREATE POLICY posts_insert_own ON posts
FOR INSERT WITH CHECK (
  user_id = auth.uid() OR 
  user_id = 'u0000000-0000-0000-0000-000000000001'::uuid
);

-- Posts: Users can update their own posts
CREATE POLICY posts_update_own ON posts
FOR UPDATE USING (user_id = auth.uid());

-- Posts: Users can delete their own posts
CREATE POLICY posts_delete_own ON posts
FOR DELETE USING (user_id = auth.uid());

-- Wallet transactions: Users can view their own transactions
CREATE POLICY wallet_transactions_select_own ON wallet_transactions
FOR SELECT USING (user_id = auth.uid());

-- Wallet transactions: Users can insert their own transactions
CREATE POLICY wallet_transactions_insert_own ON wallet_transactions
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Notifications: Users can view their own notifications
CREATE POLICY notifications_select_own ON notifications
FOR SELECT USING (user_id = auth.uid());

-- Notifications: Users can update their own notifications (mark as read)
CREATE POLICY notifications_update_own ON notifications
FOR UPDATE USING (user_id = auth.uid());

-- Saved posts: Users can view their own saved posts
CREATE POLICY saved_posts_select_own ON saved_posts
FOR SELECT USING (user_id = auth.uid());

-- Saved posts: Users can insert their own saved posts
CREATE POLICY saved_posts_insert_own ON saved_posts
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Saved posts: Users can delete their own saved posts
CREATE POLICY saved_posts_delete_own ON saved_posts
FOR DELETE USING (user_id = auth.uid());

-- Reviews: Everyone can view reviews
CREATE POLICY reviews_select_all ON reviews
FOR SELECT USING (true);

-- Reviews: Users can insert their own reviews
CREATE POLICY reviews_insert_own ON reviews
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Reviews: Users can update their own reviews
CREATE POLICY reviews_update_own ON reviews
FOR UPDATE USING (user_id = auth.uid());

-- Reviews: Users can delete their own reviews
CREATE POLICY reviews_delete_own ON reviews
FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE users IS '4-tier user system: normal, member, ex_member, leader';
COMMENT ON TABLE posts IS 'Property rental listings with city-based visibility';
COMMENT ON TABLE wallet_transactions IS 'All wallet activities including deposits, payments, rewards, subscriptions, penalties';
COMMENT ON TABLE member_reports IS 'User reports against members for unfair payment rejections';
COMMENT ON TABLE subscription_history IS 'Ex-member subscription payment history';
COMMENT ON TABLE role_change_logs IS 'Audit trail for all role promotions/demotions by leader';

COMMENT ON COLUMN users.role IS 'User role: normal, member, ex_member, or leader';
COMMENT ON COLUMN users.wallet_balance_mru IS 'Current wallet balance in Mauritanian Ouguiya (MRU)';
COMMENT ON COLUMN users.free_posts_remaining IS 'Remaining free posts (5 max for normal users, non-refundable)';
COMMENT ON COLUMN users.ex_member_next_payment_due IS 'Next 500 MRU subscription payment due date for ex-members';
COMMENT ON COLUMN posts.display_id IS 'Human-readable post ID shown to leaders (e.g., POST-2025-0001)';
COMMENT ON COLUMN posts.paid IS 'Whether post is paid and visible on home feed';
COMMENT ON COLUMN wallet_transactions.type IS 'Transaction type: deposit, post_payment, approval_reward, ex_member_subscription, report_penalty, refund';

-- ============================================
-- STORAGE BUCKET POLICIES FOR POST IMAGES
-- ============================================
-- Run these in Supabase SQL Editor after creating the 'post-images' bucket

-- Create the storage bucket (if not exists via dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);

-- Allow authenticated users to upload images to their own folder
CREATE POLICY "Users can upload post images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'post-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update own post images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'post-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete own post images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'post-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to all post images
CREATE POLICY "Public can view post images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-images');
