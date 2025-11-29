-- ==========================================
-- EJAR APP - DATABASE FUNCTIONS
-- ==========================================

-- ==========================================
-- 1. Update Post Rating & Total Reviews
-- ==========================================
CREATE OR REPLACE FUNCTION fn_update_post_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE posts
  SET 
    rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE post_id = NEW.post_id), 0),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE post_id = NEW.post_id),
    updated_at = NOW()
  WHERE id = NEW.post_id;

  RETURN NEW;
END;
$$;

-- Trigger for reviews
DROP TRIGGER IF EXISTS trigger_update_post_rating ON reviews;
CREATE TRIGGER trigger_update_post_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION fn_update_post_rating();

-- ==========================================
-- 2. Update Saved Count on Posts
-- ==========================================
CREATE OR REPLACE FUNCTION fn_update_post_saved_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE posts
  SET total_saved = (SELECT COUNT(*) FROM saved_posts WHERE post_id = NEW.post_id),
      updated_at = NOW()
  WHERE id = NEW.post_id;

  RETURN NEW;
END;
$$;

-- Trigger for saved_posts
DROP TRIGGER IF EXISTS trigger_update_post_saved_count ON saved_posts;
CREATE TRIGGER trigger_update_post_saved_count
AFTER INSERT OR DELETE ON saved_posts
FOR EACH ROW
EXECUTE FUNCTION fn_update_post_saved_count();

-- ==========================================
-- 3. Update Likes Count on Posts (Favorites)
-- ==========================================
CREATE OR REPLACE FUNCTION fn_update_post_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE posts
  SET likes_count = (SELECT COUNT(*) FROM favorites WHERE post_id = NEW.post_id),
      updated_at = NOW()
  WHERE id = NEW.post_id;

  RETURN NEW;
END;
$$;

-- Trigger for favorites
DROP TRIGGER IF EXISTS trigger_update_post_likes_count ON favorites;
CREATE TRIGGER trigger_update_post_likes_count
AFTER INSERT OR DELETE ON favorites
FOR EACH ROW
EXECUTE FUNCTION fn_update_post_likes_count();

-- ==========================================
-- 4. Atomic Wallet Transaction Function
-- ==========================================
CREATE OR REPLACE FUNCTION add_wallet_transaction(
  p_wallet_id UUID,
  p_type TEXT,
  p_amount NUMERIC,
  p_description TEXT,
  p_category TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_transaction_id UUID;
  v_new_balance NUMERIC;
  v_user_id UUID;
BEGIN
  -- Verify user owns the wallet
  SELECT user_id INTO v_user_id
  FROM wallet_accounts
  WHERE id = p_wallet_id;

  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Start transaction
  BEGIN
    -- Insert transaction
    INSERT INTO wallet_transactions (wallet_id, type, amount, description, category, status)
    VALUES (p_wallet_id, p_type, p_amount, p_description, p_category, 'completed')
    RETURNING id INTO v_transaction_id;

    -- Update balance atomically
    UPDATE wallet_accounts
    SET balance = CASE
      WHEN p_type = 'credit' THEN balance + p_amount
      ELSE balance - p_amount
    END
    WHERE id = p_wallet_id
    RETURNING balance INTO v_new_balance;

    -- Return result
    RETURN json_build_object(
      'transaction_id', v_transaction_id,
      'new_balance', v_new_balance
    );
  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END;
END;
$$;

-- ==========================================
-- 5. Optional: Function for Posts Photos Count
-- ==========================================
CREATE OR REPLACE FUNCTION fn_update_post_photos_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE posts
  SET total_photos = (SELECT COUNT(*) FROM posts_photos WHERE post_id = NEW.post_id),
      updated_at = NOW()
  WHERE id = NEW.post_id;

  RETURN NEW;
END;
$$;

-- Trigger for posts_photos
DROP TRIGGER IF EXISTS trigger_update_post_photos_count ON posts_photos;
CREATE TRIGGER trigger_update_post_photos_count
AFTER INSERT OR DELETE ON posts_photos
FOR EACH ROW
EXECUTE FUNCTION fn_update_post_photos_count();
