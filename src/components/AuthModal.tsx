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
import { useAuth } from '../context/AuthContext';
import {
  COUNTRY_CODES,
  DEFAULT_COUNTRY,
  CountryCodeItem,
  detectInputType,
  validatePhoneNumberForCountry,
  validateEmailFormat
} from '../utils/countryCodes';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, onSuccess }) => {
  const { signInWithGoogle, signInWithEmail, sendPasswordlessLink } = useAuth();
  const [authMode, setAuthMode] = useState<'SELECT' | 'EMAIL_FORM' | 'GOOGLE_EMAIL'>('SELECT');

  // Unified Email / Phone State
  const [emailAddr, setEmailAddr] = useState('');
  const [emailPin, setEmailPin] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCodeItem>(DEFAULT_COUNTRY);
  const [showCountryModal, setShowCountryModal] = useState(false);

  // Google State
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  const inputType = detectInputType(emailAddr);

  const handleSendMagicLink = async () => {
    const cleanEmail = emailAddr.trim().toLowerCase();
    const emailCheck = validateEmailFormat(cleanEmail);
    if (!emailCheck.valid) {
      Alert.alert('⚠️ Valid Email Required', emailCheck.message || 'Please enter a valid email address to receive a passwordless magic link.');
      return;
    }

    const res = await sendPasswordlessLink(cleanEmail);
    if (res.success) {
      Alert.alert('✨ Magic Link Sent', res.message || `Magic sign-in link sent to ${cleanEmail}. Open the email link to sign in!`);
      resetAndClose();
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
      onSuccess(res.profile);
      resetAndClose();
    } else {
      Alert.alert('❌ Sign In Failed', res.message || 'Incorrect PIN or login error.');
    }
  };

  const handleGoogleSubmit = async () => {
    const res = await signInWithGoogle();
    if (res.success && res.profile) {
      onSuccess(res.profile);
      resetAndClose();
    } else if (res.message && !res.message.includes('cancelled')) {
      Alert.alert('❌ Sign In Failed', res.message || 'Google Sign-In error.');
    }
  };

  const resetAndClose = () => {
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
              {authMode === 'EMAIL_FORM' && '✉️ / 📱 Sign in with Email or Phone'}
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
                  onPress={() => handleGoogleSubmit()}
                  activeOpacity={0.8}
                >
                  <View style={styles.googleLogoBadge}>
                    <Text style={{ color: '#4285F4', fontSize: 14, fontWeight: 'bold' }}>G</Text>
                  </View>
                  <Text style={styles.googleBtnText}>Sign in With Google</Text>
                </TouchableOpacity>

                {/* Smart Unified Email / Phone Sign In */}
                <TouchableOpacity
                  style={styles.guestBtn}
                  onPress={() => setAuthMode('EMAIL_FORM')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.guestIcon}>✉️ / 📱</Text>
                  <Text style={styles.guestBtnText}>Sign in with Email or Phone</Text>
                </TouchableOpacity>
              </View>
            )}

            {authMode === 'EMAIL_FORM' && (
              <View style={styles.formContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
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

                <Text style={styles.label}>6-Digit Security PIN / Password:</Text>
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
              </View>
            )}


          </ScrollView>
        </View>
      </View>

      {/* Country Code Picker Modal */}
      <Modal visible={showCountryModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.pickerModalCard}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>🌐 Select Country Code</Text>
              <TouchableOpacity onPress={() => setShowCountryModal(false)} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 360, padding: 12 }}>
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
  },
  magicLinkBtn: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#FAF3E0',
    borderWidth: 1,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center'
  },
  magicLinkBtnText: {
    color: Colors.maroon,
    fontSize: 12,
    fontWeight: 'bold'
  },
  countryPickerBtn: {
    backgroundColor: '#FFF8E7',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginBottom: 8,
    alignItems: 'center'
  },
  countryPickerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  pickerModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: 480
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  countryRowActive: {
    backgroundColor: '#FFF8E7'
  },
  countryFlagText: {
    fontSize: 18,
    marginRight: 10
  },
  countryNameText: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary
  },
  countryDialText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon
  }
});
