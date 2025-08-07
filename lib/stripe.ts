import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance
let stripe: Stripe | null = null;

try {
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.trim() !== '') {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
      typescript: true,
    });
  } else {
    console.warn('Stripe secret key not configured');
  }
} catch (error) {
  console.error('Failed to initialize Stripe:', error);
}

export { stripe };

// Client-side Stripe instance
export const getStripe = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
  }
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
};

// Stripe product configuration
export const STRIPE_PRODUCTS = {
  pro: {
    name: 'Pro Plan',
    description: 'Access to premium features including unlimited AI chats, priority support, and advanced tools.',
    price: 1000, // $10.00 in cents
    currency: 'usd',
    interval: 'month',
  },
} as const;
