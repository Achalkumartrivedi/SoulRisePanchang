const fs = require('fs');

console.log("=== VEDIC PANCHANG REACT NATIVE PROJECT STRUCTURE ===");
const files = [
  'package.json',
  'app.json',
  'tsconfig.json',
  'App.tsx',
  'src/types/panchang.ts',
  'src/data/cities.ts',
  'src/theme/colors.ts',
  'src/engine/panchangEngine.ts',
  'src/engine/muhuratCalculator.ts',
  'src/engine/festivalRepository.ts',
  'src/engine/rashiphalRepository.ts',
  'src/components/Header.tsx',
  'src/components/PanchangLimbCard.tsx',
  'src/components/SunMoonWidget.tsx',
  'src/components/MuhuratCard.tsx',
  'src/components/ChoghadiyaGrid.tsx',
  'src/screens/HomeScreen.tsx',
  'src/screens/CalendarScreen.tsx',
  'src/screens/FestivalsScreen.tsx',
  'src/screens/RashiphalScreen.tsx',
  'src/screens/SettingsScreen.tsx',
  'src/navigation/AppNavigator.tsx'
];

let allExist = true;
files.forEach(f => {
  const exists = fs.existsSync(__dirname + '/' + f);
  console.log(`[${exists ? 'OK' : 'MISSING'}] ${f}`);
  if (!exists) allExist = false;
});

if (allExist) {
  console.log("\n✅ ALL 22 REACT NATIVE APPLICATION FILES SUCCESSFULLY VERIFIED!");
} else {
  console.log("\n❌ SOME FILES ARE MISSING");
}
