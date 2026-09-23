import { calculateBirthKundali } from './kundaliEngine';
import { calculateBnnSaturnTimeline } from './bnnSaturnTimelineEngine';
import { evaluateLalKitabSaturn } from './lalKitabSaturnEngine';
import { evaluateLalKitabRules } from './lalKitabAstrologyRules';
import { evaluateVedicRules } from './vedicAstrologyRules';
import { evaluateChartLalKitabAspects } from './lalKitabDrishtiEngine';
import { evaluateBirthDashaEnvironment } from './birthDashaEnvironmentEngine';
import { evaluateNakshatraTattva } from './nakshatraTattvaEngine';

const testProfiles20 = [
  { name: 'Profile 01: Achal Benchmark (13/02/1989 Surat)', dob: new Date(1989, 1, 13), h: 0, min: 5, city: 'Surat', lat: 21.17, lng: 72.83 },
  { name: 'Profile 02: Priya Sharma (25/08/1995 Delhi)', dob: new Date(1995, 7, 25), h: 14, min: 30, city: 'New Delhi', lat: 28.61, lng: 77.20 },
  { name: 'Profile 03: Mumbai Morning (15/08/1975 06:15)', dob: new Date(1975, 7, 15), h: 6, min: 15, city: 'Mumbai', lat: 19.07, lng: 72.87 },
  { name: 'Profile 04: Y2K Midnight (01/01/2000 00:01)', dob: new Date(2000, 0, 1), h: 0, min: 1, city: 'Kolkata', lat: 22.57, lng: 88.36 },
  { name: 'Profile 05: London Born (10/05/1982 18:45)', dob: new Date(1982, 4, 10), h: 18, min: 45, city: 'London', lat: 51.50, lng: -0.12 },
  { name: 'Profile 06: New York Night (04/07/1990 23:30)', dob: new Date(1990, 6, 4), h: 23, min: 30, city: 'New York', lat: 40.71, lng: -74.00 },
  { name: 'Profile 07: Tokyo Dawn (11/11/2012 05:00)', dob: new Date(2012, 10, 11), h: 5, min: 0, city: 'Tokyo', lat: 35.67, lng: 139.65 },
  { name: 'Profile 08: Sydney Afternoon (20/03/1985 15:20)', dob: new Date(1985, 2, 20), h: 15, min: 20, city: 'Sydney', lat: -33.86, lng: 151.20 },
  { name: 'Profile 09: Senior Profile (15/08/1947 12:00)', dob: new Date(1947, 7, 15), h: 12, min: 0, city: 'New Delhi', lat: 28.61, lng: 77.20 },
  { name: 'Profile 10: Recent Infant (01/01/2024 10:10)', dob: new Date(2024, 0, 1), h: 10, min: 10, city: 'Ahmedabad', lat: 23.02, lng: 72.57 },
  { name: 'Profile 11: Bangalore Evening (05/09/1998 19:40)', dob: new Date(1998, 8, 5), h: 19, min: 40, city: 'Bangalore', lat: 12.97, lng: 77.59 },
  { name: 'Profile 12: Chennai Noon (12/12/1992 12:30)', dob: new Date(1992, 11, 12), h: 12, min: 30, city: 'Chennai', lat: 13.08, lng: 80.27 },
  { name: 'Profile 13: San Francisco (18/06/1988 08:15)', dob: new Date(1988, 5, 18), h: 8, min: 15, city: 'San Francisco', lat: 37.77, lng: -122.41 },
  { name: 'Profile 14: Dubai Evening (02/02/2005 21:00)', dob: new Date(2005, 1, 2), h: 21, min: 0, city: 'Dubai', lat: 25.20, lng: 55.27 },
  { name: 'Profile 15: Paris Morning (14/07/1999 07:45)', dob: new Date(1999, 6, 14), h: 7, min: 45, city: 'Paris', lat: 48.85, lng: 2.35 },
  { name: 'Profile 16: Jaipur Sunset (22/10/1980 17:50)', dob: new Date(1980, 9, 22), h: 17, min: 50, city: 'Jaipur', lat: 26.91, lng: 75.78 },
  { name: 'Profile 17: Pune Midnight (30/04/1993 23:59)', dob: new Date(1993, 3, 30), h: 23, min: 59, city: 'Pune', lat: 18.52, lng: 73.85 },
  { name: 'Profile 18: Hyderabad Early Morning (08/08/2001 04:15)', dob: new Date(2001, 7, 8), h: 4, min: 15, city: 'Hyderabad', lat: 17.38, lng: 78.48 },
  { name: 'Profile 19: Singapore Noon (09/08/1965 12:00)', dob: new Date(1965, 7, 9), h: 12, min: 0, city: 'Singapore', lat: 1.35, lng: 103.81 },
  { name: 'Profile 20: Vadodara Night (25/12/1991 22:10)', dob: new Date(1991, 11, 25), h: 22, min: 10, city: 'Vadodara', lat: 22.30, lng: 73.18 }
];

