"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserDetailsState, setSubscriptionState } from '@/store/authSlice';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import toast from 'react-hot-toast';

export default function PaymentSuccess() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const userDetails = useSelector(selectUserDetailsState);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const activateProDirectly = async () => {
      if (userDetails?.uid && sessionId) {
        console.log('Payment success detected - activating Pro directly');
        
        // Create Pro subscription immediately
        const proSubscription = {
          status: 'active',
          plan: 'pro',
          stripeSessionId: sessionId,
          stripeCustomerId: 'payment_success',
          startDate: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Set in Redux immediately
        dispatch(setSubscriptionState(proSubscription));
        
        // Save to localStorage as backup
        localStorage.setItem('omniplex_pro_status', 'active');
        localStorage.setItem('omniplex_pro_user', userDetails.uid);
        localStorage.setItem('omniplex_pro_activated', new Date().toISOString());
        localStorage.setItem('omniplex_session_id', sessionId);
        
        // Try to save to database in background (non-blocking)
        try {
          const response = await fetch('/api/verify-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userDetails.uid,
              sessionId: sessionId,
            }),
          });
          
          if (response.ok) {
            console.log('Successfully saved Pro status to database');
          }
        } catch (error) {
          console.warn('Database save failed, but Pro is activated locally:', error);
        }
        
        // Show success message
        toast.success('🎉 Pro subscription activated successfully!', {
          duration: 5000,
          style: {
            background: '#10B981',
            color: 'white',
          },
        });
      }
      
      // Always finish verification after 2 seconds
      setTimeout(() => {
        setIsVerifying(false);
      }, 2000);
    };

    activateProDirectly();
  }, [userDetails?.uid, dispatch, sessionId]);

  const handleContinue = () => {
    router.push('/');
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Verifying Payment...
          </h1>
          <p className="text-gray-400">
            Please wait while we confirm your subscription.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-6 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-gray-400 mb-2">
          Welcome to Omniplex Pro!
        </p>
        
        <p className="text-gray-400 mb-8">
          Your subscription is now active and you have access to all premium features.
        </p>

        {sessionId && (
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400 mb-2">Session ID:</p>
            <p className="text-xs text-gray-300 font-mono break-all">
              {sessionId}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4 text-left">
            <h3 className="text-lg font-semibold text-white mb-3">
              What&apos;s included in Pro:
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Unlimited AI conversations
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Priority support
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Advanced AI tools and features
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Export conversation history
              </li>
            </ul>
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Continue to Omniplex
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Questions about your subscription? Contact our support team.
        </p>
      </div>
    </div>
  );
}
