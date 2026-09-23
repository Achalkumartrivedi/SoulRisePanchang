// Navtara Engine - 9 Tara Scheme in Vedic Astrology

export interface NavtaraDefinition {
  id: number; // 1 to 9
  nameEng: string;
  nameHin: string;
  nameGuj: string;
  category: 'SHUBHA' | 'ASHUBHA' | 'NEUTRAL';
  resultEng: string;
  resultHin: string;
  resultGuj: string;
  descEng: string;
  descHin: string;
  descGuj: string;
  colorHex: string;
}

export const NAVTARA_DEFINITIONS: Record<number, NavtaraDefinition> = {
  1: {
    id: 1,
    nameEng: 'Janma Tara',
    nameHin: 'जन्म तारा',
    nameGuj: 'જન્મ તારા',
    category: 'NEUTRAL',
    resultEng: 'Body & Self (Mixed)',
    resultHin: 'शरीर एवं स्वास्थ्य (मिश्रित)',
    resultGuj: 'શરીર અને સ્વાસ્થ્ય (મિશ્ર)',
    descEng: 'Represents physical self, body, and birth energy. Transits here require health mindfulness.',
    descHin: 'शारीरिक ऊर्जा एवं स्वास्थ्य का प्रतिनिधित्व करता है। यहां गोचर में स्वास्थ्य का ध्यान रखें।',
    descGuj: 'શારીરિક ઊર્જા અને સ્વાસ્થ્યનું પ્રતિનિધિત્વ કરે છે. અહીં ગોચરમાં સ્વાસ્થ્યનું ધ્યાન રાખવું.',
    colorHex: '#3F51B5'
  },
  2: {
    id: 2,
    nameEng: 'Sampat Tara',
    nameHin: 'संपत तारा',
    nameGuj: 'સંપત તારા',
    category: 'SHUBHA',
    resultEng: 'Wealth & Prosperity (Highly Auspicious)',
    resultHin: 'धन एवं समृद्धि (अत्यंत शुभ)',
    resultGuj: 'ધન અને સમૃદ્ધિ (અત્યંત શુભ)',
    descEng: 'Brings financial gains, prosperity, commercial success, and accumulation of assets.',
    descHin: 'वित्तीय लाभ, समृद्धि, व्यापारिक सफलता और संपत्ति संचय प्रदान करता है।',
    descGuj: 'નાણાકીય લાભ, સમૃદ્ધિ, વ્યાપારી સફળતા અને સંપત્તિ સંગ્રહ પ્રદાન કરે છે.',
    colorHex: '#2E7D32'
  },
  3: {
    id: 3,
    nameEng: 'Vipat Tara',
    nameHin: 'विपत तारा',
    nameGuj: 'વિપત તારા',
    category: 'ASHUBHA',
    resultEng: 'Misfortune & Hurdles (Inauspicious)',
    resultHin: 'विपत्ति एवं बाधाएं (अशुभ)',
    resultGuj: 'વિપત્તિ અને અવરોધો (અશુભ)',
    descEng: 'Indicates unexpected losses, obstacles, disputes, and sudden difficulties in tasks.',
    descHin: 'अचानक हानि, बाधाएं, विवाद और कार्यों में अप्रत्याशित कठिनाइयों का संकेत देता है।',
    descGuj: 'અચાનક નુકસાન, અવરોધો, વિવાદો અને કાર્યોમાં અણધારી મુશ્કેલીઓ દર્શાવે છે.',
    colorHex: '#C62828'
  },
  4: {
    id: 4,
    nameEng: 'Kshema Tara',
    nameHin: 'क्षेम तारा',
    nameGuj: 'ક્ષેમ તારા',
    category: 'SHUBHA',
    resultEng: 'Safety & Protection (Auspicious)',
    resultHin: 'कल्याण एवं सुरक्षा (शुभ)',
    resultGuj: 'કલ્યાણ અને સુરક્ષા (શુભ)',
    descEng: 'Grants safety, peace of mind, family well-being, protection, and smooth execution.',
    descHin: 'सुरक्षा, मानसिक शांति, पारिवारिक कल्याण और निर्विघ्न कार्य सिद्धि प्रदान करता है।',
    descGuj: 'સુરક્ષા, માનસિક શાંતિ, પારિવારિક કલ્યાણ અને નિર્વિધ્ન કાર્ય સિદ્ધિ આપે છે.',
    colorHex: '#1565C0'
  },
  5: {
    id: 5,
    nameEng: 'Pratyak Tara',
    nameHin: 'प्रत्यक तारा',
    nameGuj: 'પ્રત્યક તારા',
    category: 'ASHUBHA',
    resultEng: 'Opposition & Resistance (Inauspicious)',
    resultHin: 'विरोध एवं असफलता (अशुभ)',
    resultGuj: 'વિરોધ અને અસફળતા (અશુભ)',
    descEng: 'Causes delays, stubborn opposition, misunderstandings, and resistance from enemies.',
    descHin: 'विलंब, कड़ा विरोध, गलतफहमियां और शत्रुओं से प्रतिरोध उत्पन्न करता है।',
    descGuj: 'વિલંબ, કડવો વિરોધ, ગેરસમજ અને શત્રુઓ તરફથી પ્રતિકાર ઉત્પન્ન કરે છે.',
    colorHex: '#EF6C00'
  },
  6: {
    id: 6,
    nameEng: 'Sadhana Tara',
    nameHin: 'साधना तारा',
    nameGuj: 'સાધના તારા',
    category: 'SHUBHA',
    resultEng: 'Achievement & Realization (Highly Auspicious)',
    resultHin: 'सफलता एवं साधना (अत्यंत शुभ)',
    resultGuj: 'સફળતા અને સાધના (અત્યંત શુભ)',
    descEng: 'Fulfills ambitions, spiritual efforts, goal achievement, and high professional success.',
    descHin: 'महत्वाकांक्षाओं की पूर्ति, आध्यात्मिक प्रयास, लक्ष्य सिद्धि और उच्च सफलता देता है।',
    descGuj: 'મહત્વાકાંક્ષાઓની પૂર્તિ, આધ્યાત્મિક પ્રયાસ, લક્ષ્ય સિદ્ધિ અને ઉચ્ચ સફળતા આપે છે.',
    colorHex: '#6A1B9A'
  },
  7: {
    id: 7,
    nameEng: 'Naidhana / Vadha Tara',
    nameHin: 'निधन / वध तारा',
    nameGuj: 'નિધન / વધ તારા',
    category: 'ASHUBHA',
    resultEng: 'Severe Distress & Danger (Most Inauspicious)',
    resultHin: 'गंभीर कष्ट एवं संकट (अत्यंत अशुभ)',
    resultGuj: 'ગંભીર કષ્ટ અને સંકટ (અત્યંત અશુભ)',
    descEng: 'Most malefic Tara. High vulnerability, severe affliction, and critical caution needed.',
    descHin: 'सर्वाधिक अशुभ तारा। अत्यधिक संवेदनशीलता, गंभीर कष्ट और विशेष सावधानी आवश्यक।',
    descGuj: 'સૌથી અશુભ તારા. અત્યંત સંવેદનશીલતા, ગંભીર કષ્ટ અને વિશેષ સાવચેતી જરૂરી.',
    colorHex: '#B71C1C'
  },
  8: {
    id: 8,
    nameEng: 'Mitra Tara',
    nameHin: 'मित्र तारा',
    nameGuj: 'મિત્ર તારા',
    category: 'SHUBHA',
    resultEng: 'Friendship & Support (Auspicious)',
    resultHin: 'मित्रता एवं सहयोग (शुभ)',
    resultGuj: 'મિત્રતા અને સહયોગ (શુભ)',
    descEng: 'Brings supportive friends, pleasant interactions, mental joy, and smooth cooperation.',
    descHin: 'सहयोगी मित्र, सुखद बातचीत, मानसिक प्रसन्नता और सहज सहयोग लाता है।',
    descGuj: 'સહયોગી મિત્રો, સુખદ વાતચીત, માનસિક પ્રસન્નતા અને સહજ સહયોગ લાવે છે.',
    colorHex: '#00838F'
  },
  9: {
    id: 9,
    nameEng: 'Parama Mitra Tara',
    nameHin: 'परम मित्र तारा',
    nameGuj: 'પરમ મિત્ર તારા',
    category: 'SHUBHA',
    resultEng: 'Great Fortune & Alliances (Highly Auspicious)',
    resultHin: 'परम सौभाग्य एवं प्रगाढ़ संबंध (अत्यंत शुभ)',
    resultGuj: 'પરમ સૌભાગ્ય અને ગાઢ સંબંધો (અત્યંત શુભ)',
    descEng: 'High fortune, deep strategic alliances, royal honor, and immense long-term success.',
    descHin: 'उच्च सौभाग्य, प्रगाढ़ रणनीतिक संबंध, सम्मान और विशाल दीर्घकालिक सफलता।',
    descGuj: 'ઉચ્ચ સૌભાગ્ય, ગાઢ વ્યૂહાત્મક સંબંધો, સન્માન અને વિશાળ દીર્ઘકાલીન સફળતા.',
    colorHex: '#F57F17'
  }
};

