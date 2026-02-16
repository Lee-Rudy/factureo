/**
 * Écran Liste des Factures - CRUD complet
 * Recherche par client, pagination, actions
 */

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, Card, DrawerMenu, SearchBar, Pagination } from '../../components';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../src/ui/context/AuthContext';
import { useFactures, useDeleteFacture, useUpdateFactureStatus } from '../../src/ui/queries/factures';
import { useClients } from '../../src/ui/queries/clients';
import { Facture, FactureStatus } from '../../src/domain/entities/Facture';
import { RootStackParamList, ROUTES } from '../../routes/routesConfig';
import FactureFormModal from './FactureFormModal';
import FactureDetailModal from './FactureDetailModal';

type Nav = NativeStackNavigationProp<RootStackParamList, 'FacturesList'>;

const ITEMS_PER_PAGE = 10;

const statusLabels: Record<FactureStatus, string> = {
  [FactureStatus.DRAFT]: 'En attente',
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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [factureDetail, setFactureDetail] = useState<Facture | null>(null);
  const [factureToEdit, setFactureToEdit] = useState<Facture | null>(null);

  const { data: factures = [], isLoading, error } = useFactures(user?.id || '');
  const { data: clients = [] } = useClients(user?.id || '');
  const deleteFactureMutation = useDeleteFacture();
  const updateStatusMutation = useUpdateFactureStatus();

  /**
   * LOGIQUE MÉTIER : Recherche factures par nom client
   */
  const filteredFactures = useMemo(() => {
    if (!searchQuery.trim()) return factures;

    const query = searchQuery.toLowerCase();
    return factures.filter((facture) => {
      const client = clients.find((c) => c.id === facture.clientId);
      if (!client) return false;

      return (
        client.prenom.toLowerCase().includes(query) ||
        client.nom.toLowerCase().includes(query) ||
        `${client.prenom} ${client.nom}`.toLowerCase().includes(query) ||
        facture.numero.toLowerCase().includes(query)
      );
    });
  }, [factures, clients, searchQuery]);

  /**
   * LOGIQUE MÉTIER : Pagination
   */
  const paginatedFactures = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredFactures.slice(startIndex, endIndex);
  }, [filteredFactures, currentPage]);

  const totalPages = Math.ceil(filteredFactures.length / ITEMS_PER_PAGE);

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
      onPress: () => {
        setIsDrawerOpen(false);
        navigation.navigate(ROUTES.CLIENTS_LIST);
      },
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
    setShowActionsMenu(null);
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

  const handleViewDetail = (facture: Facture) => {
    setShowActionsMenu(null);
    setFactureDetail(facture);
    setShowDetailModal(true);
  };

  const handleEditFacture = (facture: Facture) => {
    setShowActionsMenu(null);
    setFactureDetail(null);
    setShowDetailModal(false);
    setFactureToEdit(facture);
    setShowFormModal(true);
  };

  const handleChangeStatus = (facture: Facture) => {
    setShowActionsMenu(null);
    const isPaid = facture.status === FactureStatus.PAID;
    const newStatus = isPaid ? FactureStatus.SENT : FactureStatus.PAID;
    const message = isPaid
      ? 'Repasser cette facture en "Envoyée" ?'
      : 'Marquer cette facture comme payée ?';
    Alert.alert(
      'Changer le statut',
      message,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              await updateStatusMutation.mutateAsync({ id: facture.id, status: newStatus });
              Alert.alert(
                'Succès',
                isPaid ? 'Statut mis à jour (Envoyée)' : 'Facture marquée comme payée'
              );
            } catch (e) {
              if (e instanceof Error) Alert.alert('Erreur', e.message);
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => new Date(date).toLocaleDateString('fr-FR');
  const formatMontant = (montant: number) =>
    `${montant.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
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
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowFormModal(true)}
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
          placeholder="Rechercher par client ou numéro..."
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

        {paginatedFactures.length === 0 && !isLoading && (
          <Text variant="body1" color="secondary" centered style={styles.message}>
            {searchQuery ? 'Aucune facture trouvée' : 'Aucune facture pour le moment'}
          </Text>
        )}

        {paginatedFactures.map((facture) => (
          <Card key={facture.id} variant="elevated" elevation="none" padding="medium" style={styles.card}>
            <View style={styles.factureHeader}>
              <View style={styles.factureTitle}>
                <Ionicons name="document-text" size={28} color={colors.primary.dark} />
                <View>
                  <Text variant="h4" bold>
                    {facture.numero}
                  </Text>
                  <Text variant="caption" color="secondary">
                    {getClientName(facture.clientId)}
                  </Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                <View style={[styles.badge, { backgroundColor: statusColors[facture.status] }]}>
                  <Text variant="caption" color="inverse">
                    {statusLabels[facture.status]}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    setShowActionsMenu(showActionsMenu === facture.id ? null : facture.id)
                  }
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="ellipsis-vertical" size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.factureInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
                <Text variant="body2" color="secondary">
                  Émission: {formatDate(facture.dateEmission)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
                <Text variant="body2" color="secondary">
                  Échéance: {formatDate(facture.dateEcheance)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={16} color={colors.primary.dark} />
                <Text variant="body1" bold color="secondary" style={styles.montant}>
                {formatMontant(facture.montantTTC)}
              </Text>
              </View>
            </View>

            {showActionsMenu === facture.id && (
              <View style={styles.actionsMenu}>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => handleViewDetail(facture)}
                >
                  <Ionicons name="eye-outline" size={20} color={colors.info.main} />
                  <Text variant="body2" style={styles.actionText}>
                    Voir le détail
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => handleChangeStatus(facture)}
                >
                  <Ionicons
                    name={facture.status === FactureStatus.PAID ? 'arrow-undo-outline' : 'checkmark-circle-outline'}
                    size={20}
                    color={facture.status === FactureStatus.PAID ? colors.warning.main : colors.success.main}
                  />
                  <Text variant="body2" style={facture.status === FactureStatus.PAID ? styles.actionWarning : styles.actionSuccess}>
                    {facture.status === FactureStatus.PAID ? 'Repasser en envoyée' : 'Marquer comme payée'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => handleEditFacture(facture)}
                >
                  <Ionicons name="create-outline" size={20} color={colors.info.main} />
                  <Text variant="body2" style={styles.actionText}>
                    Modifier
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => handleDeleteFacture(facture.id, facture.numero)}
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

      <FactureFormModal
        visible={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setFactureToEdit(null);
        }}
        userId={user?.id || ''}
        clients={clients}
        factureToEdit={factureToEdit}
      />

      <FactureDetailModal
        visible={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setFactureDetail(null);
        }}
        facture={factureDetail}
        client={factureDetail ? clients.find((c) => c.id === factureDetail.clientId) ?? null : null}
        onEdit={
          factureDetail
            ? () => {
                setFactureToEdit(factureDetail);
                setShowDetailModal(false);
                setFactureDetail(null);
                setShowFormModal(true);
              }
            : undefined
        }
      />

      <DrawerMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        userName={user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'}
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
  factureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  factureTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  factureInfo: {
    gap: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  montant: {},
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
  actionWarning: {
    color: colors.warning.main,
  },
});
