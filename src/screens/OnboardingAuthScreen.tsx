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
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  COUNTRY_CODES,
  DEFAULT_COUNTRY,
  CountryCodeItem,
  detectInputType,
  validatePhoneNumberForCountry,
  validateEmailFormat
} from '../utils/countryCodes';

interface OnboardingAuthScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingAuthScreen: React.FC<OnboardingAuthScreenProps> = ({ onComplete, onSkip }) => {
  const { signInWithGoogle, signInWithEmail, sendPasswordlessLink } = useAuth();
  const insets = useSafeAreaInsets();
  const bottomInsetPadding = Math.max(insets.bottom + 12, 48);
  const [authMode, setAuthMode] = useState<'SELECT' | 'EMAIL_FORM' | 'FORGOT_PIN'>('SELECT');
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Unified Email / Phone State
  const [emailAddr, setEmailAddr] = useState('');
  const [emailPin, setEmailPin] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCodeItem>(DEFAULT_COUNTRY);
  const [showCountryModal, setShowCountryModal] = useState(false);

  // Forgot PIN Reset State
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPin, setNewPin] = useState('');

  const inputType = detectInputType(emailAddr);

  const handleGoogleSignInPress = async () => {
    const res = await signInWithGoogle();
    if (res.success) {
      onComplete();
    } else if (res.message && !res.message.includes('cancelled')) {
      Alert.alert('Google Sign-In Error', res.message);
    }
  };

  const handleSendMagicLink = async () => {
    const cleanEmail = emailAddr.trim().toLowerCase();
    const emailCheck = validateEmailFormat(cleanEmail);
    if (!emailCheck.valid) {
      Alert.alert('⚠️ Valid Email Required', emailCheck.message || 'Please enter a valid email address to receive a passwordless magic link.');
      return;
    }

    const res = await sendPasswordlessLink(cleanEmail);
    if (res.success) {
      Alert.alert('✨ Magic Link Sent', res.message || `Magic sign-in link sent to ${cleanEmail}. Open the email link to sign in instantly!`);
    } else {
      Alert.alert('❌ Error Sending Link', res.message || 'Failed to send magic link.');
    }
  };

  const handleSmartEmailSubmit = async () => {
    const rawInput = emailAddr.trim();
    const cleanPin = emailPin.trim();

    if (!rawInput) {
      Alert.alert('⚠️ Email or Phone Required', 'Please enter a valid email address or mobile phone number.');
      return;
    }

    if (!cleanPin || cleanPin.length < 6) {
      Alert.alert('⚠️ 6-Digit PIN Required', 'Please enter a 6-digit security PIN.');
      return;
    }

    let finalIdentifier = rawInput;

    if (inputType === 'EMAIL') {
      const check = validateEmailFormat(rawInput);
      if (!check.valid) {
        Alert.alert('⚠️ Invalid Email Format', check.message);
        return;
      }
      finalIdentifier = rawInput.toLowerCase();
    } else {
      const check = validatePhoneNumberForCountry(rawInput, selectedCountry);
      if (!check.valid) {
        Alert.alert('⚠️ Invalid Phone Number', check.message);
        return;
      }
      finalIdentifier = check.formattedNumber!;
    }

    const res = await signInWithEmail(finalIdentifier, cleanPin);
    if (res.success && res.profile) {
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

  const topPadding = Math.max(insets.top + 8, (StatusBar.currentHeight || 24) + 12);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0006" />

      {/* Top Bar with Skip */}
      <View style={[styles.topBar, { paddingTop: topPadding }]}>
        <View style={styles.topStarBadge}>
          <Text style={styles.starIcon}>✨ 🌌 ✨</Text>
        </View>

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipBtn} onPress={onSkip} activeOpacity={0.8}>
          <Text style={styles.skipBtnText}>Skip for Now ➔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInsetPadding + 20 }]} showsVerticalScrollIndicator={false}>
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
            {/* Button 1: Sign in With Google */}
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={() => handleGoogleSignInPress()}
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

            {/* Smart Unified Button: Sign in with Email or Phone */}
            <TouchableOpacity
              style={styles.emailSignupBtn}
              onPress={() => setAuthMode('EMAIL_FORM')}
              activeOpacity={0.85}
            >
              <Text style={styles.emailIcon}>✉️ / 📱</Text>
              <Text style={styles.emailSignupBtnText}>Sign in with Email or Phone</Text>
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
            <Text style={styles.modeTitle}>✉️ / 📱 Sign in with Email or Phone</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.label}>Email or Phone Number:</Text>
              <Text style={{ fontSize: 11, color: inputType === 'PHONE' ? Colors.maroon : '#4CAF50', fontWeight: 'bold' }}>
                {inputType === 'PHONE' ? '📱 Mobile Phone Mode' : '✉️ Email Mode'}
              </Text>
            </View>

            {/* Country Selector Dropdown Bar for Phone Mode */}
            {inputType === 'PHONE' && (
              <TouchableOpacity
                style={styles.countryPickerBtn}
                onPress={() => setShowCountryModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.countryPickerText}>
                  {selectedCountry.flag} {selectedCountry.name} ({selectedCountry.dialCode})  ▼
                </Text>
              </TouchableOpacity>
            )}

            <TextInput
              style={styles.input}
              placeholder={inputType === 'PHONE' ? `e.g. 9876543210 (${selectedCountry.minDigits} digits)` : "user@gmail.com"}
              placeholderTextColor="#999"
              value={emailAddr}
              onChangeText={setEmailAddr}
              keyboardType={inputType === 'PHONE' ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
              autoFocus
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <Text style={styles.label}>6-Digit Security PIN / Password:</Text>
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

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAuthMode('SELECT')}>
                <Text style={styles.cancelBtnText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSmartEmailSubmit}>
                <Text style={styles.submitBtnText}>Sign In / Sign Up ➔</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.magicLinkBtn} onPress={handleSendMagicLink} activeOpacity={0.85}>
              <Text style={styles.magicLinkBtnText}>🪄 Or Send Passwordless Magic Link to Email</Text>
            </TouchableOpacity>

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
              Enter your registered email address or phone number and create a new 6-digit security PIN to recover your account:
            </Text>

            <Text style={styles.label}>Registered Email / Phone Number:</Text>
            <TextInput
              style={styles.input}
              placeholder="user@gmail.com or +91 9876543210"
              placeholderTextColor="#999"
              value={forgotEmail}
              onChangeText={setForgotEmail}
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



      {/* Country Code Picker Modal */}
      <Modal visible={showCountryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModalCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerHeaderTitle}>🌐 Select Country Code</Text>
              <TouchableOpacity onPress={() => setShowCountryModal(false)} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 360 }}>
              {COUNTRY_CODES.map((item) => (
                <TouchableOpacity
                  key={item.code}
                  style={[
                    styles.countryRow,
                    selectedCountry.code === item.code && styles.countryRowActive
                  ]}
                  onPress={() => {
                    setSelectedCountry(item);
                    setShowCountryModal(false);
                  }}
                >
                  <Text style={styles.countryFlagText}>{item.flag}</Text>
                  <Text style={styles.countryNameText}>{item.name}</Text>
                  <Text style={styles.countryDialText}>{item.dialCode}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 20,
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
  },
  magicLinkBtn: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#FAF3E0',
    borderWidth: 1,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center'
  },
  magicLinkBtnText: {
    color: Colors.maroon,
    fontSize: 13,
    fontWeight: 'bold'
  },
  countryPickerBtn: {
    backgroundColor: '#FFF8E7',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    alignItems: 'center'
  },
  countryPickerText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  countryRowActive: {
    backgroundColor: '#FFF8E7'
  },
  countryFlagText: {
    fontSize: 20,
    marginRight: 12
  },
  countryNameText: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary
  },
  countryDialText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon
  }
});
