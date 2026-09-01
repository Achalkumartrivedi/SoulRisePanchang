import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView
} from 'react-native';
import { Colors } from '../theme/colors';
import { isToday, isTimeInPastOnDate, getNextUpcomingTimeSlot } from '../engine/dateTimeValidator';

interface TimePickerModalProps {
  visible: boolean;
  initialTimeStr?: string; // e.g. "08:30 AM" or "18:30"
  targetDate?: Date;       // Date for past time checking
  onClose: () => void;
  onConfirm: (formattedTime: string) => void;
}

const VEDIC_QUICK_PRESETS = [
  { label: '🌅 06:00 AM', time: '06:00 AM' },
  { label: '☀️ 08:30 AM', time: '08:30 AM' },
  { label: '🕛 12:00 PM', time: '12:00 PM' },
  { label: '🌇 05:30 PM', time: '05:30 PM' },
  { label: '🌙 08:00 PM', time: '08:00 PM' },
  { label: '🌙 09:30 PM', time: '09:30 PM' }
];

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  initialTimeStr = '08:00 AM',
  targetDate = new Date(),
  onClose,
  onConfirm
}) => {
  const [selectedHour, setSelectedHour] = useState<number>(8);
  const [selectedMin, setSelectedMin] = useState<string>('00');
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    if (initialTimeStr) {
      parseAndSetInitialTime(initialTimeStr);
    }
  }, [initialTimeStr, visible]);

  const parseAndSetInitialTime = (timeStr: string) => {
    try {
      const clean = timeStr.trim().toUpperCase();
      const isPM = clean.includes('PM');
      const period: 'AM' | 'PM' = isPM ? 'PM' : 'AM';
      
      const numOnly = clean.replace(/(AM|PM)/g, '').trim();
      const parts = numOnly.split(':');
      let h = parseInt(parts[0] || '8', 10);
      const m = parseInt(parts[1] || '0', 10);

      if (h > 12) h = h - 12;
      if (h === 0) h = 12;

      setSelectedHour(h);
      setSelectedMin(m < 10 ? `0${m}` : `${Math.floor(m / 5) * 5}`.padStart(2, '0'));
      setSelectedPeriod(period);
    } catch (e) {
      setSelectedHour(8);
      setSelectedMin('00');
      setSelectedPeriod('AM');
    }
  };

  const getFormattedCurrentSelection = () => {
    const formattedHour = selectedHour < 10 ? `0${selectedHour}` : `${selectedHour}`;
    return `${formattedHour}:${selectedMin} ${selectedPeriod}`;
  };

  const currentSelectionTimeStr = getFormattedCurrentSelection();
  const isSelectionInPast = isToday(targetDate) && isTimeInPastOnDate(targetDate, currentSelectionTimeStr);

  const handleConfirm = () => {
    if (isSelectionInPast) {
      // Auto adjust to next upcoming slot if user taps confirm on a past time for today
      const upcoming = getNextUpcomingTimeSlot(targetDate);
      parseAndSetInitialTime(upcoming);
      onConfirm(upcoming);
    } else {
      onConfirm(currentSelectionTimeStr);
    }
    onClose();
  };

  const handleJumpNextUpcoming = () => {
    const upcoming = getNextUpcomingTimeSlot(targetDate);
    parseAndSetInitialTime(upcoming);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🕒 Select Time Slot (समय चुनें)</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Current Formatted Time Preview Banner */}
          <View style={[styles.previewBox, isSelectionInPast && styles.previewBoxPast]}>
            <Text style={styles.previewTimeText}>
              {selectedHour < 10 ? `0${selectedHour}` : selectedHour}:{selectedMin} {selectedPeriod}
            </Text>
            {isSelectionInPast && (
              <Text style={styles.pastWarningText}>
                ⚠️ Time has passed today! Tap "Next Upcoming Time"
              </Text>
            )}
          </View>

          {/* Next Upcoming Jump Button */}
          {isToday(targetDate) && (
            <TouchableOpacity
              style={styles.jumpUpcomingBtn}
              onPress={handleJumpNextUpcoming}
              activeOpacity={0.8}
            >
              <Text style={styles.jumpUpcomingText}>⚡ Next Upcoming Time: {getNextUpcomingTimeSlot(targetDate)}</Text>
            </TouchableOpacity>
          )}

          <ScrollView style={{ maxHeight: 340 }} nestedScrollEnabled>
            {/* Vedic Quick Presets */}
            <Text style={styles.sectionLabel}>⚡ Quick Time Presets:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {VEDIC_QUICK_PRESETS.map((p, idx) => {
                const isPresetPast = isToday(targetDate) && isTimeInPastOnDate(targetDate, p.time);
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.presetChip, isPresetPast && styles.presetChipPast]}
                    onPress={() => parseAndSetInitialTime(p.time)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.presetChipText, isPresetPast && styles.presetChipTextPast]}>
                      {p.label} {isPresetPast ? '(Passed)' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* AM / PM Toggle Pill */}
            <Text style={styles.sectionLabel}>1. Choose AM / PM:</Text>
            <View style={styles.periodRow}>
              <TouchableOpacity
                style={[styles.periodChip, selectedPeriod === 'AM' && styles.periodChipActive]}
                onPress={() => setSelectedPeriod('AM')}
              >
                <Text style={[styles.periodText, selectedPeriod === 'AM' && styles.periodTextActive]}>
                  🌅 AM (पूर्वाह्न)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.periodChip, selectedPeriod === 'PM' && styles.periodChipActive]}
                onPress={() => setSelectedPeriod('PM')}
              >
                <Text style={[styles.periodText, selectedPeriod === 'PM' && styles.periodTextActive]}>
                  🌇 PM (अपराह्न)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Hours Selector Grid (1..12) */}
            <Text style={styles.sectionLabel}>2. Select Hour (घंटा):</Text>
            <View style={styles.gridContainer}>
              {HOURS.map(h => (
                <TouchableOpacity
                  key={h}
                  style={[styles.gridCell, selectedHour === h && styles.gridCellActive]}
                  onPress={() => setSelectedHour(h)}
                >
                  <Text style={[styles.gridCellText, selectedHour === h && styles.gridCellTextActive]}>
                    {h < 10 ? `0${h}` : h}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Minutes Selector Grid (00..55) */}
            <Text style={styles.sectionLabel}>3. Select Minutes (मिनट):</Text>
            <View style={styles.gridContainer}>
              {MINUTES.map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.gridCell, selectedMin === m && styles.gridCellActive]}
                  onPress={() => setSelectedMin(m)}
                >
                  <Text style={[styles.gridCellText, selectedMin === m && styles.gridCellTextActive]}>
                    :{m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[styles.confirmBtn, isSelectionInPast && { backgroundColor: '#E65100' }]}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmBtnText}>
              {isSelectionInPast
                ? `⚡ Auto-Set Next Upcoming Time (${getNextUpcomingTimeSlot(targetDate)})`
                : `✓ Set Time Slot (${selectedHour}:${selectedMin} ${selectedPeriod})`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#E8D8C8',
    paddingBottom: 6
  },
  modalTitle: {
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
  previewBox: {
    backgroundColor: Colors.maroon,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 8
  },
  previewBoxPast: {
    backgroundColor: '#C62828'
  },
  previewTimeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 1
  },
  pastWarningText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2
  },
  jumpUpcomingBtn: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 8
  },
  jumpUpcomingText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32'
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginTop: 6,
    marginBottom: 4
  },
  presetChip: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    marginRight: 6
  },
  presetChipPast: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0'
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  presetChipTextPast: {
    color: '#9E9E9E'
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6
  },
  periodChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#E8D8C8',
    alignItems: 'center'
  },
  periodChipActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon
  },
  periodText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textSecondary
  },
  periodTextActive: {
    color: '#FFD700'
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8
  },
  gridCell: {
    width: '23%',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#E8D8C8',
    alignItems: 'center'
  },
  gridCellActive: {
    backgroundColor: '#FFF3E0',
    borderColor: Colors.maroon
  },
  gridCellText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textSecondary
  },
  gridCellTextActive: {
    color: Colors.maroon
  },
  confirmBtn: {
    backgroundColor: Colors.maroon,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2
  },
  confirmBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700'
  }
});
