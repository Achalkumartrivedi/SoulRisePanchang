import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/context/LanguageContext';
import { CalendarProvider } from './src/context/CalendarContext';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LanguageProvider>
          <CalendarProvider>
            <AppNavigator />
          </CalendarProvider>
        </LanguageProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
