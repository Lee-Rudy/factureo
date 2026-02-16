/**
 * Écran Liste des Clients
 * Affiche tous les clients avec opérations CRUD
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, Card, Button, DrawerMenu } from '../components';
import { colors, spacing } from '../theme';
import { useAuth } from '../src/ui/context/AuthContext';
import { useClients, useDeleteClient } from '../src/ui/queries/clients';
import { RootStackParamList, ROUTES } from '../routes/routesConfig';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function ClientsListScreen() {
  const navigation = useNavigation<Nav>();
  const { user, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const { data: clients, isLoading, error } = useClients(user?.id || '');
  const deleteClientMutation = useDeleteClient();

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
      onPress: () => setIsDrawerOpen(false),
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
      onPress: () => {},
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

  const handleDeleteClient = (clientId: string, clientName: string) => {
    Alert.alert(
      'Confirmer la suppression',
      `Voulez-vous vraiment supprimer le client "${clientName}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteClientMutation.mutateAsync({ id: clientId, userId: user!.id });
              Alert.alert('Succès', 'Client supprimé avec succès');
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
                Clients
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

        {clients && clients.length === 0 && (
          <Text variant="body1" color="secondary" centered style={styles.message}>
            Aucun client pour le moment
          </Text>
        )}

        {clients && clients.map((client) => (
          <Card key={client.id} variant="elevated" elevation="none" padding="medium" style={styles.card}>
            <View style={styles.clientHeader}>
              <Text variant="h4" bold>
                {client.name}
              </Text>
            </View>

            <View style={styles.clientInfo}>
              <Text variant="body2" color="secondary">
                Email: {client.email}
              </Text>
              <Text variant="body2" color="secondary">
                Tél: {client.phone}
              </Text>
              <Text variant="body2" color="secondary">
                Adresse: {client.address}
              </Text>
              {client.siret && (
                <Text variant="body2" color="secondary">
                  SIRET: {client.siret}
                </Text>
              )}
            </View>

            <View style={styles.clientActions}>
              <TouchableOpacity onPress={() => {}} style={styles.actionButton}>
                <Text variant="body2" style={styles.editLink}>
                  Modifier
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteClient(client.id, client.name)}
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
        activeRoute="Clients"
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
  clientHeader: {
    marginBottom: spacing.sm,
  },
  clientInfo: {
    gap: spacing.xs,
    marginBottom: spacing.base,
  },
  clientActions: {
    flexDirection: 'row',
    gap: spacing.base,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  actionButton: {
    flex: 1,
  },
  editLink: {
    color: colors.info.main,
    textAlign: 'center',
  },
  deleteLink: {
    color: colors.error.main,
    textAlign: 'center',
  },
});
