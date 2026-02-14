/**
 * Fichier de Test du Design System
 * Utilisez ce fichier pour tester rapidement tous les composants
 * 
 * Pour l'utiliser, remplacez le contenu de App.tsx par :
 * export { default } from './TEST_DESIGN_SYSTEM';
 */

import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  GradientBackground,
  Text,
  Button,
  Card,
  Input,
  Container,
} from './components';
import { spacing, colors, flexLayout, grid } from './theme';

export default function TestDesignSystem() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container padding="section">
          {/* Header */}
          <Text variant="h1" centered style={styles.sectionTitle}>
            Design System Test
          </Text>
          <Text variant="caption" color="secondary" centered>
            Testez tous les composants du design system
          </Text>

          {/* Section: GradientBackground */}
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>
              1. GradientBackground
            </Text>
            <View style={styles.gradientContainer}>
              <GradientBackground direction="vertical">
                <View style={styles.gradientContent}>
                  <Text variant="h4" color="inverse" centered>
                    Dégradé Vertical
                  </Text>
                  <Text variant="caption" color="inverse" centered>
                    #002A61 → #FF3EFF
                  </Text>
                </View>
              </GradientBackground>
            </View>
          </View>

          {/* Section: Typography */}
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>
              2. Typography
            </Text>
            <Card variant="outlined" padding="medium">
              <Text variant="h1">h1 - Titre Principal</Text>
              <Text variant="h2">h2 - Titre Section</Text>
              <Text variant="h3">h3 - Sous-titre</Text>
              <Text variant="h4">h4 - Titre Carte</Text>
              <Text variant="subtitle1">subtitle1 - Sous-titre 1</Text>
              <Text variant="body1">body1 - Corps de texte normal</Text>
              <Text variant="body2">body2 - Corps de texte petit</Text>
              <Text variant="caption">caption - Légende ou note</Text>
              <Text variant="overline">OVERLINE - SURTITRE</Text>
            </Card>
          </View>

          {/* Section: Colors */}
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>
              3. Couleurs
            </Text>
            <View style={[flexLayout.row, grid.gap('base'), styles.wrap]}>
              <View style={[styles.colorBox, { backgroundColor: colors.primary.main }]}>
                <Text variant="caption" color="inverse">Primary</Text>
              </View>
              <View style={[styles.colorBox, { backgroundColor: colors.secondary.main }]}>
                <Text variant="caption" color="inverse">Secondary</Text>
              </View>
              <View style={[styles.colorBox, { backgroundColor: colors.tertiary.main }]}>
                <Text variant="caption" color="inverse">Tertiary</Text>
              </View>
              <View style={[styles.colorBox, { backgroundColor: colors.error.main }]}>
                <Text variant="caption" color="inverse">Error</Text>
              </View>
              <View style={[styles.colorBox, { backgroundColor: colors.success.main }]}>
                <Text variant="caption" color="inverse">Success</Text>
              </View>
              <View style={[styles.colorBox, { backgroundColor: colors.warning.main }]}>
                <Text variant="caption" color="inverse">Warning</Text>
              </View>
            </View>
          </View>

          {/* Section: Buttons */}
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>
              4. Boutons
            </Text>
            <View style={grid.gap('base')}>
              <Button title="Primary Button" variant="primary" onPress={() => {}} />
              <Button title="Secondary Button" variant="secondary" onPress={() => {}} />
              <Button title="Tertiary Button" variant="tertiary" onPress={() => {}} />
              <Button title="Outline Button" variant="outline" onPress={() => {}} />
              <Button title="Ghost Button" variant="ghost" onPress={() => {}} />
              
              <View style={[flexLayout.row, grid.gap('base')]}>
                <Button title="Small" variant="primary" size="small" onPress={() => {}} style={styles.flexButton} />
                <Button title="Medium" variant="primary" size="medium" onPress={() => {}} style={styles.flexButton} />
                <Button title="Large" variant="primary" size="large" onPress={() => {}} style={styles.flexButton} />
              </View>

              <Button
                title="Loading..."
                variant="primary"
                loading={loading}
                onPress={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 2000);
                }}
              />
            </View>
          </View>

          {/* Section: Inputs */}
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>
              5. Inputs
            </Text>
            <View style={grid.gap('base')}>
              <Input
                label="Email"
                placeholder="votre@email.com"
                value={email}
                onChangeText={setEmail}
                variant="outlined"
                required
              />
              
              <Input
                label="Mot de passe"
                placeholder="••••••••"
                variant="filled"
                secureTextEntry
              />
              
              <Input
                label="Avec erreur"
                placeholder="test@example.com"
                error="Email invalide"
                variant="outlined"
              />
              
              <Input
                label="Avec helper text"
                placeholder="Votre message"
                helperText="Ce champ est optionnel"
                variant="outlined"
              />
            </View>
          </View>

          {/* Section: Cards */}
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>
              6. Cards
            </Text>
            <View style={grid.gap('base')}>
              <Card variant="elevated" elevation="md" padding="medium">
                <Text variant="h4">Card Elevated</Text>
                <Text variant="body2" color="secondary">
                  Carte avec ombre et fond blanc
                </Text>
              </Card>

              <Card variant="outlined" padding="medium">
                <Text variant="h4">Card Outlined</Text>
                <Text variant="body2" color="secondary">
                  Carte avec bordure
                </Text>
              </Card>

              <Card variant="filled" padding="medium">
                <Text variant="h4">Card Filled</Text>
                <Text variant="body2" color="secondary">
                  Carte avec fond gris
                </Text>
              </Card>
            </View>
          </View>

          {/* Section: Spacing */}
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>
              7. Spacing
            </Text>
            <Card variant="outlined" padding="medium">
              <View style={grid.gap('xs')}>
                <View style={[styles.spacingBox, { width: spacing.xs }]}>
                  <Text variant="caption">xs - 4px</Text>
                </View>
                <View style={[styles.spacingBox, { width: spacing.sm }]}>
                  <Text variant="caption">sm - 8px</Text>
                </View>
                <View style={[styles.spacingBox, { width: spacing.base }]}>
                  <Text variant="caption">base - 16px</Text>
                </View>
                <View style={[styles.spacingBox, { width: spacing.xl }]}>
                  <Text variant="caption">xl - 24px</Text>
                </View>
                <View style={[styles.spacingBox, { width: spacing['2xl'] }]}>
                  <Text variant="caption">2xl - 32px</Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text variant="caption" color="secondary" centered>
              ✅ Design System Factureo - Tous les composants fonctionnent !
            </Text>
          </View>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  section: {
    marginTop: spacing['3xl'],
  },
  sectionTitle: {
    marginBottom: spacing.base,
  },
  gradientContainer: {
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientContent: {
    flex: 1,
    ...flexLayout.center,
    gap: spacing.sm,
  },
  wrap: {
    flexWrap: 'wrap',
  },
  colorBox: {
    width: 100,
    height: 80,
    borderRadius: 8,
    ...flexLayout.center,
  },
  flexButton: {
    flex: 1,
  },
  spacingBox: {
    height: 40,
    backgroundColor: colors.primary.main,
    borderRadius: 4,
    ...flexLayout.center,
  },
  footer: {
    marginTop: spacing['4xl'],
    marginBottom: spacing['2xl'],
  },
});
