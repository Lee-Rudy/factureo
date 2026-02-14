/**
 * Composant Card personnalisé
 * Carte avec ombre et bordure pour afficher du contenu
 */

import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme';

type CardVariant = 'elevated' | 'outlined' | 'filled';
type CardPadding = 'none' | 'small' | 'medium' | 'large';

export interface CardProps extends ViewProps {
  /** Variante de la carte */
  variant?: CardVariant;
  /** Padding interne */
  padding?: CardPadding;
  /** Elevation (ombre) */
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Children */
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'medium',
  elevation = 'md',
  children,
  style,
  ...props
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return spacing.md;
      case 'large':
        return spacing.xl;
      case 'medium':
      default:
        return spacing.base;
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: colors.surface.primary,
          borderWidth: 1,
          borderColor: colors.border.main,
        };
      case 'filled':
        return {
          backgroundColor: colors.surface.secondary,
        };
      case 'elevated':
      default:
        return {
          backgroundColor: colors.surface.primary,
          ...shadows[elevation],
        };
    }
  };

  return (
    <View
      style={[
        styles.container,
        getVariantStyle(),
        { padding: getPadding() },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
});
