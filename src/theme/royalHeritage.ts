// SoulRise Panchang - Royal Heritage Theme Tokens
// Modern Indian Spiritual Luxury: Deep Maroon, Rich Burgundy, Imperial Vedic Gold
// Extracted from Stitch Screen: ec0f305d25ce47909c87593f60b411b0

export const RoyalHeritageTheme = {
  canvas: {
    base: '#280910',          // Deepest Abyssal Maroon (#280910)
    lowest: '#21040B',        // Surface Container Lowest (#21040B)
    elevated: '#321118',      // Surface Container Low (#321118)
    radialGlow: '#4A121E',    // Diya warm bloom
  },
  surface: {
    card: '#37151C',          // Primary Surface Container (#37151C)
    cardHigh: '#431F26',      // Surface Container High (#431F26)
    cardHighest: '#502930',   // Surface Container Highest (#502930)
    cardHover: '#552E35',     // Surface Bright (#552E35)
    borderRim: 'rgba(255, 220, 161, 0.16)', // Luminous Champagne Gold
    borderGold: 'rgba(255, 184, 0, 0.35)',  // Amber Gold border
    borderSubtle: 'rgba(81, 69, 45, 0.4)',  // Subtle divider border (#51452D)
    shadowGlow: 'rgba(255, 184, 0, 0.15)',
    glassChip: '#431F26',
    glassChipBorder: 'rgba(255, 220, 161, 0.22)',
  },
  accent: {
    primaryGold: '#FFDCA1',   // Primary Luminous Gold
    primaryFixed: '#FFDEA8',  // Fixed Light Gold
    goldContainer: '#FFB800', // Amber Radiant Gold Container
    secondaryGold: '#D5C5A5', // Warm Sandalwood Gold
    mutedGold: '#9E8F78',     // Outline muted gold
    goldGlow: 'rgba(255, 184, 0, 0.35)',
    auspiciousJade: '#10B981',// Auspicious (Shubh / Amrit / Labh)
    auspiciousJadeBg: 'rgba(16, 185, 129, 0.16)',
    auspiciousJadeBorder: 'rgba(16, 185, 129, 0.45)',
    inauspiciousRuby: '#FFB4AB', // Error text
    inauspiciousRubyBg: '#93000A', // Error Container
    inauspiciousRubyBorder: 'rgba(255, 180, 171, 0.4)',
    neutralAmber: '#FFB800',  // Neutral (Char)
    neutralAmberBg: 'rgba(255, 184, 0, 0.15)',
    neutralAmberBorder: 'rgba(255, 184, 0, 0.4)',
  },
  typography: {
    title: '#FFDCA1',         // Primary Headline Gold (#FFDCA1)
    onSurface: '#FFD9DE',     // On Surface Warm Ivory (#FFD9DE)
    onSurfaceVariant: '#D5C4AB', // Secondary Warm Muted (#D5C4AB)
    subtitle: '#D5C5A5',      // Warm Champagne Gold (#D5C5A5)
    body: '#D5C4AB',          // Warm Golden Body (#D5C4AB)
    caption: '#D5C5A5',       // Sandalwood Caption (#D5C5A5)
    placeholder: '#8C676E',   // Inactive muted
    darkContrast: '#412D00',  // Text on bright gold buttons
  },
  shapes: {
    headerBottomRadius: 28,   // Curved bottom crest
    cardRadius: 28,           // Floating panel rounding (28px)
    pillRadius: 9999,         // Continuous pill curvature
    innerCardRadius: 18,      // Inner telemetry cards (18px)
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
