import { UserProfile } from './userDatabase';

// -------------------------------------------------------------------
// ☁️ FIREBASE FIRESTORE CLOUD CONFIGURATION
// -------------------------------------------------------------------
// Provide your Firebase Web App credentials from https://console.firebase.google.com
// Project Settings (⚙️) ➔ Your Apps ➔ Add Web App (</>)

export const FIREBASE_CONFIG = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "soulrisepanchang.firebaseapp.com",
  projectId: "soulrisepanchang-project-id",
  storageBucket: "soulrisepanchang.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

/**
 * Pushes a user login/registration event to Firebase Firestore REST API.
 * Uses lightweight REST API to work instantly without extra native binary dependencies.
 */
export async function syncUserToFirebaseCloud(profile: UserProfile): Promise<boolean> {
  if (FIREBASE_CONFIG.apiKey === "YOUR_FIREBASE_API_KEY" || !FIREBASE_CONFIG.projectId) {
    console.log('☁️ Firebase Cloud Sync skipped: Waiting for Firebase API Key & Project ID.');
    return false;
  }

  try {
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/users/${encodeURIComponent(profile.email.toLowerCase())}?key=${FIREBASE_CONFIG.apiKey}`;

    const bodyData = {
      fields: {
        id: { stringValue: profile.id },
        name: { stringValue: profile.name },
        email: { stringValue: profile.email.toLowerCase() },
        authType: { stringValue: profile.authType },
        pin6Digit: { stringValue: profile.pin6Digit || '' },
        createdAtIso: { stringValue: profile.createdAtIso },
        lastLoginIso: { stringValue: new Date().toISOString() }
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
      console.log(`✅ Cloud Sync Success: User ${profile.email} synced to Firebase Firestore!`);
      return true;
    } else {
      const errJson = await response.json();
      console.log('⚠️ Firebase Sync API Error:', errJson);
      return false;
    }
  } catch (error) {
    console.log('⚠️ Firebase Cloud Sync Exception:', error);
    return false;
  }
}
