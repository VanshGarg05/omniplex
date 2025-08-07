"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectAuthState } from '@/store/authSlice';

interface ProBannerProps {
  message?: string;
  className?: string;
}

export default function ProBanner({ 
  message = "Upgrade to Pro for unlimited AI conversations and premium features!", 
  className = "" 
}: ProBannerProps) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectAuthState);

  const handleUpgrade = () => {
    if (!isAuthenticated) {
      // You might want to show login modal here
      router.push('/pricing');
    } else {
      router.push('/pricing');
    }
  };

  return (
    <div className={`bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 rounded-full p-1.5">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <div>
            <p className="text-gray-200 font-medium text-sm">
              {message}
            </p>
          </div>
        </div>
        <button
          onClick={handleUpgrade}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-semibold text-sm transition duration-200 flex items-center space-x-1"
        >
          <span>Upgrade</span>
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
