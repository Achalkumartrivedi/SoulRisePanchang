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


const LEGACY_STORAGE_KEY = '@soulrise_saved_kundali_profiles_v1';
const LEGACY_ACTIVE_PROFILE_KEY = '@soulrise_active_selected_profile_v1';

/**
 * Returns dynamic user-isolated profile storage key
 */
export function getUserProfileStorageKey(userEmailOrId?: string | null): string {
  if (userEmailOrId && userEmailOrId.trim()) {
    const cleanKey = userEmailOrId.toLowerCase().trim().replace(/[^a-z0-9_.-]/g, '_');
    return `@soulrise_saved_kundali_profiles_v1_user_${cleanKey}`;
  }
  return '@soulrise_saved_kundali_profiles_v1_guest';
}

/**
 * Returns dynamic user-isolated active profile ID storage key
 */
export function getUserActiveProfileKey(userEmailOrId?: string | null): string {
  if (userEmailOrId && userEmailOrId.trim()) {
    const cleanKey = userEmailOrId.toLowerCase().trim().replace(/[^a-z0-9_.-]/g, '_');
    return `@soulrise_active_selected_profile_v1_user_${cleanKey}`;
  }
  return '@soulrise_active_selected_profile_v1_guest';
}

/**
 * Helper to resolve user identifier: explicit argument -> current active user -> guest (null)
 */
async function resolveUserKey(explicitKey?: string | null): Promise<string | null> {
  if (explicitKey !== undefined && explicitKey !== null) {
    return explicitKey;
  }
  try {
    const currentUser = await getUserProfile();
    return currentUser?.email || currentUser?.id || null;
  } catch (err) {
    return null;
  }
}

/**
 * Get active selected profile ID for the current (or specified) user
 */
export async function getActiveProfileId(userEmailOrId?: string | null): Promise<string | null> {
  try {
    const userKey = await resolveUserKey(userEmailOrId);
    const activeKey = getUserActiveProfileKey(userKey);
    let activeId = await AsyncStorage.getItem(activeKey);
    if (!activeId && !userKey) {
      // Guest fallback to legacy key if present
      activeId = await AsyncStorage.getItem(LEGACY_ACTIVE_PROFILE_KEY);
      if (activeId) {
        await AsyncStorage.setItem(activeKey, activeId);
      }
    }
    return activeId;
  } catch (err) {
    console.log('Error getting active profile ID:', err);
    return null;
  }
}

/**
 * Set active selected profile ID and sync starred name to User Profile
 */
