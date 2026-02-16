/**
 * Design System - Palette de Couleurs
 * Factureo App
 */

export const colors = {
  // Couleurs primaires
  primary: {
    main: '#FF3EFF',
    light: '#FF6FFF',
    dark: '#CC32CC',
    contrast: '#FFFFFF',
  },

  // Couleurs secondaires
  secondary: {
    main: '#002A61',
    // main: '#1800AD', // autre couleur
    light: '#003D8F',
    dark: '#001F47',
    contrast: '#FFFFFF',
  },

  // Couleurs tertiaires
  tertiary: {
    main: '#803DFF',
    light: '#9966FF',
    dark: '#6631CC',
    contrast: '#FFFFFF',
  },

  // Backgrounds
  background: {
    default: '#FFFFFF',
    paper: '#F8F9FA',
    pageLight: '#F5F5F5',
    gradient: {
      start: '#002A61',
      end: '#FF3EFF',
    },
    gradientMenu: {
      start: '#002A61',
      end: '#FF3EFF',
    },
  },

  // Backgrounds color boutons
  // backgroundButton: {
  //   default: '#FFFFFF',
  //   paper: '#F8F9FA',
  //   gradient: {
  //     start: '#002A61',
  //     end: '#002A70',
  //   },
  // },

  // Surfaces
  surface: {
    primary: '#FFFFFF',
    secondary: '#F5F5F7',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Textes
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  // États
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    contrast: '#FFFFFF',
  },

  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    contrast: '#FFFFFF',
  },

  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
    contrast: '#FFFFFF',
  },

  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
    contrast: '#FFFFFF',
  },

  // Bordures et dividers
  border: {
    main: '#E5E7EB',
    light: '#F3F4F6',
    dark: '#D1D5DB',
  },

  divider: '#E5E7EB',

  // Transparents
  transparent: 'transparent',
} as const;

export type Colors = typeof colors;
