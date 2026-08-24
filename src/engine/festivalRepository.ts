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
  }
];

export function getFestivalsForDate(dateIso: string): Festival[] {
  return FESTIVALS.filter(f => f.dateIso === dateIso);
}

export function getFestivalsForMonth(year: number, month: number): Festival[] {
  const prefix = `${year}-${month < 10 ? '0' + month : month}`;
  return FESTIVALS.filter(f => f.dateIso.startsWith(prefix));
}
