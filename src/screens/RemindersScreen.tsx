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
import { ReminderItem, ReminderCategory, UpcomingTithiDateInfo } from '../types/reminder';
import { FESTIVALS } from '../engine/festivalRepository';
import { findUpcoming5DatesForTithi } from '../engine/tithiDateFinder';
import { TimePickerModal } from '../components/TimePickerModal';
import {
  getStoredReminders,
  saveReminder,
  toggleReminderState,
  deleteReminder,
  markLalKitabDayDone
} from '../engine/reminderStorage';

const DAY_NAMES = ['Sunday (रविवार)', 'Monday (सोमवार)', 'Tuesday (मंगलवार)', 'Wednesday (बुधवार)', 'Thursday (गुरुवार)', 'Friday (शुक्रवार)', 'Saturday (शनिवार)'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ALL_15_TITHIS = [
  'Purnima / Poonam (पूर्णिमा / पूनम - Full Moon)',
  'Amavasya (अमावस्या - New Moon)',
  'Ekadashi (एकादशी - Fasting Tithi)',
  'Pradosh / Trayodashi (त्रयोदशी - Shiva Tithi)',
  'Chaturthi (चतुर्थी - Ganesh Tithi)',
  'Ashtami (अष्टमी - Durga Tithi)',
  'Navami (नवमी - Ram Navami Tithi)',
  'Pratipada (प्रतिपदा - 1st Tithi)',
  'Dwitiya (द्वितीया - 2nd Tithi)',
  'Tritiya (तृतीया - 3rd Tithi)',
  'Panchami (पंचमी - 5th Tithi)',
  'Shasthi (षष्ठी - 6th Tithi)',
  'Saptami (सप्तमी - 7th Tithi)',
  'Dashami (दशमी - 10th Tithi)',
  'Dwadashi (द्वादशी - 12th Tithi)',
  'Chaturdashi (चतुर्दशी - Shivratri Tithi)'
];

const DHARMA_OPTIONS = [
  { id: 'HINDU', label: '🕉️ Hindu Festivals' },
  { id: 'JAIN', label: '🪔 Jain Festivals' },
  { id: 'SIKH', label: '☬ Sikh Gurpurabs' },
  { id: 'BUDDHIST', label: '☸️ Buddhist Days' },
  { id: 'CHRISTIAN', label: '✝️ Christian Feasts' },
  { id: 'PARSI', label: '🔥 Parsi Navroz' },
  { id: 'WORLD', label: '🌐 World Festivals' }
];

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
  
  // Weekly Day Options
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(6); // Saturday default
  const [maxOccurrences, setMaxOccurrences] = useState<string>('5'); // e.g. 5 Thursdays

  // Tithi & Festival Sub-Type State
  const [tithiFestSubType, setTithiFestSubType] = useState<'TITHI' | 'FESTIVAL'>('TITHI');
  const [selectedTithiName, setSelectedTithiName] = useState<string>(ALL_15_TITHIS[0]);
  const [upcomingTithiDates, setUpcomingTithiDates] = useState<UpcomingTithiDateInfo[]>([]);
  const [selectedUpcomingDateIso, setSelectedUpcomingDateIso] = useState<string>('');

  const [selectedDharma, setSelectedDharma] = useState<string>('HINDU');
  const [selectedFestivalName, setSelectedFestivalName] = useState<string>('');
  const [selectedFestivalDateIso, setSelectedFestivalDateIso] = useState<string>('');

  // Lal Kitab Days & Editable Label State
  const [targetDays, setTargetDays] = useState<string>('43');
  const [counterLabel, setCounterLabel] = useState<string>('Lal Kitab Remedy Progress Counter');

  // Daily Chant Multiple Slots State
  const [timeSlots, setTimeSlots] = useState<string[]>(['06:00 AM']);

  // Custom Delete Confirmation Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState<ReminderItem | null>(null);

  // Time Picker Modal State
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [targetSlotIndex, setTargetSlotIndex] = useState<number | null>(null); // null = main timeStr, number = timeSlots[idx]
  const [activeTimeForPicker, setActiveTimeForPicker] = useState<string>('08:00 AM');

  useEffect(() => {
    loadReminders();
  }, []);

  // Recalculate upcoming 5 Tithi dates whenever selectedTithiName changes
  useEffect(() => {
    if (category === 'TITHI_FESTIVAL' && tithiFestSubType === 'TITHI') {
      const dates = findUpcoming5DatesForTithi(selectedTithiName, new Date());
      setUpcomingTithiDates(dates);
      if (dates[0]) {
        setSelectedUpcomingDateIso(dates[0].dateIso);
      }
    }
  }, [selectedTithiName, category, tithiFestSubType]);

  const loadReminders = async () => {
    const list = await getStoredReminders();
    setReminders(list);
  };

  /**
   * Filters festivals to ONLY UPCOMING festivals (dateIso >= todayIso)
   */
  const getFilteredUpcomingFestivalsByDharma = (dharma: string) => {
    const todayIso = new Date().toISOString().split('T')[0];
    let rawList = FESTIVALS;

    if (dharma === 'JAIN') rawList = FESTIVALS.filter(f => f.category === 'JAIN_FESTIVAL');
    else if (dharma === 'SIKH') rawList = FESTIVALS.filter(f => f.category === 'SIKH_FESTIVAL');
    else if (dharma === 'BUDDHIST') rawList = FESTIVALS.filter(f => f.category === 'BUDDHIST_FESTIVAL');
    else if (dharma === 'CHRISTIAN') rawList = FESTIVALS.filter(f => f.category === 'CHRISTIAN_FESTIVAL');
    else if (dharma === 'PARSI') rawList = FESTIVALS.filter(f => f.category === 'PARSI_FESTIVAL');
    else if (dharma === 'WORLD') rawList = FESTIVALS.filter(f => f.category === 'WORLD_FESTIVAL');
    else rawList = FESTIVALS.filter(f => f.category === 'MAJOR_FESTIVAL' || f.category === 'VRAT' || f.category === 'JAYANTI');

    // ONLY UPCOMING FESTIVALS
    return rawList
      .filter(f => f.dateIso >= todayIso)
      .sort((a, b) => a.dateIso.localeCompare(b.dateIso));
  };

  const handleOpenCreateModal = () => {
    setEditingReminder(null);
    setTitle('');
    setCategory('WEEKLY_DAY');
    setTimeStr('08:00 AM');
    setTimeSlots(['06:00 AM']);
    setNotes('');
    setSelectedDayIdx(6);
    setMaxOccurrences('5');
    setTithiFestSubType('TITHI');
    setSelectedTithiName(ALL_15_TITHIS[0]);
    setSelectedDharma('HINDU');
    
    const hinduFests = getFilteredUpcomingFestivalsByDharma('HINDU');
    if (hinduFests[0]) {
      setSelectedFestivalName(hinduFests[0].name);
      setSelectedFestivalDateIso(hinduFests[0].dateIso);
    }
    setTargetDays('43');
    setCounterLabel('Lal Kitab Remedy Progress Counter');
    setModalVisible(true);
  };

  const handleOpenEditModal = (item: ReminderItem) => {
    setEditingReminder(item);
    setTitle(item.title);
    setCategory(item.category);
    setTimeStr(item.timeStr);
    setTimeSlots(item.timeSlots || [item.timeStr]);
    setNotes(item.notes || '');

    if (item.recurrence?.weeklyDayIndex !== undefined) {
      setSelectedDayIdx(item.recurrence.weeklyDayIndex);
    }
    if (item.recurrence?.maxOccurrences) {
      setMaxOccurrences(String(item.recurrence.maxOccurrences));
    }
    if (item.recurrence?.subType) {
      setTithiFestSubType(item.recurrence.subType);
    }
    if (item.recurrence?.tithiName) {
      setSelectedTithiName(item.recurrence.tithiName);
    }
    if (item.recurrence?.selectedUpcomingDateIso) {
      setSelectedUpcomingDateIso(item.recurrence.selectedUpcomingDateIso);
    }
    if (item.recurrence?.festivalName) {
      setSelectedFestivalName(item.recurrence.festivalName);
    }
    if (item.recurrence?.festivalDharma) {
      setSelectedDharma(item.recurrence.festivalDharma);
    }
    if (item.lalKitabData) {
      setTargetDays(String(item.lalKitabData.targetDays));
      setCounterLabel(item.lalKitabData.counterLabel || 'Lal Kitab Remedy Progress Counter');
    }

    setModalVisible(true);
  };

  const handleSave = async () => {
    let finalTitle = title.trim();
    if (!finalTitle) {
      if (category === 'WEEKLY_DAY') finalTitle = `${DAY_SHORT[selectedDayIdx]} Vrat Reminder`;
      else if (category === 'TITHI_FESTIVAL') {
        finalTitle = tithiFestSubType === 'TITHI' ? selectedTithiName.split(' ')[0] : selectedFestivalName;
      } else if (category === 'LAL_KITAB_REMEDY') finalTitle = counterLabel.trim() || `Lal Kitab ${targetDays}-Day Remedy`;
      else if (category === 'DAILY_CHANT') finalTitle = `Daily Mantra Chant`;
      else finalTitle = 'Smart Reminder';
    }

    const newItem: ReminderItem = {
      id: editingReminder ? editingReminder.id : `rem-${Date.now()}`,
      title: finalTitle,
      category,
      timeStr: timeSlots[0] || timeStr,
      timeSlots: category === 'DAILY_CHANT' ? timeSlots : undefined,
      dateIso: category === 'TITHI_FESTIVAL' ? (tithiFestSubType === 'TITHI' ? selectedUpcomingDateIso : selectedFestivalDateIso) : undefined,
      enabled: editingReminder ? editingReminder.enabled : true,
      notes: notes.trim(),
      createdAtIso: editingReminder ? editingReminder.createdAtIso : new Date().toISOString()
    };

    if (category === 'WEEKLY_DAY') {
      newItem.recurrence = {
        weeklyDayIndex: selectedDayIdx,
        maxOccurrences: parseInt(maxOccurrences, 10) || undefined
      };
    } else if (category === 'TITHI_FESTIVAL') {
      newItem.recurrence = {
        subType: tithiFestSubType,
        tithiName: tithiFestSubType === 'TITHI' ? selectedTithiName : undefined,
        festivalName: tithiFestSubType === 'FESTIVAL' ? selectedFestivalName : undefined,
        festivalDharma: tithiFestSubType === 'FESTIVAL' ? selectedDharma : undefined,
        selectedUpcomingDateIso: tithiFestSubType === 'TITHI' ? selectedUpcomingDateIso : selectedFestivalDateIso,
        upcomingDatesList: upcomingTithiDates
      };
    } else if (category === 'LAL_KITAB_REMEDY') {
      const tDays = parseInt(targetDays, 10) || 43;
      newItem.lalKitabData = editingReminder?.lalKitabData ? {
        ...editingReminder.lalKitabData,
        targetDays: tDays,
        counterLabel: counterLabel.trim() || 'Lal Kitab Remedy Progress Counter'
      } : {
        targetDays: tDays,
        completedDays: 0,
        startDateIso: new Date().toISOString().split('T')[0],
        counterLabel: counterLabel.trim() || 'Lal Kitab Remedy Progress Counter',
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

  const handleOpenDeleteModal = (item: ReminderItem) => {
    setReminderToDelete(item);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!reminderToDelete) return;
    const updated = await deleteReminder(reminderToDelete.id);
    setReminders(updated);
    setDeleteModalVisible(false);
    setReminderToDelete(null);
  };

  const handleMarkLalKitabDone = async (id: string) => {
    const updated = await markLalKitabDayDone(id);
    setReminders(updated);
  };

  const handleOpenTimePicker = (currentVal: string, slotIdx: number | null = null) => {
    setActiveTimeForPicker(currentVal || '08:00 AM');
    setTargetSlotIndex(slotIdx);
    setTimePickerVisible(true);
  };

  const handleConfirmTimePicker = (newTime: string) => {
    if (targetSlotIndex === null) {
      // Main single time string
      setTimeStr(newTime);
    } else {
      // Multi-slot index check for duplicate conflicts
      const isDuplicate = timeSlots.some((ts, idx) => idx !== targetSlotIndex && ts.toUpperCase().trim() === newTime.toUpperCase().trim());
      if (isDuplicate) {
        Alert.alert(
          '⚠️ Duplicate Time Slot',
          `Time slot "${newTime}" is already added. Please select a different time slot.`
        );
        return;
      }
      const updated = [...timeSlots];
      updated[targetSlotIndex] = newTime;
      setTimeSlots(updated);
    }
  };

  const handleAddChantSlot = () => {
    const candidates = ['07:00 PM', '08:00 PM', '06:00 AM', '12:00 PM', '05:30 PM'];
    let nextAvailable = candidates.find(t => !timeSlots.includes(t)) || `${timeSlots.length + 6}:00 PM`;
    if (timeSlots.includes(nextAvailable)) {
      nextAvailable = '09:00 PM';
    }
    setTimeSlots([...timeSlots, nextAvailable]);
  };

  const handleRemoveChantSlot = (index: number) => {
    if (timeSlots.length <= 1) return;
    const updated = [...timeSlots];
    updated.splice(index, 1);
    setTimeSlots(updated);
  };

  const filteredReminders = reminders.filter(r => {
    if (selectedTab === 'ALL') return true;
    return r.category === selectedTab;
  });

  const activeUpcomingDharmaFestivals = getFilteredUpcomingFestivalsByDharma(selectedDharma);

  return (
    <View style={styles.container}>
      {/* Screen Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>⏰ Universal Smart Reminders</Text>
          <Text style={styles.headerSub}>Custom Vrats, Tithi/Festivals, Lal Kitab remedies & Chants</Text>
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
            { id: 'WEEKLY_DAY', label: '🗓️ Weekly Vrat' },
            { id: 'TITHI_FESTIVAL', label: '🚩 Tithi & Festival' },
            { id: 'LAL_KITAB_REMEDY', label: '🔢 Daily Counter' },
            { id: 'DAILY_CHANT', label: '🔔 Daily Reminder' },
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
            <Text style={styles.emptySub}>Tap "+ Create" to set your first Vrat, Tithi, Festival, or Daily Counter reminder.</Text>
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
                            ? `🗓️ Every ${DAY_SHORT[item.recurrence?.weeklyDayIndex ?? 6]}`
                            : item.category === 'TITHI_FESTIVAL'
                            ? item.recurrence?.subType === 'FESTIVAL'
                              ? `🚩 ${item.recurrence?.festivalName || 'Festival'} (${item.dateIso || ''})`
                              : `🌙 ${item.recurrence?.tithiName || 'Tithi'} (${item.dateIso || ''})`
                            : item.category === 'LAL_KITAB_REMEDY'
                            ? `🔢 Counter (${item.lalKitabData?.targetDays || 5} Days)`
                            : item.category === 'DAILY_CHANT'
                            ? `🔔 Daily Reminder (${item.timeSlots?.length || 1} Slots)`
                            : `📅 ${item.dateIso || 'Specific Date'}`}
                        </Text>
                      </View>

                      {/* Display Time Slots */}
                      {item.timeSlots && item.timeSlots.length > 0 ? (
                        item.timeSlots.map((ts, idx) => (
                          <View key={idx} style={styles.timeTag}>
                            <Text style={styles.timeTagText}>🕒 {ts}</Text>
                          </View>
                        ))
                      ) : (
                        <View style={styles.timeTag}>
                          <Text style={styles.timeTagText}>🕒 {item.timeStr}</Text>
                        </View>
                      )}
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

                {/* Progress Counter Section */}
                {isLalKitab && item.lalKitabData ? (
                  <View style={styles.lalKitabBox}>
                    <View style={styles.lalKitabHeaderRow}>
                      <Text style={styles.lalKitabTitle}>
                        🔢 {item.lalKitabData.counterLabel || 'Daily Progress Counter'}:
                      </Text>
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
                          ? `🎉 ${item.lalKitabData.targetDays}-Day Count Successfully Completed!`
                          : isDoneToday
                          ? '✅ Today\'s Count Marked Done!'
                          : '👉 Complete today\'s count and tap here:'}
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

                  <TouchableOpacity style={styles.actionBtnDelete} onPress={() => handleOpenDeleteModal(item)}>
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
                placeholder="e.g. Saturday Fast, Gayatri Mantra, 43-Day Remedy"
                value={title}
                onChangeText={setTitle}
              />

              {/* Category Selector */}
              <Text style={styles.label}>Reminder Category:</Text>
              <View style={styles.categoryRadioGrid}>
                {[
                  { id: 'WEEKLY_DAY', title: '🗓️ Weekly Day (Saturday, Thursday, etc)' },
                  { id: 'TITHI_FESTIVAL', title: '🚩 Tithi & Calendar Festival' },
                  { id: 'LAL_KITAB_REMEDY', title: '🔢 Daily Progress Counter (N-Days)' },
                  { id: 'DAILY_CHANT', title: '🔔 Daily Reminder (Chant / Prayer)' }
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

              {/* Category 1: WEEKLY DAY OPTIONS */}
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

              {/* Category 2: TITHI & FESTIVAL OPTIONS */}
              {category === 'TITHI_FESTIVAL' && (
                <View style={styles.optionSubBox}>
                  <Text style={styles.subLabel}>Select Reminder Sub-Type:</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                    <TouchableOpacity
                      style={[styles.subTypeTab, tithiFestSubType === 'TITHI' && styles.subTypeTabActive]}
                      onPress={() => setTithiFestSubType('TITHI')}
                    >
                      <Text style={[styles.subTypeTabText, tithiFestSubType === 'TITHI' && styles.subTypeTabTextActive]}>
                        🌙 Tithi (तिथि)
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.subTypeTab, tithiFestSubType === 'FESTIVAL' && styles.subTypeTabActive]}
                      onPress={() => setTithiFestSubType('FESTIVAL')}
                    >
                      <Text style={[styles.subTypeTabText, tithiFestSubType === 'FESTIVAL' && styles.subTypeTabTextActive]}>
                        🚩 Festival (त्यौहार)
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Sub-Type 1: TITHI PICKER & UPCOMING 5 DATES SCANNER */}
                  {tithiFestSubType === 'TITHI' ? (
                    <View>
                      <Text style={styles.subLabel}>1. Choose Sacred Tithi:</Text>
                      <ScrollView style={{ maxHeight: 110 }} nestedScrollEnabled>
                        {ALL_15_TITHIS.map((tName, idx) => (
                          <TouchableOpacity
                            key={idx}
                            style={[styles.tithiChip, selectedTithiName === tName && styles.tithiChipActive]}
                            onPress={() => setSelectedTithiName(tName)}
                          >
                            <Text style={[styles.tithiChipText, selectedTithiName === tName && styles.tithiChipTextActive]}>
                              {tName}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>

                      {/* UPCOMING 5 DATES PREVIEW & SELECTOR */}
                      <Text style={[styles.subLabel, { marginTop: 10, color: '#E65100' }]}>
                        📅 Next 5 Upcoming Dates for {selectedTithiName.split(' ')[0]}:
                      </Text>

                      {upcomingTithiDates.length === 0 ? (
                        <Text style={{ fontSize: 11, color: Colors.textMuted, fontStyle: 'italic' }}>
                          Calculating upcoming dates...
                        </Text>
                      ) : (
                        <ScrollView style={{ maxHeight: 140 }} nestedScrollEnabled>
                          {upcomingTithiDates.map((uDate, idx) => (
                            <TouchableOpacity
                              key={uDate.dateIso}
                              style={[
                                styles.upcomingDateCard,
                                selectedUpcomingDateIso === uDate.dateIso && styles.upcomingDateCardActive
                              ]}
                              onPress={() => setSelectedUpcomingDateIso(uDate.dateIso)}
                            >
                              <View style={{ flex: 1 }}>
                                <Text style={[
                                  styles.upcomingDateTitle,
                                  selectedUpcomingDateIso === uDate.dateIso && { color: Colors.maroon }
                                ]}>
                                  📅 {uDate.dateDisplay} ({uDate.dayOfWeekName})
                                </Text>
                                <Text style={styles.upcomingDateSub}>
                                  🌙 {uDate.tithiFullText}
                                </Text>
                              </View>
                              {selectedUpcomingDateIso === uDate.dateIso && (
                                <Text style={styles.upcomingDateCheck}>✓ Selected</Text>
                              )}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  ) : (
                    /* Sub-Type 2: UPCOMING FESTIVAL & DHARMA PICKER WITH DATE/DAY/TITHI DETAILS */
                    <View>
                      <Text style={styles.subLabel}>1. Filter Festivals by Dharma / Religion:</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                        {DHARMA_OPTIONS.map(dh => (
                          <TouchableOpacity
                            key={dh.id}
                            style={[styles.dayChip, selectedDharma === dh.id && styles.dayChipActive]}
                            onPress={() => {
                              setSelectedDharma(dh.id);
                              const fList = getFilteredUpcomingFestivalsByDharma(dh.id);
                              if (fList[0]) {
                                setSelectedFestivalName(fList[0].name);
                                setSelectedFestivalDateIso(fList[0].dateIso);
                              }
                            }}
                          >
                            <Text style={[styles.dayChipText, selectedDharma === dh.id && styles.dayChipTextActive]}>
                              {dh.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>

                      <Text style={styles.subLabel}>2. Select Upcoming Festival (Showing Future Dates Only):</Text>
                      {activeUpcomingDharmaFestivals.length === 0 ? (
                        <Text style={{ fontSize: 11, color: Colors.textMuted, fontStyle: 'italic', paddingVertical: 10 }}>
                          No upcoming festivals found for this category in the remainder of the year.
                        </Text>
                      ) : (
                        <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                          {activeUpcomingDharmaFestivals.map(fest => {
                            const fDateObj = new Date(fest.dateIso);
                            const dayName = DAY_NAMES[fDateObj.getDay()] || '';
                            const isSelected = selectedFestivalName === fest.name;

                            return (
                              <TouchableOpacity
                                key={fest.id}
                                style={[styles.tithiChip, isSelected && styles.tithiChipActive, { paddingVertical: 10 }]}
                                onPress={() => {
                                  setSelectedFestivalName(fest.name);
                                  setSelectedFestivalDateIso(fest.dateIso);
                                }}
                              >
                                <Text style={[styles.tithiChipText, isSelected && styles.tithiChipTextActive, { fontSize: 12, fontWeight: 'bold' }]}>
                                  🚩 {fest.name} ({fest.hindiName})
                                </Text>
                                <Text style={{ fontSize: 11, color: isSelected ? Colors.maroon : Colors.textPrimary, marginTop: 3 }}>
                                  📅 Date & Day: <Text style={{ fontWeight: 'bold' }}>{fest.dateIso} • {dayName}</Text>
                                </Text>
                                {fest.tithiDescription ? (
                                  <Text style={{ fontSize: 10, color: isSelected ? Colors.maroon : Colors.textMuted, marginTop: 2, fontStyle: 'italic' }}>
                                    🌙 Tithi: {fest.tithiDescription}
                                  </Text>
                                ) : null}
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      )}
                    </View>
                  )}
                </View>
              )}

              {/* Category 3: LAL KITAB REMEDY OPTIONS WITH EDITABLE COUNTER LABEL */}
              {category === 'LAL_KITAB_REMEDY' && (
                <View style={styles.optionSubBox}>
                  <Text style={styles.subLabel}>Counter Title / Label (Editable):</Text>
                  <TextInput
                    style={[styles.input, { marginBottom: 8 }]}
                    placeholder="e.g. Surya Arghya Counter, Shani Daan Days"
                    value={counterLabel}
                    onChangeText={setCounterLabel}
                  />

                  <Text style={styles.subLabel}>Target Remedy Days (Editable - e.g. 43, 21, 11, 108 days):</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 43"
                    keyboardType="number-pad"
                    value={targetDays}
                    onChangeText={setTargetDays}
                  />
                  <Text style={{ fontSize: 11, color: Colors.textMuted, marginTop: 4 }}>
                    🔮 Lal Kitab remedies are traditionally observed continuously for 43 consecutive days (or custom target days).
                  </Text>
                </View>
              )}

              {/* Category 4: DAILY CHANT MULTI-SLOT OPTIONS */}
              {category === 'DAILY_CHANT' && (
                <View style={styles.optionSubBox}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={styles.subLabel}>Chant Notification Time Slots:</Text>
                    <TouchableOpacity style={styles.addSlotBtn} onPress={handleAddChantSlot}>
                      <Text style={styles.addSlotBtnText}>+ Add Time Slot</Text>
                    </TouchableOpacity>
                  </View>

                  {timeSlots.map((ts, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 }}>
                      <Text style={{ fontSize: 11, fontWeight: 'bold', color: Colors.textSecondary }}>
                        Slot {idx + 1}:
                      </Text>
                      <TouchableOpacity
                        style={[styles.input, { flex: 1, justifyContent: 'center' }]}
                        onPress={() => handleOpenTimePicker(ts, idx)}
                        activeOpacity={0.8}
                      >
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: Colors.maroon }}>
                          🕒 {ts} (Tap to change)
                        </Text>
                      </TouchableOpacity>
                      {timeSlots.length > 1 && (
                        <TouchableOpacity onPress={() => handleRemoveChantSlot(idx)}>
                          <Text style={{ fontSize: 14, color: '#C62828' }}>✖</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Single Time Picker Selector for Non-Chant Categories */}
              {category !== 'DAILY_CHANT' && (
                <>
                  <Text style={styles.label}>Notification Time (Tap to Select):</Text>
                  <TouchableOpacity
                    style={[styles.input, { justifyContent: 'center', height: 42 }]}
                    onPress={() => handleOpenTimePicker(timeStr, null)}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: Colors.maroon }}>
                      🕒 {timeStr} (Tap to Select Time)
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Notes Input */}
              <Text style={styles.label}>Notes & Fasting Rules:</Text>
              <TextInput
                style={[styles.input, { height: 50 }]}
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

      {/* Custom In-App Themed Delete Confirmation Modal */}
      {deleteModalVisible && reminderToDelete && (
        <Modal visible={deleteModalVisible} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { borderTopWidth: 4, borderTopColor: '#C62828' }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalHeaderTitle, { color: '#C62828' }]}>
                  🗑️ Delete Reminder (स्मरण हटाएं)
                </Text>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setDeleteModalVisible(false)}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={{ paddingVertical: 10 }}>
                <Text style={{ fontSize: 13, color: Colors.textPrimary, marginBottom: 10, lineHeight: 18 }}>
                  Are you sure you want to delete this reminder from your app?
                </Text>

                <View style={{ backgroundColor: '#FFEBEE', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#EF9A9A' }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#C62828' }}>
                    "{reminderToDelete.title}"
                  </Text>
                  <Text style={{ fontSize: 11, color: Colors.textSecondary, marginTop: 4 }}>
                    🕒 Notification Time: {reminderToDelete.timeStr}
                  </Text>
                  {reminderToDelete.notes ? (
                    <Text style={{ fontSize: 10, color: Colors.textMuted, marginTop: 2, fontStyle: 'italic' }}>
                      📝 {reminderToDelete.notes}
                    </Text>
                  ) : null}
                </View>

                <Text style={{ fontSize: 11, color: Colors.textMuted, marginTop: 10, fontStyle: 'italic' }}>
                  ⚠️ This action is permanent and cannot be undone.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FAF5EE',
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#E8D8C8'
                  }}
                  onPress={() => setDeleteModalVisible(false)}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: Colors.textSecondary }}>
                    Cancel (रद्द करें)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: '#C62828',
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 8,
                    elevation: 2
                  }}
                  onPress={handleConfirmDelete}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#FFFFFF' }}>
                    🗑️ Yes, Delete (हां, हटाएं)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Interactive Time Picker Modal Component */}
      <TimePickerModal
        visible={timePickerVisible}
        initialTimeStr={activeTimeForPicker}
        targetDate={new Date()}
        onClose={() => setTimePickerVisible(false)}
        onConfirm={handleConfirmTimePicker}
      />
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
    color: '#F57F17',
    flex: 1,
    marginRight: 6
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
  subTypeTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#E8D8C8',
    alignItems: 'center'
  },
  subTypeTabActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon
  },
  subTypeTabText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary
  },
  subTypeTabTextActive: {
    color: '#FFD700'
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
  upcomingDateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#E8D8C8',
    marginBottom: 6
  },
  upcomingDateCardActive: {
    backgroundColor: '#FFF3E0',
    borderColor: Colors.maroon
  },
  upcomingDateTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary
  },
  upcomingDateSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2
  },
  upcomingDateCheck: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginLeft: 6
  },
  addSlotBtn: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  addSlotBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFD700'
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
