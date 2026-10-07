import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TouchableWithoutFeedback,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fonts } from '../constants/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReminderItem, ReminderCategory } from '../types/reminder';
import {
  getStoredReminders,
  toggleReminderState,
} from '../engine/reminderStorage';
import { CHOGHADIYA_NOTIF_KEY } from '../utils/choghadiyaNotifier';

interface ReminderBellModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToReminders?: () => void;
}

const CATEGORY_META: Record<ReminderCategory, { label: string; icon: string; bg: string; text: string }> = {
  WEEKLY_DAY: { label: 'WEEKLY FAST', icon: '🗓️', bg: '#FEF3C7', text: '#92400E' },
  TITHI_FESTIVAL: { label: 'TITHI & FESTIVAL', icon: '🪔', bg: '#FCE7F3', text: '#9D174D' },
  LAL_KITAB_REMEDY: { label: 'LAL KITAB REMEDY', icon: '☀️', bg: '#FFEDD5', text: '#9A3412' },
  DAILY_CHANT: { label: 'DAILY AARTI / MANTRA', icon: '🕉️', bg: '#E0E7FF', text: '#3730A3' },
  DATE_SPECIFIC: { label: 'SACRED DATE', icon: '✨', bg: '#FEF9C3', text: '#854D0E' },
};

