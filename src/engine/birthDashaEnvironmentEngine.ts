import { buildFullMultiLang } from '../i18n/astrologyRuleTranslations';
import { normalizeNakshatraName } from './nakshatraTattvaEngine';

export interface BirthDashaEnvironmentPrediction {
  nakshatraName: string;
  dashaLord: string; // 'Surya (Sun)', 'Chandra (Moon)', etc.
  lordSymbol: string;
  nakshatraPortals: string;
  householdTitle: Record<string, string>;
  theoreticalBaseline: Record<string, string>;
  familyEnvironment: Record<string, string>;
  fatherAndUnclesCareer: Record<string, string>;
  childhoodAtmosphere: Record<string, string>;
  behavioralBlessings: Record<string, string>;
  vulnerabilities: Record<string, string>;
}

export const DASHA_LORD_ENVIRONMENT_MAP: Record<string, {
  dashaLord: string;
  symbol: string;
  portals: string;
  title: Record<string, string>;
  theoreticalBaseline: Record<string, string>;
  environment: Record<string, string>;
  careers: Record<string, string>;
  atmosphere: Record<string, string>;
  blessings: Record<string, string>;
  vulnerabilities: Record<string, string>;
}> = {
  'Surya (Sun)': {
    dashaLord: 'Surya (Sun / सूर्य)',
    symbol: '☀️',
    portals: 'Krittika, Uttara Phalguni, Uttara Ashadha',
    title: buildFullMultiLang(
      'First Mahadasha: Sun (Institutional Authority, Sovereign Control & Civic Status)',
      'प्रथम महादशा: सूर्य (प्रशासनिक अधिकार, राजकीय प्रतिष्ठा एवं संस्थागत नेतृत्व)',
      'પ્રથમ મહાદશા: સૂર્ય (વહીવટી અધિકાર, રાજકીય પ્રતિષ્ઠા અને શિસ્ત)',
      {
        hinglish: 'First Mahadasha: Sun (Government Authority, Civic Status & Discipline)'
      }
    ),
    theoreticalBaseline: buildFullMultiLang(
      'The Janma Dasha of Surya establishes an environmental blueprint governed by institutional authority, sovereign control, high civic dignity, and paternal dominance. The early household absorbs reality through public responsibility and lineage prestige.',
      'सूर्य की जन्म महादशा उच्च संस्थागत अधिकार, संप्रभु नियंत्रण, राजकीय सम्मान और पितृ सत्ता से ओत-प्रोत पारिवारिक संरचना का निर्माण करती है। बचपन का वातावरण सामाजिक प्रतिष्ठा और सिद्धांतों पर केंद्रित रहता है।',
      'સૂર્યની જન્મ મહાદશા ઉચ્ચ વહીવટી અધિકાર, રાજકીય સન્માન અને પિતૃ સત્તાથી ભરેલી કૌટુંબિક રચના બનાવે છે. બાળપણનું વાતાવરણ પ્રતિષ્ઠા અને શિસ્ત પર કેન્દ્રિત રહે છે.'
    ),
    environment: buildFullMultiLang(
      'Formal, duty-bound, and strictly ordered around the father\'s or elders\' vocational commitments and public standing. High exposure to social hierarchy, protocol, and civic duty.',
      'घर का माहौल औपचारिक, कर्तव्यनिष्ठ और पिता या बुजुर्गों के आधिकारिक दायित्वों एवं सामाजिक स्थिति के इर्द-गिर्द घूमता है। परिवार में अनुशासन, परंपरा और नियमों का कड़ाई से पालन होता है।',
      'ઘરનું વાતાવરણ ઔપચારિક, ફરજ નિષ્ઠ અને પિતા કે વડીલોની સામાજિક પ્રતિષ્ઠા અનુસાર રહે છે. શિસ્ત અને નિયમોનું કડક પાલન થાય છે.'
    ),
    careers: buildFullMultiLang(
      '🏛️ Broad Vocational Spheres: Government administration, civil services (IAS, IPS, Class-1 Gazetted Officers), political statecraft, public sector leadership, legal magistracy, state-sanctioned healthcare administration, or executive corporate leadership.',
      '🏛️ व्यापक पारिवारिक व्यवसाय: पिता, चाचा या बुजुर्ग मुख्य रूप से सरकारी प्रशासन, सिविल सर्विसेज (IAS/IPS), प्रशासनिक सेवा, सरकारी अस्पताल/चिकित्सा, राजनीति, न्यायपालिका या उच्च राजकीय/कॉर्पोरेट पदों पर कार्यरत होते हैं।',
      '🏛️ વ્યાપક કૌટુંબિક વ્યવસાય: પિતા કે વડીલો મુખ્યત્વે સરકારી વહીવટ, સિવિલ સર્વિસ (IAS/IPS), સરકારી તબીબી, રાજકારણ કે ન્યાયતંત્રમાં હોદ્દા પર હોય છે.'
    ),
    atmosphere: buildFullMultiLang(
      'Clean, highly disciplined, punctual household with an uncompromising emphasis on truthfulness, family honor, self-respect, and public dignity.',
      'स्वच्छ, अनुशासित और समय का पाबंद घर जहाँ सत्य, कुल-प्रतिष्ठा, स्वाभिमान और राजकीय मर्यादा को सर्वोच्च प्राथमिकता दी जाती है।',
      'સ્વચ્છ, શિસ્તબદ્ધ ઘર જ્યાં સત્ય, કુળ-પ્રતિષ્ઠા અને સ્વાભિમાનને સર્વોચ્ચ મહત્વ આપવામાં આવે છે.'
    ),
    blessings: buildFullMultiLang(
      'Instills early self-confidence, natural executive leadership, high self-esteem, articulate speech, and lifelong respect for authority and righteousness.',
      'बाल्यकाल से ही उच्च आत्मविश्वास, स्वाभाविक नेतृत्व क्षमता, आत्म-सम्मान और सिद्धांतों पर चलने का दृढ संस्कार मिलता है।',
      'નાનપણથી જ ઉચ્ચ આત્મ-વિશ્વાસ અને નેતૃત્વ ક્ષમતાનો આશીર્વાદ મળે છે.'
    ),
    vulnerabilities: buildFullMultiLang(
      'If afflicted: Exposure to acute paternal scrutiny, rigid expectations, bureaucratic conflicts, regulatory investigations, or paternal health vulnerabilities.',
      'यदि पीड़ित हो: पिता का अत्यधिक कठोर नियंत्रण, उच्च अपेक्षाएं, प्रशासनिक/सरकारी अड़चनें, या पिता के स्वास्थ्य से जुड़ी चुनौतियाँ।',
      'જો પિડીત હોય: પિતાનું અતિશય કડક વલણ, સરકારી અડચણો કે પિતાના સ્વાસ્થ્ય અંગેની ચિંતાઓ.'
    )
  },
  'Chandra (Moon)': {
    dashaLord: 'Chandra (Moon / चंद्र)',
    symbol: '🌙',
    portals: 'Rohini, Hasta, Shravana',
    title: buildFullMultiLang(
      'First Mahadasha: Moon (Maternal Governance, Fluid Capital & Public Nurturance)',
      'प्रथम महादशा: चंद्रमा (मातृ सत्ता, तरल पूंजी, लोक कल्याण एवं संवेदनशीलता)',
      'પ્રથમ મહાદશા: ચંદ્રમા (માતૃ સત્તા, તરલ મૂડી અને જાહેર કલ્યાણ)'
    ),
    theoreticalBaseline: buildFullMultiLang(
      'Initiating life under the Moon places the child in an environment dominated by maternal lineage, emotional sensitivity, and public-facing or nourishing trades. Capital flows readily in and out rather than solidifying into static reserves.',
      'चंद्रमा की जन्म महादशा बालक को मातृ वंश, भावनात्मक संवेदनशीलता और जन-कल्याणकारी व्यवसायों से जुड़े परिवार में स्थापित करती है। यहाँ धन का प्रवाह तरल और निरंतर बना रहता है।',
      'ચંદ્રમાની જન્મ મહાદશા બાળકને માતૃ પક્ષ, ભાવનાત્મક હૂંફ અને જાહેર કલ્યાણના વ્યવસાયો સાથે જોડે છે.'
    ),
    environment: buildFullMultiLang(
      'Emotionally responsive and maternal in structure, with the mother or maternal grandmother acting as the primary authority figure and emotional anchor. Highly hospitable and integrated into community life.',
      'घर का माहौल संवेदनशील और भावनात्मक रूप से समृद्ध रहता है। माता या नानी/दादी परिवार की मुख्य धुरी होती हैं। मेहमाननवाजी और सामाजिक सरोकार प्रमुख रहते हैं।',
      'ઘરનું વાતાવરણ સંવેદનશીલ રહે છે. માતા કે દાદી/નાની પરિવારનું કેન્દ્રબિંદુ હોય છે.'
    ),
    careers: buildFullMultiLang(
      '🌊 Broad Vocational Spheres: Healthcare, pediatrics, nursing, social care, hospitality, dairy production, marine enterprise, agriculture, food commodities trade, municipal water services, regional transit, or public travel.',
      '🌊 व्यापक पारिवारिक व्यवसाय: परिवार के सदस्य मुख्य रूप से चिकित्सा, बाल रोग विशेषज्ञ (Pediatrics), नर्सिंग, डेयरी उद्योग, खाद्य सामग्री व्यापार, जल/नौसेना सेवा, होटल/आतिथ्य या यात्रा व्यवसाय से जुड़े रहते हैं।',
      '🌊 વ્યાપક કૌટુંબિક વ્યવસાય: કૌટુંબિક સભ્યો મુખ્યત્વે તબીબી, ડેરી ઉદ્યોગ, ખાદ્ય વેપાર, જળ વ્યવસાય, હોટેલ કે પ્રવાસ ક્ષેત્રે હોય છે.'
    ),
    atmosphere: buildFullMultiLang(
      'Warm, imaginative, and devotionally active household filled with emotional sharing, culinary activities, musical appreciation, and community interaction.',
      'स्नेहपूर्ण, कल्पनाशील और भक्ति भाव से परिपूर्ण घर जहाँ खान-पान, संगीत, और आत्मीय चर्चाएं लगातार बनी रहती हैं।',
      'હૂંફાળું, કલ્પનાશીલ અને ભક્તિભાવથી ભરેલું ઘર જ્યાં કળા અને પ્રેમને પ્રોત્સાહન મળે છે.'
    ),
    blessings: buildFullMultiLang(
      'Bestows profound empathy, sharp psychological intuition, artistic sensitivity, public popularity, and a lifelong protective bond with the mother.',
      'गहरी संवेदनशीलता, अंतर्दृष्टि, कलात्मक रुचि और माता के साथ अटूट भावनात्मक सुरक्षा का आशीर्वाद मिलता है।',
      'ઊંડી સંવેદનશીલતા અને માતા સાથે ગાઢ પ્રેમ-સુરક્ષા આપે છે.'
    ),
    vulnerabilities: buildFullMultiLang(
      'If afflicted: Domestic relocations, fluctuating household financial stability, maternal health vulnerabilities, or persistent emotional stress during early childhood.',
      'यदि पीड़ित हो: बार-बार स्थान परिवर्तन, पारिवारिक आय में उतार-चढ़ाव, माता का अस्वास्थ्य, या बचपन में मानसिक चिंताएं।',
      'જો પિડીત હોય: વારંવાર સ્થળ બદલાવ, આવકમાં ઉતાર-ચઢાવ કે માતાનું અસ્વાસ્થ્ય.'
    )
  },
  'Mangala (Mars)': {
    dashaLord: 'Mangala (Mars / मंगल)',
    symbol: '♂️',
    portals: 'Mrigashira, Chitra, Dhanishta',
    title: buildFullMultiLang(
      'First Mahadasha: Mars (Landed Infrastructure, Technical Enterprise & Uniformed Order)',
      'प्रथम महादशा: मंगल (भूमि, अचल संपत्ति, तकनीकी पराक्रम एवं सैन्य/पुलिस अनुशासन)',
      'પ્રથમ મહાદશા: મંગળ (જમીન-જાયદાદ, ટેકનિકલ પરાક્રમ અને સેના/પોલીસ શિસ્ત)'
    ),
    theoreticalBaseline: buildFullMultiLang(
      'A Mars Janma Dasha roots the infant in an active, demanding, and assertive domestic environment governed by physical land, structural engineering, uniformed services, and technical machinery.',
      'मंगल की जन्म महादशा बालक को ऊर्जावान, अनुशासित और भूमि/मशीनरी से जुड़े जुझारू माहौल में रखती है। परिवार में इंजीनियरिंग, रक्षा बलों या संपत्ति निर्माण की प्रमुखता रहती है।',
      'મંગળની જન્મ મહાદશા બાળકને ઉર્જાવાન, શિસ્તબદ્ધ અને જમીન/મશીનરી સાથે જોડાયેલા માહોલમાં રાખે છે.'
    ),
    environment: buildFullMultiLang(
      'Structured by strict discipline, physical activity, and decisive parental leadership. Practical productivity and physical stamina are prioritized over emotional nuance.',
      'घर का माहौल अत्यधिक अनुशासित, सक्रिय और व्यावहारिक होता है। आलस्य को जगह नहीं मिलती और शारीरिक श्रम व निर्णय क्षमता को महत्व दिया जाता है।',
      'ઘરનું વાતાવરણ અત્યંત શિસ્તબદ્ધ અને સક્રિય રહે છે. શારીરિક શ્રમ અને મજબૂત નિર્ણયોને મહત્વ અપાય છે.'
    ),
    careers: buildFullMultiLang(
      '⚔️ Broad Vocational Spheres: Uniformed defense forces, police, paramilitary, private security; civil engineering, construction contracting, real estate development, property brokerage, heavy machinery/metallurgy; surgery, pathology, or emergency response.',
      '⚔️ व्यापक पारिवारिक व्यवसाय: पिता या चाचा पुलिस, सेना, अर्द्धसैनिक बल, सिविल इंजीनियरिंग, रियल एस्टेट/प्रॉपर्टी डीलिंग, भारी मशीनरी, धातुकर्म (Metallurgy), शल्य चिकित्सा (Surgery) या आपातकालीन चिकित्सा में कार्यरत होते हैं।',
      '⚔️ વ્યાપક કૌટુંબિક વ્યવસાય: પિતા કે કાકા પોલીસ, સેના, એન્જિનિયરિંગ, રિયલ એસ્ટેટ, સર્જરી કે ભારે ઉદ્યોગોમાં જોડાયેલા હોય છે.'
    ),
    atmosphere: buildFullMultiLang(
      'Dynamic, fast-paced home centered around sports, mechanical repairs, land acquisitions, residential renovations, and active physical pursuits.',
      'सक्रिय और तेजतर्रार माहौल जहाँ भूमि सौदों, निर्माण कार्यों, खेलों और तकनीकी चर्चाओं का बोलबाला रहता है।',
      'સક્રિય અને ઝડપી માહોલ જ્યાં મકાન બાંધકામ, જમીન અને રમત-ગમતના વિષયો રહે છે.'
    ),
    blessings: buildFullMultiLang(
      'Forges fearless courage, quick reflexes, high mechanical aptitude, athletic resilience, and decisive problem-solving abilities.',
      'निडरता, शीघ्र निर्णय क्षमता, तकनीकी कुशलता और शारीरिक रूप से मजबूत व्यक्तित्व का विकास होता है।',
      'નિડરતા, ત્વરિત નિર્ણય ક્ષમતા અને ટેકનિકલ કૌશલ્ય આપે છે.'
    ),
    vulnerabilities: buildFullMultiLang(
      'If afflicted: Property litigation, boundary disputes, high household friction, harsh domestic temperaments, or physical accidents/injuries.',
      'यदि पीड़ित हो: जमीन-जायदाद के विवाद, पारिवारिक क्लेश, उग्र स्वभाव, या बचपन में चोट-चपेट की संभावना।',
      'જો પિડીત હોય: જમીન અંગેના વિવાદો, ઘરકંકાશ કે બાળપણમાં ઈજાઓ.'
    )
  },
  'Rahu': {
    dashaLord: 'Rahu (राहु)',
    symbol: '☊',
    portals: 'Ardra, Swati, Shatabhisha',
    title: buildFullMultiLang(
      'First Mahadasha: Rahu (Unconventional Expansion, Technology & Socio-Economic Dynamics)',
      'प्रथम महादशा: राहु (तकनीकी नवाचार, अपरंपरागत विकास, विदेश संबंध एवं महत्वाकांक्षा)',
      'પ્રથમ મહાદશા: રાહુ (ટેકનોલોજી, અપરંપરાગત વિકાસ અને વિદેશી સંબંધો)'
    ),
    theoreticalBaseline: buildFullMultiLang(
      'Entering life under Rahu places the child within a non-traditional, highly dynamic, and culturally complex household. Rahu signifies technological advances, foreign ties, rapid mobility, and systemic disruption.',
      'राहु की जन्म महादशा बालक को आधुनिक, अपरंपरागत और तेजी से बदलते माहौल में स्थापित करती है। परिवार में विदेशी संपर्कों, नई तकनीकों या महत्वाकांक्षी योजनाओं का प्रभाव रहता है।',
      'રાહુની જન્મ મહાદશા બાળકને આધુનિક અને ઝડપથી બદલાતા માહોલમાં રાખે છે. નવી ટેકનોલોજી અને વિદેશી સંપર્કો મુખ્ય રહે છે.'
    ),
    environment: buildFullMultiLang(
      'Non-traditional, ambitious, and culturally diverse home environment. The family often experiences substantial socio-economic shifts, foreign travel, or residence far from ancestral roots.',
      'महत्वाकांक्षी, आधुनिक और अपरंपरागत घर। परिवार में अचानक आर्थिक प्रगति, विदेश यात्राएं या पैतृक स्थान से दूर बसने के योग बनते हैं।',
      'મહત્વાકાંક્ષી અને આધુનિક ઘર. પરિવારમાં આકસ્મિક આર્થિક ફેરફારો કે વિદેશ સંબંધો રહે છે.'
    ),
    careers: buildFullMultiLang(
      '🌐 Broad Vocational Spheres: Cutting-edge computing/IT, telecommunications, research science, media broadcasting; chemical and pharmaceutical industries, aviation, import-export trade, multinational enterprise, or political strategy.',
      '🌐 व्यापक पारिवारिक व्यवसाय: सूचना प्रौद्योगिकी (IT), इलेक्ट्रॉनिक्स, अनुसंधान, रसायन/फार्मास्यूटिकल्स, एविएशन, आयात-निर्यात (Import-Export), बहुराष्ट्रीय कंपनियां (MNCs) या मीडिया/राजनीतिक रणनीति।',
      '🌐 વ્યાપક કૌટુંબિક વ્યવસાય: કમ્પ્યુટર/IT, ફાર્માસ્યુટિકલ્સ, એવિએશન, આયાત-નિકાસ, કેમિકલ કે મીડિયા ક્ષેત્ર.'
    ),
    atmosphere: buildFullMultiLang(
      'Fast-changing, tech-filled, and ambitious household with high focus on modern amenities, international trends, and upward social mobility.',
      'आधुनिक उपकरणों और उच्च महत्वाकांक्षाओं से भरा घर जहाँ नए प्रयोगों और सामाजिक बदलावों को अपनाया जाता है।',
      'આધુનિક સાધનો અને ઉચ્ચ આકાંક્ષાઓથી ભરેલું ઘર.'
    ),
    blessings: buildFullMultiLang(
      'Instills out-of-the-box thinking, technical genius, extraordinary adaptability, global perspective, and ambitious vision.',
      'अद्वितीय सोच, तकनीकी चातुर्य, विपरीत परिस्थितियों में ढलने की क्षमता और दूरदर्शी दृष्टिकोण प्रदान करता है।',
      'અનોખી સોચ, ટેકનિકલ ચાતુર્ય અને ઉચ્ચ દ્રષ્ટિ આપે છે.'
    ),
    vulnerabilities: buildFullMultiLang(
      'If afflicted: Tense domestic atmosphere, paternal career instability, deceptive financial partnerships, social isolation, or undiagnosed health concerns.',
      'यदि पीड़ित हो: पारिवारिक अस्थिरता, पिता के करियर में अचानक उतार-चढ़ाव, धोखेबाजी, या अज्ञात बीमारियां।',
      'જો પિડીત હોય: કૌટુંબિક અસ્થિરતા, આવકમાં અચાનક ફેરફાર કે અજ્ઞાત ચિંતાઓ.'
    )
  },
  'Brihaspati (Jupiter)': {
    dashaLord: 'Brihaspati (Jupiter / गुरु)',
    symbol: '♃',
    portals: 'Punarvasu, Vishakha, Purva Bhadrapada',
    title: buildFullMultiLang(
      'First Mahadasha: Jupiter (Dharmic Lineage, Academic Prestige & Institutional Counsel)',
      'प्रथम महादशा: गुरु (धर्मिक परंपरा, विद्या, न्याय, बैंकिंग एवं संस्थागत सम्मान)',
      'પ્રથમ મહાદશા: ગુરુ (ધાર્મિક પરંપરા, શિક્ષણ, ન્યાય અને બેંકિંગ)'
    ),
    theoreticalBaseline: buildFullMultiLang(
      'A birth under Jupiter places the soul in an environment defined by education, ethical principles, institutional respect, and financial wisdom. Priority is given to moral integrity and scholarly heritage.',
      'बृहस्पति की जन्म महादशा बालक को सात्विक, विद्वतापूर्ण और संस्कारवान वातावरण प्रदान करती है। परिवार में शिक्षा, नीतिशास्त्र, न्याय और वित्तीय ज्ञान का सम्मान होता है।',
      'બૃહસ્પતિની જન્મ મહાદશા બાળકને સંસ્કારી, વિદ્વાન અને નૈતિક વાતાવરણ આપે છે.'
    ),
    environment: buildFullMultiLang(
      'Characterized by cultural refinement, respect for traditional learning, and moral responsibility. Sustained financial stability, domestic harmony, and growing communal prestige.',
      'संस्कारवान, शांत और मर्यादित माहौल। परिवार समाज में अपनी प्रामाणिकता, विद्वता और धार्मिक निष्ठा के लिए जाना जाता है।',
      'સંસ્કારી અને શાંત માહોલ. પરિવાર સમાજમાં તેની પ્રતિષ્ઠા અને ધાર્મિક નિષ્ઠા માટે સન્માનિત થાય છે.'
    ),
    careers: buildFullMultiLang(
      '🎓 Broad Vocational Spheres: Higher education, university professorships, academic administration; senior attorneys, judicial magistrates, corporate legal counselors; commercial banking, chartered accountancy, wealth management, or spiritual/temple trusts.',
      '🎓 व्यापक पारिवारिक व्यवसाय: पिता या बुजुर्ग प्रोफेसर, शिक्षक, न्यायाधीश, वरिष्ठ अधिवक्ता (Lawyers), चार्टर्ड अकाउंटेंट (CA), बैंकर, वित्तीय सलाहकार या धार्मिक संस्थाओं के प्रमुख होते हैं।',
      '🎓 વ્યાપક કૌટુંબિક વ્યવસાય: પિતા કે વડીલો પ્રોફેસર, જજ, વકીલ, ચાર્ટર્ડ એકાઉન્ટન્ટ (CA), બેંકર કે ધાર્મિક માર્ગદર્શક હોય છે.'
    ),
    atmosphere: buildFullMultiLang(
      'Serene, spiritual home filled with books, scriptures, incense, visiting scholars/saints, and discourses on law, ethics, and philosophy.',
      'मंत्रोच्चार, ग्रंथों और विद्वानों के आगमन से सुशोभित वातावरण जहाँ ज्ञान और सदाचार की पूजा होती है।',
      'મંત્રોચ્ચાર અને પવિત્ર શાસ્ત્રોથી સુશોભિત શાંત અને પવિત્ર વાતાવરણ.'
    ),
    blessings: buildFullMultiLang(
      'Grants divine protection, moral purity, deep respect for elders, natural academic excellence, and lifelong wisdom.',
      'ईश्वरीय सुरक्षा, उच्च नैतिक मूल्य, विद्या में स्वाभाविक निपुणता और बड़ों का आशीर्वाद मिलता है।',
      'ઈશ્વરીય રક્ષણ, નૈતિક મૂલ્યો અને શિક્ષણમાં સફળતા આપે છે.'
    ),
    vulnerabilities: buildFullMultiLang(
      'If afflicted: Financial strain from overextended credit/bad business guarantees, dogmatic lineage conflicts, or ideological disputes with extended family.',
      'यदि पीड़ित हो: दूसरों की गारंटी लेने से वित्तीय नुकसान, कट्टर विचार, या रिश्तेदारों के साथ वैचारिक मतभेद।',
      'જો પિડીત હોય: ગેરંટી કે દેવાના કારણે નાણાકીય નુકસાન કે સગાઓ સાથે મતભેદ.'
    )
  },
  'Shani (Saturn)': {
    dashaLord: 'Shani (Saturn / शनि)',
    symbol: '♄',
    portals: 'Pushya, Anuradha, Uttara Bhadrapada',
    title: buildFullMultiLang(
      'First Mahadasha: Saturn (Industrial Labor, Structural Austerity & Perseverance)',
      'प्रथम महादशा: शनि (उद्योग, कठोर परिश्रम, सादगी एवं दीर्घकालिक कर्तव्य)',
      'પ્રથમ મહાદશા: શનિ (ઉદ્યોગ, કઠોર પરિશ્રમ, સાદગી અને લાંબાગાળાની શિસ્ત)'
    ),
    theoreticalBaseline: buildFullMultiLang(
      'Beginning life under Saturn places the child in an environment characterized by hard-earned security, patience, structural duty, heavy industry, and the working public.',
      'शनि की जन्म महादशा बालक को अत्यंत व्यावहारिक, संघर्षशील और कड़े अनुशासन वाले परिवार में स्थापित करती है। यहाँ प्रगति निरंतर और कठोर परिश्रम के दम पर होती है।',
      'શનિની જન્મ મહાદશા બાળકને વ્યવહારુ, પરિશ્રમી અને શિસ્તબદ્ધ પરિવારમાં રાખે છે.'
    ),
    environment: buildFullMultiLang(
      'Serious, methodical, and budget-conscious. Routine, duty, and long-term financial preservation are prioritized over luxury. Grounded, resilient upbringing with clear boundaries.',
      'गंभीर, सादा और नियमबद्ध घर जहाँ फिजूलखर्ची से बचकर भविष्य के लिए बचत और कड़ी मेहनत को प्राथमिकता दी जाती है।',
      'ગંભીર અને સાદું ઘર જ્યાં કડક નિયમો અને ભવિષ્યની બચતને મહત્વ અપાય છે.'
    ),
    careers: buildFullMultiLang(
      '🏗️ Broad Vocational Spheres: Heavy industrial operations, iron/steel foundries, mining, petroleum extraction, large manufacturing; civil service, municipal administration, public transit, waste management, foundational construction, or organized labor oversight.',
      '🏗️ व्यापक पारिवारिक व्यवसाय: लोहा/स्टील उद्योग, निर्माण (Construction), खनन (Mining), पेट्रोलियम, फैक्ट्री/मैन्युफैक्चरिंग, नगर निगम सेवा, परिवहन या श्रम संगठन (Labor Unions)।',
      '🏗️ વ્યાપક કૌટુંબિક વ્યવસાય: લોખંડ/સ્ટીલ ઉદ્યોગ, બાંધકામ (Construction), ખાણકામ, ટ્રાન્સપોર્ટ કે ફેક્ટરી ઉદ્યોગ.'
    ),
    atmosphere: buildFullMultiLang(
      'Sober, quiet, frugally managed household where patience, humility, and relentless work ethic are deeply honored.',
      'शांत और संयमित वातावरण जहाँ सादगी, ईमानदारी और काम के प्रति निष्ठा को सर्वोपरि माना जाता है।',
      'શાંત અને સંયમિત વાતાવરણ જ્યાં મહેનત અને સાદગીને સન્માન મળે છે.'
    ),
    blessings: buildFullMultiLang(
      'Forges unshakeable mental endurance, deep humility, realistic practical understanding, and long-term grounded stability.',
      'अटूट धैर्य, विनम्रता, जमीनी हकीकत की गहरी समझ और विपरीत परिस्थितियों में न टूटने वाला मनोबल मिलता है।',
      'અટૂટ ધૈર્ય, વિનમ્રતા અને મજબૂત મનોબળ આપે છે.'
    ),
    vulnerabilities: buildFullMultiLang(
      'If afflicted: Economic constraints, demanding working conditions for parents, prolonged debt repayment, delayed progress, or elderly health challenges.',
      'यदि पीड़ित हो: आर्थिक तंगी, माता-पिता का अत्यधिक शारीरिक परिश्रम, पुराने कर्ज, या बुजुर्गों की बीमारी।',
      'જો પિડીત હોય: નાણાકીય ખેંચાણ, જૂના દેવા કે વડીલોનું અસ્વાસ્થ્ય.'
    )
  },
  'Budha (Mercury)': {
    dashaLord: 'Budha (Mercury / बुध)',
    symbol: '☿',
    portals: 'Ashlesha, Jyeshtha, Revati',
    title: buildFullMultiLang(
      'First Mahadasha: Mercury (Mercantile Trade, Analytical Systems & Commerce)',
      'प्रथम महादशा: बुध (व्यापार, वाणिज्य, बही-खाते, संचार एवं विश्लेषणात्मक क्षमता)',
      'પ્રથમ મહાદશા: બુધ (વેપાર, વાણિજ્ય, હિસાબ-ચોપડા અને સંચાર)'
    ),
    theoreticalBaseline: buildFullMultiLang(
      'Raised under Mercury, the native enters a world defined by commercial activity, financial accounting, logistics, publishing, and verbal intelligence. Strong presence of maternal lineage.',
      'बुध की जन्म महादशा बालक को व्यापारिक, बौद्धिक और जीवंत माहौल प्रदान करती है। परिवार में लेन-देन, बही-खातों, पठन-पाठन और मामा पक्ष का विशेष प्रभाव रहता है।',
      'બુધની જન્મ મહાદશા બાળકને વેપારી અને બૌદ્ધિક વાતાવરણ આપે છે. મામા પક્ષનો પ્રભાવ રહે છે.'
    ),
    environment: buildFullMultiLang(
      'Lively, mentally engaging, and fast-paced home centered around transactions, market trends, accounts, and analytical discussions. Prominent presence of maternal uncles (Mama).',
      'चहल-पहल भरा, बौद्धिक और व्यापारिक माहौल जहाँ बाजार के उतार-चढ़ाव, लेन-देन और शिक्षा पर निरंतर चर्चा होती है।',
      'બૌદ્ધિક અને વેપારી માહોલ જ્યાં હિસાબ અને શિક્ષણ પર સતત ચર્ચા થાય છે.'
    ),
    careers: buildFullMultiLang(
      '📈 Broad Vocational Spheres: Commercial business, wholesale/retail distribution, commodities trading, merchant enterprises; accounting, auditing, bookkeeping, software analysis, data management; journalism, publishing, editing, marketing, or logistics brokerage.',
      '📈 व्यापक पारिवारिक व्यवसाय: थोक एवं खुदरा व्यापार (Wholesale/Retail Trade), मर्चेंट व्यवसाय, चार्टर्ड अकाउंटेंसी, बैंकिंग, सॉफ्टवेयर/डेटा एनालिसिस, पत्रकारिता, प्रकाशन (Publishing) या लॉजिस्टिक्स।',
      '📈 વ્યાપક કૌટુંબિક વ્યવસાય: જથ્થાબંધ/છૂટક વેપાર, એકાઉન્ટિંગ, બેંકિંગ, IT/ડેટા, પત્રકારત્વ કે લોજિસ્ટિક્સ.'
    ),
    atmosphere: buildFullMultiLang(
      'Witty, news-conscious household filled with books, calculators, documents, humorous banter, and active learning.',
      'पुस्तकों, समाचार-पत्रों, कैलकुलेटर और बही-खातों से सुसज्जित घर जहाँ हास्य-विनोद और तीक्ष्ण वार्तालाप होता है।',
      'પુસ્તકો અને હિસાબોથી ભરેલું ઘર જ્યાં બુદ્ધિશાળી વાર્તાલાપ થાય છે.'
    ),
    blessings: buildFullMultiLang(
      'Bestows sharp intellect, early mathematical & numeric genius, commercial savvy, articulate communication, and adaptability.',
      'तीक्ष्ण बुद्धि, गणितीय निपुणता, व्यापारिक समझ और बेहतरीन अभिव्यक्ति क्षमता का आशीर्वाद मिलता है।',
      'તીક્ષ્ણ બુદ્ધિ, ગણિત કૌશલ્ય અને વેપારી સોચ આપે છે.'
    ),
    vulnerabilities: buildFullMultiLang(
      'If afflicted: Commercial litigation, contract disputes, accounting friction, inventory losses, or parental anxiety and nervous exhaustion.',
      'यदि पीड़ित हो: व्यापारिक विवाद, अनुबंधों में धोखा, लिखापढ़ी की गलतियाँ, या माता-पिता में मानसिक तनाव।',
      'જો પિડીત હોય: વેપારી વિવાદો, કરારમાં ભૂલો કે કૌટુંબિક માનસિક તણાવ.'
    )
  },
  'Ketu': {
    dashaLord: 'Ketu (केतु)',
    symbol: '☋',
    portals: 'Ashwini, Magha, Mula',
    title: buildFullMultiLang(
      'First Mahadasha: Ketu (Spartan Foundations, Indigenous Healing & Intuition)',
      'प्रथम महादशा: केतु (आध्यात्मिक एकांत, पारंपरिक चिकित्सा, सूक्ष्म बोध एवं सादगी)',
      'પ્રથમ મહાદશા: કેતુ (આધ્યાત્મિક એકાંત, પરંપરાગત ઔષધિ અને સાદગી)'
    ),
    theoreticalBaseline: buildFullMultiLang(
      'Rooted in a spartan, introspective, and non-materialistic domestic environment. Ketu signifies past karmas, spiritual depth, ancestral lineage, and detachment from worldly display.',
      'केतु की जन्म महादशा बालक को आध्यात्मिक, सादा और आडंबर-रहित माहौल देती है। परिवार का झुकाव धर्म, जड़ी-बूटियों, पूर्वज परंपराओं और गुप्त विद्याओं की ओर रहता है।',
      'કેતુની જન્મ મહાદશા બાળકને આધ્યાત્મિક અને સાદા માહોલમાં રાખે છે.'
    ),
    environment: buildFullMultiLang(
      'Spartan material conditions with emotional introspection. Resources are directed toward debt settlement, spiritual duties, or charity. Strong influence of grandparents (maternal grandfather / Nana).',
      'आडंबर-रहित, शांत और आत्मविश्लेषी घर। नाना-नानी या बुजुर्गों का गहरा प्रभाव रहता है और संसाधनों का उपयोग परोपकार में होता है।',
      'સાદાઈ અને શાંત વાતાવરણ. મોસાળ પક્ષ કે નાના-નાનીનો વિશેષ પ્રભાવ રહે છે.'
    ),
    careers: buildFullMultiLang(
      '🧘 Broad Vocational Spheres: Alternative & indigenous healing (Ayurveda, homeopathy, herbalism, acupuncture, traditional pharmacology); esoteric studies, astrology, philosophy, forensic investigations, covert security analysis, or micro-technical repairs/crafts.',
      '🧘 व्यापक पारिवारिक व्यवसाय: आयुर्वेद, होम्योपैथी, जड़ी-बूटी चिकित्सा, ज्योतिष, गूढ़ अध्ययन, फॉरेंसिक जांच (Forensics), गुप्त सुरक्षा एजेंसियां, या सूक्ष्म शिल्पकारी (Craftsmanship)।',
      '🧘 વ્યાપક કૌટુંબિક વ્યવસાય: આયુર્વેદ, હોમિયોપેથી, જ્યોતિષ, ફોરેન્સિક કે સૂક્ષ્મ કળાઓ.'
    ),
    atmosphere: buildFullMultiLang(
      'Quiet, deeply reverent, and non-ostentatious home focused on meditation, traditional values, and quiet resilience.',
      'शांत, आडंबर-रहित और ईश्वर भक्ति में लीन घर जहाँ सादगी और पूर्वज परंपराओं को तरजीह दी जाती है।',
      'આડંબર-રહિત, શાંત અને ભક્તિમય ઘર.'
    ),
    blessings: buildFullMultiLang(
      'Grants profound spiritual intuition, freedom from superficial illusions, deep mental focus, inner peace, and karmic protection.',
      'गहरी अंतर्दृष्टि, एकाग्रता, सांसारिक दिखावे से मुक्ति और आध्यात्मिक सुरक्षा का वरदान मिलता है।',
      'ઊંડી અંતર્દ્રષ્ટિ અને આધ્યાત્મિક રક્ષણ આપે છે.'
    ),
    vulnerabilities: buildFullMultiLang(
      'If afflicted: Financial scarcity, sudden home relocations, temporary parental separation, or early domestic isolation.',
      'यदि पीड़ित हो: आर्थिक तंगी, बार-बार मकान बदलना, माता-पिता के बीच अस्थायी दूरी, या अकेलापन।',
      'જો પિડીત હોય: નાણાકીય ખેંચાણ, વારંવાર રહેઠાણ બદલાવ કે એકલતા.'
    )
  },
  'Shukra (Venus)': {
    dashaLord: 'Shukra (Venus / शुक्र)',
    symbol: '♀',
    portals: 'Bharani, Purva Phalguni, Purva Ashadha',
    title: buildFullMultiLang(
      'First Mahadasha: Venus (Aesthetic Luxury, Commercial Refinement & Comfort)',
      'प्रथम महादशा: शुक्र (सुख-सुविधाएं, कलात्मक वैभव, वाहन एवं सामाजिक आकर्षण)',
      'પ્રથમ મહાદશા: શુક્ર (સુખ-સુવિધાઓ, કળા, વાહનો અને સામાજિક આકર્ષણ)'
    ),
    theoreticalBaseline: buildFullMultiLang(
      'Arriving under Venus places the infant in an environment focused on material comfort, artistic presentation, social harmony, and progressive acquisition of luxury assets.',
      'शुक्र की जन्म महादशा बालक को वैभवशाली, कलात्मक और आरामदायक परिवेश प्रदान करती है। परिवार में सौंदर्य, वाहनों, अच्छे वस्त्रों और सामाजिक प्रतिष्ठा की वृद्धि होती है।',
      'શુક્રની જન્મ મહાદશા બાળકને વૈભવશાળી અને આરામદાયક વાતાવરણ આપે છે.'
    ),
    environment: buildFullMultiLang(
      'Comfortable, clean, aesthetically decorated home. The maternal figure plays a central role in guiding social standing and domestic arrangements. Progressive acquisition of property and vehicles.',
      'सुंदर, स्वच्छ और कलात्मक साज-सज्जा वाला घर। माता परिवार की सामाजिक प्रतिष्ठा का मार्गदर्शन करती हैं और नए वाहनों व संपत्ति का आगमन होता है।',
      'સુંદર, સ્વચ્છ અને કલાત્મક ઘર જ્યાં નવી સુવિધાઓ અને વાહનો આવે છે.'
    ),
    careers: buildFullMultiLang(
      '🎨 Broad Vocational Spheres: Architecture, interior decoration, fashion design, textiles, cosmetics, fine jewelry manufacturing; hospitality, fine dining, luxury automotive industry, entertainment arts; public relations, marketing, or diplomacy.',
      '🎨 व्यापक पारिवारिक व्यवसाय: वस्त्र उद्योग (Textiles), आभूषण (Jewelry), इंटीरियर डिजाइनिंग, फैशन, सौंदर्य उत्पाद, होटल/फाइन डाइनिंग, लग्जरी वाहन उद्योग, कला/सिनेमा, या जनसंपर्क (Public Relations)।',
      '🎨 વ્યાપક કૌટુંબિક વ્યવસાય: કાપડ ઉદ્યોગ, ઝવેરાત, ઇન્ટીરીયર ડિઝાઇનિંગ, ફેશન, વાહનો કે મીડિયા.'
    ),
    atmosphere: buildFullMultiLang(
      'Melodious, fragrant, and festive household filled with music, fine dining, family celebrations, and artistic pursuits.',
      'मधुर संगीत, सुंदर वस्त्रों, स्वादिष्ट व्यंजनों और मांगलिक उत्सवों से महकता हुआ परिवार।',
      'સંગીત, સુંદર વસ્ત્રો અને ઉત્સવોથી ભરેલું ઘર.'
    ),
    blessings: buildFullMultiLang(
      'Bestows refined aesthetic taste, artistic talent, personal charm, diplomacy, and natural comfort with material abundance.',
      'आकर्षक व्यक्तित्व, कलात्मक निपुणता, मिठास और जीवन में भौतिक सुख-सुविधाओं का आशीर्वाद मिलता है।',
      'આકર્ષક વ્યક્તિત્વ અને સુખ-સુવિધાઓ આપે છે.'
    ),
    vulnerabilities: buildFullMultiLang(
      'If afflicted: Lifestyle overspending, vanity-driven debts, financial strain from luxury liabilities, or marital tension between parents.',
      'यदि पीड़ित हो: अत्यधिक फिजूलखर्ची, दिखावे के चक्कर में कर्ज, या माता-पिता के बीच दांपत्य तनाव।',
      'જો પિડીત હોય: અતિશય ખર્ચ, દેવું કે માતા-પિતા વચ્ચે મતભેદ.'
    )
  }
};

