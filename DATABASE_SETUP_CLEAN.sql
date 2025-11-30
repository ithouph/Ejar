-- EJAR DATABASE SCHEMA - SIMPLIFIED
-- Phone number only login system
-- Posts approval system with paid/unpaid posts

CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  phone_number text NOT NULL UNIQUE,
  whatsapp_phone text,
  post_limit integer DEFAULT 5,
  posts_count integer DEFAULT 0,
  is_member boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.cities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cities_pkey PRIMARY KEY (id)
);

CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text DEFAULT 'property'::text,
  listing_type text,
  property_type text,
  location text NOT NULL,
  price numeric,
  image_url text,
  images text[] DEFAULT '{}'::text[],
  amenities text[] DEFAULT '{}'::text[],
  specifications jsonb DEFAULT '{}'::jsonb,
  is_paid boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  payment_approved boolean DEFAULT false,
  hit_limit boolean DEFAULT false,
  likes_count integer DEFAULT 0,
  rating numeric DEFAULT 0,
  total_reviews integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  post_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT reviews_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE
);

CREATE TABLE public.saved_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  post_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT saved_posts_pkey PRIMARY KEY (id),
  CONSTRAINT saved_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT saved_posts_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE,
  CONSTRAINT saved_posts_unique UNIQUE(user_id, post_id)
);

CREATE TABLE public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  post_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT favorites_pkey PRIMARY KEY (id),
  CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT favorites_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE,
  CONSTRAINT favorites_unique UNIQUE(user_id, post_id)
);

CREATE TABLE public.wallet_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  balance numeric DEFAULT 0,
  currency text DEFAULT 'MRU'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT wallet_accounts_pkey PRIMARY KEY (id),
  CONSTRAINT wallet_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE public.wallet_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL,
  type text NOT NULL,
  amount numeric NOT NULL,
  description text,
  category text,
  status text DEFAULT 'completed'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT wallet_transactions_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallet_accounts(id) ON DELETE CASCADE
);

CREATE TABLE public.payment_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  post_id uuid,
  amount numeric NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  payment_method text,
  transaction_id text,
  processed_by uuid,
  processed_at timestamp with time zone,
  rejection_reason text,
  admin_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payment_requests_pkey PRIMARY KEY (id),
  CONSTRAINT payment_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT payment_requests_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE
);

CREATE TABLE public.service_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text,
  description text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_categories_pkey PRIMARY KEY (id)
);

CREATE TABLE public.support_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  payment_request_id uuid,
  message text,
  image_url text,
  sender_type text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT support_messages_pkey PRIMARY KEY (id),
  CONSTRAINT support_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT support_messages_payment_request_id_fkey FOREIGN KEY (payment_request_id) REFERENCES public.payment_requests(id) ON DELETE CASCADE
);
