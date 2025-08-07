"use client";

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUserDetailsState } from '@/store/authSlice';
import { useRouter } from 'next/navigation';

interface UsageTrackerProps {
  currentUsage?: number;
  limit?: number;
  type?: 'conversations' | 'searches' | 'requests';
  className?: string;
}

export default function UsageTracker({
  currentUsage = 0,
  limit = 10,
  type = 'conversations',
  className = ''
}: UsageTrackerProps) {
  const router = useRouter();
  const userDetails = useSelector(selectUserDetailsState);
  const [usage, setUsage] = useState(currentUsage);
  
  const percentage = Math.min((usage / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  const getTypeLabel = () => {
    switch (type) {
      case 'conversations':
        return 'AI Conversations';
      case 'searches':
        return 'Searches';
      case 'requests':
        return 'API Requests';
      default:
        return 'Usage';
    }
  };

  const getProgressColor = () => {
    if (isAtLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  return (
    <div className={`bg-gray-900 rounded-lg p-4 border border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium text-sm">{getTypeLabel()}</h4>
        <span className={`text-xs px-2 py-1 rounded ${
          isAtLimit 
            ? 'bg-red-900/50 text-red-300' 
            : isNearLimit 
            ? 'bg-yellow-900/50 text-yellow-300'
            : 'bg-gray-700 text-gray-300'
        }`}>
          {usage}/{limit}
        </span>
      </div>

      <div className="mb-3">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {isAtLimit && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 mb-3">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-red-300 text-xs font-medium">Limit Reached</p>
              <p className="text-red-400 text-xs">
                You&apos;ve reached your {type} limit for today. Upgrade to Pro for unlimited access.
              </p>
            </div>
          </div>
        </div>
      )}

      {isNearLimit && !isAtLimit && (
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3 mb-3">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-yellow-300 text-xs font-medium">Almost at limit</p>
              <p className="text-yellow-400 text-xs">
                You&apos;re close to your daily limit. Consider upgrading for unlimited access.
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleUpgrade}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition duration-200"
      >
        Upgrade to Pro for Unlimited
      </button>
    </div>
  );
}
