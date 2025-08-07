import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../../lib/stripe';
import { db } from '../../../../../firebaseConfig';
import { doc, setDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  // Check if Stripe is configured
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed:`, err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleSuccessfulPayment(session);
        break;

      case 'customer.subscription.updated':
        const subscription = event.data.object;
        await handleSubscriptionUpdate(subscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        await handleSubscriptionCancellation(deletedSubscription);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handlePaymentSuccess(invoice);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        await handlePaymentFailure(failedInvoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(session: any) {
  try {
    const userId = session.client_reference_id || session.metadata?.userId;
    const plan = session.metadata?.plan;

    console.log('Processing successful payment:', {
      userId,
      plan,
      sessionId: session.id,
      customer: session.customer
    });

    if (!userId || userId === 'anonymous') {
      console.error('No valid user ID found in session');
      return;
    }

    if (!db) {
      console.warn('Firebase not configured, skipping database update');
      return;
    }

    const userRef = doc(db, 'users', userId);
    const subscriptionData = {
      status: 'active',
      plan: plan,
      stripeSessionId: session.id,
      stripeCustomerId: session.customer,
      startDate: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      // Check if user document exists
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userRef, {
          subscription: subscriptionData,
        });
        console.log(`Updated existing user subscription: ${userId}`);
      } else {
        // Create new user document
        await setDoc(userRef, {
          subscription: subscriptionData,
          createdAt: serverTimestamp(),
        });
        console.log(`Created new user document with subscription: ${userId}`);
      }
    } catch (firestoreError) {
      console.error('Firestore operation failed:', firestoreError);
      throw firestoreError;
    }

    console.log(`Successfully processed subscription for user: ${userId}`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleSubscriptionUpdate(subscription: any) {
  try {
    const customerId = subscription.customer;
    
    // You might need to find the user by customer ID
    // This is a simplified version
    console.log(`Subscription updated for customer: ${customerId}`);
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

async function handleSubscriptionCancellation(subscription: any) {
  try {
    const customerId = subscription.customer;
    
    // You might need to find the user by customer ID and update their status
    console.log(`Subscription cancelled for customer: ${customerId}`);
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

async function handlePaymentSuccess(invoice: any) {
  try {
    console.log(`Payment succeeded for invoice: ${invoice.id}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(invoice: any) {
  try {
    console.log(`Payment failed for invoice: ${invoice.id}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}
