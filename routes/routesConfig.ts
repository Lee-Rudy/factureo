/**
 * Configuration des routes de l'application
 */

export type RootStackParamList = {
  Auth: undefined;
  // Ajoutez vos nouvelles routes ici
  // Example: Home: undefined;
  // Example: Profile: { userId: string };
};

export const ROUTES = {
  AUTH: 'Auth' as const,
  // Ajoutez vos nouvelles routes ici
  // Example: HOME: 'Home' as const,
} as const;
