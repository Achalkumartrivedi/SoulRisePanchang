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
import { saveUserProfile, loginOrRegisterEmailUser, UserProfile } from '../engine/userDatabase';
import { restoreKundliProfilesFromCloud } from '../utils/profileStorage';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState<'SELECT' | 'EMAIL_FORM' | 'GOOGLE_EMAIL'>('SELECT');

  // Unified Email Form State
  const [emailName, setEmailName] = useState('');
  const [emailAddr, setEmailAddr] = useState('');
  const [emailPin, setEmailPin] = useState('');

  // Google State
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  const handleSmartEmailSubmit = async () => {
    const cleanEmail = emailAddr.trim().toLowerCase();
    const cleanPin = emailPin.trim();
    const cleanName = emailName.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      Alert.alert('⚠️ Email Required', 'Please enter a valid email address.');
      return;
    }

    if (!cleanPin || cleanPin.length < 6) {
      Alert.alert('⚠️ 6-Digit PIN Required', 'Please enter a 6-digit security PIN.');
      return;
    }

    const res = await loginOrRegisterEmailUser(cleanEmail, cleanPin, cleanName);
    if (res.success && res.profile) {
      await restoreKundliProfilesFromCloud(cleanEmail);
      onSuccess(res.profile);
      resetAndClose();
    } else {
      Alert.alert('❌ Sign In Failed', res.message || 'Incorrect PIN or login error.');
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
    onSuccess(profile);
    resetAndClose();
  };

  const resetAndClose = () => {
    setEmailName('');
    setEmailAddr('');
    setEmailPin('');
    setGoogleName('');
    setGoogleEmail('');
    setAuthMode('SELECT');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {authMode === 'SELECT' && '👤 Sign In to SoulRise Panchang'}
              {authMode === 'EMAIL_FORM' && '✉️ Sign in with Email'}
              {authMode === 'GOOGLE_EMAIL' && '🌐 Google Account Sign In'}
            </Text>
            <TouchableOpacity onPress={resetAndClose} style={styles.closeBtn}>
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
                  <View style={styles.googleLogoBadge}>
                    <Text style={{ color: '#4285F4', fontSize: 14, fontWeight: 'bold' }}>G</Text>
                  </View>
                  <Text style={styles.googleBtnText}>Sign in With Google</Text>
                </TouchableOpacity>

                {/* Smart Unified Email Sign In */}
                <TouchableOpacity
                  style={styles.guestBtn}
                  onPress={() => setAuthMode('EMAIL_FORM')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.guestIcon}>✉️</Text>
                  <Text style={styles.guestBtnText}>Sign in with Email</Text>
                </TouchableOpacity>
              </View>
            )}

            {authMode === 'EMAIL_FORM' && (
              <View style={styles.formContainer}>
                <Text style={styles.label}>Email Address (Required):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="user@gmail.com"
                  value={emailAddr}
                  onChangeText={setEmailAddr}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoFocus
                />

                <Text style={styles.label}>6-Digit Security PIN / Password (Required):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit PIN"
                  value={emailPin}
                  onChangeText={setEmailPin}
                  keyboardType="number-pad"
                  maxLength={6}
                  secureTextEntry
                />

                <Text style={styles.label}>Full Name (Optional for new users):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Rahul Sharma"
                  value={emailName}
                  onChangeText={setEmailName}
                />

                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setAuthMode('SELECT')}>
                    <Text style={styles.cancelBtnText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.submitBtn} onPress={handleSmartEmailSubmit}>
                    <Text style={styles.submitBtnText}>Sign In / Sign Up ➔</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {authMode === 'GOOGLE_EMAIL' && (
              <View style={styles.formContainer}>
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
    maxHeight: 560
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
    fontSize: 15,
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
    backgroundColor: '#FFF8E7',
    borderLeftWidth: 4,
    borderLeftColor: Colors.maroon,
    padding: 10,
    borderRadius: 6,
    marginBottom: 12
  },
  warnTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 2
  },
  warnText: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16
  },
  desc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 14,
    lineHeight: 18
  },
  googleBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DDDDDD',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 2
  },
  googleLogoBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  googleBtnText: {
    color: '#3C4043',
    fontSize: 14,
    fontWeight: 'bold'
  },
  guestBtn: {
    backgroundColor: Colors.maroon,
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
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold'
  },
  formContainer: {
    marginTop: 4
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
    fontSize: 14,
    backgroundColor: '#FAFAFA',
    color: Colors.textPrimary,
    marginBottom: 10
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14
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
