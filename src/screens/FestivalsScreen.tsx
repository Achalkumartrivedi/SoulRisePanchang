import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { Festival, FestivalCategory } from '../types/panchang';
import { FESTIVALS, getLocalizedFestivalTitle } from '../engine/festivalRepository';
import { useLanguage } from '../context/LanguageContext';
import { getWorldFestivalsByCountry, WorldFestivalItem } from '../engine/worldFestivalRepository';

interface FestivalsScreenProps {
  onSelectFestivalDate: (dateIso: string) => void;
}

export function getCategoryBadgeLabel(category: string): { label: string; bg: string; color: string } {
  switch (category) {
    case 'JAIN_FESTIVAL':
      return { label: '🪔 Jain Parva', bg: '#FFF3E0', color: '#E65100' };
    case 'SIKH_FESTIVAL':
      return { label: '☬ Sikh Gurpurab', bg: '#FFF8E1', color: '#F57F17' };
    case 'BUDDHIST_FESTIVAL':
      return { label: '☸️ Buddhist Sacred Day', bg: '#E8F5E9', color: '#2E7D32' };
    case 'CHRISTIAN_FESTIVAL':
      return { label: '✝️ Christian Feast', bg: '#E1F5FE', color: '#0277BD' };
    case 'PARSI_FESTIVAL':
      return { label: '🔥 Parsi Holy Day', bg: '#FBE9E7', color: '#D84315' };
    case 'WORLD_FESTIVAL':
      return { label: '🌐 World Festival', bg: '#E0F2F1', color: '#00695C' };
    case 'VRAT':
      return { label: '🌿 Hindu Vrat', bg: '#F3E5F5', color: '#7B1FA2' };
    case 'JAYANTI':
      return { label: '🚩 Jayanti', bg: '#FFF3E0', color: '#D84315' };
    case 'CULTURAL':
      return { label: '🌾 Cultural Festival', bg: '#FFF8E1', color: '#F57F17' };
    case 'ECLIPSE':
      return { label: '🌑 Eclipse / Grahan', bg: '#ECEFF1', color: '#37474F' };
    case 'MAJOR_FESTIVAL':
    default:
      return { label: '🕉️ Hindu Festival', bg: '#FFF3E0', color: Colors.maroon };
  }
}

