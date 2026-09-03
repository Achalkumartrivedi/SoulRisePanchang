import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { Colors } from '../theme/colors';
import { saveUserProfile, loginGuestUser, UserProfile } from '../engine/userDatabase';
import { restoreKundliProfilesFromCloud } from '../utils/profileStorage';
import { useLanguage } from '../context/LanguageContext';

interface OnboardingAuthScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingAuthScreen: React.FC<OnboardingAuthScreenProps> = ({ onComplete, onSkip }) => {
  const { t } = useLanguage();
  const [authMode, setAuthMode] = useState<'SELECT' | 'GUEST_REGISTER' | 'GUEST_LOGIN' | 'GOOGLE_EMAIL'>('SELECT');

  // Guest State
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPin, setGuestPin] = useState('');

  // Re-login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');

  // Google State
  const [googleName, setGoogleName] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');

  const handleGuestRegisterSubmit = async () => {
    const nameTrimmed = guestName.trim();
    const emailTrimmed = guestEmail.trim().toLowerCase();
    const pinTrimmed = guestPin.trim();

    if (!nameTrimmed) {
      Alert.alert('⚠️ Name Required', 'Please enter your Full Name.');
      return;
    }

    if (!emailTrimmed || !emailTrimmed.includes('@')) {
      Alert.alert('⚠️ Email Required', 'Please enter a valid email address to back up your Kundlis.');
      return;
    }

    if (!pinTrimmed || pinTrimmed.length < 6) {
      Alert.alert('⚠️ 6-Digit PIN Required', 'Please create a 6-digit security PIN to protect and sync your account.');
      return;
    }

    const profile: UserProfile = {
      id: `guest_${Date.now()}`,
      name: nameTrimmed,
      email: emailTrimmed,
      pin6Digit: pinTrimmed,
      authType: 'GUEST',
      createdAtIso: new Date().toISOString()
    };

    await saveUserProfile(profile);
    await restoreKundliProfilesFromCloud(emailTrimmed);
    onComplete();
  };

  const handleGuestLoginSubmit = async () => {
    const emailTrimmed = loginEmail.trim().toLowerCase();
    const pinTrimmed = loginPin.trim();

    if (!emailTrimmed || !emailTrimmed.includes('@')) {
      Alert.alert('⚠️ Email Required', 'Please enter your registered email address.');
      return;
    }

    if (!pinTrimmed || pinTrimmed.length < 6) {
      Alert.alert('⚠️ 6-Digit PIN Required', 'Please enter your 6-digit security PIN.');
      return;
    }

    const res = await loginGuestUser(emailTrimmed, pinTrimmed);
    if (res.success && res.profile) {
      await restoreKundliProfilesFromCloud(emailTrimmed);
      onComplete();
    } else {
      Alert.alert('❌ Login Failed', res.message || 'Incorrect email or PIN.');
    }
  };

  const handleGoogleSubmit = async () => {
    const trimmedName = googleName.trim() || 'Google User';
    const trimmedEmail = googleEmail.trim().toLowerCase();

    if (trimmedEmail && !trimmedEmail.includes('@')) {
      Alert.alert('⚠️ Invalid Email', 'Please enter a valid Google email address.');
      return;
    }

    const emailToUse = trimmedEmail || 'google.user@gmail.com';
    const profile: UserProfile = {
      id: `google_${Date.now()}`,
      name: trimmedName,
      email: emailToUse,
      authType: 'GOOGLE',
      createdAtIso: new Date().toISOString(),
      avatarUrl: 'https://lh3.googleusercontent.com/a/default-user'
    };

    await saveUserProfile(profile);
    await restoreKundliProfilesFromCloud(emailToUse);
    onComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.maroon} />

      {/* Top Header with Skip */}
      <View style={styles.header}>
        <Text style={styles.omIcon}>🕉️</Text>
        <Text style={styles.appName}>SoulRise Panchang</Text>

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipBtn} onPress={onSkip} activeOpacity={0.8}>
          <Text style={styles.skipBtnText}>Skip for Now ➔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title Banner */}
        <View style={styles.bannerBox}>
          <Text style={styles.bannerTitle}>Sign In to Sync Kundli & Reminders</Text>
          <Text style={styles.bannerSub}>
            Sign in with Google or Guest account to protect your saved Janam Kundli charts. Restores your charts automatically whenever you reinstall!
          </Text>
        </View>

        {authMode === 'SELECT' && (
          <View style={styles.card}>
            {/* Google Sign In Button with Official G Logo Badge */}
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={() => setAuthMode('GOOGLE_EMAIL')}
              activeOpacity={0.85}
            >
              <View style={styles.googleBadge}>
                <Text style={styles.googleGBadge}>G</Text>
              </View>
              <Text style={styles.googleBtnText}>Sign in with Google</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Guest Registration */}
            <TouchableOpacity
              style={styles.guestBtn}
              onPress={() => setAuthMode('GUEST_REGISTER')}
              activeOpacity={0.85}
            >
              <Text style={styles.guestIcon}>👤</Text>
              <Text style={styles.guestBtnText}>Create Guest Profile (Email + 6-Digit PIN)</Text>
            </TouchableOpacity>

            {/* Existing Guest Re-login */}
            <TouchableOpacity
              style={styles.restoreBtn}
              onPress={() => setAuthMode('GUEST_LOGIN')}
              activeOpacity={0.85}
            >
              <Text style={styles.restoreBtnText}>🔑 Existing Account? Re-login with Email & PIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bottomSkipLink} onPress={onSkip}>
              <Text style={styles.bottomSkipText}>Continue without Sign In ➔</Text>
            </TouchableOpacity>
          </View>
        )}

        {authMode === 'GOOGLE_EMAIL' && (
          <View style={styles.card}>
            <View style={styles.modeHeader}>
              <View style={styles.googleBadgeSmall}>
                <Text style={styles.googleGBadgeSmall}>G</Text>
              </View>
              <Text style={styles.modeTitle}>Google Account Sign In</Text>
            </View>

            <Text style={styles.label}>Display Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Amit Patel"
              value={googleName}
              onChangeText={setGoogleName}
              autoFocus
            />

            <Text style={styles.label}>Google Email Address (Mobile Google Account):</Text>
            <TextInput
              style={styles.input}
              placeholder="user@gmail.com"
              value={googleEmail}
              onChangeText={setGoogleEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAuthMode('SELECT')}>
                <Text style={styles.cancelBtnText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.googleSubmitBtn} onPress={handleGoogleSubmit}>
                <Text style={styles.submitBtnText}>Sign In & Restore ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {authMode === 'GUEST_REGISTER' && (
          <View style={styles.card}>
            <Text style={styles.modeTitle}>✍️ Register Guest Account</Text>

            <Text style={styles.label}>Full Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Rahul Sharma"
              value={guestName}
              onChangeText={setGuestName}
              autoFocus
            />

            <Text style={styles.label}>Email Address (for Multi-Device Sync):</Text>
            <TextInput
              style={styles.input}
              placeholder="rahul@gmail.com"
              value={guestEmail}
              onChangeText={setGuestEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Create 6-Digit Security PIN / Password:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit PIN (e.g. 123456)"
              value={guestPin}
              onChangeText={setGuestPin}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
            />

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAuthMode('SELECT')}>
                <Text style={styles.cancelBtnText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleGuestRegisterSubmit}>
                <Text style={styles.submitBtnText}>Create & Restore ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {authMode === 'GUEST_LOGIN' && (
          <View style={styles.card}>
            <Text style={styles.modeTitle}>🔑 Restore Existing Account</Text>

            <Text style={styles.label}>Registered Email Address:</Text>
            <TextInput
              style={styles.input}
              placeholder="rahul@gmail.com"
              value={loginEmail}
              onChangeText={setLoginEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />

            <Text style={styles.label}>6-Digit Security PIN / Password:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit PIN"
              value={loginPin}
              onChangeText={setLoginPin}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
            />

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAuthMode('SELECT')}>
                <Text style={styles.cancelBtnText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleGuestLoginSubmit}>
                <Text style={styles.submitBtnText}>Re-login & Restore ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBg
  },
  header: {
    backgroundColor: Colors.maroon,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'relative'
  },
  omIcon: {
    fontSize: 28
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 2
  },
  skipBtn: {
    position: 'absolute',
    right: 16,
    top: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20
  },
  skipBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  scrollContent: {
    padding: 16
  },
  bannerBox: {
    backgroundColor: '#FFF8E7',
    borderLeftWidth: 4,
    borderLeftColor: Colors.maroon,
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE0B2'
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 4
  },
  bannerSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 4
  },
  googleBtn: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2
  },
  googleBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  googleGBadge: {
    color: '#4285F4',
    fontSize: 15,
    fontWeight: 'bold'
  },
  googleBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold'
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0'
  },
  dividerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textMuted,
    paddingHorizontal: 10
  },
  guestBtn: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1.5,
    borderColor: Colors.maroon,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  guestIcon: {
    fontSize: 16,
    marginRight: 8
  },
  guestBtnText: {
    color: Colors.maroon,
    fontSize: 13,
    fontWeight: 'bold'
  },
  restoreBtn: {
    backgroundColor: '#ECEFF1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  restoreBtnText: {
    color: '#37474F',
    fontSize: 12,
    fontWeight: 'bold'
  },
  bottomSkipLink: {
    marginTop: 20,
    alignItems: 'center'
  },
  bottomSkipText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  googleBadgeSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  googleGBadgeSmall: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
    marginTop: 6
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
    marginBottom: 12
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#EEEEEE'
  },
  cancelBtnText: {
    color: Colors.textPrimary,
    fontWeight: 'bold'
  },
  submitBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: Colors.maroon
  },
  googleSubmitBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#4285F4'
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  }
});
