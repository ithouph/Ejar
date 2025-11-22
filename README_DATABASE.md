# 🗄️ Ejar Database Documentation

Complete database setup and management guide for the Ejar marketplace app.

---

## 📋 Quick Links

- **[Setup Instructions](DATABASE_SETUP_INSTRUCTIONS.md)** - Step-by-step database setup guide
- **[Database Schema](DATABASE_SCHEMA.md)** - Complete table documentation
- **[Dummy Data Guide](HOW_TO_ADD_DUMMY_DATA.md)** - Add sample data for testing
- **[RLS Policies](DATABASE_RLS_POLICIES.md)** - Security policy documentation
- **[Migrations](DATABASE_MIGRATIONS.sql)** - Database update scripts

---

## 🚀 Getting Started

### New Project Setup

**Step 1:** Create tables and security policies
```sql
-- Run this in Supabase SQL Editor
-- File: DATABASE_SETUP_CLEAN.sql
```

**Step 2:** Add sample data (optional)
```sql
-- Run this in Supabase SQL Editor
-- File: SEED_DATA.sql
```

**Total time:** ~5 minutes ✅

---

## 📊 Database Overview

### Core Tables

| Table | Purpose | Records (Sample) |
|-------|---------|------------------|
| `users` | User authentication | 10 users |
| `posts` | Marketplace listings | 10 posts |
| `wallet_accounts` | User wallets | 10 accounts |
| `wallet_transactions` | Transaction history | 10 transactions |
| `balance_requests` | Top-up requests | 10 requests |
| `payment_requests` | Payment approvals | 10 requests |
| `saved_posts` | Saved/favorited posts | 10 saved |
| `property_reviews` | Post reviews | 10 reviews |

### Legacy Tables (Properties)

| Table | Purpose |
|-------|---------|
| `properties` | Hotel/apartment listings |
| `property_photos` | Property images |
| `amenities` | Property features |
| `favorites` | Saved properties |
| `reviews` | Property reviews |

---

## 🔒 Security Features

All tables use **Row Level Security (RLS)**:

✅ **Public Read** - Posts, properties, reviews  
✅ **User-Specific Write** - Users edit only their data  
✅ **Member-Only Access** - Payment requests require authentication  
✅ **Automatic Updates** - Triggers update ratings automatically

---

## 🛠 Available SQL Files

### Setup Files
- **`DATABASE_SETUP_CLEAN.sql`** - Complete database setup (tables + RLS + indexes)
- **`SEED_DATA.sql`** - 10 sample records per table for testing

### Documentation Files
- **`DATABASE_SCHEMA.md`** - Detailed schema documentation
- **`DATABASE_RLS_POLICIES.md`** - Security policies explained
- **`DATABASE_MIGRATIONS.sql`** - Migration scripts for updates

### Guide Files
- **`DATABASE_SETUP_INSTRUCTIONS.md`** - Setup walkthrough
- **`HOW_TO_ADD_DUMMY_DATA.md`** - Sample data guide
- **`SUPABASE_SETUP_GUIDE.md`** - Complete Supabase integration

---

## 📱 Marketplace Categories

The `posts` table supports these categories:

1. **Phones** - Mobile devices (iPhone, Samsung, etc.)
2. **Laptops** - Computers (MacBook, Windows, etc.)
3. **Electronics** - TVs, cameras, gadgets
4. **Cars** - Vehicles (Toyota, Honda, etc.)
5. **Property** - Houses, apartments, land (rent/sell)

---

## 💾 Sample Data

SEED_DATA.sql includes:

- **10 Users** - Ahmed, Fatima, Ibrahim, etc.
- **10 Posts** - Mixed categories (phones, laptops, cars, property)
- **10 Wallet Accounts** - Balances from 30,000 to 200,000 MRU
- **10 Reviews** - 4-5 star ratings
- **10 Payment Requests** - Pending, approved, rejected statuses

---

## ✅ Verification

After setup, run this query to verify:

```sql
SELECT 'Users' as table_name, COUNT(*) as records FROM users
UNION ALL
SELECT 'Posts', COUNT(*) FROM posts
UNION ALL
SELECT 'Wallet Accounts', COUNT(*) FROM wallet_accounts
UNION ALL
SELECT 'Saved Posts', COUNT(*) FROM saved_posts
UNION ALL
SELECT 'Payment Requests', COUNT(*) FROM payment_requests;
```

Expected output (with dummy data):
```
Users: 10
Posts: 10
Wallet Accounts: 10
Saved Posts: 10
Payment Requests: 10
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Duplicate key error** | Normal with dummy data - script uses `ON CONFLICT DO NOTHING` |
| **Permission denied** | Log in as project owner in Supabase |
| **Relation does not exist** | Run `DATABASE_SETUP_CLEAN.sql` before `SEED_DATA.sql` |
| **RLS errors in app** | Ensure you ran the complete setup script with policies |

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎯 Next Steps

After database setup:

1. ✅ Run `DATABASE_SETUP_CLEAN.sql` in Supabase
2. ✅ Run `SEED_DATA.sql` for test data
3. ✅ Configure Google OAuth ([GOOGLE_AUTH_SETUP.md](GOOGLE_AUTH_SETUP.md))
4. ✅ Start the Expo app and test!

---

**Need help?** Check the troubleshooting section or review the detailed guides linked above.
