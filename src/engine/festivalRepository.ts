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
  // ----------------------------------------------------
  // REGIONAL HINDU FESTIVALS (South, East, West, North, North-East)
  // ----------------------------------------------------
  // Tamil Nadu & South India
  {
    id: 'f_tn_thaipusam',
    name: '🌺 Thaipusam (Thai Poosam)',
    hindiName: '🌺 थाईपूसम (भगवान मुरुगन उत्सव)',
    dateIso: '2026-02-01',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Murugan (Kartikeya)',
    description: 'Grand Tamil festival honoring Lord Murugan receiving the divine Vel spear from Goddess Parvati to defeat Surapadman.',
    rituals: 'Carrying Kavadi, Vel piercing, Pal Abhishekam (milk offering), fasting.',
    tithiDescription: 'Thai Month Purnima (Pushya Nakshatra)',
    region: 'Tamil Nadu',
    isHoliday: true
  },
  {
    id: 'f_tn_puthandu',
    name: '🌺 Tamil Puthandu (Tamil New Year)',
    hindiName: '🌺 तमिल पुत्थांडु (तमिल सौर नववर्ष)',
    dateIso: '2026-04-14',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Brahma & Lord Murugan',
    description: 'Tamil Solar New Year day marking the first day of the Chithirai month.',
    rituals: 'Viewing Kanni (tray of fruits, flowers, gold mirror), Mangai Pachadi preparation, temple visits.',
    tithiDescription: '1st Day of Chithirai (Solar)',
    region: 'Tamil Nadu',
    isHoliday: true
  },
  {
    id: 'f_tn_aadi_perukku',
    name: '🌺 Aadi Perukku (18th Day of Aadi)',
    hindiName: '🌺 आडी पेरुक्कू (कावेरी नदी पूजा)',
    dateIso: '2026-08-03',
    category: 'MAJOR_FESTIVAL',
    deity: 'Goddess Cauvery & Mother Nature',
    description: 'Tamil monsoon water festival worshipping the rising waters of River Cauvery for agricultural prosperity.',
    rituals: 'Riverbank pujas, offering Variety Rice (Chitrannam), germinated seeds (Mulaipari).',
    tithiDescription: '18th Day of Aadi Month',
    region: 'Tamil Nadu',
    isHoliday: false
  },
  {
    id: 'f_tn_karthigai_deepam',
    name: '🌺 Karthigai Deepam',
    hindiName: '🌺 कार्तिकई दीपम (तिरुवन्नामलाई महादीपम)',
    dateIso: '2026-11-23',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Shiva (Annamalaiyar)',
    description: 'Ancient Tamil festival of lights commemorating Shiva manifested as an infinite column of light at Tiruvannamalai.',
    rituals: 'Lighting Mahadeepam beacon atop Annamalai Hill, oil lamps in homes, Agni Lingam worship.',
    tithiDescription: 'Karthigai Month Purnima (Krittika Nakshatra)',
    region: 'Tamil Nadu',
    isHoliday: true
  },
  {
    id: 'f_tn_skanda_sashti',
    name: '🌺 Skanda Sashti / Soorasamharam',
    hindiName: '🌺 स्कंद षष्ठी (सूरसंहारम मुरुगन विजय)',
    dateIso: '2026-11-15',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Murugan',
    description: '6-day festival celebrating Lord Murugan\'s victory over demon Surapadman at Tiruchendur.',
    rituals: 'Rigorous 6-day fasting, enacting Soorasamharam, Tirukalyanam wedding ceremony.',
    tithiDescription: 'Kartika Shukla Sashti',
    region: 'Tamil Nadu',
    isHoliday: false
  },
  {
    id: 'f_tn_arudra_darisanam',
    name: '🌺 Arudra Darisanam (Margazhi Thiruvathira)',
    hindiName: '🌺 आरुद्र दर्शनम (भगवान नटराज तांडव)',
    dateIso: '2026-12-24',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Nataraja (Shiva)',
    description: 'Auspicious cosmic dance of Lord Nataraja observed at Chidambaram Shiva Temple.',
    rituals: 'Abhishekam to Lord Nataraja, offering Kali (sweet rice pudding) and Thiruvathirai Kootu.',
    tithiDescription: 'Margazhi Month (Arudra Nakshatra)',
    region: 'Tamil Nadu',
    isHoliday: false
  },

  // Kerala
  {
    id: 'f_kl_attukal_pongala',
    name: '🌴 Attukal Pongala',
    hindiName: '🌴 आट्टुकल पोंगला (तिरुवनंतपुरम)',
    dateIso: '2026-03-03',
    category: 'MAJOR_FESTIVAL',
    deity: 'Attukal Bhagavathy (Kannaki)',
    description: 'World\'s largest religious congregation of women offering Pongala rice pudding to Attukal Amma.',
    rituals: 'Women cooking sweet Pongal in earthen pots on city streets, temple priest blessings.',
    tithiDescription: 'Kumbham Month Pooram Nakshatra',
    region: 'Kerala',
    isHoliday: true
  },
  {
    id: 'f_kl_vishu',
    name: '🌴 Vishu (Malayalam Solar New Year)',
    hindiName: '🌴 विषु (मलयालम सौर नववर्ष & विषुकणी)',
    dateIso: '2026-04-14',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Krishna & Lord Vishnu',
    description: 'Malayalam Solar New Year day symbolizing prosperity, renewal, and auspicious first sights.',
    rituals: 'Viewing Vishukkani (mirror, Kanikonna yellow flowers, gold, coins), giving Vishukaineetam money gifts.',
    tithiDescription: '1st Day of Medam (Solar)',
    region: 'Kerala',
    isHoliday: true
  },
  {
    id: 'f_kl_thrissur_pooram',
    name: '🌴 Thrissur Pooram',
    hindiName: '🌴 त्रिशूर पूरम (गजराज एवं वाद्य उत्सव)',
    dateIso: '2026-04-28',
    category: 'MAJOR_FESTIVAL',
    deity: 'Vadakkunnathan (Lord Shiva)',
    description: 'Mother of all Keralite Poorams featuring 30 caparisoned elephants, Panchavadyam drumming, and fireworks.',
    rituals: 'Kudamattam parasol display, Ilanjithara Melam percussion orchestra.',
    tithiDescription: 'Medam Month Pooram Nakshatra',
    region: 'Kerala',
    isHoliday: true
  },
  {
    id: 'f_kl_onam',
    name: '🌴 Thiru Onam (Onam Harvest Festival)',
    hindiName: '🌴 तिरु ओणम (सम्राट महाबली आगमन & ओणसद्या)',
    dateIso: '2026-08-28',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Vamana & King Mahabali',
    description: 'State harvest festival of Kerala celebrating the annual homecoming of beloved Asura King Mahabali.',
    rituals: 'Designing Pookkalam floral carpets, 26-dish Onasadya grand feast, Vallamkali snake boat races.',
    tithiDescription: 'Chingam Month Thiruvonam Nakshatra',
    region: 'Kerala',
    isHoliday: true
  },

  // Karnataka & Andhra Pradesh / Telangana
  {
    id: 'f_ka_ugadi',
    name: '🌾 Yugadi / Ugadi (Kannada & Telugu New Year)',
    hindiName: '🌾 युगादि / उगादि (कन्नड़ एवं तेलुगु नववर्ष)',
    dateIso: '2026-03-19',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Brahma & Lord Vishnu',
    description: 'Lunar New Year of Karnataka, Andhra Pradesh, and Telangana marking the start of Chaitra Navaratri.',
    rituals: 'Eating Bevu Bella / Ugadi Pachadi (6 tastes representing emotions of life), Panchanga Sravanam.',
    tithiDescription: 'Chaitra Shukla Pratipada',
    region: 'Karnataka & Andhra/Telangana',
    isHoliday: true
  },
  {
    id: 'f_ka_varamahalakshmi',
    name: '🌾 Varamahalakshmi Vrata',
    hindiName: '🌾 वरमहालक्ष्मी व्रत (समृद्धि पूजा)',
    dateIso: '2026-08-21',
    category: 'MAJOR_FESTIVAL',
    deity: 'Goddess Varamahalakshmi',
    description: 'Auspicious vrata observed by married women in Karnataka, AP, and TN for the longevity and wealth of family.',
    rituals: 'Kalasha sthapana with Goddess coconut face, tying Doragranthi yellow thread, sweets offering.',
    tithiDescription: 'Friday Before Shravana Purnima',
    region: 'Karnataka & AP/Telangana',
    isHoliday: false
  },
  {
    id: 'f_ka_gowri_habba',
    name: '🌾 Swarna Gowri Habba',
    hindiName: '🌾 स्वर्ण गौरी हब्बा (कर्नाटक)',
    dateIso: '2026-09-13',
    category: 'MAJOR_FESTIVAL',
    deity: 'Goddess Swarna Gowri (Parvati)',
    description: 'Celebrated the day before Ganesh Chaturthi in Karnataka welcoming Goddess Gowri to her maternal home.',
    rituals: 'Turmeric Gowri puja, Bagina gift exchange among women, sacred thread tying.',
    tithiDescription: 'Bhadrapada Shukla Tritiya',
    region: 'Karnataka',
    isHoliday: true
  },
  {
    id: 'f_tg_bathukamma',
    name: '🌸 Telangana Bathukamma (Floral Festival)',
    hindiName: '🌸 बतुकम्मा (तेलंगाना पुष्प उत्सव)',
    dateIso: '2026-10-11',
    category: 'MAJOR_FESTIVAL',
    deity: 'Goddess Maha Gauri (Bathukamma)',
    description: 'State floral festival of Telangana where women arrange seasonal flowers in concentric conical mounds.',
    rituals: 'Singing folk songs around floral Bathukammas, immersion in lakes (Saddula Bathukamma).',
    tithiDescription: 'Mahalaya Amavasya to Durgashtami',
    region: 'Telangana',
    isHoliday: true
  },
  {
    id: 'f_tg_bonalu',
    name: '🌸 Telangana Ashada Bonalu',
    hindiName: '🌸 बोनालू (तेलंगाना महाकाली पूजा)',
    dateIso: '2026-07-12',
    category: 'MAJOR_FESTIVAL',
    deity: 'Goddess Mahakali (Yellamma)',
    description: 'Annual monsoon festival in Hyderabad & Secunderabad thanking Goddess Mahakali for health and protection.',
    rituals: 'Women carrying decorated brass pots with cooked rice & jaggery (Bonam), Rangam oracle prediction.',
    tithiDescription: 'Ashada Month Sundays',
    region: 'Telangana',
    isHoliday: true
  },

  // Bengal & East India
  {
    id: 'f_wb_pohela_boishakh',
    name: '🎨 Pohela Boishakh (Bengali New Year 1433)',
    hindiName: '🎨 पोहेला बोइशाख (बंगाली नववर्ष १४३३ & हाल खाता)',
    dateIso: '2026-04-15',
    category: 'MAJOR_FESTIVAL',
    deity: 'Goddess Lakshmi & Lord Ganesha',
    description: 'Bengali New Year day marking the start of the new financial accounting books (Haal Khata).',
    rituals: 'Haal Khata puja in shops, Mangal Shobhajatra cultural parade, eating Ilish fish & Rosogolla.',
    tithiDescription: '1st Day of Boishakh (Solar)',
    region: 'Bengal & Tripura',
    isHoliday: true
  },
  {
    id: 'f_wb_durga_puja',
    name: '🎨 Bengal Durga Puja (Mahashtami & Vijayadashami)',
    hindiName: '🎨 दुर्गा पूजा (महाषष्ठी से विजयादशमी & सिंदूर खेला)',
    dateIso: '2026-10-17',
    category: 'MAJOR_FESTIVAL',
    deity: 'Maa Durga (Mahishasuramardini)',
    description: 'UNESCO Intangible Cultural Heritage festival celebrating Maa Durga\'s victory over Mahishasura.',
    rituals: 'Theme Pandal visiting, Dhunuchi Naach dance, Kumari Puja, Sandhi Puja, Sindoor Khela.',
    tithiDescription: 'Ashvin Shukla Shasthi to Dashami',
    region: 'Bengal, Assam, Odisha, Tripura',
    isHoliday: true
  },
  {
    id: 'f_wb_kojagari_lakshmi',
    name: '🎨 Kojagari Lakshmi Puja',
    hindiName: '🎨 कोजागरी लक्ष्मी पूजा (बंगाल)',
    dateIso: '2026-10-25',
    category: 'MAJOR_FESTIVAL',
    deity: 'Goddess Lakshmi',
    description: 'Observed on the full moon night after Durga Puja in Bengal worshipping Goddess Lakshmi for wealth.',
    rituals: 'Drawing Alpana floor art, offering Coconut Naru and Khichuri Bhog, staying awake at night.',
    tithiDescription: 'Ashvin Purnima (Kojagari)',
    region: 'Bengal & Odisha',
    isHoliday: true
  },
  {
    id: 'f_wb_kali_puja',
    name: '🎨 Kali Puja / Shyama Puja',
    hindiName: '🎨 काली पूजा / श्यामा पूजा (बंगाल दीपावली रात्रि)',
    dateIso: '2026-11-08',
    category: 'MAJOR_FESTIVAL',
    deity: 'Goddess Kali',
    description: 'Grand midnight worship of Goddess Kali performed on Diwali Amavasya night across Bengal.',
    rituals: 'Midnight Tantrik & Vedic Kali Puja, offering Hibiscus flowers, lighting earthen lamps.',
    tithiDescription: 'Kartika Amavasya',
    region: 'Bengal, Assam, Odisha',
    isHoliday: true
  },

  // Odisha
  {
    id: 'f_od_pana_sankranti',
    name: '⛵ Pana Sankranti (Maha Vishuva Odia New Year)',
    hindiName: '⛵ पाना संक्रांति (ओडिया नववर्ष & बासुदेव पाना)',
    dateIso: '2026-04-14',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Jagannath & Hanuman Ji',
    description: 'Odia Solar New Year day where a perforated pot (Basudeba Theki) drips sacred Pana water over Shiva/Tulsi.',
    rituals: 'Drinking sweet Bela Pana, Danda Nacha folk performance, Jhamu Yatra firewalking.',
    tithiDescription: 'Mesha Sankranti (Solar)',
    region: 'Odisha',
    isHoliday: true
  },
  {
    id: 'f_od_raja_parba',
    name: '⛵ Raja Parba (Swings & Earth Mother Festival)',
    hindiName: '⛵ रजा पर्ब (ओडिशा पृथ्वी माता उत्सव)',
    dateIso: '2026-06-14',
    category: 'MAJOR_FESTIVAL',
    deity: 'Bhudevi (Mother Earth)',
    description: 'Unique 3-day Odia festival celebrating womanhood and the menstruating Earth Mother before monsoon.',
    rituals: 'Girls playing on rope swings (Raja Doli), eating Poda Pitha, no agricultural digging.',
    tithiDescription: 'Mithuna Sankranti Period',
    region: 'Odisha',
    isHoliday: true
  },
  {
    id: 'f_od_rath_yatra',
    name: '⛵ Puri Jagannath Ratha Yatra',
    hindiName: '⛵ पुरी श्री जगन्नाथ रथ यात्रा',
    dateIso: '2026-07-16',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Jagannath, Balabhadra & Subhadra',
    description: 'World-famous Chariot Festival where Lord Jagannath travels to Gundicha Temple on Nandighosha chariot.',
    rituals: 'Chera Pahara sweeping by Puri Gajapati Maharaja, pulling gigantic wooden chariots.',
    tithiDescription: 'Ashadha Shukla Dwitiya',
    region: 'Odisha',
    isHoliday: true
  },

  // Assam & North-East
  {
    id: 'f_as_bohag_bihu',
    name: '🏔️ Bohag Bihu / Rongali Bihu (Assamese New Year)',
    hindiName: '🏔️ बोहाग बिहू / रंगोली बिहू (असमिया नववर्ष)',
    dateIso: '2026-04-14',
    category: 'MAJOR_FESTIVAL',
    deity: 'Mother Nature & Lord Vishnu',
    description: '7-day Assamese spring harvest & New Year festival filled with music, Bihu dance, and joy.',
    rituals: 'Goru Bihu (cattle bath with turmeric), Bihu dance performance, presenting Gamosa towels.',
    tithiDescription: '1st Day of Bohag Month',
    region: 'Assam & NE India',
    isHoliday: true
  },
  {
    id: 'f_as_ambubachi',
    name: '🏔️ Ambubachi Mela (Kamakhya Temple)',
    hindiName: '🏔️ अंबुबाची मेला (कामाख्या देवी पीठ)',
    dateIso: '2026-06-22',
    category: 'MAJOR_FESTIVAL',
    deity: 'Goddess Kamakhya (Sakti)',
    description: 'Annual fair celebrating the creative power and fertility of Goddess Kamakhya at Guwahati Shaktipeeth.',
    rituals: 'Temple doors remain closed for 4 days, distribution of Rakta Vastra holy cloth prasadam.',
    tithiDescription: 'Monsoon Ashadha Month',
    region: 'Assam',
    isHoliday: false
  },

  // Bihar & Jharkhand
  {
    id: 'f_bh_chhath_puja',
    name: '☀️ Chhath Puja (Nahay-Khay to Usha Arghya)',
    hindiName: '☀️ छठ पूजा (महापर्व - नहाय-खाय से उषा अर्घ्य)',
    dateIso: '2026-11-14',
    category: 'MAJOR_FESTIVAL',
    deity: 'Surya Dev & Chhathi Maiya',
    description: 'Rigorous 4-day ancient Vedic waterless fasting festival worshipping the Sun God & Chhathi Maiya at riverbanks.',
    rituals: 'Nahay-Khay, Kharna (jaggery kheer), Sandhya Arghya (sunset offering), Usha Arghya (sunrise offering), Thekua prasad.',
    tithiDescription: 'Kartika Shukla Shashthi',
    region: 'Bihar, Jharkhand & Eastern UP',
    isHoliday: true
  },
  {
    id: 'f_bh_jitiya',
    name: '☀️ Jivitputrika Vrat (Jitiya Vrat)',
    hindiName: '☀️ जीवितपुत्रिका व्रत (जितिया निर्जला व्रत)',
    dateIso: '2026-10-03',
    category: 'MAJOR_FESTIVAL',
    deity: 'Jimutavahana & Goddess Chil-Siyar',
    description: '36-hour strict waterless fast observed by mothers in Bihar & UP for the protection and longevity of children.',
    rituals: 'Othan eating before dawn, 24-hr Nirjala fast, Jitiya red thread wearing.',
    tithiDescription: 'Ashvin Krishna Ashtami',
    region: 'Bihar, Jharkhand & UP',
    isHoliday: false
  },

  // Maharashtra & West India
  {
    id: 'f_mh_gudi_padwa',
    name: '🚩 Gudi Padwa (Maharashtrian New Year)',
    hindiName: '🚩 गुढीपाडवा (महाराष्ट्र नूतन वर्ष & गुढी उभारणी)',
    dateIso: '2026-03-19',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Brahma & Lord Ram',
    description: 'Maharashtrian Lunar New Year celebrating King Shalivahana\'s victory and Lord Ram\'s return to Ayodhya.',
    rituals: 'Hoisting bright silk Gudi flag with neem leaves and sugar garland outside windows, Shrikhand Puri feast.',
    tithiDescription: 'Chaitra Shukla Pratipada',
    region: 'Maharashtra',
    isHoliday: true
  },
  {
    id: 'f_mh_ashadhi_ekadashi',
    name: '🚩 Ashadhi Ekadashi (Pandharpur Wavari Yatra)',
    hindiName: '🚩 आषाढी एकादशी (पंढरपूर वारी यात्रा)',
    dateIso: '2026-07-25',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Vitthal (Vithoba) & Rukmini',
    description: 'Grand culmination of the 21-day Warkari pilgrimage walking on foot to Pandharpur Vitthal Temple.',
    rituals: 'Fasting on Sabudana Khichdi, Ringan horse procession, Abhang Kirtan chanting.',
    tithiDescription: 'Ashadha Shukla Ekadashi',
    region: 'Maharashtra',
    isHoliday: true
  },
  {
    id: 'f_mh_ganesh_utsav',
    name: '🚩 Maharashtra Ganeshotsav (Ganesh Chaturthi)',
    hindiName: '🚩 गणेशोत्सव (१० दिवसीय श्री गणेश स्थापना)',
    dateIso: '2026-09-14',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Ganesha',
    description: '10-day grand festival instituted by Lokmanya Tilak uniting communities in Ganesha worship.',
    rituals: 'Prana Pratishtha of Ganesha idols, Modak offerings, Atharvashirsha chanting, Anant Chaturdashi Visarjan.',
    tithiDescription: 'Bhadrapada Shukla Chaturthi',
    region: 'Maharashtra & All India',
    isHoliday: true
  },

  // Gujarat & Rajasthan
  {
    id: 'f_gj_bestu_varas',
    name: '🪔 Bestu Varas (Gujarati New Year)',
    hindiName: '🪔 બેસતું વર્ષ / નૂતન વર્ષાભિનંદન (ગુજરાતી નવવર્ષ)',
    dateIso: '2026-11-09',
    category: 'MAJOR_FESTIVAL',
    deity: 'Goddess Lakshmi & Lord Krishna',
    description: 'Gujarati New Year celebrated the day after Diwali with Nutan Varshabhinandan greetings.',
    rituals: 'Sabras salt buying, visiting elder relatives, temple darshan, exchanging sweets.',
    tithiDescription: 'Kartika Shukla Pratipada',
    region: 'Gujarat',
    isHoliday: true
  },
  {
    id: 'f_rj_gangaur',
    name: '🏰 Rajasthan Gangaur Parv',
    hindiName: '🏰 गणगौर उत्सव (ईसर जी एवं गौरा माता पूजा)',
    dateIso: '2026-03-22',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Isar (Shiva) & Goddess Gauri',
    description: '18-day vibrant Rajasthani festival worshipping Lord Shiva and Parvati for marital bliss and marital love.',
    rituals: 'Clay Gauri idol worship, henna (Mehendi) application, carrying decorated clay lamps on head.',
    tithiDescription: 'Chaitra Shukla Tritiya',
    region: 'Rajasthan & MP',
    isHoliday: true
  },

  // North India (UP, Uttarakhand, Himachal, Kashmir)
  {
    id: 'f_up_dev_deepawali',
    name: '🪔 Varanasi Dev Deepawali',
    hindiName: '🪔 देव दीपावली (वाराणसी ८४ घाट महादीपोत्स्व)',
    dateIso: '2026-11-24',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Shiva (Tripurari)',
    description: 'Festival of the Gods at Kashi (Varanasi) where millions of earthen lamps illuminate the 84 Ganges ghats.',
    rituals: 'Lighting 1 million lamps on Kashi Ghats, Ganga Aarti, Tripurasur Samhar puja.',
    tithiDescription: 'Kartika Purnima',
    region: 'UP & Varanasi',
    isHoliday: true
  },
  {
    id: 'f_hp_kullu_dussehra',
    name: '🏔️ Kullu Dussehra',
    hindiName: '🏔️ कुल्लू दशहरा (हिमाचल प्रदेश देव समागम)',
    dateIso: '2026-10-20',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Raghunath & 200+ Local Deities',
    description: '7-day unique Himachali festival starting on Vijayadashami when over 200 local hill deities gather at Dhalpur Maidan.',
    rituals: 'Rath Yatra of Lord Raghunath, Nati folk dance, animal sacrifice symbolic closure.',
    tithiDescription: 'Vijayadashami onwards',
    region: 'Himachal Pradesh',
    isHoliday: true
  },
  {
    id: 'f_jk_herath',
    name: '❄️ Kashmiri Shivratri (Herath)',
    hindiName: '❄️ हेरथ (कश्मीरी पंडित शिवरात्रि अखरोट पूजा)',
    dateIso: '2026-02-15',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Shiva & Goddess Parvati (Vatuk)',
    description: 'Most sacred festival of Kashmiri Pandits worshipping Lord Shiva as Vatuk Bhairava with water-filled pitchers.',
    rituals: 'Puja of water vessel (Vatuk Dham), offering walnuts soaked in water, distributing walnuts as prasadam.',
    tithiDescription: 'Phalguna Krishna Trayodashi',
    region: 'Kashmir',
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
  },
  // ----------------------------------------------------
  // GUJARAT SACRED FESTIVALS & NAVRATRIS & HOLY SHRAVAN MAAS
  // ----------------------------------------------------
  {
    id: 'f_guj_bol_choth',
    name: '🐄 Bol Choth (Govatsa Dwadashi) - Gujarat',
    hindiName: '🐄 बोल चोथ / गौ पूजा (गुजरात)',
    gujaratiName: '🐄 બોળ ચોથ (ગોવત્સ દ્વાદશી) - ગુજરાત',
    dateIso: '2026-09-01',
    category: 'MAJOR_FESTIVAL',
    deity: 'Gau Mata (Sacred Cow & Calf)',
    description: 'Sacred Gujarati fast observing worship of cows and calves. Wheat and milk products are abstained from today.',
    rituals: 'Puja of cows and calves, applying kumkum & feeding sprouted grains (Bakhla).',
    tithiDescription: 'Shravana Vad Choth (Amanta)',
    isHoliday: false
  },
  {
    id: 'f_guj_nag_pancham',
    name: '🐍 Nag Pancham - Gujarat',
    hindiName: '🐍 नाग पंचम (गुजरात)',
    gujaratiName: '🐍 નાગ પાંચમ - ગુજરાત',
    dateIso: '2026-09-02',
    category: 'MAJOR_FESTIVAL',
    deity: 'Nag Devta (Serpent Deities)',
    description: 'Traditional Gujarati Nag Panchami fast observed on Shravana Vad Pancham for family protection.',
    rituals: 'Worship of Nag Devta, offering milk and bajra rotla.',
    tithiDescription: 'Shravana Vad Pancham (Amanta)',
    isHoliday: true
  },
  {
    id: 'f_guj_randhan_chhath',
    name: '🍲 Randhan Chhath (Devotional Cooking Day) - Gujarat',
    hindiName: '🍲 रांधण छठ (गुजरात)',
    gujaratiName: '🍲 રાંધણ છઠ્ઠ - ગુજરાત',
    dateIso: '2026-09-03',
    category: 'MAJOR_FESTIVAL',
    deity: 'Goddess Shitala',
    description: 'Devotional Gujarati cooking day. All meals for Shitala Satam are cooked today; hearth/stove is cleaned and kept cold tomorrow.',
    rituals: 'Cooking varieties of farsaans, sweets, and dishes; performing stove puja before cooling it down.',
    tithiDescription: 'Shravana Vad Chhath (Amanta)',
    isHoliday: false
  },
  {
    id: 'f_guj_shitala_satam',
    name: '🌸 Shitala Satam - Gujarat',
    hindiName: '🌸 शीतला सातम (गुजरात)',
    gujaratiName: '🌸 શીતળા સાતમ - ગુજરાત',
    dateIso: '2026-09-04',
    category: 'MAJOR_FESTIVAL',
    deity: 'Maa Shitala',
    description: 'Sacred Gujarati festival honoring Goddess Shitala for health and immunity. No stove is lit today; families consume cold prepared food.',
    rituals: 'Worship of Shitala Mata with cold milk/curd, eating food prepared on Randhan Chhath.',
    tithiDescription: 'Shravana Vad Satam (Amanta)',
    isHoliday: true
  },
  {
    id: 'f_guj_janmashtami',
    name: '🚩 Gujarat Janmashtami (Aatham) - Gujarat',
    hindiName: '🚩 जन्माष्टमी (गुजरात)',
    gujaratiName: '🚩 જન્માષ્ટમી (આઠમ) - ગુજરાત',
    dateIso: '2026-09-05',
    category: 'MAJOR_FESTIVAL',
    deity: 'Bhagwan Shri Krishna',
    description: 'Grand celebration of Shri Krishna Janma across Dwarka, Rajkot, Surat & Gujarat on Shravana Vad Aatham.',
    rituals: 'Fasting, Matki Phod, Krishna Janam midnight Aarti and Darshan.',
    tithiDescription: 'Shravana Vad Aatham (Amanta)',
    isHoliday: true
  },
  {
    id: 'f_guj_nandotsav',
    name: '🌿 Gujarat Nandotsav (Nom) - Gujarat',
    hindiName: '🌿 नन्दोत्सव (गुजरात)',
    gujaratiName: '🌿 નંદોત્સવ (નોમ) - ગુજરાત',
    dateIso: '2026-09-06',
    category: 'MAJOR_FESTIVAL',
    deity: 'Shri Krishna & Nanda Baba',
    description: 'Celebrates Nanda Bava Anand Bhayo in Nandalay on Shravana Vad Nom.',
    rituals: 'Distributing sweets, Makhan-Mishri, and devotional dances.',
    tithiDescription: 'Shravana Vad Nom (Amanta)',
    isHoliday: false
  },
  {
    id: 'f_shravan_arambha',
    name: '🔱 Holy Shravan Maas Arambha (પવિત્ર શ્રાવણ માસ પ્રારંભ)',
    hindiName: '🔱 पवित्र श्रावण मास प्रारम्भ (महादेव पूजा)',
    dateIso: '2026-08-13',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Shiva (Mahadev)',
    description: 'Commencement of the holy month of Shravan dedicated to Bhagwan Shiv. Special Monday fasts and Jalabhishekam begin.',
    rituals: 'Mahadev Jalabhishek, Bilvapatra offering, Shravan Somvar Vrat.',
    tithiDescription: 'Shravana Shukla Pratipada',
    isHoliday: false
  },
  {
    id: 'f_shravan_samapti',
    name: '🔱 Holy Shravan Maas Samapti (પવિત્ર શ્રાવણ માસ સમાપ્તિ)',
    hindiName: '🔱 पवित्र श्रावण मास समाप्ति (अमावस्या)',
    dateIso: '2026-09-11',
    category: 'MAJOR_FESTIVAL',
    deity: 'Lord Shiva & Dariyal Dev',
    description: 'Conclusion of holy Shravan month in Gujarat (Shravan Vad Amavasya / Dariyal Dev Puja).',
    rituals: 'Final Shravan Shiv Puja, offering coconut to sea/river.',
    tithiDescription: 'Shravana Vad Amavasya (Amanta)',
    isHoliday: false
  },
  // NAVRATRIS (All 4 Sacred Navratris)
  {
    id: 'f_chaitra_navratri_start',
    name: '🌺 Chaitra Vasanta Navratri Ghatasthapana (ચૈત્ર નવરાત્રિ પ્રારંભ)',
    hindiName: '🌺 चैत्र वसन्त नवरात्रि (घटस्थापना - मां दुर्गा)',
    dateIso: '2026-03-19',
    category: 'MAJOR_FESTIVAL',
    deity: 'Maa Durga (Mataji)',
    description: 'Commencement of 9-day Chaitra Vasanta Navratri dedicated to 9 forms of Navdurga.',
    rituals: 'Ghatasthapana, Akhand Jyot, reading Durga Saptashati.',
    tithiDescription: 'Chaitra Shukla Pratipada',
    isHoliday: true
  },
  {
    id: 'f_magha_gupt_navratri',
    name: '🌺 Magha Gupt Navratri Arambha (માઘ ગુપ્ત નવરાત્રિ)',
    hindiName: '🌺 माघ गुप्त नवरात्रि प्रारम्भ',
    dateIso: '2026-01-19',
    category: 'MAJOR_FESTIVAL',
    deity: 'Maa Ten Mahavidyas',
    description: 'Sacred 9-day Tantric Gupt Navratri in Magha month for inner spiritual Sadhana.',
    rituals: 'Secret Mahavidya Sadhana, Chandi Path.',
    tithiDescription: 'Magha Shukla Pratipada',
    isHoliday: false
  },
  {
    id: 'f_ashadha_gupt_navratri',
    name: '🌺 Ashadha Gupt Navratri Arambha (આષાઢ ગુપ્ત નવરાત્રિ)',
    hindiName: '🌺 आषाढ़ गुप्त नवरात्रि प्रारम्भ',
    dateIso: '2026-07-15',
    category: 'MAJOR_FESTIVAL',
    deity: 'Maa Durga',
    description: 'Sacred Ashadha Gupt Navratri dedicated to Shakti Sadhana.',
    rituals: 'Shakti Aradhana & Fasting.',
    tithiDescription: 'Ashadha Shukla Pratipada',
    isHoliday: false
  },
  {
    id: 'f_sharad_navratri_start',
    name: '🌺 Sharad Maha Navratri Arambha / Garba Start (શારદીય મહા નવરાત્રિ - ગરબા)',
    hindiName: '🌺 शारदीय महा नवरात्रि प्रारम्भ (गरबा उत्सव)',
    dateIso: '2026-10-11',
    category: 'MAJOR_FESTIVAL',
    deity: 'Maa Durga / Amba Mata',
    description: 'Grand 9-night Sharad Maha Navratri festival. World-famous Garba & Dandiya Raas begin across Gujarat & India.',
    rituals: 'Garba Raas, Ghatasthapana, Akhand Deep, Mataji Aarti.',
    tithiDescription: 'Ashvin Shukla Pratipada',
    isHoliday: true
  },
  {
    id: 'f_sharad_durga_ashtami',
    name: '🌺 Sharad Navratri Durga Ashtami (મહા અષ્ટમી - ગરબા)',
    hindiName: '🌺 महा अष्टमी पूजा (गरबा नाइट)',
    dateIso: '2026-10-18',
    category: 'MAJOR_FESTIVAL',
    deity: 'Maa Mahagauri',
    description: 'Holy 8th night of Sharad Navratri. Kanya Pujan and Havan are performed.',
    rituals: 'Kanya Pujan, Havan, Maha Aarti.',
    tithiDescription: 'Ashvin Shukla Ashtami',
    isHoliday: true
  },
  {
    id: 'f_sharad_mahanavami',
    name: '🌺 Sharad Navratri Mahanavami (મહા નોમ)',
    hindiName: '🌺 महानवमी पूजा',
    dateIso: '2026-10-19',
    category: 'MAJOR_FESTIVAL',
    deity: 'Maa Siddhidatri',
    description: '9th and final night of Sharad Navratri.',
    rituals: 'Navami Havan, Kanya Bhojan, Garba Samapti.',
    tithiDescription: 'Ashvin Shukla Navami',
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

export function getLocalizedFestivalTitle(festival: Festival, language: string): string {
  if (language === 'gu' && festival.gujaratiName) {
    return festival.gujaratiName;
  }
  if (language === 'hi' && festival.hindiName) {
    return festival.hindiName;
  }
  return festival.name;
}
