/**
 * Écran Liste des Clients - CRUD complet
 * Recherche, filtres, pagination, actions
 */

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, Card, DrawerMenu, SearchBar, Pagination } from '../../components';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../src/ui/context/AuthContext';
import { useClients, useDeleteClient } from '../../src/ui/queries/clients';
import { RootStackParamList, ROUTES } from '../../routes/routesConfig';
import { Client } from '../../src/domain/entities/Client';
import ClientFormModal from './ClientFormModal';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ClientsList'>;

const ITEMS_PER_PAGE = 10;

export default function ClientsListScreen() {
  const navigation = useNavigation<Nav>();
  const { user, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  const { data: allClients = [], isLoading, error } = useClients(user?.id || '');
  const deleteClientMutation = useDeleteClient();

  /**
   * LOGIQUE MÉTIER : Filtre clients par recherche
   */
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return allClients;

    const query = searchQuery.toLowerCase();
    return allClients.filter(
      (client) =>
        client.prenom.toLowerCase().includes(query) ||
        client.nom.toLowerCase().includes(query) ||
        `${client.prenom} ${client.nom}`.toLowerCase().includes(query)
    );
  }, [allClients, searchQuery]);

  /**
   * LOGIQUE MÉTIER : Pagination
   */
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredClients.slice(startIndex, endIndex);
  }, [filteredClients, currentPage]);

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);

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
      onPress: () => {
        setIsDrawerOpen(false);
        navigation.navigate(ROUTES.FACTURES_LIST);
      },
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

  const handleAddClient = () => {
    setSelectedClient(null);
    setShowFormModal(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setShowFormModal(true);
    setShowActionsMenu(null);
  };

  const handleDeleteClient = (client: Client) => {
    setShowActionsMenu(null);
    Alert.alert(
      'Confirmer la suppression',
      `Voulez-vous vraiment supprimer le client "${client.prenom} ${client.nom}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteClientMutation.mutateAsync({ id: client.id, userId: user!.id });
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

  const handleAddFacture = (client: Client) => {
    setShowActionsMenu(null);
    // TODO: Navigation vers création facture avec client pré-sélectionné
    Alert.alert('Info', `Créer une facture pour ${client.prenom} ${client.nom}`);
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
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddClient}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <View style={styles.addIconCircle}>
                  <Ionicons name="add" size={24} color={colors.text.inverse} />
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Rechercher par nom ou prénom..."
        />
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

        {paginatedClients.length === 0 && !isLoading && (
          <Text variant="body1" color="secondary" centered style={styles.message}>
            {searchQuery ? 'Aucun client trouvé' : 'Aucun client pour le moment'}
          </Text>
        )}

        {paginatedClients.map((client) => (
          <Card key={client.id} variant="elevated" elevation="none" padding="medium" style={styles.card}>
            <View style={styles.clientHeader}>
              <View style={styles.clientTitle}>
                <Ionicons name="person-circle-outline" size={32} color={colors.tertiary.main} />
                <View style={styles.clientName}>
                  <Text variant="h4" bold>
                    {client.prenom} {client.nom}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() =>
                  setShowActionsMenu(showActionsMenu === client.id ? null : client.id)
                }
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="ellipsis-vertical" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.clientInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={16} color={colors.text.secondary} />
                <Text variant="body2" color="secondary">
                  {client.email}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={16} color={colors.text.secondary} />
                <Text variant="body2" color="secondary">
                  {client.phone}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
                <Text variant="body2" color="secondary">
                  {client.adress}
                </Text>
              </View>
            </View>

            {showActionsMenu === client.id && (
              <View style={styles.actionsMenu}>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => handleEditClient(client)}
                >
                  <Ionicons name="create-outline" size={20} color={colors.info.main} />
                  <Text variant="body2" style={styles.actionText}>
                    Modifier
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => handleAddFacture(client)}
                >
                  <Ionicons name="document-text-outline" size={20} color={colors.success.main} />
                  <Text variant="body2" style={styles.actionSuccess}>
                    Ajouter une facture
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => handleDeleteClient(client)}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.error.main} />
                  <Text variant="body2" style={styles.actionDelete}>
                    Supprimer
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>
        ))}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </ScrollView>

      <ClientFormModal
        visible={showFormModal}
        client={selectedClient}
        onClose={() => {
          setShowFormModal(false);
          setSelectedClient(null);
        }}
        userId={user?.id || ''}
      />

      <DrawerMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        userName={user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'}
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
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.pageLight,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  clientTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  clientName: {
    flex: 1,
  },
  clientInfo: {
    gap: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionsMenu: {
    marginTop: spacing.base,
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: spacing.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  actionText: {
    color: colors.info.main,
  },
  actionSuccess: {
    color: colors.success.main,
  },
  actionDelete: {
    color: colors.error.main,
  },
});
