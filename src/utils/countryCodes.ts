export interface CountryCodeItem {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  minDigits: number;
  maxDigits: number;
}

export const COUNTRY_CODES: CountryCodeItem[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', minDigits: 10, maxDigits: 10 },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', minDigits: 10, maxDigits: 10 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', minDigits: 10, maxDigits: 10 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', minDigits: 10, maxDigits: 10 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', minDigits: 9, maxDigits: 9 },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', minDigits: 9, maxDigits: 9 },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65', minDigits: 8, maxDigits: 8 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', minDigits: 10, maxDigits: 11 },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', minDigits: 9, maxDigits: 9 },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', dialCode: '+977', minDigits: 10, maxDigits: 10 },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880', minDigits: 10, maxDigits: 10 },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92', minDigits: 10, maxDigits: 10 },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', minDigits: 9, maxDigits: 9 },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64', minDigits: 8, maxDigits: 10 },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60', minDigits: 9, maxDigits: 10 },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66', minDigits: 9, maxDigits: 9 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81', minDigits: 10, maxDigits: 10 },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27', minDigits: 9, maxDigits: 9 }
];

export const DEFAULT_COUNTRY = COUNTRY_CODES[0]; // India (+91)

/**
 * Detect whether input string is Email or Phone number
 */
export function detectInputType(text: string): 'EMAIL' | 'PHONE' {
  const clean = text.trim();
  if (!clean) return 'EMAIL';
  // If contains @ or alphabetic letters, treat as EMAIL
  if (/[a-zA-Z@]/.test(clean)) {
    return 'EMAIL';
  }
  // If only digits or started with +/digits, treat as PHONE
  return 'PHONE';
}

/**
 * Validate Phone Number length based on selected Country
 */
export function validatePhoneNumberForCountry(
  digits: string,
  country: CountryCodeItem
): { valid: boolean; message?: string; formattedNumber?: string } {
  const rawDigits = digits.replace(/[^\d]/g, '');

  if (!rawDigits) {
    return { valid: false, message: 'Please enter a valid phone number.' };
  }

  if (rawDigits.length < country.minDigits || rawDigits.length > country.maxDigits) {
    if (country.minDigits === country.maxDigits) {
      return {
        valid: false,
        message: `Mobile phone number for ${country.flag} ${country.name} must be exactly ${country.minDigits} digits. (You entered ${rawDigits.length} digits).`
      };
    }
    return {
      valid: false,
      message: `Mobile phone number for ${country.flag} ${country.name} must be between ${country.minDigits} and ${country.maxDigits} digits.`
    };
  }

  const formattedNumber = `${country.dialCode}${rawDigits}`;
  return { valid: true, formattedNumber };
}

/**
 * Validate Email address format
 */
export function validateEmailFormat(email: string): { valid: boolean; message?: string } {
  const clean = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!clean || !emailRegex.test(clean)) {
    return {
      valid: false,
      message: 'Please enter a valid email address (e.g. user@gmail.com).'
    };
  }
  return { valid: true };
}
