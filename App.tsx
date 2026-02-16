import React from 'react';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import Routes from './routes';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    'CocoSharp-Bold': require('./assets/fonts/Coco-Sharp-Bold-trial.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return <Routes />;
}
