import { UserProfile } from './userDatabase';

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
      console.log(`✅ Real-Time Cloud Sync Success: ${profile.name} (${profile.email}) recorded in Firebase Firestore project: ${FIREBASE_PROJECT_ID}!`);
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
