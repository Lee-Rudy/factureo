/**
 * Configuration des routes de l'application
 */

export type RootStackParamList = {
  Auth: undefined;
  Register: undefined;
};

export const ROUTES = {
  AUTH: 'Auth' as const,
  REGISTER: 'Register' as const,
} as const;