export const FestivalsScreen: React.FC<FestivalsScreenProps> = ({ onSelectFestivalDate }) => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FestivalCategory | 'ALL' | 'WORLD_FESTIVAL'>('ALL');
  const [activeModalFestival, setActiveModalFestival] = useState<Festival | null>(null);
  const [activeWorldFestival, setActiveWorldFestival] = useState<WorldFestivalItem | null>(null);

  // 1. Comprehensive Multi-Language & Multi-Field Search Filter
  const filteredFestivals = FESTIVALS.filter(f => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      f.name.toLowerCase().includes(q) ||
      (f.hindiName && f.hindiName.toLowerCase().includes(q)) ||
      (f.gujaratiName && f.gujaratiName.toLowerCase().includes(q)) ||
      (f.deity && f.deity.toLowerCase().includes(q)) ||
      (f.description && f.description.toLowerCase().includes(q)) ||
      (f.rituals && f.rituals.toLowerCase().includes(q)) ||
      (f.tithiDescription && f.tithiDescription.toLowerCase().includes(q)) ||
      (f.region && f.region.toLowerCase().includes(q)) ||
      f.dateIso.includes(q);

    let matchesCategory = false;
    if (selectedCategory === 'ALL') {
      matchesCategory = true;
    } else if (selectedCategory === 'MAJOR_FESTIVAL') {
      matchesCategory = f.category === 'MAJOR_FESTIVAL' || f.category === 'VRAT' || f.category === 'JAYANTI' || f.category === 'CULTURAL';
    } else {
      matchesCategory = f.category === selectedCategory;
    }

    return matchesSearch && matchesCategory;
  });

  // 2. Strict Chronological Sorting by Date ISO (Ascending Integer Timestamp) + Alphabetical Tie-Breaker for Same Date
  const sortedFestivals = [...filteredFestivals].sort((a, b) => {
    const tA = new Date(a.dateIso + 'T00:00:00Z').getTime();
    const tB = new Date(b.dateIso + 'T00:00:00Z').getTime();
    if (tA !== tB) {
      return tA - tB;
    }
    // Secondary Sort (Same Date Tie-Breaker): Alphabetical by localized title
    const titleA = getLocalizedFestivalTitle(a, language);
    const titleB = getLocalizedFestivalTitle(b, language);
    return titleA.localeCompare(titleB, language === 'gu' ? 'gu' : language === 'hi' ? 'hi' : 'en');
  });

  const worldCountryGroups = getWorldFestivalsByCountry().filter(g => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return g.country.toLowerCase().includes(q) || g.festivals.some(f => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q));
  });

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

      {/* Filter Category Chips (Horizontal Scrollable Container) */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterBarScroll}
          contentContainerStyle={styles.filterBarContent}
        >
          <TouchableOpacity
            style={[styles.filterChip, selectedCategory === 'ALL' && styles.filterChipActive]}
            onPress={() => setSelectedCategory('ALL')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, selectedCategory === 'ALL' && styles.filterTextActive]}>All (सभी)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedCategory === 'MAJOR_FESTIVAL' && styles.filterChipActive]}
            onPress={() => setSelectedCategory('MAJOR_FESTIVAL')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, selectedCategory === 'MAJOR_FESTIVAL' && styles.filterTextActive]}>🕉️ Hindu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedCategory === 'JAIN_FESTIVAL' && styles.filterChipActive]}
            onPress={() => setSelectedCategory('JAIN_FESTIVAL')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, selectedCategory === 'JAIN_FESTIVAL' && styles.filterTextActive]}>🪔 Jain</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedCategory === 'SIKH_FESTIVAL' && styles.filterChipActive]}
            onPress={() => setSelectedCategory('SIKH_FESTIVAL')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, selectedCategory === 'SIKH_FESTIVAL' && styles.filterTextActive]}>☬ Sikh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedCategory === 'BUDDHIST_FESTIVAL' && styles.filterChipActive]}
            onPress={() => setSelectedCategory('BUDDHIST_FESTIVAL')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, selectedCategory === 'BUDDHIST_FESTIVAL' && styles.filterTextActive]}>☸️ Buddhist</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedCategory === 'CHRISTIAN_FESTIVAL' && styles.filterChipActive]}
            onPress={() => setSelectedCategory('CHRISTIAN_FESTIVAL')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, selectedCategory === 'CHRISTIAN_FESTIVAL' && styles.filterTextActive]}>✝️ Christian</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedCategory === 'PARSI_FESTIVAL' && styles.filterChipActive]}
            onPress={() => setSelectedCategory('PARSI_FESTIVAL')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, selectedCategory === 'PARSI_FESTIVAL' && styles.filterTextActive]}>🔥 Parsi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedCategory === 'WORLD_FESTIVAL' && styles.filterChipActive]}
            onPress={() => setSelectedCategory('WORLD_FESTIVAL')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, selectedCategory === 'WORLD_FESTIVAL' && styles.filterTextActive]}>🌐 World</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Hero Jain Chaturmas & Paryushan Banner (Only visible under Jain filter) */}
      {selectedCategory === 'JAIN_FESTIVAL' && (
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
      {selectedCategory === 'WORLD_FESTIVAL' ? (
        <FlatList
          data={worldCountryGroups}
          keyExtractor={item => item.country}
          contentContainerStyle={styles.listContent}
          renderItem={({ item: group }) => (
            <View style={styles.countryGroupCard}>
              <View style={styles.countryHeaderBox}>
                <Text style={styles.countryHeaderText}>{group.countryFlag} {group.country}</Text>
              </View>
              {group.festivals.map(wf => (
                <TouchableOpacity
                  key={wf.id}
                  style={styles.worldFestItemCard}
                  onPress={() => setActiveWorldFestival(wf)}
                  activeOpacity={0.8}
                >
                  <View style={styles.worldItemHeader}>
                    <Text style={styles.worldItemTitle}>{wf.name}</Text>
                    <Text style={styles.worldItemDate}>{wf.dateIso}</Text>
                  </View>
                  {wf.localName && wf.localName !== wf.name ? (
                    <Text style={styles.worldItemLocal}>{wf.localName}</Text>
                  ) : null}
                  <Text style={styles.worldItemDesc} numberOfLines={2}>{wf.description}</Text>
                  <Text style={styles.viewDetailsText}>Tap for Country & Celebration Details ➔</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      ) : (
        <FlatList
          data={sortedFestivals}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No Festivals Found</Text>
              <Text style={styles.emptySub}>No festival records match the selected category or search query.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const dateObj = new Date(item.dateIso + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            const localizedTitle = getLocalizedFestivalTitle(item, language);
            const secondaryTitle = (language === 'gu' || language === 'hi')
              ? (item.name !== localizedTitle ? item.name : '')
              : (item.hindiName || item.gujaratiName || '');

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

                  {(() => {
                    const badge = getCategoryBadgeLabel(item.category);
                    return (
                      <View style={[styles.categoryBadge, { backgroundColor: badge.bg, borderColor: badge.color }]}>
                        <Text style={[styles.categoryBadgeText, { color: badge.color }]}>
                          {badge.label}
                        </Text>
                      </View>
                    );
                  })()}
                </View>

                <Text style={styles.festName}>{localizedTitle}</Text>
                {secondaryTitle ? <Text style={styles.festHindiName}>{secondaryTitle}</Text> : null}

                {item.region ? (
                  <View style={styles.regionBadgeRow}>
                    <Text style={styles.regionBadgeText}>📍 {item.region}</Text>
                  </View>
                ) : null}

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
      )}

      {/* World Festival Detail Modal */}
      {activeWorldFestival && (
        <Modal visible={!!activeWorldFestival} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {activeWorldFestival.countryFlag} {activeWorldFestival.country}: {activeWorldFestival.name}
                </Text>
                <TouchableOpacity onPress={() => setActiveWorldFestival(null)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 380 }}>
                {activeWorldFestival.localName && activeWorldFestival.localName !== activeWorldFestival.name ? (
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: Colors.maroon, marginBottom: 6 }}>
                    Native Name: {activeWorldFestival.localName}
                  </Text>
                ) : null}
                
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: Colors.textSecondary, marginBottom: 8 }}>
                  📅 Date: {activeWorldFestival.dateIso}
                </Text>

                <Text style={styles.modalSectionTitle}>📖 Celebration & Overview</Text>
                <Text style={styles.modalText}>{activeWorldFestival.description}</Text>

                <Text style={[styles.modalSectionTitle, { marginTop: 12 }]}>🌟 Cultural & Historical Significance</Text>
                <Text style={styles.modalText}>{activeWorldFestival.significance}</Text>

                <TouchableOpacity
                  style={styles.selectDateBtn}
                  onPress={() => {
                    const iso = activeWorldFestival.dateIso;
                    setActiveWorldFestival(null);
                    onSelectFestivalDate(iso);
                  }}
                >
                  <Text style={styles.selectDateBtnText}>View in Calendar ➔</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Festival Detail Modal */}
      {activeModalFestival && (
        <Modal visible={!!activeModalFestival} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {getLocalizedFestivalTitle(activeModalFestival, language)}
                </Text>
                <TouchableOpacity onPress={() => setActiveModalFestival(null)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              {activeModalFestival.hindiName && activeModalFestival.name !== getLocalizedFestivalTitle(activeModalFestival, language) ? (
                <Text style={styles.modalHindi}>{activeModalFestival.name}</Text>
              ) : activeModalFestival.hindiName ? (
                <Text style={styles.modalHindi}>{activeModalFestival.hindiName}</Text>
              ) : null}

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
  filterContainer: {
    height: 48,
    marginVertical: 6,
  },
  filterBarScroll: {
    flex: 1,
  },
  filterBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 36,
    minWidth: 64,
    borderRadius: 18,
    backgroundColor: '#FAF5EE',
    borderWidth: 1.5,
    borderColor: '#E8D8C8',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  filterText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#424242',
    textAlign: 'center',
    includeFontPadding: false,
  },
  filterTextActive: {
    color: '#FFD700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
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
    marginBottom: 4,
  },
  regionBadgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  regionBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.maroon,
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
