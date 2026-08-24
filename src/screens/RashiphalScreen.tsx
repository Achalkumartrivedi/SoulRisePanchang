import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { RashiDetail } from '../types/panchang';
import { RASHIPHAL_DATA } from '../engine/rashiphalRepository';

export const RashiphalScreen: React.FC = () => {
  const [selectedRashi, setSelectedRashi] = useState<RashiDetail>(RASHIPHAL_DATA[0]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>♈ Daily Rashiphal (दैनिक राशिफल)</Text>
        <Text style={styles.headerSubtitle}>Astrological predictions and guidance for all 12 Rashi signs</Text>
      </View>

      {/* Horizontally Scrollable Rashi Selector */}
      <View style={styles.selectorContainer}>
        <FlatList
          horizontal
          data={RASHIPHAL_DATA}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = selectedRashi.id === item.id;
            return (
              <TouchableOpacity
                style={[styles.rashiTab, isSelected && styles.rashiTabSelected]}
                onPress={() => setSelectedRashi(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.rashiSymbol}>{item.symbol}</Text>
                <Text style={[styles.rashiTabName, isSelected && styles.rashiTabNameSelected]}>
                  {item.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Selected Rashi Detail View */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.symbolBox}>
              <Text style={styles.bigSymbol}>{selectedRashi.symbol}</Text>
            </View>
            <View style={styles.cardTitleBox}>
              <Text style={styles.rashiMainTitle}>{selectedRashi.name}</Text>
              <Text style={styles.rashiMainHindi}>{selectedRashi.hindiName}</Text>
              <Text style={styles.rashiMeta}>
                Element: {selectedRashi.element} • Ruler: {selectedRashi.rulingPlanet}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Daily Forecast */}
          <Text style={styles.sectionTitle}>🔮 Today's Guidance (आज का फलादेश)</Text>
          <Text style={styles.predictionHindi}>{selectedRashi.predictionHindi}</Text>
          <Text style={styles.predictionEnglish}>{selectedRashi.dailyPrediction}</Text>

          <View style={styles.divider} />

          {/* Attributes Grid */}
          <View style={styles.attrRow}>
            <View style={styles.attrBox}>
              <Text style={styles.attrLabel}>Lucky Number</Text>
              <Text style={styles.attrValueNum}>{selectedRashi.luckyNumber}</Text>
            </View>

            <View style={styles.attrBox}>
              <Text style={styles.attrLabel}>Lucky Color</Text>
              <View style={styles.colorPillRow}>
                <View style={[styles.colorDot, { backgroundColor: selectedRashi.luckyColor }]} />
                <Text style={styles.attrValue}>{selectedRashi.luckyColor}</Text>
              </View>
            </View>

            <View style={styles.attrBox}>
              <Text style={styles.attrLabel}>Best Compatibility</Text>
              <Text style={styles.attrValue}>{selectedRashi.compatibility}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBg,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.primaryLight,
    marginTop: 2,
  },
  selectorContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  rashiTab: {
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rashiTabSelected: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  rashiSymbol: {
    fontSize: 20,
    marginBottom: 2,
  },
  rashiTabName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  rashiTabNameSelected: {
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: Colors.accentGold,
  },
  bigSymbol: {
    fontSize: 28,
  },
  cardTitleBox: {
    flex: 1,
  },
  rashiMainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  rashiMainHindi: {
    fontSize: 14,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  rashiMeta: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 8,
  },
  predictionHindi: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 6,
  },
  predictionEnglish: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  attrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attrBox: {
    flex: 1,
    backgroundColor: Colors.creamBg,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  attrLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  attrValueNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginTop: 2,
  },
  colorPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  attrValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 2,
  },
});
