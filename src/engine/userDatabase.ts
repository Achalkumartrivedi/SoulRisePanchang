import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  authType: 'GOOGLE' | 'GUEST';
  createdAtIso: string;
  avatarUrl?: string;
}

const USER_PROFILE_KEY = '@soulrise_user_profile_v1';

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const json = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (!json) return null;
    return JSON.parse(json) as UserProfile;
  } catch (e) {
    console.log('Error reading user profile from DB:', e);
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.log('Error saving user profile to DB:', e);
  }
}

export async function clearUserProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
  } catch (e) {
    console.log('Error clearing user profile from DB:', e);
  }
}
