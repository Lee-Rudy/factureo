/**
 * Design System - Animations et Transitions
 * Factureo App
 */

/**
 * Durées d'animation en millisecondes
 */
export const animationDuration = {
  instant: 0,
  fastest: 100,
  faster: 150,
  fast: 200,
  normal: 300,
  slow: 400,
  slower: 500,
  slowest: 600,
} as const;

/**
 * Courbes d'animation (easing)
 */
export const easing = {
  // Courbes standard
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',

  // Courbes personnalisées (pour animations avancées)
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  bounce: {
    damping: 10,
    stiffness: 100,
    mass: 1,
  },
} as const;

/**
 * Délais d'animation
 */
export const animationDelay = {
  none: 0,
  short: 100,
  medium: 200,
  long: 300,
} as const;

/**
 * Configurations d'animations prédéfinies
 */
export const animations = {
  fadeIn: {
    duration: animationDuration.normal,
    easing: easing.easeOut,
  },
  fadeOut: {
    duration: animationDuration.fast,
    easing: easing.easeIn,
  },
  slideIn: {
    duration: animationDuration.normal,
    easing: easing.easeOut,
  },
  slideOut: {
    duration: animationDuration.fast,
    easing: easing.easeIn,
  },
  scale: {
    duration: animationDuration.faster,
    easing: easing.easeInOut,
  },
  spring: {
    duration: animationDuration.normal,
    damping: 15,
    stiffness: 150,
  },
} as const;

export type AnimationDuration = typeof animationDuration;
export type Animations = typeof animations;
