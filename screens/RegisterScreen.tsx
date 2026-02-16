/**
 * Écran d'inscription - Création de compte 
 * voir RegisterForm pour les détails des 2 étapes sur les formulaires
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, Button, Card, Input, Checkbox } from '../components';
import { colors, spacing } from '../theme';
import { useAuth } from '../src/ui/context/AuthContext';
import { RootStackParamList } from '../routes/routesConfig';
import { ROUTES } from '../routes/routesConfig';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { register, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async () => {
    if (!acceptTerms) {
      Alert.alert('Attention', 'Veuillez accepter les conditions générales.');
      return;
    }
    navigation.navigate(ROUTES.REGISTER_FORM);
  };

  const goToLogin = () => navigation.navigate(ROUTES.LOGIN);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            <View style={styles.logoWrap}>
              <Text variant="h1" style={styles.logoText}>
                FACTUREO
              </Text>
            </View>

            {/* effet shadow  */}
            <Card variant="elevated" elevation="none" padding="medium" style={styles.card}>
              <Text variant="h3" bold centered style={styles.cardTitle}>
                Inscription gratuite
              </Text>

              <Input
                label="Adresse email"
                placeholder="votre@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                variant="outlined"
                style={styles.inputEmail}
              />

              <Input
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                variant="outlined"
                style={styles.inputPassword}
              />

              <View style={styles.row}>
                <Checkbox checked={acceptTerms} onPress={() => setAcceptTerms(!acceptTerms)} />
                <Text
                  variant="body2"
                  color="secondary"
                  style={styles.termsText}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                >
                  En créant un compte, vous acceptez nos{' '}
                  <Text variant="body2" bold color="primary">
                    conditions générales d'utilisation.
                  </Text>
                </Text>
              </View>

              <Button
                title="Créer un compte"
                variant="primary"
                size="large"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                onPress={handleSubmit}
                style={styles.submitButton}
              />

              <Text variant="body2" color="secondary" style={styles.paragraph}>
                <Text variant="body2" bold color="primary">
                  Factureo
                </Text>{' '}
                vous permet de créer et gérer vos factures et devis facilement, de suivre vos
                paiements et de garder le contrôle sur votre activité en quelques clics.
              </Text>
            </Card>

            <View style={styles.footer}>
              <Text variant="body2" color="secondary">
                Vous avez déjà un compte ?{' '}
                <Text variant="body2" bold style={styles.link} onPress={goToLogin}>
                  Connectez-vous
                </Text>
              </Text>
            </View>
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
    paddingBottom: spacing.lg,
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
  logoText: {
    color: colors.tertiary.main,
  },
  card: {
    marginBottom: spacing.base,
  },
  cardTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 0,
  },
  inputEmail: {
    marginBottom: 5,
  },
  inputPassword: {
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 26,
    gap: spacing.base,
  },
  termsText: {
    flex: 1,
  },
  submitButton: {
    marginBottom: 26,
  },
  paragraph: {
    lineHeight: 21,
  },
  footer: {
    alignItems: 'center',
  },
  link: {
    color: colors.info.main,
  },
});
