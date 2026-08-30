export interface WorldFestivalItem {
  id: string;
  name: string;
  localName?: string;
  country: string; // e.g. 'United States', 'France', 'Japan', 'Global'
  countryFlag: string; // e.g. '🇺🇸', '🇫🇷', '🇯🇵', '🌐'
  dateIso: string; // YYYY-MM-DD
  monthDay: string; // MM-DD for recurring yearly dates
  description: string;
  significance: string;
  category: 'WORLD_FESTIVAL';
}

export const WORLD_FESTIVALS_DATA: WorldFestivalItem[] = [
  // January
  {
    id: 'wf_new_year',
    name: "New Year's Day",
    localName: "New Year's Day",
    country: "Global / International",
    countryFlag: "🌐",
    dateIso: "2026-01-01",
    monthDay: "01-01",
    description: "Celebration of the first day of the Gregorian calendar year worldwide with fireworks and festivities.",
    significance: "Global renewal, goal setting, and universal peace.",
    category: "WORLD_FESTIVAL"
  },
  {
    id: 'wf_in_republic_day',
    name: "Republic Day of India",
    localName: "गणतंत्र दिवस",
    country: "India",
    countryFlag: "🇮🇳",
    dateIso: "2026-01-26",
    monthDay: "01-26",
    description: "Honors the date on which the Constitution of India came into effect in 1950.",
    significance: "Grand military parade at Kartavya Path, New Delhi, celebrating democracy and sovereignty.",
    category: "WORLD_FESTIVAL"
  },
  {
    id: 'wf_au_australia_day',
    name: "Australia Day",
    localName: "Australia Day",
    country: "Australia",
    countryFlag: "🇦🇺",
    dateIso: "2026-01-26",
    monthDay: "01-26",
    description: "Official national day of Australia marking the 1788 arrival of the First Fleet at Port Jackson.",
    significance: "Community concerts, citizenship ceremonies, and sports gatherings across Australia.",
    category: "WORLD_FESTIVAL"
  },

  // February
  {
    id: 'wf_br_carnival',
    name: "Rio de Janeiro Carnival",
    localName: "Carnaval do Rio",
    country: "Brazil",
    countryFlag: "🇧🇷",
    dateIso: "2026-02-14",
    monthDay: "02-14",
    description: "World famous Brazilian festival preceding Lent with vibrant Samba school parades and music.",
    significance: "Biggest carnival in the world featuring traditional rhythm, dance, and cultural unity.",
    category: "WORLD_FESTIVAL"
  },
  {
    id: 'wf_us_presidents_day',
    name: "Presidents' Day",
    localName: "Washington's Birthday",
    country: "United States",
    countryFlag: "🇺🇸",
    dateIso: "2026-02-16",
    monthDay: "02-16",
    description: "Federal holiday in the United States honoring George Washington and Abraham Lincoln.",
    significance: "Honoring American leadership and constitutional history.",
    category: "WORLD_FESTIVAL"
  },

  // March
  {
    id: 'wf_global_womens_day',
    name: "International Women's Day",
    localName: "International Women's Day",
    country: "Global / UN",
    countryFlag: "🌐",
    dateIso: "2026-03-08",
    monthDay: "03-08",
    description: "Global day celebrating the social, economic, cultural, and political achievements of women.",
    significance: "Promoting gender equality and women's empowerment globally.",
    category: "WORLD_FESTIVAL"
  },
  {
    id: 'wf_ie_st_patrick',
    name: "Saint Patrick's Day",
    localName: "Lá Fhéile Pádraig",
    country: "Ireland",
    countryFlag: "🇮🇪",
    dateIso: "2026-03-17",
    monthDay: "03-17",
    description: "Cultural and religious celebration held on the traditional death date of Saint Patrick.",
    significance: "Green parades, Irish folk music, shamrock symbols, and Irish heritage celebrations.",
    category: "WORLD_FESTIVAL"
  },
  {
    id: 'wf_ir_nowruz',
    name: "Nowruz (Persian New Year)",
    localName: "نوروز",
    country: "Iran & Central Asia",
    countryFlag: "🇮🇷",
    dateIso: "2026-03-20",
    monthDay: "03-20",
    description: "Traditional spring equinox festival celebrated across Iran, Afghanistan, and Central Asia.",
    significance: "Haft-sin table setup, spring rebirth, and ancestral family visits.",
    category: "WORLD_FESTIVAL"
  },

  // April
  {
    id: 'wf_jp_cherry_blossom',
    name: "Hanami (Cherry Blossom Festival)",
    localName: "花見 (Hanami)",
    country: "Japan",
    countryFlag: "🇯🇵",
    dateIso: "2026-04-05",
    monthDay: "04-05",
    description: "Traditional Japanese custom of enjoying the transient beauty of blooming Sakura cherry blossoms.",
    significance: "Outdoor picnics, appreciation of nature's impermanence, and springtime gatherings.",
    category: "WORLD_FESTIVAL"
  },
  {
    id: 'wf_th_songkran',
    name: "Songkran Water Festival",
    localName: "สงกรานต์",
    country: "Thailand",
    countryFlag: "🇹🇭",
    dateIso: "2026-04-13",
    monthDay: "04-13",
    description: "Traditional Thai New Year celebrated with joyous public water fights and temple cleansing rituals.",
    significance: "Washing away bad luck from the previous year and offering respect to elders.",
    category: "WORLD_FESTIVAL"
  },
  {
    id: 'wf_global_earth_day',
    name: "Earth Day",
    localName: "International Earth Day",
    country: "Global / UN",
    countryFlag: "🌐",
    dateIso: "2026-04-22",
    monthDay: "04-22",
    description: "Annual event demonstrating support for environmental protection across 193+ countries.",
    significance: "Tree planting initiatives, climate awareness drives, and conservation efforts.",
    category: "WORLD_FESTIVAL"
  },

  // May
  {
    id: 'wf_global_labor_day',
    name: "International Workers' Day (May Day)",
    localName: "Labor Day",
    country: "Global / International",
    countryFlag: "🌐",
    dateIso: "2026-05-01",
    monthDay: "05-01",
    description: "Celebration of laborers and the working classes promoted by the international labor movement.",
    significance: "Honoring workforce contributions, workers' rights, and social justice.",
    category: "WORLD_FESTIVAL"
  },
  {
    id: 'wf_mx_cinco_de_mayo',
    name: "Cinco de Mayo",
    localName: "Cinco de Mayo",
    country: "Mexico",
    countryFlag: "🇲🇽",
    dateIso: "2026-05-05",
    monthDay: "05-05",
    description: "Commemorates the Mexican Army's victory over the French Empire at the Battle of Puebla in 1862.",
    significance: "Mexican pride parades, Mariachi music, folk dancing, and culinary heritage.",
    category: "WORLD_FESTIVAL"
  },

  // June
  {
    id: 'wf_global_yoga_day',
    name: "International Day of Yoga",
    localName: "अंतर्राष्ट्रीय योग दिवस",
    country: "Global / UN",
    countryFlag: "🌐",
    dateIso: "2026-06-21",
    monthDay: "06-21",
    description: "Established by the UN General Assembly to raise awareness worldwide of the benefits of practicing Yoga.",
    significance: "Mass yoga sessions, wellness summits, and holistic mind-body harmony.",
    category: "WORLD_FESTIVAL"
  },
  {
    id: 'wf_se_midsummer',
    name: "Midsummer Eve",
    localName: "Midsommarafton",
    country: "Sweden & Scandinavia",
    countryFlag: "🇸🇪",
    dateIso: "2026-06-20",
    monthDay: "06-20",
    description: "One of Sweden's most cherished annual celebrations marking the summer solstice.",
    significance: "Dancing around the maypole, wearing flower wreaths, and eating fresh herring and strawberries.",
    category: "WORLD_FESTIVAL"
  },

  // July
  {
    id: 'wf_ca_canada_day',
    name: "Canada Day",
    localName: "Fête du Canada",
    country: "Canada",
    countryFlag: "🇨🇦",
    dateIso: "2026-07-01",
    monthDay: "07-01",
    description: "National day of Canada celebrating the 1867 enactment of the Constitution Act.",
    significance: "Fireworks, parades, air shows, and multicultural concerts across Canadian cities.",
    category: "WORLD_FESTIVAL"
  },
  {
    id: 'wf_us_independence_day',
    name: "US Independence Day (4th of July)",
    localName: "Fourth of July",
    country: "United States",
    countryFlag: "🇺🇸",
    dateIso: "2026-07-04",
    monthDay: "07-04",
    description: "Federal holiday in the United States commemorating the Declaration of Independence in 1776.",
    significance: "Nationwide fireworks displays, barbecues, parades, and patriotic concerts.",
    category: "WORLD_FESTIVAL"
  },
  {
    id: 'wf_fr_bastille_day',
    name: "Bastille Day (French National Day)",
    localName: "Fête Nationale Française",
    country: "France",
    countryFlag: "🇫🇷",
    dateIso: "2026-07-14",
    monthDay: "07-14",
    description: "Commemorates the Storming of the Bastille on 14 July 1789, a turning point of the French Revolution.",
    significance: "Military parade on Champs-Élysées, Paris, and grand Eiffel Tower fireworks.",
    category: "WORLD_FESTIVAL"
  },

  // August
  {
    id: 'wf_in_independence_day',
    name: "Independence Day of India",
    localName: "स्वतंत्रता दिवस",
    country: "India",
    countryFlag: "🇮🇳",
    dateIso: "2026-08-15",
    monthDay: "08-15",
    description: "Marks India's independence from British rule on 15 August 1947.",
    significance: "Prime Minister addresses the nation from Red Fort, Delhi; kite flying and tricolor hoisting.",
    category: "WORLD_FESTIVAL"
  },

  // September
  {
    id: 'wf_de_oktoberfest',
    name: "Oktoberfest Opening",
    localName: "Oktoberfest München",
    country: "Germany",
    countryFlag: "🇩🇪",
    dateIso: "2026-09-19",
    monthDay: "09-19",
    description: "World's largest Volksfest (beer festival and traveling funfair) held annually in Munich, Bavaria.",
    significance: "Bavarian cultural heritage, traditional music parades, and folk festivities.",
    category: "WORLD_FESTIVAL"
  },
  {
    id: 'wf_np_dashain',
    name: "Dashain (Maha Navami & Vijaya Dashami)",
    localName: "दशैं (बडा दशैं)",
    country: "Nepal",
    countryFlag: "🇳🇵",
    dateIso: "2026-09-21",
    monthDay: "09-21",
    description: "Longest and most significant Hindu festival in Nepal celebrating the victory of Good over Evil.",
    significance: "Tika & Jamara blessings from elders, bamboo swings, and family reunions across Nepal.",
    category: "WORLD_FESTIVAL"
  },

  // October
  {
    id: 'wf_de_unity_day',
    name: "German Unity Day",
    localName: "Tag der Deutschen Einheit",
    country: "Germany",
    countryFlag: "🇩🇪",
    dateIso: "2026-10-03",
    monthDay: "10-03",
    description: "National day of Germany commemorating the reunification of East and West Germany in 1990.",
    significance: "Bürgerfest citizens festival and cultural concerts honoring German reunification.",
    category: "WORLD_FESTIVAL"
  },
  {
    id: 'wf_global_halloween',
    name: "Halloween",
    localName: "All Hallows' Eve",
    country: "Global / US & Europe",
    countryFlag: "🎃",
    dateIso: "2026-10-31",
    monthDay: "10-31",
    description: "Ancient Celtic Samhain tradition of carving jack-o'-lanterns and trick-or-treating.",
    significance: "Costume parties, community gatherings, and honoring autumn harvest.",
    category: "WORLD_FESTIVAL"
  },

  // November
  {
    id: 'wf_mx_dia_muertos',
    name: "Día de los Muertos (Day of the Dead)",
    localName: "Día de los Muertos",
    country: "Mexico",
    countryFlag: "🇲🇽",
    dateIso: "2026-11-02",
    monthDay: "11-02",
    description: "UNESCO Intangible Cultural Heritage festival honoring deceased family members with altars and marigolds.",
    significance: "Ofrenda altars, sugar skulls, skeletal parades, and joyous family remembrance.",
    category: "WORLD_FESTIVAL"
  },
  {
    id: 'wf_us_thanksgiving',
    name: "Thanksgiving Day",
    localName: "Thanksgiving",
    country: "United States",
    countryFlag: "🇺🇸",
    dateIso: "2026-11-26",
    monthDay: "11-26",
    description: "Federal holiday in the US expressing gratitude for the blessings of the harvest and preceding year.",
    significance: "Macy's Thanksgiving Day Parade, family turkey dinner, and charitable food drives.",
    category: "WORLD_FESTIVAL"
  },

  // December
  {
    id: 'wf_ae_national_day',
    name: "UAE National Day",
    localName: "اليوم الوطني الإماراتي",
    country: "United Arab Emirates",
    countryFlag: "🇦🇪",
    dateIso: "2026-12-02",
    monthDay: "12-02",
    description: "Commemorates the formal unification of the seven Emirates in 1971 under Sheikh Zayed.",
    significance: "Air shows, Burj Khalifa light displays, and heritage performances across Abu Dhabi and Dubai.",
    category: "WORLD_FESTIVAL"
  },
  {
    id: 'wf_global_christmas',
    name: "Christmas Day",
    localName: "Christmas",
    country: "Global / International",
    countryFlag: "🎄",
    dateIso: "2026-12-25",
    monthDay: "12-25",
    description: "Global Christian and cultural holiday celebrating the birth of Jesus Christ.",
    significance: "Gift-giving, Christmas trees, nativity displays, caroling, and worldwide goodwill.",
    category: "WORLD_FESTIVAL"
  }
];

/**
 * Find world festival matching an ISO date string (YYYY-MM-DD)
 */
export function getWorldFestivalForDate(dateIso: string): WorldFestivalItem | null {
  return WORLD_FESTIVALS_DATA.find(wf => wf.dateIso === dateIso) || null;
}

/**
 * Group world festivals by Country Name
 */
export function getWorldFestivalsByCountry(): { country: string; countryFlag: string; festivals: WorldFestivalItem[] }[] {
  const map = new Map<string, { countryFlag: string; festivals: WorldFestivalItem[] }>();

  for (const wf of WORLD_FESTIVALS_DATA) {
    if (!map.has(wf.country)) {
      map.set(wf.country, { countryFlag: wf.countryFlag, festivals: [] });
    }
    map.get(wf.country)!.festivals.push(wf);
  }

  const result: { country: string; countryFlag: string; festivals: WorldFestivalItem[] }[] = [];
  map.forEach((val, key) => {
    result.push({ country: key, countryFlag: val.countryFlag, festivals: val.festivals });
  });

  return result;
}
