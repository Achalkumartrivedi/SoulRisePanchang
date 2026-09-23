import React from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';

interface KotaChakraInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export const KotaChakraInfoModal: React.FC<KotaChakraInfoModalProps> = ({
  visible,
  onClose
}) => {
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 8, (StatusBar.currentHeight || 24) + 12);

  const getTxt = (guj: string, hin: string, eng: string) => {
    if (language === 'gu') return guj;
    if (language === 'hi') return hin;
    return eng;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={[styles.modalContainer, { marginTop: topPadding }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTag}>📖 Vedic Astrology Guide</Text>
              <Text style={styles.headerName}>
                🏰 {getTxt('કોટા ચક્ર શું છે અને જીવન પર પ્રભાવ', 'कोटा चक्र क्या है और जीवन पर प्रभाव', 'What is Kota Chakra & Life Effects')}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Section 1: Executive Summary & Overview */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>
                🏰 1. {getTxt('કોટા ચક્ર શું છે?', 'कोटा चक्र क्या है?', 'What is Kota Chakra?')}
              </Text>
              <Text style={styles.paragraph}>
                {getTxt(
                  'કોટા ચક્ર એ વૈદિક જ્યોતિષશાસ્ત્રનું એક વિશેષ ગોચર ચાર્ટ છે જે ૨૭/૨૮ નક્ષત્રોને કિલ્લાના ૪ સમકેન્દ્રિત વલયોમાં ગોઠવે છે: સ્તંભ (કેન્દ્ર), દુર્ગાંતર (આંતરિક), પ્રાકાર (દીવાલ) અને બાહ્ય (બહારનો વિસ્તાર).',
                  'कोटा चक्र वैदिक ज्योतिष का एक विशिष्ट गोचर चार्ट है जो २७/२८ नक्षत्रों को दुर्ग की ४ संकेंद्री परतों में व्यवस्थित करता है: स्तंभ (केंद्र), दुर्गांतर (आंतरिक), प्राकार (दीवार) और बाह्य (बाहरी क्षेत्र)।',
                  'Kota Chakra is a specialized Vedic astrology transit chart overlay that arranges lunar nakshatras into four concentric fort layers: Stambha (Center Core), Durgantara (Inner Fort), Prakara (Outer Wall), and Bahya (Outside Territory).'
                )}
              </Text>
            </View>

            {/* Section 2: Center Zone vs Natal Kendras */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>
                🎯 2. {getTxt('કોટા કેન્દ્ર અને જન્મ કેન્દ્ર (Kendras) વચ્ચેનો તફાવત', 'कोटा केंद्र एवं जन्म केंद्र (Kendras) में अंतर', 'Kota Center vs Natal Kendras')}
              </Text>
              <Text style={styles.paragraph}>
                {getTxt(
                  '• કોટા કેન્દ્ર (સ્તંભ): જન્મ નક્ષત્ર પર આધારિત ગોચર આધારિત આંતરિક કિલ્લો છે.\n• જન્મ કુંડળી કેન્દ્ર (૧-૪-૭-૧૦ ભાવ): લગ્ન કુંડળી અને નવમાંશના સ્થાયી સ્તંભ છે.\nજ્યારે ક્રૂર ગ્રહો કોટા ચક્રના સ્તંભમાં પ્રવેશ કરે છે ત્યારે તે આકસ્મિક કટોકટી અને સંકટનું કારણ બને છે.',
                  '• कोटा केंद्र (स्तंभ): चंद्र जन्म नक्षत्र पर आधारित गोचर चक्र का हृदय है।\n• जन्म कुंडली केंद्र (१-४-७-१० भाव): कुंडली और नवमांश के स्थायी स्तंभ हैं।\nजब क्रूर ग्रह स्तंभ में प्रवेश करते हैं, तो यह अचानक स्वास्थ्य या करियर संकट पैदा करते हैं।',
                  '• Kota Center (Stambha): Dynamic transit core centered around your Moon Janma Nakshatra.\n• Natal Kendras (1st, 4th, 7th, 10th houses): Fixed structural pillars of Rasi and Navamsha charts.\nWhen malefic transits invade Stambha, they trigger sudden vulnerability regardless of general natal strength.'
                )}
              </Text>
            </View>

            {/* Section 3: Malefics vs Benefics */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>
                🛡️ 3. {getTxt('ક્રૂર ગ્રહો અને શુભ ગ્રહોનો પ્રભાવ', 'क्रूर ग्रह एवं शुभ ग्रहों का प्रभाव', 'Malefics vs Benefics in Kota')}
              </Text>

              <View style={styles.bulletBox}>
                <Text style={styles.bulletTitle}>🔴 {getTxt('ક્રૂર ગ્રહો (Malefics)', 'क्रूर ग्रह (Malefics)', 'Malefic Planets')}:</Text>
                <Text style={styles.bulletText}>
                  {getTxt(
                    'શનિ, મંગળ, રાહુ, કેતુ, સૂર્ય અને ૬, ૮, ૧૨ ઘરના સ્વામી (ફંક્શનલ મેલેફિક). જ્યારે આ ગ્રહો સ્તંભ/દુર્ગાંતરમાં પ્રવેશે છે (Pravesha), ત્યારે રોગ, અકસ્માત, વિવાદ કે નાણાકીય નુકસાન આપે છે. વક્રી (Retrograde) ગ્રહ કિલ્લામાં લાંબો સમય રોકાઈને વધુ સંકટ ઊભું કરે છે.',
                    'शनि, मंगल, राहु, केतु, सूर्य एवं ६, ८, १२वें घर के स्वामी। जब ये स्तंभ/दुर्गांतर में प्रवेश (Pravesha) करते हैं, तो बीमारी, दुर्घटना, मुकदमेबाजी या व्यापार हानि देते हैं। वक्री ग्रह लंबे समय तक रुककर संकट बढ़ाता है।',
                    'Saturn, Mars, Rahu, Ketu, Sun & Functional Malefics (Lords of 6th, 8th, 12th). Entering (Pravesha) Stambha/Durgantara triggers illness, litigation, or financial loss. Retrograde malefics linger longer and exacerbate danger.'
                  )}
                </Text>
              </View>

              <View style={[styles.bulletBox, { backgroundColor: '#E8F5E9', borderColor: '#81C784' }]}>
                <Text style={[styles.bulletTitle, { color: '#2E7D32' }]}>🟢 {getTxt('શુભ ગ્રહો (Benefics)', 'शुभ ग्रह (Benefics)', 'Benefic Planets')}:</Text>
                <Text style={styles.bulletText}>
                  {getTxt(
                    'ગુરુ, શુક્ર, બુધ, કોટા સ્વામી અને કોટા પાલ કિલ્લાની રક્ષા કરે છે અને સંકટમાંથી બચાવે છે.',
                    'गुरु, शुक्र, बुध, कोटा स्वामी एवं कोटा पाल दुर्ग की रक्षा करते हैं और बड़े संकट से बचाते हैं।',
                    'Jupiter, Venus, Mercury, Kota Swami, and Kota Pala act as divine shields, mitigating malefic afflictions and preserving stability.'
                  )}
                </Text>
              </View>
            </View>

            {/* Section 4: Documented Outcomes */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>
                📈 4. {getTxt('જીવન પર શાસ્ત્રીય અને પ્રત્યક્ષ પ્રભાવ', 'जीवन पर शास्त्रीय एवं प्रत्यक्ष प्रभाव', 'Documented Life Outcomes')}
              </Text>
              <Text style={styles.paragraph}>
                {getTxt(
                  '• 🟢 કલ્યાણકારી (Auspicious): ગુરુ/શુક્રના ગોચરથી સ્તંભ સુરક્ષિત રહેતા આરોગ્ય, પદ અને ધન લાભ થાય છે.\n• 🟠 મિશ્ર (Mixed): ક્રૂર ગ્રહ બાહ્ય ક્ષેત્ર તરફ બહાર નીકળતા (Nirgamma) રાહત મળે છે.\n• 🔴 અશુભ (Inauspicious): ૨ કે તેથી વધુ ક્રૂર ગ્રહો સ્તંભમાં પ્રવેશે તો આકસ્મિક રોગ, કાનૂની સંકટ, પદભ્રષ્ટતા કે ધનહાનિ થાય છે.',
                  '• 🟢 शुभ (Auspicious): गुरु/शुक्र के गोचर से स्तंभ सुरक्षित रहने पर स्वास्थ्य, पद एवं धन लाभ होता है।\n• 🟠 मिश्रित (Mixed): क्रूर ग्रह बाह्य क्षेत्र की ओर निकलने (Nirgamma) पर राहत मिलती है।\n• 🔴 अशुभ (Inauspicious): २ या अधिक क्रूर ग्रह स्तंभ में प्रवेश करें तो अचानक बीमारी, कानूनी संकट, पदहानि या व्यापार घाटा होता है।',
                  '• 🟢 Auspicious: Benefics in Stambha grant health, promotion, and financial growth.\n• 🟠 Mixed: Malefics exiting (Nirgamma) into Bahya bring steady relief.\n• 🔴 Inauspicious: 2+ Malefics invading Stambha precipitate health distress, legal battles, job loss, or financial failure.'
                )}
              </Text>
            </View>

            {/* Section 5: Sources */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>
                📜 5. {getTxt('પ્રમાણભૂત ગ્રંથો અને સ્રોત', 'प्रमाणिक ग्रंथ एवं स्रोत', 'Classical & Modern Sources')}
              </Text>
              <Text style={styles.sourcesText}>
                • Maharshi Parashara (Brihat Parashara Hora Shastra - BPHS){'\n'}
                • Classical Vyavastha Astrology Archives{'\n'}
                • Contemporary Research by M. Imran & Nitin Sharma (Vedic Astrology Journal)
              </Text>
            </View>
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.doneBtn} activeOpacity={0.8}>
            <Text style={styles.doneBtnText}>{getTxt('સમજાઈ ગયું', 'समझ आ गया', 'Got It')}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: '#FFFDF6',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '92%',
    paddingBottom: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#580017',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  headerTitleBox: {
    flex: 1
  },
  headerTag: {
    fontSize: 11,
    color: '#FFD700',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  headerName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '800',
    marginTop: 2
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  scrollBody: {
    padding: 16
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    elevation: 1
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#580017',
    marginBottom: 8
  },
  paragraph: {
    fontSize: 13,
    color: '#424242',
    lineHeight: 19
  },
  bulletBox: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#EF9A9A',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8
  },
  bulletTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#C62828',
    marginBottom: 4
  },
  bulletText: {
    fontSize: 12,
    color: '#37474F',
    lineHeight: 17
  },
  sourcesText: {
    fontSize: 12,
    color: '#616161',
    lineHeight: 18,
    fontStyle: 'italic'
  },
  doneBtn: {
    backgroundColor: '#580017',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center'
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  }
});
