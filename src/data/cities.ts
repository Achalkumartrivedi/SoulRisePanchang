import { CityLocation } from '../types/panchang';

export const DEFAULT_CITIES: CityLocation[] = [
  // India Major Cities & Pilgrimage Hubs
  { name: 'New Delhi', hindiName: 'नई दिल्ली', stateCountry: 'Delhi, India', latitude: 28.6139, longitude: 77.2090, timeZoneId: 'Asia/Kolkata' },
  { name: 'Varanasi', hindiName: 'वाराणसी', stateCountry: 'Uttar Pradesh, India', latitude: 25.3176, longitude: 82.9739, timeZoneId: 'Asia/Kolkata' },
  { name: 'Mumbai', hindiName: 'मुंबई', stateCountry: 'Maharashtra, India', latitude: 19.0760, longitude: 72.8777, timeZoneId: 'Asia/Kolkata' },
  { name: 'Bengaluru', hindiName: 'बेंगलुरु', stateCountry: 'Karnataka, India', latitude: 12.9716, longitude: 77.5946, timeZoneId: 'Asia/Kolkata' },
  { name: 'Kolkata', hindiName: 'कोलकाता', stateCountry: 'West Bengal, India', latitude: 22.5726, longitude: 88.3639, timeZoneId: 'Asia/Kolkata' },
  { name: 'Jaipur', hindiName: 'जयपुर', stateCountry: 'Rajasthan, India', latitude: 26.9124, longitude: 75.7873, timeZoneId: 'Asia/Kolkata' },
  { name: 'Ujjain', hindiName: 'उज्जैन', stateCountry: 'Madhya Pradesh, India', latitude: 23.1765, longitude: 75.7885, timeZoneId: 'Asia/Kolkata' },
  { name: 'Haridwar', hindiName: 'हरिद्वार', stateCountry: 'Uttarakhand, India', latitude: 29.9457, longitude: 78.1642, timeZoneId: 'Asia/Kolkata' },
  { name: 'Ayodhya', hindiName: 'अयोध्या', stateCountry: 'Uttar Pradesh, India', latitude: 26.7922, longitude: 82.1998, timeZoneId: 'Asia/Kolkata' },
  { name: 'Mathura', hindiName: 'मथुरा', stateCountry: 'Uttar Pradesh, India', latitude: 27.4924, longitude: 77.6737, timeZoneId: 'Asia/Kolkata' },
  { name: 'Puri', hindiName: 'पुरी', stateCountry: 'Odisha, India', latitude: 19.8135, longitude: 85.8312, timeZoneId: 'Asia/Kolkata' },
  { name: 'Tirupati', hindiName: 'तिरुपति', stateCountry: 'Andhra Pradesh, India', latitude: 13.6288, longitude: 79.4192, timeZoneId: 'Asia/Kolkata' },
  { name: 'Chennai', hindiName: 'चेन्नई', stateCountry: 'Tamil Nadu, India', latitude: 13.0827, longitude: 80.2707, timeZoneId: 'Asia/Kolkata' },
  { name: 'Hyderabad', hindiName: 'हैदराबाद', stateCountry: 'Telangana, India', latitude: 17.3850, longitude: 78.4867, timeZoneId: 'Asia/Kolkata' },
  { name: 'Ahmedabad', hindiName: 'अहमदाबाद', stateCountry: 'Gujarat, India', latitude: 23.0225, longitude: 72.5714, timeZoneId: 'Asia/Kolkata' },

  // Russia 🇷🇺 (Vast Multi-Timezone Lands)
  { name: 'Moscow', hindiName: 'मॉस्को', stateCountry: 'Russia (MSK UTC+3)', latitude: 55.7558, longitude: 37.6173, timeZoneId: 'Europe/Moscow' },
  { name: 'Saint Petersburg', hindiName: 'सेंट पीटर्सबर्ग', stateCountry: 'Russia (MSK UTC+3)', latitude: 59.9343, longitude: 30.3351, timeZoneId: 'Europe/Moscow' },
  { name: 'Yekaterinburg', hindiName: 'येकातेरिनबर्ग', stateCountry: 'Russia (YEKT UTC+5)', latitude: 56.8389, longitude: 60.6057, timeZoneId: 'Asia/Yekaterinburg' },
  { name: 'Novosibirsk', hindiName: 'नोवोसिбирस्क', stateCountry: 'Russia (NOVT UTC+7)', latitude: 55.0084, longitude: 82.9357, timeZoneId: 'Asia/Novosibirsk' },
  { name: 'Vladivostok', hindiName: 'व्लादिवोस्तोक', stateCountry: 'Russia (VLAT UTC+10)', latitude: 43.1155, longitude: 131.8855, timeZoneId: 'Asia/Vladivostok' },

  // France 🇫🇷
  { name: 'Paris', hindiName: 'पेरिस', stateCountry: 'France (CET UTC+1)', latitude: 48.8566, longitude: 2.3522, timeZoneId: 'Europe/Paris' },
  { name: 'Lyon', hindiName: 'ल्योन', stateCountry: 'France (CET UTC+1)', latitude: 45.7640, longitude: 4.8357, timeZoneId: 'Europe/Paris' },
  { name: 'Marseille', hindiName: 'मार्सिले', stateCountry: 'France (CET UTC+1)', latitude: 43.2965, longitude: 5.3698, timeZoneId: 'Europe/Paris' },

  // Canada 🇨🇦
  { name: 'Toronto', hindiName: 'टोरंटो', stateCountry: 'Canada (EST UTC-5)', latitude: 43.6532, longitude: -79.3832, timeZoneId: 'America/Toronto' },
  { name: 'Montreal', hindiName: 'मॉन्ट्रियल', stateCountry: 'Canada (EST UTC-5)', latitude: 45.5017, longitude: -73.5673, timeZoneId: 'America/Toronto' },
  { name: 'Vancouver', hindiName: 'वैंकूवर', stateCountry: 'Canada (PST UTC-8)', latitude: 49.2827, longitude: -123.1207, timeZoneId: 'America/Vancouver' },

  // Indonesia 🇮🇩
  { name: 'Jakarta', hindiName: 'जकार्ता', stateCountry: 'Indonesia (WIB UTC+7)', latitude: -6.2088, longitude: 106.8456, timeZoneId: 'Asia/Jakarta' },
  { name: 'Bali (Denpasar)', hindiName: 'बाली (देनपासार)', stateCountry: 'Indonesia (WITA UTC+8)', latitude: -8.6705, longitude: 115.2126, timeZoneId: 'Asia/Makassar' },
  { name: 'Surabaya', hindiName: 'सुरबाया', stateCountry: 'Indonesia (WIB UTC+7)', latitude: -7.2575, longitude: 112.7521, timeZoneId: 'Asia/Jakarta' },

  // Thailand 🇹🇭
  { name: 'Bangkok', hindiName: 'बैंकाक', stateCountry: 'Thailand (ICT UTC+7)', latitude: 13.7563, longitude: 100.5018, timeZoneId: 'Asia/Bangkok' },
  { name: 'Chiang Mai', hindiName: 'चियांग माई', stateCountry: 'Thailand (ICT UTC+7)', latitude: 18.7883, longitude: 98.9853, timeZoneId: 'Asia/Bangkok' },
  { name: 'Phuket', hindiName: 'फुकेत', stateCountry: 'Thailand (ICT UTC+7)', latitude: 7.8804, longitude: 98.3923, timeZoneId: 'Asia/Bangkok' },

  // Spain 🇪🇸
  { name: 'Madrid', hindiName: 'मैड्रिड', stateCountry: 'Spain (CET UTC+1)', latitude: 40.4168, longitude: -3.7038, timeZoneId: 'Europe/Madrid' },
  { name: 'Barcelona', hindiName: 'बार्सिलोना', stateCountry: 'Spain (CET UTC+1)', latitude: 41.3851, longitude: 2.1734, timeZoneId: 'Europe/Madrid' },

  // Israel 🇮🇱
  { name: 'Tel Aviv', hindiName: 'तेल अवीव', stateCountry: 'Israel (IST UTC+2)', latitude: 32.0853, longitude: 34.7818, timeZoneId: 'Asia/Jerusalem' },
  { name: 'Jerusalem', hindiName: 'यरूशलेम', stateCountry: 'Israel (IST UTC+2)', latitude: 31.7683, longitude: 35.2137, timeZoneId: 'Asia/Jerusalem' },

  // Nepal, UK, USA, UAE, Australia
  { name: 'Kathmandu', hindiName: 'काठमाडौँ', stateCountry: 'Nepal', latitude: 27.7172, longitude: 85.3240, timeZoneId: 'Asia/Kathmandu' },
  { name: 'London', hindiName: 'लंदन', stateCountry: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timeZoneId: 'Europe/London' },
  { name: 'New York', hindiName: 'न्यू यॉर्क', stateCountry: 'USA (EST UTC-5)', latitude: 40.7128, longitude: -74.0060, timeZoneId: 'America/New_York' },
  { name: 'San Francisco', hindiName: 'सैन फ्रांसिस्को', stateCountry: 'USA (PST UTC-8)', latitude: 37.7749, longitude: -122.4194, timeZoneId: 'America/Los_Angeles' },
  { name: 'Dubai', hindiName: 'दुबई', stateCountry: 'UAE', latitude: 25.2048, longitude: 55.2708, timeZoneId: 'Asia/Dubai' },
  { name: 'Sydney', hindiName: 'सिडनी', stateCountry: 'Australia', latitude: -33.8688, longitude: 151.2093, timeZoneId: 'Australia/Sydney' }
];
