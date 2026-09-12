import { calculateBirthKundali } from './kundaliEngine';
import { calculateBnnSaturnTimeline } from './bnnSaturnTimelineEngine';

const testProfiles = [
  { name: 'Profile 1 (Achal Benchmark - 13/02/1989 Surat)', dob: new Date(1989, 1, 13), h: 0, min: 5, city: 'Surat', lat: 21.17, lng: 72.83 },
  { name: 'Profile 2 (Priya Sharma - Empty 2nd House: 25/08/1995 Delhi)', dob: new Date(1995, 7, 25), h: 14, min: 30, city: 'New Delhi', lat: 28.61, lng: 77.20 },
  { name: 'Profile 3 (Mumbai - 15/08/1995 14:30)', dob: new Date(1995, 7, 15), h: 14, min: 30, city: 'Mumbai', lat: 19.07, lng: 72.87 },
  { name: 'Profile 4 (Delhi - 01/01/2000 08:15)', dob: new Date(2000, 0, 1), h: 8, min: 15, city: 'New Delhi', lat: 28.61, lng: 77.20 },
  { name: 'Profile 5 (Ahmedabad - 25/10/1982 22:45)', dob: new Date(1982, 9, 25), h: 22, min: 45, city: 'Ahmedabad', lat: 23.02, lng: 72.57 }
];

console.log('================================================================');
console.log('🧪 BNN SATURN CAREER TIMELINE ENGINE — 5 PROFILES TEST AUDIT');
console.log('================================================================\n');

testProfiles.forEach((prof, idx) => {
  const kundali = calculateBirthKundali(prof.name, prof.dob, prof.h, prof.min, prof.city, prof.lat, prof.lng);
  const bnn = calculateBnnSaturnTimeline(kundali, 'en');

  console.log(`----------------------------------------------------------------`);
  console.log(`📌 PROFILE ${idx + 1}: ${prof.name}`);
  console.log(`   DOB: ${prof.dob.toDateString()} ${prof.h}:${prof.min} • City: ${prof.city}`);
  console.log(`   Lagna Rashi: ${kundali.lagnaRashi}`);
  console.log(`   Saturn Base: House ${bnn.saturnBase.house} • ${bnn.saturnBase.rashiName} (${bnn.saturnBase.degreeStr})`);
  console.log(`   Trine Houses (1-5-9): House ${bnn.trineHouses.h1}, House ${bnn.trineHouses.h5}, House ${bnn.trineHouses.h9}`);
  console.log(`   2nd House Ahead: House ${bnn.trineHouses.h2Destination}`);
  console.log(`   Identified Step 1 Planets (${bnn.step1IdentifiedPlanets.length}):`);
  bnn.step1IdentifiedPlanets.forEach(p => {
    console.log(`     - ${p.symbol} ${p.name} (H${p.house}, ${p.rashiName}, ${p.degreeStr}) -> Sign Deg: ${p.signDegree.toFixed(2)}°`);
  });

  console.log(`   Ascending Degree Timeline Sequence (${bnn.phases.length} phases):`);
  bnn.phases.forEach((ph, pIdx) => {
    console.log(`     Phase ${pIdx + 1} (${ph.ageRangeStr}): ${ph.planetSymbol} ${ph.planetName} (${ph.degreeStr}, ${ph.degreeInSign.toFixed(2)}°)`);
  });

  console.log(`   Destined Lifetime Profession (2nd House H${bnn.trineHouses.h2Destination}):`);
  console.log(`     Planets in 2nd House: ${bnn.destinationCareerPlanets.length}`);
  console.log(`     UI Destined Section Rendered? ${bnn.destinationCareerPlanets.length > 0 ? 'YES ✅' : 'NO ❌ (Hidden)'}`);
  if (bnn.destinationCareerPlanets.length > 0) {
    console.log(`     ${bnn.destinationCareerSummary.en}`);
  }

  console.log(`   Multi-Planet Combination Matrix (${bnn.multiPlanetCombinations.length} combos):`);
  bnn.multiPlanetCombinations.forEach(mc => {
    console.log(`     Combo: ${mc.combo}`);
    console.log(`     Desc:  ${mc.description.en}`);
  });

  console.log(`   Active Significations Reference (${bnn.planetSignifications.length} planets):`);
  console.log(`     ${bnn.planetSignifications.map(s => s.name).join(', ')}`);
  console.log(`----------------------------------------------------------------\n`);
});