console.log('================================================================');
console.log('🔍 ZERO EMPTY SECTIONS QA AUDIT SUITE (20 KUNDLIS)');
console.log('================================================================\n');

let totalPassed = 0;
let totalFailed = 0;

testProfiles20.forEach((prof, idx) => {
  try {
    const kundali = calculateBirthKundali(prof.name, prof.dob, prof.h, prof.min, prof.city, prof.lat, prof.lng);
    const moon = kundali.planets.find(p => p.name === 'Moon') || kundali.planets[1];

    const saturnLalKitab = evaluateLalKitabSaturn(kundali, 'en');
    const bnn = calculateBnnSaturnTimeline(kundali, 'en');
    const lkReport = evaluateLalKitabRules(kundali);
    const lkAspectsReport = evaluateChartLalKitabAspects(kundali, 'en');

    // Audit 1: Saturn Conjunctions
    if (saturnLalKitab.activeConjunctions.length > 0) {
      saturnLalKitab.activeConjunctions.forEach(c => {
        if (!c.planet || !c.effect.en) throw new Error(`Empty planet detail in Saturn conjunction for ${prof.name}`);
      });
    }

    // Audit 2: Saturn Special Rules
    const activeRules = saturnLalKitab.specialRulesEvaluated.filter(r => r.isTriggered === true);
    activeRules.forEach(r => {
      if (!r.ruleName.en || !r.description.en) throw new Error(`Empty rule name or description in trigger rule ${r.ruleId}`);
    });

    // Audit 3: Saturn Poison Release
    if (saturnLalKitab.hasActivePoisonChannel) {
      if (!saturnLalKitab.poisonReleaseChannel.en) throw new Error(`Empty poison release text for House ${saturnLalKitab.userSaturnHouse}`);
    }

    // Audit 4: BNN Career Phases
    if (!bnn.phases || bnn.phases.length === 0) {
      throw new Error(`BNN timeline returned 0 phases for ${prof.name}`);
    }
    bnn.phases.forEach(p => {
      if (!p.title.en || !p.interpretation.en) throw new Error(`Empty title or interpretation in BNN phase for ${prof.name}`);
    });

    // Audit 5: Lal Kitab Remedies Tab
    if (!lkReport.appliedRules || lkReport.appliedRules.length === 0) {
      throw new Error(`Lal Kitab applied rules returned 0 entries for ${prof.name}`);
    }

    // Audit 6: Drishti Aspects Tab
    if (!lkAspectsReport.activeAspects || lkAspectsReport.activeAspects.length === 0) {
      throw new Error(`Drishti report returned 0 active aspects for ${prof.name}`);
    }

    // Audit 7: Permanent Saturn Chains
    if (!saturnLalKitab.saturnChains || !saturnLalKitab.saturnChains.rahuKetuChain || !saturnLalKitab.saturnChains.jupiterChain) {
      throw new Error(`Saturn chains output incomplete for ${prof.name}`);
    }

    console.log(`✅ [PASS] ${prof.name}`);
    console.log(`   • Saturn House: H${saturnLalKitab.userSaturnHouse} | Rahu/Ketu Chain: ${saturnLalKitab.saturnChains.rahuKetuChain.chainType} | Jupiter Chain: ${saturnLalKitab.saturnChains.jupiterChain.chainType}`);
    console.log(`   • Active Special Rules: ${activeRules.length} (${activeRules.length === 0 ? 'HIDDEN' : 'SHOWING'}) | Poison Release: ${saturnLalKitab.hasActivePoisonChannel ? 'ACTIVE' : 'HIDDEN'}`);
    console.log(`   • BNN Phases: ${bnn.phases.length} | LK Remedies: ${lkReport.appliedRules.length} | Aspects: ${lkAspectsReport.activeAspects.length}\n`);

    totalPassed++;
  } catch (err: any) {
    console.error(`❌ [FAIL] ${prof.name}: ${err.message}`);
    totalFailed++;
  }
});

console.log('================================================================');
console.log(`📊 AUDIT RESULTS: ${totalPassed} PASSED, ${totalFailed} FAILED`);
console.log('================================================================\n');

if (totalFailed > 0) process.exit(1);
else process.exit(0);
