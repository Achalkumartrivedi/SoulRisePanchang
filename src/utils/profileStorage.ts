import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedKundaliProfile {
  id: string;
  name: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  tobHour: string;
  tobMinute: string;
  cityName: string;
  lat: number;
  lng: number;
  savedAt: string;
}

const STORAGE_KEY = '@soulrise_saved_kundali_profiles_v1';

/**
 * Get all saved Kundali profiles from local storage
 */
export async function getSavedProfiles(): Promise<SavedKundaliProfile[]> {
  try {
    const jsonStr = await AsyncStorage.getItem(STORAGE_KEY);
    if (!jsonStr) return [];
    return JSON.parse(jsonStr);
  } catch (err) {
    console.log('Error fetching saved profiles:', err);
    return [];
  }
}

/**
 * Save or update a Kundali profile locally
 */
export async function saveKundaliProfile(profile: Omit<SavedKundaliProfile, 'id' | 'savedAt'>): Promise<SavedKundaliProfile[]> {
  try {
    const existing = await getSavedProfiles();
    const newId = `profile_${Date.now()}`;
    const newProfile: SavedKundaliProfile = {
      ...profile,
      id: newId,
      savedAt: new Date().toLocaleDateString('en-GB')
    };

    // Prevent duplicates with same name & DOB
    const filtered = existing.filter(p => !(p.name.toLowerCase() === profile.name.toLowerCase() && p.dobDay === profile.dobDay && p.dobMonth === profile.dobMonth && p.dobYear === profile.dobYear));
    const updated = [newProfile, ...filtered];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.log('Error saving profile:', err);
    return [];
  }
}

/**
 * Delete a profile by ID
 */
export async function deleteKundaliProfile(id: string): Promise<SavedKundaliProfile[]> {
  try {
    const existing = await getSavedProfiles();
    const updated = existing.filter(p => p.id !== id);
    await AsyncStorage.getItem(STORAGE_KEY);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.log('Error deleting profile:', err);
    return [];
  }
}
