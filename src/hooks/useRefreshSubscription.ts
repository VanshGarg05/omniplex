"use client";

import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { selectUserDetailsState, setSubscriptionState } from '@/store/authSlice';

export const useRefreshSubscription = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector(selectUserDetailsState);

  const refreshSubscription = async () => {
    if (!userDetails?.uid || !db) {
      console.warn('Cannot refresh subscription: missing user or database');
      return null;
    }

    try {
      console.log('Refreshing subscription for user:', userDetails.uid);
      const userRef = doc(db, 'users', userDetails.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const subscription = userData.subscription || null;
        console.log('Fetched subscription data:', subscription);
        dispatch(setSubscriptionState(subscription));
        return subscription;
      } else {
        console.log('User document does not exist, setting subscription to null');
        dispatch(setSubscriptionState(null));
        return null;
      }
    } catch (error) {
      console.error('Error refreshing subscription:', error);
      return null;
    }
  };

  return refreshSubscription;
};