export const ALL_27_NAKSHATRAS = [
  { index: 1, eng: 'Ashwini', hin: 'अश्विनी', guj: 'અશ્વિની', lord: 'Ketu' },
  { index: 2, eng: 'Bharani', hin: 'भरणी', guj: 'ભરણી', lord: 'Venus' },
  { index: 3, eng: 'Krittika', hin: 'कृत्तिका', guj: 'કૃત્તિકા', lord: 'Sun' },
  { index: 4, eng: 'Rohini', hin: 'रोहिणी', guj: 'રોહિણી', lord: 'Moon' },
  { index: 5, eng: 'Mrigashira', hin: 'मृगशिरा', guj: 'મૃગશીર્ષ', lord: 'Mars' },
  { index: 6, eng: 'Ardra', hin: 'आर्द्रा', guj: 'આર્દ્રા', lord: 'Rahu' },
  { index: 7, eng: 'Punarvasu', hin: 'पुनर्वसु', guj: 'પુનર્વસુ', lord: 'Jupiter' },
  { index: 8, eng: 'Pushya', hin: 'पुष्य', guj: 'પુષ્ય', lord: 'Saturn' },
  { index: 9, eng: 'Ashlesha', hin: 'आश्लेषा', guj: 'આશ્લેષા', lord: 'Mercury' },
  { index: 10, eng: 'Magha', hin: 'मघा', guj: 'મઘા', lord: 'Ketu' },
  { index: 11, eng: 'Purva Phalguni', hin: 'पूर्वा फाल्गुनी', guj: 'પૂર્વા ફાલ્ગુની', lord: 'Venus' },
  { index: 12, eng: 'Uttara Phalguni', hin: 'उत्तरा फाल्गुनी', guj: 'ઉત્તરા ફાલ્ગુની', lord: 'Sun' },
  { index: 13, eng: 'Hasta', hin: 'हस्त', guj: 'હસ્ત', lord: 'Moon' },
  { index: 14, eng: 'Chitra', hin: 'चित्रा', guj: 'ચિત્રા', lord: 'Mars' },
  { index: 15, eng: 'Swati', hin: 'स्वाति', guj: 'સ્વાતિ', lord: 'Rahu' },
  { index: 16, eng: 'Vishakha', hin: 'विशाखा', guj: 'વિશાખા', lord: 'Jupiter' },
  { index: 17, eng: 'Anuradha', hin: 'अनुराधा', guj: 'અનુરાધા', lord: 'Saturn' },
  { index: 18, eng: 'Jyeshtha', hin: 'ज्येष्ठा', guj: 'જ્યેષ્ઠા', lord: 'Mercury' },
  { index: 19, eng: 'Mula', hin: 'मूल', guj: 'મૂળ', lord: 'Ketu' },
  { index: 20, eng: 'Purva Ashadha', hin: 'पूर्वाषाढ़ा', guj: 'પૂર્વાષાઢા', lord: 'Venus' },
  { index: 21, eng: 'Uttara Ashadha', hin: 'उत्तराषाढ़ा', guj: 'ઉત્તરાષાઢા', lord: 'Sun' },
  { index: 22, eng: 'Shravana', hin: 'श्रवण', guj: 'શ્રવણ', lord: 'Moon' },
  { index: 23, eng: 'Dhanishta', hin: 'धनिष्ठा', guj: 'ધનિષ્ઠા', lord: 'Mars' },
  { index: 24, eng: 'Shatabhisha', hin: 'शतभिषा', guj: 'શતભિષા', lord: 'Rahu' },
  { index: 25, eng: 'Purva Bhadrapada', hin: 'पूर्वाभाद्रपद', guj: 'પૂર્વાભાદ્રપદ', lord: 'Jupiter' },
  { index: 26, eng: 'Uttara Bhadrapada', hin: 'उत्तराभाद्रपद', guj: 'ઉત્તરાભાદ્રપદ', lord: 'Saturn' },
  { index: 27, eng: 'Revati', hin: 'रेवती', guj: 'રેવતી', lord: 'Mercury' }
];

