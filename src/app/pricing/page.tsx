"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectAuthState, selectUserDetailsState, selectIsProUser } from '@/store/authSlice';
import { getStripe } from '../../../lib/stripe';
import { useRefreshSubscription } from '@/hooks/useRefreshSubscription';
import toast from 'react-hot-toast';

export default function PricingPage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectAuthState);
  const userDetails = useSelector(selectUserDetailsState);
  const isProUser = useSelector(selectIsProUser);
  const refreshSubscription = useRefreshSubscription();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSubscribe = async (plan: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setLoading(true);
    
    try {
      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan,
          userId: userDetails?.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }

      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Failed to start checkout process');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSubscription = async () => {
    setRefreshing(true);
    try {
      const subscription = await refreshSubscription();
      if (subscription?.status === 'active') {
        toast.success('✅ Pro subscription confirmed!', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: 'white',
          },
        });
      } else {
        toast.error('No active subscription found. Please contact support if you believe this is an error.');
      }
    } catch (error) {
      toast.error('Failed to refresh subscription status');
    } finally {
      setRefreshing(false);
    }
  };

  const features = {
    free: [
      'Limited AI conversations (10/day)',
      'Basic search functionality',
      'Weather updates',
      'Dictionary lookups',
      'Community support',
    ],
    pro: [
      'Unlimited AI conversations',
      'Priority AI responses',
      'Advanced search capabilities',
      'All weather features',
      'Export conversation history',
      'Priority email support',
      'Early access to new features',
      'Custom AI prompts',
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Pro User Banner */}
        {isProUser && (
          <div className="max-w-4xl mx-auto mb-8 p-6 bg-gradient-to-r from-green-900 to-green-800 rounded-lg border-2 border-green-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 rounded-full p-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">🎉 You&apos;re already a Pro user!</h3>
                  <p className="text-green-200">You have access to all premium features.</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleRefreshSubscription}
                  disabled={refreshing}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition duration-200 flex items-center space-x-2"
                >
                  {refreshing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Refreshing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Refresh Status</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="bg-white hover:bg-gray-100 text-green-800 px-4 py-2 rounded-lg font-semibold text-sm transition duration-200"
                >
                  Back to App
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Unlock the full potential of Omniplex with our Pro plan, or continue enjoying our free features.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Free</h2>
              <div className="text-4xl font-bold mb-2">
                $0
                <span className="text-lg font-normal text-gray-400">/month</span>
              </div>
              <p className="text-gray-400">Perfect for getting started</p>
            </div>

            <ul className="space-y-3 mb-8">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-blue-500 mr-3">✓</span>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              onClick={() => router.push('/')}
            >
              Continue with Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-8 border-2 border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Pro</h2>
              <div className="text-4xl font-bold mb-2">
                $10
                <span className="text-lg font-normal text-gray-300">/month</span>
              </div>
              <p className="text-gray-300">Everything you need to be productive</p>
            </div>

            <ul className="space-y-3 mb-8">
              {features.pro.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  <span className="text-gray-200">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('pro')}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                'Subscribe to Pro'
              )}
            </button>

            <p className="text-xs text-gray-300 mt-4 text-center">
              Cancel anytime. No long-term commitments.
            </p>
          </div>
        </div>

        {/* Test Card Info */}
        <div className="max-w-2xl mx-auto mt-12 p-6 bg-gray-900 rounded-lg border border-yellow-600">
          <h3 className="text-lg font-semibold mb-3 text-yellow-400">
            🧪 Test Mode Information
          </h3>
          <p className="text-gray-300 mb-3">
            This is a test environment. Use the following test card for payments:
          </p>
          <div className="bg-gray-800 p-4 rounded font-mono text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-400 block">Card Number:</span>
                <span className="text-green-400">4242 4242 4242 4242</span>
              </div>
              <div>
                <span className="text-gray-400 block">Expiry:</span>
                <span className="text-green-400">Any future date</span>
              </div>
              <div>
                <span className="text-gray-400 block">CVC:</span>
                <span className="text-green-400">Any 3 digits</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            No real charges will be made in test mode.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400">
                Yes, you can cancel your subscription at any time. You&apos;ll continue to have Pro access until the end of your billing period.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-400">
                You can use Omniplex for free with limited features. Upgrade to Pro anytime to unlock all features.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400">
                We accept all major credit cards through Stripe&apos;s secure payment processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
