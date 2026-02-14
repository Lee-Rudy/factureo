/**
 * Design System - Layout & Dimensions
 * Factureo App
 */

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Dimensions de l'écran
 */
export const screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} as const;

/**
 * Bordures & Radius
 */
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

/**
 * Largeurs de bordure
 */
export const borderWidth = {
  none: 0,
  thin: 1,
  medium: 2,
  thick: 3,
  thicker: 4,
} as const;

/**
 * Largeurs de conteneur
 */
export const containerWidth = {
  sm: 320,
  md: 375,
  lg: 425,
  xl: 768,
  full: '100%',
} as const;

/**
 * Hauteurs courantes
 */
export const heights = {
  button: {
    small: 36,
    medium: 44,
    large: 56,
  },
  input: {
    small: 36,
    medium: 44,
    large: 56,
  },
  header: 60,
  tabBar: 64,
  card: {
    small: 120,
    medium: 200,
    large: 300,
  },
} as const;

/**
 * Largeurs courantes
 */
export const widths = {
  button: {
    small: 100,
    medium: 150,
    large: 200,
    full: '100%',
  },
  input: {
    full: '100%',
  },
} as const;

/**
 * Opacités
 */
export const opacity = {
  disabled: 0.38,
  hover: 0.08,
  focus: 0.12,
  selected: 0.16,
  activated: 0.24,
} as const;

/**
 * Élévations / Shadows
 */
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

/**
 * Z-index
 */
export const zIndex = {
  background: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
  tooltip: 1600,
} as const;

export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
