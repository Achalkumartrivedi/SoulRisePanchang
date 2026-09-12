import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile, saveUserProfile, notifyAuthStateChanged } from '../engine/userDatabase';
import { syncKundliProfilesToCloud, fetchKundliProfilesFromCloud } from '../engine/firebaseSync';

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
const ACTIVE_PROFILE_KEY = '@soulrise_active_selected_profile_v1';

/**
 * Get active selected profile ID
 */
export async function getActiveProfileId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(ACTIVE_PROFILE_KEY);
  } catch (err) {
    console.log('Error getting active profile ID:', err);
    return null;
  }
}

/**
 * Set active selected profile ID and sync starred name to User Profile
 */
export async function setActiveProfileId(id: string): Promise<void> {
  try {
    await AsyncStorage.setItem(ACTIVE_PROFILE_KEY, id);

    // Sync starred profile name to active User Profile
    const profiles = await getSavedProfiles();
    const matched = profiles.find(p => p.id === id);
    if (matched && matched.name) {
      const currentUser = await getUserProfile();
      if (currentUser) {
        currentUser.name = matched.name;
        currentUser.displayName = matched.name;
        await saveUserProfile(currentUser);
        notifyAuthStateChanged(currentUser);
      }
    }
  } catch (err) {
    console.log('Error setting active profile ID:', err);
  }
}

/**
 * Get the full active SavedKundaliProfile (or null if none saved)
 */
export async function getActiveProfile(): Promise<SavedKundaliProfile | null> {
  try {
    const profiles = await getSavedProfiles();
    if (profiles.length === 0) return null;

    const activeId = await getActiveProfileId();
    if (activeId) {
      const matched = profiles.find(p => p.id === activeId);
      if (matched) return matched;
    }

    // Default to first saved profile if no active ID or ID not found
    return profiles[0];
  } catch (err) {
    console.log('Error fetching active profile:', err);
    return null;
  }
}

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
 * Save or update a Kundali profile locally and sync to Firebase Cloud
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
    await setActiveProfileId(newId);

    // Cloud Sync if user is logged in
    const currentUser = await getUserProfile();
    if (currentUser?.email) {
      syncKundliProfilesToCloud(currentUser.email, updated).catch(e => console.log('Cloud sync error:', e));
    }

    return updated;
  } catch (err) {
    console.log('Error saving profile:', err);
    return [];
  }
}

/**
 * Restore user's saved Kundli profiles from Firebase Cloud upon sign-in or re-installation
 */
export async function restoreKundliProfilesFromCloud(userEmail: string): Promise<SavedKundaliProfile[]> {
  if (!userEmail) return await getSavedProfiles();

  try {
    const cloudProfiles = await fetchKundliProfilesFromCloud(userEmail);
    if (cloudProfiles && cloudProfiles.length > 0) {
      const localProfiles = await getSavedProfiles();

      // Merge cloud and local profiles by unique ID/name+DOB
      const mergedMap = new Map<string, SavedKundaliProfile>();
      localProfiles.forEach(p => mergedMap.set(`${p.name.toLowerCase()}_${p.dobDay}_${p.dobMonth}_${p.dobYear}`, p));
      cloudProfiles.forEach(p => mergedMap.set(`${p.name.toLowerCase()}_${p.dobDay}_${p.dobMonth}_${p.dobYear}`, p));

      const mergedList = Array.from(mergedMap.values());
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mergedList));

      // Ensure active profile remains set
      const currentActiveId = await getActiveProfileId();
      if (!currentActiveId && mergedList.length > 0) {
        await setActiveProfileId(mergedList[0].id);
      }

      return mergedList;
    }
    return await getSavedProfiles();
  } catch (e) {
    console.log('Error restoring Kundli profiles from cloud:', e);
    return await getSavedProfiles();
  }
}

/**
 * Delete a profile by ID
 */
export async function deleteKundaliProfile(id: string): Promise<SavedKundaliProfile[]> {
  try {
    const existing = await getSavedProfiles();
    const updated = existing.filter(p => p.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // If deleted profile was active, set next available profile as active
    const activeId = await getActiveProfileId();
    if (activeId === id) {
      if (updated.length > 0) {
        await setActiveProfileId(updated[0].id);
      } else {
        await AsyncStorage.removeItem(ACTIVE_PROFILE_KEY);
      }
    }

    // Cloud Sync if user is logged in
    const currentUser = await getUserProfile();
    if (currentUser?.email) {
      syncKundliProfilesToCloud(currentUser.email, updated).catch(e => console.log('Cloud sync error:', e));
    }

    return updated;
  } catch (err) {
    console.log('Error deleting profile:', err);
    return [];
  }
}
