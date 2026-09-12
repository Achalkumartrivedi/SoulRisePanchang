export interface LalKitabRequestPayload {
  dob: string;
  tob: string;
  city: string;
  lat?: number;
  lon?: number;
  tz?: number;
  lang?: string;
  query?: string;
}

export interface LalKitabResponseData {
  ascendant_sign: number;
  houses: Record<number, string[]>;
  longitudes: Record<string, number>;
  lal_kitab_rules: string[];
  applied_rules_detailed?: any[];
  debts?: any[];
  pukka_ghar_summary?: any[];
  aspects?: any[];
  bnn_timeline?: any;
  saturn_report?: any;
  drishti_report?: any;
  saturn_nadi_career_analysis: {
    saturn_house: number;
    saturn_longitude: number;
    trine_planets: Array<{
      planet: string;
      longitude: number;
      delta_longitude: number;
      house: number;
      rel_house_from_saturn: number;
      domain: string;
    }>;
    chronological_phases: string[];
    destination_career: string;
    destination_career_planets?: any[];
    ketu_interception_break: string[];
  };
  report: string;
}

const BACKEND_BASE_URL = 'https://lalkitab-engine.onrender.com';

export const fetchLalKitabAnalysis = async (
  payload: LalKitabRequestPayload
): Promise<LalKitabResponseData> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Lal Kitab API Error:', error);
    throw error;
  }
};
