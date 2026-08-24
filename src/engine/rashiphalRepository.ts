import { RashiDetail } from '../types/panchang';

export const RASHIPHAL_DATA: RashiDetail[] = [
  {
    id: 'mesha',
    name: 'Aries (Mesha)',
    hindiName: 'मेष (Aries)',
    symbol: '♈',
    element: 'Fire',
    rulingPlanet: 'Mars (Mangal)',
    dailyPrediction: 'A highly energetic and productive day for financial and career decisions. Your natural leadership qualities will shine.',
    predictionHindi: 'आज का दिन करियर और वित्तीय निर्णयों के लिए अत्यधिक ऊर्जावान और फलदायी है। नेतृत्व क्षमता में वृद्धि होगी।',
    luckyNumber: 9,
    luckyColor: '#D32F2F', // Deep Red
    compatibility: 'Leo, Sagittarius'
  },
  {
    id: 'vrishabha',
    name: 'Taurus (Vrishabha)',
    hindiName: 'वृषभ (Taurus)',
    symbol: '♉',
    element: 'Earth',
    rulingPlanet: 'Venus (Shukra)',
    dailyPrediction: 'Focus on family relationships and mental peace. Financial gains through creative pursuits are highly indicated.',
    predictionHindi: 'पारिवारिक संबंधों और मानसिक शांति पर ध्यान केंद्रित करें। रचनात्मक कार्यों से धन लाभ के योग हैं।',
    luckyNumber: 6,
    luckyColor: '#FFB300', // Amber Gold
    compatibility: 'Virgo, Capricorn'
  },
  {
    id: 'mithuna',
    name: 'Gemini (Mithuna)',
    hindiName: 'मिथुन (Gemini)',
    symbol: '♊',
    element: 'Air',
    rulingPlanet: 'Mercury (Budha)',
    dailyPrediction: 'Excellent communication skills will open new doors in business and personal partnerships. Stay open to new ideas.',
    predictionHindi: 'संवाद क्षमता से व्यावसायिक और व्यक्तिगत क्षेत्रों में नए अवसर प्राप्त होंगे। विचारों का आदान-प्रदान लाभदायक रहेगा।',
    luckyNumber: 5,
    luckyColor: '#4CAF50', // Emerald Green
    compatibility: 'Libra, Aquarius'
  },
  {
    id: 'karka',
    name: 'Cancer (Karka)',
    hindiName: 'कर्क (Cancer)',
    symbol: '♋',
    element: 'Water',
    rulingPlanet: 'Moon (Chandra)',
    dailyPrediction: 'Emotional clarity will help you resolve long-standing dilemmas. Spend peaceful time near nature or in meditation.',
    predictionHindi: 'भावनात्मक स्पष्टता से पुराने मतभेद सुलझेंगे। ध्यान और प्रकृति के निकट समय व्यतीत करना शुभ रहेगा।',
    luckyNumber: 2,
    luckyColor: '#E0E0E0', // Pearl White
    compatibility: 'Scorpio, Pisces'
  },
  {
    id: 'simha',
    name: 'Leo (Simha)',
    hindiName: 'सिंह (Leo)',
    symbol: '♌',
    element: 'Fire',
    rulingPlanet: 'Sun (Surya)',
    dailyPrediction: 'Recognition and appreciation from superiors or social circles. A favorable day for launching ambitious plans.',
    predictionHindi: 'कार्यक्षेत्र में सम्मान और प्रतिष्ठा में वृद्धि होगी। नई योजनाओं को शुरू करने के लिए उत्तम समय है।',
    luckyNumber: 1,
    luckyColor: '#FF6F00', // Saffron Gold
    compatibility: 'Aries, Sagittarius'
  },
  {
    id: 'kanya',
    name: 'Virgo (Kanya)',
    hindiName: 'कन्या (Virgo)',
    symbol: '♍',
    element: 'Earth',
    rulingPlanet: 'Mercury (Budha)',
    dailyPrediction: 'Attention to detail will prevent potential mistakes in contracts or agreements. Practice mindfulness and health routines.',
    predictionHindi: 'बारीकियों पर ध्यान देने से काम में सफलता मिलेगी। स्वास्थ्य और आहार नियम का पालन करें।',
    luckyNumber: 5,
    luckyColor: '#00897B', // Teal Green
    compatibility: 'Taurus, Capricorn'
  },
  {
    id: 'tula',
    name: 'Libra (Tula)',
    hindiName: 'तुला (Libra)',
    symbol: '♎',
    element: 'Air',
    rulingPlanet: 'Venus (Shukra)',
    dailyPrediction: 'Harmony in personal bonds and smooth financial negotiations. Art and culture will bring deep inner joy.',
    predictionHindi: 'रिश्तों में मधुरता आएगी और वित्तीय समझौते सुगम रहेंगे। कला एवं संगीत से आनंद की प्राप्ति होगी।',
    luckyNumber: 7,
    luckyColor: '#F48FB1', // Soft Pink
    compatibility: 'Gemini, Aquarius'
  },
  {
    id: 'vrischika',
    name: 'Scorpio (Vrischika)',
    hindiName: 'वृश्चिक (Scorpio)',
    symbol: '♏',
    element: 'Water',
    rulingPlanet: 'Mars (Mangal)',
    dailyPrediction: 'Intuition is exceptionally high today. Trust your inner gut feeling when making strategic financial choices.',
    predictionHindi: 'आज आपकी अंतर्दृष्टि अत्यधिक तीव्र रहेगी। रणनीतिक फैसलों में अपने अंतर्मन पर विश्वास रखें।',
    luckyNumber: 9,
    luckyColor: '#880E4F', // Dark Maroon
    compatibility: 'Cancer, Pisces'
  },
  {
    id: 'dhanu',
    name: 'Sagittarius (Dhanu)',
    hindiName: 'धनु (Sagittarius)',
    symbol: '♐',
    element: 'Fire',
    rulingPlanet: 'Jupiter (Brihaspati)',
    dailyPrediction: 'Spiritual inclination and interest in higher learning will bring immense satisfaction and peace of mind.',
    predictionHindi: 'आध्यात्मिक झुकाव और उच्च शिक्षा में रुचि से मानसिक शांति और संतुष्टि प्राप्त होगी।',
    luckyNumber: 3,
    luckyColor: '#FBC02D', // Bright Yellow
    compatibility: 'Aries, Leo'
  },
  {
    id: 'makara',
    name: 'Capricorn (Makara)',
    hindiName: 'मकर (Capricorn)',
    symbol: '♑',
    element: 'Earth',
    rulingPlanet: 'Saturn (Shani)',
    dailyPrediction: 'Disciplined work ethics will reward you with progress and stability. Patience is your strongest asset today.',
    predictionHindi: 'अनुशासित प्रयास सफलता और स्थायित्व दिलाएंगे। आज धैर्य ही आपका सबसे बड़ा बल है।',
    luckyNumber: 8,
    luckyColor: '#424242', // Charcoal Grey
    compatibility: 'Taurus, Virgo'
  },
  {
    id: 'kumbha',
    name: 'Aquarius (Kumbha)',
    hindiName: 'कुंभ (Aquarius)',
    symbol: '♒',
    element: 'Air',
    rulingPlanet: 'Saturn (Shani)',
    dailyPrediction: 'Innovative ideas and collaborative teamwork will generate impressive results. Social connections thrive.',
    predictionHindi: 'नवाचार और सामूहिक प्रयास से उत्कृष्ट परिणाम हासिल होंगे। सामाजिक संबंधों में प्रगाढ़ता आएगी।',
    luckyNumber: 8,
    luckyColor: '#0288D1', // Sapphire Blue
    compatibility: 'Gemini, Libra'
  },
  {
    id: 'meena',
    name: 'Pisces (Meena)',
    hindiName: 'मीन (Pisces)',
    symbol: '♓',
    element: 'Water',
    rulingPlanet: 'Jupiter (Brihaspati)',
    dailyPrediction: 'Compassion and spiritual devotion will bring serene calm. Excellent time for meditation and devotional prayers.',
    predictionHindi: 'करुणा और भक्ति भावना से मन शांत रहेगा। ध्यान और आराधना के लिए बहुत शुभ दिन है।',
    luckyNumber: 3,
    luckyColor: '#FFB74D', // Soft Saffron
    compatibility: 'Cancer, Scorpio'
  }
];

export function getAllRashiphal(): RashiDetail[] {
  return RASHIPHAL_DATA;
}
