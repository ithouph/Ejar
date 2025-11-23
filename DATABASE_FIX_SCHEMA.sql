-- ════════════════════════════════════════════════════════════════════
-- DATABASE SCHEMA FIX
-- ════════════════════════════════════════════════════════════════════
-- This script updates your existing database to match the latest schema.
-- Run this in Supabase SQL Editor if you have data you want to keep.
-- 
-- WHAT THIS FIXES:
-- 1. Renames photo_url → avatar_url in users table
-- 2. Removes whatsapp column from user_profiles table
-- ════════════════════════════════════════════════════════════════════

-- Fix 1: Rename photo_url to avatar_url in users table
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'photo_url'
    ) THEN
        ALTER TABLE users RENAME COLUMN photo_url TO avatar_url;
        RAISE NOTICE 'Renamed photo_url to avatar_url in users table';
    ELSE
        RAISE NOTICE 'Column photo_url does not exist, skipping rename';
    END IF;
END $$;

-- Fix 2: Remove whatsapp column from user_profiles table (if exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'whatsapp'
    ) THEN
        ALTER TABLE user_profiles DROP COLUMN whatsapp;
        RAISE NOTICE 'Removed whatsapp column from user_profiles table';
    ELSE
        RAISE NOTICE 'Column whatsapp does not exist, skipping removal';
    END IF;
END $$;

-- ════════════════════════════════════════════════════════════════════
-- VERIFICATION
-- ════════════════════════════════════════════════════════════════════
-- Check the current schema to verify changes
SELECT 
    'users table columns:' as info,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

SELECT 
    'user_profiles table columns:' as info,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;
