/**
 * Modale Détail d'une facture - Lecture seule
 */

import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../components';
import { colors, spacing, borderRadius } from '../../theme';
import { Facture, FactureStatus } from '../../src/domain/entities/Facture';
import { Client } from '../../src/domain/entities/Client';

const statusLabels: Record<FactureStatus, string> = {
  [FactureStatus.DRAFT]: 'En attente',
  [FactureStatus.SENT]: 'Envoyée',
  [FactureStatus.PAID]: 'Payée',
  [FactureStatus.OVERDUE]: 'En retard',
  [FactureStatus.CANCELLED]: 'Annulée',
};

interface FactureDetailModalProps {
  visible: boolean;
  onClose: () => void;
  facture: Facture | null;
  client: Client | null;
  onEdit?: () => void;
}

export default function FactureDetailModal({
  visible,
  onClose,
  facture,
  client,
  onEdit,
}: FactureDetailModalProps) {
  if (!facture) return null;

  const formatDate = (d: Date) => new Date(d).toLocaleDateString('fr-FR');
  const formatMontant = (m: number) =>
    m.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="h4" bold>
              Détail de la facture
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.infoBlock}>
              <Text variant="caption" color="secondary">
                Numéro
              </Text>
              <Text variant="h4" bold>
                {facture.numero}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text variant="caption" color="secondary">
                Statut
              </Text>
              <Text variant="body1" bold>
                {statusLabels[facture.status]}
              </Text>
            </View>
            {client && (
              <View style={styles.infoBlock}>
                <Text variant="caption" color="secondary">
                  Client
                </Text>
                <Text variant="body1">
                  {client.prenom} {client.nom}
                </Text>
                <Text variant="caption" color="secondary">
                  {client.email}
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <View style={styles.infoBlock}>
                <Text variant="caption" color="secondary">
                  Date d'émission
                </Text>
                <Text variant="body2">{formatDate(facture.dateEmission)}</Text>
              </View>
              <View style={styles.infoBlock}>
                <Text variant="caption" color="secondary">
                  Date d'échéance
                </Text>
                <Text variant="body2">{formatDate(facture.dateEcheance)}</Text>
              </View>
            </View>

            <Text variant="subtitle1" bold style={styles.sectionTitle}>
              Lignes
            </Text>
            {facture.lines.map((line) => (
              <View key={line.id} style={styles.lineRow}>
                <View style={styles.lineDesc}>
                  <Text variant="body2" bold numberOfLines={2}>
                    {line.description}
                  </Text>
                  <Text variant="caption" color="secondary">
                    {line.quantite} × {formatMontant(line.unitaire)} HT — TVA {line.taux_TVA}%
                  </Text>
                </View>
                <Text variant="body2" bold>
                  {formatMontant(line.montant_TTC)}
                </Text>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text variant="h4" bold>
                Total TTC
              </Text>
              <Text variant="h4" bold color="primary">
                {formatMontant(facture.montantTTC)}
              </Text>
            </View>

            {onEdit && facture.status !== FactureStatus.PAID && (
              <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                <Ionicons name="create-outline" size={20} color={colors.info.main} />
                <Text variant="body2" style={styles.editButtonText}>
                  Modifier la facture
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.surface.primary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  body: {
    padding: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  infoBlock: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  lineDesc: {
    flex: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.main,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  editButtonText: {
    color: colors.info.main,
  },
});
