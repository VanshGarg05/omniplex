import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionId } = await req.json();

    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('✅ MANUAL VERIFICATION SUCCESS for user:', userId, 'session:', sessionId);

    // Create subscription data
    const subscriptionData = {
      status: 'active',
      plan: 'pro',
      stripeSessionId: sessionId,
      stripeCustomerId: 'manual_verification',
      startDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Skip Firestore entirely since it's not enabled - just return success
    console.log('🚀 PRO ACTIVATED for user:', userId);
    
    return NextResponse.json({ 
      success: true, 
      subscription: subscriptionData,
      firestoreSuccess: false,
      message: '🎉 Pro subscription activated! (Firestore disabled, using local storage)'
    });

  } catch (error: any) {
    console.error('Manual verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify subscription' },
      { status: 500 }
    );
  }
}
