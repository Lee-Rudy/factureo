/**
 * EXEMPLE - Écran Dashboard
 * Démontre l'utilisation des composants Card, Container et des helpers de layout
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Text, Card, Container, Button } from '../components';
import { spacing, colors, flexLayout, grid } from '../theme';

export default function DashboardScreenExample() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Container padding="section">
          <View style={[flexLayout.rowBetween, styles.header]}>
            <View>
              <Text variant="caption" color="secondary">
                Bienvenue,
              </Text>
              <Text variant="h3" bold>
                John Doe
              </Text>
            </View>
            <View style={styles.avatar}>
              <Text variant="h4" color="inverse">
                JD
              </Text>
            </View>
          </View>
        </Container>

        {/* Stats Cards */}
        <Container padding="section">
          <View style={[flexLayout.row, grid.gap('base'), styles.statsRow]}>
            <Card variant="elevated" elevation="md" padding="medium" style={styles.statCard}>
              <Text variant="caption" color="secondary">
                Factures ce mois
              </Text>
              <Text variant="h2" style={styles.statValue}>
                12
              </Text>
            </Card>

            <Card variant="elevated" elevation="md" padding="medium" style={styles.statCard}>
              <Text variant="caption" color="secondary">
                Montant total
              </Text>
              <Text variant="h2" style={styles.statValue}>
                4.5k€
              </Text>
            </Card>
          </View>
        </Container>

        {/* Actions rapides */}
        <Container padding="section">
          <Text variant="h4" style={styles.sectionTitle}>
            Actions rapides
          </Text>
          
          <View style={grid.gap('base')}>
            <Card variant="filled" padding="medium">
              <View style={flexLayout.rowBetween}>
                <View>
                  <Text variant="subtitle1">Créer une facture</Text>
                  <Text variant="caption" color="secondary">
                    Nouvelle facture client
                  </Text>
                </View>
                <Button title="+" variant="primary" size="small" onPress={() => {}} />
              </View>
            </Card>

            <Card variant="filled" padding="medium">
              <View style={flexLayout.rowBetween}>
                <View>
                  <Text variant="subtitle1">Nouveau client</Text>
                  <Text variant="caption" color="secondary">
                    Ajouter un client
                  </Text>
                </View>
                <Button title="+" variant="secondary" size="small" onPress={() => {}} />
              </View>
            </Card>
          </View>
        </Container>

        {/* Dernières factures */}
        <Container padding="section">
          <Text variant="h4" style={styles.sectionTitle}>
            Dernières factures
          </Text>
          
          <View style={grid.gap('base')}>
            {[1, 2, 3].map((item) => (
              <Card key={item} variant="outlined" padding="medium">
                <View style={flexLayout.rowBetween}>
                  <View style={styles.invoiceInfo}>
                    <Text variant="subtitle1">Facture #{`00${item}`.slice(-3)}</Text>
                    <Text variant="caption" color="secondary">
                      Client: Company Inc.
                    </Text>
                    <Text variant="caption" color="secondary">
                      15/02/2026
                    </Text>
                  </View>
                  <View style={styles.invoiceAmount}>
                    <Text variant="h4" bold>
                      1 250€
                    </Text>
                    <View style={[styles.badge, styles.badgeSuccess]}>
                      <Text variant="caption" color="inverse">
                        Payée
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
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
  header: {
    marginBottom: spacing.base,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary.main,
    ...flexLayout.center,
  },
  statsRow: {
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 150,
  },
  statValue: {
    marginTop: spacing.sm,
    color: colors.primary.main,
  },
  sectionTitle: {
    marginBottom: spacing.base,
  },
  invoiceInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  invoiceAmount: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  badgeSuccess: {
    backgroundColor: colors.success.main,
  },
});
