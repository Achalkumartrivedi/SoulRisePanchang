import { UserProfile } from './userDatabase';
import { SavedKundaliProfile } from '../utils/profileStorage';

// -------------------------------------------------------------------
// ☁️ FIREBASE FIRESTORE REAL-TIME CLOUD SYNC ENGINE
// -------------------------------------------------------------------
// Connected Project ID: soulrise-panchang

export const FIREBASE_PROJECT_ID = 'soulrise-panchang';

/**
 * Pushes a user login/registration event to your Firebase Firestore cloud database in real-time.
 * Every customer Guest & Google login is recorded under the `/users/{userEmail}` collection.
 */
export async function syncUserToFirebaseCloud(profile: UserProfile): Promise<boolean> {
  if (!profile.email) {
    return false;
  }

  try {
    const docId = encodeURIComponent(profile.email.trim().toLowerCase());
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${docId}`;

    const bodyData = {
      fields: {
        id: { stringValue: profile.id },
        name: { stringValue: profile.name },
        email: { stringValue: profile.email.trim().toLowerCase() },
        authType: { stringValue: profile.authType },
        pin6Digit: { stringValue: profile.pin6Digit || '' },
        createdAtIso: { stringValue: profile.createdAtIso },
        lastLoginIso: { stringValue: new Date().toISOString() },
        devicePlatform: { stringValue: 'Android' }
      }
    };

    const response = await fetch(firestoreUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    if (response.ok) {
      console.log(`✅ Real-Time Cloud Sync Success: ${profile.name} (${profile.email}) recorded in Firebase Firestore!`);
      return true;
    } else {
      const errJson = await response.json();
      console.log('⚠️ Firebase Sync REST Error:', errJson);
      return false;
    }
  } catch (error) {
    console.log('⚠️ Firebase Cloud Sync Exception:', error);
    return false;
  }
}

/**
 * Pushes saved Janam Kundli profiles to Firebase Firestore cloud database.
 */
export async function syncKundliProfilesToCloud(userEmail: string, profiles: SavedKundaliProfile[]): Promise<boolean> {
  if (!userEmail) return false;

  try {
    const docId = encodeURIComponent(userEmail.trim().toLowerCase());
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${docId}?updateMask.fieldPaths=kundliProfilesJson`;

    const bodyData = {
      fields: {
        kundliProfilesJson: { stringValue: JSON.stringify(profiles) }
      }
    };

    const response = await fetch(firestoreUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    if (response.ok) {
      console.log(`✅ Cloud Kundli Sync: ${profiles.length} Kundli profiles synced to Firebase for ${userEmail}`);
      return true;
    }
    return false;
  } catch (e) {
    console.log('⚠️ Cloud Kundli Sync Exception:', e);
    return false;
  }
}

/**
 * Fetches saved Janam Kundli profiles from Firebase Firestore cloud database for a user upon sign-in/reinstallation.
 */
export async function fetchKundliProfilesFromCloud(userEmail: string): Promise<SavedKundaliProfile[]> {
  if (!userEmail) return [];

  try {
    const docId = encodeURIComponent(userEmail.trim().toLowerCase());
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${docId}`;

    const response = await fetch(firestoreUrl);
    if (response.ok) {
      const data = await response.json();
      const jsonStr = data?.fields?.kundliProfilesJson?.stringValue;
      if (jsonStr) {
        const parsed = JSON.parse(jsonStr) as SavedKundaliProfile[];
        console.log(`✅ Restored ${parsed.length} Kundli profiles from Firebase Cloud for ${userEmail}`);
        return parsed;
      }
    }
    return [];
  } catch (e) {
    console.log('⚠️ Fetch Cloud Kundlis Exception:', e);
    return [];
  }
}
