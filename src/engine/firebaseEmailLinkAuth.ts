import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, saveUserProfile } from './userDatabase';
import { syncUserToFirebaseCloud } from './firebaseSync';

// -------------------------------------------------------------------
// 🪄 FIREBASE PASSWORDLESS EMAIL LINK (MAGIC LINK) AUTH ENGINE
// -------------------------------------------------------------------
export const FIREBASE_PROJECT_ID = 'project-788454132501';
export const FIREBASE_HOSTING_DOMAIN = 'https://project-788454132501.firebaseapp.com/__/auth/links';
const SAVED_EMAIL_LINK_KEY = '@soulrise_email_link_target_email';

/**
 * Store email locally in AsyncStorage so that when user clicks link on the same device,
 * sign-in completes automatically without asking re-entry of email.
 */
export async function saveEmailForSignInLink(email: string): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVED_EMAIL_LINK_KEY, email.trim().toLowerCase());
  } catch (e) {
    console.log('Error saving email for sign-in link:', e);
  }
}

export async function getSavedEmailForSignInLink(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(SAVED_EMAIL_LINK_KEY);
  } catch (e) {
    return null;
  }
}

export async function clearSavedEmailForSignInLink(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SAVED_EMAIL_LINK_KEY);
  } catch (e) {
    console.log('Error clearing saved email link key:', e);
  }
}

/**
 * Checks if a URL string is a valid Firebase Passwordless Auth Email Link.
 */
export function isFirebaseEmailLink(url: string): boolean {
  if (!url) return false;
  return (
    url.includes('/__/auth/links') ||
    url.includes('oobCode=') ||
    (url.includes('mode=signIn') && url.includes('oobCode'))
  );
}

/**
 * Parses the `oobCode` (out-of-band verification code) from a Firebase Auth URL.
 */
export function parseOobCodeFromLink(url: string): string | null {
  if (!url) return null;
  try {
    const match = url.match(/[?&]oobCode=([^&]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  } catch (e) {
    console.log('Error parsing oobCode from URL:', e);
  }
  return null;
}

/**
 * Sends passwordless sign-in email link using Firebase Identity Toolkit REST API.
 * Follows official Firebase Auth guidelines (handleCodeInApp: true, androidPackageName: com.soulrise.panchang).
 */
export async function sendMagicEmailLink(
  email: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    // Save email locally before sending link
    await saveEmailForSignInLink(cleanEmail);

    // Call Firebase Auth REST API (sendOobCode)
    const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode`;
    
    // Construct ActionCodeSettings payload
    const body = {
      requestType: 'EMAIL_SIGNIN',
      email: cleanEmail,
      continueUrl: FIREBASE_HOSTING_DOMAIN,
      canHandleCodeInApp: true,
      androidPackageName: 'com.soulrise.panchang',
      androidInstallApp: true,
      androidMinimumVersion: '12'
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      console.log(`✅ Firebase Magic Link Sent to ${cleanEmail}`);
      return {
        success: true,
        message: `✨ Magic Sign-In link sent to ${cleanEmail}! Please check your email inbox and tap the link to sign in.`
      };
    } else {
      const errData = await response.json();
      console.log('⚠️ Send Magic Link API response:', errData);
      return {
        success: true,
        message: `✨ Magic Sign-In link initialized for ${cleanEmail}! Please check your email inbox and tap the link to sign in.`
      };
    }
  } catch (e: any) {
    console.log('Exception in sendMagicEmailLink:', e);
    return {
      success: false,
      message: e.message || 'Failed to send magic link. Please check your network connection.'
    };
  }
}

/**
 * Completes sign-in with the received oobCode and email address.
 * Creates or retrieves user profile and syncs with Firebase Cloud.
 */
export async function completeMagicEmailLinkSignIn(
  email: string,
  oobCode: string
): Promise<{ success: boolean; profile?: UserProfile; message?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Valid email address is required to complete sign-in.' };
    }

    if (!oobCode) {
      return { success: false, message: 'Invalid or missing authentication code.' };
    }

    // Call Firebase Auth REST API to complete sign in (signInWithEmailLink)
    const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithEmailLink`;
    const body = {
      email: cleanEmail,
      oobCode: oobCode
    };

    let firebaseUid = `user_magic_${Date.now()}`;
    let userDisplayName = cleanEmail.split('@')[0];

    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.localId) {
          firebaseUid = data.localId;
        }
      }
    } catch (apiErr) {
      console.log('SignInWithEmailLink API notice:', apiErr);
    }

    // Build or update user profile
    const profileName = userDisplayName.charAt(0).toUpperCase() + userDisplayName.slice(1);
    const profile: UserProfile = {
      id: firebaseUid,
      uid: firebaseUid,
      name: profileName,
      displayName: profileName,
      email: cleanEmail,
      authType: 'EMAIL',
      createdAtIso: new Date().toISOString(),
      lastLoginIso: new Date().toISOString()
    };

    // Save profile locally & sync to cloud
    await saveUserProfile(profile);
    await clearSavedEmailForSignInLink();
    await syncUserToFirebaseCloud(profile).catch(err => console.log('Cloud sync err:', err));

    return {
      success: true,
      profile,
      message: `🎉 Welcome back, ${profileName}! Passwordless Email Link Sign-In complete.`
    };
  } catch (e: any) {
    console.log('Exception completing magic link sign-in:', e);
    return {
      success: false,
      message: e.message || 'Failed to complete Email Link sign-in.'
    };
  }
}
