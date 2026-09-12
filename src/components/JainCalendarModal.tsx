import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Switch,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { CityLocation, PanchangDayData, ChoghadiyaItem, MuhuratTiming } from '../types/panchang';
import { getStoredReminders, saveReminder, toggleReminderState, deleteReminder } from '../engine/reminderStorage';
import { ReminderItem } from '../types/reminder';
import { TimePickerModal } from './TimePickerModal';
import { calculateChoghadiya, calculateMuhurats } from '../engine/muhuratCalculator';
import { getJainDayData } from '../engine/jainCalendarEngine';
import { calculatePanchang } from '../engine/panchangEngine';

// Vector SVG Component for Sacred Jain Prateek Chinha (Jain Universe, Swastika, Ahimsa Hand)
export const JainPrateekIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = '#FFE082'
}) => {
  const width = size;
  const height = size * 1.5;
  return (
    <Svg width={width} height={height} viewBox="0 0 100 150">
      <G stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Outer Universe / Loka Outline */}
        <Path d="M 28 12 L 72 12 L 86 45 L 65 75 L 88 138 L 12 138 L 35 75 L 14 45 Z" />

        {/* Top Crescent Arc & Siddha Shila Dot */}
        <Path d="M 32 26 Q 50 36 68 26" strokeWidth="4.5" />
        <Circle cx="50" cy="18" r="4" fill={color} stroke="none" />

        {/* Three Dots (Ratnatraya) */}
        <Circle cx="35" cy="42" r="3.5" fill={color} stroke="none" />
        <Circle cx="50" cy="42" r="3.5" fill={color} stroke="none" />
        <Circle cx="65" cy="42" r="3.5" fill={color} stroke="none" />

        {/* Swastika */}
        <Path d="M 50 50 L 50 68 M 50 50 L 60 50 M 50 68 L 40 68 M 40 59 L 60 59 M 40 59 L 40 50 M 60 59 L 60 68" strokeWidth="4" />

        {/* Ahimsa Hand Palm (Abhaya Mudra) */}
        <Path d="M 40 100 L 40 85 Q 40 81 43 81 Q 46 81 46 85 L 46 100 M 46 100 L 46 80 Q 46 76 49 76 Q 52 76 52 80 L 52 100 M 52 100 L 52 83 Q 52 79 55 79 Q 58 79 58 83 L 58 100 M 58 100 Q 62 98 65 103 Q 66 108 62 112 L 57 116 M 40 100 L 35 108 Q 33 116 36 123 Q 42 133 50 133 Q 58 133 62 123 L 62 112" strokeWidth="3" />

        {/* 24-spoke Ahimsa Wheel on Palm */}
        <Circle cx="49" cy="118" r="9" strokeWidth="2.5" />
        <Circle cx="49" cy="118" r="3" fill={color} stroke="none" />
      </G>
    </Svg>
  );
};

interface JainCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCity: CityLocation;
  panchang?: PanchangDayData;
}

type JainLang = 'GUJARATI' | 'HINDI' | 'HINGLISH';
type TabType = 'PANCHANG' | 'PACHKHAN' | 'MUHURAT' | 'VIDHI' | 'FESTIVALS' | 'REMINDERS';

interface JainFestival {
  id: string;
  nameGuj: string;
  nameHin: string;
  nameHing: string;
  dateStrGuj: string;
  dateStrHin: string;
  dateStrHing: string;
  startDateIso: string;
  endDateIso: string;
  tithiGuj: string;
  tithiHin: string;
  tithiHing: string;
  significanceGuj: string;
  significanceHin: string;
  significanceHing: string;
}

export interface JainPachkhanVow {
  id: string;
  nameGuj: string;
  nameHin: string;
  nameHing: string;
  categoryGuj: string;
  categoryHin: string;
  categoryHing: string;
  releaseTimeGuj: string;
  releaseTimeHin: string;
  releaseTimeHing: string;
  durationGuj: string;
  durationHin: string;
  durationHing: string;
  descGuj: string;
  descHin: string;
  descHing: string;
  sutraPrakrit: string;
  sutraGuj: string;
  sutraHin: string;
  sutraHing: string;
}

const JAIN_FESTIVALS_FULL: JainFestival[] = [
  {
    id: 'jain_fest_paryushan_2026',
    nameGuj: 'પર્યુષણ મહાપર્વ અને સંવત્સરી',
    nameHin: 'पर्युषण महापर्व एवं संवत्सरी',
    nameHing: 'Paryushan Mahaparva & Samvatsari',
    dateStrGuj: '૦૭ સપ્ટેમ્બર - ૧૪ સપ્ટેમ્બર ૨૦૨૬',
    dateStrHin: '०७ सितंबर - १४ सितंबर २०२६',
    dateStrHing: '07 Sept - 14 Sept 2026',
    startDateIso: '2026-09-07',
    endDateIso: '2026-09-14',
    tithiGuj: 'ભાદરવા વદ અગિયારસ થી સુદ ચોથ',
    tithiHin: 'भाद्रपद कृष्ण एकादशी से शुक्ल चतुर्थी',
    tithiHing: 'Bhadrapad Krishna Ekadashi to Shukla Chaturthi',
    significanceGuj: 'જૈન શાસનનું ૮ દિવસનું આત્મશુદ્ધિ, ક્ષમાપના "મિચ્છામિ દુક્કડં" અને તપ-આરાધનાનું મહાપર્વ.',
    significanceHin: 'जैन धर्म का ८ दिवसीय आत्मशुद्धि, क्षमापना "मिच्छामि दुक्कड़ं" एवं तप-आराधना का महापर्व।',
    significanceHing: '8-day holiest Jain festival of self-purification, fasting, and Michhami Dukkadam forgiveness.'
  },
  {
    id: 'jain_fest_dashlakshan_2026',
    nameGuj: 'દશલક્ષણ પર્વ (દિગંબર જૈન)',
    nameHin: 'दशलक्षण पर्व (दिगंबर जैन)',
    nameHing: 'Dashalakshana Parva (Digambar)',
    dateStrGuj: '૧૫ સપ્ટેમ્બર - ૨૪ સપ્ટેમ્બર ૨૦૨૬',
    dateStrHin: '१५ सितंबर - २४ सितंबर २०२६',
    dateStrHing: '15 Sept - 24 Sept 2026',
    startDateIso: '2026-09-15',
    endDateIso: '2026-09-24',
    tithiGuj: 'ભાદરવા સુદ પંચમી થી ચૌદશ',
    tithiHin: 'भाद्रपद शुक्ल पंचमी से चतुर्दशी',
    tithiHing: 'Bhadrapad Shukla Panchami to Chaturdashi',
    significanceGuj: 'દસ ઉત્તમ ધર્મોની દસ દિવસીય ભક્તિ અને દશલક્ષણ સાધના.',
    significanceHin: 'दस उत्तम धर्मों की दस दिवसीय भक्ति एवं दशलक्षण साधना।',
    significanceHing: '10-day Digambar festival honoring the 10 Supreme Virtues.'
  },
  {
    id: 'jain_fest_oli_ashvin_2026',
    nameGuj: 'આસો આયંબિલ ઓળી મહાપર્વ',
    nameHin: 'आश्विन आयंबिल ओली महापर्व',
    nameHing: 'Ashvin Ayambil Oli Mahaparva',
    dateStrGuj: '૧૭ ઓક્ટોબર - ૨૫ ઓક્ટોબર ૨૦૨૬',
    dateStrHin: '१७ अक्टूबर - २५ अक्टूबर २०२६',
    dateStrHing: '17 Oct - 25 Oct 2026',
    startDateIso: '2026-10-17',
    endDateIso: '2026-10-25',
    tithiGuj: 'આસો સુદ સાતમ થી પૂનમ',
    tithiHin: 'आश्विन शुक्ल सप्तमी से पूर्णिमा',
    tithiHing: 'Ashvin Shukla Saptami to Purnima',
    significanceGuj: 'નવપદ અરાધના ૯ દિવસીય આયંબિલ તપ મહોત્સવ.',
    significanceHin: 'नवपद आराधना ९ दिवसीय आयंबिल तप महोत्सव।',
    significanceHing: '9-day sacred fasting festival dedicated to Navpad (The 9 Supreme Entities).'
  },
  {
    id: 'jain_fest_diwali_nirvana_2026',
    nameGuj: 'ભગવાન મહાવીર નિર્વાણ & દિવાળી',
    nameHin: 'भगवान महावीर निर्वाण एवं दिवाली',
    nameHing: 'Bhagwan Mahavir Nirvana & Diwali',
    dateStrGuj: '૦૮ નવેમ્બર - ૦૯ નવેમ્બર ૨૦૨૬',
    dateStrHin: '०८ नवंबर - ०९ नवंबर २०२६',
    dateStrHing: '08 Nov - 09 Nov 2026',
    startDateIso: '2026-11-08',
    endDateIso: '2026-11-09',
    tithiGuj: 'આસો અમાસ / કારતક સુદ એકમ',
    tithiHin: 'कार्तिक अमावस्या / प्रतिपदा',
    tithiHing: 'Ashvin Amavasya / Kartik Pratipada',
    significanceGuj: 'ભગવાન મહાવીર સ્વામી મોક્ષ કલ્યાણક અને વીર નિર્વાણ સંવત ૨૫૫૩ પ્રારંભ.',
    significanceHin: 'भगवान महावीर स्वामी मोक्ष कल्याणक एवं वीर निर्वाण संवत २५५३ प्रारंभ।',
    significanceHing: 'Moksha Kalyanak of Lord Mahavira and commencement of New Jain Era.'
  },
  {
    id: 'jain_fest_nutan_varsh_2026',
    nameGuj: 'ગૌતમ સ્વામી કેવળજ્ઞાન & નૂતન વર્ષ',
    nameHin: 'गौतम स्वामी केवलज्ञान एवं नूतन वर्ष',
    nameHing: 'Gautam Swami Kevaljnana & Nutan Varsh',
    dateStrGuj: '૧૦ નવેમ્બર ૨૦૨૬',
    dateStrHin: '१० नवंबर २०२६',
    dateStrHing: '10 Nov 2026',
    startDateIso: '2026-11-10',
    endDateIso: '2026-11-10',
    tithiGuj: 'કારતક સુદ એકમ',
    tithiHin: 'कार्तिक शुक्ल प्रतिपदा',
    tithiHing: 'Kartik Shukla Pratipada',
    significanceGuj: 'પ્રથમ ગણધર શ્રી ગૌતમ સ્વામી કેવળજ્ઞાન મહોત્સવ અને જૈન નવું વર્ષ.',
    significanceHin: 'प्रथम गणधर श्री गौतम स्वामी केवलज्ञान महोत्सव एवं जैन नया वर्ष।',
    significanceHing: 'Celebration of Gautam Swami Kevaljnana and Jain New Year.'
  },
  {
    id: 'jain_fest_kartik_poornima_2026',
    nameGuj: 'કારતક પૂનમ & ચતુર્માસ સમાપન (દેવ દિવાળી)',
    nameHin: 'कार्तिक पूर्णिमा एवं चतुर्मास समापन (देव दिवाली)',
    nameHing: 'Kartik Poornima & Chaturmas Samapan',
    dateStrGuj: '૨૪ નવેમ્બર ૨૦૨૬',
    dateStrHin: '२४ नवंबर २०२६',
    dateStrHing: '24 Nov 2026',
    startDateIso: '2026-11-24',
    endDateIso: '2026-11-24',
    tithiGuj: 'કારતક સુદ પૂનમ',
    tithiHin: 'कार्तिक शुक्ल पूर्णिमा',
    tithiHing: 'Kartik Shukla Purnima',
    significanceGuj: 'શત્રુંજય ગિરિરાજ યાત્રા પ્રારંભ અને ૪ મહિનાના ચતુર્માસનું મંગલ સમાપન.',
    significanceHin: 'शत्रुंजय गिरिराज यात्रा प्रारंभ एवं ४ मास के चतुर्मास का मंगल समापन।',
    significanceHing: 'Opening of Shatrunjaya Giriraj Yatra and conclusion of Chaturmas.'
  },
  {
    id: 'jain_fest_maun_ekadashi_2026',
    nameGuj: 'મૌન અગિયારસ (મૌન એકાદશી)',
    nameHin: 'मौन एकादशी (मौन ग्यारस)',
    nameHing: 'Maun Ekadashi',
    dateStrGuj: '૨૦ ડિસેમ્બર ૨૦૨૬',
    dateStrHin: '२० दिसंबर २०२६',
    dateStrHing: '20 Dec 2026',
    startDateIso: '2026-12-20',
    endDateIso: '2026-12-20',
    tithiGuj: 'માગશર સુદ અગિયારસ',
    tithiHin: 'मार्गशीर्ष शुक्ल एकादशी',
    tithiHing: 'Margashirsha Shukla Ekadashi',
    significanceGuj: '૧૫૦ તીર્થંકર કલ્યાણક મૌન વ્રત અને શાંત જપ સાધના દિવસ.',
    significanceHin: '१५० तीर्थंकर कल्याणक मौन व्रत एवं शांत जप साधना दिवस।',
    significanceHing: 'Holiest silent fasting day commemorating 150 Kalyanakas of Tirthankaras.'
  },
  {
    id: 'jain_fest_paush_dashami_2027',
    nameGuj: 'પૌષ દશમી (શ્રી પાર્શ્વનાથ ભગવાન જન્મ કલ્યાણક)',
    nameHin: 'पौष दशमी (श्री पार्श्वनाथ भगवान जन्म कल्याणक)',
    nameHing: 'Paush Dashami (Parshvanath Kalyanak)',
    dateStrGuj: '૦૩ જાન્યુઆરી ૨૦૨૭',
    dateStrHin: '०३ जनवरी २०२७',
    dateStrHing: '03 Jan 2027',
    startDateIso: '2027-01-03',
    endDateIso: '2027-01-03',
    tithiGuj: 'પૌષ વદ દશમ',
    tithiHin: 'पौष कृष्ण दशमी',
    tithiHing: 'Pausha Krishna Dashami',
    significanceGuj: '૨૩મા તીર્થંકર ભગવાન પાર્શ્વનાથ સ્વામી જન્મ અને દીક્ષા કલ્યાણક મહોત્સવ.',
    significanceHin: '२३वें तीर्थंकर भगवान पार्श्वनाथ स्वामी जन्म एवं दीक्षा कल्याणक महोत्सव।',
    significanceHing: 'Janma and Diksha Kalyanak of 23rd Tirthankara Lord Parshvanatha.'
  },
  {
    id: 'jain_fest_mahavir_jayanti_2027',
    nameGuj: 'ભગવાન મહાવીર જન્મ કલ્યાણક (મહાવીર જયંતી ૨૦૨૭)',
    nameHin: 'भगवान महावीर जन्म कल्याणक (महावीर जयंती २०२७)',
    nameHing: 'Bhagwan Mahavir Janma Kalyanak 2027',
    dateStrGuj: '૨૦ એપ્રિલ ૨૦૨૭',
    dateStrHin: '२० अप्रैल २०२७',
    dateStrHing: '20 April 2027',
    startDateIso: '2027-04-20',
    endDateIso: '2027-04-20',
    tithiGuj: 'ચૈત્ર સુદ તેરસ',
    tithiHin: 'चैत्र शुक्ल त्रयोदशी',
    tithiHing: 'Chaitra Shukla Trayodashi',
    significanceGuj: '૨૪મા તીર્થંકર ભગવાન મહાવીર સ્વામીનો જન્મ કલ્યાણક મહોત્સવ.',
    significanceHin: '२४वें तीर्थंकर भगवान महावीर स्वामी का जन्म कल्याणक महोत्सव।',
    significanceHing: 'Grand birthday celebration of 24th Tirthankara Lord Mahavira.'
  },
  {
    id: 'jain_fest_akshaya_tritiya_2027',
    nameGuj: 'અક્ષય તૃતીયા (વર્ષીતપ પારણા ૨૦૨૭)',
    nameHin: 'अक्षय तृतीया (वर्षी तप पारणा २०२७)',
    nameHing: 'Akshaya Tritiya (Varshitap Parna 2027)',
    dateStrGuj: '૦૯ મે ૨૦૨૭',
    dateStrHin: '૦૯ मई २०२७',
    dateStrHing: '09 May 2027',
    startDateIso: '2027-05-09',
    endDateIso: '2027-05-09',
    tithiGuj: 'વૈશાખ સુદ ત્રીજ',
    tithiHin: 'वैशाख शुक्ल तृतीया',
    tithiHing: 'Vaishakha Shukla Tritiya',
    significanceGuj: 'ભગવાન ઋષભદેવને ઇક્ષુરસ (શેરડીના રસ) નું પ્રથમ આહાર દાન અને વર્જિતપ આરાધના.',
    significanceHin: 'भगवान ऋषभदेव को इक्षुरस (गन्ने के रस) का प्रथम आहार दान एवं वर्षी तप पारणा।',
    significanceHing: 'Sugarcane juice offering to Lord Rishabhdev completing Varshitap.'
  }
];

