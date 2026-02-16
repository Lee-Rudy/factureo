/**
 * Écran de connexion
 * mail + mdp
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button, Card, Input, Logo } from '../components';
import { colors, spacing } from '../theme';
import { useAuth } from '../src/ui/context/AuthContext';
import { RootStackParamList, ROUTES } from '../routes/routesConfig';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const iconSize = 22;
const iconColor = colors.text.secondary;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      await login(email, password);
      navigation.navigate(ROUTES.DASHBOARD);
    } catch {
      Alert.alert('Erreur', 'Échec de la connexion.');
    }
  };

  const goToRegister = () => navigation.navigate(ROUTES.REGISTER);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            <View style={styles.logoWrap}>
              <Logo width={200} height={64} />
            </View>

            <Card variant="elevated" elevation="none" padding="medium" style={styles.card}>
              <Text variant="h3" bold centered style={styles.cardTitle}>
                Se connecter
              </Text>

              <Input
                label="Adresse email"
                placeholder="votre@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                variant="outlined"
                rightIcon={<Ionicons name="mail-outline" size={iconSize} color={iconColor} />}
                style={styles.inputEmail}
              />

              <Input
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                variant="outlined"
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={iconSize}
                      color={iconColor}
                    />
                  </TouchableOpacity>
                }
                style={styles.inputPassword}
              />

              <TouchableOpacity
                style={styles.forgotWrap}
                onPress={() => {}}
                disabled
              >
                <Text variant="body2" style={styles.forgotLink}>
                  Mot de passe oublié ?
                </Text>
              </TouchableOpacity>

              <Button
                title="Se connecter"
                variant="gradient"
                size="large"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                onPress={handleSubmit}
                style={styles.submitButton}
              />

              <Text variant="caption" color="secondary" centered style={styles.orText}>
                ou connecter vous avec
              </Text>

              <View style={styles.socialRow}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => {}}
                  activeOpacity={0.7}
                >
                  <Ionicons name="logo-google" size={20} color="#4285F4" />
                  <Text variant="body2" style={styles.socialLabel}>
                    Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => {}}
                  activeOpacity={0.7}
                >
                  <Ionicons name="logo-apple" size={22} color={colors.text.primary} />
                  <Text variant="body2" style={styles.socialLabel}>
                    Apple
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>

            <View style={styles.footer}>
              <Text variant="body2" color="secondary">
                Vous n'avez pas de compte ?{' '}
                <Text variant="body2" bold style={styles.link} onPress={goToRegister}>
                  Inscrivez-vous
                </Text>
              </Text>
            </View>
          </View>
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
  content: {
    flex: 1,
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
  card: {
    marginBottom: spacing.base,
  },
  cardTitle: {
    marginBottom: 16,
  },
  inputEmail: {
    marginBottom: 8,
  },
  inputPassword: {
    marginBottom: 4,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotLink: {
    color: colors.text.secondary,
  },
  submitButton: {
    marginBottom: 20,
  },
  orText: {
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 44,
    backgroundColor: colors.surface.primary,
    borderWidth: 1,
    borderColor: colors.border.main,
    borderRadius: 12,
  },
  socialLabel: {
    color: colors.text.primary,
  },
  footer: {
    alignItems: 'center',
  },
  link: {
    color: colors.info.main,
  },
});
