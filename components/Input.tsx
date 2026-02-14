/**
 * Composant Input personnalisé
 * Champ de saisie avec le design system
 */

import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text } from './Text';
import { colors, spacing, borderRadius, heights, typography } from '../theme';

type InputSize = 'small' | 'medium' | 'large';
type InputVariant = 'outlined' | 'filled';

export interface InputProps extends TextInputProps {
  /** Label du champ */
  label?: string;
  /** Message d'erreur */
  error?: string;
  /** Message d'aide */
  helperText?: string;
  /** Taille du champ */
  size?: InputSize;
  /** Variante du champ */
  variant?: InputVariant;
  /** Icône à gauche */
  leftIcon?: React.ReactNode;
  /** Icône à droite */
  rightIcon?: React.ReactNode;
  /** Action sur l'icône de droite */
  onRightIconPress?: () => void;
  /** Champ requis */
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  size = 'medium',
  variant = 'outlined',
  leftIcon,
  rightIcon,
  onRightIconPress,
  required = false,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getHeight = () => {
    switch (size) {
      case 'small':
        return heights.input.small;
      case 'large':
        return heights.input.large;
      case 'medium':
      default:
        return heights.input.medium;
    }
  };

  const getVariantStyle = () => {
    const baseStyle = {
      height: getHeight(),
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.base,
    };

    if (variant === 'filled') {
      return {
        ...baseStyle,
        backgroundColor: colors.surface.secondary,
        borderWidth: 0,
      };
    }

    // outlined
    return {
      ...baseStyle,
      backgroundColor: colors.surface.primary,
      borderWidth: 1,
      borderColor: error
        ? colors.error.main
        : isFocused
        ? colors.primary.main
        : colors.border.main,
    };
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text variant="subtitle2" color="primary" style={styles.label}>
            {label}
            {required && (
              <Text variant="subtitle2" color="error">
                {' '}
                *
              </Text>
            )}
          </Text>
        </View>
      )}

      {/* Input Container */}
      <View style={[styles.inputContainer, getVariantStyle()]}>
        {/* Left Icon */}
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        {/* Input */}
        <TextInput
          style={[
            styles.input,
            typography.body1,
            { color: colors.text.primary },
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            style,
          ]}
          placeholderTextColor={colors.text.disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIcon}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {/* Helper Text or Error */}
      {(error || helperText) && (
        <Text
          variant="caption"
          color={error ? 'error' : 'secondary'}
          style={styles.helperText}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    marginBottom: spacing.sm,
  },
  label: {
    marginBottom: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 0, // Évite le padding par défaut sur Android
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: spacing.xs,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  helperText: {
    marginTop: spacing.xs,
  },
});