export const JAIN_PACHKHAN_VOWS_FULL: JainPachkhanVow[] = [
  {
    id: 'pachkhan_navkarsi',
    nameGuj: 'નવકારશી (નમોક્કારસહિયં)',
    nameHin: 'नवकारशी (नमोक्कारसहियं)',
    nameHing: 'Navkarsi (Namokkarsahiyam)',
    categoryGuj: 'પ્રાતઃ વ્રત (Morning Vow)',
    categoryHin: 'प्रातः व्रत (Morning Vow)',
    categoryHing: 'Morning Vow',
    releaseTimeGuj: 'સવારે ૦૭:૧૦',
    releaseTimeHin: 'सुबह ०७:१०',
    releaseTimeHing: '07:10 AM',
    durationGuj: 'સૂર્યોદયના ૪૮ મિનિટ પછી',
    durationHin: 'सूर्योदय के ४८ मिनट बाद',
    durationHing: '48 min after sunrise',
    descGuj: 'દિવસનું પ્રથમ વ્રત — સૂર્યોદયના ૪૮ મિનિટ પછી નવકાર મંત્ર ગણી પારણા ન થાય ત્યાં સુધી અન્ન-જલનો ત્યાગ રાખવો.',
    descHin: 'दिन का प्रथम व्रत — सूर्योदय के ४८ मिनट बाद नवकार मंत्र गिनकर पारणा न होने तक अन्न-जल का त्याग रखें।',
    descHing: 'The first vow of the day — abstain from food & water until 48 min after sunrise.',
    sutraPrakrit: 'ઉગ્ગએ સૂરે નમોક્કારસહિયં મુટ્ઠિસહિયં પચ્ચક્ખાઇ ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
    sutraGuj: 'ઉગ્ગએ સૂરે નમોક્કારસહિયં મુટ્ઠિસહિયં પચ્ચક્ખાઇ ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
    sutraHin: 'उग्गए सूरे नमोक्कारसहियं मुट्ठिसहियं पच्चक्खाइ चउव्विहं पि आहारं — असणं, पाणं, खाइमं, साइमं',
    sutraHing: 'Uggae sure namokkarsahiyam mutthisahiyam paccakkhai cauvviham pi aaharam - asanam, panam, khaimam, saimam'
  },
  {
    id: 'pachkhan_porsi',
    nameGuj: 'પોરસી (પૌરુષી)',
    nameHin: 'पोरसी (पौरुषी)',
    nameHing: 'Porsi (Paurushi)',
    categoryGuj: 'પ્રાતઃ વ્રત (Morning Vow)',
    categoryHin: 'प्रातः व्रत (Morning Vow)',
    categoryHing: 'Morning Vow',
    releaseTimeGuj: 'સવારે ૦૯:૨૭',
    releaseTimeHin: 'सुबह ०९:२७',
    releaseTimeHing: '09:27 AM',
    durationGuj: 'દિવસનો ૧ પ્રહર (૧/૪ ભાગ)',
    durationHin: 'दिन का १ प्रहर (१/४ भाग)',
    durationHing: 'One prahar of daytime',
    descGuj: 'દિવસનો પ્રથમ પ્રહર (આશરે સૂર્યોદય પછી ૧/૪ દિવસ) પૂર્ણ ન થાય ત્યાં સુધી આહાર-જલનો ત્યાગ.',
    descHin: 'दिन का प्रथम प्रहर (लगभग सूर्योदय के १/४ दिन बाद) समाप्त होने तक आहार-जल का त्याग।',
    descHing: 'Abstain until one-quarter of the daytime has passed — the first prahar.',
    sutraPrakrit: 'પોરસિં પચ્ચક્ખાઇ, ઉગ્ગએ સૂરે ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
    sutraGuj: 'પોરસિં પચ્ચક્ખાઇ, ઉગ્ગએ સૂરે ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
    sutraHin: 'पोरिसिं पच्चक्खाइ, उग्गए सूरे चउव्विहं पि आहारं — असणं, पाणं, खाइमं, साइमं',
    sutraHing: 'Porisim paccakkhai, uggae sure cauvviham pi aaharam - asanam, panam, khaimam, saimam'
  },
  {
    id: 'pachkhan_sad_porsi',
    nameGuj: 'સાઢ પોરસી (સાર્ધ પૌરુષી)',
    nameHin: 'साढ़ पोरसी (सार्ध पौरुषी)',
    nameHing: 'Sardha Porsi (Sad Porsi)',
    categoryGuj: 'પ્રાતઃ વ્રત (Morning Vow)',
    categoryHin: 'प्रातः व्रत (Morning Vow)',
    categoryHing: 'Morning Vow',
    releaseTimeGuj: 'સવારે ૧૧:૦૦',
    releaseTimeHin: 'सुबह ११:००',
    releaseTimeHing: '11:00 AM',
    durationGuj: 'દિવસનો ૧.૫ પ્રહર (આશરે ૧ કલાક ૩૦ મિનિટ પોરસી પછી)',
    durationHin: 'दिन का १.५ प्रहर (लगभग १ घंटा ३० मिनट पोरसी के बाद)',
    durationHing: '1½ prahar of daytime',
    descGuj: 'પોરસી વ્રતને અડધો પ્રહર આગળ લંબાવી ૧.૫ પ્રહર સુધી ત્યાગ રાખવો.',
    descHin: 'पोरसी व्रत को आधा प्रहर आगे बढ़ाकर १.५ प्रहर तक त्याग रखें।',
    descHing: 'Extend the porsi vow by half — abstain for 1½ prahar of daytime.',
    sutraPrakrit: 'સાઢ પોરસિં પચ્ચક્ખાઇ, ઉગ્ગએ સૂરે ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
    sutraGuj: 'સાઢ પોરસિં પચ્ચક્ખાઇ, ઉગ્ગએ સૂરે ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
    sutraHin: 'साढ़ पोरिसिं पच्चक्खाइ, उग्गए सूरे चउव्विहं पि आहारं — असणं, पाणं, खाइमं, साइमं',
    sutraHing: 'Sardha porisim paccakkhai, uggae sure cauvviham pi aaharam'
  },
  {
    id: 'pachkhan_puri_maddh',
    nameGuj: 'પુરિમડ્ઢ (મધ્યાહન વ્રત)',
    nameHin: 'पुरिमड्ढ (मध्याह्न व्रत)',
    nameHing: 'Purimaddh (Midday)',
    categoryGuj: 'પ્રાતઃ વ્રત (Morning Vow)',
    categoryHin: 'प्रातः व्रत (Morning Vow)',
    categoryHing: 'Morning Vow',
    releaseTimeGuj: 'બપોરે ૧૨:૩૨',
    releaseTimeHin: 'दोपहर १२:३२',
    releaseTimeHing: '12:32 PM',
    durationGuj: 'બપોરના મધ્ય ભાગ સુધી (૨ પ્રહર)',
    durationHin: 'दोपहर के मध्य भाग तक (२ प्रहर)',
    durationHing: 'Until midday',
    descGuj: 'દિવસના મધ્ય ભાગ (૨ પ્રહર) સુધી આહાર ત્યાગ રાખવો.',
    descHin: 'दिन के मध्य भाग (२ प्रहर) तक आहार त्याग रखें।',
    descHing: 'Abstain until midday — the mid-day (purim-addha) mark of the daytime.',
    sutraPrakrit: 'પુરિમડ્ઢં પચ્ચક્ખાઇ, ઉગ્ગએ સૂરે ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
    sutraGuj: 'પુરિમડ્ઢં પચ્ચક્ખાઇ, ઉગ્ગએ સૂરે ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
    sutraHin: 'पुरिमड्ढं पच्चक्खाइ, उग्गए सूरे चउव्विहं पि आहारं — असणं, पाणं, खाइमं, साइमं',
    sutraHing: 'Purimaddham paccakkhai, uggae sure cauvviham pi aaharam'
  },
  {
    id: 'pachkhan_avaddh',
    nameGuj: 'અવડ્ઢ (૩ પ્રહર વ્રત)',
    nameHin: 'अवड्ढ (३ प्रहर व्रत)',
    nameHing: 'Avaddh',
    categoryGuj: 'પ્રાતઃ વ્રત (Morning Vow)',
    categoryHin: 'प्रातः व्रत (Morning Vow)',
    categoryHing: 'Morning Vow',
    releaseTimeGuj: 'બપોરે ૦૩:૩૭',
    releaseTimeHin: 'अपराह्न ०३:३७',
    releaseTimeHing: '03:37 PM',
    durationGuj: 'દિવસના ૩ પ્રહર (૩/૪ ભાગ) સુધી',
    durationHin: 'दिन के ३ प्रहर (३/४ भाग) तक',
    durationHing: '3 prahar of daytime',
    descGuj: 'દિવસના પોણા ભાગ (૩ પ્રહર) સુધી ચાર આહારનો ત્યાગ.',
    descHin: 'दिन के तीन-चौथाई भाग (३ प्रहर) तक चार आहार का त्याग।',
    descHing: 'Abstain until three-quarters of the daytime has passed.',
    sutraPrakrit: 'અવડ્ઢં પચ્ચક્ખાઇ, ઉગ્ગએ સૂરે ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
    sutraGuj: 'અવડ્ઢં પચ્ચક્ખાઇ, ઉગ્ગએ સૂરે ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
    sutraHin: 'अवड्ढं पच्चक्खाइ, उग्गए सूरे चउव्विहं पि आहारं — असणं, पाणं, खाइमं, साइमं',
    sutraHing: 'Avaddham paccakkhai, uggae sure cauvviham pi aaharam'
  },
  {
    id: 'pachkhan_biasan',
    nameGuj: 'બિયાસણું (બે આસને ભોજન)',
    nameHin: 'बियासना (दो आसन भोजन)',
    nameHing: 'Biasan',
    categoryGuj: 'નિયમિત આહાર વ્રત (Restricted Meal)',
    categoryHin: 'नियमित आहार व्रत (Restricted Meal)',
    categoryHing: 'Restricted Meal',
    releaseTimeGuj: 'સાંજે ૦૬:૪૨ (સૂર્યાસ્ત)',
    releaseTimeHin: 'शाम ०६:४२ (सूर्यास्त)',
    releaseTimeHing: '06:42 PM',
    durationGuj: 'બે આસને માત્ર બે જ ભોજન',
    durationHin: 'दो आसन केवल दो ही भोजन',
    durationHing: 'Two sittings only',
    descGuj: 'દિવસમાં માત્ર બે જ વાર એક આસને બેસી ભોજન ગ્રહણ કરવું, અન્ય સમયે ત્યાગ.',
    descHin: 'दिन में केवल दो बार एक ही आसन पर बैठकर भोजन करें, अन्य समय त्याग रखें।',
    descHing: 'Two meals in one sitting each — nothing else for the day. A gentle discipline of the palate.',
    sutraPrakrit: 'બિયાસણં પચ્ચક્ખાઇ, તિવિહં પિ આહારં — અસણં, ખાઇમં, સાઇમં',
    sutraGuj: 'બિયાસણં પચ્ચક્ખાઇ, તિવિહં પિ આહારં — અસણં, ખાઇમં, સાઇમં',
    sutraHin: 'बियासणं पच्चक्खाइ, तिविहं पि आहारं — असणं, खाइमं, साइमं',
    sutraHing: 'Biyasanam paccakkhai, tiviham pi aaharam - asanam, khaimam, saimam'
  },
  {
    id: 'pachkhan_ekasan',
    nameGuj: 'એકાસણું (એક આસને એક ભોજન)',
    nameHin: 'एकासना (एक आसन एक भोजन)',
    nameHing: 'Ekasan',
    categoryGuj: 'નિયમિત આહાર વ્રત (Restricted Meal)',
    categoryHin: 'नियमित आहार व्रत (Restricted Meal)',
    categoryHing: 'Restricted Meal',
    releaseTimeGuj: 'સાંજે ૦૬:૪૨ (સૂર્યાસ્ત)',
    releaseTimeHin: 'शाम ०६:૪२ (सूर्यास्त)',
    releaseTimeHing: '06:42 PM',
    durationGuj: 'એક જ આસને માત્ર એક ભોજન',
    durationHin: 'एक ही आसन पर केवल एक भोजन',
    durationHing: 'One sitting only',
    descGuj: 'દિવસમાં માત્ર એક જ વાર એક જ આસને બેસી સાત્વિક આહાર ગ્રહણ કરવો.',
    descHin: 'दिन में केवल एक बार एक ही आसन पर बैठकर सात्विक आहार ग्रहण करें।',
    descHing: 'One sitting, one meal, until sunset. Water allowed in restricted quantity.',
    sutraPrakrit: 'એગાસણં પચ્ચક્ખાઇ, તિવિહં પિ આહારં — અસણં, ખાઇમં, સાઇમં',
    sutraGuj: 'એગાસણં પચ્ચક્ખાઇ, તિવિહં પિ આહારં — અસણં, ખાઇમં, સાઇમં',
    sutraHin: 'एगासणं पच्चक्खाइ, तिविहं पि आहारं — असणं, खाइमं, साइमं',
    sutraHing: 'Egasanam paccakkhai, tiviham pi aaharam - asanam, khaimam, saimam'
  },
  {
    id: 'pachkhan_ayambil',
    nameGuj: 'આયંબિલ (અલ્પ સ્વાદ વ્રત / આયંબિલ ઓળી)',
    nameHin: 'आयंबिल (अल्प स्वाद व्रत / आयंबिल ओली)',
    nameHing: 'Ayambil',
    categoryGuj: 'નિયમિત આહાર વ્રત (Restricted Meal)',
    categoryHin: 'नियमित आहार व्रत (Restricted Meal)',
    categoryHing: 'Restricted Meal',
    releaseTimeGuj: 'સાંજે ૦૬:૪૨ (સૂર્યાસ્ત)',
    releaseTimeHin: 'शाम ०૬:૪२ (सूर्यास्त)',
    releaseTimeHing: '06:42 PM',
    durationGuj: 'એક જ વાર નિઃસ્વાદ આહાર',
    durationHin: 'एक ही बार निस्वाद भोजन',
    durationHing: 'One meal, tasteless',
    descGuj: 'રસ વગરનું (ઘી, તેલ, દૂધ, દહીં, ખાંડ, મીઠું વગરનું) સાદું નિઃસ્વાદ ભોજન.',
    descHin: 'बिना रस (घी, तेल, दूध, दही, शक्कर, नमक) का नीरस भोजन ग्रहण करना।',
    descHing: 'One bland, tasteless meal — no ghee, oil, milk, curd, sugar, salt, spices. Practised over Ayambil Oli.',
    sutraPrakrit: 'આયંબિલં પચ્ચક્ખાઇ અન્નત્થણાભોગેણં',
    sutraGuj: 'આયંબિલં પચ્ચક્ખાઇ અન્નત્થણાભોગેણં',
    sutraHin: 'आयंबिलं पच्चक्खाइ अन्नत्थणाभोगेणं',
    sutraHing: 'Ayambilam paccakkhai annatthanabhoganam'
  },
  {
    id: 'pachkhan_upvas',
    nameGuj: 'ઉપવાસ (ચઉત્થભત્તં / ૨૪ કલાક તપ)',
    nameHin: 'उपवास (चउत्थभत्तं / २४ घंटे तप)',
    nameHing: 'Upvas (24h fast)',
    categoryGuj: 'પૂર્ણ દિવસ તપ (Full-day Fast)',
    categoryHin: 'पूर्ण दिवस तप (Full-day Fast)',
    categoryHing: 'Full-day Fast',
    releaseTimeGuj: 'સાંજે ૦૬:૪૨ / ૨૪ કલાક',
    releaseTimeHin: 'शाम ०६:૪२ / २४ घंटे',
    releaseTimeHing: '06:42 PM / 24h',
    durationGuj: '૨૪ કલાક સંપૂર્ણ તપ',
    durationHin: '२४ घंटे संपूर्ण तप',
    durationHing: '24 hours',
    descGuj: '૨૪ કલાક માટે ચારેય આહારનો સંપૂર્ણ ત્યાગ — જૈન આરાધનાનું સર્વોચ્ચ વ્રત.',
    descHin: '२४ घंटे हेतु चारों आहार का पूर्ण त्याग — जैन आराधना का सर्वोच्च व्रत।',
    descHing: 'Total abstinence from food and water for a full 24-hour cycle — the highest of the meal vows.',
    sutraPrakrit: 'ચઉત્થભત્તં પચ્ચક્ખાઇ, ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
    sutraGuj: 'ચઉત્થભત્તં પચ્ચક્ખાઇ, ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
    sutraHin: 'चउत्थभत्तं पच्चक्खाइ, चउव्विहं पि आहारं — असणं, पाणं, खाइमं, साइमं',
    sutraHing: 'Chautthabhattam paccakkhai, cauvviham pi aaharam - asanam, panam, khaimam, saimam'
  },
  {
    id: 'pachkhan_tivihar',
    nameGuj: 'તિવિહાર (સૂર્યાસ્ત વ્રત)',
    nameHin: 'तिविहार (सूर्यास्त व्रत)',
    nameHing: 'Tivihar',
    categoryGuj: 'સૂર્યાસ્ત વ્રત (After Sunset)',
    categoryHin: 'सूर्यास्त व्रत (After Sunset)',
    categoryHing: 'After Sunset',
    releaseTimeGuj: 'સાંજે ૦૬:૪૨ (સૂર્યાસ્ત)',
    releaseTimeHin: 'शाम ૦૬:૪२ (सूर्यास्त)',
    releaseTimeHing: '06:42 PM',
    durationGuj: 'સૂર્યાસ્તથી આગામી સૂર્યોદય',
    durationHin: 'सूर्यास्त से आगामी सूर्योदय',
    durationHing: 'Sunset to sunrise',
    descGuj: 'સૂર્યાસ્ત બાદ અન્ન, ખાદ્ય અને સ્વાધ્ય ત્યાગ — માત્ર પ્રાસુક જલ જ છૂટ.',
    descHin: 'सूर्यास्त के बाद भोजन-खाद्य त्याग — आवश्यकतानुसार केवल प्रासुक जल की छूट।',
    descHing: 'No food after sunset — only water, if needed. Recited at the end of the day.',
    sutraPrakrit: 'તિવિહારં પચ્ચક્ખાઇ, દિવસચિરીમં — અસણં, ખાઇમં, સાઇમં',
    sutraGuj: 'તિવિહારં પચ્ચક્ખાઇ, દિવસચિરીમં — અસણં, ખાઇમં, સાઇમં',
    sutraHin: 'तिविहारं पच्चक्खाइ, दिवसचरिमं — असणं, खाइमं, साइमं',
    sutraHing: 'Tiviharam paccakkhai, divasacarimam - asanam, khaimam, saimam'
  },
  {
    id: 'pachkhan_chauvihar',
    nameGuj: 'ચૌવિહાર (રાત્રિ અન્ન-જલ ત્યાગ)',
    nameHin: 'चौविहार (रात्रि अन्न-जल त्याग)',
    nameHing: 'Chauvihar',
    categoryGuj: 'સૂર્યાસ્ત વ્રત (After Sunset)',
    categoryHin: 'सूर्यास्त व्रत (After Sunset)',
    categoryHing: 'After Sunset',
    releaseTimeGuj: 'સાંજે ૦૬:૪૨ (સૂર્યાસ્ત)',
    releaseTimeHin: 'शाम ૦૬:૪२ (सूर्यास्त)',
    releaseTimeHing: '06:42 PM',
    durationGuj: 'સૂર્યાસ્તથી આગામી સૂર્યોદય',
    durationHin: 'सूर्यास्त से आगामी सूर्योदय',
    durationHing: 'Sunset to sunrise',
    descGuj: 'સૂર્યાસ્ત પછી અન્ન અને જલનો સંપૂર્ણ ત્યાગ. જૈન શ્રાવકનું નિત્ય સંયમ વ્રત.',
    descHin: 'सूर्यास्त के पश्चात भोजन एवं जल का पूर्ण त्याग। जैन श्रावक का नित्य संयम व्रत।',
    descHing: 'Total prohibition of food and water after sunset. Primary evening vow.',
    sutraPrakrit: 'ચઉવ્વિહારં પચ્ચક્ખાઇ, દિવસચિરીમં — અસણં, પાણં, ખાઇમં, સાઇમં',
    sutraGuj: 'ચઉવ્વિહારં પચ્ચક્ખાઇ, દિવસચિરીમં — અસણં, પાણં, ખાઇમં, સાઇમં',
    sutraHin: 'चउव्विहारं पच्चक्खाइ, दिवसचरिमं — असणं, पाणं, खाइमं, साइमं',
    sutraHing: 'Cauvviharam paccakkhai, divasacarimam - asanam, panam, khaimam, saimam'
  }
];

