/**
 * Écran Dashboard - Tableau de bord
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, Card, DrawerMenu } from '../components';
import { colors, spacing } from '../theme';
import { useAuth } from '../src/ui/context/AuthContext';
import { useClients } from '../src/ui/queries/clients';
import { useFactures } from '../src/ui/queries/factures';
import { RootStackParamList, ROUTES } from '../routes/routesConfig';

interface DashboardItemProps {
  title: string;
  count: string;
  icon: keyof typeof Ionicons.glyphMap;
  recentItems?: Array<{ label: string; value: string }>;
  emptyText?: string;
  linkText: string;
  onLinkPress: () => void;
}

const DashboardItem: React.FC<DashboardItemProps> = ({
  title,
  count,
  icon,
  recentItems,
  emptyText,
  linkText,
  onLinkPress,
}) => (
  <Card variant="elevated" elevation="none" padding="medium" style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardTitleRow}>
        <Ionicons name={icon} size={24} color={colors.text.primary} />
        <Text variant="h4" bold style={styles.cardTitle}>
          {title}
        </Text>
      </View>
      <Text variant="body2" bold>
        {count}
      </Text>
    </View>

    <View style={styles.cardContent}>
      <Text variant="caption" color="secondary" style={styles.recentLabel}>
        Récemment ajoutés :
      </Text>

      {recentItems && recentItems.length > 0 ? (
        recentItems.map((item, index) => (
          <View key={index} style={styles.recentItem}>
            <Text variant="body2" style={styles.itemLabel}>
              {item.label}
            </Text>
            <Text variant="body2" color="secondary" style={styles.itemValue}>
              {item.value}
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text variant="body2" style={styles.itemLink}>
                voir
              </Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text variant="body2" color="secondary" style={styles.emptyText}>
          {emptyText}
        </Text>
      )}
    </View>

    <TouchableOpacity onPress={onLinkPress} style={styles.cardFooter}>
      <Text variant="body2" style={styles.viewAllLink}>
        {linkText}
      </Text>
    </TouchableOpacity>
  </Card>
);

type Nav = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { user, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const { data: clients = [] } = useClients(user?.id || '');
  const { data: factures = [] } = useFactures(user?.id || '');

  const menuItems = [
    {
      icon: 'home-outline' as const,
      label: 'Tableau de bord',
      onPress: () => setIsDrawerOpen(false),
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

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <View
        style={styles.headerContainer}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
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
                Tableau de bord
              </Text>
              <View style={styles.menuButton} />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DashboardItem
          title="Produits"
          count="2 Produit(s)"
          icon="cube-outline"
          recentItems={[
            { label: 'Informatique', value: 'MCSPDT2\n40 000' },
            { label: 'Agence immobilier', value: 'MCSPDT1\n10 000' },
          ]}
          linkText="Voir tous les produits"
          onLinkPress={() => {}}
        />

        <DashboardItem
          title="Clients"
          count={`${clients.length} Client(s)`}
          icon="people-outline"
          recentItems={clients.slice(0, 2).map((c) => ({
            label: c.name,
            value: `${c.siret || 'N/A'}\n${c.phone}`,
          }))}
          linkText="Voir tous les clients"
          onLinkPress={() => navigation.navigate(ROUTES.CLIENTS_LIST)}
        />

        <DashboardItem
          title="Devis"
          count="0 Devis"
          icon="document-text-outline"
          emptyText=""
          linkText="Voir tous les devis"
          onLinkPress={() => {}}
        />

        <DashboardItem
          title="Facture"
          count={`${factures.length} Facture${factures.length > 1 ? 's' : ''}`}
          icon="receipt-outline"
          recentItems={factures.slice(0, 2).map((f) => ({
            label: f.numero,
            value: `${f.montantTTC.toFixed(2)} €\n${new Date(f.dateEmission).toLocaleDateString('fr-FR')}`,
          }))}
          emptyText=""
          linkText="Voir tous les factures"
          onLinkPress={() => navigation.navigate(ROUTES.FACTURES_LIST)}
        />

        <DashboardItem
          title="Tickets supports"
          count="0 Ticket(s)"
          icon="headset-outline"
          emptyText="Vous avez 0 tickets dans votre espace de support"
          linkText="Espace supports"
          onLinkPress={() => {}}
        />

        <Card variant="elevated" elevation="none" padding="medium" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="newspaper-outline" size={24} color={colors.text.primary} />
              <Text variant="h4" bold style={styles.cardTitle}>
                Actualités
              </Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text variant="caption" color="secondary" style={styles.recentLabel}>
              Articles récents
            </Text>

            <View style={styles.newsItem}>
              <Text variant="body2" style={styles.newsTitle}>
                5 raisons d'adopter le traitement de données
              </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text variant="body2" style={styles.itemLink}>
                  Lire
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.newsItem}>
              <Text variant="body2" style={styles.newsTitle}>
                Comment automatisé le traitement des factures
              </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text variant="body2" style={styles.itemLink}>
                  Lire
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => {}} style={styles.cardFooter}>
            <Text variant="body2" style={styles.viewAllLink}>
              Espace supports
            </Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>

      <DrawerMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        userName={user ? `${user.firstName} ${user.lastName}` : 'Heritsilavina RAZAFIARISON'}
        userRole="Gestionnaire de flotte"
        menuItems={menuItems}
        onLogout={handleLogout}
        activeRoute="Tableau de bord"
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
    gap: spacing.base,
  },
  card: {
    marginBottom: spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: 18,
  },
  cardContent: {
    marginBottom: spacing.md,
  },
  recentLabel: {
    marginBottom: spacing.sm,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  itemLabel: {
    flex: 1,
  },
  itemValue: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  itemLink: {
    color: colors.info.main,
    marginLeft: spacing.sm,
  },
  emptyText: {
    fontStyle: 'italic',
    marginVertical: spacing.xs,
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  viewAllLink: {
    color: colors.info.main,
  },
  newsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  newsTitle: {
    flex: 1,
    marginRight: spacing.sm,
  },
});
