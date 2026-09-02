import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncUserToFirebaseCloud } from './firebaseSync';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  pin6Digit?: string; // 6-digit PIN for guest login & sync
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

export async function loginGuestUser(email: string, pin: string): Promise<{ success: boolean; profile?: UserProfile; message?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = pin.trim();

    const accountsJson = await AsyncStorage.getItem(ALL_ACCOUNTS_DATABASE_KEY);
    const accounts: UserProfile[] = accountsJson ? JSON.parse(accountsJson) : [];

    const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (!existing) {
      return { success: false, message: 'No account found with this email address. Please register as a new Guest user.' };
    }

    if (existing.authType === 'GUEST' && existing.pin6Digit && existing.pin6Digit !== cleanPin) {
      return { success: false, message: 'Incorrect 6-digit PIN. Please enter the correct PIN to restore your account.' };
    }

    await AsyncStorage.setItem(CURRENT_USER_PROFILE_KEY, JSON.stringify(existing));
    syncUserToFirebaseCloud(existing).catch(err => console.log('Firebase background sync catch:', err));
    return { success: true, profile: existing };
  } catch (e) {
    console.log('Error logging in guest user:', e);
    return { success: false, message: 'Login failed due to a database error.' };
  }
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
