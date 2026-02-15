/**
 * Écran Dashboard - Tableau de bord
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card } from '../components';
import { colors, spacing } from '../theme';

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

export default function DashboardScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

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
              disabled
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
            { label: 'Informatique', value: 'MCSPDT2\n40 000', link: 'voir' },
            { label: 'Agence immobilier', value: 'MCSPDT1\n10 000', link: 'voir' },
          ]}
          linkText="Voir tous les produits"
          onLinkPress={() => {}}
        />

        <DashboardItem
          title="Clients"
          count="1 Client(s)"
          icon="people-outline"
          recentItems={[{ label: 'Moocles', value: 'Iden :R\nxxxx xxxx xxx', link: 'voir' }]}
          linkText="Voir tous les clients"
          onLinkPress={() => {}}
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
          count="0 Facture"
          icon="receipt-outline"
          emptyText=""
          linkText="Voir tous les factures"
          onLinkPress={() => {}}
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.pageLight,
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
