export interface CityLocation {
  name: string;
  hindiName: string;
  stateCountry: string;
  latitude: number;
  longitude: number;
  timeZoneId: string;
}

export type Paksha = 'SHUKLA' | 'KRISHNA';

export interface TithiInfo {
  name: string;
  hindiName: string;
  number: number;
  paksha: Paksha;
  pakshaHindi: string;
  startTimeFormatted?: string;
  endTimeFormatted: string;
  isSpecial: boolean;
  specialTag?: string;
}

export interface NakshatraInfo {
  name: string;
  hindiName: string;
  number: number;
  ruler: string;
  deity: string;
  startTimeFormatted?: string;
  endTimeFormatted: string;
}

export interface YogaInfo {
  name: string;
  hindiName: string;
  number: number;
  isAuspicious: boolean;
  endTimeFormatted: string;
}

export interface KaranaInfo {
  name: string;
  hindiName: string;
  number: number;
  category: string;
  endTimeFormatted: string;
}

export interface VaaraInfo {
  name: string;
  hindiName: string;
  rulingPlanet: string;
  deity: string;
}

export interface SunMoonTiming {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  sunSign: string;
  sunSignHindi: string;
  moonSign: string;
  moonSignHindi: string;
  moonPhasePercent: number;
}

export interface SamvatInfo {
  vikramSamvat: number;
  vikramName: string;
  shakaSamvat: number;
  shakaName: string;
  monthName: string;
  monthNameHindi: string;
  ritu: string;
  rituHindi: string;
  ayana: string;
  ayanaHindi: string;
}

export interface MuhuratTiming {
  name: string;
  hindiName: string;
  startTime: string;
  endTime: string;
  isAuspicious: boolean;
  description: string;
}

export type ChoghadiyaType = 'AMRIT' | 'SHUBH' | 'LABH' | 'CHAR' | 'ROG' | 'KAAL' | 'UDVEG';

export interface ChoghadiyaItem {
  type: ChoghadiyaType;
  name: string;
  hindiName: string;
  isAuspicious: boolean;
  startTime: string;
  endTime: string;
  isDayTime: boolean;
}

export interface DailyLagnaItem {
  signIndex: number; // 1 to 12
  name: string;
  hindiName: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface LagnaInfo {
  currentLagnaSign: number; // 1 to 12
  name: string;
  hindiName: string;
  startTime: string;
  endTime: string;
  allLagnas: DailyLagnaItem[];
}

export interface PanchangDayData {
  dateIso: string;
  city: CityLocation;
  tithi: TithiInfo;
  nakshatra: NakshatraInfo;
  yoga: YogaInfo;
  karana: KaranaInfo;
  vaara: VaaraInfo;
  sunMoon: SunMoonTiming;
  samvat: SamvatInfo;
  auspiciousMuhurats: MuhuratTiming[];
  inauspiciousMuhurats: MuhuratTiming[];
  dayChoghadiya: ChoghadiyaItem[];
  nightChoghadiya: ChoghadiyaItem[];
  festivalsForDay: string[];
  lagnaInfo?: LagnaInfo;
}

export type FestivalCategory = 'MAJOR_FESTIVAL' | 'VRAT' | 'JAYANTI' | 'ECLIPSE' | 'JAIN_FESTIVAL' | 'SIKH_FESTIVAL' | 'BUDDHIST_FESTIVAL' | 'CHRISTIAN_FESTIVAL' | 'PARSI_FESTIVAL';

export interface Festival {
  id: string;
  name: string;
  hindiName: string;
  dateIso: string;
  category: FestivalCategory;
  deity: string;
  description: string;
  rituals: string;
  tithiDescription: string;
  isHoliday?: boolean;
}

export interface RashiDetail {
  id: string;
  name: string;
  hindiName: string;
  symbol: string;
  element: string;
  rulingPlanet: string;
  dailyPrediction: string;
  predictionHindi: string;
  careerPrediction: string;
  financePrediction: string;
  lovePrediction: string;
  healthPrediction: string;
  luckyNumber: number;
  luckyColorName: string;
  luckyColorHex: string;
  luckyDirection: string;
  auspiciousTimeWindow: string;
  dailyRemedy: string;
  compatibility: string;
}