/**
 * Maps 27 Nakshatras to their Vimshottari Mahadasha Lord
 */
export const NAKSHATRA_DASHA_LORD_MAP: Record<string, string> = {
  'Ashwini': 'Ketu',
  'Bharani': 'Shukra (Venus)',
  'Krittika': 'Surya (Sun)',
  'Rohini': 'Chandra (Moon)',
  'Mrigashira': 'Mangala (Mars)',
  'Ardra': 'Rahu',
  'Punarvasu': 'Brihaspati (Jupiter)',
  'Pushya': 'Shani (Saturn)',
  'Ashlesha': 'Budha (Mercury)',
  'Magha': 'Ketu',
  'Purva Phalguni': 'Shukra (Venus)',
  'Uttara Phalguni': 'Surya (Sun)',
  'Hasta': 'Chandra (Moon)',
  'Chitra': 'Mangala (Mars)',
  'Swati': 'Rahu',
  'Vishakha': 'Brihaspati (Jupiter)',
  'Anuradha': 'Shani (Saturn)',
  'Jyeshtha': 'Budha (Mercury)',
  'Mula': 'Ketu',
  'Purva Ashadha': 'Shukra (Venus)',
  'Uttara Ashadha': 'Surya (Sun)',
  'Shravana': 'Chandra (Moon)',
  'Dhanishta': 'Mangala (Mars)',
  'Shatabhisha': 'Rahu',
  'Purva Bhadrapada': 'Brihaspati (Jupiter)',
  'Uttara Bhadrapada': 'Shani (Saturn)',
  'Revati': 'Budha (Mercury)'
};

/**
 * Predicts the 1st Vimshottari Mahadasha Household Environment
 */
export function evaluateBirthDashaEnvironment(nakshatraName: string): BirthDashaEnvironmentPrediction {
  const normNak = normalizeNakshatraName(nakshatraName);
  const dashaLordKey = NAKSHATRA_DASHA_LORD_MAP[normNak] || 'Surya (Sun)';

  const lordConfig = DASHA_LORD_ENVIRONMENT_MAP[dashaLordKey] || DASHA_LORD_ENVIRONMENT_MAP['Surya (Sun)'];

  return {
    nakshatraName,
    dashaLord: lordConfig.dashaLord,
    lordSymbol: lordConfig.symbol,
    nakshatraPortals: lordConfig.portals,
    householdTitle: lordConfig.title,
    theoreticalBaseline: lordConfig.theoreticalBaseline,
    familyEnvironment: lordConfig.environment,
    fatherAndUnclesCareer: lordConfig.careers,
    childhoodAtmosphere: lordConfig.atmosphere,
    behavioralBlessings: lordConfig.blessings,
    vulnerabilities: lordConfig.vulnerabilities
  };
}
