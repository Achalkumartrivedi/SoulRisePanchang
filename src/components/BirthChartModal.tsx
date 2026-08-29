import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import { Colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { calculateBirthKundali, KundaliResult, KundaliDivisionalChart } from '../engine/kundaliEngine';
import { DEFAULT_CITIES } from '../data/cities';
import { CityLocation } from '../types/panchang';

interface BirthChartModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCity: CityLocation;
}

export const BirthChartModal: React.FC<BirthChartModalProps> = ({
  visible,
  onClose,
  selectedCity
}) => {
  const { language } = useLanguage();

  // Form State
  const [name, setName] = useState('Rahul Sharma');
  const [dobDay, setDobDay] = useState('15');
  const [dobMonth, setDobMonth] = useState('08');
  const [dobYear, setDobYear] = useState('1995');
  const [tobHour, setTobHour] = useState('10');
  const [tobMinute, setTobMinute] = useState('30');
  const [city, setCity] = useState<CityLocation>(selectedCity);

  // Active Tab for Divisional Charts
  const [activeChartKey, setActiveChartKey] = useState<'D1' | 'MOON' | 'SUN' | 'D2' | 'D9' | 'D10'>('D1');
  const [activeDetailSection, setActiveDetailSection] = useState<'PARTICULARS' | 'PLANETS' | 'HOUSES'>('PARTICULARS');

  // Kundali Result State
  const [kundali, setKundali] = useState<KundaliResult | null>(() => {
    return calculateBirthKundali('Rahul Sharma', new Date(1995, 7, 15), 10, 30, selectedCity.name, selectedCity.latitude, selectedCity.longitude);
  });

  const handleGenerate = () => {
    const day = parseInt(dobDay, 10) || 1;
    const month = (parseInt(dobMonth, 10) || 1) - 1;
    const year = parseInt(dobYear, 10) || 1995;
    const h = parseInt(tobHour, 10) || 12;
    const m = parseInt(tobMinute, 10) || 0;

    const dob = new Date(year, month, day);
    const result = calculateBirthKundali(name, dob, h, m, city.name, city.latitude, city.longitude);
    setKundali(result);
  };

  const activeChart: KundaliDivisionalChart | undefined = kundali?.divisionalCharts[activeChartKey];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Header Bar */}
              <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>🔮 Janam Kundali Generator</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* 1. Birth Details Form Card */}
                <View style={styles.formCard}>
                  <Text style={styles.formSectionTitle}>📝 Birth Particulars Input</Text>

                  {/* Name Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={styles.textInput}
                      value={name}
                      onChangeText={setName}
                      placeholder="Enter name"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>

                  {/* DOB Row */}
                  <Text style={styles.inputLabel}>Date of Birth (DD / MM / YYYY)</Text>
                  <View style={styles.rowInputs}>
                    <TextInput
                      style={[styles.textInput, styles.col3]}
                      value={dobDay}
                      onChangeText={setDobDay}
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="DD"
                    />
                    <TextInput
                      style={[styles.textInput, styles.col3]}
                      value={dobMonth}
                      onChangeText={setDobMonth}
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="MM"
                    />
                    <TextInput
                      style={[styles.textInput, styles.col3]}
                      value={dobYear}
                      onChangeText={setDobYear}
                      keyboardType="number-pad"
                      maxLength={4}
                      placeholder="YYYY"
                    />
                  </View>

                  {/* TOB Row */}
                  <Text style={styles.inputLabel}>Time of Birth (24-Hour Format: HH : MM)</Text>
                  <View style={styles.rowInputs}>
                    <TextInput
                      style={[styles.textInput, styles.col2]}
                      value={tobHour}
                      onChangeText={setTobHour}
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="HH (0-23)"
                    />
                    <TextInput
                      style={[styles.textInput, styles.col2]}
                      value={tobMinute}
                      onChangeText={setTobMinute}
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="MM (0-59)"
                    />
                  </View>

                  {/* City Selection */}
                  <Text style={styles.inputLabel}>City of Birth</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityScroll}>
                    {DEFAULT_CITIES.map(c => (
                      <TouchableOpacity
                        key={c.name}
                        style={[styles.cityPill, city.name === c.name && styles.cityPillActive]}
                        onPress={() => setCity(c)}
                      >
                        <Text style={[styles.cityPillText, city.name === c.name && styles.cityPillTextActive]}>
                          {c.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Generate Button */}
                  <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate} activeOpacity={0.8}>
                    <Text style={styles.generateBtnText}>✨ Generate Vedic Birth Kundali</Text>
                  </TouchableOpacity>
                </View>

                {/* 2. Kundali Results Container */}
                {kundali && (
                  <View style={styles.resultsContainer}>

                    {/* Divisional Chart Switcher Tabs */}
                    <Text style={styles.sectionHeaderTitle}>🏛️ Divisional Charts Switcher</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartTabsScroll}>
                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'D1' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('D1')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'D1' && styles.chartTabTextActive]}>D1 Lagna</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'MOON' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('MOON')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'MOON' && styles.chartTabTextActive]}>Chandra (Moon)</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'SUN' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('SUN')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'SUN' && styles.chartTabTextActive]}>Surya (Sun)</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'D2' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('D2')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'D2' && styles.chartTabTextActive]}>D2 Hora (Wealth)</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'D9' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('D9')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'D9' && styles.chartTabTextActive]}>D9 Navamsha</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'D10' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('D10')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'D10' && styles.chartTabTextActive]}>D10 Dashamsha</Text>
                      </TouchableOpacity>
                    </ScrollView>

                    {/* Chart Graphic Box */}
                    {activeChart && (
                      <View style={styles.chartGraphicBox}>
                        <Text style={styles.chartGraphicTitle}>{activeChart.title}</Text>
                        <Text style={styles.chartGraphicSub}>
                          Rising Ascendant (Lagna): {kundali.lagnaRashi} • Degree: {kundali.lagnaDegree}
                        </Text>

                        {/* Visual Diamond Chart Grid (12 Houses) */}
                        <View style={styles.diamondGrid}>
                          {activeChart.houses.map(h => (
                            <View key={h.houseNumber} style={styles.houseBox}>
                              <View style={styles.houseHeaderRow}>
                                <Text style={styles.houseNumText}>H{h.houseNumber}</Text>
                                <Text style={styles.houseRashiText} numberOfLines={1}>{h.rashiName.split(' ')[0]}</Text>
                              </View>
                              <Text style={styles.housePlanetsText} numberOfLines={2}>
                                {h.planets.length > 0 ? h.planets.join(', ') : '—'}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* 3. Deep Analysis Section Switcher */}
                    <View style={styles.detailSectionSwitcher}>
                      <TouchableOpacity
                        style={[styles.detailSwitchBtn, activeDetailSection === 'PARTICULARS' && styles.detailSwitchBtnActive]}
                        onPress={() => setActiveDetailSection('PARTICULARS')}
                      >
                        <Text style={[styles.detailSwitchText, activeDetailSection === 'PARTICULARS' && styles.detailSwitchTextActive]}>
                          📋 Birth Panchang
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.detailSwitchBtn, activeDetailSection === 'PLANETS' && styles.detailSwitchBtnActive]}
                        onPress={() => setActiveDetailSection('PLANETS')}
                      >
                        <Text style={[styles.detailSwitchText, activeDetailSection === 'PLANETS' && styles.detailSwitchTextActive]}>
                          🪐 Planetary Degrees
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.detailSwitchBtn, activeDetailSection === 'HOUSES' && styles.detailSwitchBtnActive]}
                        onPress={() => setActiveDetailSection('HOUSES')}
                      >
                        <Text style={[styles.detailSwitchText, activeDetailSection === 'HOUSES' && styles.detailSwitchTextActive]}>
                          🏠 12 Houses Analysis
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Detail Section 1: Avakahada Chakra / Particulars */}
                    {activeDetailSection === 'PARTICULARS' && (
                      <View style={styles.detailCard}>
                        <Text style={styles.detailCardTitle}>📋 Birth Panchang & Avakahada Particulars</Text>
                        
                        <View style={styles.particularsGrid}>
                          <View style={styles.partItem}><Text style={styles.partLabel}>Born Tithi:</Text><Text style={styles.partVal}>{kundali.particulars.bornTithi}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>Paksha:</Text><Text style={styles.partVal}>{kundali.particulars.bornPaksha}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>Born Nakshatra:</Text><Text style={styles.partVal}>{kundali.particulars.bornNakshatra} (Pada {kundali.particulars.bornPada})</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>Born Yoga:</Text><Text style={styles.partVal}>{kundali.particulars.bornYoga}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>Born Karana:</Text><Text style={styles.partVal}>{kundali.particulars.bornKarana}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>Day (Vaara):</Text><Text style={styles.partVal}>{kundali.particulars.bornVaara}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>Varna:</Text><Text style={styles.partVal}>{kundali.particulars.varna}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>Vashya:</Text><Text style={styles.partVal}>{kundali.particulars.vashya}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>Yoni:</Text><Text style={styles.partVal}>{kundali.particulars.yoni}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>Gana:</Text><Text style={styles.partVal}>{kundali.particulars.gana}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>Nadi:</Text><Text style={styles.partVal}>{kundali.particulars.nadi}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>Paya (Foot):</Text><Text style={styles.partVal}>{kundali.particulars.paya}</Text></View>
                        </View>
                      </View>
                    )}

                    {/* Detail Section 2: Planetary Degrees Table */}
                    {activeDetailSection === 'PLANETS' && (
                      <View style={styles.detailCard}>
                        <Text style={styles.detailCardTitle}>🪐 Navagraha Degrees, Nakshatras & Houses</Text>

                        {kundali.planets.map(p => (
                          <View key={p.name} style={styles.planetRowCard}>
                            <View style={styles.planetRowLeft}>
                              <Text style={styles.planetSymbol}>{p.symbol}</Text>
                              <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Text style={styles.planetName}>{p.name}</Text>
                                  {p.isRetrograde && (
                                    <View style={styles.retroBadge}>
                                      <Text style={styles.retroText}>R (Retrograde)</Text>
                                    </View>
                                  )}
                                </View>
                                <Text style={styles.planetRashiSub}>{p.rashiName} ({p.rashiHindi})</Text>
                              </View>
                            </View>

                            <View style={styles.planetRowRight}>
                              <Text style={styles.planetDegreeText}>Deg: {p.degreeStr}</Text>
                              <Text style={styles.planetNakText}>⭐ {p.nakshatraName} • Pada {p.pada}</Text>
                              <Text style={styles.planetHouseText}>House: {p.house}th House</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Detail Section 3: 12 Houses Analysis */}
                    {activeDetailSection === 'HOUSES' && (
                      <View style={styles.detailCard}>
                        <Text style={styles.detailCardTitle}>🏠 12 Bhavas (Houses) Analysis</Text>

                        {kundali.houseDetails.map(h => (
                          <View key={h.houseNumber} style={styles.houseDetailRowCard}>
                            <View style={styles.houseDetailTop}>
                              <Text style={styles.houseHeaderTitleText}>House {h.houseNumber}: {h.rashiName}</Text>
                              <Text style={styles.houseLordText}>Lord: {h.rashiLord}</Text>
                            </View>
                            <Text style={styles.houseOccupantsText}>
                              Occupying Planets: {h.planets.length > 0 ? h.planets.join(', ') : 'None (Empty House)'}
                            </Text>
                            <Text style={styles.houseSignificationsText}>💡 Significations: {h.significations}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.creamBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    padding: 16,
    elevation: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  closeBtn: {
    backgroundColor: '#F0F0F0',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  formCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
    marginTop: 4,
  },
  textInput: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  col3: {
    flex: 1,
  },
  col2: {
    flex: 1,
  },
  cityScroll: {
    flexDirection: 'row',
    marginBottom: 12,
    marginTop: 4,
  },
  cityPill: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  cityPillActive: {
    backgroundColor: Colors.maroon,
  },
  cityPillText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  cityPillTextActive: {
    color: '#FFFFFF',
  },
  generateBtn: {
    backgroundColor: Colors.maroon,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultsContainer: {
    marginTop: 4,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 8,
  },
  chartTabsScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  chartTabBtn: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chartTabBtnActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  chartTabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  chartTabTextActive: {
    color: '#FFD700',
  },
  chartGraphicBox: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.accentGold,
    elevation: 3,
  },
  chartGraphicTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
    textAlign: 'center',
  },
  chartGraphicSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  diamondGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  houseBox: {
    width: '31%',
    backgroundColor: '#FAF5EE',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F0E0D0',
    minHeight: 64,
  },
  houseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  houseNumText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  houseRashiText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  housePlanetsText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },

  // Deep Analysis Switcher
  detailSectionSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
  },
  detailSwitchBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailSwitchBtnActive: {
    backgroundColor: Colors.maroon,
  },
  detailSwitchText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  detailSwitchTextActive: {
    color: '#FFFFFF',
  },

  // Detail Cards
  detailCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 10,
  },
  particularsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  partItem: {
    width: '48%',
    backgroundColor: '#FAF5EE',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  partLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  partVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 2,
  },

  // Planet Rows
  planetRowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  planetRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  planetSymbol: {
    fontSize: 22,
    marginRight: 10,
  },
  planetName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  retroBadge: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF9A9A',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 6,
  },
  retroText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#C62828',
  },
  planetRashiSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  planetRowRight: {
    alignItems: 'flex-end',
  },
  planetDegreeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  planetNakText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  planetHouseText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginTop: 1,
  },

  // House Detail Rows
  houseDetailRowCard: {
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  houseDetailTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  houseHeaderTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  houseLordText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  houseOccupantsText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  houseSignificationsText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
