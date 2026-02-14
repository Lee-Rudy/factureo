/**
 * Écran d'Authentification
 * Page d'accueil de l'application avec options de connexion et création de compte
 */

import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GradientBackground, Text, Button } from '../components';
import { spacing } from '../theme';
import { useAuth } from '../contexts/AuthContext';

const { height } = Dimensions.get('window');

export default function AuthScreen() {
  const { login, isLoading } = useAuth();
  const [mode, setMode] = useState<'welcome' | 'login' | 'register'>('welcome');

  const handleCreateAccount = () => {
    setMode('register');
  };

  const handleLogin = () => {
    setMode('login');
  };

  const handleLoginSubmit = async () => {
    try {
      await login('test@example.com', 'password');
      Alert.alert('Succès', 'Connexion réussie !');
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la connexion');
    }
  };

  return (
    <GradientBackground direction="horizontal">
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Section Logo */}
          <View style={styles.logoSection}>
            <Text variant="h1" color="inverse" centered bold>
              FACTUREO
            </Text>
          </View>

          {/* Section Titre Principal */}
          <View style={styles.titleSection}>
            <Text variant="h2" color="inverse" centered bold style={styles.titleText}>
              GÉREZ VOS
            </Text>
            <Text variant="h2" color="inverse" centered bold style={styles.titleText}>
              FACTURES
            </Text>
            <Text variant="h2" color="inverse" centered bold style={styles.titleText}>
              SIMPLEMENT
            </Text>
          </View>

          {/* Section Boutons */}
          <View style={styles.buttonSection}>
            <Button
              title="CRÉER UN COMPTE"
              variant="secondary"
              size="large"
              fullWidth
              loading={isLoading && mode === 'register'}
              disabled={isLoading}
              onPress={handleCreateAccount}
            />
            
            <View style={styles.loginButtonContainer}>
              <Button
                title="CONNEXION"
                variant="secondary"
                size="large"
                fullWidth
                borderColor="#FFFFFF"
                textColor="#FFFFFF"
                loading={isLoading && mode === 'login'}
                disabled={isLoading}
                onPress={handleLogin}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['4xl'],
    justifyContent: 'space-between',
    paddingTop: height * 0.15,
    paddingBottom: height * 0.1,
  },
  logoSection: {
    alignItems: 'center',
  },
  titleSection: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  titleText: {
    letterSpacing: 1,
  },
  buttonSection: {
    gap: spacing.lg,
  },
  loginButtonContainer: {
    marginTop: spacing.sm,
  },
});
