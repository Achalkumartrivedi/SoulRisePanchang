import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Colors } from '../theme/colors';
import { CityLocation, PanchangDayData } from '../types/panchang';

interface JainCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCity: CityLocation;
  panchang?: PanchangDayData;
}

interface JainFestival {
  nameGuj: string;
  dateStr: string;
  tithiGuj: string;
  significanceGuj: string;
}

const JAIN_FESTIVALS_2026: JainFestival[] = [
  {
    nameGuj: 'પ્રભુ આદીનાથ નિર્વાણ (મેરુ ત્રયોદશી)',
    dateStr: '૧૬ જાન્યુઆરી ૨૦૨૬',
    tithiGuj: 'પોષ વદ તેરસ',
    significanceGuj: 'પ્રથમ તીર્થંકર ભગવાન ઋષભદેવ (આદીનાથ) મોક્ષ કલ્યાણક.'
  },
  {
    nameGuj: 'ભગવાન મહાવીર જન્મ કલ્યાણક (મહાવીર જયંતી)',
    dateStr: '૩૧ માર્ચ ૨૦૨૬',
    tithiGuj: 'ચૈત્ર સુદ તેરસ',
    significanceGuj: '૨૪મા તીર્થંકર ભગવાન મહાવીર સ્વામીનો જન્મ કલ્યાણક મહોત્સવ.'
  },
  {
    nameGuj: 'ચૈત્રી નવપદ આયંબિલ ઓળી આરાધના',
    dateStr: '૨૪ માર્ચ - ૦૧ એપ્રિલ ૨૦૨૬',
    tithiGuj: 'ચૈત્ર સુદ સાતમ થી પૂનમ',
    significanceGuj: 'શ્રી નવપદજીના ૯ પદોની ૯ દિવસીય વિશિષ્ટ આયંબિલ તપ આરાધના.'
  },
  {
    nameGuj: 'અક્ષય તૃતીયા (વર્ષીતપ પારણા)',
    dateStr: '૧૯ એપ્રિલ ૨૦૨૬',
    tithiGuj: 'વૈશાખ સુદ ત્રીજ',
    significanceGuj: 'ભગવાન ઋષભદેવને ઇક્ષુરસ (શેરડીના રસ) નું પ્રથમ આહાર દાન.'
  },
  {
    nameGuj: 'પર્યુષણ મહાપર્વ આરંભ (શ્વેતાંબર જૈન)',
    dateStr: '૦૭ સપ્ટેમ્બર ૨૦૨૬',
    tithiGuj: 'ભાદરવા વદ અગિયારસ',
    significanceGuj: 'જૈન શાસનનું ૮ દિવસનું આત્મશુદ્ધિ અને તપ-આરાધનાનું મહાપર્વ.'
  },
  {
    nameGuj: 'સંવત્સરી ક્ષમાપના પર્વ (મિચ્છામિ દુક્કડં)',
    dateStr: '૧૪ સપ્ટેમ્બર ૨૦૨૬',
    tithiGuj: 'ભાદરવા સુદ ચોથ',
    significanceGuj: 'સંવત્સરી પ્રતિક્રમણ અને સર્વ જીવો પ્રત્યે ક્ષમાપના "મિચ્છામિ દુક્કડં".'
  },
  {
    nameGuj: 'દશલક્ષણ પર્વ (દિગંબર જૈન)',
    dateStr: '૧૫ - ૨૪ સપ્ટેમ્બર ૨૦૨૬',
    tithiGuj: 'ભાદરવા સુદ પંચમી થી ચૌદશ',
    significanceGuj: 'દસ ઉત્તમ ધર્મોની દસ દિવસીય ભક્તિ અને સાધના.'
  },
  {
    nameGuj: 'ભગવાન મહાવીર નિર્વાણ & નૂતન વર્ષ (દિવાળી)',
    dateStr: '૦૮ - ૦૯ નવેમ્બર ૨૦૨૬',
    tithiGuj: 'આસો અમાસ / કારતક સુદ એકમ',
    significanceGuj: 'ભગવાન મહાવીર સ્વામી મોક્ષ કલ્યાણક અને જૈન વીર નિર્વાણ સંવત ૨૫૫૩.'
  },
  {
    nameGuj: 'જ્ઞાન પંચમી (સૌભાગ્ય પંચમી)',
    dateStr: '૧૩ નવેમ્બર ૨૦૨૬',
    tithiGuj: 'કારતક સુદ પંચમી',
    significanceGuj: 'જ્ઞાન આરાધના, શાસ્ત્ર લેખન અને સરસ્વતી પૂજન.'
  },
  {
    nameGuj: 'કારતકી પૂનમ (ગિરનાર પંચતીર્થી યાત્રા)',
    dateStr: '૨૩ નવેમ્બર ૨૦૨૬',
    tithiGuj: 'કારતક સુદ પૂનમ',
    significanceGuj: 'શત્રુંજય અને ગિરનાર મહાતીર્થ પંચતીર્થી યાત્રા પ્રારંભ.'
  }
];

