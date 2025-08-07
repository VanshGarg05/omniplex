"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthState, setUserDetailsState, setSubscriptionState } from "@/store/authSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase auth not initialized");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setAuthState(true));
        dispatch(
          setUserDetailsState({
            uid: user.uid,
            name: user.displayName ?? "",
            email: user.email ?? "",
            profilePic: user.photoURL ?? "",
          })
        );
        
        // Check localStorage for Pro status first (since Firestore might be disabled)
        try {
          const localProStatus = localStorage.getItem('omniplex_pro_status');
          const localProUser = localStorage.getItem('omniplex_pro_user');
          
          if (localProStatus === 'active' && localProUser === user.uid) {
            console.log('✅ Found Pro status in localStorage for user:', user.uid);
            const localSubscription = {
              status: 'active',
              plan: 'pro',
              stripeSessionId: localStorage.getItem('omniplex_session_id') || 'local_storage',
              stripeCustomerId: 'local_verification',
              startDate: localStorage.getItem('omniplex_pro_activated') || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            dispatch(setSubscriptionState(localSubscription));
            return; // Skip Firestore check if we have local Pro status
          }
        } catch (localError) {
          console.warn('Error checking localStorage:', localError);
        }
        
        // Only try Firestore if no local Pro status found
        try {
          if (db) {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const subscription = userData.subscription || null;
              console.log('User subscription data from Firestore:', subscription);
              dispatch(setSubscriptionState(subscription));
            } else {
              console.log('No user document found, setting subscription to null');
              dispatch(setSubscriptionState(null));
            }
          } else {
            console.log('Firestore not available, using null subscription');
            dispatch(setSubscriptionState(null));
          }
        } catch (error) {
          console.warn('Firestore error (expected if API disabled), using null subscription:', error instanceof Error ? error.message : 'Unknown error');
          dispatch(setSubscriptionState(null));
        }
      } else {
        console.log("User is signed out");
        dispatch(setAuthState(false));
        dispatch(setUserDetailsState({
          uid: "",
          name: "",
          email: "",
          profilePic: "",
        }));
        dispatch(setSubscriptionState(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthWrapper;
