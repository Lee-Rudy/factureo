/**
 * Modale Formulaire Client - Ajout/Modification
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
import { Text, Button, Input, PhoneInput } from '../../components';
import { colors, spacing, borderRadius } from '../../theme';
import { useCreateClient, useUpdateClient } from '../../src/ui/queries/clients';
import { Client } from '../../src/domain/entities/Client';

interface ClientFormModalProps {
  visible: boolean;
  client: Client | null;
  onClose: () => void;
  userId: string;
}

export default function ClientFormModal({
  visible,
  client,
  onClose,
  userId,
}: ClientFormModalProps) {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [adress, setAdress] = useState('');

  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();

  const isEditing = !!client;
  const isLoading = createClientMutation.isPending || updateClientMutation.isPending;

  useEffect(() => {
    if (client) {
      setPrenom(client.prenom);
      setNom(client.nom);
      setEmail(client.email);
      setPhone(client.phone);
      setAdress(client.adress);
    } else {
      resetForm();
    }
  }, [client]);

  const resetForm = () => {
    setPrenom('');
    setNom('');
    setEmail('');
    setPhone('');
    setAdress('');
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await updateClientMutation.mutateAsync({
          id: client!.id,
          data: { prenom, nom, email, phone, adress },
        });
        Alert.alert('Succès', 'Client modifié avec succès');
      } else {
        await createClientMutation.mutateAsync({
          userId,
          prenom,
          nom,
          email,
          phone,
          adress,
        });
        Alert.alert('Succès', 'Client créé avec succès');
      }
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
                {isEditing ? 'Modifier le client' : 'Nouveau client'}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Input
                label="Prénom"
                placeholder="Prénom du client"
                value={prenom}
                onChangeText={setPrenom}
                variant="outlined"
                required
                style={styles.input}
              />

              <Input
                label="Nom"
                placeholder="Nom du client"
                value={nom}
                onChangeText={setNom}
                variant="outlined"
                required
                style={styles.input}
              />

              <Input
                label="Email"
                placeholder="email@exemple.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                variant="outlined"
                required
                style={styles.input}
              />

              <PhoneInput
                label="Téléphone"
                placeholder="6 12 34 56 78"
                value={phone}
                onChangeText={setPhone}
                required
                style={styles.input}
              />

              <Input
                label="Adresse"
                placeholder="Adresse complète"
                value={adress}
                onChangeText={setAdress}
                variant="outlined"
                required
                multiline
                numberOfLines={2}
                style={styles.inputLast}
              />

              <Button
                title={isEditing ? 'Enregistrer les modifications' : 'Créer le client'}
                variant="gradient"
                size="large"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                onPress={handleSubmit}
                style={styles.submitButton}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
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
    maxHeight: '90%',
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
  input: {
    marginBottom: 5,
  },
  inputLast: {
    marginBottom: 5,
  },
  submitButton: {
    marginTop: 10,
  },
});
