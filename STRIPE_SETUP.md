# 🚀 Stripe Integration Setup Guide

This guide will help you set up Stripe billing for your Omniplex project.

## 📋 Prerequisites

- Node.js and yarn installed
- Firebase project set up
- Stripe account (free to create)

## 🏃‍♂️ Quick Setup

### 1. Create Stripe Account
1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Create your account and complete verification
3. Switch to **Test Mode** (toggle in the top right)

### 2. Get API Keys
1. Go to **Developers → API keys** in your Stripe dashboard
2. Copy your **Test Keys**:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 3. Update Environment Variables
Edit your `.env` file and replace the placeholders:

```env
# Replace these with your actual Stripe test keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
# Webhook secret (we'll set this up later)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 4. Test the Integration
1. Start your development server:
   ```bash
   yarn dev
   ```

2. Navigate to `/pricing` in your browser
3. Try the test payment with card: `4242 4242 4242 4242`
4. Use any future date for expiry and any 3 digits for CVC

## 🌐 Setting Up Webhooks (Optional but Recommended)

Webhooks allow Stripe to notify your app about payment events.

### 1. Install Stripe CLI (for local testing)
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (via Scoop)
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Or download from: https://github.com/stripe/stripe-cli/releases/latest
```

### 2. Login to Stripe CLI
```bash
stripe login
```

### 3. Forward events to your local server
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will give you a webhook secret starting with `whsec_`. Add this to your `.env` file.

### 4. Test webhook events
In another terminal:
```bash
stripe trigger payment_intent.succeeded
```

## 🎯 Features Included

✅ **Complete Stripe Integration**
- Checkout sessions for subscriptions
- Webhook handling for payment events
- Test mode configuration

✅ **User Interface**
- Pricing page with test card information
- Subscription management
- Usage tracking for free users
- Pro upgrade banners

✅ **Database Integration**
- Firestore integration for user subscriptions
- Automatic subscription status updates

✅ **Security**
- Server-side API key handling
- Webhook signature verification
- Proper error handling

## 🔧 Available Routes

- `/pricing` - Pricing and subscription page
- `/settings` - Account and billing management
- `/payment/success` - Post-payment success page
- `/payment/cancel` - Payment cancellation page

## 📱 Test Cards

For testing purposes, use these Stripe test cards:

| Card Number | Description |
|------------|-------------|
| `4242 4242 4242 4242` | Visa - Success |
| `4000 0000 0000 0002` | Visa - Declined |
| `4000 0000 0000 9995` | Visa - Insufficient funds |

## 🚀 Going Live

When you're ready for production:

1. Switch to **Live Mode** in Stripe dashboard
2. Get your **Live API keys**
3. Update your `.env` with live keys
4. Set up production webhooks pointing to your deployed app
5. Update webhook secret in production environment

## 📞 Support

- **Stripe Documentation**: [https://stripe.com/docs](https://stripe.com/docs)
- **Stripe Dashboard**: [https://dashboard.stripe.com](https://dashboard.stripe.com)
- **Test Integration**: Use the test card `4242 4242 4242 4242`

## 💡 Tips

1. Always use test mode during development
2. Monitor your Stripe dashboard for test payments
3. Set up proper error handling for failed payments
4. Consider adding email notifications for successful subscriptions
5. Implement proper logging for debugging

---

🎉 **That's it!** Your Stripe integration is ready to go. Users can now subscribe to your Pro plan!
