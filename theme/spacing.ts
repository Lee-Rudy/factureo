/**
 * Design System - Système d'espacement
 * Factureo App
 * 
 * Basé sur une échelle de 4px (base unit)
 */

export const spacing = {
  none: 0,
  xs: 4,      // 4px
  sm: 8,      // 8px
  md: 12,     // 12px
  base: 16,   // 16px (1rem)
  lg: 20,     // 20px
  xl: 24,     // 24px
  '2xl': 32,  // 32px
  '3xl': 40,  // 40px
  '4xl': 48,  // 48px
  '5xl': 64,  // 64px
  '6xl': 80,  // 80px
  '7xl': 96,  // 96px
  '8xl': 128, // 128px
} as const;

/**
 * Spacings sémantiques pour une utilisation cohérente
 */
export const semanticSpacing = {
  // Padding des containers
  containerPadding: {
    horizontal: spacing['2xl'],
    vertical: spacing.xl,
  },

  // Padding des sections
  sectionPadding: {
    horizontal: spacing.base,
    vertical: spacing['2xl'],
  },

  // Espacement entre éléments
  elementSpacing: {
    tight: spacing.xs,
    normal: spacing.md,
    relaxed: spacing.lg,
    loose: spacing['2xl'],
  },

  // Padding des cartes
  cardPadding: {
    small: spacing.md,
    medium: spacing.base,
    large: spacing.xl,
  },

  // Espacement pour les formulaires
  formSpacing: {
    fieldGap: spacing.base,
    labelGap: spacing.sm,
    sectionGap: spacing['2xl'],
  },

  // Padding des boutons
  buttonPadding: {
    small: {
      horizontal: spacing.md,
      vertical: spacing.sm,
    },
    medium: {
      horizontal: spacing.base,
      vertical: spacing.md,
    },
    large: {
      horizontal: spacing.xl,
      vertical: spacing.base,
    },
  },
} as const;

export type Spacing = typeof spacing;
export type SemanticSpacing = typeof semanticSpacing;
