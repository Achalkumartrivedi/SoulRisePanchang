import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageCode } from '../types/language';
import { TRANSLATIONS, TranslationKeys } from '../i18n/translations';

const STORAGE_KEY = '@soulrise_selected_language';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  t: (key: keyof TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: async () => {},
  t: (key) => TRANSLATIONS.en[key] || String(key),
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        let saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'hinglish') {
          saved = 'en';
          await AsyncStorage.setItem(STORAGE_KEY, 'en');
        }
        if (saved && (saved in TRANSLATIONS)) {
          setLanguageState(saved as LanguageCode);
        } else {
          setLanguageState('en');
        }
      } catch (e) {
        console.warn('Failed to load language setting from AsyncStorage', e);
      }
    };
    loadSavedLanguage();
  }, []);

  const setLanguage = async (newLang: LanguageCode) => {
    setLanguageState(newLang);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newLang);
    } catch (e) {
      console.warn('Failed to save language setting to AsyncStorage', e);
    }
  };

  const t = (key: keyof TranslationKeys): string => {
    const currentDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return currentDict[key] || TRANSLATIONS.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
