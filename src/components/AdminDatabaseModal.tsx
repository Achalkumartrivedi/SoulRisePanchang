import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert
} from 'react-native';
import { Colors } from '../theme/colors';
import { getUserProfile, UserProfile } from '../engine/userDatabase';
import { getFeedbackHistory, FeedbackItem } from '../engine/feedbackStorage';

interface AdminDatabaseModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AdminDatabaseModal: React.FC<AdminDatabaseModalProps> = ({ visible, onClose }) => {
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [activeTab, setActiveTab] = useState<'USERS' | 'FEEDBACK' | 'CLOUD_INFO'>('USERS');

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    const p = await getUserProfile();
    setCurrentProfile(p);

    const fb = await getFeedbackHistory();
    setFeedbackList(fb);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>📊 Developer Admin & User Database</Text>
              <Text style={styles.headerSub}>View Logged-in Users & Customer Feedback</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Sub-Header Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'USERS' && styles.tabBtnActive]}
              onPress={() => setActiveTab('USERS')}
            >
              <Text style={[styles.tabText, activeTab === 'USERS' && styles.tabTextActive]}>
                👤 Users Logged In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'FEEDBACK' && styles.tabBtnActive]}
              onPress={() => setActiveTab('FEEDBACK')}
            >
              <Text style={[styles.tabText, activeTab === 'FEEDBACK' && styles.tabTextActive]}>
                💬 Customer Feedback ({feedbackList.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'CLOUD_INFO' && styles.tabBtnActive]}
              onPress={() => setActiveTab('CLOUD_INFO')}
            >
              <Text style={[styles.tabText, activeTab === 'CLOUD_INFO' && styles.tabTextActive]}>
                ☁️ Central Cloud Setup
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {activeTab === 'USERS' && (
              <View>
                <Text style={styles.sectionTitle}>👤 Registered User Profiles (Local Database)</Text>

                {currentProfile ? (
                  <View style={styles.userCard}>
                    <View style={styles.userBadge}>
                      <Text style={styles.userBadgeText}>
                        {currentProfile.authType === 'GOOGLE' ? '🔴 GOOGLE USER' : '👤 GUEST USER'}
                      </Text>
                    </View>

                    <Text style={styles.userName}>{currentProfile.name}</Text>
                    <Text style={styles.userDetail}>📧 Email: {currentProfile.email}</Text>
                    <Text style={styles.userDetail}>🆔 User ID: {currentProfile.id}</Text>
                    <Text style={styles.userDetail}>
                      📅 First Sign-In: {new Date(currentProfile.createdAtIso).toLocaleString()}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>No user logged in currently.</Text>
                    <Text style={styles.emptySub}>Sign in via Guest or Google on Settings screen to populate user DB.</Text>
                  </View>
                )}
              </View>
            )}

            {activeTab === 'FEEDBACK' && (
              <View>
                <Text style={styles.sectionTitle}>💬 Submitted Customer Feedback ({feedbackList.length})</Text>

                {feedbackList.length > 0 ? (
                  feedbackList.map((item, idx) => (
                    <View key={item.id || idx} style={styles.fbCard}>
                      <View style={styles.fbHeaderRow}>
                        <Text style={styles.fbCategory}>{item.category}</Text>
                        <Text style={styles.fbDate}>
                          {new Date(item.submittedAtIso).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text style={styles.fbSubject}>📌 {item.subject}</Text>
                      <Text style={styles.fbMessage}>{item.message}</Text>
                      {item.attachmentName && (
                        <Text style={styles.fbAttachment}>
                          📎 Attached File: {item.attachmentName} ({item.attachmentSizeMb} MB)
                        </Text>
                      )}
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>No customer feedback submitted yet.</Text>
                  </View>
                )}
              </View>
            )}

            {activeTab === 'CLOUD_INFO' && (
              <View>
                <Text style={styles.sectionTitle}>☁️ How to view global logins across ALL user devices:</Text>
                <Text style={styles.cloudDesc}>
                  Currently, user logins and feedback are saved in local device storage (`AsyncStorage`). To aggregate global login counts from thousands of customer phones onto a single web dashboard:
                </Text>

                <View style={styles.cloudBox}>
                  <Text style={styles.cloudBoxTitle}>1. Firebase Firestore (Recommended & 100% Free)</Text>
                  <Text style={styles.cloudBoxDesc}>
                    Every time a user clicks Guest Sign-In or Google Sign-In, their Name, Email, and Sign-in Date are pushed to Firebase Firestore. You can view all customer logins in real-time at console.firebase.google.com!
                  </Text>

                  <Text style={[styles.cloudBoxTitle, { marginTop: 10 }]}>2. Supabase / Custom Express API</Text>
                  <Text style={styles.cloudBoxDesc}>
                    Connects to your custom PostgreSQL database to track daily active users (DAU) and total user registrations.
                  </Text>
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
    maxHeight: 600
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
    fontWeight: 'bold'
  },
  headerSub: {
    color: '#FFD700',
    fontSize: 11,
    marginTop: 2
  },
  closeBtn: {
    padding: 4
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF5EE',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center'
  },
  tabBtnActive: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.maroon,
    backgroundColor: '#FFFFFF'
  },
  tabText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500'
  },
  tabTextActive: {
    color: Colors.maroon,
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 12
  },
  userCard: {
    backgroundColor: '#FFF8E7',
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    borderRadius: 10
  },
  userBadge: {
    backgroundColor: Colors.maroon,
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 8
  },
  userBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold'
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 6
  },
  userDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4
  },
  emptyBox: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textSecondary
  },
  emptySub: {
    fontSize: 11,
    color: '#888888',
    marginTop: 4,
    textAlign: 'center'
  },
  fbCard: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  fbHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  fbCategory: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.maroon,
    backgroundColor: '#FFF3E0',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4
  },
  fbDate: {
    fontSize: 10,
    color: '#888888'
  },
  fbSubject: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4
  },
  fbMessage: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16
  },
  fbAttachment: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginTop: 6
  },
  cloudDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12
  },
  cloudBox: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.maroon
  },
  cloudBoxTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary
  },
  cloudBoxDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16
  }
});
