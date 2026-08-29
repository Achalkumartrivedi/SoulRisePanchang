export interface GlobalCity {
  cityName: string;
  hindiName?: string;
  lat: number;
  lng: number;
  timeZoneId: string;
}

export interface GlobalCountry {
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  cities: GlobalCity[];
}

export const GLOBAL_COUNTRIES: GlobalCountry[] = [
  {
    countryCode: 'IN',
    countryName: 'India',
    flagEmoji: '🇮🇳',
    cities: [
      { cityName: 'New Delhi', hindiName: 'नई दिल्ली', lat: 28.6139, lng: 77.2090, timeZoneId: 'Asia/Kolkata' },
      { cityName: 'Varanasi', hindiName: 'वाराणसी', lat: 25.3176, lng: 82.9739, timeZoneId: 'Asia/Kolkata' },
      { cityName: 'Mumbai', hindiName: 'मुंबई', lat: 19.0760, lng: 72.8777, timeZoneId: 'Asia/Kolkata' },
      { cityName: 'Bengaluru', hindiName: 'बेंगलुरु', lat: 12.9716, lng: 77.5946, timeZoneId: 'Asia/Kolkata' },
      { cityName: 'Kolkata', hindiName: 'कोलकाता', lat: 22.5726, lng: 88.3639, timeZoneId: 'Asia/Kolkata' },
      { cityName: 'Ahmedabad', hindiName: 'अहमदाबाद', lat: 23.0225, lng: 72.5714, timeZoneId: 'Asia/Kolkata' },
      { cityName: 'Chennai', hindiName: 'चेन्नई', lat: 13.0827, lng: 80.2707, timeZoneId: 'Asia/Kolkata' },
      { cityName: 'Hyderabad', hindiName: 'हैदराबाद', lat: 17.3850, lng: 78.4867, timeZoneId: 'Asia/Kolkata' },
      { cityName: 'Jaipur', hindiName: 'जयपुर', lat: 26.9124, lng: 75.7873, timeZoneId: 'Asia/Kolkata' },
      { cityName: 'Ujjain', hindiName: 'उज्जैन', lat: 23.1765, lng: 75.7885, timeZoneId: 'Asia/Kolkata' },
      { cityName: 'Ayodhya', hindiName: 'अयोध्या', lat: 26.7922, lng: 82.1998, timeZoneId: 'Asia/Kolkata' },
      { cityName: 'Haridwar', hindiName: 'हरिद्वार', lat: 29.9457, lng: 78.1642, timeZoneId: 'Asia/Kolkata' },
      { cityName: 'Surat', hindiName: 'सूरत', lat: 21.1702, lng: 72.8311, timeZoneId: 'Asia/Kolkata' },
      { cityName: 'Pune', hindiName: 'पुणे', lat: 18.5204, lng: 73.8567, timeZoneId: 'Asia/Kolkata' },
      { cityName: 'Lucknow', hindiName: 'लखनऊ', lat: 26.8467, lng: 80.9462, timeZoneId: 'Asia/Kolkata' }
    ]
  },
  {
    countryCode: 'US',
    countryName: 'United States',
    flagEmoji: '🇺🇸',
    cities: [
      { cityName: 'New York (EST UTC-5)', lat: 40.7128, lng: -74.0060, timeZoneId: 'America/New_York' },
      { cityName: 'Washington D.C. (EST UTC-5)', lat: 38.9072, lng: -77.0369, timeZoneId: 'America/New_York' },
      { cityName: 'Chicago (CST UTC-6)', lat: 41.8781, lng: -87.6298, timeZoneId: 'America/Chicago' },
      { cityName: 'Denver (MST UTC-7)', lat: 39.7392, lng: -104.9903, timeZoneId: 'America/Denver' },
      { cityName: 'Los Angeles (PST UTC-8)', lat: 34.0522, lng: -118.2437, timeZoneId: 'America/Los_Angeles' },
      { cityName: 'San Francisco (PST UTC-8)', lat: 37.7749, lng: -122.4194, timeZoneId: 'America/Los_Angeles' },
      { cityName: 'Anchorage (AKST UTC-9)', lat: 61.2181, lng: -149.9003, timeZoneId: 'America/Anchorage' },
      { cityName: 'Honolulu (HST UTC-10)', lat: 21.3069, lng: -157.8583, timeZoneId: 'Pacific/Honolulu' }
    ]
  },
  {
    countryCode: 'RU',
    countryName: 'Russia',
    flagEmoji: '🇷🇺',
    cities: [
      { cityName: 'Moscow (MSK UTC+3)', lat: 55.7558, lng: 37.6173, timeZoneId: 'Europe/Moscow' },
      { cityName: 'Saint Petersburg (MSK UTC+3)', lat: 59.9343, lng: 30.3351, timeZoneId: 'Europe/Moscow' },
      { cityName: 'Samara (SAMT UTC+4)', lat: 53.2415, lng: 50.2212, timeZoneId: 'Europe/Samara' },
      { cityName: 'Yekaterinburg (YEKT UTC+5)', lat: 56.8389, lng: 60.6057, timeZoneId: 'Asia/Yekaterinburg' },
      { cityName: 'Omsk (OMST UTC+6)', lat: 54.9885, lng: 73.3242, timeZoneId: 'Asia/Omsk' },
      { cityName: 'Krasnoyarsk (KRAT UTC+7)', lat: 56.0153, lng: 92.8932, timeZoneId: 'Asia/Krasnoyarsk' },
      { cityName: 'Irkutsk (IRKT UTC+8)', lat: 52.2870, lng: 104.2810, timeZoneId: 'Asia/Irkutsk' },
      { cityName: 'Vladivostok (VLAT UTC+10)', lat: 43.1155, lng: 131.8855, timeZoneId: 'Asia/Vladivostok' }
    ]
  },
  {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    flagEmoji: '🇬🇧',
    cities: [
      { cityName: 'London', lat: 51.5074, lng: -0.1278, timeZoneId: 'Europe/London' },
      { cityName: 'Manchester', lat: 53.4808, lng: -2.2426, timeZoneId: 'Europe/London' },
      { cityName: 'Edinburgh', lat: 55.9533, lng: -3.1883, timeZoneId: 'Europe/London' },
      { cityName: 'Birmingham', lat: 52.4862, lng: -1.8904, timeZoneId: 'Europe/London' }
    ]
  },
  {
    countryCode: 'CA',
    countryName: 'Canada',
    flagEmoji: '🇨🇦',
    cities: [
      { cityName: 'Toronto (EST UTC-5)', lat: 43.6532, lng: -79.3832, timeZoneId: 'America/Toronto' },
      { cityName: 'Vancouver (PST UTC-8)', lat: 49.2827, lng: -123.1207, timeZoneId: 'America/Vancouver' },
      { cityName: 'Calgary (MST UTC-7)', lat: 51.0447, lng: -114.0719, timeZoneId: 'America/Edmonton' },
      { cityName: 'Montreal (EST UTC-5)', lat: 45.5017, lng: -73.5673, timeZoneId: 'America/Toronto' }
    ]
  },
  {
    countryCode: 'AU',
    countryName: 'Australia',
    flagEmoji: '🇦🇺',
    cities: [
      { cityName: 'Sydney (AEST UTC+10)', lat: -33.8688, lng: 151.2093, timeZoneId: 'Australia/Sydney' },
      { cityName: 'Melbourne (AEST UTC+10)', lat: -37.8136, lng: 144.9631, timeZoneId: 'Australia/Melbourne' },
      { cityName: 'Perth (AWST UTC+8)', lat: -31.9505, lng: 115.8605, timeZoneId: 'Australia/Perth' },
      { cityName: 'Brisbane (AEST UTC+10)', lat: -27.4698, lng: 153.0251, timeZoneId: 'Australia/Brisbane' }
    ]
  },
  {
    countryCode: 'DE',
    countryName: 'Germany',
    flagEmoji: '🇩🇪',
    cities: [
      { cityName: 'Berlin', lat: 52.5200, lng: 13.4050, timeZoneId: 'Europe/Berlin' },
      { cityName: 'Munich', lat: 48.1351, lng: 11.5820, timeZoneId: 'Europe/Berlin' },
      { cityName: 'Frankfurt', lat: 50.1109, lng: 8.6821, timeZoneId: 'Europe/Berlin' }
    ]
  },
  {
    countryCode: 'FR',
    countryName: 'France',
    flagEmoji: '🇫🇷',
    cities: [
      { cityName: 'Paris', lat: 48.8566, lng: 2.3522, timeZoneId: 'Europe/Paris' },
      { cityName: 'Marseille', lat: 43.2965, lng: 5.3698, timeZoneId: 'Europe/Paris' },
      { cityName: 'Lyon', lat: 45.7640, lng: 4.8357, timeZoneId: 'Europe/Paris' }
    ]
  },
  {
    countryCode: 'TH',
    countryName: 'Thailand',
    flagEmoji: '🇹🇭',
    cities: [
      { cityName: 'Bangkok', lat: 13.7563, lng: 100.5018, timeZoneId: 'Asia/Bangkok' },
      { cityName: 'Chiang Mai', lat: 18.7883, lng: 98.9853, timeZoneId: 'Asia/Bangkok' },
      { cityName: 'Phuket', lat: 7.8804, lng: 98.3923, timeZoneId: 'Asia/Bangkok' }
    ]
  },
  {
    countryCode: 'ID',
    countryName: 'Indonesia',
    flagEmoji: '🇮🇩',
    cities: [
      { cityName: 'Jakarta (WIB UTC+7)', lat: -6.2088, lng: 106.8456, timeZoneId: 'Asia/Jakarta' },
      { cityName: 'Bali (WITA UTC+8)', lat: -8.6705, lng: 115.2126, timeZoneId: 'Asia/Makassar' },
      { cityName: 'Jayapura (WIT UTC+9)', lat: -2.5489, lng: 140.7196, timeZoneId: 'Asia/Jayapura' }
    ]
  },
  {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    flagEmoji: '🇦🇪',
    cities: [
      { cityName: 'Dubai', lat: 25.2048, lng: 55.2708, timeZoneId: 'Asia/Dubai' },
      { cityName: 'Abu Dhabi', lat: 24.4539, lng: 54.3773, timeZoneId: 'Asia/Dubai' }
    ]
  },
  {
    countryCode: 'NP',
    countryName: 'Nepal',
    flagEmoji: '🇳🇵',
    cities: [
      { cityName: 'Kathmandu', lat: 27.7172, lng: 85.3240, timeZoneId: 'Asia/Kathmandu' },
      { cityName: 'Pokhara', lat: 28.2096, lng: 83.9856, timeZoneId: 'Asia/Kathmandu' }
    ]
  },
  {
    countryCode: 'SG',
    countryName: 'Singapore',
    flagEmoji: '🇸🇬',
    cities: [
      { cityName: 'Singapore', lat: 1.3521, lng: 103.8198, timeZoneId: 'Asia/Singapore' }
    ]
  },
  {
    countryCode: 'MY',
    countryName: 'Malaysia',
    flagEmoji: '🇲🇾',
    cities: [
      { cityName: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869, timeZoneId: 'Asia/Kuala_Lumpur' },
      { cityName: 'Penang', lat: 5.4164, lng: 100.3327, timeZoneId: 'Asia/Kuala_Lumpur' }
    ]
  },
  {
    countryCode: 'JP',
    countryName: 'Japan',
    flagEmoji: '🇯🇵',
    cities: [
      { cityName: 'Tokyo', lat: 35.6762, lng: 139.6503, timeZoneId: 'Asia/Tokyo' },
      { cityName: 'Osaka', lat: 34.6937, lng: 135.5023, timeZoneId: 'Asia/Tokyo' }
    ]
  },
  {
    countryCode: 'BR',
    countryName: 'Brazil',
    flagEmoji: '🇧🇷',
    cities: [
      { cityName: 'São Paulo (BRT UTC-3)', lat: -23.5505, lng: -46.6333, timeZoneId: 'America/Sao_Paulo' },
      { cityName: 'Rio de Janeiro (BRT UTC-3)', lat: -22.9068, lng: -43.1729, timeZoneId: 'America/Sao_Paulo' },
      { cityName: 'Manaus (AMT UTC-4)', lat: -3.1190, lng: -60.0217, timeZoneId: 'America/Manaus' }
    ]
  },
  {
    countryCode: 'ZA',
    countryName: 'South Africa',
    flagEmoji: '🇿🇦',
    cities: [
      { cityName: 'Johannesburg', lat: -26.2041, lng: 28.0473, timeZoneId: 'Africa/Johannesburg' },
      { cityName: 'Cape Town', lat: -33.9249, lng: 18.4241, timeZoneId: 'Africa/Johannesburg' }
    ]
  },
  {
    countryCode: 'ES',
    countryName: 'Spain',
    flagEmoji: '🇪🇸',
    cities: [
      { cityName: 'Madrid', lat: 40.4168, lng: -3.7038, timeZoneId: 'Europe/Madrid' },
      { cityName: 'Barcelona', lat: 41.3851, lng: 2.1734, timeZoneId: 'Europe/Madrid' }
    ]
  },
  {
    countryCode: 'IL',
    countryName: 'Israel',
    flagEmoji: '🇮🇱',
    cities: [
      { cityName: 'Tel Aviv', lat: 32.0853, lng: 34.7818, timeZoneId: 'Asia/Jerusalem' },
      { cityName: 'Jerusalem', lat: 31.7683, lng: 35.2137, timeZoneId: 'Asia/Jerusalem' }
    ]
  }
];
