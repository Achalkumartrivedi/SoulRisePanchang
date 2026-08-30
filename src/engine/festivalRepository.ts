import { Festival } from '../types/panchang';

export const FESTIVALS: Festival[] = [
  {
    id: 'f_makar_sankranti',
    name: 'Makar Sankranti / Pongal',
    hindiName: 'मकर संक्रांति / पोंगल',
    dateIso: '2026-01-14',
    category: 'MAJOR_FESTIVAL',
    deity: 'Surya Dev (Sun God)',
    description: 'Marks the transition of the Sun into Makara Rashi (Capricorn) and the arrival of harvest season.',
    rituals: 'Holy bath in sacred rivers, kite flying, offering sesame and jaggery (Til-Gul).',
    tithiDescription: 'Surya Sankranti',
    isHoliday: true
  },
  {
    id: 'f_republic_day',
    name: 'Republic Day',
    hindiName: 'गणतंत्र दिवस',
    dateIso: '2026-01-26',
    category: 'JAYANTI',
    deity: 'Nation',
    description: 'National holiday celebrating the Constitution of India.',
    rituals: 'Flag hoisting and parade.',
    tithiDescription: 'Magha Shukla Navami',
    isHoliday: true
  },
  {
    id: 'f_vasant_panchami',
    name: 'Vasant Panchami (Saraswati Puja)',
    hindiName: 'वसन्त पञ्चमी (सरस्वती पूजा)',
    dateIso: '2026-01-23',
    category: 'MAJOR_FESTIVAL',
    deity: 'Goddess Saraswati',
    description: 'Celebrates the onset of spring and honours the goddess of knowledge, music, and art.',
    rituals: 'Wearing yellow clothes, worshiping Goddess Saraswati.',
    tithiDescription: 'Magha Shukla Panchami',
    isHoliday: false
  },
  {
    id: 'f_maha_shivratri',
    name: 'Maha Shivratri',
    hindiName: 'महाशिवरात्रि',
    dateIso: '2026-02-15',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Shiva & Goddess Parvati',
    description: 'The auspicious night of Lord Shiva\'s divine cosmic dance (Tandava).',
    rituals: 'All-night vigil (Jagaran), fasting, Shivling Abhishek.',
    tithiDescription: 'Phalguna Krishna Chaturdashi',
    isHoliday: true
  },
  {
    id: 'f_holi',
    name: 'Holi (Dhulandi)',
    hindiName: 'होली (धुलंडी)',
    dateIso: '2026-03-04',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Krishna & Radha / Lord Vishnu',
    description: 'The festival of colors celebrating divine love and victory of good over evil.',
    rituals: 'Playing with organic colors (Gulal), distribution of sweets.',
    tithiDescription: 'Phalguna Purnima',
    isHoliday: true
  },
  {
    id: 'f_ugadi',
    name: 'Ugadi / Gudi Padwa (Vedic New Year)',
    hindiName: 'युगादि / गुडी पाडवा',
    dateIso: '2026-03-19',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Brahma',
    description: 'Beginning of Chaitra Navratri and the traditional Vedic New Year (Vikram Samvat).',
    rituals: 'Hoisting Gudi, eating Neem & Jaggery.',
    tithiDescription: 'Chaitra Shukla Pratipada',
    isHoliday: true
  },
  {
    id: 'f_ram_navami',
    name: 'Sri Rama Navami',
    hindiName: 'श्री राम नवमी',
    dateIso: '2026-03-27',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Sri Rama',
    description: 'Celebrates the birth of Lord Rama, the seventh avatar of Lord Vishnu.',
    rituals: 'Reading Ramayana, Akhanda Bhajan, fast.',
    tithiDescription: 'Chaitra Shukla Navami',
    isHoliday: true
  },
  {
    id: 'f_indep_day',
    name: 'Independence Day',
    hindiName: 'स्वतंत्रता दिवस',
    dateIso: '2026-08-15',
    category: 'JAYANTI',
    deity: 'Nation',
    description: 'National holiday celebrating India\'s Independence.',
    rituals: 'Flag hoisting.',
    tithiDescription: 'Shravana Shukla Dwitiya',
    isHoliday: true
  },
  {
    id: 'f_raksha_bandhan',
    name: 'Raksha Bandhan',
    hindiName: 'रक्षाबंधन',
    dateIso: '2026-08-28',
    category: 'MAJOR_FESTIVAL',
    deity: 'Brothers & Sisters',
    description: 'Celebrates the sacred bond of love and protection between brothers and sisters.',
    rituals: 'Sisters tie Rakhi thread on brothers\' wrists.',
    tithiDescription: 'Shravana Purnima',
    isHoliday: true
  },
  {
    id: 'f_janmashtami',
    name: 'Krishna Janmashtami',
    hindiName: 'श्री कृष्ण जन्माष्टमी',
    dateIso: '2026-09-04',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Sri Krishna',
    description: 'Celebrates the birth of Lord Krishna at midnight in Mathura.',
    rituals: 'Fasting till midnight, midnight Bal-Gopal Aarti, Dahi Handi.',
    tithiDescription: 'Bhadrapada Krishna Ashtami',
    isHoliday: true
  },
  {
    id: 'f_ganesh_chaturthi',
    name: 'Ganesh Chaturthi',
    hindiName: 'गणेश चतुर्थी',
    dateIso: '2026-09-14',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Ganesha',
    description: '10-day grand festival welcoming Lord Ganesha.',
    rituals: 'Installing Ganesha idols, Modaks, Visarjan.',
    tithiDescription: 'Bhadrapada Shukla Chaturthi',
    isHoliday: true
  },
  {
    id: 'f_dussehra',
    name: 'Vijayadashami / Dussehra',
    hindiName: 'विजयादशमी / दशहरा',
    dateIso: '2026-10-20',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Rama / Goddess Durga',
    description: 'Celebrates Lord Rama\'s victory over Ravana and Durga\'s slaying of Mahishasura.',
    rituals: 'Burning Ravana effigies, Ayudha Puja.',
    tithiDescription: 'Ashvin Shukla Dashami',
    isHoliday: true
  },
  {
    id: 'f_diwali',
    name: 'Deepavali / Diwali',
    hindiName: 'दीपावली / दिवाली',
    dateIso: '2026-11-08',
    category: 'MAJOR_FESTIVAL',
    deity: 'Goddess Lakshmi & Lord Ganesha',
    description: 'The Festival of Lights celebrating Lord Rama\'s return to Ayodhya.',
    rituals: 'Lighting oil lamps (Diyas), Lakshmi Puja.',
    tithiDescription: 'Kartika Amavasya',
    isHoliday: true
  },
  {
    id: 'f_chhath_puja',
    name: 'Chhath Puja',
    hindiName: 'छठ पूजा',
    dateIso: '2026-11-14',
    category: 'MAJOR_FESTIVAL',
    deity: 'Surya Dev & Chhathi Maiya',
    description: 'Sacred festival offering gratitude to the Sun God.',
    rituals: '36-hour waterless fast, Arghya to setting & rising Sun.',
    tithiDescription: 'Kartika Shukla Shasthi',
    isHoliday: true
  },
  {
    id: 'f_jain_chaturmas_start',
    name: '🪔 Jain Chaturmas Arambha (4-Month Holy Period)',
    hindiName: '🪔 जैन चातुर्मास प्रारम्भ (४-मास महाव्रत)',
    dateIso: '2026-07-29',
    category: 'JAIN_FESTIVAL',
    deity: 'Lord Mahavir & Tirthankaras',
    description: 'Marks the commencement of the 4-month sacred Jain Chaturmas monsoon period of intense spiritual penance, self-restraint, and scriptural study.',
    rituals: 'Chaturmas Sthapana, daily Samayik, Chauvihar, and Ahimsa Mahavrat.',
    tithiDescription: 'Ashadha Shukla Purnima (Guru Purnima)',
    isHoliday: true
  },
  {
    id: 'f_jain_paryushan_start',
    name: '🪔 Sacred Paryushan Parva Arambha',
    hindiName: '🪔 पर्युषण महापर्व प्रारम्भ',
    dateIso: '2026-09-07',
    category: 'JAIN_FESTIVAL',
    deity: '24 Tirthankaras',
    description: 'The king of Jain festivals (Paryushan Mahaparva) focusing on internal purification, Kalpa Sutra recitation, and intense fasting.',
    rituals: 'Attending Jinendra discourses, Upvas, Attham Tapa, and Kalpa Sutra Vachana.',
    tithiDescription: 'Bhadrapada Shukla Ekam',
    isHoliday: true
  },
  {
    id: 'f_jain_samvatsari',
    name: '🪔 Samvatsari Parva & Michhami Dukkadam',
    hindiName: '🪔 संवत्सरी महापर्व एवं मिच्छामि दुक्कडम्',
    dateIso: '2026-09-12',
    category: 'JAIN_FESTIVAL',
    deity: '24 Tirthankaras & All Living Beings',
    description: 'The holiest day of universal forgiveness in Jainism. Seek forgiveness from all living beings with the phrase "Michhami Dukkadam".',
    rituals: 'Samvatsari Pratikraman, strict Fasting/Upvas, Kshapna (Forgiveness ritual) to all souls.',
    tithiDescription: 'Bhadrapada Shukla Panchami',
    isHoliday: true
  },
  {
    id: 'f_jain_mahavir_jayanti',
    name: '🌸 Lord Mahavir Jayanti Kalyanak',
    hindiName: '🌸 भगवान महावीर जन्म कल्याणक',
    dateIso: '2026-03-31',
    category: 'JAIN_FESTIVAL',
    deity: '24th Tirthankara Bhagwan Mahavir',
    description: 'Birth anniversary of Bhagwan Mahavira, the 24th Tirthankara who propagated Ahimsa (Non-violence) and Satya (Truth).',
    rituals: 'Rath Yatra, Snatra Puja, Ahimsa processions, and Jinendra Abhishek.',
    tithiDescription: 'Chaitra Shukla Trayodashi',
    isHoliday: true
  },
  {
    id: 'f_jain_akshaya_tritiya',
    name: '🌾 Sacred Akshaya Tritiya (Rishabhdev Bhagwan Parna)',
    hindiName: '🌾 अक्षय तृतीया (भगवान ऋषभदेव पारणा)',
    dateIso: '2026-05-19',
    category: 'JAIN_FESTIVAL',
    deity: '1st Tirthankara Bhagwan Rishabhdev',
    description: 'Marks the sacred sugarcane juice (Ikshu Rasa) Parna breaking of the 1-year fast by Lord Rishabhdev at Hastinapur.',
    rituals: 'Sugarcane juice (Ikshu Rasa) offering to Jain Monks & Parna rituals.',
    tithiDescription: 'Vaishakha Shukla Tritiya',
    isHoliday: false
  },
  {
    id: 'f_jain_chaitra_oli',
    name: '🪔 Chaitra Navpad Oli Arambha',
    hindiName: '🪔 चैत्र नवपद ओली प्रारम्भ',
    dateIso: '2026-03-24',
    category: 'JAIN_FESTIVAL',
    deity: 'Navpad (Arihant, Siddha, Acharya...)',
    description: '9-day sacred fasting festival dedicated to the Navpad (the nine supreme entities of Jainism).',
    rituals: 'Ayambil Tapa (eating dry food once a day without salt, oil, or sugar), Navpad Puja.',
    tithiDescription: 'Chaitra Shukla Saptami',
    isHoliday: false
  },
  {
    id: 'f_jain_aaso_oli',
    name: '🪔 Aaso Navpad Oli Arambha',
    hindiName: '🪔 आसो नवपद ओली प्रारम्भ',
    dateIso: '2026-10-17',
    category: 'JAIN_FESTIVAL',
    deity: 'Navpad (Arihant, Siddha, Acharya...)',
    description: 'Autumn 9-day Ayambil fasting period worshipping the Navpad Yantra.',
    rituals: 'Ayambil Tapa fasting, Siddha Chakra Yantra worship.',
    tithiDescription: 'Ashvin Shukla Saptami',
    isHoliday: false
  },
  {
    id: 'f_jain_mahavir_nirvana',
    name: '🪔 Lord Mahavir Nirvana Parva (Diwali)',
    hindiName: '🪔 भगवान महावीर निर्वाण दिवस (दीपावली)',
    dateIso: '2026-11-08',
    category: 'JAIN_FESTIVAL',
    deity: 'Bhagwan Mahavir',
    description: 'Attainment of Moksha (liberation) by Lord Mahavira at Pavapuri on Diwali morning.',
    rituals: 'Nirvana Ladoo offering at Jain temples, all-night chanting, lighting lamps.',
    tithiDescription: 'Kartika Amavasya',
    isHoliday: true
  },
  {
    id: 'f_jain_vira_new_year',
    name: '🪔 Vira Nirvana Samvat New Year',
    hindiName: '🪔 वीर निर्वाण संवत् नूतन वर्ष (गौतम स्वामी केवलज्ञान)',
    dateIso: '2026-11-09',
    category: 'JAIN_FESTIVAL',
    deity: 'Gautam Swami',
    description: 'Commencement of the new Jain year and celebration of Gautam Swami attaining Kevaljnana (omniscience).',
    rituals: 'Saal Mubarak greetings, Gautam Ras chanting, Mangalik recitation.',
    tithiDescription: 'Kartika Shukla Ekam',
    isHoliday: true
  },
  {
    id: 'f_jain_maun_ekadashi',
    name: '🪔 Maun Ekadashi (150 Kalyanak Aradhana)',
    hindiName: '🪔 मौन एकादशी (१५० कल्याणक आराधना)',
    dateIso: '2026-12-20',
    category: 'JAIN_FESTIVAL',
    deity: '24 Tirthankaras',
    description: 'Holiest silent fasting day in Jainism commemorating 150 Kalyanakas of various Tirthankaras.',
    rituals: 'Complete silence (Maun Vrat), waterless fast, 11 Logassa recitations.',
    tithiDescription: 'Margashirsha Shukla Ekadashi',
    isHoliday: false
  },
  {
    id: 'f_jain_chaturmas_end',
    name: '🪔 Jain Chaturmas Parva Samapan',
    hindiName: '🪔 जैन चातुर्मास समापन (देव दीवाली / कार्त्तिकी पूर्णिमा)',
    dateIso: '2026-11-24',
    category: 'JAIN_FESTIVAL',
    deity: 'Lord Mahavir & Tirthankaras',
    description: 'Conclusion of the 4-month Jain Chaturmas period. Monks resume pilgrimage (Vihar).',
    rituals: 'Khamasna to Jain Monks, Dev Diwali celebrations, Shatrunjaya Giriraj Yatra.',
    tithiDescription: 'Kartika Shukla Purnima',
    isHoliday: true
  }
];

export function getFestivalsForDate(dateIso: string): Festival[] {
  return FESTIVALS.filter(f => f.dateIso === dateIso);
}

export function getFestivalsForMonth(year: number, month: number): Festival[] {
  const prefix = `${year}-${month < 10 ? '0' + month : month}`;
  return FESTIVALS.filter(f => f.dateIso.startsWith(prefix));
}
