-- Atomic Wallet Transaction Function
-- This function ensures wallet balance updates are atomic and prevents race conditions

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
SET search_path = public
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

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;

  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: You do not own this wallet';
  END IF;

  -- Validate transaction type
  IF p_type NOT IN ('credit', 'debit') THEN
    RAISE EXCEPTION 'Invalid transaction type. Must be credit or debit';
  END IF;

  -- Validate amount
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than zero';
  END IF;

  -- Start transaction (implicit in function)
  -- Insert transaction record
  INSERT INTO wallet_transactions (
    wallet_id,
    type,
    amount,
    description,
    category,
    status
  )
  VALUES (
    p_wallet_id,
    p_type,
    p_amount,
    p_description,
    p_category,
    'completed'
  )
  RETURNING id INTO v_transaction_id;

  -- Update balance atomically
  UPDATE wallet_accounts
  SET 
    balance = CASE
      WHEN p_type = 'credit' THEN balance + p_amount
      WHEN p_type = 'debit' THEN balance - p_amount
    END,
    updated_at = NOW()
  WHERE id = p_wallet_id
  RETURNING balance INTO v_new_balance;

  -- Return result as JSON
  RETURN json_build_object(
    'transaction_id', v_transaction_id,
    'new_balance', v_new_balance,
    'success', true
  );

EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and re-raise
    RAISE NOTICE 'Error in add_wallet_transaction: %', SQLERRM;
    RAISE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION add_wallet_transaction TO authenticated;

-- Comment on function
COMMENT ON FUNCTION add_wallet_transaction IS 
'Atomically adds a transaction to a wallet and updates the balance. 
Ensures no race conditions occur when multiple transactions happen simultaneously.
Returns JSON with transaction_id, new_balance, and success flag.';


-- Increment Post Likes Function (optional - for optimizing like counts)
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_count INTEGER;
BEGIN
  UPDATE posts
  SET 
    likes_count = likes_count + 1,
    updated_at = NOW()
  WHERE id = post_id
  RETURNING likes_count INTO v_new_count;

  IF v_new_count IS NULL THEN
    RAISE EXCEPTION 'Post not found';
  END IF;

  RETURN v_new_count;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_post_likes TO authenticated;

COMMENT ON FUNCTION increment_post_likes IS 
'Atomically increments the likes count for a post.
Returns the new like count.';