export async function setActiveProfileId(id: string, userEmailOrId?: string | null): Promise<void> {
  try {
    const userKey = await resolveUserKey(userEmailOrId);
    const activeKey = getUserActiveProfileKey(userKey);
    await AsyncStorage.setItem(activeKey, id);

    // Sync starred profile name to active User Profile
    const profiles = await getSavedProfiles(userKey);
    const matched = profiles.find(p => p.id === id);
    if (matched && matched.name) {
      const currentUser = await getUserProfile();
      if (currentUser && (!userKey || currentUser.email === userKey || currentUser.id === userKey)) {
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
 * Get the full active SavedKundaliProfile for current user (or null if none saved)
 */
export async function getActiveProfile(userEmailOrId?: string | null): Promise<SavedKundaliProfile | null> {
  try {
    const userKey = await resolveUserKey(userEmailOrId);
    const profiles = await getSavedProfiles(userKey);
    if (profiles.length === 0) return null;

    const activeId = await getActiveProfileId(userKey);
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
 * Get all saved Kundali profiles from local storage for current user
 */
export async function getSavedProfiles(userEmailOrId?: string | null): Promise<SavedKundaliProfile[]> {
  try {
    const userKey = await resolveUserKey(userEmailOrId);
    const storageKey = getUserProfileStorageKey(userKey);
    let jsonStr = await AsyncStorage.getItem(storageKey);
    if (!jsonStr && !userKey) {
      // Guest migration fallback: check legacy storage key once
      const legacyStr = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyStr) {
        await AsyncStorage.setItem(storageKey, legacyStr);
        jsonStr = legacyStr;
      }
    }
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
export async function saveKundaliProfile(
  profile: Omit<SavedKundaliProfile, 'id' | 'savedAt'>,
  userEmailOrId?: string | null
): Promise<SavedKundaliProfile[]> {
  try {
    const userKey = await resolveUserKey(userEmailOrId);
    const storageKey = getUserProfileStorageKey(userKey);
    const existing = await getSavedProfiles(userKey);
    const newId = `profile_${Date.now()}`;
    const newProfile: SavedKundaliProfile = {
      ...profile,
      id: newId,
      savedAt: new Date().toLocaleDateString('en-GB')
    };

    // Prevent duplicates with same name & DOB
    const filtered = existing.filter(
      p =>
        !(
          p.name.toLowerCase() === profile.name.toLowerCase() &&
          p.dobDay === profile.dobDay &&
          p.dobMonth === profile.dobMonth &&
          p.dobYear === profile.dobYear
        )
    );
    const updated = [newProfile, ...filtered];

    await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    await setActiveProfileId(newId, userKey);

    // Cloud Sync if user is logged in
    const currentUser = await getUserProfile();
    const effectiveEmail = userKey && userKey.includes('@') ? userKey : currentUser?.email;
    if (effectiveEmail) {
      syncKundliProfilesToCloud(effectiveEmail, updated).catch(e => console.log('Cloud sync error:', e));
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
    const storageKey = getUserProfileStorageKey(userEmail);

    if (cloudProfiles && cloudProfiles.length > 0) {
      const localProfiles = await getSavedProfiles(userEmail);

      // Merge cloud and local profiles by unique ID/name+DOB
      const mergedMap = new Map<string, SavedKundaliProfile>();
      localProfiles.forEach(p =>
        mergedMap.set(`${p.name.toLowerCase()}_${p.dobDay}_${p.dobMonth}_${p.dobYear}`, p)
      );
      cloudProfiles.forEach(p =>
        mergedMap.set(`${p.name.toLowerCase()}_${p.dobDay}_${p.dobMonth}_${p.dobYear}`, p)
      );

      const mergedList = Array.from(mergedMap.values());
      await AsyncStorage.setItem(storageKey, JSON.stringify(mergedList));

      // Ensure active profile remains set
      const currentActiveId = await getActiveProfileId(userEmail);
      if (!currentActiveId && mergedList.length > 0) {
        await setActiveProfileId(mergedList[0].id, userEmail);
      }

      return mergedList;
    }
    return await getSavedProfiles(userEmail);
  } catch (e) {
    console.log('Error restoring Kundli profiles from cloud:', e);
    return await getSavedProfiles(userEmail);
  }
}

/**
 * Delete a profile by ID
 */
export async function deleteKundaliProfile(
  id: string,
  userEmailOrId?: string | null
): Promise<SavedKundaliProfile[]> {
  try {
    const userKey = await resolveUserKey(userEmailOrId);
    const storageKey = getUserProfileStorageKey(userKey);
    const activeKey = getUserActiveProfileKey(userKey);
    const existing = await getSavedProfiles(userKey);
    const updated = existing.filter(p => p.id !== id);
    await AsyncStorage.setItem(storageKey, JSON.stringify(updated));

    // If deleted profile was active, set next available profile as active
    const activeId = await getActiveProfileId(userKey);
    if (activeId === id) {
      if (updated.length > 0) {
        await setActiveProfileId(updated[0].id, userKey);
      } else {
        await AsyncStorage.removeItem(activeKey);
      }
    }

    // Cloud Sync if user is logged in
    const currentUser = await getUserProfile();
    const effectiveEmail = userKey && userKey.includes('@') ? userKey : currentUser?.email;
    if (effectiveEmail) {
      syncKundliProfilesToCloud(effectiveEmail, updated).catch(e => console.log('Cloud sync error:', e));
    }

    return updated;
  } catch (err) {
    console.log('Error deleting profile:', err);
    return [];
  }
}
