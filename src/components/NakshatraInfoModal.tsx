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
import { getNakshatraDetail } from '../constants/nakshatraDetails';

interface NakshatraInfoModalProps {
  visible: boolean;
  onClose: () => void;
  nakshatraIndex: number;
}

export const NakshatraInfoModal: React.FC<NakshatraInfoModalProps> = ({
  visible,
  onClose,
  nakshatraIndex
}) => {
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 8, (StatusBar.currentHeight || 24) + 12);

  const detail = getNakshatraDetail(nakshatraIndex);

  const getTxt = (guj: string, hin: string, eng: string) => {
    if (language === 'gu') return guj;
    if (language === 'hi') return hin;
    return eng;
  };

  const name = getTxt(detail.nameGuj, detail.nameHin, detail.nameEng);
  const symbol = getTxt(detail.symbolGuj, detail.symbolHin, detail.symbolEng);
  const deity = getTxt(detail.deityGuj, detail.deityHin, detail.deityEng);
  const lord = getTxt(detail.lordGuj, detail.lordHin, detail.lordEng);
  const yoni = getTxt(detail.yoniGuj, detail.yoniHin, detail.yoniEng);
  const tree = getTxt(detail.treeGuj, detail.treeHin, detail.treeEng);
  const rashiScope = getTxt(detail.rashiScopeGuj, detail.rashiScopeHin, detail.rashiScopeEng);
  const desc = getTxt(detail.descGuj, detail.descHin, detail.descEng);

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={[styles.modalCard, { marginTop: topPadding }]}>
          {/* Modal Top Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTag}>⭐ Nakshatra #{detail.index}</Text>
              <Text style={styles.headerName}>{name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Quick Summary Strip */}
            <View style={styles.summaryBanner}>
              <Text style={styles.summaryBannerText}>
                🪐 {getTxt('સ્વામી ગ્રહ', 'स्वामी ग्रह', 'Lord Planet')}: <Text style={styles.goldText}>{lord}</Text> • {rashiScope}
              </Text>
            </View>

            {/* Grid of Key Attributes */}
            <View style={styles.gridContainer}>
              {/* Deity */}
              <View style={styles.gridCard}>
                <Text style={styles.cardIcon}>🔱</Text>
                <Text style={styles.cardLabel}>{getTxt('ઈષ્ટ દેવતા', 'अधिष्ठाता देवता', 'Presiding Deity')}</Text>
                <Text style={styles.cardValue}>{deity}</Text>
              </View>

              {/* Symbol */}
              <View style={styles.gridCard}>
                <Text style={styles.cardIcon}>🎨</Text>
                <Text style={styles.cardLabel}>{getTxt('નક્ષત્ર પ્રતીક', 'नक्षत्र प्रतीक', 'Symbol')}</Text>
                <Text style={styles.cardValue}>{symbol}</Text>
              </View>

              {/* Yoni Animal */}
              <View style={styles.gridCard}>
                <Text style={styles.cardIcon}>🐅</Text>
                <Text style={styles.cardLabel}>{getTxt('યોનિ પ્રાણી', 'योनि प्राणी', 'Yoni Animal')}</Text>
                <Text style={styles.cardValue}>{yoni}</Text>
              </View>

              {/* Sacred Tree */}
              <View style={styles.gridCard}>
                <Text style={styles.cardIcon}>🌳</Text>
                <Text style={styles.cardLabel}>{getTxt('પવિત્ર વૃક્ષ', 'पवित्र वृक्ष', 'Sacred Tree')}</Text>
                <Text style={styles.cardValue}>{tree}</Text>
              </View>

              {/* Element / Tattva */}
              <View style={styles.gridCard}>
                <Text style={styles.cardIcon}>🔥</Text>
                <Text style={styles.cardLabel}>{getTxt('તત્વ (Tattva)', 'तत्व (Pancha Tattva)', 'Pancha Tattva')}</Text>
                <Text style={styles.cardValue}>{detail.element}</Text>
              </View>

              {/* Gana */}
              <View style={styles.gridCard}>
                <Text style={styles.cardIcon}>✨</Text>
                <Text style={styles.cardLabel}>{getTxt('ગણ (Gana)', 'गण (Nature Gana)', 'Nature Gana')}</Text>
                <Text style={styles.cardValue}>{detail.gana} Gana</Text>
              </View>
            </View>

            {/* Spiritual Meaning Description Box */}
            <View style={styles.descBox}>
              <Text style={styles.descTitle}>
                📜 {getTxt('આધ્યાત્મિક અને નક્ષત્ર રહસ્ય', 'आध्यात्मिक एवं नक्षत्र रहस्य', 'Spiritual Significance')}
              </Text>
              <Text style={styles.descText}>{desc}</Text>
            </View>
          </ScrollView>

          {/* Bottom Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.doneBtn} activeOpacity={0.8}>
            <Text style={styles.doneBtnText}>{getTxt('બંધ કરો', 'बंद करें', 'Close Details')}</Text>
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
  modalCard: {
    backgroundColor: '#FFFDF6',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
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
    fontSize: 20,
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
  summaryBanner: {
    backgroundColor: '#FFF8E7',
    borderWidth: 1,
    borderColor: '#FFE082',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16
  },
  summaryBannerText: {
    fontSize: 14,
    color: '#3E2723',
    fontWeight: '600'
  },
  goldText: {
    color: '#D84315',
    fontWeight: '800'
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2
  },
  cardIcon: {
    fontSize: 22,
    marginBottom: 4
  },
  cardLabel: {
    fontSize: 11,
    color: '#757575',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  cardValue: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '700'
  },
  descBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 4
  },
  descTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#580017',
    marginBottom: 6
  },
  descText: {
    fontSize: 13,
    color: '#424242',
    lineHeight: 19
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
