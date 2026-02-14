/**
 * Composant Button personnalisé
 * Utilise le design system pour un design cohérent
 */

import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Text } from './Text';
import { colors, spacing, borderRadius, heights } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends TouchableOpacityProps {
  /** Texte du bouton */
  title: string;
  /** Variante du bouton */
  variant?: ButtonVariant;
  /** Taille du bouton */
  size?: ButtonSize;
  /** État de chargement */
  loading?: boolean;
  /** Bouton désactivé */
  disabled?: boolean;
  /** Icône à gauche du texte */
  leftIcon?: React.ReactNode;
  /** Icône à droite du texte */
  rightIcon?: React.ReactNode;
  /** Pleine largeur */
  fullWidth?: boolean;
  /** Couleur de bordure personnalisée (pour variant outline) */
  borderColor?: string;
  /** Couleur du texte personnalisée */
  textColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  borderColor: customBorderColor,
  textColor: customTextColor,
  style,
  ...props
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.text.disabled;

    switch (variant) {
      case 'primary':
        return colors.primary.main;
      case 'secondary':
        return colors.secondary.main;
      case 'tertiary':
        return colors.tertiary.main;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return colors.primary.main;
    }
  };

  const getTextColor = () => {
    if (customTextColor) return customTextColor;
    if (disabled) return colors.text.inverse;

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'tertiary':
        return colors.text.inverse;
      case 'outline':
        return colors.primary.main;
      case 'ghost':
        return colors.text.primary;
      default:
        return colors.text.inverse;
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'small':
        return heights.button.small;
      case 'large':
        return heights.button.large;
      case 'medium':
      default:
        return heights.button.medium;
    }
  };

  const getPaddingHorizontal = () => {
    switch (size) {
      case 'small':
        return spacing.md;
      case 'large':
        return spacing.xl;
      case 'medium':
      default:
        return spacing.base;
    }
  };

  const hasBorder = variant === 'outline';
  const finalBorderColor = customBorderColor || colors.primary.main;

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          height: getHeight(),
          paddingHorizontal: getPaddingHorizontal(),
        },
        hasBorder && { ...styles.outlined, borderColor: finalBorderColor },
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text
            variant="button"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            style={[
              styles.text,
              { color: getTextColor() },
              size === 'small' && styles.textSmall,
              size === 'large' && styles.textLarge,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  outlined: {
    borderWidth: 2.5,
    borderColor: colors.primary.main,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    textTransform: 'none',
    flexShrink: 0,
  },
  textSmall: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 18,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});
