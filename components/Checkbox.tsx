import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../theme';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.touch}>
    <View style={[styles.box, checked && styles.boxChecked]}>
      {checked && <Text style={styles.check}>✓</Text>}
    </View>
  </TouchableOpacity>
);

const size = 22;

const styles = StyleSheet.create({
  touch: {
    alignSelf: 'flex-start',
  },
  box: {
    width: size,
    height: size,
    borderRadius: borderRadius.xs,
    borderWidth: 2,
    borderColor: colors.border.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    borderColor: colors.tertiary.main,
    backgroundColor: colors.tertiary.main,
  },
  check: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: '700',
  },
});