export const ReminderBellModal: React.FC<ReminderBellModalProps> = ({
  visible,
  onClose,
  onNavigateToReminders,
}) => {
  const insets = useSafeAreaInsets();
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [purnimaEnabled, setPurnimaEnabled] = useState(true);
  const [amavasyaEnabled, setAmavasyaEnabled] = useState(true);
  const [choghadiyaEnabled, setChoghadiyaEnabled] = useState(false);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await getStoredReminders();
      setReminders(list);

      const pNotif = await AsyncStorage.getItem('PURNIMA_REMINDER_ENABLED');
      if (pNotif !== null) setPurnimaEnabled(pNotif === 'true');

      const aNotif = await AsyncStorage.getItem('AMAVASYA_REMINDER_ENABLED');
      if (aNotif !== null) setAmavasyaEnabled(aNotif === 'true');

      const cNotif = await AsyncStorage.getItem(CHOGHADIYA_NOTIF_KEY);
      if (cNotif !== null) setChoghadiyaEnabled(cNotif === 'true');
    } catch (err) {
      console.log('Error loading bell modal reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleReminder = async (id: string) => {
    const updated = await toggleReminderState(id);
    setReminders(updated);
  };

  const activeReminders = reminders.filter((r) => r.enabled);
  const totalActiveCount =
    activeReminders.length +
    (purnimaEnabled ? 1 : 0) +
    (amavasyaEnabled ? 1 : 0) +
    (choghadiyaEnabled ? 1 : 0);

  const formatScheduleText = (item: ReminderItem): string => {
    if (item.category === 'WEEKLY_DAY') {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = item.recurrence?.weeklyDayIndex !== undefined ? dayNames[item.recurrence.weeklyDayIndex] : 'Weekly';
      return `Every ${dayName}`;
    }
    if (item.category === 'TITHI_FESTIVAL') {
      if (item.recurrence?.subType === 'TITHI') {
        const cleanTithi = (item.recurrence.tithiName || 'Tithi').replace(/\s*\(.*\)/, '');
        return `Every ${cleanTithi}`;
      }
      return item.recurrence?.festivalName || 'Festival Day';
    }
    if (item.category === 'LAL_KITAB_REMEDY') {
      const done = item.lalKitabData?.completedDays || 0;
      const target = item.lalKitabData?.targetDays || 43;
      return `Day ${done} of ${target} • Daily Remedy`;
    }
    if (item.category === 'DAILY_CHANT') {
      if (item.timeSlots && item.timeSlots.length > 1) {
        return `Daily • ${item.timeSlots.join(', ')}`;
      }
      return 'Daily Mantra Japa';
    }
    return item.dateIso || 'Scheduled Date';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdropTouchArea} />
        </TouchableWithoutFeedback>

        <View style={styles.modalCard}>
          {/* Top handle bar */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.bellIconCircle}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    stroke="#DFB059"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <View>
                <Text style={styles.modalTitle}>Reminder Bells & Alarms</Text>
                <View style={styles.badgeRow}>
                  <View style={styles.activeCountBadge}>
                    <View style={styles.liveGreenDot} />
                    <Text style={styles.activeCountText}>{totalActiveCount} ACTIVE</Text>
                  </View>
                  <Text style={styles.modalSubtitle}>Configured from Reminders</Text>
                </View>
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

          {/* Reminders List */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {reminders.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🔕</Text>
                <Text style={styles.emptyTitle}>No Reminder Bells Configured</Text>
                <Text style={styles.emptySubtitle}>
                  Create fast, tithi, or daily chant reminders in the Reminders tab to receive sacred bells.
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.sectionHeaderLabel}>ACTIVE ALARM SCHEDULE</Text>
                {reminders.map((item) => {
                  const meta = CATEGORY_META[item.category] || CATEGORY_META.DAILY_CHANT;
                  const timeDisplay =
                    item.timeSlots && item.timeSlots.length > 1
                      ? item.timeSlots.join(' • ')
                      : item.timeStr;

                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.reminderItemCard,
                        !item.enabled && styles.reminderItemCardDisabled,
                      ]}
                    >
                      <View style={styles.reminderCardLeft}>
                        <View style={[styles.categoryBadge, { backgroundColor: meta.bg }]}>
                          <Text style={[styles.categoryBadgeText, { color: meta.text }]}>
                            {meta.icon} {meta.label}
                          </Text>
                        </View>

                        <Text
                          style={[
                            styles.reminderTitle,
                            !item.enabled && styles.reminderTitleDisabled,
                          ]}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>

                        <View style={styles.timeScheduleRow}>
                          <View style={styles.bellTimePill}>
                            <Text style={styles.bellTimePillText}>🔔 {timeDisplay}</Text>
                          </View>
                          <Text style={styles.scheduleText} numberOfLines={1}>
                            {formatScheduleText(item)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.switchWrapper}>
                        <Switch
                          value={item.enabled}
                          onValueChange={() => handleToggleReminder(item.id)}
                          trackColor={{ false: '#D1D5DB', true: '#2B0E14' }}
                          thumbColor={item.enabled ? '#DFB059' : '#F4F3F4'}
                        />
                      </View>
                    </View>
                  );
                })}

                {/* Sacred Moon & Choghadiya Quick Bell Status */}
                <Text style={[styles.sectionHeaderLabel, { marginTop: 14 }]}>
                  AUTOMATIC SACRED ALERTS
                </Text>

                <View style={styles.systemAlertItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.systemAlertTitle}>🌕 Purnima (Full Moon) Bell</Text>
                    <Text style={styles.systemAlertDesc}>Satyanarayan Vrat & Puja Alert</Text>
                  </View>
                  <View style={[styles.statusBadge, purnimaEnabled ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
                    <Text style={[styles.statusBadgeText, purnimaEnabled ? styles.statusBadgeTextActive : styles.statusBadgeTextInactive]}>
                      {purnimaEnabled ? 'ACTIVE' : 'OFF'}
                    </Text>
                  </View>
                </View>

                <View style={styles.systemAlertItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.systemAlertTitle}>🌑 Amavasya (New Moon) Bell</Text>
                    <Text style={styles.systemAlertDesc}>Pitru Tarpana & Ancestral Puja Alert</Text>
                  </View>
                  <View style={[styles.statusBadge, amavasyaEnabled ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
                    <Text style={[styles.statusBadgeText, amavasyaEnabled ? styles.statusBadgeTextActive : styles.statusBadgeTextInactive]}>
                      {amavasyaEnabled ? 'ACTIVE' : 'OFF'}
                    </Text>
                  </View>
                </View>

                <View style={styles.systemAlertItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.systemAlertTitle}>⏳ Shubh Choghadiya Bell</Text>
                    <Text style={styles.systemAlertDesc}>Amrit, Shubh & Labh transition alerts</Text>
                  </View>
                  <View style={[styles.statusBadge, choghadiyaEnabled ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
                    <Text style={[styles.statusBadgeText, choghadiyaEnabled ? styles.statusBadgeTextActive : styles.statusBadgeTextInactive]}>
                      {choghadiyaEnabled ? 'ACTIVE' : 'OFF'}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={[styles.footerContainer, { paddingBottom: Math.max(insets.bottom + 8, 16) }]}>
            <TouchableOpacity
              style={styles.manageBtn}
              onPress={() => {
                onClose();
                if (onNavigateToReminders) {
                  onNavigateToReminders();
                }
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.manageBtnText}>🔔 Open Full Reminders Tab ➔</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 9, 13, 0.78)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 0,
  },
  backdropTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCard: {
    width: '100%',
    height: '82%',
    backgroundColor: '#FAF7F0',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopWidth: 2,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: '#DFB059',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 20,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 2,
    backgroundColor: '#2B0E14',
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(223, 176, 89, 0.45)',
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
  bellIconCircle: {
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  activeCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 0.8,
    borderColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 12,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  activeCountText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#A7F3D0',
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 11,
    color: '#D4AF37',
    opacity: 0.9,
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
    flex: 1,
    minHeight: 140,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
  },
  sectionHeaderLabel: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#7D6A68',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  reminderItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.25)',
    padding: 12,
    marginBottom: 9,
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  reminderItemCardDisabled: {
    opacity: 0.6,
    backgroundColor: '#F5F5F0',
  },
  reminderCardLeft: {
    flex: 1,
    marginRight: 10,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  categoryBadgeText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8.5,
    letterSpacing: 0.4,
  },
  reminderTitle: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 13.5,
    color: '#2B0E14',
    marginBottom: 4,
  },
  reminderTitleDisabled: {
    color: '#7D6A68',
  },
  timeScheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bellTimePill: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F5DE9C',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bellTimePillText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10.5,
    color: '#92400E',
  },
  scheduleText: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11,
    color: '#7D6A68',
    flex: 1,
  },
  switchWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemAlertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF5EE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.2)',
    padding: 10,
    marginBottom: 8,
  },
  systemAlertTitle: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 12.5,
    color: '#2B0E14',
  },
  systemAlertDesc: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 10.5,
    color: '#7D6A68',
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeActive: {
    backgroundColor: '#DEF7EC',
  },
  statusBadgeInactive: {
    backgroundColor: '#F3F4F6',
  },
  statusBadgeText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9.5,
    letterSpacing: 0.5,
  },
  statusBadgeTextActive: {
    color: '#03543F',
  },
  statusBadgeTextInactive: {
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyEmoji: {
    fontSize: 42,
    marginBottom: 10,
  },
  emptyTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 18,
    color: '#2B0E14',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 12,
    color: '#7D6A68',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F2ECE1',
    borderTopWidth: 1,
    borderTopColor: 'rgba(223, 176, 89, 0.3)',
  },
  manageBtn: {
    backgroundColor: '#2B0E14',
    borderWidth: 1.5,
    borderColor: '#DFB059',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  manageBtnText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
    color: '#DFB059',
    letterSpacing: 0.5,
  },
});
