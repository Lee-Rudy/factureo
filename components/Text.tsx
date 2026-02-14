/**
 * Composant Text personnalisé
 * Utilise le design system pour une typographie cohérente
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'button'
  | 'caption'
  | 'overline';

type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'disabled'
  | 'inverse'
  | 'error'
  | 'success'
  | 'warning';

export interface TextProps extends RNTextProps {
  /** Variante typographique */
  variant?: TypographyVariant;
  /** Couleur du texte */
  color?: ColorVariant;
  /** Centrer le texte */
  centered?: boolean;
  /** Gras */
  bold?: boolean;
  /** Italique */
  italic?: boolean;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color = 'primary',
  centered = false,
  bold = false,
  italic = false,
  style,
  children,
  ...props
}) => {
  const getTextColor = () => {
    switch (color) {
      case 'primary':
        return colors.text.primary;
      case 'secondary':
        return colors.text.secondary;
      case 'disabled':
        return colors.text.disabled;
      case 'inverse':
        return colors.text.inverse;
      case 'error':
        return colors.error.main;
      case 'success':
        return colors.success.main;
      case 'warning':
        return colors.warning.main;
      default:
        return colors.text.primary;
    }
  };

  return (
    <RNText
      style={[
        typography[variant],
        { color: getTextColor() },
        centered && styles.centered,
        bold && styles.bold,
        italic && styles.italic,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  centered: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
  },
  italic: {
    fontStyle: 'italic',
  },
});
