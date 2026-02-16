/**
 * Modale Formulaire Facture - Création / Édition
 * Lignes dynamiques (+ / -), calcul total
 */

import React, { useState, useEffect } from 'react';
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
import { useCreateFacture, useUpdateFacture } from '../../src/ui/queries/factures';
import { Client } from '../../src/domain/entities/Client';
import { Facture, FactureLine } from '../../src/domain/entities/Facture';

type LineState = {
  id: string;
  description: string;
  quantite: string;
  unitaire: string;
  tva: string;
};

const defaultLine = (): LineState => ({
  id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  description: '',
  quantite: '1',
  unitaire: '',
  tva: '20',
});

interface FactureFormModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  clients: Client[];
  /** Si fourni = mode édition */
  factureToEdit?: Facture | null;
}

export default function FactureFormModal({
  visible,
  onClose,
  userId,
  clients,
  factureToEdit,
}: FactureFormModalProps) {
  const isEdit = !!factureToEdit?.id;

  const [selectedClientId, setSelectedClientId] = useState('');
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [dateEmission, setDateEmission] = useState(new Date().toISOString().split('T')[0]);
  const [dateEcheance, setDateEcheance] = useState('');
  const [lines, setLines] = useState<LineState[]>([defaultLine()]);

  const createFactureMutation = useCreateFacture();
  const updateFactureMutation = useUpdateFacture();

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  useEffect(() => {
    if (!visible) return;
    if (factureToEdit) {
      setSelectedClientId(factureToEdit.clientId);
      setDateEmission(new Date(factureToEdit.dateEmission).toISOString().split('T')[0]);
      setDateEcheance(new Date(factureToEdit.dateEcheance).toISOString().split('T')[0]);
      setLines(
        factureToEdit.lines.length > 0
          ? factureToEdit.lines.map((l) => ({
              id: l.id,
              description: l.description,
              quantite: String(l.quantite),
              unitaire: String(l.unitaire),
              tva: String(l.taux_TVA ?? 20),
            }))
          : [defaultLine()]
      );
    } else {
      setSelectedClientId('');
      setDateEmission(new Date().toISOString().split('T')[0]);
      setDateEcheance('');
      setLines([defaultLine()]);
    }
  }, [visible, factureToEdit]);

  const resetForm = () => {
    setSelectedClientId('');
    setDateEmission(new Date().toISOString().split('T')[0]);
    setDateEcheance('');
    setLines([defaultLine()]);
  };

  const addLine = () => setLines((prev) => [...prev, defaultLine()]);

  const removeLine = (id: string) => {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLine = (id: string, field: keyof LineState, value: string) => {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  /**
   * LOGIQUE MÉTIER : Calcul d'une ligne
   */
  const lineToFactureLine = (line: LineState): FactureLine => {
    const qty = parseFloat(line.quantite) || 0;
    const price = parseFloat(line.unitaire) || 0;
    const taxRate = parseFloat(line.tva) || 0;
    const montantHT = qty * price;
    const montantTVA = montantHT * (taxRate / 100);
    const montantTTC = montantHT + montantTVA;
    return {
      id: line.id,
      description: line.description,
      quantite: qty,
      unitaire: price,
      montant_HT: montantHT,
      taux_TVA: taxRate,
      montant_TVA: montantTVA,
      montant_TTC: montantTTC,
    };
  };

  /**
   * LOGIQUE MÉTIER : Total TTC de toutes les lignes
   */
  const totalTTC = lines.reduce((sum, line) => {
    const fl = lineToFactureLine(line);
    return sum + fl.montant_TTC;
  }, 0);

  const handleSubmit = async () => {
    if (!selectedClientId) {
      Alert.alert('Attention', 'Veuillez sélectionner un client');
      return;
    }
    if (!dateEcheance) {
      Alert.alert('Attention', "Veuillez saisir la date d'échéance");
      return;
    }

    const factureLines = lines.map(lineToFactureLine);
    const hasValidLine = factureLines.some(
      (l) => l.description.trim() !== '' && l.unitaire > 0 && l.quantite > 0
    );
    if (!hasValidLine) {
      Alert.alert('Attention', 'Au moins une ligne doit avoir une description, une quantité et un prix unitaire');
      return;
    }

    const validLines = factureLines.filter(
      (l) => l.description.trim() !== '' && l.quantite > 0 && l.unitaire >= 0
    );
    if (validLines.length === 0) {
      Alert.alert('Attention', 'Veuillez remplir au moins une ligne valide');
      return;
    }

    try {
      if (isEdit && factureToEdit) {
        await updateFactureMutation.mutateAsync({
          id: factureToEdit.id,
          data: {
            clientId: selectedClientId,
            dateEmission: new Date(dateEmission),
            dateEcheance: new Date(dateEcheance),
            lines: validLines,
          },
        });
        Alert.alert('Succès', 'Facture modifiée avec succès');
      } else {
        await createFactureMutation.mutateAsync({
          userId,
          clientId: selectedClientId,
          dateEmission: new Date(dateEmission),
          dateEcheance: new Date(dateEcheance),
          lines: validLines,
        });
        Alert.alert('Succès', 'Facture créée avec succès');
      }
      resetForm();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erreur', error.message);
      }
    }
  };

  const isPending = createFactureMutation.isPending || updateFactureMutation.isPending;

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
                {isEdit ? 'Modifier la facture' : 'Nouvelle facture'}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.modalBodyContent}
              showsVerticalScrollIndicator={false}
            >
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

              <View style={styles.linesHeader}>
                <Text variant="subtitle1" bold style={styles.sectionTitle}>
                  Lignes de facturation
                </Text>
                <TouchableOpacity onPress={addLine} style={styles.addLineButton}>
                  <Ionicons name="add-circle" size={28} color={colors.tertiary.main} />
                  <Text variant="body2" color="primary">Ajouter une ligne</Text>
                </TouchableOpacity>
              </View>

              {lines.map((line) => (
                <View key={line.id} style={styles.lineBlock}>
                  <View style={styles.lineRowHeader}>
                    <Text variant="caption" color="secondary">
                      Ligne {lines.findIndex((l) => l.id === line.id) + 1}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeLine(line.id)}
                      disabled={lines.length <= 1}
                      style={lines.length <= 1 && styles.deleteDisabled}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={22}
                        color={lines.length <= 1 ? colors.text.disabled : colors.error.main}
                      />
                    </TouchableOpacity>
                  </View>
                  <Input
                    label="Description"
                    placeholder="Description du service/produit"
                    value={line.description}
                    onChangeText={(v) => updateLine(line.id, 'description', v)}
                    variant="outlined"
                    style={styles.input}
                  />
                  <Input
                    label="Quantité"
                    placeholder="1"
                    value={line.quantite}
                    onChangeText={(v) => updateLine(line.id, 'quantite', v)}
                    keyboardType="numeric"
                    variant="outlined"
                    style={styles.input}
                  />
                  <Input
                    label="Prix unitaire HT (€)"
                    placeholder="0.00"
                    value={line.unitaire}
                    onChangeText={(v) => updateLine(line.id, 'unitaire', v)}
                    keyboardType="numeric"
                    variant="outlined"
                    style={styles.input}
                  />
                  <Input
                    label="TVA (%)"
                    placeholder="20"
                    value={line.tva}
                    onChangeText={(v) => updateLine(line.id, 'tva', v)}
                    keyboardType="numeric"
                    variant="outlined"
                    style={styles.inputLast}
                  />
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text variant="h4" bold>
                  Total TTC
                </Text>
                <Text variant="h4" bold color="primary">
                  {totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </Text>
              </View>

              <Button
                title={isEdit ? 'Enregistrer les modifications' : 'Créer la facture'}
                variant="gradient"
                size="large"
                fullWidth
                loading={isPending}
                disabled={isPending}
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
  },
  modalBodyContent: {
    paddingBottom: 55,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  linesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  addLineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  lineBlock: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
  },
  lineRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  deleteDisabled: {
    opacity: 0.5,
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
  inputLast: {
    marginBottom: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.main,
  },
  submitButton: {
    marginTop: spacing.xl,
    marginBottom: spacing['3xl'],
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
