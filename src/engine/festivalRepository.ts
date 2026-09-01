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
  },

  // Sikh Festivals (☬)
  {
    id: 'f_sikh_guru_gobind_singh',
    name: '☬ Guru Gobind Singh Jayanti',
    hindiName: '☬ गुरु गोबिंद सिंह जयंती',
    dateIso: '2026-01-05',
    category: 'SIKH_FESTIVAL',
    deity: 'Guru Gobind Singh Ji',
    description: 'Prakash Parv celebrating the birth anniversary of the 10th Sikh Guru who established the Khalsa Panth.',
    rituals: 'Nagar Kirtan procession, Akhand Path, Gatka martial arts demonstration, Langar seva.',
    tithiDescription: 'Poh Sudi Saptami (Nanakshahi)',
    isHoliday: true
  },
  {
    id: 'f_sikh_hola_mohalla',
    name: '☬ Hola Mohalla',
    hindiName: '☬ होला मोहल्ला',
    dateIso: '2026-03-04',
    category: 'SIKH_FESTIVAL',
    deity: 'Khalsa Panth',
    description: 'Grand Sikh festival of valor and martial arts instituted by Guru Gobind Singh Ji at Anandpur Sahib.',
    rituals: 'Nihang Sikh martial displays, mock battles, horsemanship, kirtan and community feast (Langar).',
    tithiDescription: 'Chet Vadi 1 (Nanakshahi)',
    isHoliday: true
  },
  {
    id: 'f_sikh_baisakhi',
    name: '☬ Baisakhi (Vaisakhi / Khalsa Sirjana Diwas)',
    hindiName: '☬ वैसाखी (खालसा साजना दिवस)',
    dateIso: '2026-04-14',
    category: 'SIKH_FESTIVAL',
    deity: 'Khalsa Panth & Guru Gobind Singh Ji',
    description: 'Commemorates the creation of the Khalsa Panth in 1699 by Guru Gobind Singh Ji and the spring harvest.',
    rituals: 'Amrit Sanchar ceremony, Gurdwara prayers, Kar Seva, Bhangra & Gidda celebrations.',
    tithiDescription: '1st Vaisakh (Nanakshahi Solar)',
    isHoliday: true
  },
  {
    id: 'f_sikh_guru_arjan_shaheedi',
    name: '☬ Shaheedi Guru Arjan Dev Ji',
    hindiName: '☬ शहादत दिवस गुरु अर्जुन देव जी',
    dateIso: '2026-06-16',
    category: 'SIKH_FESTIVAL',
    deity: 'Guru Arjan Dev Ji',
    description: 'Martyrdom day of the 5th Sikh Guru who compiled the Adi Granth and built Harmandir Sahib (Golden Temple).',
    rituals: 'Chabeel (sweet cold water distribution), Kirtan darbar, silent prayers.',
    tithiDescription: '2 Harh (Nanakshahi)',
    isHoliday: true
  },
  {
    id: 'f_sikh_bandi_chhor',
    name: '☬ Bandi Chhor Divas',
    hindiName: '☬ बंदी छोड़ दिवस',
    dateIso: '2026-11-08',
    category: 'SIKH_FESTIVAL',
    deity: 'Guru Hargobind Sahib Ji',
    description: 'Celebrates the liberation of 6th Sikh Guru Hargobind Ji and 52 Hindu kings from Gwalior Fort.',
    rituals: 'Illumination of Golden Temple with lamps, fireworks, Kirtan, Deepmala.',
    tithiDescription: 'Kattak Vadi 14 (Nanakshahi)',
    isHoliday: true
  },
  {
    id: 'f_sikh_guru_nanak_jayanti',
    name: '☬ Guru Nanak Dev Ji Gurpurab',
    hindiName: '☬ गुरु नानक देव जी प्रकाश पर्व',
    dateIso: '2026-11-24',
    category: 'SIKH_FESTIVAL',
    deity: 'Guru Nanak Dev Ji',
    description: 'Prakash Parv of Guru Nanak Dev Ji, founder of Sikhism who taught equality, truth, and devotion.',
    rituals: 'Akhand Path completion, morning Prabhat Pheri, Nagar Kirtan, grand Langar distribution.',
    tithiDescription: 'Kartik Purnima (Nanakshahi 558)',
    isHoliday: true
  },

  // Buddhist Festivals (☸️)
  {
    id: 'f_buddhist_losar',
    name: '☸️ Losar (Tibetan Buddhist New Year)',
    hindiName: '☸️ लोसार (तिब्बती बौद्ध नववर्ष)',
    dateIso: '2026-02-17',
    category: 'BUDDHIST_FESTIVAL',
    deity: 'Lord Buddha & Bodhisattvas',
    description: 'Tibetan Buddhist New Year celebrated with prayers, butter sculpture offerings, and cham dances.',
    rituals: 'Monastery prayers, hoisting prayer flags (Lungta), family gatherings, offering Khatas.',
    tithiDescription: '1st Day of 1st Tibetan Month',
    isHoliday: false
  },
  {
    id: 'f_buddhist_buddha_purnima',
    name: '☸️ Buddha Purnima / Vesak',
    hindiName: '☸️ बुद्ध पूर्णिमा / वैशाख बुद्ध जयंती',
    dateIso: '2026-05-31',
    category: 'BUDDHIST_FESTIVAL',
    deity: 'Gautama Buddha',
    description: 'Triple blessed day commemorating Gautama Buddha\'s Birth, Enlightenment (Bodhi), and Parinirvana.',
    rituals: 'Bodhi Tree puja, meditation, chanting Dhammacakkappavattana Sutta, acts of Metta (loving-kindness).',
    tithiDescription: 'Vaisakha Purnima',
    isHoliday: true
  },
  {
    id: 'f_buddhist_asalha_puja',
    name: '☸️ Asalha Puja (Dharma Day)',
    hindiName: '☸️ असाल्हा पूजा (धम्म दिवस)',
    dateIso: '2026-07-29',
    category: 'BUDDHIST_FESTIVAL',
    deity: 'Gautama Buddha & Sangha',
    description: 'Commemorates Lord Buddha\'s first sermon at Sarnath and the turning of the Wheel of Dharma.',
    rituals: 'Chanting the Four Noble Truths, candlelit circumambulation around stupas.',
    tithiDescription: 'Ashadha Purnima',
    isHoliday: false
  },

  // Christian Festivals (✝️)
  {
    id: 'f_christian_ash_wednesday',
    name: '✝️ Ash Wednesday',
    hindiName: '✝️ राख का बुधवार (Ash Wednesday)',
    dateIso: '2026-02-18',
    category: 'CHRISTIAN_FESTIVAL',
    deity: 'Lord Jesus Christ',
    description: 'First day of Lent, a period of 40 days of fasting, prayer, and repentance before Easter.',
    rituals: 'Imposition of ashes on forehead, fasting, abstinence, charity.',
    tithiDescription: '46 Days Before Easter',
    isHoliday: false
  },
  {
    id: 'f_christian_good_friday',
    name: '✝️ Good Friday',
    hindiName: '✝️ गुड फ्राइडे (पवित्र शुक्रवार)',
    dateIso: '2026-04-03',
    category: 'CHRISTIAN_FESTIVAL',
    deity: 'Lord Jesus Christ',
    description: 'Solemn day commemorating the crucifixion and supreme sacrifice of Lord Jesus Christ at Calvary.',
    rituals: 'Veneration of the Cross, Stations of the Cross prayers, solemn afternoon service.',
    tithiDescription: 'Friday Before Easter',
    isHoliday: true
  },
  {
    id: 'f_christian_easter',
    name: '✝️ Easter Sunday (Resurrection Day)',
    hindiName: '✝️ ईस्टर संडे (पुनरुत्थान पर्व)',
    dateIso: '2026-04-05',
    category: 'CHRISTIAN_FESTIVAL',
    deity: 'Lord Jesus Christ',
    description: 'Joyous festival celebrating the Resurrection of Jesus Christ from the dead on the third day.',
    rituals: 'Sunrise Church mass, ringing Easter bells, Easter egg hunt, family feasts.',
    tithiDescription: 'First Sunday After Full Moon Post-Equinox',
    isHoliday: true
  },
  {
    id: 'f_christian_christmas',
    name: '✝️ Christmas Day',
    hindiName: '✝️ बड़ा दिन (क्रिसमस)',
    dateIso: '2026-12-25',
    category: 'CHRISTIAN_FESTIVAL',
    deity: 'Lord Jesus Christ',
    description: 'Annual festival commemorating the nativity and birth of Jesus Christ.',
    rituals: 'Midnight Mass, nativity scene displays, Christmas carols, gift sharing.',
    tithiDescription: '25th December (Solar)',
    isHoliday: true
  },

  // Parsi / Zoroastrian Festivals (🔥)
  {
    id: 'f_parsi_jamshedi_navroz',
    name: '🔥 Jamshedi Navroz (Vernal Equinox)',
    hindiName: '🔥 जमशेदी नौरोज़ (पारसी वसंत नववर्ष)',
    dateIso: '2026-03-21',
    category: 'PARSI_FESTIVAL',
    deity: 'Ahura Mazda & Zarathustra',
    description: 'Zoroastrian Spring New Year coinciding with the vernal equinox, celebrated by Parsis worldwide.',
    rituals: 'Fire Temple (Agiary) prayers, setting up the Haft-Sin table, charity, family feasts.',
    tithiDescription: 'Fasli Solar Equinox',
    isHoliday: true
  },
  {
    id: 'f_parsi_new_year',
    name: '🔥 Shahenshahi Parsi New Year (Pateti / Navroz)',
    hindiName: '🔥 पतेती एवं पारसी नववर्ष (शहंशाही)',
    dateIso: '2026-08-16',
    category: 'PARSI_FESTIVAL',
    deity: 'Ahura Mazda',
    description: 'New Year\'s Day according to the Shahenshahi Zoroastrian calendar, preceded by Pateti (Day of Repentance).',
    rituals: 'Special Jasanam prayer service at Agiary, Wearing new clothes, Ravo & Falooda delicacies.',
    tithiDescription: '1st Fravardin (Yazdegerdi 1396)',
    isHoliday: true
  },
  {
    id: 'f_parsi_khordad_sal',
    name: '🔥 Khordad Sal (Birth Anniversary of Zarathustra)',
    hindiName: '🔥 खोरदाद साल (पैगंबर ज़रथुस्ट्र का जन्म दिवस)',
    dateIso: '2026-08-21',
    category: 'PARSI_FESTIVAL',
    deity: 'Prophet Zarathustra',
    description: 'Celebrates the birth anniversary of Prophet Zarathustra (Zoroaster), founder of Zoroastrianism.',
    rituals: 'Grand Jashan prayers at Fire Temple, floral decorations, community gatherings.',
    tithiDescription: '6th Fravardin (Yazdegerdi 1396)',
    isHoliday: false
  }
];

export function getFestivalsForDate(dateIso: string): Festival[] {
  return FESTIVALS.filter(f => f.dateIso === dateIso);
}

export function getFestivalsForMonth(year: number, month: number): Festival[] {
  const prefix = `${year}-${month < 10 ? '0' + month : month}`;
  return FESTIVALS.filter(f => f.dateIso.startsWith(prefix));
}
