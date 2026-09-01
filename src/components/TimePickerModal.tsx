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

interface TimePickerModalProps {
  visible: boolean;
  initialTimeStr?: string; // e.g. "08:30 AM" or "18:30"
  onClose: () => void;
  onConfirm: (formattedTime: string) => void;
}

const VEDIC_QUICK_PRESETS = [
  { label: '🌅 06:00 AM', time: '06:00 AM', desc: 'Brahma Muhurat & Morning Chant' },
  { label: '☀️ 08:30 AM', time: '08:30 AM', desc: 'Morning Puja & Arghya' },
  { label: '🕛 12:00 PM', time: '12:00 PM', desc: 'Madhyahna / Abhijit Muhurat' },
  { label: '🌇 05:30 PM', time: '05:30 PM', desc: 'Sandhya Aarti & Diya' },
  { label: '🌙 08:00 PM', time: '08:00 PM', desc: 'Ratri Mantra & Jaap' }
];

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  initialTimeStr = '08:00 AM',
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
      const isAM = clean.includes('AM');
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

  const handleConfirm = () => {
    const formattedHour = selectedHour < 10 ? `0${selectedHour}` : `${selectedHour}`;
    const formatted = `${formattedHour}:${selectedMin} ${selectedPeriod}`;
    onConfirm(formatted);
    onClose();
  };

  const handleApplyPreset = (presetTime: string) => {
    parseAndSetInitialTime(presetTime);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🕒 Select Time (समय चुनें)</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Current Formatted Time Preview */}
          <View style={styles.previewBox}>
            <Text style={styles.previewTimeText}>
              {selectedHour < 10 ? `0${selectedHour}` : selectedHour}:{selectedMin} {selectedPeriod}
            </Text>
          </View>

          <ScrollView style={{ maxHeight: 380 }} nestedScrollEnabled>
            {/* Vedic Quick Presets */}
            <Text style={styles.sectionLabel}>⚡ Quick Vedic Time Presets:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              {VEDIC_QUICK_PRESETS.map((p, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.presetChip}
                  onPress={() => handleApplyPreset(p.time)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.presetChipText}>{p.label}</Text>
                </TouchableOpacity>
              ))}
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
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.8}>
            <Text style={styles.confirmBtnText}>✓ Set Time Slot ({selectedHour}:{selectedMin} {selectedPeriod})</Text>
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
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#E8D8C8',
    paddingBottom: 8
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
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12
  },
  previewTimeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 1
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginTop: 8,
    marginBottom: 6
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
  presetChipText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon
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
    marginTop: 12,
    elevation: 2
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFD700'
  }
});
