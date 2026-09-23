"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const panchangEngine_1 = require("./src/engine/panchangEngine");
const dharmaCalendarEngine_1 = require("./src/engine/dharmaCalendarEngine");
console.log("=== Testing Amanta / Purnimanta Switch Safety & Data Integrity ===");
const defaultCity = { name: 'New Delhi', hindiName: 'नई दिल्ली', stateCountry: 'India', latitude: 28.6139, longitude: 77.2090, timeZoneId: 'Asia/Kolkata' };
const systems = ['AMANTA', 'PURNIMANTA'];
const calendarSystems = ['HINDU', 'JAIN', 'SIKH', 'BUDDHIST', 'PARSI', 'GLOBAL'];
let totalTested = 0;
let errors = 0;
for (const lunarSys of systems) {
    console.log(`\nTesting System: ${lunarSys}`);
    const startDate = new Date(2026, 0, 1);
    for (let i = 0; i < 365; i++) {
        const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        totalTested++;
        try {
            // 1. Panchang Calculation
            const p = (0, panchangEngine_1.calculatePanchang)(currentDate, defaultCity, lunarSys);
            if (!p.samvat || !p.samvat.monthName || !p.tithi || !p.nakshatra) {
                console.error(`❌ Null/undefined properties on date ${currentDate.toISOString()}`);
                errors++;
            }
            // 2. Hindu Month Name Helper
            const monthName = (0, panchangEngine_1.getHinduMonthName)(currentDate, lunarSys);
            if (!monthName) {
                console.error(`❌ Empty month name for ${currentDate.toISOString()}`);
                errors++;
            }
            // 3. Dharma Day Data across all traditions
            for (const calSys of calendarSystems) {
                const dData = (0, dharmaCalendarEngine_1.getDharmaCalendarDayData)(currentDate, calSys, 'hi', lunarSys);
                if (!dData.eraTitle || !dData.monthName || !dData.dayLabel) {
                    console.error(`❌ Invalid DharmaDayData for ${calSys} on ${currentDate.toISOString()}`);
                    errors++;
                }
            }
        }
        catch (err) {
            console.error(`💥 CRASH on date ${currentDate.toISOString()} with ${lunarSys}:`, err);
            errors++;
        }
    }
}
console.log(`\n==================================================`);
console.log(`Total Date Combinations Tested: ${totalTested * calendarSystems.length}`);
console.log(`Errors / Crashes Encountered: ${errors}`);
if (errors === 0) {
    console.log(`✅ SUCCESS: All date clicks and lunar system switches are 100% crash-free and verified!`);
}
else {
    console.log(`❌ FAILURE: ${errors} errors found.`);
    process.exit(1);
}
