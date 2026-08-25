import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { ChoghadiyaItem } from '../types/panchang';

interface ChoghadiyaGridProps {
  dayChoghadiya: ChoghadiyaItem[];
  nightChoghadiya: ChoghadiyaItem[];
}

export const ChoghadiyaGrid: React.FC<ChoghadiyaGridProps> = ({ dayChoghadiya, nightChoghadiya }) => {
  const [activeTab, setActiveTab] = useState<'DAY' | 'NIGHT'>('DAY');

  const items = activeTab === 'DAY' ? dayChoghadiya : nightChoghadiya;

  // Current time in minutes for live progression calculation
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardHeaderTitle}>⏱️ Day & Night Choghadiya</Text>

        {/* Day / Night Toggle Bar */}
        <View style={styles.tabToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, activeTab === 'DAY' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('DAY')}
          >
            <Text style={[styles.toggleText, activeTab === 'DAY' && styles.toggleTextActive]}>☀️ Day</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, activeTab === 'NIGHT' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('NIGHT')}
          >
            <Text style={[styles.toggleText, activeTab === 'NIGHT' && styles.toggleTextActive]}>🌙 Night</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.gridContainer}>
        {items.map((item, index) => {
          // Parse start and end time minutes
          const startMin = parseTimeToMin(item.startTime);
          const endMin = parseTimeToMin(item.endTime);
          
          let isActive = false;
          let percentElapsed = 0;

          if (startMin <= endMin) {
            isActive = currentMin >= startMin && currentMin < endMin;
            if (isActive) {
              percentElapsed = Math.min(100, Math.max(0, Math.round(((currentMin - startMin) / (endMin - startMin)) * 100)));
            }
          } else {
            // Overnight slot
            isActive = currentMin >= startMin || currentMin < endMin;
          }

          return (
            <View
              key={index}
              style={[
                styles.itemCard,
                item.isAuspicious ? styles.bgGood : styles.bgBad,
                isActive && styles.activeCardBorder
              ]}
            >
              {isActive && (
                <View style={styles.activeRunningBadge}>
                  <Text style={styles.activeRunningText}>⚡ RUNNING NOW</Text>
                </View>
              )}

              <View style={styles.itemTop}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemHindi}>{item.hindiName}</Text>
              </View>

              <Text style={styles.itemTime}>{item.startTime} - {item.endTime}</Text>

              <View style={[styles.badge, { backgroundColor: item.isAuspicious ? Colors.auspiciousGreen : Colors.inauspiciousRed }]}>
                <Text style={styles.badgeText}>{item.isAuspicious ? 'Auspicious (शुभ)' : 'Inauspicious (अशुभ)'}</Text>
              </View>

              {isActive && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${percentElapsed}%` }]} />
                  </View>
                  <Text style={styles.progressPercentText}>{percentElapsed}% Elapsed</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

function parseTimeToMin(timeStr: string): number {
  const parts = timeStr.split(' ');
  const [hStr, mStr] = parts[0].split(':');
  let h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  if (parts[1] === 'PM' && h < 12) h += 12;
  if (parts[1] === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
    flexShrink: 1,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9,
  },
  toggleBtnActive: {
    backgroundColor: Colors.maroon,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    justifyContent: 'space-between',
    position: 'relative',
  },
  bgGood: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  bgBad: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  activeCardBorder: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  activeRunningBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  activeRunningText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  itemHindi: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  itemTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginVertical: 4,
    fontWeight: '600',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 6,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressPercentText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    textAlign: 'right',
    marginTop: 2,
  },
});
