/**
 * Logo Factureo — source unique : assets/logo/logo-factureo.svg (couleurs d’origine).
 */
import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import AppLogoSvg from '../assets/logo/logo-factureo.svg';

const DEFAULT_WIDTH = 220;
const DEFAULT_HEIGHT = 70;
const LOGO_ASPECT = 1080 / 345;

type LogoProps = {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export function Logo({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  style,
}: LogoProps) {
  const w = width;
  const h = height ?? Math.round(width / LOGO_ASPECT);
  return (
    <View style={[{ width: w, height: h }, style]}>
      <AppLogoSvg
        width={w}
        height={h}
        style={{ width: w, height: h }}
        preserveAspectRatio="xMidYMid meet"
      />
    </View>
  );
}
