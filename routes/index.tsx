/**
 * Configuration de la navigation principale
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from '../src/ui/app/AppProviders';
import { RootStackParamList, ROUTES } from './routesConfig';

// Screens
import AuthScreen from '../screens/AuthScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RegisterFormScreen from '../screens/RegisterForms/RegisterFormScreen';
import ClientsListScreen from '../screens/ClientsListScreen';
import FacturesListScreen from '../screens/FacturesListScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={ROUTES.AUTH}
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}
          >
            <Stack.Screen name={ROUTES.AUTH} component={AuthScreen} />
            <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
            <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
            <Stack.Screen name={ROUTES.DASHBOARD} component={DashboardScreen} />
            <Stack.Screen name={ROUTES.REGISTER_FORM} component={RegisterFormScreen} />
            <Stack.Screen name={ROUTES.CLIENTS_LIST} component={ClientsListScreen} />
            <Stack.Screen name={ROUTES.FACTURES_LIST} component={FacturesListScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProviders>
    </SafeAreaProvider>
  );
}
