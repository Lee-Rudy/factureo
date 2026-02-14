/**
 * EXEMPLE - Écran de Bienvenue
 * Démontre l'utilisation du design system pour créer un écran d'accueil
 */

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GradientBackground, Text, Button, Container } from '../components';
import { spacing, flexLayout } from '../theme';

export default function WelcomeScreenExample() {
  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        <View style={styles.content}>
          {/* Section Logo */}
          <View style={[styles.logoSection, flexLayout.centerHorizontal]}>
            <Text variant="h1" color="inverse" centered>
              FACTUREO
            </Text>
            <Text variant="caption" color="inverse" centered style={styles.tagline}>
              Gérez vos factures simplement
            </Text>
          </View>

          {/* Section Titre */}
          <View style={styles.titleSection}>
            <Text variant="h2" color="inverse" centered bold>
              GÉREZ VOS FACTURES
            </Text>
            <Text variant="h2" color="inverse" centered bold>
              SIMPLEMENT
            </Text>
            
            <Text variant="body1" color="inverse" centered style={styles.description}>
              Créez, envoyez et suivez vos factures en quelques clics
            </Text>
          </View>

          {/* Section Boutons */}
          <View style={styles.buttonSection}>
            <Button
              title="CRÉER UN COMPTE"
              variant="primary"
              size="large"
              fullWidth
              onPress={() => console.log('Créer un compte')}
            />
            
            <Button
              title="CONNEXION"
              variant="outline"
              size="large"
              fullWidth
              onPress={() => console.log('Connexion')}
            />

            <Text variant="caption" color="inverse" centered style={styles.terms}>
              En continuant, vous acceptez nos conditions d'utilisation
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing['4xl'],
    justifyContent: 'space-between',
  },
  logoSection: {
    marginTop: spacing['2xl'],
  },
  tagline: {
    marginTop: spacing.sm,
    opacity: 0.9,
  },
  titleSection: {
    gap: spacing.sm,
  },
  description: {
    marginTop: spacing.base,
    opacity: 0.9,
  },
  buttonSection: {
    gap: spacing.base,
  },
  terms: {
    marginTop: spacing.sm,
    opacity: 0.7,
  },
});
