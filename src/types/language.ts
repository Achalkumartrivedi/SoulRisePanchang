export type LanguageCode =
  | 'hinglish'
  | 'hi'
  | 'gu'
  | 'en'
  | 'ta'
  | 'te'
  | 'bn'
  | 'mr'
  | 'ru'
  | 'fr'
  | 'es'
  | 'he'
  | 'id'
  | 'th';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  isDefault?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'hinglish', name: 'Hinglish', nativeName: 'Hinglish (Hindi in English)', flag: '🇮🇳', isDefault: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский (Russian)', flag: '🇷🇺' },
  { code: 'fr', name: 'French', nativeName: 'Français (French)', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית (Hebrew)', flag: '🇮🇱' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย (Thai)', flag: '🇹🇭' },
];
