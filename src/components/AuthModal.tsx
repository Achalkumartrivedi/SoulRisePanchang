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
import { saveUserProfile, UserProfile } from '../engine/userDatabase';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState<'SELECT' | 'GUEST_NAME' | 'GOOGLE_EMAIL'>('SELECT');
  const [guestName, setGuestName] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  const handleGuestSubmit = async () => {
    const trimmed = guestName.trim();
    if (!trimmed) {
      Alert.alert('⚠️ Name Required', 'Please enter your full name to proceed with Guest Sign-In.');
      return;
    }

    const profile: UserProfile = {
      id: `guest_${Date.now()}`,
      name: trimmed,
      email: `${trimmed.toLowerCase().replace(/\s+/g, '')}@guest.local`,
      authType: 'GUEST',
      createdAtIso: new Date().toISOString()
    };

    await saveUserProfile(profile);
    onSuccess(profile);
    setGuestName('');
    setAuthMode('SELECT');
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
    setGoogleEmail('');
    setGoogleName('');
    setAuthMode('SELECT');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {authMode === 'SELECT' && '👤 Sign In to SoulRise Panchang'}
              {authMode === 'GUEST_NAME' && '🙋 Guest Profile Setup'}
              {authMode === 'GOOGLE_EMAIL' && '🌐 Google Account Sign In'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {authMode === 'SELECT' && (
              <View>
                <Text style={styles.desc}>
                  Sign in to personalize your Vedic Panchang, sync sacred reminders, and auto-populate your details in Janam Kundli charts.
                </Text>

                {/* Google Sign In Option */}
                <TouchableOpacity
                  style={styles.googleBtn}
                  onPress={() => setAuthMode('GOOGLE_EMAIL')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.googleIcon}>🔴</Text>
                  <Text style={styles.googleBtnText}>Continue with Google</Text>
                </TouchableOpacity>

                {/* Guest Sign In Option */}
                <TouchableOpacity
                  style={styles.guestBtn}
                  onPress={() => setAuthMode('GUEST_NAME')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.guestIcon}>👤</Text>
                  <Text style={styles.guestBtnText}>Continue as Guest (Guest Sign-In)</Text>
                </TouchableOpacity>
              </View>
            )}

            {authMode === 'GUEST_NAME' && (
              <View>
                <Text style={styles.label}>Please enter your Full Name:</Text>
                <Text style={styles.subLabel}>
                  Your name will be used across the app and auto-filled in your Janam Kundli / Birth Generator.
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="e.g. Rahul Sharma"
                  value={guestName}
                  onChangeText={setGuestName}
                  autoFocus
                />

                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setAuthMode('SELECT')}>
                    <Text style={styles.cancelBtnText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.submitBtn} onPress={handleGuestSubmit}>
                    <Text style={styles.submitBtnText}>Save & Continue ➔</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {authMode === 'GOOGLE_EMAIL' && (
              <View>
                <Text style={styles.label}>Google Account Details:</Text>
                <Text style={styles.subLabel}>
                  Enter your Google Account display name and email address.
                </Text>

                <Text style={styles.fieldLabel}>Display Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Amit Patel"
                  value={googleName}
                  onChangeText={setGoogleName}
                />

                <Text style={styles.fieldLabel}>Google Email Address:</Text>
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
    padding: 20
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: 520
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
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1
  },
  closeBtn: {
    padding: 6
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  desc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 18
  },
  googleBtn: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  googleIcon: {
    fontSize: 16,
    marginRight: 8
  },
  googleBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold'
  },
  guestBtn: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  guestIcon: {
    fontSize: 16,
    marginRight: 8
  },
  guestBtnText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold'
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4
  },
  subLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 16
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
    marginBottom: 16
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#EEEEEE'
  },
  cancelBtnText: {
    color: Colors.textPrimary,
    fontWeight: 'bold'
  },
  submitBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: Colors.maroon
  },
  googleSubmitBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#4285F4'
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  }
});
