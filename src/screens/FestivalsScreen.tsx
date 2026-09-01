import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { Festival, FestivalCategory } from '../types/panchang';
import { FESTIVALS } from '../engine/festivalRepository';
import { useLanguage } from '../context/LanguageContext';
import { getWorldFestivalsByCountry, WorldFestivalItem } from '../engine/worldFestivalRepository';

interface FestivalsScreenProps {
  onSelectFestivalDate: (dateIso: string) => void;
}

export const FestivalsScreen: React.FC<FestivalsScreenProps> = ({ onSelectFestivalDate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FestivalCategory | 'ALL'>('JAIN_FESTIVAL');
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
          style={[styles.filterChip, selectedCategory === 'JAIN_FESTIVAL' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('JAIN_FESTIVAL')}
        >
          <Text style={[styles.filterText, selectedCategory === 'JAIN_FESTIVAL' && styles.filterTextActive]}>🪔 Jain Parva</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'MAJOR_FESTIVAL' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('MAJOR_FESTIVAL')}
        >
          <Text style={[styles.filterText, selectedCategory === 'MAJOR_FESTIVAL' && styles.filterTextActive]}>Festivals</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Jain Chaturmas & Paryushan Banner */}
      {(selectedCategory === 'JAIN_FESTIVAL' || selectedCategory === 'ALL') && (
        <View style={styles.jainChaturmasBanner}>
          <Text style={styles.chaturmasTitle}>🪔 JAIN CHATURMAS 2026 (4-MONTH HOLY MAHAVRAT)</Text>
          <Text style={styles.chaturmasDates}>
            📅 July 29, 2026 (Ashadh Purnima) ➔ November 24, 2026 (Kartiki Purnima)
          </Text>
          <Text style={styles.chaturmasHighlight}>
            ✨ <Text style={{ fontWeight: 'bold', color: '#FFD700' }}>Holiest Event:</Text> Paryushan Parva & Samvatsari (Sept 12, 2026 - Michhami Dukkadam Universal Forgiveness)
          </Text>
        </View>
      )}

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
              style={styles.festivalCard}
              onPress={() => setActiveModalFestival(item)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateBadgeText}>{formattedDate}</Text>
                </View>

                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {item.category === 'JAIN_FESTIVAL'
                      ? '🪔 Jain Parva'
                      : item.category === 'MAJOR_FESTIVAL'
                      ? 'Festival'
                      : item.category === 'VRAT'
                      ? 'Vrat'
                      : 'Jayanti'}
                  </Text>
                </View>
              </View>

              <Text style={styles.festName}>{item.name}</Text>
              <Text style={styles.festHindiName}>{item.hindiName}</Text>

              <View style={styles.deityRow}>
                <Text style={styles.deityLabel}>Deity / Aradhana:</Text>
                <Text style={styles.deityText}>{item.deity}</Text>
              </View>

              <Text style={styles.shortDesc} numberOfLines={2}>{item.description}</Text>

              <View style={styles.cardFooterRow}>
                <Text style={styles.tithiDesc}>📜 {item.tithiDescription}</Text>
                <Text style={styles.viewDetailsText}>Tap for Details ➔</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Festival Detail Modal */}
      {activeModalFestival && (
        <Modal visible={!!activeModalFestival} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={1}>{activeModalFestival.name}</Text>
                <TouchableOpacity onPress={() => setActiveModalFestival(null)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalHindi}>{activeModalFestival.hindiName}</Text>

              <View style={styles.modalMetaRow}>
                <Text style={styles.modalMetaTag}>📅 Date: {activeModalFestival.dateIso}</Text>
                <Text style={styles.modalMetaTag}>📜 Tithi: {activeModalFestival.tithiDescription}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>📖 Significance & Story</Text>
                <Text style={styles.modalSectionBody}>{activeModalFestival.description}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>🙏 Rituals & Aradhana</Text>
                <Text style={styles.modalSectionBody}>{activeModalFestival.rituals}</Text>
              </View>

              <TouchableOpacity
                style={styles.viewPanchangBtn}
                onPress={() => {
                  onSelectFestivalDate(activeModalFestival.dateIso);
                  setActiveModalFestival(null);
                }}
              >
                <Text style={styles.viewPanchangBtnText}>View Panchang for this Date ➔</Text>
              </TouchableOpacity>
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
    backgroundColor: Colors.maroon,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.creamBg,
    marginTop: 2,
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    paddingVertical: 2,
  },
  clearIcon: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 6,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  filterText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFD700',
  },

  // Hero Jain Chaturmas Banner
  jainChaturmasBanner: {
    backgroundColor: '#4A0E17',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
    elevation: 3,
  },
  chaturmasTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  chaturmasDates: {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 3,
    fontWeight: 'bold',
  },
  chaturmasHighlight: {
    fontSize: 10,
    color: '#FFE0B2',
    marginTop: 4,
    lineHeight: 14,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  festivalCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateBadge: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  categoryBadge: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  festName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  festHindiName: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  deityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  deityLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginRight: 4,
  },
  deityText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  shortDesc: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 16,
    marginBottom: 8,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  tithiDesc: {
    fontSize: 10,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  viewDetailsText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.creamBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
    flex: 1,
    marginRight: 10,
  },
  closeBtn: {
    backgroundColor: '#E0E0E0',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  modalHindi: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  modalMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAF5EE',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalMetaTag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  modalSection: {
    marginBottom: 12,
  },
  modalSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 4,
  },
  modalSectionBody: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 17,
  },
  viewPanchangBtn: {
    backgroundColor: Colors.maroon,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  viewPanchangBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  countryGroupCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },
  countryHeaderBox: {
    backgroundColor: '#E8EAF6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3F51B5',
  },
  countryHeaderText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  worldFestItemCard: {
    backgroundColor: '#FAF5EE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  worldItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  worldItemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
    flex: 1,
    marginRight: 6,
  },
  worldItemDate: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1A237E',
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  worldItemLocal: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 1,
  },
  worldItemDesc: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 4,
    lineHeight: 16,
  },
  modalText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  selectDateBtn: {
    backgroundColor: Colors.maroon,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  selectDateBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
});
