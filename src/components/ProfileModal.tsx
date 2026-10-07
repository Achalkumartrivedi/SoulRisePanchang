import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Fonts } from '../constants/typography';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose }) => {
  const { user: userProfile, logout } = useAuth();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  const getInitials = (name: string): string => {
    if (!name) return 'SP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAuthBadge = (authType?: string) => {
    switch (authType) {
      case 'GOOGLE':
        return { label: 'GOOGLE ACCOUNT', bg: '#FEE2E2', text: '#B91C1C' };
      case 'EMAIL':
        return { label: 'EMAIL & PIN', bg: '#E0E7FF', text: '#3730A3' };
      case 'PHONE':
        return { label: 'PHONE VERIFIED', bg: '#DCFCE7', text: '#15803D' };
      default:
        return { label: 'GUEST PROFILE', bg: '#FEF3C7', text: '#92400E' };
    }
  };

  const badge = getAuthBadge(userProfile?.authType);

  const handleLogout = async () => {
    setLogoutConfirmVisible(false);
    await logout();
    Alert.alert('✅ Logged Out', 'You have been logged out. Your local settings remain intact.');
  };

  return (
    <>
      <Modal
        visible={visible && !authModalVisible}
        animationType="fade"
        transparent
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalCard}>
                {/* Header */}
                <View style={styles.headerRow}>
                  <View style={styles.headerLeft}>
                    <View style={styles.crestCircle}>
                      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          fill="#DFB059"
                        />
                      </Svg>
                    </View>
                    <View>
                      <Text style={styles.modalTitle}>Customer Profile & Account</Text>
                      <Text style={styles.modalSubtitle}>Sacred Identity & Vedic Vault</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.closeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Profile Card Body */}
                <ScrollView
                  style={styles.scrollArea}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {userProfile ? (
                    /* Logged In View */
                    <View style={styles.userSection}>
                      <View style={styles.avatarRow}>
                        <View style={styles.avatarCircle}>
                          <Text style={styles.avatarInitials}>
                            {getInitials(userProfile.name)}
                          </Text>
                        </View>
                        <View style={styles.userDetails}>
                          <Text style={styles.userName} numberOfLines={1}>
                            {userProfile.name}
                          </Text>
                          <Text style={styles.userEmail} numberOfLines={1}>
                            {userProfile.email}
                          </Text>
                          <View style={[styles.authBadgePill, { backgroundColor: badge.bg }]}>
                            <Text style={[styles.authBadgeText, { color: badge.text }]}>
                              {badge.label}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Member Info Banner */}
                      <View style={styles.infoBanner}>
                        <View style={styles.infoItem}>
                          <Text style={styles.infoLabel}>MEMBER SINCE</Text>
                          <Text style={styles.infoValue}>
                            {userProfile.createdAtIso
                              ? new Date(userProfile.createdAtIso).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '2026'}
                          </Text>
                        </View>
                        <View style={styles.infoDivider} />
                        <View style={styles.infoItem}>
                          <Text style={styles.infoLabel}>CLOUD SYNC</Text>
                          <Text style={[styles.infoValue, { color: '#059669' }]}>Active ✓</Text>
                        </View>
                      </View>

                      {/* Account Action Buttons */}
                      <View style={styles.actionButtonGroup}>
                        <TouchableOpacity
                          style={styles.switchUserBtn}
                          onPress={() => setAuthModalVisible(true)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.switchUserBtnText}>🔄 Switch Account / Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.logoutBtn}
                          onPress={() => setLogoutConfirmVisible(true)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.logoutBtnText}>🚪 Log Out</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    /* Guest View */
                    <View style={styles.guestSection}>
                      <View style={styles.guestAvatar}>
                        <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
                          <Circle cx="12" cy="8" r="4" stroke="#DFB059" strokeWidth="1.8" />
                          <Path
                            d="M4 20c0-4 4-6 8-6s8 2 8 6"
                            stroke="#DFB059"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </Svg>
                      </View>
                      <Text style={styles.guestGreeting}>Namaste, Sacred Seeker</Text>
                      <Text style={styles.guestSub}>
                        Sign in to save and sync your Janam Kundli charts, personalized reminder bells, and favored Muhurtas securely across your devices.
                      </Text>

                      <TouchableOpacity
                        style={styles.signInButton}
                        onPress={() => setAuthModalVisible(true)}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.signInButtonText}>
                          🔑 Sign In (Google or Email/PIN)
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Sacred Almanac Features Vault */}
                  <View style={styles.vaultSection}>
                    <Text style={styles.vaultTitle}>SACRED VAULT STATUS</Text>

                    <View style={styles.vaultItem}>
                      <Text style={styles.vaultItemIcon}>🪔</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.vaultItemTitle}>Janam Kundli Profiles</Text>
                        <Text style={styles.vaultItemDesc}>
                          Birth chart & planetary lagna data stored securely on this device
                        </Text>
                      </View>
                    </View>

                    <View style={styles.vaultItem}>
                      <Text style={styles.vaultItemIcon}>🔔</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.vaultItemTitle}>Panchang Reminders</Text>
                        <Text style={styles.vaultItemDesc}>
                          Tithi, Vrat, and sacred fasting alerts enabled
                        </Text>
                      </View>
                    </View>

                    <View style={styles.vaultItem}>
                      <Text style={styles.vaultItemIcon}>🔐</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.vaultItemTitle}>Privacy & Device Processing</Text>
                        <Text style={styles.vaultItemDesc}>
                          100% on-device astronomical calculations with strict privacy
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Auth Modal for Sign In / Switching Accounts */}
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        onSuccess={(profile) => {
          setAuthModalVisible(false);
          Alert.alert('✅ Profile Active', `Welcome, ${profile.name}! Your account is now active.`);
        }}
      />

      {/* Log Out Confirmation Dialog */}
      <Modal visible={logoutConfirmVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { padding: 20, maxWidth: 360 }]}>
            <Text style={styles.logoutConfirmTitle}>🚪 Confirm Log Out</Text>
            <Text style={styles.logoutConfirmDesc}>
              Are you sure you want to log out of your account? Your local data will remain saved on this device.
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setLogoutConfirmVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmLogoutBtn}
                onPress={handleLogout}
              >
                <Text style={styles.confirmLogoutBtnText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 9, 13, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '82%',
    backgroundColor: '#FAF7F0',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#DFB059',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2B0E14',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(223, 176, 89, 0.3)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  crestCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(223, 176, 89, 0.15)',
    borderWidth: 1,
    borderColor: '#DFB059',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 18,
    color: '#F8F5EE',
    letterSpacing: 0.3,
  },
  modalSubtitle: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 11,
    color: '#D4AF37',
    opacity: 0.9,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  closeBtnText: {
    color: '#F8F5EE',
    fontSize: 14,
    fontWeight: '700',
  },
  scrollArea: {
    flexGrow: 1,
  },
  scrollContent: {
    padding: 16,
  },
  userSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.3)',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#2B0E14',
    borderWidth: 2,
    borderColor: '#DFB059',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 22,
    color: '#DFB059',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 18,
    color: '#2B0E14',
  },
  userEmail: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 12,
    color: '#7D6A68',
    marginTop: 1,
  },
  authBadgePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginTop: 6,
  },
  authBadgeText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FAF5EE',
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.2)',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#7D6A68',
    letterSpacing: 0.8,
  },
  infoValue: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 12,
    color: '#2B0E14',
    marginTop: 2,
  },
  infoDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(223, 176, 89, 0.3)',
  },
  actionButtonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  switchUserBtn: {
    flex: 1.2,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#DFB059',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchUserBtnText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11.5,
    color: '#2B0E14',
  },
  logoutBtn: {
    flex: 0.8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11.5,
    color: '#DC2626',
  },
  guestSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.3)',
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  guestAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FAF5EE',
    borderWidth: 1.5,
    borderColor: '#DFB059',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  guestGreeting: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 20,
    color: '#2B0E14',
    marginBottom: 6,
  },
  guestSub: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 12,
    color: '#7D6A68',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  signInButton: {
    width: '100%',
    backgroundColor: '#2B0E14',
    borderWidth: 1.5,
    borderColor: '#DFB059',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
    color: '#DFB059',
    letterSpacing: 0.4,
  },
  vaultSection: {
    backgroundColor: '#FAF5EE',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.25)',
    padding: 14,
  },
  vaultTitle: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#7D6A68',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  vaultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(223, 176, 89, 0.15)',
  },
  vaultItemIcon: {
    fontSize: 18,
  },
  vaultItemTitle: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 12.5,
    color: '#2B0E14',
  },
  vaultItemDesc: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 10.5,
    color: '#7D6A68',
    marginTop: 1,
  },
  logoutConfirmTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 18,
    color: '#B91C1C',
    textAlign: 'center',
    marginBottom: 8,
  },
  logoutConfirmDesc: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 12.5,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
    color: '#374151',
  },
  confirmLogoutBtn: {
    flex: 1,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  confirmLogoutBtnText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
});
