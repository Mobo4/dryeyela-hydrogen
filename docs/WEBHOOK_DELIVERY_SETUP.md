# Shopify Webhook Delivery Setup

**Service Account Email:** `delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com`

**Purpose:** Google Cloud Pub/Sub service account for Shopify webhook delivery

---

## 🔍 What This Is

This is a **Google Cloud Service Account** email used by Shopify to deliver webhooks via Google Cloud Pub/Sub.

**When you need it:**
- Setting up webhook subscriptions in Shopify
- Configuring Google Cloud Pub/Sub for webhook delivery
- Setting up event-driven integrations

---

## 📋 Where to Use This Email

### Option 1: Shopify Admin Webhook Configuration

**If configuring webhooks in Shopify Admin:**

1. **Go to:** Shopify Admin → Settings → Notifications
2. **Or:** Settings → Apps and sales channels → Your app → Webhooks
3. **When setting up webhook delivery:**
   - Select **"Google Cloud Pub/Sub"** as delivery method
   - Enter service account: `delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com`
   - Configure topic and subscription

### Option 2: Shopify Partners App Configuration

**If configuring in Shopify Partners:**

1. **Go to:** https://partners.shopify.com
2. **Your App** → **App setup** → **Webhooks**
3. **Add webhook:**
   - Select event (e.g., `orders/create`, `products/update`)
   - Delivery method: **Google Cloud Pub/Sub**
   - Service account: `delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com`
   - Topic: Your GCP Pub/Sub topic name

### Option 3: Google Cloud Console

**If setting up in Google Cloud:**

1. **Go to:** Google Cloud Console → IAM & Admin → Service Accounts
2. **Grant permissions** to: `delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com`
3. **Required permissions:**
   - `pubsub.topics.publish` (for webhook delivery)
   - `pubsub.subscriptions.create` (if creating subscriptions)

---

## 🔧 Common Webhook Events for Hydrogen

**Typical webhooks you might want:**

| Event | Purpose |
|-------|---------|
| `orders/create` | New order notifications |
| `orders/updated` | Order status changes |
| `products/create` | New product added |
| `products/update` | Product changes |
| `products/delete` | Product removed |
| `inventory_levels/update` | Stock level changes |
| `app/uninstalled` | App removal notification |

---

## 📝 Configuration Steps

### Step 1: Set Up Google Cloud Pub/Sub (If Not Done)

1. **Create Pub/Sub Topic:**
   ```bash
   gcloud pubsub topics create shopify-webhooks
   ```

2. **Create Subscription:**
   ```bash
   gcloud pubsub subscriptions create shopify-webhooks-sub \
     --topic=shopify-webhooks
   ```

3. **Grant Service Account Access:**
   ```bash
   gcloud pubsub topics add-iam-policy-binding shopify-webhooks \
     --member="serviceAccount:delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com" \
     --role="roles/pubsub.publisher"
   ```

### Step 2: Configure in Shopify

**In Shopify Admin or Partners:**

1. Navigate to webhook settings
2. Add new webhook
3. Select event type
4. Choose **Google Cloud Pub/Sub** delivery
5. Enter:
   - **Service Account:** `delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com`
   - **Topic:** Your GCP topic name (e.g., `shopify-webhooks`)
   - **Project ID:** Your Google Cloud project ID

### Step 3: Create Webhook Handler (Optional)

If you want to handle webhooks in your Hydrogen app:

**Create:** `app/routes/($locale).api.webhooks.tsx`

```typescript
import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

export async function action({ request }: ActionFunctionArgs) {
  // Verify webhook signature
  // Process webhook payload
  // Update your system
  
  return json({ received: true });
}
```

---

## 🔐 Security Notes

**Important:**
- This service account is managed by Shopify
- You don't need to create or manage it
- Shopify uses it to deliver webhooks to your Pub/Sub topic
- Make sure your Pub/Sub topic has proper IAM permissions

**Verification:**
- Always verify webhook signatures
- Use HTTPS endpoints
- Validate webhook payloads

---

## 📚 Related Documentation

- **Shopify Webhooks:** https://shopify.dev/docs/api/admin-rest/2024-10/resources/webhook
- **Google Cloud Pub/Sub:** https://cloud.google.com/pubsub/docs
- **Hydrogen API Routes:** See `app/routes/($locale).api.*.tsx` examples

---

## ✅ Quick Checklist

- [ ] Google Cloud Pub/Sub topic created
- [ ] Service account has publish permissions
- [ ] Webhook configured in Shopify Admin/Partners
- [ ] Service account email added: `delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com`
- [ ] Webhook handler route created (if needed)
- [ ] Webhook signature verification implemented
- [ ] Test webhook delivery

---

## 🆘 Troubleshooting

**Webhooks not arriving:**
- Check Pub/Sub topic permissions
- Verify service account has access
- Check webhook configuration in Shopify
- Review Google Cloud logs

**Permission errors:**
- Ensure service account has `pubsub.publisher` role
- Check topic IAM bindings
- Verify project ID is correct
