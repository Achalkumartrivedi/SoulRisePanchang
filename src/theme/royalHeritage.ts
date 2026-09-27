// SoulRise Panchang - Royal Heritage Theme Tokens
// Modern Indian Spiritual Luxury: Deep Maroon, Rich Burgundy, Imperial Vedic Gold

export const RoyalHeritageTheme = {
  canvas: {
    base: '#170205',          // Deepest Abyssal Maroon
    elevated: '#24050A',      // Sacred Temple Maroon
    radialGlow: '#3B0910',    // Diya warm bloom
    cardWell: '#1F060A',      // Inset well background
  },
  surface: {
    card: '#2E070D',          // Primary Velvet Burgundy
    cardHover: '#380A12',     // Highlighted Surface
    cardElevated: '#480E18',  // Modal / High Elevation Surface
    cardTranslucent: 'rgba(46, 7, 13, 0.88)',
    borderRim: 'rgba(255, 215, 0, 0.28)', // 1px Luminous Champagne Gold
    borderSubtle: 'rgba(230, 194, 128, 0.16)',
    shadowGlow: 'rgba(255, 215, 0, 0.18)',
    glassChip: 'rgba(255, 255, 255, 0.08)',
    glassChipBorder: 'rgba(255, 215, 0, 0.32)',
  },
  accent: {
    primaryGold: '#FFD700',   // Imperial Vedic Gold
    secondaryGold: '#E6C280', // Warm Champagne Gold
    mutedGold: '#B3925D',     // Antique Temple Gold
    goldGlow: 'rgba(255, 215, 0, 0.35)',
    auspiciousJade: '#10B981',// Auspicious (Shubh / Amrit)
    auspiciousJadeBg: 'rgba(16, 185, 129, 0.14)',
    auspiciousJadeBorder: 'rgba(16, 185, 129, 0.4)',
    inauspiciousRuby: '#EF4444', // Inauspicious (Rahu / Yamaganda / Kaal / Rog / Udveg)
    inauspiciousRubyBg: 'rgba(239, 68, 68, 0.14)',
    inauspiciousRubyBorder: 'rgba(239, 68, 68, 0.4)',
    neutralAmber: '#FF9800',  // Neutral (Char)
    neutralAmberBg: 'rgba(255, 152, 0, 0.14)',
    neutralAmberBorder: 'rgba(255, 152, 0, 0.4)',
  },
  typography: {
    title: '#FFF8E7',         // Luminous Warm Ivory
    subtitle: '#E6C280',      // Warm Champagne Gold
    body: '#F3D299',          // Golden Parchment Body
    caption: '#C8B89E',       // Sandalwood Muted
    placeholder: '#8C676E',   // Inactive muted
    darkContrast: '#210206',  // Text on bright gold buttons
  },
  shapes: {
    headerBottomRadius: 28,   // Curved bottom crest
    cardRadius: 22,           // Floating panel rounding
    pillRadius: 9999,         // Continuous pill curvature
    circularAvatarRadius: 38, // Explore Vedic Astrology circular cards
  }
};

// Choghadiya Vedic Meanings & Qualities for UI display
export const CHOGHADIYA_META: Record<string, { descEn: string; descHi: string; quality: 'AUSPICIOUS' | 'INAUSPICIOUS' | 'NEUTRAL' }> = {
  Amrit: { descEn: 'Nectar • Highly Auspicious', descHi: 'अमृत • अति शुभ', quality: 'AUSPICIOUS' },
  Shubh: { descEn: 'Auspicious • Harmonious', descHi: 'शुभ • उत्तम फल', quality: 'AUSPICIOUS' },
  Labh: { descEn: 'Profit • Fruitful Gains', descHi: 'लाभ • उन्नति कारक', quality: 'AUSPICIOUS' },
  Char: { descEn: 'Variable • Movement & Travel', descHi: 'चर • गतिमान व यात्रा', quality: 'NEUTRAL' },
  Rog: { descEn: 'Friction • Avoid New Work', descHi: 'रोग • कष्टकारी', quality: 'INAUSPICIOUS' },
  Kaal: { descEn: 'Loss • Saturn Influence', descHi: 'काल • हानि कारक', quality: 'INAUSPICIOUS' },
  Udveg: { descEn: 'Anxiety • Sun Influence', descHi: 'उद्वेग • तनाव कारक', quality: 'INAUSPICIOUS' },
};
