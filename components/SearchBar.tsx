import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Rechercher...',
}) => (
  <View style={styles.container}>
    <Ionicons name="search" size={20} color={colors.text.secondary} style={styles.icon} />
    <TextInput
      style={[styles.input, typography.body1]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.text.disabled}
    />
    {value.length > 0 && (
      <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
        <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.base,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: spacing.xs,
  },
});
