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
import { ASTROLOGY_LOCALIZATION } from '../i18n/astrologyTerms';

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
  const loc = ASTROLOGY_LOCALIZATION[language] || ASTROLOGY_LOCALIZATION.en;

  // Form State
  const [name, setName] = useState('Rahul Sharma');
  const [dobDay, setDobDay] = useState('15');
  const [dobMonth, setDobMonth] = useState('08');
  const [dobYear, setDobYear] = useState('1995');
  const [tobHour, setTobHour] = useState('10');
  const [tobMinute, setTobMinute] = useState('30');
  const [city, setCity] = useState<CityLocation>(selectedCity);

  // City Picker Dropdown Modal State
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  // Default Chart Style is NORTH (North Indian Diamond Style)
  const [chartStyle, setChartStyle] = useState<'NORTH' | 'SOUTH' | 'GLOBAL'>('NORTH');

  // Active Tab for Divisional & Global Charts
  const [activeChartKey, setActiveChartKey] = useState<'D1' | 'MOON' | 'SUN' | 'D2' | 'D9' | 'D10' | 'WESTERN' | 'RUSSIAN' | 'THAI' | 'INDONESIAN'>('D1');
  const [activeDetailSection, setActiveDetailSection] = useState<'PARTICULARS' | 'PLANETS' | 'HOUSES' | 'GLOBAL'>('PARTICULARS');

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

  const filteredCities = DEFAULT_CITIES.filter(c => 
    c.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
    c.stateCountry.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
    (c.hindiName && c.hindiName.includes(citySearchQuery))
  );

  const activeChart: KundaliDivisionalChart | undefined = kundali?.divisionalCharts[activeChartKey];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Header Bar */}
              <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>{loc.birthChartTitle}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* 1. Birth Details Form Card */}
                <View style={styles.formCard}>
                  <Text style={styles.formSectionTitle}>{loc.birthDetailsInput}</Text>

                  {/* Name Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{loc.fullName}</Text>
                    <TextInput
                      style={styles.textInput}
                      value={name}
                      onChangeText={setName}
                      placeholder="Enter name"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>

                  {/* DOB Row */}
                  <Text style={styles.inputLabel}>{loc.dobLabel}</Text>
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
                  <Text style={styles.inputLabel}>{loc.tobLabel}</Text>
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

                  {/* City Selection Dropdown Field */}
                  <Text style={styles.inputLabel}>{loc.cityLabel}</Text>
                  <TouchableOpacity
                    style={styles.dropdownBtn}
                    onPress={() => setShowCityDropdown(true)}
                    activeOpacity={0.8}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dropdownCityName}>📍 {city.name}</Text>
                      <Text style={styles.dropdownCitySub}>{city.stateCountry}</Text>
                    </View>
                    <Text style={styles.dropdownArrow}>▼ Change</Text>
                  </TouchableOpacity>

                  {/* Generate Button */}
                  <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate} activeOpacity={0.8}>
                    <Text style={styles.generateBtnText}>{loc.generateBtn}</Text>
                  </TouchableOpacity>
                </View>

                {/* 2. Kundali Results Container */}
                {kundali && (
                  <View style={styles.resultsContainer}>

                    {/* Divisional & Global Chart Switcher Tabs */}
                    <Text style={styles.sectionHeaderTitle}>{loc.divisionalChartsTitle}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartTabsScroll}>
                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'D1' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('D1')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'D1' && styles.chartTabTextActive]}>{loc.d1Lagna}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'MOON' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('MOON')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'MOON' && styles.chartTabTextActive]}>{loc.chandraMoon}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'SUN' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('SUN')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'SUN' && styles.chartTabTextActive]}>{loc.suryaSun}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'D2' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('D2')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'D2' && styles.chartTabTextActive]}>{loc.d2Hora}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'D9' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('D9')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'D9' && styles.chartTabTextActive]}>{loc.d9Navamsha}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'D10' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('D10')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'D10' && styles.chartTabTextActive]}>{loc.d10Dashamsha}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'WESTERN' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('WESTERN')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'WESTERN' && styles.chartTabTextActive]}>{loc.westernNatal}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'RUSSIAN' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('RUSSIAN')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'RUSSIAN' && styles.chartTabTextActive]}>{loc.russianCosmogram}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'THAI' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('THAI')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'THAI' && styles.chartTabTextActive]}>{loc.thaiSuryayatra}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'INDONESIAN' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('INDONESIAN')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'INDONESIAN' && styles.chartTabTextActive]}>{loc.indonesianPawukon}</Text>
                      </TouchableOpacity>
                    </ScrollView>

                    {/* Chart Graphic Box */}
                    {activeChart && (
                      <View style={styles.chartGraphicBox}>
                        <View style={styles.chartGraphicHeaderRow}>
                          <Text style={styles.chartGraphicTitle}>{activeChart.title}</Text>

                          {/* Chart Style Switcher (North Indian Default) */}
                          <View style={styles.styleToggleBar}>
                            <TouchableOpacity
                              style={[styles.styleBtn, chartStyle === 'NORTH' && styles.styleBtnActive]}
                              onPress={() => setChartStyle('NORTH')}
                            >
                              <Text style={[styles.styleBtnText, chartStyle === 'NORTH' && styles.styleBtnTextActive]}>🏛️ North</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[styles.styleBtn, chartStyle === 'SOUTH' && styles.styleBtnActive]}
                              onPress={() => setChartStyle('SOUTH')}
                            >
                              <Text style={[styles.styleBtnText, chartStyle === 'SOUTH' && styles.styleBtnTextActive]}>☸️ South</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[styles.styleBtn, chartStyle === 'GLOBAL' && styles.styleBtnActive]}
                              onPress={() => setChartStyle('GLOBAL')}
                            >
                              <Text style={[styles.styleBtnText, chartStyle === 'GLOBAL' && styles.styleBtnTextActive]}>🌍 Global</Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        <Text style={styles.chartGraphicSub}>
                          Ascendant (Lagna): {kundali.lagnaRashi} • Degree: {kundali.lagnaDegree} • Style: {chartStyle === 'NORTH' ? 'North Indian Diamond Style (Default)' : chartStyle === 'SOUTH' ? 'South Indian Fixed Style' : 'Global Grid'}
                        </Text>

                        {/* Visual Chart Grid (North / South / Global) */}
                        <View style={chartStyle === 'NORTH' ? styles.northDiamondGrid : styles.diamondGrid}>
                          {activeChart.houses.map(h => (
                            <View key={h.houseNumber} style={[styles.houseBox, chartStyle === 'NORTH' && styles.northHouseBox]}>
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
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                      <View style={styles.detailSectionSwitcher}>
                        <TouchableOpacity
                          style={[styles.detailSwitchBtn, activeDetailSection === 'PARTICULARS' && styles.detailSwitchBtnActive]}
                          onPress={() => setActiveDetailSection('PARTICULARS')}
                        >
                          <Text style={[styles.detailSwitchText, activeDetailSection === 'PARTICULARS' && styles.detailSwitchTextActive]}>
                            {loc.birthPanchangTab}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.detailSwitchBtn, activeDetailSection === 'PLANETS' && styles.detailSwitchBtnActive]}
                          onPress={() => setActiveDetailSection('PLANETS')}
                        >
                          <Text style={[styles.detailSwitchText, activeDetailSection === 'PLANETS' && styles.detailSwitchTextActive]}>
                            {loc.planetaryDegreesTab}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.detailSwitchBtn, activeDetailSection === 'HOUSES' && styles.detailSwitchBtnActive]}
                          onPress={() => setActiveDetailSection('HOUSES')}
                        >
                          <Text style={[styles.detailSwitchText, activeDetailSection === 'HOUSES' && styles.detailSwitchTextActive]}>
                            {loc.houseAnalysisTab}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.detailSwitchBtn, activeDetailSection === 'GLOBAL' && styles.detailSwitchBtnActive]}
                          onPress={() => setActiveDetailSection('GLOBAL')}
                        >
                          <Text style={[styles.detailSwitchText, activeDetailSection === 'GLOBAL' && styles.detailSwitchTextActive]}>
                            {loc.westernAspectsTab}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </ScrollView>

                    {/* Detail Section 1: Avakahada Chakra / Particulars */}
                    {activeDetailSection === 'PARTICULARS' && (
                      <View style={styles.detailCard}>
                        <Text style={styles.detailCardTitle}>📋 Birth Panchang & Avakahada Particulars</Text>
                        
                        <View style={styles.particularsGrid}>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.bornTithi}:</Text><Text style={styles.partVal}>{kundali.particulars.bornTithi}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.bornPaksha}:</Text><Text style={styles.partVal}>{kundali.particulars.bornPaksha}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.bornNakshatra}:</Text><Text style={styles.partVal}>{kundali.particulars.bornNakshatra} (Pada {kundali.particulars.bornPada})</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.bornYoga}:</Text><Text style={styles.partVal}>{kundali.particulars.bornYoga}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.bornKarana}:</Text><Text style={styles.partVal}>{kundali.particulars.bornKarana}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.bornVaara}:</Text><Text style={styles.partVal}>{kundali.particulars.bornVaara}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.varna}:</Text><Text style={styles.partVal}>{kundali.particulars.varna}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.vashya}:</Text><Text style={styles.partVal}>{kundali.particulars.vashya}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.yoni}:</Text><Text style={styles.partVal}>{kundali.particulars.yoni}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.gana}:</Text><Text style={styles.partVal}>{kundali.particulars.gana}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.nadi}:</Text><Text style={styles.partVal}>{kundali.particulars.nadi}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.paya}:</Text><Text style={styles.partVal}>{kundali.particulars.paya}</Text></View>
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
                                      <Text style={styles.retroText}>R ({loc.retrograde})</Text>
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

                    {/* Detail Section 4: Global & Western Astrology */}
                    {activeDetailSection === 'GLOBAL' && (
                      <View style={styles.detailCard}>
                        <Text style={styles.detailCardTitle}>🌌 Global & Western Astrological Systems</Text>

                        {/* Big 3 */}
                        <View style={styles.globalCardBox}>
                          <Text style={styles.globalCardTitle}>🌟 {loc.bigThree}</Text>
                          <Text style={styles.globalItemText}>☀️ {loc.sunSign}: <Text style={styles.boldVal}>{kundali.westernNatal.sunSign}</Text> ({kundali.westernNatal.sunElement} • {kundali.westernNatal.sunModality})</Text>
                          <Text style={styles.globalItemText}>🌙 {loc.moonSign}: <Text style={styles.boldVal}>{kundali.westernNatal.moonSign}</Text></Text>
                          <Text style={styles.globalItemText}>🌅 {loc.risingSign}: <Text style={styles.boldVal}>{kundali.westernNatal.risingSign}</Text></Text>
                        </View>

                        {/* Russian Cosmogram */}
                        <View style={styles.globalCardBox}>
                          <Text style={styles.globalCardTitle}>🪆 Russian Cosmogram (Космограмма)</Text>
                          <Text style={styles.globalItemText}>🌙 Lunar Day (Лунный день): <Text style={styles.boldVal}>Day {kundali.russianCosmogram.lunarDayNumber}</Text></Text>
                          <Text style={styles.globalItemText}>✨ Symbol: <Text style={styles.boldVal}>{kundali.russianCosmogram.lunarDayMeaning}</Text></Text>
                          <Text style={styles.globalItemText}>⚡ Cosmic Ruler: <Text style={styles.boldVal}>{kundali.russianCosmogram.cosmicRuler}</Text></Text>
                        </View>

                        {/* Thai Suryayatra */}
                        <View style={styles.globalCardBox}>
                          <Text style={styles.globalCardTitle}>🛕 Thai Suryayatra (โหราศาสตร์ไทย)</Text>
                          <Text style={styles.globalItemText}>ลัคนา (Ascendant): <Text style={styles.boldVal}>{kundali.thaiSuryayatra.lakkhanaRashi}</Text></Text>
                          <Text style={styles.globalItemText}>ฤกษ์ (Naksatra): <Text style={styles.boldVal}>{kundali.thaiSuryayatra.naksatraName} (Pada {kundali.thaiSuryayatra.pada})</Text></Text>
                        </View>

                        {/* Indonesian Pawukon */}
                        <View style={styles.globalCardBox}>
                          <Text style={styles.globalCardTitle}>🌺 Indonesian Pawukon (Wariga Bali)</Text>
                          <Text style={styles.globalItemText}>Wuku Sign: <Text style={styles.boldVal}>{kundali.indonesianPawukon.wukuName}</Text> (Deity: {kundali.indonesianPawukon.wukuDeity})</Text>
                          <Text style={styles.globalItemText}>Saptawara (Day): <Text style={styles.boldVal}>{kundali.indonesianPawukon.saptawara}</Text> • Triwara: <Text style={styles.boldVal}>{kundali.indonesianPawukon.triwara}</Text></Text>
                        </View>
                      </View>
                    )}

                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {/* City Dropdown Search Modal */}
      <Modal visible={showCityDropdown} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setShowCityDropdown(false)}>
          <View style={styles.dropdownOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownModalCard}>
                <View style={styles.dropdownHeaderRow}>
                  <Text style={styles.dropdownTitle}>Select City of Birth</Text>
                  <TouchableOpacity onPress={() => setShowCityDropdown(false)} style={styles.closeBtn}>
                    <Text style={styles.closeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* City Live Search Bar */}
                <TextInput
                  style={styles.citySearchInput}
                  value={citySearchQuery}
                  onChangeText={setCitySearchQuery}
                  placeholder="🔍 Search city, state or country..."
                  placeholderTextColor={Colors.textMuted}
                />

                <ScrollView style={{ maxHeight: 350 }}>
                  {filteredCities.map(c => (
                    <TouchableOpacity
                      key={c.name}
                      style={[styles.cityListItem, city.name === c.name && styles.cityListItemActive]}
                      onPress={() => {
                        setCity(c);
                        setShowCityDropdown(false);
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.cityItemName, city.name === c.name && styles.cityItemNameActive]}>
                          {c.name} {c.hindiName ? `(${c.hindiName})` : ''}
                        </Text>
                        <Text style={styles.cityItemSub}>{c.stateCountry}</Text>
                      </View>
                      {city.name === c.name && <Text style={styles.checkIcon}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
    flex: 1,
  },
  closeBtn: {
    backgroundColor: '#F0F0F0',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
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

  // City Dropdown Styles
  dropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.maroon,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  dropdownCityName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  dropdownCitySub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  dropdownArrow: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
  },

  generateBtn: {
    backgroundColor: Colors.maroon,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
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
  chartGraphicHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chartGraphicTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
    flex: 1,
  },
  styleToggleBar: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 2,
  },
  styleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  styleBtnActive: {
    backgroundColor: Colors.maroon,
  },
  styleBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  styleBtnTextActive: {
    color: '#FFFFFF',
  },
  chartGraphicSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  diamondGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  northDiamondGrid: {
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
  northHouseBox: {
    backgroundColor: '#FFF8F0',
    borderColor: '#FFCC80',
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
    gap: 4,
  },
  detailSwitchBtn: {
    paddingHorizontal: 12,
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

  // Global Cards
  globalCardBox: {
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  globalCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 4,
  },
  globalItemText: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  boldVal: {
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },

  // Dropdown City Modal Styles
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  dropdownModalCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 16,
    elevation: 8,
  },
  dropdownHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  citySearchInput: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  cityListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cityListItemActive: {
    backgroundColor: '#FAF5EE',
  },
  cityItemName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  cityItemNameActive: {
    color: Colors.maroon,
  },
  cityItemSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  checkIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
});
