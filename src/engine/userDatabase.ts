import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncUserToFirebaseCloud } from './firebaseSync';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  pin6Digit?: string; // 6-digit PIN for email/guest login & sync
  authType: 'GOOGLE' | 'GUEST';
  createdAtIso: string;
  avatarUrl?: string;
}

const CURRENT_USER_PROFILE_KEY = '@soulrise_user_profile_v1';
const ALL_ACCOUNTS_DATABASE_KEY = '@soulrise_all_user_accounts_v1';

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
 * Smart Unified Email Login & Signup Handler.
 * Automatically logs in existing users or registers new users seamlessly!
 */
export async function loginOrRegisterEmailUser(
  email: string,
  pin: string,
  name?: string
): Promise<{ success: boolean; profile?: UserProfile; isNewUser?: boolean; message?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = pin.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    if (!cleanPin || cleanPin.length < 6) {
      return { success: false, message: 'Please enter a 6-digit PIN.' };
    }

    const accountsJson = await AsyncStorage.getItem(ALL_ACCOUNTS_DATABASE_KEY);
    const accounts: UserProfile[] = accountsJson ? JSON.parse(accountsJson) : [];

    const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);

    if (existing) {
      // User exists -> verify PIN
      if (existing.pin6Digit && existing.pin6Digit !== cleanPin) {
        return { success: false, message: 'Incorrect 6-digit PIN. Please enter the correct PIN or tap "Forgot PIN?" to reset it.' };
      }
      await AsyncStorage.setItem(CURRENT_USER_PROFILE_KEY, JSON.stringify(existing));
      syncUserToFirebaseCloud(existing).catch(err => console.log('Firebase sync error:', err));
      return { success: true, profile: existing, isNewUser: false };
    } else {
      // New User -> Register
      const userName = (name && name.trim()) ? name.trim() : cleanEmail.split('@')[0];
      const newProfile: UserProfile = {
        id: `guest_${Date.now()}`,
        name: userName,
        email: cleanEmail,
        pin6Digit: cleanPin,
        authType: 'GUEST',
        createdAtIso: new Date().toISOString()
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
