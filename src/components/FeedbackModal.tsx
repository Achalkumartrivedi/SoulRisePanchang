import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Colors } from '../theme/colors';
import {
  getFeedbackCooldownStatus,
  saveFeedbackItem,
  CooldownStatus,
  FeedbackItem
} from '../engine/feedbackStorage';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  userEmail?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  onClose,
  userEmail
}) => {
  const [category, setCategory] = useState<'BUG_REPORT' | 'FEATURE_REQUEST' | 'PANCHANG_QUERY' | 'GENERAL'>('GENERAL');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Attachment State (< 2MB validation)
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [attachmentSizeMb, setAttachmentSizeMb] = useState<number | null>(null);

  // Cooldown State
  const [cooldown, setCooldown] = useState<CooldownStatus>({
    isLocked: false,
    remainingHours: 0,
    remainingDays: 0,
    unlockDateIso: null
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      checkCooldown();
    }
  }, [visible]);

  const checkCooldown = async () => {
    const status = await getFeedbackCooldownStatus();
    setCooldown(status);
  };

  // Simulated File Attachment Picker with strict 2MB validation
  const handleSelectAttachment = () => {
    Alert.alert(
      '📎 Attach File / Screenshot',
      'Select a sample screenshot or log file to attach (Max Limit: 2.0 MB):',
      [
        {
          text: '📄 Attach App Log (0.4 MB - Valid)',
          onPress: () => {
            setAttachmentName('panchang_app_log.txt');
            setAttachmentSizeMb(0.4);
          }
        },
        {
          text: '🖼️ Attach Screenshot (1.2 MB - Valid)',
          onPress: () => {
            setAttachmentName('screenshot_bug.png');
            setAttachmentSizeMb(1.2);
          }
        },
        {
          text: '⚠️ Attach Large Screen Rec (3.5 MB - Rejected)',
          onPress: () => {
            // Strict 2MB File Validation Alert
            Alert.alert(
              '⚠️ File Size Exceeded',
              'The selected file size is 3.5 MB. Maximum allowed attachment size is 2.0 MB. Please choose a smaller file.'
            );
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSubmit = async () => {
    if (cooldown.isLocked) {
      Alert.alert(
        '⏳ Submission Blocked',
        `You have recently submitted feedback. You can submit your next feedback in ${cooldown.remainingDays} days.`
      );
      return;
    }

    const trimmedSubj = subject.trim();
    const trimmedMsg = message.trim();

    if (!trimmedSubj || !trimmedMsg) {
      Alert.alert('⚠️ Required Fields Missing', 'Please provide a Subject and Detailed Message for your feedback.');
      return;
    }

    if (attachmentSizeMb && attachmentSizeMb > 2.0) {
      Alert.alert(
        '⚠️ File Too Large',
        `Attached file size (${attachmentSizeMb.toFixed(1)} MB) exceeds the 2.0 MB limit.`
      );
      return;
    }

    setIsLoading(true);

    const feedbackItem: FeedbackItem = {
      id: `fb_${Date.now()}`,
      category,
      subject: trimmedSubj,
      message: trimmedMsg,
      attachmentName: attachmentName || undefined,
      attachmentSizeMb: attachmentSizeMb || undefined,
      submittedAtIso: new Date().toISOString()
    };

    await saveFeedbackItem(feedbackItem);
    await checkCooldown();
    setIsLoading(false);

    Alert.alert(
      '🎉 Feedback Received!',
      'Thank you for your valuable feedback! Our engineering team will review it. Note: The feedback form is now locked for 3 days to prevent duplicate submissions.',
      [{ text: 'OK', onPress: onClose }]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>💬 Customer Feedback & Support</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {/* 3-Day Cooldown Banner */}
            {cooldown.isLocked ? (
              <View style={styles.cooldownBox}>
                <Text style={styles.cooldownTitle}>⏳ Feedback Locked (3-Day Cooldown Active)</Text>
                <Text style={styles.cooldownDesc}>
                  You have already submitted feedback recently. To prevent duplicates, feedback submission is paused for 3 days.
                </Text>
                <Text style={styles.cooldownUnlock}>
                  🔓 Next Submission Unlocks in: {cooldown.remainingDays} Days ({cooldown.remainingHours} Hours)
                </Text>
                {cooldown.unlockDateIso && (
                  <Text style={styles.cooldownDate}>
                    Unlock Date: {new Date(cooldown.unlockDateIso).toLocaleString()}
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.infoBanner}>
                <Text style={styles.infoBannerText}>
                  💡 We appreciate your suggestions! Attach screenshots/files up to 2MB.
                </Text>
              </View>
            )}

            {/* Category Selector */}
            <Text style={styles.label}>Select Category:</Text>
            <View style={styles.categoryRow}>
              {[
                { id: 'GENERAL', label: '💬 General' },
                { id: 'BUG_REPORT', label: '🐛 Bug' },
                { id: 'FEATURE_REQUEST', label: '✨ Feature' },
                { id: 'PANCHANG_QUERY', label: '🕉️ Panchang' }
              ].map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.catChip,
                    category === item.id && styles.catChipActive,
                    cooldown.isLocked && styles.disabledInput
                  ]}
                  disabled={cooldown.isLocked}
                  onPress={() => setCategory(item.id as any)}
                >
                  <Text style={[styles.catChipText, category === item.id && styles.catChipTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Subject Input */}
            <Text style={styles.label}>Subject:</Text>
            <TextInput
              style={[styles.input, cooldown.isLocked && styles.disabledInput]}
              placeholder="e.g. Discrepancy in Tithi end timing"
              value={subject}
              onChangeText={setSubject}
              editable={!cooldown.isLocked}
            />

            {/* Message Details Input */}
            <Text style={styles.label}>Detailed Description:</Text>
            <TextInput
              style={[styles.input, styles.textArea, cooldown.isLocked && styles.disabledInput]}
              placeholder="Describe your issue or suggestion in detail..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              editable={!cooldown.isLocked}
            />

            {/* File Attachment (< 2MB) Button */}
            <Text style={styles.label}>File Attachment (Max 2.0 MB):</Text>
            <TouchableOpacity
              style={[styles.attachBtn, cooldown.isLocked && styles.disabledInput]}
              onPress={handleSelectAttachment}
              disabled={cooldown.isLocked}
              activeOpacity={0.8}
            >
              <Text style={styles.attachBtnText}>
                {attachmentName ? `📎 Attached: ${attachmentName} (${attachmentSizeMb} MB)` : '📁 Attach File / Screenshot (< 2MB)'}
              </Text>
            </TouchableOpacity>

            {attachmentName && !cooldown.isLocked && (
              <TouchableOpacity onPress={() => { setAttachmentName(null); setAttachmentSizeMb(null); }}>
                <Text style={{ fontSize: 12, color: '#C62828', marginTop: 4, fontWeight: 'bold' }}>
                  ✕ Remove Attachment
                </Text>
              </TouchableOpacity>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                cooldown.isLocked && styles.submitBtnDisabled
              ]}
              onPress={handleSubmit}
              disabled={cooldown.isLocked || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {cooldown.isLocked ? '🔒 Submission Disabled (3-Day Cooldown)' : '🚀 Submit Feedback'}
                </Text>
              )}
            </TouchableOpacity>
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
    maxHeight: 620
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
    fontSize: 16,
    fontWeight: 'bold'
  },
  closeBtn: {
    padding: 4
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  infoBanner: {
    backgroundColor: '#FFF8E7',
    borderLeftWidth: 4,
    borderLeftColor: Colors.maroon,
    padding: 10,
    borderRadius: 6,
    marginBottom: 14
  },
  infoBannerText: {
    fontSize: 12,
    color: Colors.textPrimary
  },
  cooldownBox: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#EF9A9A',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14
  },
  cooldownTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 4
  },
  cooldownDesc: {
    fontSize: 12,
    color: Colors.textPrimary,
    marginBottom: 6
  },
  cooldownUnlock: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B71C1C'
  },
  cooldownDate: {
    fontSize: 11,
    color: '#555555',
    marginTop: 2
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 10,
    marginBottom: 6
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6
  },
  catChip: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD'
  },
  catChipActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon
  },
  catChipText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '500'
  },
  catChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    backgroundColor: '#FAFAFA'
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top'
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    opacity: 0.7
  },
  attachBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.maroon,
    backgroundColor: '#FFF8E7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  attachBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  submitBtn: {
    backgroundColor: Colors.maroon,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10
  },
  submitBtnDisabled: {
    backgroundColor: '#9E9E9E'
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold'
  }
});
