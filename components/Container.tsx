/**
 * Composant Container personnalisé
 * Container avec padding standardisé selon le design system
 */

import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { semanticSpacing } from '../theme';

type ContainerPadding = 'none' | 'container' | 'section';

export interface ContainerProps extends ViewProps {
  /** Type de padding */
  padding?: ContainerPadding;
  /** Centrer le contenu */
  centered?: boolean;
  /** Children */
  children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  padding = 'container',
  centered = false,
  children,
  style,
  ...props
}) => {
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return {};
      case 'section':
        return {
          paddingHorizontal: semanticSpacing.sectionPadding.horizontal,
          paddingVertical: semanticSpacing.sectionPadding.vertical,
        };
      case 'container':
      default:
        return {
          paddingHorizontal: semanticSpacing.containerPadding.horizontal,
          paddingVertical: semanticSpacing.containerPadding.vertical,
        };
    }
  };

  return (
    <View
      style={[
        styles.container,
        getPaddingStyle(),
        centered && styles.centered,
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
    width: '100%',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