// Helper digit convertors
const toGujaratiDigits = (str: string | number): string => {
  const gujDigits = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
  return String(str).replace(/[0-9]/g, w => gujDigits[parseInt(w, 10)]);
};

const toDevanagariDigits = (str: string | number): string => {
  const devDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(str).replace(/[0-9]/g, w => devDigits[parseInt(w, 10)]);
};

// Time Helper Functions for Live Running Choghadiya & Rahu Kalam
const parseTimeStrToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const ampm = match[3] ? match[3].toUpperCase() : '';
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return h * 60 + m;
};

const isTimeBetween = (nowMin: number, startStr: string, endStr: string): boolean => {
  const sMin = parseTimeStrToMinutes(startStr);
  let eMin = parseTimeStrToMinutes(endStr);
  if (eMin <= sMin) {
    eMin += 24 * 60;
    if (nowMin < sMin) {
      return (nowMin + 24 * 60) >= sMin && (nowMin + 24 * 60) <= eMin;
    }
  }
  return nowMin >= sMin && nowMin <= eMin;
};

// Dynamic Jain Pachkhan Vow Release Times derived from Sunrise & Sunset
const calculatePachkhanReleaseTimes = (sunriseStr: string, sunsetStr: string) => {
  const sunriseMin = parseTimeStrToMinutes(sunriseStr) || (6 * 60 + 30);
  let sunsetMin = parseTimeStrToMinutes(sunsetStr) || (18 * 60 + 30);
  if (sunsetMin <= sunriseMin) {
    sunsetMin += 12 * 60;
  }
  const daylightMins = sunsetMin - sunriseMin;
  const praharMins = daylightMins / 4;

  const navkarsiMins = sunriseMin + 48;
  const porsiMins = sunriseMin + praharMins;
  const sadPorsiMins = sunriseMin + (1.5 * praharMins);
  const puriMaddhMins = sunriseMin + (2 * praharMins);
  const avaddhMins = sunriseMin + (3 * praharMins);
  const sunsetReleaseMins = sunsetMin;

  const formatRelease = (totalMins: number) => {
    let mins = Math.round(totalMins) % (24 * 60);
    if (mins < 0) mins += 24 * 60;
    let h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    let displayH = h > 12 ? h - 12 : h;
    if (displayH === 0) displayH = 12;
    const hh = displayH < 10 ? `0${displayH}` : `${displayH}`;
    const mm = m < 10 ? `0${m}` : `${m}`;
    const raw12h = `${hh}:${mm} ${ampm}`;

    const gujPeriod = ampm === 'AM' ? 'સવારે' : (displayH < 4 || displayH === 12 ? 'બપોરે' : (displayH < 7 ? 'સાંજે' : 'રાત્રે'));
    const gujStr = `${gujPeriod} ${toGujaratiDigits(`${hh}:${mm}`)}`;

    const hinPeriod = ampm === 'AM' ? 'सुबह' : (displayH < 4 || displayH === 12 ? 'दोपहर' : (displayH < 7 ? 'शाम' : 'रात'));
    const hinStr = `${hinPeriod} ${toDevanagariDigits(`${hh}:${mm}`)}`;

    return {
      guj: gujStr,
      hin: hinStr,
      hing: raw12h,
    };
  };

  return {
    navkarsi: formatRelease(navkarsiMins),
    porsi: formatRelease(porsiMins),
    sadPorsi: formatRelease(sadPorsiMins),
    puriMaddh: formatRelease(puriMaddhMins),
    avaddh: formatRelease(avaddhMins),
    sunset: formatRelease(sunsetReleaseMins),
  };
};

