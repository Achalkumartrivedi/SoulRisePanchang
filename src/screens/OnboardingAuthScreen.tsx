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
  Modal,
  Alert
} from 'react-native';
import { Colors } from '../theme/colors';
import { saveUserProfile, loginOrRegisterEmailUser, resetUserPin, UserProfile } from '../engine/userDatabase';
import { restoreKundliProfilesFromCloud } from '../utils/profileStorage';

interface OnboardingAuthScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingAuthScreen: React.FC<OnboardingAuthScreenProps> = ({ onComplete, onSkip }) => {
  const [authMode, setAuthMode] = useState<'SELECT' | 'EMAIL_FORM' | 'FORGOT_PIN'>('SELECT');
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Unified Email Form State
  const [emailName, setEmailName] = useState('');
  const [emailAddr, setEmailAddr] = useState('');
  const [emailPin, setEmailPin] = useState('');

  // Forgot PIN Reset State
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPin, setNewPin] = useState('');

  // Custom Google Account Input State inside Picker
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  // Simulated Device Google Accounts
  const DEVICE_GOOGLE_ACCOUNTS = [
    { name: 'Achal Trivedi', email: 'achal.trivedi@gmail.com' },
    { name: 'SoulRise Dev', email: 'soulrise.dev@gmail.com' }
  ];

  const handleSelectGoogleAccount = async (name: string, email: string) => {
    setShowGooglePicker(false);
    const profile: UserProfile = {
      id: `google_${Date.now()}`,
      name: name.trim() || 'Google User',
      email: email.trim().toLowerCase(),
      authType: 'GOOGLE',
      createdAtIso: new Date().toISOString(),
      avatarUrl: 'https://lh3.googleusercontent.com/a/default-user'
    };

    await saveUserProfile(profile);
    await restoreKundliProfilesFromCloud(email);
    onComplete();
  };

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
      onComplete();
    } else {
      Alert.alert('❌ Sign In Failed', res.message || 'Incorrect PIN or login error.');
    }
  };

  const handleResetPinSubmit = async () => {
    const res = await resetUserPin(forgotEmail, newPin);
    if (res.success) {
      Alert.alert('✅ PIN Reset Successful', res.message);
      setEmailAddr(forgotEmail);
      setEmailPin(newPin);
      setAuthMode('EMAIL_FORM');
    } else {
      Alert.alert('⚠️ Reset Failed', res.message || 'Unable to reset PIN.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0006" />

      {/* Top Bar with Skip */}
      <View style={styles.topBar}>
        <View style={styles.topStarBadge}>
          <Text style={styles.starIcon}>✨ 🌌 ✨</Text>
        </View>

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipBtn} onPress={onSkip} activeOpacity={0.8}>
          <Text style={styles.skipBtnText}>Skip for Now ➔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Sacred Sun Logo & Centered Welcome Header */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.sunLogo}>☀️</Text>
          <Text style={styles.welcomeTitle}>Welcome to SoulRise Panchang and Kundali</Text>
          <Text style={styles.welcomeSub}>
            Connect your account to back up Janam Kundli charts & sync sacred Panchang reminders across all your devices.
          </Text>
        </View>

        {authMode === 'SELECT' && (
          <View style={styles.cardContainer}>
            {/* Button 1: Sign in With Google (opens Google Account Picker) */}
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={() => setShowGooglePicker(true)}
              activeOpacity={0.85}
            >
              <View style={styles.googleLogoBadge}>
                <Text style={{ color: '#4285F4', fontSize: 16, fontWeight: 'bold' }}>G</Text>
              </View>
              <Text style={styles.googleBtnText}>Sign in With Google</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Smart Unified Button: Sign in with Email */}
            <TouchableOpacity
              style={styles.emailSignupBtn}
              onPress={() => setAuthMode('EMAIL_FORM')}
              activeOpacity={0.85}
            >
              <Text style={styles.emailIcon}>✉️</Text>
              <Text style={styles.emailSignupBtnText}>Sign in with Email</Text>
            </TouchableOpacity>

            {/* Bottom Skip Link */}
            <TouchableOpacity style={styles.bottomSkipLink} onPress={onSkip}>
              <Text style={styles.bottomSkipText}>Continue Without Sign In ➔</Text>
            </TouchableOpacity>

            {/* Legal Terms & Privacy Policy Footer Link */}
            <View style={styles.termsFooter}>
              <Text style={styles.termsFooterText}>
                By Signing up, you agree to our{' '}
                <Text style={styles.termsLink} onPress={() => setShowTermsModal(true)}>
                  Terms of Use
                </Text>{' '}
                and{' '}
                <Text style={styles.termsLink} onPress={() => setShowPrivacyModal(true)}>
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
        )}

        {authMode === 'EMAIL_FORM' && (
          <View style={styles.cardContainer}>
            <Text style={styles.modeTitle}>✉️ Sign in with Email</Text>

            <Text style={styles.label}>Email Address (Required):</Text>
            <TextInput
              style={styles.input}
              placeholder="user@gmail.com"
              placeholderTextColor="#999"
              value={emailAddr}
              onChangeText={setEmailAddr}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <Text style={styles.label}>6-Digit Security PIN / Password (Required):</Text>
              <TouchableOpacity onPress={() => {
                setForgotEmail(emailAddr);
                setAuthMode('FORGOT_PIN');
              }}>
                <Text style={{ fontSize: 11, color: Colors.maroon, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                  Forgot PIN?
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit PIN"
              placeholderTextColor="#999"
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
              placeholderTextColor="#999"
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

            <View style={styles.termsFooter}>
              <Text style={styles.termsFooterText}>
                By Signing up, you agree to our{' '}
                <Text style={styles.termsLink} onPress={() => setShowTermsModal(true)}>
                  Terms of Use
                </Text>{' '}
                and{' '}
                <Text style={styles.termsLink} onPress={() => setShowPrivacyModal(true)}>
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
        )}

        {authMode === 'FORGOT_PIN' && (
          <View style={styles.cardContainer}>
            <Text style={styles.modeTitle}>🔑 Reset Security PIN / Password</Text>
            <Text style={{ fontSize: 12, color: Colors.textSecondary, marginBottom: 12, lineHeight: 16 }}>
              Enter your registered email address and create a new 6-digit security PIN to recover your account:
            </Text>

            <Text style={styles.label}>Registered Email Address:</Text>
            <TextInput
              style={styles.input}
              placeholder="user@gmail.com"
              placeholderTextColor="#999"
              value={forgotEmail}
              onChangeText={setForgotEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />

            <Text style={styles.label}>Enter New 6-Digit PIN:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new 6-digit PIN"
              placeholderTextColor="#999"
              value={newPin}
              onChangeText={setNewPin}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
            />

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAuthMode('EMAIL_FORM')}>
                <Text style={styles.cancelBtnText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleResetPinSubmit}>
                <Text style={styles.submitBtnText}>Reset PIN & Sign In ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Google Account Picker Modal */}
      <Modal visible={showGooglePicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModalCard}>
            <View style={styles.pickerHeader}>
              <View style={styles.googleBadgeSmall}>
                <Text style={{ color: '#4285F4', fontSize: 13, fontWeight: 'bold' }}>G</Text>
              </View>
              <Text style={styles.pickerHeaderTitle}>Choose an account to SoulRise Panchang and Kundli</Text>
              <TouchableOpacity onPress={() => setShowGooglePicker(false)} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.pickerSubTitle}>
              Select a Google account connected on this device to continue to SoulRise Panchang:
            </Text>

            {/* List Device Accounts */}
            {DEVICE_GOOGLE_ACCOUNTS.map((acc, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.accountRow}
                onPress={() => handleSelectGoogleAccount(acc.name, acc.email)}
                activeOpacity={0.8}
              >
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarLetter}>{acc.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.accountName}>{acc.name}</Text>
                  <Text style={styles.accountEmail}>{acc.email}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Add Custom Google Email Option */}
            {!showCustomGoogleInput ? (
              <TouchableOpacity
                style={styles.addAccountBtn}
                onPress={() => setShowCustomGoogleInput(true)}
              >
                <Text style={styles.addAccountText}>➕ Add or enter another Google email</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.customInputBox}>
                <Text style={styles.label}>Enter Full Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Amit Patel"
                  placeholderTextColor="#999"
                  value={customGoogleName}
                  onChangeText={setCustomGoogleName}
                />
                <Text style={styles.label}>Enter Google Email Address:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="user@gmail.com"
                  placeholderTextColor="#999"
                  value={customGoogleEmail}
                  onChangeText={setCustomGoogleEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.googleSubmitBtn}
                  onPress={() => {
                    if (!customGoogleEmail || !customGoogleEmail.includes('@')) {
                      Alert.alert('⚠️ Invalid Email', 'Please enter a valid Google email.');
                      return;
                    }
                    handleSelectGoogleAccount(customGoogleName || 'Google User', customGoogleEmail);
                  }}
                >
                  <Text style={styles.submitBtnText}>Sign In with This Account ➔</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.pickerCancelBtn} onPress={() => setShowGooglePicker(false)}>
              <Text style={styles.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Terms of Use Modal */}
      <Modal visible={showTermsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.docModalCard}>
            <View style={styles.docHeader}>
              <Text style={styles.docTitle}>📜 Terms of Use</Text>
              <TouchableOpacity onPress={() => setShowTermsModal(false)} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <Text style={styles.docHeading}>1. Acceptance of Terms</Text>
              <Text style={styles.docText}>
                By downloading or using SoulRise Panchang and Kundli, you agree to these Terms of Use.
              </Text>

              <Text style={styles.docHeading}>2. Services & Calculations</Text>
              <Text style={styles.docText}>
                Provides Vedic Panchang, Tithi, Rahu Kalam, Choghadiya, Janam Kundli, and Horoscope readings for spiritual & educational purposes.
              </Text>

              <Text style={styles.docHeading}>3. Account & Data Backup</Text>
              <Text style={styles.docText}>
                User accounts and saved Kundli charts are stored locally and backed up to Firebase Cloud (`soulrise-panchang`).
              </Text>

              <Text style={styles.docHeading}>4. Astrological Disclaimer</Text>
              <Text style={styles.docText}>
                Astrological readings are for guidance only and do not replace professional medical, legal, or financial advice.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal visible={showPrivacyModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.docModalCard}>
            <View style={styles.docHeader}>
              <Text style={styles.docTitle}>📜 Privacy Policy</Text>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <Text style={styles.docHeading}>1. Location Usage</Text>
              <Text style={styles.docText}>
                GPS data is processed locally on your device to calculate city-specific Panchang, Rahu Kalam, and Tithis. We NEVER sell your location data.
              </Text>

              <Text style={styles.docHeading}>2. User Account Data</Text>
              <Text style={styles.docText}>
                We collect Profile Name, Email, and 6-Digit PIN to back up your Janam Kundli charts and sync reminders across devices.
              </Text>

              <Text style={styles.docHeading}>3. Data Control & Deletion</Text>
              <Text style={styles.docText}>
                You can delete your account and erase all saved local data anytime in App Settings ➔ Delete Account.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0006' // Deep Vedic Galaxy Cosmic Background
  },
  topBar: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  topStarBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)'
  },
  starIcon: {
    fontSize: 13,
    color: '#FFD700',
    fontWeight: 'bold'
  },
  skipBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)'
  },
  skipBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  welcomeBanner: {
    alignItems: 'center',
    marginVertical: 24,
    paddingHorizontal: 10
  },
  sunLogo: {
    fontSize: 54,
    marginBottom: 10
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 30,
    marginBottom: 8
  },
  welcomeSub: {
    fontSize: 13,
    color: '#FFE0B2',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
    opacity: 0.95
  },
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#FFD700',
    elevation: 8
  },
  googleBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DDDDDD',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  googleLogoBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  googleBtnText: {
    color: '#3C4043',
    fontSize: 15,
    fontWeight: 'bold'
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0'
  },
  dividerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#888888',
    paddingHorizontal: 12
  },
  emailSignupBtn: {
    backgroundColor: Colors.maroon,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 3
  },
  emailIcon: {
    fontSize: 16,
    marginRight: 8
  },
  emailSignupBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold'
  },
  bottomSkipLink: {
    marginTop: 18,
    alignItems: 'center'
  },
  bottomSkipText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  termsFooter: {
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    alignItems: 'center'
  },
  termsFooterText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16
  },
  termsLink: {
    color: Colors.maroon,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  modeTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 12
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
    color: Colors.textPrimary,
    marginBottom: 12
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    backgroundColor: '#EEEEEE'
  },
  cancelBtnText: {
    color: Colors.textPrimary,
    fontWeight: 'bold'
  },
  submitBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    backgroundColor: Colors.maroon
  },
  googleSubmitBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    marginTop: 10
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  // Modal Overlays & Picker Cards
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 16
  },
  pickerModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 10
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  googleBadgeSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  pickerHeaderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1
  },
  pickerSubTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 14,
    lineHeight: 16
  },
  closeBtn: {
    padding: 4
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888'
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  accountName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary
  },
  accountEmail: {
    fontSize: 12,
    color: Colors.textSecondary
  },
  addAccountBtn: {
    backgroundColor: '#ECEFF1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10
  },
  addAccountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#37474F'
  },
  customInputBox: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  pickerCancelBtn: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 8
  },
  pickerCancelText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textMuted
  },
  docModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: 520
  },
  docHeader: {
    backgroundColor: Colors.maroon,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  docTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  docHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginTop: 10,
    marginBottom: 4
  },
  docText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8
  }
});
