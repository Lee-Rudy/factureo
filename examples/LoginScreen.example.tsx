/**
 * EXEMPLE - Écran de Connexion
 * Démontre l'utilisation des composants Input et Button
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GradientBackground, Text, Input, Button, Container } from '../components';
import { spacing, flexLayout } from '../theme';

export default function LoginScreenExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleLogin = () => {
    // Validation simple
    if (!email.includes('@')) {
      setEmailError('Email invalide');
      return;
    }
    
    setEmailError('');
    setLoading(true);
    
    // Simuler une connexion
    setTimeout(() => {
      setLoading(false);
      console.log('Connexion réussie');
    }, 2000);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text variant="h1" color="inverse" centered>
                FACTUREO
              </Text>
              <Text variant="h3" color="inverse" centered style={styles.subtitle}>
                Connexion
              </Text>
            </View>

            {/* Formulaire */}
            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="votre@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                }}
                error={emailError}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                variant="filled"
                required
              />
              
              <Input
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                variant="filled"
                required
              />

              <Text
                variant="caption"
                color="inverse"
                style={styles.forgotPassword}
              >
                Mot de passe oublié ?
              </Text>

              <Button
                title="SE CONNECTER"
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
                onPress={handleLogin}
                style={styles.loginButton}
              />

              <View style={[styles.signupSection, flexLayout.rowCenter]}>
                <Text variant="body2" color="inverse">
                  Pas encore de compte ?{' '}
                </Text>
                <Text variant="body2" color="inverse" bold>
                  S'inscrire
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing['4xl'],
  },
  header: {
    marginTop: spacing['3xl'],
    marginBottom: spacing['4xl'],
  },
  subtitle: {
    marginTop: spacing.base,
  },
  form: {
    gap: spacing.lg,
  },
  forgotPassword: {
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
  loginButton: {
    marginTop: spacing.base,
  },
  signupSection: {
    marginTop: spacing.xl,
    justifyContent: 'center',
  },
});
