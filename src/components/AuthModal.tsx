import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { Colors } from '../theme/colors';
import { saveUserProfile, loginGuestUser, UserProfile } from '../engine/userDatabase';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState<'SELECT' | 'GUEST_REGISTER' | 'GUEST_LOGIN' | 'GOOGLE_EMAIL'>('SELECT');

  // Registration Form State
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPin, setGuestPin] = useState('');

  // Existing Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');

  // Google State
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  const handleGuestRegisterSubmit = async () => {
    const nameTrimmed = guestName.trim();
    const emailTrimmed = guestEmail.trim().toLowerCase();
    const pinTrimmed = guestPin.trim();

    if (!nameTrimmed) {
      Alert.alert('⚠️ Name Required', 'Please enter your Full Name.');
      return;
    }

    if (!emailTrimmed || !emailTrimmed.includes('@')) {
      Alert.alert('⚠️ Email Required', 'Please enter a valid email address so you can restore your data later.');
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
    onSuccess(profile);
    resetForm();
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
      onSuccess(res.profile);
      resetForm();
    } else {
      Alert.alert('❌ Login Failed', res.message || 'Incorrect email or PIN.');
    }
  };

  const handleGoogleSubmit = async () => {
    const trimmedName = googleName.trim() || 'Google User';
    const trimmedEmail = googleEmail.trim();

    if (trimmedEmail && !trimmedEmail.includes('@')) {
      Alert.alert('⚠️ Invalid Email', 'Please enter a valid Google email address.');
      return;
    }

    const profile: UserProfile = {
      id: `google_${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail || 'user@gmail.com',
      authType: 'GOOGLE',
      createdAtIso: new Date().toISOString(),
      avatarUrl: 'https://lh3.googleusercontent.com/a/default-user'
    };

    await saveUserProfile(profile);
    onSuccess(profile);
    resetForm();
  };

  const resetForm = () => {
    setGuestName('');
    setGuestEmail('');
    setGuestPin('');
    setLoginEmail('');
    setLoginPin('');
    setGoogleName('');
    setGoogleEmail('');
    setAuthMode('SELECT');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {authMode === 'SELECT' && '👤 Sign In to SoulRise Panchang'}
              {authMode === 'GUEST_REGISTER' && '✍️ Create Guest Account (Name + Email + PIN)'}
              {authMode === 'GUEST_LOGIN' && '🔑 Restore Guest Account (Email + PIN)'}
              {authMode === 'GOOGLE_EMAIL' && '🌐 Google Account Sign In'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {/* Warning Banner regarding app uninstallation data wipe */}
            <View style={styles.warnBanner}>
              <Text style={styles.warnTitle}>⚠️ Important Data Notice</Text>
              <Text style={styles.warnText}>
                Without creating a profile, your saved Janam Kundli charts and Panchang reminders are stored locally on this phone and will be permanently cleared if the app is uninstalled!
              </Text>
            </View>

            {authMode === 'SELECT' && (
              <View>
                <Text style={styles.desc}>
                  Sign in or create a profile to back up your Janam Kundli charts, auto-populate your details, and sync sacred reminders.
                </Text>

                {/* Google Sign In Button */}
                <TouchableOpacity
                  style={styles.googleBtn}
                  onPress={() => setAuthMode('GOOGLE_EMAIL')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.googleIcon}>🔴</Text>
                  <Text style={styles.googleBtnText}>Continue with Google</Text>
                </TouchableOpacity>

                {/* New Guest Sign Up */}
                <TouchableOpacity
                  style={styles.guestBtn}
                  onPress={() => setAuthMode('GUEST_REGISTER')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.guestIcon}>👤</Text>
                  <Text style={styles.guestBtnText}>Register New Guest Profile (Email + 6-Digit PIN)</Text>
                </TouchableOpacity>

                {/* Existing Guest Login */}
                <TouchableOpacity
                  style={styles.restoreBtn}
                  onPress={() => setAuthMode('GUEST_LOGIN')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.restoreBtnText}>🔑 Existing Guest? Re-login with Email & PIN</Text>
                </TouchableOpacity>
              </View>
            )}

            {authMode === 'GUEST_REGISTER' && (
              <View>
                <Text style={styles.label}>Full Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Rahul Sharma"
                  value={guestName}
                  onChangeText={setGuestName}
                  autoFocus
                />

                <Text style={styles.label}>Email Address (for backup & login sync):</Text>
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
                    <Text style={styles.submitBtnText}>Create & Save ➔</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {authMode === 'GUEST_LOGIN' && (
              <View>
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
                    <Text style={styles.submitBtnText}>Re-login & Sync ➔</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {authMode === 'GOOGLE_EMAIL' && (
              <View>
                <Text style={styles.label}>Display Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Amit Patel"
                  value={googleName}
                  onChangeText={setGoogleName}
                  autoFocus
                />

                <Text style={styles.label}>Google Email Address:</Text>
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
                    <Text style={styles.submitBtnText}>Complete Sign In ➔</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 16
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: 580
  },
  header: {
    backgroundColor: Colors.maroon,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1
  },
  closeBtn: {
    padding: 4
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  warnBanner: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6F00',
    padding: 10,
    borderRadius: 6,
    marginBottom: 14
  },
  warnTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 2
  },
  warnText: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 16
  },
  desc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 17
  },
  googleBtn: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  googleIcon: {
    fontSize: 15,
    marginRight: 8
  },
  googleBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold'
  },
  guestBtn: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: Colors.maroon,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  guestIcon: {
    fontSize: 15,
    marginRight: 8
  },
  guestBtnText: {
    color: Colors.maroon,
    fontSize: 12,
    fontWeight: 'bold'
  },
  restoreBtn: {
    backgroundColor: '#ECEFF1',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  restoreBtnText: {
    color: '#37474F',
    fontSize: 12,
    fontWeight: 'bold'
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
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    backgroundColor: '#FAFAFA',
    marginBottom: 10
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#EEEEEE'
  },
  cancelBtnText: {
    color: Colors.textPrimary,
    fontWeight: 'bold'
  },
  submitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: Colors.maroon
  },
  googleSubmitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#4285F4'
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  }
});
