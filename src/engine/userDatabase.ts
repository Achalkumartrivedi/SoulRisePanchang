import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncUserToFirebaseCloud } from './firebaseSync';

export interface UserProfile {
  id: string;
  uid?: string;
  name: string;
  displayName?: string;
  email: string;
  photoURL?: string;
  avatarUrl?: string;
  pin6Digit?: string; // 6-digit PIN for email/phone login & sync
  authType: 'GOOGLE' | 'GUEST' | 'EMAIL' | 'PHONE';
  createdAtIso: string;
  lastLoginIso?: string;
}

const CURRENT_USER_PROFILE_KEY = '@soulrise_user_profile_v1';
const ALL_ACCOUNTS_DATABASE_KEY = '@soulrise_all_user_accounts_v1';

type AuthStateListener = (user: UserProfile | null) => void;
const authStateListeners: Set<AuthStateListener> = new Set();

export function subscribeToAuthState(listener: AuthStateListener): () => void {
  authStateListeners.add(listener);
  return () => {
    authStateListeners.delete(listener);
  };
}

export function notifyAuthStateChanged(user: UserProfile | null): void {
  authStateListeners.forEach(listener => {
    try {
      listener(user);
    } catch (e) {
      console.log('Error in auth state listener:', e);
    }
  });
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const json = await AsyncStorage.getItem(CURRENT_USER_PROFILE_KEY);
    if (!json) return null;
    return JSON.parse(json) as UserProfile;
  } catch (e) {
    console.log('Error reading user profile from DB:', e);
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(CURRENT_USER_PROFILE_KEY, JSON.stringify(profile));

    // Also persist into the all accounts database
    const accountsJson = await AsyncStorage.getItem(ALL_ACCOUNTS_DATABASE_KEY);
    const accounts: UserProfile[] = accountsJson ? JSON.parse(accountsJson) : [];
    const index = accounts.findIndex(a => a.email.toLowerCase() === profile.email.toLowerCase());

    if (index >= 0) {
      accounts[index] = profile;
    } else {
      accounts.push(profile);
    }
    await AsyncStorage.setItem(ALL_ACCOUNTS_DATABASE_KEY, JSON.stringify(accounts));

    // Sync in real-time to Firebase Cloud Firestore
    syncUserToFirebaseCloud(profile).catch(err => console.log('Firebase background sync catch:', err));
  } catch (e) {
    console.log('Error saving user profile to DB:', e);
  }
}

/**
 * Smart Unified Email & Phone Number Login & Signup Handler.
 * Automatically validates Email or Phone number and logs in / registers user seamlessly!
 */