export const JainCalendarModal: React.FC<JainCalendarModalProps> = ({
  visible,
  onClose,
  selectedCity,
  panchang
}) => {
  // 3 Languages Only: GUJARATI, HINDI, HINGLISH
  const [jainLang, setJainLang] = useState<JainLang>('GUJARATI');
  const [activeTab, setActiveTab] = useState<TabType>('PANCHANG');

  // Jain Reminders List State
  const [jainReminders, setJainReminders] = useState<ReminderItem[]>([]);

  // Tithi Info Popup Modal State
  const [showTithiInfoModal, setShowTithiInfoModal] = useState(false);

  // Reminder Form Modal States (Create / Edit)
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [reminderTitle, setReminderTitle] = useState('🪔 Paryushan / Samvatsari Pachkhan Fasting');
  const [reminderTime, setReminderTime] = useState('06:30 AM');
  const [reminderNotes, setReminderNotes] = useState('Chauvihar before sunset, Pachkhan & Dev Vandan');
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Dynamic Selected Date State (Defaults to panchang?.dateIso or current date)
  const defaultIso = (() => {
    if (panchang?.dateIso) return panchang.dateIso;
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  })();

  const [selectedDateIso, setSelectedDateIso] = useState<string>(defaultIso);

  useEffect(() => {
    if (panchang?.dateIso) {
      setSelectedDateIso(panchang.dateIso);
    }
  }, [panchang?.dateIso, visible]);

  // Compute active date object & active panchang dynamically
  const activeDateObj = useMemo(() => {
    const parts = selectedDateIso.split('-');
    const y = parseInt(parts[0], 10) || 2026;
    const m = (parseInt(parts[1], 10) || 9) - 1;
    const d = parseInt(parts[2], 10) || 13;
    return new Date(y, m, d);
  }, [selectedDateIso]);

  const activePanchang = useMemo(() => {
    return calculatePanchang(activeDateObj, selectedCity);
  }, [activeDateObj, selectedCity]);

  // Dynamic Date Picker Modal State
  const [showJainDatePickerModal, setShowJainDatePickerModal] = useState(false);

  const dayNum = activeDateObj.getDate();
  const monthIdx = activeDateObj.getMonth();
  const yearNum = activeDateObj.getFullYear();

  const [tempYear, setTempYear] = useState(yearNum);
  const [tempMonth, setTempMonth] = useState(monthIdx);
  const [tempDay, setTempDay] = useState(dayNum);

  const handleOpenDatePicker = () => {
    setTempYear(yearNum);
    setTempMonth(monthIdx);
    setTempDay(dayNum);
    setShowJainDatePickerModal(true);
  };

  const handleApplyDatePicker = (d: number, m: number, y: number) => {
    const maxDays = new Date(y, m + 1, 0).getDate();
    const validD = Math.min(d, maxDays);
    const mStr = String(m + 1).padStart(2, '0');
    const dStr = String(validD).padStart(2, '0');
    setSelectedDateIso(`${y}-${mStr}-${dStr}`);
    setShowJainDatePickerModal(false);
  };

  const handleResetToTodayDate = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setSelectedDateIso(`${y}-${m}-${day}`);
    setShowJainDatePickerModal(false);
  };

  // Blinking / Shimmering Animation State for timing badges (only blinks until first timing button tap)
  const [hasClickedTiming, setHasClickedTiming] = useState<boolean>(true); // default true until checked
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    AsyncStorage.getItem('@jain_pachkhan_timing_clicked').then((val) => {
      if (val !== 'true') {
        setHasClickedTiming(false);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!hasClickedTiming) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.4,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1.0,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      anim.start();
      return () => {
        anim.stop();
        blinkAnim.setValue(1);
      };
    } else {
      blinkAnim.setValue(1);
    }
  }, [hasClickedTiming, blinkAnim]);

  const sunriseStr = activePanchang?.sunMoon?.sunrise || '06:30 AM';
  const sunsetStr = activePanchang?.sunMoon?.sunset || '06:30 PM';
  const tithiName = activePanchang?.tithi?.hindiName || 'ભાદરવા સુદ બીજ';

  const dynamicTimes = calculatePachkhanReleaseTimes(sunriseStr, sunsetStr);

  const getVowTimeObj = (vowId: string) => {
    switch (vowId) {
      case 'pachkhan_navkarsi': return dynamicTimes.navkarsi;
      case 'pachkhan_porsi': return dynamicTimes.porsi;
      case 'pachkhan_sad_porsi': return dynamicTimes.sadPorsi;
      case 'pachkhan_puri_maddh': return dynamicTimes.puriMaddh;
      case 'pachkhan_avaddh': return dynamicTimes.avaddh;
      default: return dynamicTimes.sunset;
    }
  };

  const tab1PachkhanItems = [
    {
      id: 'tab1_navkarsi',
      nameGuj: 'નવકારશી (નમોક્કારસહિયં)',
      nameHin: 'नवकारशी (नमोक्कारसहियं)',
      nameHing: 'Navkarsi (Namokkarsahiyam)',
      descGuj: 'દિવસનું પ્રથમ વ્રત — સૂર્યોદયના ૪૮ મિનિટ પછી નવકાર મંત્ર ગણી પારણા ન થાય ત્યાં સુધી અન્ન-જલનો ત્યાગ રાખવો.',
      descHin: 'दिन का प्रथम व्रत — सूर्योदय के ४८ मिनट बाद नवकार मंत्र गिनकर पारणा न होने तक अन्न-जल का त्याग रखें।',
      descHing: 'The first vow of the day — abstain from food & water until 48 min after sunrise.',
      sutraPrakrit: 'ઉગ્ગએ સૂરે નમોક્કારસહિયં મુટ્ઠિસહિયં પચ્ચક્ખાઇ ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
      timeObj: dynamicTimes.navkarsi,
    },
    {
      id: 'tab1_porsi',
      nameGuj: 'પોરસી (પૌરુષી)',
      nameHin: 'पोरसी (पौरुषी)',
      nameHing: 'Porsi (Paurushi)',
      descGuj: 'દિવસનો પ્રથમ પ્રહર (આશરે સૂર્યોદય પછી ૧/૪ દિવસ) પૂર્ણ ન થાય ત્યાં સુધી આહાર-જલનો ત્યાગ.',
      descHin: 'दिन का प्रथम प्रहर (लगभग सूर्योदय के १/४ दिन बाद) समाप्त होने तक आहार-जल का त्याग।',
      descHing: 'Abstain until one-quarter of the daytime has passed — the first prahar.',
      sutraPrakrit: 'પોરસિં પચ્ચક્ખાઇ, ઉગ્ગએ સૂરે ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
      timeObj: dynamicTimes.porsi,
    },
    {
      id: 'tab1_sad_porsi',
      nameGuj: 'સાઢ પોરસી (સાર્ધ પૌરુષી)',
      nameHin: 'साढ़ पोरसी (सार्ध पौरुषी)',
      nameHing: 'Sardha Porsi (Sad Porsi)',
      descGuj: 'પોરસી વ્રતને અડધો પ્રહર આગળ લંબાવી ૧.૫ પ્રહર સુધી ત્યાગ રાખવો.',
      descHin: 'पोरसी व्रत को आधा प्रहर आगे बढ़ाकर १.५ प्रहर तक त्याग रखें।',
      descHing: 'Extend the porsi vow by half — abstain for 1½ prahar of daytime.',
      sutraPrakrit: 'સાઢ પોરસિં પચ્ચક્ખાઇ, ઉગ્ગએ સૂરે ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
      timeObj: dynamicTimes.sadPorsi,
    },
    {
      id: 'tab1_puri_maddh',
      nameGuj: 'પુરિમડ્ઢ (મધ્યાહન વ્રત)',
      nameHin: 'पुरिमड्ढ (मध्याह्न व्रत)',
      nameHing: 'Puri Maddh (Midday Vow)',
      descGuj: 'દિવસના મધ્ય ભાગ (૨ પ્રહર) સુધી આહાર ત્યાગ રાખવો.',
      descHin: 'दिन के मध्य भाग (२ प्रहर) तक आहार त्याग रखें।',
      descHing: 'Abstain from food until midday (2 prahar of daytime).',
      sutraPrakrit: 'પુરિમડ્ઢં પચ્ચક્ખાઇ, ઉગ્ગએ સૂરે ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
      timeObj: dynamicTimes.puriMaddh,
    },
    {
      id: 'tab1_avaddh',
      nameGuj: 'અવડ્ઢ (૩ પ્રહર વ્રત)',
      nameHin: 'अवड्ढ (३ प्रहर व्रत)',
      nameHing: 'Avaddh (3 Prahar Vow)',
      descGuj: 'દિવસના પોણા ભાગ (૩ પ્રહર) સુધી ચાર આહારનો ત્યાગ.',
      descHin: 'दिन के पौने भाग (३ प्रहर) तक चार आहार का त्याग।',
      descHing: 'Abstain from food until 3 prahar (3/4 of daytime).',
      sutraPrakrit: 'અવડ્ઢં પચ્ચક્ખાઇ, ઉગ્ગએ સૂરે ચઉવ્વિહં પિ આહારં — અસણં, પાણં, ખાઇમં, સાઇમં',
      timeObj: dynamicTimes.avaddh,
    },
    {
      id: 'tab1_chauvihar_tivihar',
      nameGuj: 'ચૌવિહાર / તિવિહાર',
      nameHin: 'चौविहार / तिविहार',
      nameHing: 'Chauvihar / Tivihar',
      descGuj: 'સૂર્યાસ્ત પછી આહાર-જલનો સંપૂર્ણ ત્યાગ — દિવસના અંતે લેવાતું વ્રત.',
      descHin: 'सूर्यास्त के बाद आहार-जल का संपूर्ण त्याग — दिन के अंत में लिया जाने वाला व्रत।',
      descHing: 'No food or water after sunset — recited at the end of the day.',
      sutraPrakrit: 'ચઉવ્વિહારં / તિવિહારં પચ્ચક્ખાઇ, દિવસચરિમં — અસણં, પાણં, ખાઇમં, સાઇમં',
      timeObj: dynamicTimes.sunset,
    },
  ];

  const monthNamesGuj = [
    'જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન',
    'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'
  ];
  const monthNamesHin = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];
  const monthNamesEng = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const dayStrGuj = toGujaratiDigits(dayNum);
  const dayStrHin = toDevanagariDigits(dayNum);
  const dayStrEng = String(dayNum);

  const formattedDateGuj = `${dayStrGuj} ${monthNamesGuj[monthIdx]} ${toGujaratiDigits(yearNum)}`;
  const formattedDateHin = `${dayStrHin} ${monthNamesHin[monthIdx]} ${toDevanagariDigits(yearNum)}`;
  const formattedDateEng = `${dayStrEng} ${monthNamesEng[monthIdx]} ${yearNum}`;

  // Content strings localized strictly for 3 languages
  const getTxt = (guj: string, hin: string, hing: string) => {
    if (jainLang === 'HINDI') return hin;
    if (jainLang === 'HINGLISH') return hing;
    return guj;
  };

  const displayTodayDateStr = getTxt(formattedDateGuj, formattedDateHin, formattedDateEng);

  // CORRECT TITHI NUMBER FOR GOLD CIRCLE BADGE (e.g. 2 for Dwitiya, NOT solar date!)
  const rawTithiNum = activePanchang?.tithi?.number || 2;
  const tithiInPaksha = (((rawTithiNum - 1) % 15) + 1); // 2 for Dwitiya!
  const displayTithiNumBadge = getTxt(
    toGujaratiDigits(tithiInPaksha),
    toDevanagariDigits(tithiInPaksha),
    String(tithiInPaksha)
  );

  // Derive Jain Day Engine data for rich Tithi Info Popup
  const jainDayData = getJainDayData(activeDateObj, rawTithiNum);

  // Compute Choghadiya & Muhurat data
  const choghadiyaData = (activePanchang?.dayChoghadiya && activePanchang.dayChoghadiya.length > 0)
    ? { dayChoghadiya: activePanchang.dayChoghadiya, nightChoghadiya: activePanchang.nightChoghadiya }
    : calculateChoghadiya(activeDateObj, sunriseStr, sunsetStr);

  const muhuratData = (activePanchang?.auspiciousMuhurats && activePanchang.auspiciousMuhurats.length > 0)
    ? { auspicious: activePanchang.auspiciousMuhurats, inauspicious: activePanchang.inauspiciousMuhurats }
    : calculateMuhurats(activeDateObj, sunriseStr, sunsetStr);

  // Derive Current Live Active Choghadiya & Active Muhurat Window
  const now = new Date();
  const currentNowMinutes = now.getHours() * 60 + now.getMinutes();

  const allChoghadiyas = [...choghadiyaData.dayChoghadiya, ...choghadiyaData.nightChoghadiya];
  const runningChoghadiya = allChoghadiyas.find(c => isTimeBetween(currentNowMinutes, c.startTime, c.endTime)) || allChoghadiyas[0];

  const allMuhurats = [...muhuratData.auspicious, ...muhuratData.inauspicious];
  const runningMuhuratWindow = allMuhurats.find(m => isTimeBetween(currentNowMinutes, m.startTime, m.endTime));

  // Load Jain Reminders from Storage
  const loadJainReminders = useCallback(async () => {
    try {
      const allReminders = await getStoredReminders();
      const filtered = allReminders.filter(
        r => r.isJain || r.id.startsWith('jain_rem_') || r.recurrence?.festivalDharma === 'JAIN'
      );
      setJainReminders(filtered);
    } catch (e) {
      console.error('Error loading Jain reminders:', e);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      loadJainReminders();
    }
  }, [visible, loadJainReminders]);

  // Open Create Modal for Individual Pachkhan Item / Vow
  const handleOpenPachkhanReminder = (pachkhanTitle: string, defaultTime: string, desc: string, sutraFormula?: string) => {
    if (!hasClickedTiming) {
      setHasClickedTiming(true);
      blinkAnim.setValue(1);
      AsyncStorage.setItem('@jain_pachkhan_timing_clicked', 'true').catch(console.error);
    }
    setEditingReminderId(null);
    setReminderTitle(`🥣 ${pachkhanTitle} Pachkhan Reminder`);
    setReminderTime(defaultTime);
    setReminderNotes(`${desc}${sutraFormula ? `\nFormula: ${sutraFormula}` : ''} - Jain Pachkhan & Samayik`);
    setShowReminderModal(true);
  };

  // Open Create Modal with Pre-filled Festival Info
  const handleOpenFestivalReminder = (fest: JainFestival) => {
    const festTitle = jainLang === 'HINDI' ? fest.nameHin : jainLang === 'HINGLISH' ? fest.nameHing : fest.nameGuj;
    const festNotes = jainLang === 'HINDI' ? fest.significanceHin : jainLang === 'HINGLISH' ? fest.significanceHing : fest.significanceGuj;

    setEditingReminderId(null);
    setReminderTitle(`🪔 ${festTitle}`);
    setReminderTime('06:30 AM');
    setReminderNotes(`${festNotes} - Fasting, Dev Vandan & Pachkhan`);
    setShowReminderModal(true);
  };

  // Open Edit Modal for existing Jain Reminder
  const handleOpenEditReminder = (rem: ReminderItem) => {
    setEditingReminderId(rem.id);
    setReminderTitle(rem.title);
    setReminderTime(rem.timeStr || '06:30 AM');
    setReminderNotes(rem.notes || '');
    setShowReminderModal(true);
  };

  // Handle Toggle Switch ON/OFF
  const handleToggleReminder = async (id: string) => {
    await toggleReminderState(id);
    await loadJainReminders();
  };

  // Handle Delete Reminder
  const handleDeleteReminder = (rem: ReminderItem) => {
    Alert.alert(
      jainLang === 'GUJARATI' ? 'રિમાઇન્ડર કાઢી નાખો' : jainLang === 'HINDI' ? 'रिमाइंडर हटाएं' : 'Delete Reminder',
      jainLang === 'GUJARATI' 
        ? `શું તમે "${rem.title}" રિમાઇન્ડર કાઢી નાખવા માંગો છો?` 
        : jainLang === 'HINDI' 
        ? `क्या आप "${rem.title}" रिमाइंडर हटाना चाहते हैं?` 
        : `Are you sure you want to delete "${rem.title}"?`,
      [
        { text: jainLang === 'GUJARATI' ? 'રદ કરો' : jainLang === 'HINDI' ? 'रद्द करें' : 'Cancel', style: 'cancel' },
        {
          text: jainLang === 'GUJARATI' ? 'કાઢી નાખો' : jainLang === 'HINDI' ? 'हटाएं' : 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteReminder(rem.id);
            await loadJainReminders();
          }
        }
      ]
    );
  };

  // Save or Update Jain Reminder
  const handleSaveJainReminder = async () => {
    if (!reminderTitle.trim()) {
      Alert.alert('Title Required', 'Please enter a reminder title.');
      return;
    }

    const itemToSave: ReminderItem = {
      id: editingReminderId || `jain_rem_${Date.now()}`,
      title: reminderTitle.trim(),
      category: 'TITHI_FESTIVAL',
      timeStr: reminderTime,
      enabled: true,
      notes: reminderNotes.trim(),
      isJain: true,
      createdAtIso: new Date().toISOString(),
      recurrence: {
        subType: 'FESTIVAL',
        festivalDharma: 'JAIN',
        tithiName: tithiName
      }
    };

    await saveReminder(itemToSave);
    await loadJainReminders();
    setShowReminderModal(false);
    setEditingReminderId(null);

    Alert.alert(
      jainLang === 'GUJARATI' ? 'રિમાઇન્ડર સેવ થયું' : jainLang === 'HINDI' ? 'रिमाइंडर सेट हुआ' : 'Reminder Saved',
      jainLang === 'GUJARATI' ? 'તમારું જૈન પર્વ / પચ્ચક્ખાણ રિમાઇન્ડર સફળતાપૂર્વક સેટ થયું છે!' : jainLang === 'HINDI' ? 'आपका जैन पर्व / पचक्खान रिमाइंडर सफलतापूर्वक सेट हो गया है!' : 'Your Jain Parva / Pachkhan reminder has been successfully saved!'
    );
  };

  // Filter Jain Festivals to show from CURRENT MONTH onwards
  const todayIsoDateStr = activeDateObj.toISOString().substring(0, 7); // e.g. "2026-09"
  const currentMonthFestivals = JAIN_FESTIVALS_FULL.filter(
    f => f.endDateIso.substring(0, 7) >= todayIsoDateStr || f.startDateIso.substring(0, 7) >= todayIsoDateStr
  );

  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 8, (StatusBar.currentHeight || 24) + 12);

  // Helper for Choghadiya type localization in Gujarati
  const getChoghadiyaNameGuj = (type: string, fallbackName: string): string => {
    switch (type) {
      case 'AMRIT': return 'અમૃત';
      case 'SHUBH': return 'શુભ';
      case 'LABH': return 'લાભ';
      case 'CHAR': return 'ચલ';
      case 'ROG': return 'રોગ';
      case 'KAAL': return 'કાલ';
      case 'UDVEG': return 'ઉદ્વેગ';
      default: return fallbackName;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4A0010" />

        {/* 1. Traditional Deep Maroon Ornate Header Banner with Sacred Lord Mahavira Symbol */}
        <View style={[styles.topBannerHeader, { paddingTop: topPadding }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtnOverlay} activeOpacity={0.8}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.bannerCenter}>
            {/* Dedicated Sacred Lord Mahavir Swami Emblem & Symbol Container */}
            <View style={styles.mahavirEmblemContainer}>
              <View style={styles.mahavirIconCircle}>
                <Text style={styles.mahavirIconText}>☸️</Text>
              </View>
              <Text style={styles.ahimsaMottoText}>
                {getTxt('॥ ણમો અરિહંતાણં ॥ જીવો અને જીવવા દો', '॥ णमो अरिहंताणं ॥ जियो और जीने दो', '॥ Namo Arihantanam ॥ Ahimsa Parmo Dharma')}
              </Text>
            </View>

            <View style={styles.titleRowHeader}>
              <View style={{ marginRight: 6, justifyContent: 'center' }}>
                <JainPrateekIcon size={20} color="#FFE082" />
              </View>
              <Text style={styles.bannerTitleGuj}>
                {getTxt('જૈન પંચાંગ', 'जैन पंचांग', 'Jain Panchang')}
              </Text>
              <Text style={styles.shreeBadge}>શ્રીં</Text>
            </View>

            <Text style={styles.bannerSubGuj}>
              {getTxt(`વીર સંવત ${toGujaratiDigits(jainDayData.viraSamvatYear)}`, `वीर संवत ${toDevanagariDigits(jainDayData.viraSamvatYear)}`, `Veer Samvat ${jainDayData.viraSamvatYear}`)} • {selectedCity.name}
            </Text>
          </View>
        </View>

        {/* 2. Language Selector Bar (Strictly 3 Languages: Hinglish | Hindi | Gujarati) */}
        <View style={styles.langBarContainer}>
          <Text style={styles.langBarLabel}>🌐 Language:</Text>
          <View style={styles.langBtnRow}>
            <TouchableOpacity
              style={[styles.langChip, jainLang === 'GUJARATI' && styles.langChipActive]}
              onPress={() => setJainLang('GUJARATI')}
            >
              <Text style={[styles.langChipText, jainLang === 'GUJARATI' && styles.langChipTextActive]}>
                ગુજરાતી
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langChip, jainLang === 'HINDI' && styles.langChipActive]}
              onPress={() => setJainLang('HINDI')}
            >
              <Text style={[styles.langChipText, jainLang === 'HINDI' && styles.langChipTextActive]}>
                हिंदी
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langChip, jainLang === 'HINGLISH' && styles.langChipActive]}
              onPress={() => setJainLang('HINGLISH')}
            >
              <Text style={[styles.langChipText, jainLang === 'HINGLISH' && styles.langChipTextActive]}>
                Hinglish
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Navigation Tabs (Jain Panchang, Pachkhan, Muhurat, Jain Vidhi, Jain Parva, Reminders) */}
        <View style={styles.tabBarWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'PANCHANG' && styles.tabBtnActive]}
              onPress={() => setActiveTab('PANCHANG')}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={[styles.tabBtnText, activeTab === 'PANCHANG' && styles.tabBtnTextActive]} numberOfLines={1}>
                {getTxt('જૈન પંચાંગ', 'जैन पंचांग', 'Jain Panchang')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'PACHKHAN' && styles.tabBtnActive]}
              onPress={() => setActiveTab('PACHKHAN')}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={[styles.tabBtnText, activeTab === 'PACHKHAN' && styles.tabBtnTextActive]} numberOfLines={1}>
                {getTxt('પચ્ચક્ખાણ', 'पचक्खान', 'Pachkhan')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'MUHURAT' && styles.tabBtnActive]}
              onPress={() => setActiveTab('MUHURAT')}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={[styles.tabBtnText, activeTab === 'MUHURAT' && styles.tabBtnTextActive]} numberOfLines={1}>
                {getTxt('મુહૂર્ત', 'मुहूर्त', 'Muhurat')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'VIDHI' && styles.tabBtnActive]}
              onPress={() => setActiveTab('VIDHI')}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={[styles.tabBtnText, activeTab === 'VIDHI' && styles.tabBtnTextActive]} numberOfLines={1}>
                {getTxt('જૈન વિધિ', 'जैन विधि', 'Jain Vidhi')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'FESTIVALS' && styles.tabBtnActive]}
              onPress={() => setActiveTab('FESTIVALS')}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={[styles.tabBtnText, activeTab === 'FESTIVALS' && styles.tabBtnTextActive]} numberOfLines={1}>
                {getTxt('જૈન પર્વ', 'जैन पर्व', 'Jain Parva')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'REMINDERS' && styles.tabBtnActive]}
              onPress={() => setActiveTab('REMINDERS')}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={[styles.tabBtnText, activeTab === 'REMINDERS' && styles.tabBtnTextActive]} numberOfLines={1}>
                ⏰ {getTxt('રિમાઇન્ડર', 'रिमाइंडर', 'Reminders')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 4. Main Scrollable Body */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Prominent Create Jain Reminder Action Button */}
          <TouchableOpacity
            style={styles.actionReminderBtn}
            onPress={() => {
              setEditingReminderId(null);
              setReminderTitle('🪔 Paryushan / Samvatsari Pachkhan Fasting');
              setReminderTime('06:30 AM');
              setReminderNotes('Chauvihar before sunset, Pachkhan & Dev Vandan');
              setShowReminderModal(true);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.actionReminderBtnText}>
              {getTxt(
                '⏰ + નવું જૈન પર્વ / પચ્ચક્ખાણ રિમાઇન્ડર ઉમેરો',
                '⏰ + नया जैन पर्व / पचक्खान रिमाइंडर जोड़ें',
                '⏰ + Add New Jain Parva / Pachkhan Reminder'
              )}
            </Text>
          </TouchableOpacity>

          {/* TAB 1: JAIN PANCHANG & ALL TIMINGS WITH REMINDER TRIGGERS */}
          {activeTab === 'PANCHANG' && (
            <View>
              {/* Dynamic Date Banner (Interactive Date Selector Trigger) */}
              <TouchableOpacity
                style={styles.todayDateBanner}
                onPress={handleOpenDatePicker}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.todayDateText}>
                    📅 {displayTodayDateStr}
                  </Text>
                </View>
                <View style={styles.changeDateChipBtn}>
                  <Text style={styles.changeDateChipText}>
                    🗓️ {getTxt('તારીખ બદલો ▾', 'तिथि बदलें ▾', 'Change Date ▾')}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Sunrise & Sunset Widget Box */}
              <View style={styles.sunMoonCardBox}>
                <View style={styles.sunTimeCol}>
                  <Text style={styles.sunIcon}>🌅</Text>
                  <View>
                    <Text style={styles.sunLabel}>
                      {getTxt('સૂર્યોદય (Sunrise)', 'सूर्योदय (Sunrise)', 'Sunrise')}
                    </Text>
                    <Text style={styles.sunTimeVal}>{sunriseStr}</Text>
                  </View>
                </View>
                <View style={styles.sunDividerCol} />
                <View style={styles.sunTimeCol}>
                  <Text style={styles.sunIcon}>🌇</Text>
                  <View>
                    <Text style={styles.sunLabel}>
                      {getTxt('સૂર્યાસ્ત (Sunset)', 'सूर्यास्त (Sunset)', 'Sunset')}
                    </Text>
                    <Text style={styles.sunTimeVal}>{sunsetStr}</Text>
                  </View>
                </View>
              </View>

              {/* Main Jain Tithi Card with Circular Gold Badge & Tithi Click for Info Modal */}
              <TouchableOpacity
                style={styles.mainTithiCard}
                onPress={() => setShowTithiInfoModal(true)}
                activeOpacity={0.85}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.tithiSubHeader}>
                      {getTxt('જૈન પંચાંગ તિથિ', 'जैन पंचांग तिथि', 'Jain Panchang Tithi')}
                    </Text>
                    {jainDayData.isParvaTithi && (
                      <View style={styles.parvaBadgeChip}>
                        <Text style={styles.parvaBadgeText}>
                          🪔 {getTxt('પર્વ તિથિ', 'पर्व तिथि', 'Parva Tithi')}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.tithiTitleBold} numberOfLines={1} adjustsFontSizeToFit>
                    {tithiName}
                  </Text>
                  <Text style={styles.tithiSamvatText}>
                    {getTxt(`સંવત ${toGujaratiDigits(jainDayData.viraSamvatYear)}`, `संवत ${toDevanagariDigits(jainDayData.viraSamvatYear)}`, `Samvat ${jainDayData.viraSamvatYear}`)}
                  </Text>

                  {/* Tithi Start and End Timing Window */}
                  <View style={styles.tithiDurationContainer}>
                    <Text style={styles.tithiDurationText}>
                      ⏱️ {getTxt('પ્રારંભ: ', 'प्रारंभ: ', 'Starts: ')}
                      {activePanchang?.tithi?.startTimeFormatted || getTxt('ગઈકાલે ૦૮:૦૩ AM', 'कल ०८:०३ AM', 'Yesterday 08:03 AM')}
                    </Text>
                    <Text style={styles.tithiDurationText}>
                      ⏳ {getTxt('સમાપ્તિ: ', 'समाप्ति: ', 'Ends: ')}
                      {activePanchang?.tithi?.endTimeFormatted || getTxt('આજે ૦૭:૧૯ AM', 'आज ०७:१९ AM', 'Today 07:19 AM')}
                    </Text>
                  </View>

                  {/* Tap to View Info Hint */}
                  <Text style={styles.tapInfoHintText}>
                    ℹ️ {getTxt('તિથિ વિગતો અને નિયમો જોવા ટેપ કરો', 'तिथि विवरण एवं नियम देखने हेतु टैप करें', 'Tap to view Tithi Rules & Guidelines')}
                  </Text>
                </View>

                {/* CIRCULAR GOLD TITHI NUMBER BADGE (e.g. 2 for Dwitiya) */}
                <View style={styles.goldCircleBadge}>
                  <Text style={styles.badgeLine1}>{getTxt('તિથિ', 'तिथि', 'Tithi')}</Text>
                  <Text style={styles.badgeLine2}>{displayTithiNumBadge}</Text>
                </View>
              </TouchableOpacity>

              {/* Today's All Pachkhan Timings Summary Box with Interactive Reminder Triggers */}
              <View style={styles.pachkhanCardBox}>
                <Text style={styles.pachkhanHeaderTitle}>
                  🥣 {getTxt('આજના પચ્ચક્ખાણ', 'आज का पचक्खान', 'Today\'s Pachkhan Timings')}
                </Text>

                {tab1PachkhanItems.map((item) => {
                  const titleStr = getTxt(item.nameGuj, item.nameHin, item.nameHing);
                  const timeStr = getTxt(item.timeObj.guj, item.timeObj.hin, item.timeObj.hing);
                  const descStr = getTxt(item.descGuj, item.descHin, item.descHing);
                  const sutraStr = item.sutraPrakrit;

                  return (
                    <TouchableOpacity
                      key={`panchang_timing_${item.id}`}
                      style={styles.pachkhanRowClickable}
                      onPress={() => handleOpenPachkhanReminder(titleStr, timeStr, descStr, sutraStr)}
                      activeOpacity={0.8}
                    >
                      <Text style={{ fontSize: 20 }}>🥣</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.pachkhanTitleText}>{titleStr}</Text>
                        <Text style={styles.pachkhanDescText}>{descStr}</Text>
                      </View>
                      <Animated.View style={[
                        styles.pachkhanRightCol,
                        !hasClickedTiming
                          ? { opacity: blinkAnim, borderWidth: 1, borderColor: '#FFD700', borderRadius: 8, padding: 2 }
                          : { opacity: 1 }
                      ]}>
                        <Text style={styles.pachkhanTimeBadge}>{timeStr}</Text>
                        <Text style={styles.setRemMiniBtn}>⏰ {getTxt('સેટ', 'सेट', 'Set')}</Text>
                      </Animated.View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Sacred Navkar Mantra Section */}
              <View style={styles.navkarMantraBox}>
                <Text style={styles.navkarTitleHeader}>
                  {getTxt('નવકાર મંત્ર', 'नवकार मंत्र', 'Shree Navkar Mantra')}
                </Text>
                <Text style={styles.navkarLineText}>
                  નમો અરિહંતાણં, નમો સિદ્ધાણં,
                </Text>
                <Text style={styles.navkarLineText}>
                  નમો આયરિયાણં, નમો ઉવજ્ઝાયાણં,
                </Text>
                <Text style={styles.navkarLineText}>
                  ણમો લોએ સવ્વ સાહૂણં ॥
                </Text>
              </View>

              {/* Upcoming Jain Festival Banner */}
              <View style={styles.upcomingFestBox}>
                <Text style={styles.upcomingFestHeader}>
                  {getTxt('આગામી તહેવાર', 'आगामी जैन पर्व', 'Upcoming Jain Festival')}
                </Text>
                <Text style={styles.festNameTitle}>
                  {getTxt('પર્યુષણ પર્વ અને સંવત્સરી', 'पर्युषण पर्व एवं संवत्सरी', 'Paryushan Parva & Samvatsari')}
                </Text>
                <Text style={styles.festDateVal}>
                  {getTxt('૦૭ સપ્ટેમ્બર થી ૧૪ સપ્ટેમ્બર ૨૦૨૬', '०७ सितंबर से १४ सितंबर २०२६', '07 Sept to 14 Sept 2026')}
                </Text>
              </View>
            </View>
          )}

          {/* TAB 2: PACHKHAN TAB - DETAILED JAIN VOWS, FORMULAS & SUTRAS */}
          {activeTab === 'PACHKHAN' && (
            <View style={styles.sectionCard}>
              <Text style={styles.cardHeaderTitle}>
                📖 {getTxt('જૈન પચ્ચક્ખાણ સૂત્ર અને આરાધના વિધિ', 'जैन पचक्खान सूत्र एवं आराधना विधि', 'Jain Pachkhan Vows & Sacred Formulas')}
              </Text>
              <Text style={{ fontSize: 12, color: '#FFECB3', marginBottom: 12 }}>
                {getTxt(
                  'દરેક પચ્ચક્ખાણ વ્રતનું વિગતવાર મહત્વ, સૂત્ર અને સમય. રિમાઇન્ડર સેટ કરવા ટેપ કરો.',
                  'प्रत्येक पचक्खान व्रत का विस्तृत महत्व, सूत्र एवं समय। रिमाइंडर सेट करने हेतु टैप करें।',
                  'Detailed information, formulas, and timing for all Pachkhan vows. Tap to set reminder.'
                )}
              </Text>

              {JAIN_PACHKHAN_VOWS_FULL.map((vow) => {
                const titleStr = getTxt(vow.nameGuj, vow.nameHin, vow.nameHing);
                const categoryStr = getTxt(vow.categoryGuj, vow.categoryHin, vow.categoryHing);
                const vowTimeObj = getVowTimeObj(vow.id);
                const releaseStr = getTxt(vowTimeObj.guj, vowTimeObj.hin, vowTimeObj.hing);
                const durationStr = getTxt(vow.durationGuj, vow.durationHin, vow.durationHing);
                const descStr = getTxt(vow.descGuj, vow.descHin, vow.descHing);
                const sutraStr = getTxt(vow.sutraGuj, vow.sutraHin, vow.sutraHing);

                return (
                  <View key={vow.id} style={styles.vowDetailCard}>
                    {/* Header Row: Title & Category Chip */}
                    <View style={styles.vowHeaderRow}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.vowTitleText}>🥣 {titleStr}</Text>
                        <View style={styles.vowCategoryChip}>
                          <Text style={styles.vowCategoryText}>🏷️ {categoryStr}</Text>
                        </View>
                      </View>
                      <View style={styles.vowReleaseBadge}>
                        <Text style={styles.vowReleaseLabel}>
                          {getTxt('પારણા / પચ્ચક્ખાણ', 'पारण / पचक्खान', 'Release Time')}
                        </Text>
                        <Text style={styles.vowReleaseTimeVal}>⏰ {releaseStr}</Text>
                      </View>
                    </View>

                    {/* Duration Row */}
                    <Text style={styles.vowDurationText}>
                      ⏱️ {getTxt('સમયગાળો: ', 'समयावधि: ', 'Duration: ')}{durationStr}
                    </Text>

                    {/* Detailed Explanation */}
                    <Text style={styles.vowDescText}>{descStr}</Text>

                    {/* Sacred Sutra / Formula Box */}
                    <View style={styles.sutraFormulaBox}>
                      <Text style={styles.sutraHeaderTitle}>
                        📜 {getTxt('પચ્ચક્ખાણ સૂત્ર (Formula):', 'पचक्खान सूत्र (Formula):', 'Pachkhan Formula (Sutra):')}
                      </Text>
                      <Text style={styles.sutraBodyText}>
                        {sutraStr}
                      </Text>
                    </View>

                    {/* Interactive Set Reminder Action Button */}
                    <TouchableOpacity
                      style={styles.vowReminderActionBtn}
                      onPress={() => handleOpenPachkhanReminder(titleStr, releaseStr, descStr, vow.sutraPrakrit)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.vowReminderActionText}>
                        ⏰ {getTxt('આ પચ્ચક્ખાણનું રિમાઇન્ડર સેટ કરો', 'इस पचक्खान का रिमाइंडर सेट करें', 'Set Reminder for this Pachkhan')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          {/* TAB 3: MUHURAT TAB (LIVE ACTIVE CHOGHADIYA, RAHU KALAM & TIMINGS) */}
          {activeTab === 'MUHURAT' && (
            <View>
              {/* 1. PROMINENT LIVE ACTIVE RUNNING CHOGHADIYA BANNER */}
              {runningChoghadiya && (
                <View style={[
                  styles.liveRunningCardBanner,
                  runningChoghadiya.isAuspicious ? styles.liveRunningGreenBg : styles.liveRunningRedBg
                ]}>
                  <View style={styles.liveBadgeHeaderRow}>
                    <View style={styles.livePulseTag}>
                      <Text style={styles.livePulseText}>
                        {runningChoghadiya.isAuspicious ? '🟢 LIVE NOW • RUNNING CHOGHADIYA' : '🔴 LIVE NOW • RUNNING CHOGHADIYA'}
                      </Text>
                    </View>
                    <View style={[styles.statusTagBadge, runningChoghadiya.isAuspicious ? styles.auspiciousTagBg : styles.inauspiciousTagBg]}>
                      <Text style={styles.statusTagText}>
                        {runningChoghadiya.isAuspicious
                          ? getTxt('શુભ સમય', 'शुभ समय', 'Auspicious')
                          : getTxt('અશુભ સમય', 'अशुभ समय', 'Inauspicious')}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.liveChoghadiyaTitle}>
                    {jainLang === 'HINDI'
                      ? runningChoghadiya.hindiName
                      : jainLang === 'HINGLISH'
                      ? runningChoghadiya.name
                      : getChoghadiyaNameGuj(runningChoghadiya.type, runningChoghadiya.name)}
                  </Text>

                  <Text style={styles.liveChoghadiyaTimeStr}>
                    ⏱️ {getTxt('હાલનો સમયગાળો: ', 'वर्तमान समय: ', 'Active Window: ')}
                    {runningChoghadiya.startTime} - {runningChoghadiya.endTime}
                  </Text>
                </View>
              )}

              {/* 2. PROMINENT LIVE ACTIVE MUHURAT / RAHU KALAM BANNER */}
              {runningMuhuratWindow && (
                <View style={[
                  styles.liveRunningCardBanner,
                  runningMuhuratWindow.isAuspicious ? styles.liveRunningGreenBg : styles.liveRunningRedBg,
                  { marginTop: 4 }
                ]}>
                  <View style={styles.liveBadgeHeaderRow}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#FFFFFF' }}>
                      {runningMuhuratWindow.isAuspicious ? '✨ LIVE ACTIVE MUHURAT WINDOW' : '⚠️ LIVE ACTIVE INAUSPICIOUS WINDOW'}
                    </Text>
                  </View>
                  <Text style={styles.liveChoghadiyaTitle}>
                    {runningMuhuratWindow.isAuspicious ? '🟢 ' : '🔴 '}
                    {jainLang === 'HINDI' ? runningMuhuratWindow.hindiName : runningMuhuratWindow.name}
                  </Text>
                  <Text style={styles.liveChoghadiyaTimeStr}>
                    ⏱️ {runningMuhuratWindow.startTime} - {runningMuhuratWindow.endTime}
                  </Text>
                  <Text style={{ fontSize: 11.5, color: '#FFFFFF', marginTop: 4, fontStyle: 'italic' }}>
                    {runningMuhuratWindow.description}
                  </Text>
                </View>
              )}

              {/* Day Choghadiya Section */}
              <View style={styles.sectionCard}>
                <Text style={styles.cardHeaderTitle}>
                  ☀️ {getTxt('દિવસના ચોઘડિયા (Day Choghadiya)', 'दिन के चौघड़िया (Day Choghadiya)', 'Day Choghadiya')}
                </Text>
                {choghadiyaData.dayChoghadiya.map((item, idx) => {
                  const isCurrent = runningChoghadiya?.name === item.name && runningChoghadiya?.startTime === item.startTime;
                  const chName = jainLang === 'HINDI'
                    ? item.hindiName
                    : jainLang === 'HINGLISH'
                    ? item.name
                    : getChoghadiyaNameGuj(item.type, item.name);

                  return (
                    <View
                      key={`day_chog_${idx}`}
                      style={[
                        styles.muhuratRowItem,
                        isCurrent && (item.isAuspicious ? styles.activeGreenBorder : styles.activeRedBorder)
                      ]}
                    >
                      <View style={styles.muhuratLeftInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={styles.choghadiyaTitleText}>
                            {item.isAuspicious ? '🟢 ' : '🔴 '}
                            {chName}
                          </Text>
                          {isCurrent && (
                            <View style={item.isAuspicious ? styles.activeGreenChip : styles.activeRedChip}>
                              <Text style={styles.activeChipText}>⚡ Running</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.muhuratTimeRange}>
                          ⏱️ {item.startTime} - {item.endTime}
                        </Text>
                      </View>
                      <View style={[styles.statusTagBadge, item.isAuspicious ? styles.auspiciousTagBg : styles.inauspiciousTagBg]}>
                        <Text style={styles.statusTagText}>
                          {item.isAuspicious
                            ? getTxt('શુભ', 'शुभ', 'Auspicious')
                            : getTxt('અશુભ', 'अशुभ', 'Inauspicious')}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Night Choghadiya Section */}
              <View style={styles.sectionCard}>
                <Text style={styles.cardHeaderTitle}>
                  🌙 {getTxt('રાત્રિના ચોઘડિયા (Night Choghadiya)', 'रात्रि के चौघड़िया (Night Choghadiya)', 'Night Choghadiya')}
                </Text>
                {choghadiyaData.nightChoghadiya.map((item, idx) => {
                  const isCurrent = runningChoghadiya?.name === item.name && runningChoghadiya?.startTime === item.startTime;
                  const chName = jainLang === 'HINDI'
                    ? item.hindiName
                    : jainLang === 'HINGLISH'
                    ? item.name
                    : getChoghadiyaNameGuj(item.type, item.name);

                  return (
                    <View
                      key={`night_chog_${idx}`}
                      style={[
                        styles.muhuratRowItem,
                        isCurrent && (item.isAuspicious ? styles.activeGreenBorder : styles.activeRedBorder)
                      ]}
                    >
                      <View style={styles.muhuratLeftInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={styles.choghadiyaTitleText}>
                            {item.isAuspicious ? '🟢 ' : '🔴 '}
                            {chName}
                          </Text>
                          {isCurrent && (
                            <View style={item.isAuspicious ? styles.activeGreenChip : styles.activeRedChip}>
                              <Text style={styles.activeChipText}>⚡ Running</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.muhuratTimeRange}>
                          ⏱️ {item.startTime} - {item.endTime}
                        </Text>
                      </View>
                      <View style={[styles.statusTagBadge, item.isAuspicious ? styles.auspiciousTagBg : styles.inauspiciousTagBg]}>
                        <Text style={styles.statusTagText}>
                          {item.isAuspicious
                            ? getTxt('શુભ', 'शुभ', 'Auspicious')
                            : getTxt('અશુભ', 'अशुभ', 'Inauspicious')}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Auspicious & Inauspicious Times Section */}
              <View style={styles.sectionCard}>
                <Text style={styles.cardHeaderTitle}>
                  ✨ {getTxt('શુભ અને અશુભ સમયગાળો', 'शुभ एवं अशुभ समयावधि', 'Auspicious & Inauspicious Windows')}
                </Text>

                {/* Auspicious Muhurats */}
                <Text style={styles.muhuratSubHeading}>
                  💚 {getTxt('શુભ સમય (Auspicious Times)', 'शुभ समय (Auspicious Times)', 'Auspicious Times')}
                </Text>
                {muhuratData.auspicious.map((m, idx) => {
                  const isCurrent = isTimeBetween(currentNowMinutes, m.startTime, m.endTime);
                  const mName = jainLang === 'HINDI' ? m.hindiName : m.name;
                  return (
                    <View key={`ausp_${idx}`} style={[styles.muhuratWindowRow, isCurrent && styles.activeGreenBorder]}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={styles.windowTitleText}>🟢 {mName}</Text>
                          {isCurrent && (
                            <View style={styles.activeGreenChip}>
                              <Text style={styles.activeChipText}>⚡ Active Now</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.windowTimeText}>⏱️ {m.startTime} - {m.endTime}</Text>
                        <Text style={styles.windowDescText}>{m.description}</Text>
                      </View>
                    </View>
                  );
                })}

                {/* Inauspicious Muhurats */}
                <Text style={[styles.muhuratSubHeading, { marginTop: 14 }]}>
                  ⚠️ {getTxt('અશુભ સમયગાળો (Inauspicious Times - Rahu Kalam)', 'अशुभ समयावधि (Inauspicious Times - Rahu Kalam)', 'Inauspicious Windows (Rahu Kalam)')}
                </Text>
                {muhuratData.inauspicious.map((m, idx) => {
                  const isCurrent = isTimeBetween(currentNowMinutes, m.startTime, m.endTime);
                  const mName = jainLang === 'HINDI' ? m.hindiName : m.name;
                  return (
                    <View key={`inausp_${idx}`} style={[styles.muhuratWindowRow, isCurrent && styles.activeRedBorder]}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={[styles.windowTitleText, { color: '#FF8A80' }]}>🔴 {mName}</Text>
                          {isCurrent && (
                            <View style={styles.activeRedChip}>
                              <Text style={styles.activeChipText}>⚡ Active Now (Rahu Kalam)</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.windowTimeText}>⏱️ {m.startTime} - {m.endTime}</Text>
                        <Text style={styles.windowDescText}>{m.description}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* TAB 4: JAIN VIDHI & GUIDELINES */}
          {activeTab === 'VIDHI' && (
            <View>
              <Text style={styles.sectionHeaderTitle}>📿 {getTxt('જૈન ધર્મ વિધિ અને નિત્ય સાધના', 'जैन धर्म विधि एवं नित्य साधना', 'Jain Vidhi & Daily Guidelines')}</Text>

              <View style={styles.sectionCard}>
                <Text style={styles.cardHeaderTitle}>🌸 {getTxt('દેવ વંદન અને જિન પૂજા વિધિ', 'देव वंदन एवं जिन पूजा विधि', 'Dev Vandan & Jin Puja Vidhi')}</Text>
                <Text style={styles.vidhiBodyText}>
                  {getTxt(
                    'પ્રાતઃકાલે સ્નાન બાદ શુદ્ધ વસ્ત્રો ધારણ કરી જિન મંદિર જઈ તીર્થંકર પરમાત્માના દર્શન-પૂજન કરવા. અષ્ટપ્રકારી પૂજા (જલ, ચંદન, પુષ્પ, ધૂપ, દીપ, અક્ષત, નૈવેદ્ય, ફલ) દ્વારા આત્મશુદ્ધિ કરવી.',
                    'प्रातःकाल स्नान के पश्चात शुद्ध वस्त्र धारण कर जिन मंदिर जाकर तीर्थंकर परमात्मा का दर्शन-पूजन करें। अष्टप्रकारी पूजा (जल, चंदन, पुष्प, धूप, दीप, अक्षत, नैवेद्य, फल) द्वारा आत्मशुद्धि करें।',
                    'Visit the Jin Mandir in pure clothes after morning bath for Tirthankara Darshan & Ashtaprakari Puja (Jal, Chandan, Pushpa, Dhup, Dip, Akshat, Naivedya, Phal).'
                  )}
                </Text>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.cardHeaderTitle}>🥣 {getTxt('પચ્ચક્ખાણ અને આરાધના વિધિ', 'पचक्खान एवं आराधना विधि', 'Pachkhan & Fasting Rules')}</Text>
                <Text style={styles.vidhiBodyText}>
                  {getTxt(
                    '• નવકારશી: સૂર્યોદયના ૪૮ મિનિટ પછી નવકાર મંત્ર ગણી જલ-આહાર ગ્રહણ કરવો.\n• એકાસણું: દિવસમાં માત્ર એક જ વાર એક જ આસને બેસી સાત્વિક ભોજન ગ્રહણ કરવું.\n• ઉપવાસ: સૂર્યોદયથી આગામી સૂર્યોદય સુધી ચાર આહારનો ત્યાગ કરી જપ-ધ્યાન કરવું.',
                    '• नवकारशी: सूर्योदय के ४८ मिनट बाद नवकार मंत्र गिनकर जल-आहार ग्रहण करें।\n• एकासन: दिन में केवल एक बार एक ही आसन पर बैठकर सात्विक भोजन ग्रहण करें।\n• उपवास: सूर्योदय से अगले सूर्योदय तक चार आहार का त्याग कर जप-ध्यान करें।',
                    '• Navkarshi: Eat 48 mins after sunrise with Navkar Mantra.\n• Ekasana: Take pure satvik food only once a day sitting on one seat.\n• Upvas: Complete 24-hr fasting abstaining from all foods till next sunrise.'
                  )}
                </Text>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.cardHeaderTitle}>🌿 {getTxt('અહિંસા આહાર અને કંદમૂળ ત્યાગ', 'अहिंसा आहार एवं कंदमूल त्याग', 'Ahimsa Diet & Root Vegetable Abstinence')}</Text>
                <Text style={styles.vidhiBodyText}>
                  {getTxt(
                    'જૈન દર્શન અનુસાર જમીનની અંદર ઊગતા કંદમૂળ (બટાટા, કાંદા, લસણ, ગાજર) માં અનંત કાય જીવ હોય છે, તેથી તેમનો સંપૂર્ણ ત્યાગ કરવો. રાત્રિ ભોજન (સૂર્યાસ્ત બાદ આહાર) અહિંસા વ્રત માટે વર્જિત છે.',
                    'जैन दर्शन अनुसार जमीन के नीचे उगने वाले कंदमूल (आलू, प्याज, लहसुन, गाजर) में अनंत काय जीव होते हैं, अतः उनका संपूर्ण त्याग करें। रात्रि भोजन (सूर्यास्त के बाद आहार) अहिंसा व्रत हेतु वर्जित है।',
                    'Abstain completely from root vegetables (potatoes, onions, garlic) and avoid eating after sunset (Ratri Bhojan Tyag) to uphold Ahimsa.'
                  )}
                </Text>
              </View>
            </View>
          )}

          {/* TAB 5: JAIN FESTIVALS (CURRENT MONTH ONWARDS & TAP-TO-SET REMINDER) */}
          {activeTab === 'FESTIVALS' && (
            <View>
              <Text style={styles.sectionHeaderTitle}>
                🎉 {getTxt('જૈન પર્વ અને તહેવારો (ચાલુ મહિનાથી)', 'जैन पर्व एवं त्योहार (वर्तमान माह से)', 'Jain Festivals (From Current Month)')}
              </Text>
              {currentMonthFestivals.map((item) => (
                <View key={item.id} style={styles.festivalCard}>
                  <View style={styles.festivalTopRow}>
                    <Text style={styles.festivalNameText}>
                      ☸️ {getTxt(item.nameGuj, item.nameHin, item.nameHing)}
                    </Text>
                    <Text style={styles.festivalDateBadge}>
                      {getTxt(item.dateStrGuj, item.dateStrHin, item.dateStrHing)}
                    </Text>
                  </View>
                  <Text style={styles.festivalTithiText}>
                    {getTxt('તિથિ: ', 'तिथि: ', 'Tithi: ')}
                    {getTxt(item.tithiGuj, item.tithiHin, item.tithiHing)}
                  </Text>
                  <Text style={styles.festivalSignificText}>
                    {getTxt(item.significanceGuj, item.significanceHin, item.significanceHing)}
                  </Text>

                  {/* Tap-to-set Festival Reminder Action Button */}
                  <TouchableOpacity
                    style={styles.festReminderActionBtn}
                    onPress={() => handleOpenFestivalReminder(item)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.festReminderActionText}>
                      ⏰ {getTxt('આ પર્વનું રિમાઇન્ડર સેટ કરો', 'इस पर्व का रिमाइंडर सेट करें', 'Set Reminder for this Festival')}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* TAB 6: DEDICATED JAIN REMINDERS SOLO MANAGER (VIEW, EDIT, DELETE) */}
          {activeTab === 'REMINDERS' && (
            <View>
              <View style={styles.remindersHeaderRow}>
                <Text style={styles.sectionHeaderTitle}>
                  ⏰ {getTxt('તમારા સેટ કરેલા જૈન રિમાઇન્ડર', 'आपके सेट किए गए जैन रिमाइंडर', 'Your Saved Jain Reminders')}
                </Text>
                <Text style={styles.remindersCountBadge}>
                  {jainReminders.length} {getTxt('સક્રિય', 'सक्रिय', 'Active')}
                </Text>
              </View>

              {jainReminders.length === 0 ? (
                <View style={styles.emptyRemindersBox}>
                  <View style={{ marginBottom: 12, alignItems: 'center' }}>
                    <JainPrateekIcon size={44} color="#FFE082" />
                  </View>
                  <Text style={styles.emptyRemindersTitle}>
                    {getTxt('કોઈ જૈન રિમાઇન્ડર ઉમેરેલ નથી', 'कोई जैन रिमाइंडर जोड़ा नहीं गया', 'No Jain Reminders Saved Yet')}
                  </Text>
                  <Text style={styles.emptyRemindersSub}>
                    {getTxt(
                      'ઉપર અથવા પર્વ ટેબ પરથી પચ્ચક્ખાણ, તિથિ અથવા પર્વ માટે રિમાઇન્ડર સેટ કરો.',
                      'ऊपर या पर्व टैब से पचक्खान, तिथि या पर्व हेतु रिमाइंडर सेट करें।',
                      'Tap above or from the Parva tab to set a Pachkhan, Tithi, or Festival reminder.'
                    )}
                  </Text>
                </View>
              ) : (
                jainReminders.map(rem => (
                  <View key={rem.id} style={styles.jainReminderItemCard}>
                    <View style={styles.jainRemCardHeader}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.jainRemTitle}>{rem.title}</Text>
                        <Text style={styles.jainRemCategory}>
                          🪔 {getTxt('જૈન પર્વ / પચ્ચક્ખાણ', 'जैन पर्व / पचक्खान', 'Jain Parva / Pachkhan')}
                        </Text>
                      </View>
                      <View style={styles.jainRemTimeBadge}>
                        <Text style={styles.jainRemTimeText}>⏰ {rem.timeStr}</Text>
                      </View>
                    </View>

                    {rem.notes ? (
                      <Text style={styles.jainRemNotes}>📝 {rem.notes}</Text>
                    ) : null}

                    {/* Action Bar: Toggle Switch | Edit Button | Delete Button */}
                    <View style={styles.jainRemActionsRow}>
                      <View style={styles.toggleRowLeft}>
                        <Switch
                          value={rem.enabled}
                          onValueChange={() => handleToggleReminder(rem.id)}
                          trackColor={{ false: '#777777', true: '#FFE082' }}
                          thumbColor={rem.enabled ? '#4A0012' : '#F4F4F4'}
                        />
                        <Text style={styles.toggleStateText}>
                          {rem.enabled 
                            ? getTxt('ચાલુ (ON)', 'चालू (ON)', 'Active (ON)')
                            : getTxt('બંધ (OFF)', 'बंद (OFF)', 'Disabled (OFF)')}
                        </Text>
                      </View>

                      <View style={styles.jainRemBtnGroup}>
                        {/* Edit Button */}
                        <TouchableOpacity
                          style={styles.editBtnChip}
                          onPress={() => handleOpenEditReminder(rem)}
                          activeOpacity={0.8}
                        >
                          <Text style={{ fontSize: 11 }}>✏️</Text>
                          <Text style={styles.editBtnText}>{getTxt('એડિટ', 'एडिट', 'Edit')}</Text>
                        </TouchableOpacity>

                        {/* Delete Button */}
                        <TouchableOpacity
                          style={styles.deleteBtnChip}
                          onPress={() => handleDeleteReminder(rem)}
                          activeOpacity={0.8}
                        >
                          <Text style={{ fontSize: 11 }}>🗑️</Text>
                          <Text style={styles.deleteBtnText}>{getTxt('ડિલીટ', 'डिलीट', 'Delete')}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

        </ScrollView>

        {/* 5. Tithi Info Popup Modal (Comprehensive Jain Guidelines) */}
        {showTithiInfoModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.tithiInfoContainer}>
              <View style={styles.reminderFormHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reminderFormTitle}>
                    🪔 {tithiName}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                    {getTxt(`સંવત ${toGujaratiDigits(jainDayData.viraSamvatYear)}`, `संवत ${toDevanagariDigits(jainDayData.viraSamvatYear)}`, `Veer Samvat ${jainDayData.viraSamvatYear}`)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowTithiInfoModal(false)} style={styles.formCloseBtn}>
                  <Text style={styles.formCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
                {/* Fasting & Category Status Badge */}
                <View style={styles.tithiCategoryBadgeRow}>
                  <View style={[styles.statusTagBadge, jainDayData.isParvaTithi ? styles.auspiciousTagBg : styles.mixedTagBg]}>
                    <Text style={styles.statusTagText}>
                      {jainDayData.isParvaTithi
                        ? getTxt('🪔 પર્વ તિથિ / તપ દિવસ', '🪔 पर्व तिथि / तप दिवस', '🪔 Sacred Fasting Day')
                        : getTxt('✨ શુભ જૈન તિથિ', '✨ शुभ जैन तिथि', '✨ Sacred Jain Tithi')}
                    </Text>
                  </View>
                </View>

                {/* Tithi Specific Guidelines */}
                {jainDayData.pachkhanInfo ? (
                  <View style={styles.infoHighlightBox}>
                    <Text style={styles.infoHighlightTitle}>
                      🥣 {getTxt('આરાધના અને પચ્ચક્ખાણ વિગત', 'आराधना एवं पचक्खान विवरण', 'Fasting & Pachkhan Details')}
                    </Text>
                    <Text style={styles.infoHighlightBody}>
                      {jainDayData.pachkhanInfo}
                    </Text>
                  </View>
                ) : null}

                {/* Green & Root Vegetable Restriction Notice */}
                <View style={styles.dietRuleBox}>
                  <Text style={styles.dietRuleTitle}>
                    🥬 {getTxt('અભક્ષ્ય ત્યાગ અને આહાર નિયમ', 'अभक्ष्य त्याग एवं आहार नियम', 'Dietary Restrictions (Abhakshya Tyag)')}
                  </Text>
                  <Text style={styles.dietRuleBody}>
                    {jainDayData.isParvaTithi
                      ? getTxt(
                          'આ પર્વ તિથિએ લીલોતરી શાકભાજી (લીલા મરચાં, કોથમરી, પાલક) તેમજ કંદમૂળ (બટાટા, કાંદા, લસણ) નો સજ્જડ ત્યાગ કરવો.',
                          'इस पर्व तिथि पर हरी सब्जियां (हरी मिर्च, धनिया, पालक) एवं कंदमूल (आलू, प्याज, लहसुन) का पूर्ण त्याग करें।',
                          'Strictly refrain from consuming green vegetables and root foods (potatoes, onions, garlic) on this Parva day.'
                        )
                      : getTxt(
                          'સદા અહિંસક સાત્વિક આહાર ગ્રહણ કરવો અને રાત્રિ ભોજનનો ત્યાગ રાખવો.',
                          'सदा अहिंसक सात्विक आहार ग्रहण करें एवं रात्रि भोजन का त्याग रखें।',
                          'Consume satvik Ahimsa diet and avoid eating after sunset (Ratri Bhojan Tyag).'
                        )}
                  </Text>
                </View>

                {/* Religious Practices List */}
                <Text style={styles.infoSectionHeader}>
                  📿 {getTxt('આજના ધાર્મિક કર્તવ્યો', 'आज के धार्मिक कर्तव्य', 'Today\'s Spiritual Guidelines')}
                </Text>
                {jainDayData.religiousActivities.map((act, i) => (
                  <View key={`act_${i}`} style={styles.activityRow}>
                    <Text style={styles.activityBullet}>•</Text>
                    <Text style={styles.activityText}>{act}</Text>
                  </View>
                ))}

                {/* Chaturmas Status */}
                {jainDayData.isInChaturmas ? (
                  <View style={styles.chaturmasNoticeBox}>
                    <Text style={styles.chaturmasNoticeText}>
                      {jainDayData.chaturmasStatus}
                    </Text>
                  </View>
                ) : null}
              </ScrollView>

              <TouchableOpacity style={styles.saveReminderActionBtn} onPress={() => setShowTithiInfoModal(false)}>
                <Text style={styles.saveReminderActionBtnText}>
                  ✓ {getTxt('બંધ કરો', 'बंद करें', 'Close')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 6. Interactive Create / Edit Jain Reminder Overlay */}
        {showReminderModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.reminderFormContainer}>
              <View style={styles.reminderFormHeader}>
                <Text style={styles.reminderFormTitle}>
                  {editingReminderId ? '✏️ ' : '⏰ '}
                  {editingReminderId
                    ? getTxt('જૈન રિમાઇન્ડર એડિટ કરો', 'जैन रिमाइंडर एडिट करें', 'Edit Jain Reminder')
                    : getTxt('જૈન પર્વ રિમાઇન્ડર બનાવો', 'जैन पर्व रिमाइंडर बनाएं', 'Create Jain Reminder')}
                </Text>
                <TouchableOpacity onPress={() => setShowReminderModal(false)} style={styles.formCloseBtn}>
                  <Text style={styles.formCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 400 }}>
                <Text style={styles.inputLabel}>
                  {getTxt('રિમાઇન્ડર શીર્ષક (Title):', 'रिमाइंडर शीर्षक (Title):', 'Reminder Title:')}
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={reminderTitle}
                  onChangeText={setReminderTitle}
                  placeholder="Enter reminder title"
                  placeholderTextColor="#888"
                />

                <Text style={styles.inputLabel}>
                  {getTxt('સમય (Time):', 'समय (Time):', 'Reminder Time:')}
                </Text>
                <TouchableOpacity style={styles.timeSelectBtn} onPress={() => setShowTimePicker(true)}>
                  <Text style={styles.timeSelectBtnText}>⏰ {reminderTime}</Text>
                </TouchableOpacity>

                <Text style={styles.inputLabel}>
                  {getTxt('નોંધ અને વિગતો (Notes & Sutra):', 'टिप्पणी एवं विवरण (Notes & Sutra):', 'Notes & Sutra Details:')}
                </Text>
                <TextInput
                  style={[styles.textInput, { height: 90, textAlignVertical: 'top' }]}
                  multiline
                  value={reminderNotes}
                  onChangeText={setReminderNotes}
                  placeholder="Enter custom notes"
                  placeholderTextColor="#888"
                />
              </ScrollView>

              <TouchableOpacity style={styles.saveReminderActionBtn} onPress={handleSaveJainReminder}>
                <Text style={styles.saveReminderActionBtnText}>
                  ✓ {editingReminderId
                    ? getTxt('અપડેટ કરો', 'अपडेट करें', 'Update Reminder')
                    : getTxt('રિમાઇન્ડર સેવ કરો', 'रिमाइंडर सेव करें', 'Save Jain Reminder')}
                </Text>
              </TouchableOpacity>
            </View>

            <TimePickerModal
              visible={showTimePicker}
              initialTimeStr={reminderTime}
              onClose={() => setShowTimePicker(false)}
              onConfirm={(t: string) => setReminderTime(t)}
            />
          </View>
        )}

        {/* 7. Interactive Date Selection Modal (Year, Month, Date Picker) */}
        {showJainDatePickerModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <Text style={styles.datePickerTitle}>
                  🗓️ {getTxt('તારીખ પસંદ કરો (Select Date)', 'तिथि चयन करें (Select Date)', 'Select Date')}
                </Text>
                <TouchableOpacity onPress={() => setShowJainDatePickerModal(false)} style={styles.formCloseBtn}>
                  <Text style={styles.formCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
                {/* Year Stepper & Display */}
                <Text style={styles.pickerSectionLabel}>
                  📅 {getTxt('વર્ષ (Year):', 'वर्ष (Year):', 'Select Year:')}
                </Text>
                <View style={styles.yearStepperRow}>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => setTempYear(prev => prev - 1)}>
                    <Text style={styles.stepperText}>◀ {tempYear - 1}</Text>
                  </TouchableOpacity>
                  <View style={styles.yearBox}>
                    <Text style={styles.yearBoxText}>{tempYear}</Text>
                  </View>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => setTempYear(prev => prev + 1)}>
                    <Text style={styles.stepperText}>{tempYear + 1} ▶</Text>
                  </TouchableOpacity>
                </View>

                {/* Quick Year Chips */}
                <View style={styles.yearChipRow}>
                  {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(y => (
                    <TouchableOpacity
                      key={`yr_${y}`}
                      style={[styles.yearChip, tempYear === y && styles.yearChipActive]}
                      onPress={() => setTempYear(y)}
                    >
                      <Text style={[styles.yearChipText, tempYear === y && styles.yearChipTextActive]}>{y}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Month Selector Grid */}
                <Text style={styles.pickerSectionLabel}>
                  🌙 {getTxt('મહિનો (Month):', 'माह (Month):', 'Select Month:')}
                </Text>
                <View style={styles.monthGrid}>
                  {monthNamesEng.map((mName, mIdx) => {
                    const label = getTxt(monthNamesGuj[mIdx], monthNamesHin[mIdx], mName);
                    const isActive = tempMonth === mIdx;
                    return (
                      <TouchableOpacity
                        key={`mo_${mIdx}`}
                        style={[styles.monthTile, isActive && styles.monthTileActive]}
                        onPress={() => setTempMonth(mIdx)}
                      >
                        <Text style={[styles.monthTileText, isActive && styles.monthTileTextActive]} numberOfLines={1}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Day Selector Grid */}
                <Text style={styles.pickerSectionLabel}>
                  ☀️ {getTxt('તારીખ (Day):', 'दिनांक (Day):', 'Select Day:')}
                </Text>
                <View style={styles.dayGrid}>
                  {Array.from({ length: new Date(tempYear, tempMonth + 1, 0).getDate() }, (_, i) => i + 1).map(d => {
                    const isActive = tempDay === d;
                    const dDisplay = getTxt(toGujaratiDigits(d), toDevanagariDigits(d), String(d));
                    return (
                      <TouchableOpacity
                        key={`dy_${d}`}
                        style={[styles.dayTile, isActive && styles.dayTileActive]}
                        onPress={() => setTempDay(d)}
                      >
                        <Text style={[styles.dayTileText, isActive && styles.dayTileTextActive]}>
                          {dDisplay}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              {/* Action Row: Reset to Today & Apply */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity style={styles.resetBtn} onPress={handleResetToTodayDate}>
                  <Text style={styles.resetBtnText}>
                    🔄 {getTxt('આજે (Today)', 'आज (Today)', 'Today')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyBtn} onPress={() => handleApplyDatePicker(tempDay, tempMonth, tempYear)}>
                  <Text style={styles.applyBtnText}>
                    ✓ {getTxt('તારીખ લાગુ કરો', 'तिथि लागू करें', 'Apply Date')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E000C'
  },
  topBannerHeader: {
    backgroundColor: '#580017',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
    position: 'relative'
  },
  closeBtnOverlay: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16
  },
  bannerCenter: {
    alignItems: 'center'
  },
  mahavirEmblemContainer: {
    alignItems: 'center',
    marginBottom: 4
  },
  mahavirIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE082',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    marginBottom: 2
  },
  mahavirIconText: {
    fontSize: 18
  },
  ahimsaMottoText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFE082',
    letterSpacing: 0.5
  },
  titleRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2
  },
  bannerIcon: {
    fontSize: 24
  },
  shreeBadge: {
    backgroundColor: '#FFE082',
    color: '#580017',
    fontWeight: 'bold',
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD700'
  },
  bannerTitleGuj: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFE082',
    letterSpacing: 0.5
  },
  bannerSubGuj: {
    fontSize: 13,
    color: '#FFECB3',
    fontWeight: '600',
    marginTop: 2
  },
  langBarContainer: {
    backgroundColor: '#4A0012',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#70001D'
  },
  langBarLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFE082'
  },
  langBtnRow: {
    flexDirection: 'row',
    gap: 6
  },
  langChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,224,130,0.3)'
  },
  langChipActive: {
    backgroundColor: '#FFE082',
    borderColor: '#FFD700'
  },
  langChipText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFECB3'
  },
  langChipTextActive: {
    color: '#4A0012'
  },
  tabBarWrapper: {
    backgroundColor: '#2A0008',
    borderBottomWidth: 1,
    borderBottomColor: '#580017',
    zIndex: 10,
    elevation: 5
  },
  tabScrollContent: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center'
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 4
  },
  tabBtnActive: {
    backgroundColor: '#70001D'
  },
  tabBtnText: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#FFECB3',
    textAlign: 'center'
  },
  tabBtnTextActive: {
    color: '#FFE082'
  },
  scrollContent: {
    padding: 14
  },
  actionReminderBtn: {
    backgroundColor: '#FFE082',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#FFD700',
    elevation: 3
  },
  actionReminderBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4A0012'
  },
  todayDateBanner: {
    backgroundColor: '#2D0009',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#600018',
    marginBottom: 12
  },
  todayDateText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  sunMoonCardBox: {
    backgroundColor: '#4E0013',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#70001D',
    marginBottom: 14
  },
  sunTimeCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center'
  },
  sunDividerCol: {
    width: 1,
    height: 32,
    backgroundColor: '#70001D'
  },
  sunIcon: {
    fontSize: 22
  },
  sunLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFECB3'
  },
  sunTimeVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2
  },
  mainTithiCard: {
    backgroundColor: '#500014',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFE082',
    marginBottom: 14
  },
  tithiSubHeader: {
    fontSize: 13,
    color: '#FFECB3',
    fontWeight: '600'
  },
  parvaBadgeChip: {
    backgroundColor: '#FFE082',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  parvaBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4A0012'
  },
  tithiTitleBold: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFE082',
    marginTop: 2
  },
  tithiSamvatText: {
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: 4,
    fontWeight: '600'
  },
  tithiDurationContainer: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,224,130,0.2)'
  },
  tithiDurationText: {
    fontSize: 11.5,
    color: '#FFECB3',
    fontWeight: '600',
    lineHeight: 18
  },
  tapInfoHintText: {
    fontSize: 10.5,
    color: '#FFE082',
    marginTop: 6,
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  goldCircleBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#FFE082',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,224,130,0.1)'
  },
  badgeLine1: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFE082'
  },
  badgeLine2: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  pachkhanCardBox: {
    backgroundColor: '#440010',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#68001A',
    marginBottom: 14
  },
  pachkhanHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFE082',
    textAlign: 'center',
    marginBottom: 12
  },
  pachkhanRowClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#36000D',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,224,130,0.15)'
  },
  pachkhanTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFE082'
  },
  pachkhanDescText: {
    fontSize: 11,
    color: '#FFECB3',
    marginTop: 2
  },
  pachkhanRightCol: {
    alignItems: 'flex-end',
    gap: 4
  },
  pachkhanTimeBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A0012',
    backgroundColor: '#FFE082',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  setRemMiniBtn: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFE082',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  vowDetailCard: {
    backgroundColor: '#38000E',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#6A001A'
  },
  vowHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  vowTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFE082'
  },
  vowCategoryChip: {
    backgroundColor: 'rgba(255,224,130,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4
  },
  vowCategoryText: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#FFECB3'
  },
  vowReleaseBadge: {
    backgroundColor: '#FFE082',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'flex-end'
  },
  vowReleaseLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#580017'
  },
  vowReleaseTimeVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A0012',
    marginTop: 1
  },
  vowDurationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFECB3',
    marginBottom: 6
  },
  vowDescText: {
    fontSize: 12.5,
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 10
  },
  sutraFormulaBox: {
    backgroundColor: '#260009',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#70001D',
    marginBottom: 10
  },
  sutraHeaderTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFE082',
    marginBottom: 4
  },
  sutraBodyText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFECB3',
    lineHeight: 20
  },
  vowReminderActionBtn: {
    backgroundColor: '#FFE082',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center'
  },
  vowReminderActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A0012'
  },
  muhuratRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#38000E',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#580017'
  },
  muhuratLeftInfo: {
    flex: 1
  },
  choghadiyaTitleText: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#FFE082'
  },
  muhuratTimeRange: {
    fontSize: 11.5,
    color: '#FFECB3',
    marginTop: 2
  },
  statusTagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  auspiciousTagBg: {
    backgroundColor: '#2E7D32'
  },
  inauspiciousTagBg: {
    backgroundColor: '#C62828'
  },
  mixedTagBg: {
    backgroundColor: '#EF6C00'
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  muhuratSubHeading: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#FFE082',
    marginBottom: 8,
    marginTop: 4
  },
  muhuratWindowRow: {
    backgroundColor: '#38000E',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#580017'
  },
  windowTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#A5D6A7'
  },
  windowTimeText: {
    fontSize: 11.5,
    color: '#FFECB3',
    fontWeight: '600',
    marginTop: 2
  },
  windowDescText: {
    fontSize: 11,
    color: '#E0E0E0',
    marginTop: 2,
    lineHeight: 15
  },
  navkarMantraBox: {
    backgroundColor: '#34000D',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#580017',
    marginBottom: 14
  },
  navkarTitleHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFE082',
    marginBottom: 10
  },
  navkarLineText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22
  },
  upcomingFestBox: {
    backgroundColor: '#2D0009',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#70001D'
  },
  upcomingFestHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFE082',
    marginBottom: 4
  },
  festNameTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  festDateVal: {
    fontSize: 13,
    color: '#FFECB3',
    marginTop: 4,
    fontWeight: '600'
  },
  sectionCard: {
    backgroundColor: '#4A0012',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#6A001A'
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFE082',
    marginBottom: 10
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFE082',
    marginBottom: 10,
    marginTop: 4
  },
  vidhiBodyText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 20
  },
  festivalCard: {
    backgroundColor: '#4A0012',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#6A001A'
  },
  festivalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  festivalNameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFE082',
    flex: 1,
    marginRight: 8
  },
  festivalDateBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4A0012',
    backgroundColor: '#FFE082',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  festivalTithiText: {
    fontSize: 12,
    color: '#FFECB3',
    fontWeight: 'bold',
    marginTop: 4
  },
  festivalSignificText: {
    fontSize: 11,
    color: '#E0E0E0',
    marginTop: 4,
    lineHeight: 16
  },
  festReminderActionBtn: {
    backgroundColor: '#FFE082',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 10
  },
  festReminderActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A0012'
  },
  remindersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  remindersCountBadge: {
    backgroundColor: '#FFE082',
    color: '#4A0012',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  emptyRemindersBox: {
    backgroundColor: '#4A0012',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6A001A'
  },
  emptyRemindersIcon: {
    fontSize: 36,
    marginBottom: 8
  },
  emptyRemindersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFE082',
    marginBottom: 6
  },
  emptyRemindersSub: {
    fontSize: 12,
    color: '#FFECB3',
    textAlign: 'center',
    lineHeight: 18
  },
  jainReminderItemCard: {
    backgroundColor: '#4A0012',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#70001D'
  },
  jainRemCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  jainRemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFE082'
  },
  jainRemCategory: {
    fontSize: 11,
    color: '#FFECB3',
    marginTop: 2
  },
  jainRemTimeBadge: {
    backgroundColor: '#FFE082',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  jainRemTimeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A0012'
  },
  jainRemNotes: {
    fontSize: 12,
    color: '#E0E0E0',
    marginTop: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 6,
    borderRadius: 6
  },
  jainRemActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)'
  },
  toggleRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1
  },
  toggleStateText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFECB3'
  },
  jainRemBtnGroup: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 0
  },
  editBtnChip: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexShrink: 0
  },
  editBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#E65100'
  },
  deleteBtnChip: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexShrink: 0
  },
  deleteBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#D32F2F'
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
    zIndex: 999
  },
  tithiInfoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    elevation: 10
  },
  tithiCategoryBadgeRow: {
    alignItems: 'flex-start',
    marginBottom: 10
  },
  infoHighlightBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFE082'
  },
  infoHighlightTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4
  },
  infoHighlightBody: {
    fontSize: 12,
    color: '#424242',
    lineHeight: 18
  },
  dietRuleBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFCDD2'
  },
  dietRuleTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 4
  },
  dietRuleBody: {
    fontSize: 12,
    color: '#333333',
    lineHeight: 18
  },
  infoSectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginTop: 6,
    marginBottom: 8
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6
  },
  activityBullet: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  activityText: {
    fontSize: 12.5,
    color: '#333333',
    flex: 1,
    lineHeight: 18
  },
  chaturmasNoticeBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#A5D6A7'
  },
  chaturmasNoticeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center'
  },
  reminderFormContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    elevation: 10
  },
  reminderFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 10
  },
  reminderFormTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  formCloseBtn: {
    padding: 4
  },
  formCloseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555555'
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 10,
    marginBottom: 4
  },
  textInput: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#222222'
  },
  timeSelectBtn: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFE082',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center'
  },
  timeSelectBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E65100'
  },
  saveReminderActionBtn: {
    backgroundColor: Colors.maroon,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16
  },
  saveReminderActionBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  changeDateChipBtn: {
    backgroundColor: '#FFE082',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700'
  },
  changeDateChipText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#4A0012'
  },
  datePickerContainer: {
    width: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    elevation: 10
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 10
  },
  datePickerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  pickerSectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555555',
    marginTop: 10,
    marginBottom: 6
  },
  yearStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  stepperBtn: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  stepperText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  yearBox: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10
  },
  yearBoxText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFE082'
  },
  yearChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8
  },
  yearChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F0F0F0'
  },
  yearChipActive: {
    backgroundColor: Colors.maroon
  },
  yearChipText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '600'
  },
  yearChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8
  },
  monthTile: {
    width: '23%',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F5F5F5'
  },
  monthTileActive: {
    backgroundColor: Colors.maroon
  },
  monthTileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333'
  },
  monthTileTextActive: {
    color: '#FFE082',
    fontWeight: 'bold'
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10
  },
  dayTile: {
    width: '12%',
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EEEEEE'
  },
  dayTileActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon
  },
  dayTileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333'
  },
  dayTileTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    gap: 10
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    alignItems: 'center'
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555555'
  },
  applyBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: Colors.maroon,
    borderRadius: 10,
    alignItems: 'center'
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFE082'
  },
  liveRunningCardBanner: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    elevation: 4
  },
  liveRunningGreenBg: {
    backgroundColor: '#004D40',
    borderColor: '#00E676'
  },
  liveRunningRedBg: {
    backgroundColor: '#7F0000',
    borderColor: '#FF5252'
  },
  liveBadgeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  livePulseTag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10
  },
  livePulseText: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  liveChoghadiyaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2
  },
  liveChoghadiyaTimeStr: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFECB3'
  },
  activeGreenBorder: {
    borderWidth: 2,
    borderColor: '#00E676',
    backgroundColor: 'rgba(0,230,118,0.12)',
    borderRadius: 10
  },
  activeRedBorder: {
    borderWidth: 2,
    borderColor: '#FF5252',
    backgroundColor: 'rgba(255,82,82,0.12)',
    borderRadius: 10
  },
  activeGreenChip: {
    backgroundColor: '#00E676',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8
  },
  activeRedChip: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8
  },
  activeChipText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF'
  }
});
