/**
 * Composant GradientBackground
 * Background avec dégradé selon le design system
 */

import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

interface GradientBackgroundProps extends ViewProps {
  children?: React.ReactNode;
  /** Direction du dégradé - par défaut vertical */
  direction?: 'vertical' | 'horizontal' | 'diagonal';
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  direction = 'vertical',
  style,
  ...props
}) => {
  // Définir les positions du dégradé selon la direction
  const getGradientPositions = () => {
    switch (direction) {
      case 'horizontal':
        return { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } };
      case 'diagonal':
        return { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };
      case 'vertical':
      default:
        return { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };
    }
  };

  const gradientPositions = getGradientPositions();

  return (
    <LinearGradient
      colors={[colors.background.gradient.start, colors.background.gradient.end]}
      start={gradientPositions.start}
      end={gradientPositions.end}
      style={[styles.container, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
