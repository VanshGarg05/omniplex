"use client";

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthState, selectUserDetailsState } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import SubscriptionManager from '@/components/SubscriptionManager/SubscriptionManager';
import UsageTracker from '@/components/UsageTracker/UsageTracker';
import ProBanner from '@/components/ProBanner/ProBanner';

export default function SettingsPage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectAuthState);
  const userDetails = useSelector(selectUserDetailsState);
  const [activeTab, setActiveTab] = useState('billing');

  const tabs = [
    { id: 'billing', label: 'Billing & Plans', icon: '💳' },
    { id: 'usage', label: 'Usage & Limits', icon: '📊' },
    { id: 'account', label: 'Account', icon: '👤' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-gray-400 mb-6">You need to be signed in to access settings.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-gray-400">Manage your account, billing, and preferences</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            ← Back to App
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* User Info Card */}
            <div className="bg-gray-800 rounded-lg p-4 mt-6">
              <div className="flex items-center space-x-3">
                {userDetails?.profilePic ? (
                  <img
                    src={userDetails.profilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {userDetails?.name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-white font-medium text-sm">{userDetails?.name}</p>
                  <p className="text-gray-400 text-xs">{userDetails?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'billing' && (
              <>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Billing & Subscription</h2>
                  <SubscriptionManager />
                </div>

                <ProBanner 
                  message="Get the most out of Omniplex with unlimited features!"
                  className="mb-6"
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Free Plan Features</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center text-gray-300">
                        <span className="text-blue-400 mr-2">•</span>
                        10 AI conversations per day
                      </li>
                      <li className="flex items-center text-gray-300">
                        <span className="text-blue-400 mr-2">•</span>
                        Basic search functionality
                      </li>
                      <li className="flex items-center text-gray-300">
                        <span className="text-blue-400 mr-2">•</span>
                        Weather updates
                      </li>
                      <li className="flex items-center text-gray-300">
                        <span className="text-blue-400 mr-2">•</span>
                        Dictionary lookups
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-6 border border-blue-500">
                    <h3 className="text-lg font-semibold mb-4">Pro Plan Features</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center text-gray-200">
                        <span className="text-green-400 mr-2">✓</span>
                        Unlimited AI conversations
                      </li>
                      <li className="flex items-center text-gray-200">
                        <span className="text-green-400 mr-2">✓</span>
                        Priority AI responses
                      </li>
                      <li className="flex items-center text-gray-200">
                        <span className="text-green-400 mr-2">✓</span>
                        Export conversation history
                      </li>
                      <li className="flex items-center text-gray-200">
                        <span className="text-green-400 mr-2">✓</span>
                        Priority email support
                      </li>
                    </ul>
                    <button
                      onClick={() => router.push('/pricing')}
                      className="w-full mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                    >
                      Upgrade Now - $10/month
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'usage' && (
              <>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Usage & Limits</h2>
                  <p className="text-gray-400 mb-6">
                    Track your current usage and see how close you are to your limits.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <UsageTracker 
                    currentUsage={7}
                    limit={10}
                    type="conversations"
                  />
                  <UsageTracker 
                    currentUsage={15}
                    limit={50}
                    type="searches"
                  />
                </div>

                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Usage History</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Today</span>
                      <span className="text-white">7 conversations, 15 searches</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Yesterday</span>
                      <span className="text-white">10 conversations, 25 searches</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">This Week</span>
                      <span className="text-white">45 conversations, 120 searches</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'account' && (
              <>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={userDetails?.name || ''}
                        disabled
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={userDetails?.email || ''}
                        disabled
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50"
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Profile information is managed through your Google account.
                    </p>
                  </div>
                </div>

                <div className="bg-red-900/20 rounded-lg p-6 border border-red-700">
                  <h3 className="text-lg font-semibold mb-4 text-red-400">Danger Zone</h3>
                  <p className="text-red-300 text-sm mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200">
                    Delete Account
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
