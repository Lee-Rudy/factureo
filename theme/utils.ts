/**
 * Design System - Utilitaires et Helpers
 * Factureo App
 */

import { TextStyle, ViewStyle } from 'react-native';
import { spacing } from './spacing';
import { colors } from './colors';

/**
 * Helper pour créer des marges uniformes
 */
export const margin = {
  all: (size: keyof typeof spacing): ViewStyle => ({
    margin: spacing[size],
  }),
  horizontal: (size: keyof typeof spacing): ViewStyle => ({
    marginHorizontal: spacing[size],
  }),
  vertical: (size: keyof typeof spacing): ViewStyle => ({
    marginVertical: spacing[size],
  }),
  top: (size: keyof typeof spacing): ViewStyle => ({
    marginTop: spacing[size],
  }),
  bottom: (size: keyof typeof spacing): ViewStyle => ({
    marginBottom: spacing[size],
  }),
  left: (size: keyof typeof spacing): ViewStyle => ({
    marginLeft: spacing[size],
  }),
  right: (size: keyof typeof spacing): ViewStyle => ({
    marginRight: spacing[size],
  }),
};

/**
 * Helper pour créer des paddings uniformes
 */
export const padding = {
  all: (size: keyof typeof spacing): ViewStyle => ({
    padding: spacing[size],
  }),
  horizontal: (size: keyof typeof spacing): ViewStyle => ({
    paddingHorizontal: spacing[size],
  }),
  vertical: (size: keyof typeof spacing): ViewStyle => ({
    paddingVertical: spacing[size],
  }),
  top: (size: keyof typeof spacing): ViewStyle => ({
    paddingTop: spacing[size],
  }),
  bottom: (size: keyof typeof spacing): ViewStyle => ({
    paddingBottom: spacing[size],
  }),
  left: (size: keyof typeof spacing): ViewStyle => ({
    paddingLeft: spacing[size],
  }),
  right: (size: keyof typeof spacing): ViewStyle => ({
    paddingRight: spacing[size],
  }),
};

/**
 * Helper pour les layouts flex communs
 */
export const flexLayout = {
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  centerHorizontal: {
    alignItems: 'center',
  } as ViewStyle,
  centerVertical: {
    justifyContent: 'center',
  } as ViewStyle,
  spaceBetween: {
    justifyContent: 'space-between',
  } as ViewStyle,
  spaceAround: {
    justifyContent: 'space-around',
  } as ViewStyle,
  spaceEvenly: {
    justifyContent: 'space-evenly',
  } as ViewStyle,
  row: {
    flexDirection: 'row',
  } as ViewStyle,
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  column: {
    flexDirection: 'column',
  } as ViewStyle,
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  } as ViewStyle,
  wrap: {
    flexWrap: 'wrap',
  } as ViewStyle,
};

/**
 * Helper pour ajouter de la transparence à une couleur
 */
export const addAlpha = (color: string, alpha: number): string => {
  // Convertir l'alpha (0-1) en hexa (00-FF)
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  
  // Si la couleur commence par #, ajouter l'alpha à la fin
  if (color.startsWith('#')) {
    return `${color}${alphaHex}`;
  }
  
  return color;
};

/**
 * Helper pour créer des styles de texte tronqué
 */
export const truncate = {
  singleLine: {
    numberOfLines: 1,
    ellipsizeMode: 'tail',
  } as TextStyle,
  multiLine: (lines: number) => ({
    numberOfLines: lines,
    ellipsizeMode: 'tail',
  }) as TextStyle,
};

/**
 * Helper pour les positions absolues
 */
export const position = {
  absolute: {
    position: 'absolute',
  } as ViewStyle,
  topLeft: (top: number, left: number): ViewStyle => ({
    position: 'absolute',
    top,
    left,
  }),
  topRight: (top: number, right: number): ViewStyle => ({
    position: 'absolute',
    top,
    right,
  }),
  bottomLeft: (bottom: number, left: number): ViewStyle => ({
    position: 'absolute',
    bottom,
    left,
  }),
  bottomRight: (bottom: number, right: number): ViewStyle => ({
    position: 'absolute',
    bottom,
    right,
  }),
  fill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  } as ViewStyle,
};

/**
 * Helper pour créer des grilles avec gap
 */
export const grid = {
  gap: (size: keyof typeof spacing) => ({
    gap: spacing[size],
  }),
  rowGap: (size: keyof typeof spacing) => ({
    rowGap: spacing[size],
  }),
  columnGap: (size: keyof typeof spacing) => ({
    columnGap: spacing[size],
  }),
};

/**
 * Styles communs réutilisables
 */
export const commonStyles = {
  fullWidth: {
    width: '100%',
  } as ViewStyle,
  fullHeight: {
    height: '100%',
  } as ViewStyle,
  fullSize: {
    width: '100%',
    height: '100%',
  } as ViewStyle,
  flex1: {
    flex: 1,
  } as ViewStyle,
  hidden: {
    opacity: 0,
  } as ViewStyle,
  visible: {
    opacity: 1,
  } as ViewStyle,
  rounded: {
    borderRadius: 9999,
  } as ViewStyle,
  circle: (size: number): ViewStyle => ({
    width: size,
    height: size,
    borderRadius: size / 2,
  }),
};

/**
 * Helper pour les overlays
 */
export const overlay = {
  dark: (opacity: number = 0.5): ViewStyle => ({
    backgroundColor: addAlpha(colors.text.primary, opacity),
  }),
  light: (opacity: number = 0.5): ViewStyle => ({
    backgroundColor: addAlpha(colors.text.inverse, opacity),
  }),
  primary: (opacity: number = 0.1): ViewStyle => ({
    backgroundColor: addAlpha(colors.primary.main, opacity),
  }),
};
