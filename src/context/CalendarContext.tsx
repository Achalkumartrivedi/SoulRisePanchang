import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CalendarSystem = 'HINDU' | 'GLOBAL' | 'JAIN' | 'SIKH' | 'BUDDHIST' | 'CHRISTIAN' | 'PARSI';

interface CalendarContextType {
  calendarSystem: CalendarSystem;
  setCalendarSystem: (system: CalendarSystem) => Promise<void>;
}

const STORAGE_KEY = '@soulrise_calendar_system_preference_v1';

const CalendarContext = createContext<CalendarContextType>({
  calendarSystem: 'HINDU',
  setCalendarSystem: async () => {}
});

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [calendarSystem, setCalendarSystemState] = useState<CalendarSystem>('HINDU');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && ['HINDU', 'GLOBAL', 'JAIN', 'SIKH', 'BUDDHIST', 'CHRISTIAN', 'PARSI'].includes(stored)) {
          setCalendarSystemState(stored as CalendarSystem);
        }
      } catch (err) {
        console.log('Error loading calendar system preference:', err);
      }
    })();
  }, []);

  const setCalendarSystem = async (system: CalendarSystem) => {
    try {
      setCalendarSystemState(system);
      await AsyncStorage.setItem(STORAGE_KEY, system);
    } catch (err) {
      console.log('Error saving calendar system preference:', err);
    }
  };

  return (
    <CalendarContext.Provider value={{ calendarSystem, setCalendarSystem }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarSystem = () => useContext(CalendarContext);
