"use client";

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUserDetailsState } from '@/store/authSlice';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import toast from 'react-hot-toast';

interface Subscription {
  status: string;
  plan: string;
  startDate: any;
  stripeCustomerId?: string;
  stripeSessionId?: string;
}

export default function SubscriptionManager() {
  const userDetails = useSelector(selectUserDetailsState);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userDetails?.uid && db) {
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, [userDetails]);

  const fetchSubscription = async () => {
    try {
      if (!userDetails?.uid || !db) return;

      const userRef = doc(db, 'users', userDetails.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setSubscription(userData.subscription || null);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10';
      case 'canceled':
        return 'text-red-400 bg-red-400/10';
      case 'past_due':
        return 'text-yellow-400 bg-yellow-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    // Handle Firestore timestamp
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    
    // Handle regular date
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Subscription Status
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 mb-2">You&apos;re currently on the free plan</p>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-400/10 text-gray-400">
                Free Plan
              </span>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/pricing'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        Subscription Status
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Current Plan</p>
            <p className="text-white font-semibold capitalize">{subscription.plan} Plan</p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(subscription.status)}`}>
            {subscription.status}
          </span>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Start Date</p>
          <p className="text-white">{formatDate(subscription.startDate)}</p>
        </div>

        {subscription.status === 'active' && (
          <div className="bg-green-900/20 rounded-lg p-4 border border-green-700">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-green-400 font-semibold text-sm">Pro Features Active</h4>
                <p className="text-green-300 text-sm mt-1">
                  You have access to unlimited AI conversations, priority support, and all premium features.
                </p>
              </div>
            </div>
          </div>
        )}

        {subscription.status === 'past_due' && (
          <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-700">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="text-yellow-400 font-semibold text-sm">Payment Required</h4>
                <p className="text-yellow-300 text-sm mt-1">
                  Your payment is past due. Please update your payment method to continue using Pro features.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            onClick={() => window.location.href = '/pricing'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 flex-1"
          >
            Manage Subscription
          </button>
          
          {subscription.status === 'active' && (
            <button
              onClick={() => toast.error('Cancellation feature coming soon!')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