export interface CalculatedNakshatraTara {
  nakshatraIndex: number; // 1..27
  nakshatraEng: string;
  nakshatraHin: string;
  nakshatraGuj: string;
  lord: string;
  taraId: number; // 1..9
  taraNameEng: string;
  taraNameHin: string;
  taraNameGuj: string;
  paryaya: number; // 1, 2, 3
  category: 'SHUBHA' | 'ASHUBHA' | 'NEUTRAL';
  colorHex: string;
}

export function calculateNavtara(janmaNakshatraIndex: number): CalculatedNakshatraTara[] {
  const janmaIdx = Math.max(1, Math.min(27, janmaNakshatraIndex));

  return ALL_27_NAKSHATRAS.map(nak => {
    // Count distance starting from janmaIdx = 1
    const dist = ((nak.index - janmaIdx + 27) % 27) + 1;
    const taraId = ((dist - 1) % 9) + 1;
    const paryaya = Math.ceil(dist / 9);
    const def = NAVTARA_DEFINITIONS[taraId];

    return {
      nakshatraIndex: nak.index,
      nakshatraEng: nak.eng,
      nakshatraHin: nak.hin,
      nakshatraGuj: nak.guj,
      lord: nak.lord,
      taraId,
      taraNameEng: def.nameEng,
      taraNameHin: def.nameHin,
      taraNameGuj: def.nameGuj,
      paryaya,
      category: def.category,
      colorHex: def.colorHex
    };
  });
}
