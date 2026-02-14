/**
 * Design System - Export centralisé
 * Factureo App
 */

export { colors } from './colors';
export type { Colors } from './colors';

export { typography, fontFamilies, fontSizes, fontWeights, lineHeights, letterSpacing } from './typography';
export type { Typography } from './typography';

export { spacing, semanticSpacing } from './spacing';
export type { Spacing, SemanticSpacing } from './spacing';

export {
  screen,
  borderRadius,
  borderWidth,
  containerWidth,
  heights,
  widths,
  opacity,
  shadows,
  zIndex,
} from './layout';
export type { BorderRadius, Shadows } from './layout';

export { animationDuration, easing, animationDelay, animations } from './animations';
export type { AnimationDuration, Animations } from './animations';

export {
  margin,
  padding,
  flexLayout,
  addAlpha,
  truncate,
  position,
  grid,
  commonStyles,
  overlay,
} from './utils';

/**
 * Export d'un objet theme complet pour faciliter l'utilisation
 */
import { colors } from './colors';
import { typography, fontFamilies, fontSizes } from './typography';
import { spacing, semanticSpacing } from './spacing';
import { borderRadius, shadows, heights, widths } from './layout';
import { animations } from './animations';

export const theme = {
  colors,
  typography,
  fontFamilies,
  fontSizes,
  spacing,
  semanticSpacing,
  borderRadius,
  shadows,
  heights,
  widths,
  animations,
} as const;

export type Theme = typeof theme;

export default theme;
