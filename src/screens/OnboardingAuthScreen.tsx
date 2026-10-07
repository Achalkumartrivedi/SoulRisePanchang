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
  Alert,
  Dimensions
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Fonts } from '../constants/typography';
import { saveUserProfile, loginOrRegisterEmailUser, resetUserPin, UserProfile } from '../engine/userDatabase';
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

const { width } = Dimensions.get('window');

export const OnboardingAuthScreen: React.FC<OnboardingAuthScreenProps> = ({
  onComplete,
  onSkip,
}) => {
  const { signInWithGoogle, signInWithEmail, sendPasswordlessLink } = useAuth();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 8, 24);
  const bottomPadding = Math.max(insets.bottom + 16, 28);

  // Popups state
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [popupSubTab, setPopupSubTab] = useState<'LOGIN' | 'FORGOT_PIN'>('LOGIN');

  // Input states
  const [emailAddr, setEmailAddr] = useState('');
  const [emailPin, setEmailPin] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCodeItem>(DEFAULT_COUNTRY);
  const [showCountryModal, setShowCountryModal] = useState(false);

  // Forgot PIN state
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPin, setNewPin] = useState('');

  const inputType = detectInputType(emailAddr);

  const handleGoogleSignIn = async () => {
    const res = await signInWithGoogle();
    if (res.success) {
      onComplete();
    } else if (res.message && !res.message.includes('cancelled')) {
      Alert.alert('Google Sign-In', res.message);
    }
  };

  const handleSmartSubmit = async () => {
    const rawInput = emailAddr.trim();
    const cleanPin = emailPin.trim();

    if (!rawInput) {
      Alert.alert('⚠️ Input Required', 'Please enter a valid email address or mobile phone number.');
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
        Alert.alert('⚠️ Invalid Email', check.message);
        return;
      }
      finalIdentifier = rawInput.toLowerCase();
    } else {
      const check = validatePhoneNumberForCountry(rawInput, selectedCountry);
      if (!check.valid) {
        Alert.alert('⚠️ Invalid Phone', check.message);
        return;
      }
      finalIdentifier = check.formattedNumber!;
    }

    const res = await signInWithEmail(finalIdentifier, cleanPin);
    if (res.success && res.profile) {
      setShowSignInPopup(false);
      onComplete();
    } else {
      Alert.alert('❌ Sign In Failed', res.message || 'Incorrect PIN or login error.');
    }
  };

  const handleSendMagicLink = async () => {
    const cleanEmail = emailAddr.trim().toLowerCase();
    const check = validateEmailFormat(cleanEmail);
    if (!check.valid) {
      Alert.alert('⚠️ Valid Email Required', check.message || 'Please enter an email to receive a passwordless sign-in link.');
      return;
    }

    const res = await sendPasswordlessLink(cleanEmail);
    if (res.success) {
      Alert.alert('✨ Magic Link Sent', res.message || `Sign-in link sent to ${cleanEmail}. Click the link to log in instantly!`);
      setShowSignInPopup(false);
    } else {
      Alert.alert('❌ Error', res.message || 'Failed to send magic link.');
    }
  };

  const handleResetPin = async () => {
    const res = await resetUserPin(forgotEmail, newPin);
    if (res.success) {
      Alert.alert('✅ Success', res.message);
      setEmailAddr(forgotEmail);
      setEmailPin(newPin);
      setPopupSubTab('LOGIN');
    } else {
      Alert.alert('⚠️ Reset Failed', res.message || 'Unable to reset PIN.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5EE" />

      {/* Top Header with Skip Action */}
      <View style={[styles.topHeader, { paddingTop: topPadding }]}>
        <View style={styles.topHeaderLeft}>
          <Text style={styles.omBadge}>ॐ</Text>
          <Text style={styles.topHeaderTitle}>SoulRise Panchang</Text>
        </View>

        <TouchableOpacity style={styles.skipBtn} onPress={() => setShowGuestPopup(true)} activeOpacity={0.8}>
          <Text style={styles.skipBtnText}>Skip for Now ➔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Sacred Sun Crest Banner */}
        <View style={styles.crestBanner}>
          <View style={styles.sunBadge}>
            <Svg width={42} height={42} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={5} fill="#DFB059" />
              <Path
                d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"
                stroke="#2B0E14"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
          </View>
          <Text style={styles.mainTitle}>Account Sign In / खाता लॉगिन</Text>
          <Text style={styles.subtitle}>
            Sign in to securely back up your Janam Kundlis and sync sacred Panchang reminders across all your devices.
          </Text>
        </View>

        {/* Benefits Card */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsHeaderTitle}>BENEFITS OF SIGNING IN • लाभ</Text>

          <View style={styles.benefitRow}>
            <Text style={styles.benefitIcon}>☁️</Text>
            <View style={styles.benefitTextCol}>
              <Text style={styles.benefitTitle}>Encrypted Cloud Backup</Text>
              <Text style={styles.benefitDesc}>Never lose your family birth charts when upgrading or changing phones.</Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <Text style={styles.benefitIcon}>🔔</Text>
            <View style={styles.benefitTextCol}>
              <Text style={styles.benefitTitle}>Multi-Device Dharma Sync</Text>
              <Text style={styles.benefitDesc}>Sync custom Vrats, Ekadashi, and Choghadiya notification preferences.</Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <Text style={styles.benefitIcon}>🌟</Text>
            <View style={styles.benefitTextCol}>
              <Text style={styles.benefitTitle}>Personalized Astrology Insights</Text>
              <Text style={styles.benefitDesc}>Get daily personalized Gochar (transits) matched to your Moon sign.</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons Section */}
        <View style={styles.actionsContainer}>
          {/* Button 1: Google Sign In */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleSignIn}
            activeOpacity={0.85}
          >
            <View style={styles.googleIconBadge}>
              <Text style={{ color: '#4285F4', fontSize: 16, fontWeight: 'bold' }}>G</Text>
            </View>
            <Text style={styles.googleBtnText}>Sign in with Google</Text>
          </TouchableOpacity>

          <View style={styles.orDividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Button 2: Email / Phone Sign In (Triggers Sub-Popup) */}
          <TouchableOpacity
            style={styles.emailPhoneBtn}
            onPress={() => {
              setPopupSubTab('LOGIN');
              setShowSignInPopup(true);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.emailPhoneIcon}>✉️ / 📱</Text>
            <Text style={styles.emailPhoneText}>Sign in with Email or Phone ➔</Text>
          </TouchableOpacity>

          {/* Button 3: Continue as Guest */}
          <TouchableOpacity
            style={styles.guestBtn}
            onPress={() => setShowGuestPopup(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.guestBtnText}>
              Continue as Guest (अतिथि के रूप में जारी रखें)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Assurance */}
        <Text style={styles.privacyNote}>
          🔒 100% Spiritual Data Privacy. We do not sell or track your sacred horoscope information.
        </Text>
      </ScrollView>

      {/* ======================================================== */}
      {/* 1. SIGN IN SUB-POPUP MODAL                               */}
      {/* ======================================================== */}
      <Modal
        visible={showSignInPopup}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSignInPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupCard}>
            {/* Popup Header */}
            <View style={styles.popupHeader}>
              <View style={styles.popupHeaderTitleCol}>
                <Text style={styles.popupMainTitle}>
                  {popupSubTab === 'LOGIN' ? '✉️ / 📱 Sign In with Email or Phone' : '🔑 Reset 6-Digit PIN'}
                </Text>
                <Text style={styles.popupSubtitle}>
                  {popupSubTab === 'LOGIN' ? 'Enter credentials or request magic link' : 'Enter registered email to reset your PIN'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowSignInPopup(false)}
                style={styles.closeBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {popupSubTab === 'LOGIN' ? (
                <View style={styles.formContainer}>
                  {/* Mode Indicator */}
                  <View style={styles.modeIndicatorRow}>
                    <Text style={styles.inputLabel}>Email or Phone Number:</Text>
                    <Text style={[styles.modeBadge, { color: inputType === 'PHONE' ? '#B88428' : '#237B4B' }]}>
                      {inputType === 'PHONE' ? '📱 Mobile Phone Mode' : '✉️ Email Mode'}
                    </Text>
                  </View>

                  {/* Country Selector (If Phone Mode) */}
                  {inputType === 'PHONE' && (
                    <TouchableOpacity
                      style={styles.countryPickerPill}
                      onPress={() => setShowCountryModal(true)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.countryPickerText}>
                        {selectedCountry.flag} {selectedCountry.name} ({selectedCountry.dialCode}) ▼
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Input 1: Email or Phone */}
                  <TextInput
                    style={styles.textInput}
                    placeholder={inputType === 'PHONE' ? `e.g. 9876543210 (${selectedCountry.minDigits} digits)` : "user@example.com"}
                    placeholderTextColor="#8A7571"
                    value={emailAddr}
                    onChangeText={setEmailAddr}
                    keyboardType={inputType === 'PHONE' ? 'phone-pad' : 'email-address'}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  {/* Input 2: 6-Digit PIN */}
                  <View style={styles.pinHeaderRow}>
                    <Text style={styles.inputLabel}>6-Digit Security PIN:</Text>
                    <TouchableOpacity onPress={() => {
                      setForgotEmail(emailAddr);
                      setPopupSubTab('FORGOT_PIN');
                    }}>
                      <Text style={styles.forgotPinLink}>Forgot PIN?</Text>
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter 6-digit PIN"
                    placeholderTextColor="#8A7571"
                    value={emailPin}
                    onChangeText={setEmailPin}
                    secureTextEntry
                    keyboardType="number-pad"
                    maxLength={8}
                  />

                  {/* Primary Submit Button */}
                  <TouchableOpacity
                    style={styles.popupPrimarySubmitBtn}
                    onPress={handleSmartSubmit}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.popupPrimarySubmitText}>
                      Sign In & Access Panchang (लॉगिन करें) ➔
                    </Text>
                  </TouchableOpacity>

                  {/* Alternative: Magic Link for Email */}
                  {inputType === 'EMAIL' && (
                    <TouchableOpacity
                      style={styles.magicLinkBtn}
                      onPress={handleSendMagicLink}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.magicLinkText}>
                        ✨ Send Passwordless Magic Link to Email
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                /* Forgot PIN Reset Form */
                <View style={styles.formContainer}>
                  <Text style={styles.inputLabel}>Your Email Address:</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. user@example.com"
                    placeholderTextColor="#8A7571"
                    value={forgotEmail}
                    onChangeText={setForgotEmail}
                    autoCapitalize="none"
                  />

                  <Text style={styles.inputLabel}>New 6-Digit PIN:</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter new 6-digit PIN"
                    placeholderTextColor="#8A7571"
                    value={newPin}
                    onChangeText={setNewPin}
                    secureTextEntry
                    keyboardType="number-pad"
                    maxLength={8}
                  />

                  <TouchableOpacity
                    style={styles.popupPrimarySubmitBtn}
                    onPress={handleResetPin}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.popupPrimarySubmitText}>Reset PIN & Return ➔</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelLink}
                    onPress={() => setPopupSubTab('LOGIN')}
                  >
                    <Text style={styles.cancelLinkText}>Back to Login</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* 2. GUEST MODE CONFIRMATION POPUP                         */}
      {/* ======================================================== */}
      <Modal
        visible={showGuestPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGuestPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.guestCard}>
            <View style={styles.guestCrest}>
              <Text style={styles.guestIcon}>🕉️</Text>
            </View>
            <Text style={styles.guestTitle}>Continue as Guest / अतिथि प्रवेश</Text>
            <Text style={styles.guestDesc}>
              You can access all daily Panchang calculations, Muhurats, Choghadiya, and Festival calendars without an account.
            </Text>
            <Text style={styles.guestNote}>
              Note: Saved Janam Kundli profiles and reminders will be stored locally on this phone. You can create an account anytime from Settings.
            </Text>

            <View style={styles.guestActionsRow}>
              <TouchableOpacity
                style={styles.guestCancelBtn}
                onPress={() => setShowGuestPopup(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.guestCancelText}>Sign In Instead</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.guestConfirmBtn}
                onPress={() => {
                  setShowGuestPopup(false);
                  onSkip();
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.guestConfirmText}>Proceed as Guest ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Country Code Selection Modal */}
      <Modal
        visible={showCountryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.popupCard, { maxHeight: '80%' }]}>
            <View style={styles.popupHeader}>
              <Text style={styles.popupMainTitle}>Select Country Code</Text>
              <TouchableOpacity onPress={() => setShowCountryModal(false)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {COUNTRY_CODES.map((item) => (
                <TouchableOpacity
                  key={item.dialCode + item.name}
                  style={styles.countryItemRow}
                  onPress={() => {
                    setSelectedCountry(item);
                    setShowCountryModal(false);
                  }}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryDialCode}>{item.dialCode}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EADBCE',
    backgroundColor: '#F8F5EE',
  },
  topHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  omBadge: {
    fontSize: 16,
    color: '#DFB059',
    marginRight: 6,
  },
  topHeaderTitle: {
    fontSize: 16,
    fontFamily: Fonts.cormorantBold,
    color: '#2B0E14',
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  skipBtnText: {
    fontSize: 13,
    fontFamily: Fonts.jakartaSemiBold,
    color: '#7D6A68',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  crestBanner: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sunBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#DFB059',
    marginBottom: 12,
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  mainTitle: {
    fontSize: 22,
    fontFamily: Fonts.cormorantBold,
    color: '#2B0E14',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Fonts.jakartaRegular,
    color: '#7D6A68',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  benefitsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#EADBCE',
    marginBottom: 22,
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  benefitsHeaderTitle: {
    fontSize: 11,
    fontFamily: Fonts.jakartaSemiBold,
    color: '#7D6A68',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 1,
  },
  benefitTextCol: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 13,
    fontFamily: Fonts.jakartaBold,
    color: '#2B0E14',
    marginBottom: 2,
  },
  benefitDesc: {
    fontSize: 11,
    fontFamily: Fonts.jakartaRegular,
    color: '#665554',
    lineHeight: 15,
  },
  actionsContainer: {
    width: '100%',
    marginBottom: 16,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 13,
    borderWidth: 1.2,
    borderColor: '#D8C7B8',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  googleIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F3F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  googleBtnText: {
    fontSize: 14,
    fontFamily: Fonts.jakartaSemiBold,
    color: '#2B0E14',
  },
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EADBCE',
  },
  orText: {
    fontSize: 11,
    fontFamily: Fonts.jakartaMedium,
    color: '#9C8885',
    marginHorizontal: 12,
  },
  emailPhoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2B0E14',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.2,
    borderColor: '#DFB059',
    marginBottom: 14,
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  emailPhoneIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  emailPhoneText: {
    fontSize: 14,
    fontFamily: Fonts.jakartaBold,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  guestBtnText: {
    fontSize: 12,
    fontFamily: Fonts.jakartaSemiBold,
    color: '#7D6A68',
    textDecorationLine: 'underline',
  },
  privacyNote: {
    fontSize: 10,
    fontFamily: Fonts.jakartaRegular,
    color: '#8A7571',
    textAlign: 'center',
    lineHeight: 14,
    marginTop: 6,
    paddingHorizontal: 12,
  },

  // Modal Overlay & Sub-Popup
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 7, 12, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  popupCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FBF9F4',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#DFB059',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  popupHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EADBCE',
    paddingBottom: 10,
  },
  popupHeaderTitleCol: {
    flex: 1,
    paddingRight: 8,
  },
  popupMainTitle: {
    fontSize: 15,
    fontFamily: Fonts.jakartaBold,
    color: '#2B0E14',
  },
  popupSubtitle: {
    fontSize: 11,
    fontFamily: Fonts.jakartaRegular,
    color: '#7D6A68',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    fontSize: 16,
    color: '#7D6A68',
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 4,
  },
  modeIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: Fonts.jakartaSemiBold,
    color: '#2B0E14',
  },
  modeBadge: {
    fontSize: 10,
    fontFamily: Fonts.jakartaBold,
  },
  countryPickerPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EADBCE',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  countryPickerText: {
    fontSize: 12,
    fontFamily: Fonts.jakartaMedium,
    color: '#2B0E14',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#EADBCE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: Fonts.jakartaRegular,
    color: '#2B0E14',
    marginBottom: 12,
  },
  pinHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  forgotPinLink: {
    fontSize: 11,
    fontFamily: Fonts.jakartaSemiBold,
    color: '#2B0E14',
    textDecorationLine: 'underline',
  },
  popupPrimarySubmitBtn: {
    backgroundColor: '#2B0E14',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#DFB059',
    marginTop: 4,
    marginBottom: 8,
  },
  popupPrimarySubmitText: {
    fontSize: 13,
    fontFamily: Fonts.jakartaBold,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  magicLinkBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  magicLinkText: {
    fontSize: 11,
    fontFamily: Fonts.jakartaSemiBold,
    color: '#237B4B',
    textDecorationLine: 'underline',
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelLinkText: {
    fontSize: 12,
    fontFamily: Fonts.jakartaMedium,
    color: '#7D6A68',
  },

  // Guest Card Popup
  guestCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FBF9F4',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DFB059',
  },
  guestCrest: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFDF9',
    borderWidth: 1.2,
    borderColor: '#DFB059',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  guestIcon: {
    fontSize: 22,
  },
  guestTitle: {
    fontSize: 16,
    fontFamily: Fonts.cormorantBold,
    color: '#2B0E14',
    marginBottom: 8,
  },
  guestDesc: {
    fontSize: 12,
    fontFamily: Fonts.jakartaRegular,
    color: '#5C4745',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 10,
  },
  guestNote: {
    fontSize: 10,
    fontFamily: Fonts.jakartaRegular,
    color: '#8A7571',
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  guestActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  guestCancelBtn: {
    flex: 1,
    backgroundColor: '#F2ECE1',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8C7B8',
  },
  guestCancelText: {
    fontSize: 12,
    fontFamily: Fonts.jakartaSemiBold,
    color: '#7D6A68',
  },
  guestConfirmBtn: {
    flex: 1.3,
    backgroundColor: '#2B0E14',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#DFB059',
  },
  guestConfirmText: {
    fontSize: 12,
    fontFamily: Fonts.jakartaBold,
    color: '#FFFFFF',
  },

  // Country Modal Items
  countryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EADBCE',
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 10,
  },
  countryName: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.jakartaRegular,
    color: '#2B0E14',
  },
  countryDialCode: {
    fontSize: 13,
    fontFamily: Fonts.jakartaBold,
    color: '#DFB059',
  },
});
