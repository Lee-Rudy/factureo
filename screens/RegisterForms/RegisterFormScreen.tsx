/**
 * Formulaire d'inscription en deux étapes
 * étape 1 : informations personnelles
 * étape 2 : informations bancaires
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button, Card, Input, ProgressBar, PhoneInput, Logo } from '../../components';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../src/ui/context/AuthContext';
import { RootStackParamList, ROUTES } from '../../routes/routesConfig';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RegisterForm'>;

export default function RegisterFormScreen() {
  const navigation = useNavigation<Nav>();
  const { register, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');

  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [iban, setIban] = useState('');
  const [swift, setSwift] = useState('');

  const handleNext = () => {
    if (!firstName || !lastName || !email || !phone || !companyName || !address) {
      Alert.alert('Attention', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!bankName || !iban || !swift) {
      Alert.alert('Attention', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    try {
      await register({
        email,
        password: 'TempPass123!',
        firstName,
        lastName,
        phone,
        companyName,
        address,
        bankName,
        iban,
        swift,
      });
      navigation.navigate(ROUTES.DASHBOARD);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erreur', error.message);
      } else {
        Alert.alert('Erreur', 'Échec de l\'enregistrement.');
      }
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {step === 1 ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep(1)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>
            )}

            <ProgressBar currentStep={step} totalSteps={2} />

            <View style={styles.logoWrap}>
              <Logo width={200} height={64} />
            </View>

            <Card variant="elevated" elevation="none" padding="medium" style={styles.card}>
              {step === 1 ? (
                <>
                  <Text variant="h3" bold centered style={styles.cardTitle}>
                    Bienvenue
                  </Text>
                  <Text variant="h3" bold centered style={styles.cardSubtitle}>
                    sur Factureo
                  </Text>

                  <Text variant="body2" color="secondary" centered style={styles.description}>
                    Créez votre compte rapidement et commencez à gérer vos factures, devis et
                    avoirs dès maintenant.
                  </Text>

                  {/* Informations personnelles  */}
                  <Input
                    label="Prénom"
                    placeholder="Votre prénom"
                    value={firstName}
                    onChangeText={setFirstName}
                    variant="outlined"
                    required
                    style={styles.input}
                  />

                  <Input
                    label="Nom"
                    placeholder="Votre nom"
                    value={lastName}
                    onChangeText={setLastName}
                    variant="outlined"
                    required
                    style={styles.input}
                  />

                  <Input
                    label="Email de contact"
                    placeholder="votre@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    variant="outlined"
                    required
                    style={styles.input}
                  />

                  <PhoneInput
                    label="Numéro de téléphone"
                    placeholder="6 12 34 56 78"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    required
                    style={styles.input}
                  />

                  <Input
                    label="Nom de votre entreprise"
                    placeholder="Nom de l'entreprise"
                    value={companyName}
                    onChangeText={setCompanyName}
                    variant="outlined"
                    required
                    style={styles.input}
                  />

                  <Input
                    label="Adresse"
                    placeholder="Votre adresse complète"
                    value={address}
                    onChangeText={setAddress}
                    variant="outlined"
                    required
                    style={styles.inputLast}
                  />

                  <Button
                    title="Suivant"
                    variant="tertiary"
                    size="large"
                    fullWidth
                    onPress={handleNext}
                    style={styles.submitButton}
                  />
                </>
              ) : (
                <>

                {/* Informations bancaires  */}
                  <Text variant="h4" bold style={styles.sectionTitle}>
                    Informations bancaires
                  </Text>
                  <View style={styles.secureRow}>
                    <Ionicons name="checkbox-outline"size={18} color={colors.success.main} />
                    <Text variant="caption" color="success" style={styles.secureText}>
                      vos données sont sécurisées
                    </Text>
                  </View>


                  <Input
                    label="Titulaires du compte"
                    placeholder="Ex: Nom du compte"
                    value={accountName}
                    onChangeText={setAccountName}
                    variant="outlined"
                    required
                    style={styles.input}
                  />

                  <Input
                    label="Nom de la banque"
                    placeholder="Ex: BNP Paribas"
                    value={bankName}
                    onChangeText={setBankName}
                    variant="outlined"
                    required
                    style={styles.input}
                  />

                  <Input
                    label="IBAN"
                    placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                    value={iban}
                    onChangeText={setIban}
                    variant="outlined"
                    required
                    style={styles.input}
                  />

                  <Input
                    label="BIC / SWIFT"
                    placeholder="BNPAFRPPXXX"
                    value={swift}
                    onChangeText={setSwift}
                    variant="outlined"
                    required
                    style={styles.inputLast}
                  />

                  <Button
                    title="Enregistrer"
                    variant="tertiary"
                    size="large"
                    fullWidth
                    loading={authLoading}
                    disabled={authLoading}
                    onPress={handleSubmit}
                    style={styles.submitButton}
                  />

                  <TouchableOpacity onPress={() => setStep(1)} style={styles.previousButton}>
                    <Text variant="body2" bold centered style={styles.previousText}>
                      Précédents
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Card>

            {step === 2 && (
              <View style={styles.mentions}>
                <Text variant="caption" bold centered style={styles.mentionsTitle}>
                  Mentions obligatoires
                </Text>
                <TouchableOpacity onPress={() => openLink('https://factureo.com/cgu')}>
                  <Text variant="caption" centered style={styles.mentionLink}>
                    Conditions générales d'utilisation
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openLink('https://factureo.com/rgpd')}>
                  <Text variant="caption" centered style={styles.mentionLink}>
                    Politique de confidentialité (RGPD)
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.pageLight,
  },
  safe: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing['3xl'],
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  backArrow: {
    fontSize: 28,
    color: colors.text.primary,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  card: {
    marginTop: spacing.base,
    marginBottom: spacing.base,
  },
  cardTitle: {
    marginBottom: 0,
  },
  cardSubtitle: {
    marginBottom: spacing.base,
  },
  description: {
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: 5,
  },
  inputLast: {
    marginBottom: 5,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 0,
  },
  sectionTitle: {
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    marginBottom: spacing.lg,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  secureText: {
    fontSize: 13,
  },
  subheading: {
    marginBottom: spacing.md,
  },
  previousButton: {
    marginTop: spacing.base,
    paddingVertical: spacing.sm,
  },
  previousText: {
    color: colors.text.primary,
    textDecorationLine: 'underline',
  },
  mentions: {
    marginTop: spacing.base,
  },
  mentionsTitle: {
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  mentionLink: {
    color: colors.info.main,
    marginBottom: spacing.xs,
  },
});
