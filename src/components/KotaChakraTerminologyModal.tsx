import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';

interface KotaChakraTerminologyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const KotaChakraTerminologyModal: React.FC<KotaChakraTerminologyModalProps> = ({
  visible,
  onClose
}) => {
  const { language } = useLanguage();

  const getTxt = (guj: string, hin: string, eng: string) => {
    if (language === 'gu') return guj;
    if (language === 'hi') return hin;
    return eng;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>
              📖 {getTxt('કોટા ચક્ર શબ્દાવલી', 'कोटा चक्र शब्दावली', 'Kota Chakra Terminologies')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.bodyScroll} showsVerticalScrollIndicator={false}>
            {/* 1. Kota Swami Card */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>
                  👑 {getTxt('કોટા સ્વામી (દુર્ગાપતિ)', 'कोटा स्वामी (दुर्गापति)', 'Kota Swami (Durgapati)')}
                </Text>
              </View>

              <Text style={styles.bulletText}>
                • {getTxt(
                  'કોટા સ્વામી ને દુર્ગાપતિ (કિલ્લાના રાજા) પણ કહેવામાં આવે છે. તેનો શાબ્દિક અર્થ કિલ્લાનો સ્વામી છે.',
                  'कोटा स्वामी को दुर्गापति भी कहा जाता है। इसका शाब्दिक अर्थ दुर्ग का स्वामी (राजा) है।',
                  'Kota Swami is also referred to as Durgapati. It literally means Lord of the Fort.'
                )}
              </Text>

              <Text style={styles.bulletText}>
                • {getTxt(
                  'કોટા સ્વામી એટલે જન્મ કુંડળીમાં ચંદ્ર જે રાશિમાં સ્થિત હોય તે રાશિનો સ્વામી ગ્રહ (રાશ્યાધિપતિ).',
                  'कोटा स्वामी जन्म कुंडली में चंद्रमा जिस राशि में स्थित होता है, उस राशि का स्वामी ग्रह होता है।',
                  'Kota Swami is simply the Lord of the Rashi in which the natal Moon is posited.'
                )}
              </Text>

              <View style={styles.exampleBox}>
                <Text style={styles.exampleText}>
                  💡 {getTxt(
                    'ઉદાહરણ: જો જન્મ ચંદ્ર મેષ રાશિમાં હોય, તો મેષનો સ્વામી મંગળ (Mars) કોટા સ્વામી બનશે.',
                    'उदाहरण: यदि जन्म चंद्रमा मेष राशि में है, तो मेष का स्वामी मंगल (Mars) कोटा स्वामी बनेगा।',
                    'Example: If birth Moon is in Aries, Mars (Rashi Lord) becomes your Kota Swami.'
                  )}
                </Text>
              </View>
            </View>

            {/* 2. Kota Paala Card */}
            <View style={[styles.sectionCard, { marginTop: 12 }]}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>
                  🛡️ {getTxt('કોટા પાલ (કિલ્લાનો રક્ષક)', 'कोटा पाल (दुर्ग रक्षक)', 'Kota Paala (Guard of the Fort)')}
                </Text>
              </View>

              <Text style={styles.bulletText}>
                • {getTxt(
                  'કોટા પાલ નો શાબ્દિક અર્થ કિલ્લાનો રક્ષક (પ્રહરી) થાય છે. પાલ નો અર્થ સંભાળ અને રક્ષણ કરનાર છે.',
                  'कोटा पाल का शाब्दिक अर्थ दुर्ग का रक्षक (प्रहरी) है। पाल का अर्थ रक्षा और देखभाल करने वाला है।',
                  'Kota Paala literally means Guard of the Fort. Paala also signifies one who tends and cares.'
                )}
              </Text>

              <Text style={styles.bulletText}>
                • {getTxt(
                  'કોટા પાલ એટલે આવ કહડગ ચક્ર મુજબ જન્મ નક્ષત્ર અથવા પદનો સ્વામી ગ્રહ (નક્ષત્રાધિપતિ).',
                  'कोटा पाल आवकहडग चक्र के अनुसार जन्म नक्षत्र या पद का स्वामी ग्रह होता है।',
                  'Kota Paala is the lord of Pada / Janma Nakshatra as per Avakahada Chakra.'
                )}
              </Text>

              <View style={styles.exampleBox}>
                <Text style={styles.exampleText}>
                  💡 {getTxt(
                    'ઉદાહરણ: કૃત્તિકા નક્ષત્રનો સ્વામી સૂર્ય (Sun) હોવાથી કૃત્તિકા જાતકો માટે સૂર્ય કોટા પાલ બનશે.',
                    'उदाहरण: कृत्तिका नक्षत्र का स्वामी सूर्य (Sun) होने से कृत्तिका जातकों के लिए सूर्य कोटा पाल बनेगा।',
                    'Example: Since Krittika Nakshatra is ruled by Sun, Sun becomes your Kota Paala.'
                  )}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Button */}
          <TouchableOpacity style={styles.bottomCloseBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.bottomCloseBtnText}>
              {getTxt('સમજાઈ ગયું', 'समझ गया', 'Got It')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  modalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFDF5',
    borderRadius: 16,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#FFD700'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#FFE082'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4A0012',
    flex: 1
  },
  closeBtn: {
    padding: 4
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#8D6E63'
  },
  bodyScroll: {
    paddingVertical: 12
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
    elevation: 1
  },
  cardHeaderRow: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF8E1',
    paddingBottom: 4
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5D4037'
  },
  bulletText: {
    fontSize: 12,
    color: '#37474F',
    lineHeight: 18,
    marginBottom: 6,
    fontWeight: '600'
  },
  exampleBox: {
    backgroundColor: '#FFFDE7',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#FFF59D'
  },
  exampleText: {
    fontSize: 11.5,
    color: '#E65100',
    fontWeight: '700',
    lineHeight: 16
  },
  bottomCloseBtn: {
    backgroundColor: '#4A0012',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10
  },
  bottomCloseBtnText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '800'
  }
});
