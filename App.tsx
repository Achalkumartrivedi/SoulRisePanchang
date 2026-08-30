import React from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/context/LanguageContext';
import { CalendarProvider } from './src/context/CalendarContext';

export default function App() {
  return (
    <LanguageProvider>
      <CalendarProvider>
        <AppNavigator />
      </CalendarProvider>
    </LanguageProvider>
  );
}
