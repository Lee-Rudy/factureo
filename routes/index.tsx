/**
 * Configuration de la navigation principale
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';
import { RootStackParamList, ROUTES } from './routesConfig';

// Screens
import AuthScreen from '../screens/AuthScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={ROUTES.AUTH}
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}
          >
            <Stack.Screen name={ROUTES.AUTH} component={AuthScreen} />
            
            {/* Ajoutez vos nouvelles routes ici */}
            {/* Example: <Stack.Screen name={ROUTES.HOME} component={HomeScreen} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