export async function loginOrRegisterEmailUser(
  identifier: string,
  pin: string,
  name?: string
): Promise<{ success: boolean; profile?: UserProfile; isNewUser?: boolean; message?: string }> {
  try {
    const cleanInput = identifier.trim().toLowerCase();
    const cleanPin = pin.trim();

    if (!cleanInput) {
      return { success: false, message: 'Please enter a valid email address or mobile phone number.' };
    }

    const isEmail = cleanInput.includes('@');
    const digitsOnly = cleanInput.replace(/[^\d]/g, '');
    const isPhone = !isEmail && (digitsOnly.length >= 10);

    if (!isEmail && !isPhone) {
      return { success: false, message: 'Please enter a valid Email (e.g. user@gmail.com) or 10-digit Phone Number (e.g. +91 9876543210).' };
    }

    if (!cleanPin || cleanPin.length < 6) {
      return { success: false, message: 'Please enter a 6-digit PIN.' };
    }

    let normalizedIdentifier = cleanInput;
    let authType: 'EMAIL' | 'PHONE' = 'EMAIL';

    if (isPhone) {
      const rawDigits = cleanInput.replace(/[^\d+]/g, '');
      normalizedIdentifier = rawDigits.startsWith('+') ? rawDigits : (rawDigits.length === 10 ? `+91${rawDigits}` : `+${rawDigits}`);
      authType = 'PHONE';
    }

    const accountsJson = await AsyncStorage.getItem(ALL_ACCOUNTS_DATABASE_KEY);
    const accounts: UserProfile[] = accountsJson ? JSON.parse(accountsJson) : [];

    const existing = accounts.find(a => a.email.toLowerCase() === normalizedIdentifier.toLowerCase());

    if (existing) {
      // User exists -> verify PIN
      if (existing.pin6Digit && existing.pin6Digit !== cleanPin) {
        return { success: false, message: 'Incorrect 6-digit PIN. Please enter the correct PIN or reset it.' };
      }
      await AsyncStorage.setItem(CURRENT_USER_PROFILE_KEY, JSON.stringify(existing));
      syncUserToFirebaseCloud(existing).catch(err => console.log('Firebase sync error:', err));
      return { success: true, profile: existing, isNewUser: false };
    } else {
      // New User -> Register
      let userName = (name && name.trim()) ? name.trim() : '';
      if (!userName) {
        try {
          const { getActiveProfile } = require('../utils/profileStorage');
          const activeBirthProfile = await getActiveProfile();
          if (activeBirthProfile && activeBirthProfile.name) {
            userName = activeBirthProfile.name;
          }
        } catch (err) {
          console.log('Error resolving active profile name:', err);
        }
      }

      if (!userName) {
        userName = isPhone ? `User ${normalizedIdentifier.slice(-4)}` : normalizedIdentifier.split('@')[0];
      }

      const newProfile: UserProfile = {
        id: `user_${Date.now()}`,
        uid: `user_${Date.now()}`,
        name: userName,
        displayName: userName,
        email: normalizedIdentifier,
        pin6Digit: cleanPin,
        authType: authType,
        createdAtIso: new Date().toISOString(),
        lastLoginIso: new Date().toISOString()
      };

      await saveUserProfile(newProfile);
      return { success: true, profile: newProfile, isNewUser: true };
    }
  } catch (e) {
    console.log('Error in loginOrRegisterEmailUser:', e);
    return { success: false, message: 'Sign in failed due to database error.' };
  }
}

/**
 * Reset 6-digit Security PIN for an email account and sync to Firebase Cloud
 */
export async function resetUserPin(email: string, newPin: string): Promise<{ success: boolean; message?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = newPin.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter your registered email address.' };
    }

    if (!cleanPin || cleanPin.length < 6) {
      return { success: false, message: 'Please enter a new 6-digit PIN.' };
    }

    const accountsJson = await AsyncStorage.getItem(ALL_ACCOUNTS_DATABASE_KEY);
    const accounts: UserProfile[] = accountsJson ? JSON.parse(accountsJson) : [];
    const index = accounts.findIndex(a => a.email.toLowerCase() === cleanEmail);

    if (index < 0) {
      return { success: false, message: 'No account found with this email address.' };
    }

    accounts[index].pin6Digit = cleanPin;
    await AsyncStorage.setItem(ALL_ACCOUNTS_DATABASE_KEY, JSON.stringify(accounts));
    await AsyncStorage.setItem(CURRENT_USER_PROFILE_KEY, JSON.stringify(accounts[index]));

    // Sync reset PIN to Firebase
    syncUserToFirebaseCloud(accounts[index]).catch(e => console.log('Firebase sync reset PIN error:', e));
    return { success: true, message: 'Your 6-digit Security PIN has been reset successfully!' };
  } catch (e) {
    console.log('Error resetting user PIN:', e);
    return { success: false, message: 'Failed to reset PIN.' };
  }
}

export async function loginGuestUser(email: string, pin: string): Promise<{ success: boolean; profile?: UserProfile; message?: string }> {
  return loginOrRegisterEmailUser(email, pin);
}

export async function clearUserProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_PROFILE_KEY);
    notifyAuthStateChanged(null);
  } catch (e) {
    console.log('Error clearing user profile from DB:', e);
  }
}

export async function getAllRegisteredUsers(): Promise<UserProfile[]> {
  try {
    const accountsJson = await AsyncStorage.getItem(ALL_ACCOUNTS_DATABASE_KEY);
    return accountsJson ? JSON.parse(accountsJson) : [];
  } catch (e) {
    console.log('Error fetching all user accounts:', e);
    return [];
  }
}