export const JainCalendarModal: React.FC<JainCalendarModalProps> = ({
  visible,
  onClose,
  selectedCity,
  panchang
}) => {
  const [activeTab, setActiveTab] = useState<'TODAY' | 'PACHKHAN' | 'FESTIVALS'>('TODAY');

  const sunriseStr = panchang?.sunMoon?.sunrise || '06:30 AM';
  const sunsetStr = panchang?.sunMoon?.sunset || '06:30 PM';

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#600000" />

        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitleGuj}>☸️ જૈન પંચાંગ અને કૅલેન્ડર</Text>
            <Text style={styles.headerSubGuj}>
              વીર નિર્વાણ સંવત ૨૫૫૧ • {selectedCity.name}
            </Text>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.8}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Navkar Mantra Banner */}
        <View style={styles.navkarCard}>
          <Text style={styles.navkarTitle}>॥ શ્રી નવકાર મંત્ર ॥</Text>
          <Text style={styles.navkarTextGuj}>
            ણમો અરિહંતાણં | ણમો સિદ્ધાણં | ણમો આયરિયાણં | ણમો ઉવજ્ઝાયાણં | ણમો લોએ સવ્વ સાહૂણં
          </Text>
          <Text style={styles.navkarSubGuj}>
            એસઓ પંચ ણમુક્કારો, સવ્વ પાપપણાસણો | મંગલાણં ચ સવ્વેસિં, પડમં હવઇ મંગલં ॥
          </Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'TODAY' && styles.tabBtnActive]}
            onPress={() => setActiveTab('TODAY')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'TODAY' && styles.tabBtnTextActive]}>
              આજનો દિવસ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'PACHKHAN' && styles.tabBtnActive]}
            onPress={() => setActiveTab('PACHKHAN')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'PACHKHAN' && styles.tabBtnTextActive]}>
              પચ્ચક્ખાણ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'FESTIVALS' && styles.tabBtnActive]}
            onPress={() => setActiveTab('FESTIVALS')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'FESTIVALS' && styles.tabBtnTextActive]}>
              જૈન પર્વ
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Body */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {activeTab === 'TODAY' && (
            <View>
              <View style={styles.sectionCard}>
                <Text style={styles.cardHeaderGuj}>📅 આજની જૈન તિથિ અને સંવત</Text>
                
                <View style={styles.gridRow}>
                  <View style={styles.gridBox}>
                    <Text style={styles.gridLabelGuj}>વીર નિર્વાણ સંવત</Text>
                    <Text style={styles.gridValGuj}>૨૫૫૧</Text>
                  </View>
                  <View style={styles.gridBox}>
                    <Text style={styles.gridLabelGuj}>વિક્રમ સંવત (જૈન)</Text>
                    <Text style={styles.gridValGuj}>{panchang?.samvat?.vikramSamvat || '૨૦૮૧'}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabelGuj}>આજની તિથિ:</Text>
                  <Text style={styles.infoValGuj}>
                    {panchang?.tithi?.hindiName || 'સુદ / વદ તિથિ'} ({panchang?.tithi?.paksha === 'SHUKLA' ? 'સુદ' : 'વદ'})
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabelGuj}>નક્ષત્ર:</Text>
                  <Text style={styles.infoValGuj}>{panchang?.nakshatra?.hindiName || 'નક્ષત્ર'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabelGuj}>જૈન માસ:</Text>
                  <Text style={styles.infoValGuj}>{panchang?.samvat?.monthName || 'કાર્તક / માગશર'}</Text>
                </View>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.cardHeaderGuj}>🌅 સૂર્યોદય અને સૂર્યાસ્ત (પચ્ચક્ખાણ)</Text>

                <View style={styles.gridRow}>
                  <View style={[styles.gridBox, { backgroundColor: '#FFF8E7' }]}>
                    <Text style={styles.gridIcon}>🌅</Text>
                    <Text style={styles.gridLabelGuj}>સૂર્યોદય (Sunrise)</Text>
                    <Text style={styles.timeValGuj}>{sunriseStr}</Text>
                  </View>

                  <View style={[styles.gridBox, { backgroundColor: '#FFF8E7' }]}>
                    <Text style={styles.gridIcon}>🌇</Text>
                    <Text style={styles.gridLabelGuj}>સૂર્યાસ્ત (Sunset)</Text>
                    <Text style={styles.timeValGuj}>{sunsetStr}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'PACHKHAN' && (
            <View style={styles.sectionCard}>
              <Text style={styles.cardHeaderGuj}>🥣 જૈન પચ્ચક્ખાણ સમયપત્રક</Text>
              
              <View style={styles.pachkhanRow}>
                <Text style={{ fontSize: 22 }}>🥛</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pachkhanTitleGuj}>નવકારશી (Navkarshi)</Text>
                  <Text style={styles.pachkhanDescGuj}>સૂર્યોદયના ૪૮ મિનિટ પછી</Text>
                </View>
                <Text style={styles.pachkhanTimeGuj}>૦૭:૧૮ AM</Text>
              </View>

              <View style={styles.pachkhanRow}>
                <Text style={{ fontSize: 22 }}>🍵</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pachkhanTitleGuj}>પોરસી (Porsi)</Text>
                  <Text style={styles.pachkhanDescGuj}>સૂર્યોદયના ૧ કલાક ૪૪ મિનિટ પછી</Text>
                </View>
                <Text style={styles.pachkhanTimeGuj}>૦૮:૧૪ AM</Text>
              </View>

              <View style={styles.pachkhanRow}>
                <Text style={{ fontSize: 22 }}>🌇</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pachkhanTitleGuj}>ચૌવિહાર (Chauvihari Sunset)</Text>
                  <Text style={styles.pachkhanDescGuj}>સૂર્યાસ્ત પૂર્વે ચાર આહાર ત્યાગ</Text>
                </View>
                <Text style={styles.pachkhanTimeGuj}>૦૬:૨૨ PM</Text>
              </View>
            </View>
          )}

          {activeTab === 'FESTIVALS' && (
            <View>
              <Text style={styles.sectionTitleGuj}>🎉 ૨૦૨૬ જૈન તહેવારો અને પર્વ કૅલેન્ડર</Text>
              {JAIN_FESTIVALS_2026.map((item, index) => (
                <View key={index} style={styles.festivalCard}>
                  <View style={styles.festivalTopRow}>
                    <Text style={styles.festivalNameGuj}>☸️ {item.nameGuj}</Text>
                    <Text style={styles.festivalDateGuj}>{item.dateStr}</Text>
                  </View>
                  <Text style={styles.festivalTithiGuj}>તિથિ: {item.tithiGuj}</Text>
                  <Text style={styles.festivalSignificGuj}>{item.significanceGuj}</Text>
                </View>
              ))}
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7'
  },
  headerBar: {
    backgroundColor: '#600000',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitleGuj: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFE082'
  },
  headerSubGuj: {
    fontSize: 12,
    color: '#FFECB3',
    marginTop: 2
  },
  closeBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16
  },
  navkarCard: {
    backgroundColor: '#FFF8E7',
    borderWidth: 1.5,
    borderColor: '#FFE082',
    margin: 12,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  navkarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#800000',
    marginBottom: 6
  },
  navkarTextGuj: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#500000',
    textAlign: 'center',
    lineHeight: 20
  },
  navkarSubGuj: {
    fontSize: 11,
    color: '#8C6D00',
    textAlign: 'center',
    marginTop: 6
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFEBE9',
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8
  },
  tabBtnActive: {
    backgroundColor: '#800000'
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5D4037'
  },
  tabBtnTextActive: {
    color: '#FFE082'
  },
  scrollContent: {
    padding: 12
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E0D0C0'
  },
  cardHeaderGuj: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#800000',
    marginBottom: 10
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4
  },
  gridBox: {
    flex: 1,
    backgroundColor: '#FAF5EE',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  gridIcon: {
    fontSize: 20,
    marginBottom: 4
  },
  gridLabelGuj: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600'
  },
  gridValGuj: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#800000',
    marginTop: 2
  },
  timeValGuj: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 2
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  infoLabelGuj: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600'
  },
  infoValGuj: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#800000'
  },
  pachkhanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10
  },
  pachkhanTitleGuj: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#800000'
  },
  pachkhanDescGuj: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2
  },
  pachkhanTimeGuj: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  sectionTitleGuj: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#800000',
    marginBottom: 10,
    marginTop: 4
  },
  festivalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8D8C8'
  },
  festivalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  festivalNameGuj: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#800000',
    flex: 1,
    marginRight: 8
  },
  festivalDateGuj: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#E65100',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  festivalTithiGuj: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginTop: 4
  },
  festivalSignificGuj: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 16
  }
});
