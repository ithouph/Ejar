# Backend Processing Guide - Ejar Payment Requests

## 📊 Payment Request Status Flow

```
User submits request
        ↓
   🟡 pending     (waiting for review)
        ↓
   🔵 processing  (being reviewed by support)
        ↓
   🟣 processed   (review completed)
        ↓
   ✅ approved    (balance added automatically)
        OR
   ❌ rejected    (with reason provided)
```

---

## 🗄️ Database Table: `payment_requests`

### Fields Added for Backend Processing:

| Field | Type | Description |
|-------|------|-------------|
| `status` | TEXT | Current status (pending/processing/processed/approved/rejected) |
| `processed_by` | UUID | Admin/Support user who processed this request |
| `processed_at` | TIMESTAMP | When the request was processed |
| `admin_notes` | TEXT | Internal notes from support team |
| `rejection_reason` | TEXT | Reason if rejected (shown to user) |

---

## 🔧 Backend Function: `process_payment_request()`

### Approve a Payment Request:

```sql
-- Approve payment request and automatically add balance
SELECT process_payment_request(
  'request-uuid-here',  -- The payment request ID
  'approved',           -- New status
  'Payment verified via bank transfer', -- Admin notes
  NULL                  -- No rejection reason
);
```

**What happens:**
1. ✅ Updates request status to "approved"
2. ✅ Records when it was processed
3. ✅ **Automatically adds balance to user's wallet**
4. ✅ **Creates transaction record in wallet_transactions**
5. ✅ Returns new balance

### Reject a Payment Request:

```sql
-- Reject payment request
SELECT process_payment_request(
  'request-uuid-here',
  'rejected',
  'Invalid payment proof image',
  'The payment screenshot does not match our records. Please upload a valid proof.'
);
```

**What happens:**
1. ❌ Updates request status to "rejected"
2. ❌ Stores rejection reason (user will see this)
3. ❌ No balance is added

### Mark as Processing:

```sql
-- Mark as being reviewed
SELECT process_payment_request(
  'request-uuid-here',
  'processing',
  'Verifying with bank',
  NULL
);
```

---

## 📱 How It Works in the App

### 1. User Flow:
```
User in App → Balance Page → Add Balance
    ↓
Opens Support Chat
    ↓
Sends payment proof image
    ↓
Waits for approval
```

### 2. Backend/Support Flow:
```
Support Team reviews request
    ↓
Checks payment proof
    ↓
Calls database function:
  - process_payment_request(id, 'approved', ...)
    ↓
User's wallet balance updated automatically
```

### 3. User Sees:
```
✅ "Your balance request has been approved!"
💰 New balance: $100.00
📋 Transaction appears in wallet history
```

---

## 🔐 Security Features

- ✅ **Row Level Security**: Users can only see their own payment requests
- ✅ **Atomic Operations**: Balance updates are atomic (no race conditions)
- ✅ **Status Validation**: Only valid statuses are allowed
- ✅ **Audit Trail**: All actions are timestamped

---

## 📝 Example Queries for Backend Admin

### View all pending requests:
```sql
SELECT 
  pr.id,
  u.full_name,
  u.email,
  pr.amount,
  pr.status,
  pr.created_at
FROM payment_requests pr
JOIN users u ON u.id = pr.user_id
WHERE pr.status = 'pending'
ORDER BY pr.created_at ASC;
```

### View support chat for a request:
```sql
SELECT 
  message,
  image_url,
  sender_type,
  created_at
FROM support_messages
WHERE payment_request_id = 'request-uuid-here'
ORDER BY created_at ASC;
```

### Approve multiple requests at once:
```sql
-- Process each request
SELECT process_payment_request(id, 'approved', 'Batch approval', NULL)
FROM payment_requests
WHERE status = 'pending' 
  AND amount <= 100  -- Only small amounts
  AND created_at < NOW() - INTERVAL '1 hour';
```

---

## 🎯 Best Practices

1. **Always provide admin_notes** - Helps with auditing
2. **Provide clear rejection reasons** - Users need to know what went wrong
3. **Process requests in order** - First come, first served (ORDER BY created_at)
4. **Verify payment proof** - Always check the uploaded image
5. **Keep users informed** - Send notifications when status changes

---

## ⚡ Quick Reference

| Action | SQL Command |
|--------|-------------|
| Approve | `process_payment_request(id, 'approved', 'notes', NULL)` |
| Reject | `process_payment_request(id, 'rejected', 'notes', 'reason')` |
| Processing | `process_payment_request(id, 'processing', 'notes', NULL)` |
| Processed | `process_payment_request(id, 'processed', 'notes', NULL)` |

---

## 🔄 Integration with Support Chat

The `support_messages` table links to `payment_requests`:

```sql
-- Get all messages for a payment request
SELECT * FROM support_messages 
WHERE payment_request_id = 'request-uuid'
ORDER BY created_at;

-- User messages: sender_type = 'user'
-- Support replies: sender_type = 'support'
```

---

**Ready to use!** Execute `SETUP_DATABASE.sql` in Supabase to enable backend processing.
