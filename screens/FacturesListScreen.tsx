/**
 * Écran Liste des Factures
 * Affiche toutes les factures avec opérations CRUD
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, Card, DrawerMenu } from '../components';
import { colors, spacing } from '../theme';
import { useAuth } from '../src/ui/context/AuthContext';
import { useFactures, useDeleteFacture, useMarkFactureAsPaid } from '../src/ui/queries/factures';
import { FactureStatus } from '../src/domain/entities/Facture';
import { RootStackParamList, ROUTES } from '../routes/routesConfig';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

const statusLabels: Record<FactureStatus, string> = {
  [FactureStatus.DRAFT]: 'Brouillon',
  [FactureStatus.SENT]: 'Envoyée',
  [FactureStatus.PAID]: 'Payée',
  [FactureStatus.OVERDUE]: 'En retard',
  [FactureStatus.CANCELLED]: 'Annulée',
};

const statusColors: Record<FactureStatus, string> = {
  [FactureStatus.DRAFT]: colors.text.secondary,
  [FactureStatus.SENT]: colors.info.main,
  [FactureStatus.PAID]: colors.success.main,
  [FactureStatus.OVERDUE]: colors.error.main,
  [FactureStatus.CANCELLED]: colors.text.disabled,
};

export default function FacturesListScreen() {
  const navigation = useNavigation<Nav>();
  const { user, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const { data: factures, isLoading, error } = useFactures(user?.id || '');
  const deleteFactureMutation = useDeleteFacture();
  const markAsPaidMutation = useMarkFactureAsPaid();

  const menuItems = [
    {
      icon: 'home-outline' as const,
      label: 'Tableau de bord',
      onPress: () => {
        setIsDrawerOpen(false);
        navigation.navigate(ROUTES.DASHBOARD);
      },
    },
    {
      icon: 'cube-outline' as const,
      label: 'Produits',
      onPress: () => {},
    },
    {
      icon: 'people-outline' as const,
      label: 'Clients',
      onPress: () => {},
    },
    {
      icon: 'document-text-outline' as const,
      label: 'Devis',
      hasDropdown: true,
      onPress: () => {},
    },
    {
      icon: 'receipt-outline' as const,
      label: 'Facture',
      hasDropdown: true,
      onPress: () => setIsDrawerOpen(false),
    },
    {
      icon: 'settings-outline' as const,
      label: 'Paramètres',
      hasDropdown: true,
      onPress: () => {},
    },
  ];

  const handleLogout = () => {
    logout();
    setIsDrawerOpen(false);
    navigation.navigate(ROUTES.AUTH);
  };

  const handleDeleteFacture = (factureId: string, factureNumero: string) => {
    Alert.alert(
      'Confirmer la suppression',
      `Voulez-vous vraiment supprimer la facture "${factureNumero}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFactureMutation.mutateAsync({ id: factureId, userId: user!.id });
              Alert.alert('Succès', 'Facture supprimée avec succès');
            } catch (error) {
              if (error instanceof Error) {
                Alert.alert('Erreur', error.message);
              }
            }
          },
        },
      ]
    );
  };

  const handleMarkAsPaid = async (factureId: string) => {
    try {
      await markAsPaidMutation.mutateAsync({ id: factureId, userId: user!.id });
      Alert.alert('Succès', 'Facture marquée comme payée');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erreur', error.message);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const formatMontant = (montant: number) => {
    return `${montant.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <View style={styles.headerContainer} onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
        <LinearGradient
          colors={[colors.background.gradient.start, colors.background.gradient.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <SafeAreaView edges={['top']}>
            <View style={styles.headerContent}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setIsDrawerOpen(!isDrawerOpen)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="menu" size={28} color={colors.text.inverse} />
              </TouchableOpacity>
              <Text variant="h3" color="inverse" bold>
                Factures
              </Text>
              <View style={styles.menuButton} />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {isLoading && (
          <Text variant="body1" color="secondary" centered style={styles.message}>
            Chargement...
          </Text>
        )}

        {error && (
          <Text variant="body1" color="error" centered style={styles.message}>
            Erreur de chargement
          </Text>
        )}

        {factures && factures.length === 0 && (
          <Text variant="body1" color="secondary" centered style={styles.message}>
            Aucune facture pour le moment
          </Text>
        )}

        {factures && factures.map((facture) => (
          <Card key={facture.id} variant="elevated" elevation="none" padding="medium" style={styles.card}>
            <View style={styles.factureHeader}>
              <Text variant="h4" bold>
                {facture.numero}
              </Text>
              <View style={[styles.badge, { backgroundColor: statusColors[facture.status] }]}>
                <Text variant="caption" color="inverse">
                  {statusLabels[facture.status]}
                </Text>
              </View>
            </View>

            <View style={styles.factureInfo}>
              <Text variant="body2" color="secondary">
                Date émission: {formatDate(facture.dateEmission)}
              </Text>
              <Text variant="body2" color="secondary">
                Date échéance: {formatDate(facture.dateEcheance)}
              </Text>
              <Text variant="body1" bold style={styles.montant}>
                Montant TTC: {formatMontant(facture.montantTTC)}
              </Text>
            </View>

            <View style={styles.factureActions}>
              {facture.status !== FactureStatus.PAID && (
                <TouchableOpacity
                  onPress={() => handleMarkAsPaid(facture.id)}
                  style={styles.actionButton}
                >
                  <Text variant="body2" style={styles.paidLink}>
                    Marquer payée
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => handleDeleteFacture(facture.id, facture.numero)}
                style={styles.actionButton}
              >
                <Text variant="body2" style={styles.deleteLink}>
                  Supprimer
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>

      <DrawerMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        userName={user?.firstName + ' ' + user?.lastName || 'Utilisateur'}
        userRole="Gestionnaire de flotte"
        menuItems={menuItems}
        onLogout={handleLogout}
        activeRoute="Facture"
        headerHeight={headerHeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.pageLight,
  },
  headerContainer: {
    zIndex: 1000,
  },
  header: {
    paddingBottom: spacing.base,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
  },
  message: {
    marginTop: spacing['3xl'],
  },
  card: {
    marginBottom: spacing.base,
  },
  factureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  factureInfo: {
    gap: spacing.xs,
    marginBottom: spacing.base,
  },
  montant: {
    marginTop: spacing.xs,
    color: colors.primary.main,
  },
  factureActions: {
    flexDirection: 'row',
    gap: spacing.base,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  actionButton: {
    flex: 1,
  },
  paidLink: {
    color: colors.success.main,
    textAlign: 'center',
  },
  deleteLink: {
    color: colors.error.main,
    textAlign: 'center',
  },
});
