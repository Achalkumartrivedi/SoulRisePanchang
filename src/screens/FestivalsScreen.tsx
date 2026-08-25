import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Colors } from '../theme/colors';
import { Festival, FestivalCategory } from '../types/panchang';
import { FESTIVALS } from '../engine/festivalRepository';
import { useLanguage } from '../context/LanguageContext';

interface FestivalsScreenProps {
  onSelectFestivalDate: (dateIso: string) => void;
}

export const FestivalsScreen: React.FC<FestivalsScreenProps> = ({ onSelectFestivalDate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FestivalCategory | 'ALL'>('ALL');
  const [activeModalFestival, setActiveModalFestival] = useState<Festival | null>(null);

  const filteredFestivals = FESTIVALS.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.hindiName.includes(searchQuery) ||
      f.deity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || f.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>{t('festivalsTitle')}</Text>
        <Text style={styles.headerSubtitle} numberOfLines={2} adjustsFontSizeToFit>{t('festivalsSub')}</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchFestivals')}
            placeholderTextColor="#9E9E9E"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✖</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Category Chips */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'ALL' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('ALL')}
        >
          <Text style={[styles.filterText, selectedCategory === 'ALL' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'MAJOR_FESTIVAL' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('MAJOR_FESTIVAL')}
        >
          <Text style={[styles.filterText, selectedCategory === 'MAJOR_FESTIVAL' && styles.filterTextActive]}>Festivals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'VRAT' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('VRAT')}
        >
          <Text style={[styles.filterText, selectedCategory === 'VRAT' && styles.filterTextActive]}>Vrat & Fasting</Text>
        </TouchableOpacity>
      </View>

      {/* Festival List */}
      <FlatList
        data={filteredFestivals}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const dateObj = new Date(item.dateIso + 'T00:00:00');
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setActiveModalFestival(item)}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateBadgeDay}>{dateObj.getDate()}</Text>
                  <Text style={styles.dateBadgeMonth}>
                    {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                  </Text>
                </View>

                <View style={styles.infoContainer}>
                  <Text style={styles.festName}>{item.name}</Text>
                  <Text style={styles.festHindi}>{item.hindiName}</Text>
                  <Text style={styles.festSub}>Deity: {item.deity} • {item.tithiDescription}</Text>
                </View>
              </View>

              <Text style={styles.chevron}>➔</Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Festival Details Modal */}
      {activeModalFestival && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!activeModalFestival}
          onRequestClose={() => setActiveModalFestival(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{activeModalFestival.name}</Text>
              <Text style={styles.modalHindi}>{activeModalFestival.hindiName}</Text>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>📅 Date & Tithi</Text>
                <Text style={styles.modalValue}>{activeModalFestival.dateIso} ({activeModalFestival.tithiDescription})</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>🪔 Worshiped Deity</Text>
                <Text style={styles.modalValue}>{activeModalFestival.deity}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>📖 Significance</Text>
                <Text style={styles.modalValue}>{activeModalFestival.description}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>✨ Sacred Rituals & Observance</Text>
                <Text style={styles.modalValue}>{activeModalFestival.rituals}</Text>
              </View>

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  style={styles.modalJumpBtn}
                  onPress={() => {
                    const dIso = activeModalFestival.dateIso;
                    setActiveModalFestival(null);
                    onSelectFestivalDate(dIso);
                  }}
                >
                  <Text style={styles.modalJumpText}>View Panchang for this Date</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setActiveModalFestival(null)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  clearIcon: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterChip: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 1,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateBadge: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 10,
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateBadgeDay: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateBadgeMonth: {
    color: Colors.accentGold,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  infoContainer: {
    flex: 1,
  },
  festName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  festHindi: {
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: '600',
    marginTop: 1,
  },
  festSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 3,
  },
  chevron: {
    fontSize: 14,
    color: Colors.accentGold,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  modalHindi: {
    fontSize: 14,
    color: Colors.primaryDark,
    fontWeight: '600',
    marginBottom: 14,
  },
  modalSection: {
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  modalValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    marginTop: 2,
    lineHeight: 18,
  },
  modalBtnRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalJumpBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  modalJumpText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalCloseBtn: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
