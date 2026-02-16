/**
 * Écran d'Authentification
 * Page d'accueil de l'application avec options de connexion et création de compte
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GradientBackground, Logo, Text, Button } from '../components';
import { spacing } from '../theme';
import { ROUTES } from '../routes/routesConfig';
import { RootStackParamList } from '../routes/routesConfig';

const { height } = Dimensions.get('window');

export default function AuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleCreateAccount = () => {
    navigation.navigate(ROUTES.REGISTER);
  };

  const handleLogin = () => {
    navigation.navigate(ROUTES.LOGIN);
  };

  return (
    <GradientBackground direction="horizontal">
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Section Logo */}
          <View style={styles.logoSection}>
            <Logo width={290} height={90} />
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
              variant="tertiary"
              size="large"
              fullWidth
              onPress={handleCreateAccount}
            />
            
            <View style={styles.loginButtonContainer}>
              <Button
                title="CONNEXION"
                variant="outline"
                size="large"
                fullWidth
                borderColor="#FFFFFF"
                textColor="#FFFFFF"
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
