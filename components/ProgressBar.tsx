import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      <View style={styles.steps}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.step,
              index < currentStep ? styles.stepActive : styles.stepInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
  },
  steps: {
    flexDirection: 'row',
    gap: 8,
  },
  step: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  stepActive: {
    backgroundColor: colors.primary.main,
  },
  stepInactive: {
    backgroundColor: '#D1D5DB',
  },
});
