"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentCancel() {
  const router = useRouter();

  const handleTryAgain = () => {
    router.push('/pricing');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Cancel Icon */}
        <div className="mx-auto mb-6 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-400 mb-8">
          No worries! Your payment was cancelled and you haven&apos;t been charged.
          You can try again anytime or continue using Omniplex with the free features.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4 text-left">
            <h3 className="text-lg font-semibold text-white mb-3">
              Free features you can still use:
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">•</span>
                Limited AI conversations
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">•</span>
                Basic search functionality
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">•</span>
                Weather updates
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">•</span>
                Dictionary lookups
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleTryAgain}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Try Again
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Continue with Free Plan
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-400 mb-2">Need help?</p>
          <p className="text-xs text-gray-500">
            If you experienced any issues during checkout, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
