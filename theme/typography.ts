/**
 * Design System - Typographie
 * Factureo App
 */

export const fontFamilies = {
  // Titres - Poppins (temporaire, à remplacer )
  heading: {
    regular: 'System', // Sera remplacé par Poppins-Regular
    medium: 'System', // Sera remplacé par Poppins-Medium
    semibold: 'System', // Sera remplacé par Poppins-SemiBold
    bold: 'System', // Sera remplacé par Poppins-Bold
  },
  // Corps de texte - Inter
  body: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  // Fallback système
  system: 'System',
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const letterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
} as const;

/**
 * Styles de typographie prédéfinis
 */
export const typography = {
  // Titres
  h1: {
    fontFamily: fontFamilies.heading.bold,
    fontSize: fontSizes['4xl'],
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    fontWeight: fontWeights.bold,
  },
  h2: {
    fontFamily: fontFamilies.heading.bold,
    fontSize: fontSizes['3xl'],
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    fontWeight: fontWeights.bold,
  },
  h3: {
    fontFamily: fontFamilies.heading.bold,
    fontSize: fontSizes['2xl'],
    lineHeight: fontSizes['2xl'] * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.bold,
  },
  h4: {
    fontFamily: fontFamilies.heading.semibold,
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.semibold,
  },
  h5: {
    fontFamily: fontFamilies.heading.semibold,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.semibold,
  },
  h6: {
    fontFamily: fontFamilies.heading.medium,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.medium,
  },

  // Sous-titres
  subtitle1: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    fontWeight: fontWeights.medium,
  },
  subtitle2: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    fontWeight: fontWeights.medium,
  },

  // Corps de texte
  body1: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.regular,
  },
  body2: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.regular,
  },

  // Boutons
  button: {
    fontFamily: fontFamilies.body.semibold,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    fontWeight: fontWeights.semibold,
    textTransform: 'uppercase' as const,
  },

  // Caption / petits textes
  caption: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    fontWeight: fontWeights.regular,
  },

  // Overline
  overline: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
    letterSpacing: letterSpacing.widest,
    fontWeight: fontWeights.medium,
    textTransform: 'uppercase' as const,
  },
} as const;

export type Typography = typeof typography;
