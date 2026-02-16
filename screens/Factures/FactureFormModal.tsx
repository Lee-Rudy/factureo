/**
 * Modale Formulaire Facture - Création
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button, Input } from '../../components';
import { colors, spacing, borderRadius } from '../../theme';
import { useCreateFacture } from '../../src/ui/queries/factures';
import { Client } from '../../src/domain/entities/Client';
import { FactureLine } from '../../src/domain/entities/Facture';

interface FactureFormModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  clients: Client[];
}

export default function FactureFormModal({
  visible,
  onClose,
  userId,
  clients,
}: FactureFormModalProps) {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [dateEmission, setDateEmission] = useState(new Date().toISOString().split('T')[0]);
  const [dateEcheance, setDateEcheance] = useState('');
  const [description, setDescription] = useState('');
  const [quantite, setQuantite] = useState('1');
  const [unitaire, setUnitaire] = useState('');
  const [tva, setTva] = useState('20');

  const createFactureMutation = useCreateFacture();

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const resetForm = () => {
    setSelectedClientId('');
    setDateEmission(new Date().toISOString().split('T')[0]);
    setDateEcheance('');
    setDescription('');
    setQuantite('1');
    setUnitaire('');
    setTva('20');
  };

  /**
   * LOGIQUE MÉTIER : Calcul ligne facture
   */
  const calculateLine = (): FactureLine => {
    const qty = parseFloat(quantite) || 0;
    const price = parseFloat(unitaire) || 0;
    const taxRate = parseFloat(tva) || 0;

    const montantHT = qty * price;
    const montantTVA = montantHT * (taxRate / 100);
    const montantTTC = montantHT + montantTVA;

    return {
      id: `line-${Date.now()}`,
      description,
      quantite: qty,
      unitaire: price,
      montant_HT: montantHT,
      taux_TVA: taxRate,
      montant_TVA: montantTVA,
      montant_TTC: montantTTC,
    };
  };

  const handleSubmit = async () => {
    if (!selectedClientId) {
      Alert.alert('Attention', 'Veuillez sélectionner un client');
      return;
    }

    if (!dateEcheance) {
      Alert.alert('Attention', 'Veuillez saisir la date d\'échéance');
      return;
    }

    if (!description || !unitaire) {
      Alert.alert('Attention', 'Veuillez remplir les informations de la ligne');
      return;
    }

    try {
      const line = calculateLine();

      await createFactureMutation.mutateAsync({
        userId,
        clientId: selectedClientId,
        dateEmission: new Date(dateEmission),
        dateEcheance: new Date(dateEcheance),
        lines: [line],
      });

      Alert.alert('Succès', 'Facture créée avec succès');
      resetForm();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erreur', error.message);
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalKeyboard}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" bold>
                Nouvelle facture
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text variant="subtitle1" bold style={styles.sectionTitle}>
                Informations générales
              </Text>

              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowClientPicker(true)}
              >
                <Text variant="body2" color={selectedClientId ? 'primary' : 'secondary'}>
                  {selectedClient
                    ? `${selectedClient.prenom} ${selectedClient.nom}`
                    : 'Sélectionner un client *'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
              </TouchableOpacity>

              <Input
                label="Date d'émission"
                value={dateEmission}
                onChangeText={setDateEmission}
                variant="outlined"
                required
                style={styles.input}
              />

              <Input
                label="Date d'échéance"
                placeholder="AAAA-MM-JJ"
                value={dateEcheance}
                onChangeText={setDateEcheance}
                variant="outlined"
                required
                style={styles.input}
              />

              <Text variant="subtitle1" bold style={styles.sectionTitle}>
                Ligne de facturation
              </Text>

              <Input
                label="Description"
                placeholder="Description du service/produit"
                value={description}
                onChangeText={setDescription}
                variant="outlined"
                required
                multiline
                style={styles.input}
              />

              <Input
                label="Quantité"
                placeholder="1"
                value={quantite}
                onChangeText={setQuantite}
                keyboardType="numeric"
                variant="outlined"
                required
                style={styles.input}
              />

              <Input
                label="Prix unitaire HT (€)"
                placeholder="0.00"
                value={unitaire}
                onChangeText={setUnitaire}
                keyboardType="numeric"
                variant="outlined"
                required
                style={styles.input}
              />

              <Input
                label="TVA (%)"
                placeholder="20"
                value={tva}
                onChangeText={setTva}
                keyboardType="numeric"
                variant="outlined"
                required
                style={styles.inputLast}
              />

              <Button
                title="Créer la facture"
                variant="gradient"
                size="large"
                fullWidth
                loading={createFactureMutation.isPending}
                disabled={createFactureMutation.isPending}
                onPress={handleSubmit}
                style={styles.submitButton}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>

      <Modal
        visible={showClientPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowClientPicker(false)}
      >
        <TouchableOpacity
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setShowClientPicker(false)}
        >
          <View style={styles.pickerContent}>
            <View style={styles.pickerHeader}>
              <Text variant="h4" bold>
                Sélectionner un client
              </Text>
              <TouchableOpacity onPress={() => setShowClientPicker(false)}>
                <Ionicons name="close" size={28} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {clients.map((client) => (
                <TouchableOpacity
                  key={client.id}
                  style={styles.clientItem}
                  onPress={() => {
                    setSelectedClientId(client.id);
                    setShowClientPicker(false);
                  }}
                >
                  <Ionicons name="person-circle-outline" size={32} color={colors.tertiary.main} />
                  <View style={styles.clientItemInfo}>
                    <Text variant="body1" bold>
                      {client.prenom} {client.nom}
                    </Text>
                    <Text variant="caption" color="secondary">
                      {client.email}
                    </Text>
                  </View>
                  {selectedClientId === client.id && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.success.main} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalKeyboard: {
    maxHeight: '100%',
  },
  modalContent: {
    backgroundColor: colors.surface.primary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalBody: {
    padding: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  sectionTitle: {
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.main,
    backgroundColor: colors.surface.primary,
    marginBottom: 12,
  },
  input: {
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  halfInput: {
    flex: 1,
    marginBottom: 12,
  },
  inputLast: {
    marginBottom: 5,
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 5,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContent: {
    backgroundColor: colors.surface.primary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '70%',
    paddingBottom: spacing.xl,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.base,
  },
  clientItemInfo: {
    flex: 1,
  },
});
