import React, { createContext, useContext, useState, useEffect } from 'react';
import { Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import {
  UserProfile,
  getUserProfile,
  saveUserProfile,
  clearUserProfile,
  loginOrRegisterEmailUser,
  subscribeToAuthState,
  notifyAuthStateChanged
} from '../engine/userDatabase';
import {
  sendMagicEmailLink,
  completeMagicEmailLinkSignIn,
  isFirebaseEmailLink,
  parseOobCodeFromLink,
  getSavedEmailForSignInLink
} from '../engine/firebaseEmailLinkAuth';
import { restoreKundliProfilesFromCloud } from '../utils/profileStorage';

export const GOOGLE_WEB_CLIENT_ID = '788454132501-il76vbdi8a81gb5340pf6vcjggi8jvk5.apps.googleusercontent.com';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; profile?: UserProfile; message?: string }>;
  signInWithEmail: (email: string, pin: string, name?: string) => Promise<{ success: boolean; profile?: UserProfile; message?: string }>;
  sendPasswordlessLink: (email: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signInWithGoogle: async () => ({ success: false }),
  signInWithEmail: async () => ({ success: false }),
  sendPasswordlessLink: async () => ({ success: false }),
  logout: async () => {},
  refreshSession: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const processIncomingDeepLink = async (url: string | null) => {
    if (!url || !isFirebaseEmailLink(url)) return;

    const oobCode = parseOobCodeFromLink(url);
    if (!oobCode) return;

    const savedEmail = await getSavedEmailForSignInLink();
    if (!savedEmail) {
      Alert.alert(
        '📧 Complete Passwordless Sign-In',
        'Please enter your email address to complete passwordless authentication.'
      );
      return;
    }

    setIsLoading(true);
    const res = await completeMagicEmailLinkSignIn(savedEmail, oobCode);
    if (res.success && res.profile) {
      await restoreKundliProfilesFromCloud(res.profile.email);
      setUser(res.profile);
      notifyAuthStateChanged(res.profile);
      Alert.alert('🎉 Passwordless Login Success', res.message);
    } else {
      Alert.alert('❌ Passwordless Link Error', res.message || 'Unable to sign in with link.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Configure Google Sign-In with provided Web Client ID
    try {
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      });
    } catch (e) {
      console.log('GoogleSignin configure exception:', e);
    }

    // Initialize Auth Session on startup & check for initial deep link
    const initAuth = async () => {
      try {
        const storedProfile = await getUserProfile();
        setUser(storedProfile);

        // Check if app was opened via Firebase Email Link
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          await processIncomingDeepLink(initialUrl);
        }
      } catch (e) {
        console.log('Auth init error:', e);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for incoming deep links when app is running/resumed
    const subscription = Linking.addEventListener('url', (event) => {
      processIncomingDeepLink(event.url);
    });

    // Subscribe to auth state changes as single source of truth
    const unsubscribe = subscribeToAuthState((updatedUser) => {
      setUser(updatedUser);
    });

    return () => {
      subscription.remove();
      unsubscribe();
    };
  }, []);

  const refreshSession = async () => {
    const profile = await getUserProfile();
    setUser(profile);
  };

  /**
   * Google Sign-In Flow:
   */
  const signInWithGoogle = async (): Promise<{ success: boolean; profile?: UserProfile; message?: string }> => {
    try {
      setIsLoading(true);

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Force account selection by clearing any cached SDK session
      try {
        await GoogleSignin.signOut();
      } catch (err) {
        // ignore signout errors if not logged in
      }

      const response: any = await GoogleSignin.signIn();
      const userData = response?.data?.user || response?.user || response;

      if (!userData || !userData.email) {
        setIsLoading(false);
        return { success: false, message: 'Google Sign-In did not return email profile.' };
      }

      const uid = userData.id || `google_${Date.now()}`;
      const name = userData.name || userData.givenName || 'Google User';
      const email = userData.email.toLowerCase().trim();
      const photoURL = userData.photo || 'https://lh3.googleusercontent.com/a/default-user';

      const profile: UserProfile = {
        id: uid,
        uid,
        name,
        displayName: name,
        email,
        photoURL,
        avatarUrl: photoURL,
        authType: 'GOOGLE',
        createdAtIso: new Date().toISOString(),
        lastLoginIso: new Date().toISOString()
      };

      await saveUserProfile(profile);
      await restoreKundliProfilesFromCloud(profile.email);
      notifyAuthStateChanged(profile);
      setUser(profile);
      setIsLoading(false);

      return { success: true, profile };
    } catch (e: any) {
      console.log('Google Sign In Exception:', e);
      setIsLoading(false);
      if (e.code === statusCodes.SIGN_IN_CANCELLED) {
        return { success: false, message: 'Google Sign-In was cancelled.' };
      }
      if (
        e.code === '10' ||
        e.code === 10 ||
        (e.message && e.message.includes('DEVELOPER_ERROR'))
      ) {
        return {
          success: false,
          message:
            'Google Sign-In DEVELOPER_ERROR (Code 10):\n\nSHA-1 Certificate Fingerprint configuration is required in Firebase Console for package "com.soulrise.panchang".\n\n• Google Play Store App Signing SHA-1:\n58:63:34:4F:28:10:05:26:EE:5D:A9:4B:CD:D5:C4:3B:76:72:DE:5C\n\n• Local Upload / Release SHA-1:\nB3:BB:A8:12:94:89:AD:96:7E:42:B6:B4:AD:90:26:E9:96:FB:A3:7D\n\n• Debug SHA-1:\n5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25\n\n👉 Add the Play Store SHA-1 in Firebase Console -> Project Settings -> Your Apps -> com.soulrise.panchang -> Add Fingerprint.\n\nTip: You can also sign in using Email, Phone, or Guest Mode!'
        };
      }
      return { success: false, message: e.message || 'Google Sign-In failed.' };
    }
  };

  /**
   * Email Sign-In Flow
   */
  const signInWithEmail = async (
    email: string,
    pin: string,
    name?: string
  ): Promise<{ success: boolean; profile?: UserProfile; message?: string }> => {
    setIsLoading(true);
    const res = await loginOrRegisterEmailUser(email, pin, name);
    if (res.success && res.profile) {
      await restoreKundliProfilesFromCloud(res.profile.email);
      notifyAuthStateChanged(res.profile);
      setUser(res.profile);
    }
    setIsLoading(false);
    return res;
  };

  /**
   * Send Passwordless Email Link Flow
   */
  const sendPasswordlessLink = async (email: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const res = await sendMagicEmailLink(email);
    setIsLoading(false);
    return res;
  };

  /**
   * Logout Flow
   */
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Native Google SDK Sign Out
      try {
        await GoogleSignin.signOut();
        await GoogleSignin.revokeAccess();
      } catch (err) {
        console.log('GoogleSignin signOut catch:', err);
      }

      // Clear local session storage & caches
      await clearUserProfile();

      // Reset reactive auth state to null
      setUser(null);
      notifyAuthStateChanged(null);
    } catch (e) {
      console.log('Logout exception:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithGoogle,
        signInWithEmail,
        sendPasswordlessLink,
        logout,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
