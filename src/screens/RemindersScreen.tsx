import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Switch,
  Alert
} from 'react-native';
import { Colors } from '../theme/colors';
import { ReminderItem, ReminderCategory } from '../types/reminder';
import {
  getStoredReminders,
  saveReminder,
  toggleReminderState,
  deleteReminder,
  markLalKitabDayDone
} from '../engine/reminderStorage';

const DAY_NAMES = ['Sunday (रविवार)', 'Monday (सोमवार)', 'Tuesday (मंगलवार)', 'Wednesday (बुधवार)', 'Thursday (गुरुवार)', 'Friday (शुक्रवार)', 'Saturday (शनिवार)'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const RemindersScreen: React.FC = () => {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<ReminderCategory | 'ALL'>('ALL');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReminder, setEditingReminder] = useState<ReminderItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReminderCategory>('WEEKLY_DAY');
  const [timeStr, setTimeStr] = useState('08:00 AM');
  const [notes, setNotes] = useState('');
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(6); // Saturday default
  const [selectedTithiType, setSelectedTithiType] = useState<'POONAM_PURNIMA' | 'AMAVASYA' | 'EKADASHI' | 'PRADOSH'>('POONAM_PURNIMA');
  const [targetDays, setTargetDays] = useState<string>('43'); // Lal Kitab default
  const [maxOccurrences, setMaxOccurrences] = useState<string>('5'); // e.g. 5 Thursdays

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    const list = await getStoredReminders();
    setReminders(list);
  };

  const handleOpenCreateModal = () => {
    setEditingReminder(null);
    setTitle('');
    setCategory('WEEKLY_DAY');
    setTimeStr('08:00 AM');
    setNotes('');
    setSelectedDayIdx(6);
    setSelectedTithiType('POONAM_PURNIMA');
    setTargetDays('43');
    setMaxOccurrences('5');
    setModalVisible(true);
  };

  const handleOpenEditModal = (item: ReminderItem) => {
    setEditingReminder(item);
    setTitle(item.title);
    setCategory(item.category);
    setTimeStr(item.timeStr);
    setNotes(item.notes || '');
    if (item.recurrence?.weeklyDayIndex !== undefined) {
      setSelectedDayIdx(item.recurrence.weeklyDayIndex);
    }
    if (item.recurrence?.tithiType) {
      setSelectedTithiType(item.recurrence.tithiType);
    }
    if (item.lalKitabData) {
      setTargetDays(String(item.lalKitabData.targetDays));
    }
    if (item.recurrence?.maxOccurrences) {
      setMaxOccurrences(String(item.recurrence.maxOccurrences));
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a reminder title.');
      return;
    }

    const newItem: ReminderItem = {
      id: editingReminder ? editingReminder.id : `rem-${Date.now()}`,
      title: title.trim(),
      category,
      timeStr,
      enabled: editingReminder ? editingReminder.enabled : true,
      notes: notes.trim(),
      createdAtIso: editingReminder ? editingReminder.createdAtIso : new Date().toISOString()
    };

    if (category === 'WEEKLY_DAY') {
      newItem.recurrence = {
        weeklyDayIndex: selectedDayIdx,
        maxOccurrences: parseInt(maxOccurrences, 10) || undefined
      };
    } else if (category === 'TITHI_PHASE') {
      newItem.recurrence = {
        tithiType: selectedTithiType
      };
    } else if (category === 'LAL_KITAB_REMEDY') {
      const tDays = parseInt(targetDays, 10) || 43;
      newItem.lalKitabData = editingReminder?.lalKitabData ? {
        ...editingReminder.lalKitabData,
        targetDays: tDays
      } : {
        targetDays: tDays,
        completedDays: 0,
        startDateIso: new Date().toISOString().split('T')[0],
        isCompleted: false
      };
    }

    const updated = await saveReminder(newItem);
    setReminders(updated);
    setModalVisible(false);
  };

  const handleToggle = async (id: string) => {
    const updated = await toggleReminderState(id);
    setReminders(updated);
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Reminder', 'Are you sure you want to delete this reminder?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = await deleteReminder(id);
          setReminders(updated);
        }
      }
    ]);
  };

  const handleMarkLalKitabDone = async (id: string) => {
    const updated = await markLalKitabDayDone(id);
    setReminders(updated);
  };

  const filteredReminders = reminders.filter(r => {
    if (selectedTab === 'ALL') return true;
    return r.category === selectedTab;
  });

  return (
    <View style={styles.container}>
      {/* Screen Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>⏰ Universal Smart Reminders</Text>
          <Text style={styles.headerSub}>Set recurring Vrats, Poonam, Lal Kitab remedies & Chants</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleOpenCreateModal} activeOpacity={0.8}>
          <Text style={styles.addBtnText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {/* Category Tabs Bar */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {[
            { id: 'ALL', label: 'All (सभी)' },
            { id: 'WEEKLY_DAY', label: '🗓️ Weekly Day Vrat' },
            { id: 'TITHI_PHASE', label: '🌕 Poonam & Tithi' },
            { id: 'LAL_KITAB_REMEDY', label: '🔮 Lal Kitab (43 Days)' },
            { id: 'DAILY_CHANT', label: '📿 Daily Chant' },
            { id: 'DATE_SPECIFIC', label: '📅 Date Reminders' }
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabChip, selectedTab === tab.id && styles.tabChipActive]}
              onPress={() => setSelectedTab(tab.id as any)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabChipText, selectedTab === tab.id && styles.tabChipTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Reminders List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {filteredReminders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>⏰</Text>
            <Text style={styles.emptyTitle}>No Reminders Found</Text>
            <Text style={styles.emptySub}>Tap "+ Create" to set your first Vrat, Poonam fast or Lal Kitab remedy reminder.</Text>
          </View>
        ) : (
          filteredReminders.map(item => {
            const isLalKitab = item.category === 'LAL_KITAB_REMEDY' && item.lalKitabData;
            const todayIso = new Date().toISOString().split('T')[0];
            const isDoneToday = isLalKitab && item.lalKitabData?.lastCompletedDateIso === todayIso;

            return (
              <View key={item.id} style={styles.reminderCard}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <View style={styles.badgeRow}>
                      <View style={styles.categoryTag}>
                        <Text style={styles.categoryTagText}>
                          {item.category === 'WEEKLY_DAY'
                            ? `🗓️ ${DAY_SHORT[item.recurrence?.weeklyDayIndex ?? 6]} Repeat`
                            : item.category === 'TITHI_PHASE'
                            ? `🌕 ${item.recurrence?.tithiType || 'Poonam'}`
                            : item.category === 'LAL_KITAB_REMEDY'
                            ? `🔮 Lal Kitab Remedy`
                            : item.category === 'DAILY_CHANT'
                            ? `📿 Daily Chant`
                            : `📅 ${item.dateIso || 'Specific Date'}`}
                        </Text>
                      </View>
                      <View style={styles.timeTag}>
                        <Text style={styles.timeTagText}>🕒 {item.timeStr}</Text>
                      </View>
                    </View>
                  </View>

                  <Switch
                    value={item.enabled}
                    onValueChange={() => handleToggle(item.id)}
                    trackColor={{ false: '#D1C4E9', true: Colors.maroon }}
                    thumbColor={item.enabled ? '#FFD700' : '#f4f3f4'}
                  />
                </View>

                {item.notes ? (
                  <Text style={styles.cardNotes}>📝 {item.notes}</Text>
                ) : null}

                {/* Lal Kitab 43-Day Progress Card Section */}
                {isLalKitab && item.lalKitabData ? (
                  <View style={styles.lalKitabBox}>
                    <View style={styles.lalKitabHeaderRow}>
                      <Text style={styles.lalKitabTitle}>🔮 43-Day Remedy Counter:</Text>
                      <Text style={styles.lalKitabCounter}>
                        Day {item.lalKitabData.completedDays} of {item.lalKitabData.targetDays}
                      </Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${Math.min(100, (item.lalKitabData.completedDays / item.lalKitabData.targetDays) * 100)}%` }
                        ]}
                      />
                    </View>

                    <View style={styles.lalKitabActionRow}>
                      <Text style={styles.lalKitabStatus}>
                        {item.lalKitabData.isCompleted
                          ? '🎉 43-Day Remedy Successfully Completed!'
                          : isDoneToday
                          ? '✅ Today\'s Remedy Marked Done!'
                          : '👉 Complete today\'s remedy and tap below:'}
                      </Text>

                      {!item.lalKitabData.isCompleted && (
                        <TouchableOpacity
                          style={[styles.markDoneBtn, isDoneToday && styles.markDoneBtnDisabled]}
                          onPress={() => handleMarkLalKitabDone(item.id)}
                          disabled={isDoneToday}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.markDoneBtnText}>
                            {isDoneToday ? '✓ Done Today' : '+ Mark Today Done'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ) : null}

                {/* Card Action Buttons */}
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity style={styles.actionBtnEdit} onPress={() => handleOpenEditModal(item)}>
                    <Text style={styles.actionBtnEditText}>✏️ Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtnDelete} onPress={() => handleDelete(item.id)}>
                    <Text style={styles.actionBtnDeleteText}>🗑️ Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Create / Edit Reminder Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>
                {editingReminder ? '✏️ Edit Reminder' : '⏰ Create Universal Reminder'}
              </Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 460 }}>
              {/* Title */}
              <Text style={styles.label}>Reminder Name / Title:</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Saturday Fast, Poonam Fast, 43-Day Remedy"
                value={title}
                onChangeText={setTitle}
              />

              {/* Category Selector */}
              <Text style={styles.label}>Reminder Category:</Text>
              <View style={styles.categoryRadioGrid}>
                {[
                  { id: 'WEEKLY_DAY', title: '🗓️ Weekly Day (Saturday/Thursday)' },
                  { id: 'TITHI_PHASE', title: '🌕 Poonam & Tithi Phase' },
                  { id: 'LAL_KITAB_REMEDY', title: '🔮 Lal Kitab (43 Days Counter)' },
                  { id: 'DAILY_CHANT', title: '📿 Daily Mantra Chant' }
                ].map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryRadioOption, category === cat.id && styles.categoryRadioActive]}
                    onPress={() => setCategory(cat.id as ReminderCategory)}
                  >
                    <Text style={[styles.categoryRadioText, category === cat.id && styles.categoryRadioTextActive]}>
                      {cat.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Category Specific Options */}
              {category === 'WEEKLY_DAY' && (
                <View style={styles.optionSubBox}>
                  <Text style={styles.subLabel}>Select Day of Week:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                    {DAY_NAMES.map((dName, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.dayChip, selectedDayIdx === idx && styles.dayChipActive]}
                        onPress={() => setSelectedDayIdx(idx)}
                      >
                        <Text style={[styles.dayChipText, selectedDayIdx === idx && styles.dayChipTextActive]}>
                          {DAY_SHORT[idx]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.subLabel}>Repeat Limit (e.g. 5 Thursdays, 16 Somvar Vrats):</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 5 or leave empty for unlimited"
                    keyboardType="number-pad"
                    value={maxOccurrences}
                    onChangeText={setMaxOccurrences}
                  />
                </View>
              )}

              {category === 'TITHI_PHASE' && (
                <View style={styles.optionSubBox}>
                  <Text style={styles.subLabel}>Select Sacred Tithi / Phase:</Text>
                  {[
                    { id: 'POONAM_PURNIMA', title: '🌕 Poonam (Full Moon Purnima)' },
                    { id: 'AMAVASYA', title: '🌑 Amavasya (New Moon)' },
                    { id: 'EKADASHI', title: '🌿 Ekadashi Vrat (11th Tithi)' },
                    { id: 'PRADOSH', title: '🔱 Pradosh Vrat (13th Tithi)' }
                  ].map(tType => (
                    <TouchableOpacity
                      key={tType.id}
                      style={[styles.tithiChip, selectedTithiType === tType.id && styles.tithiChipActive]}
                      onPress={() => setSelectedTithiType(tType.id as any)}
                    >
                      <Text style={[styles.tithiChipText, selectedTithiType === tType.id && styles.tithiChipTextActive]}>
                        {tType.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {category === 'LAL_KITAB_REMEDY' && (
                <View style={styles.optionSubBox}>
                  <Text style={styles.subLabel}>Total Remedy Target Days (default 43):</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 43"
                    keyboardType="number-pad"
                    value={targetDays}
                    onChangeText={setTargetDays}
                  />
                  <Text style={{ fontSize: 11, color: Colors.textMuted, marginTop: 4 }}>
                    🔮 Lal Kitab remedies are traditionally performed continuously for 43 consecutive days without break.
                  </Text>
                </View>
              )}

              {/* Time Picker Input */}
              <Text style={styles.label}>Notification Time (e.g. 08:00 AM, 06:30 PM):</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 08:00 AM"
                value={timeStr}
                onChangeText={setTimeStr}
              />

              {/* Notes */}
              <Text style={styles.label}>Notes / Fasting Rules:</Text>
              <TextInput
                style={[styles.input, { height: 60 }]}
                placeholder="Add special items, mantras, or fasting rules..."
                multiline
                value={notes}
                onChangeText={setNotes}
              />

              {/* Submit Button */}
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
                <Text style={styles.saveBtnText}>💾 Save Smart Reminder</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBg
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.maroon,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700'
  },
  headerSub: {
    fontSize: 11,
    color: '#FFE0B2',
    marginTop: 2
  },
  addBtn: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  filterContainer: {
    height: 48,
    backgroundColor: '#FAF5EE',
    borderBottomWidth: 1,
    borderColor: Colors.border
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  tabChip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFDF6',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  tabChipActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textSecondary
  },
  tabChipTextActive: {
    color: '#FFD700'
  },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    elevation: 2
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 4
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6
  },
  categoryTag: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#E65100'
  },
  timeTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  timeTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2E7D32'
  },
  cardNotes: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic'
  },
  lalKitabBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFE082'
  },
  lalKitabHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  lalKitabTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F57F17'
  },
  lalKitabCounter: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#FFE0B2',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF6F00',
    borderRadius: 4
  },
  lalKitabActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  lalKitabStatus: {
    fontSize: 10,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 6
  },
  markDoneBtn: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  markDoneBtnDisabled: {
    backgroundColor: '#9E9E9E'
  },
  markDoneBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFD700'
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 12
  },
  actionBtnEdit: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  actionBtnEditText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  actionBtnDelete: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  actionBtnDeleteText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#C62828'
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  emptySub: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#E8D8C8',
    paddingBottom: 8
  },
  modalHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  closeBtn: {
    padding: 4
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textMuted
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 10,
    marginBottom: 4
  },
  input: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#E8D8C8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: Colors.textPrimary
  },
  categoryRadioGrid: {
    gap: 6
  },
  categoryRadioOption: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#E8D8C8'
  },
  categoryRadioActive: {
    backgroundColor: '#FFF3E0',
    borderColor: Colors.maroon
  },
  categoryRadioText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary
  },
  categoryRadioTextActive: {
    color: Colors.maroon
  },
  optionSubBox: {
    backgroundColor: '#FFFDF6',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    borderRadius: 10,
    padding: 10,
    marginTop: 8
  },
  subLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 6
  },
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 6
  },
  dayChipActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon
  },
  dayChipText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary
  },
  dayChipTextActive: {
    color: '#FFD700'
  },
  tithiChip: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 6
  },
  tithiChipActive: {
    backgroundColor: '#FFF3E0',
    borderColor: Colors.maroon
  },
  tithiChipText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary
  },
  tithiChipTextActive: {
    color: Colors.maroon
  },
  saveBtn: {
    backgroundColor: Colors.maroon,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
    elevation: 2
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFD700'
  }
});
