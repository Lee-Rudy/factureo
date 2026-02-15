/**
 * Configuration des routes de l'application
 */

export type RootStackParamList = {
  Auth: undefined;
  Register: undefined;
  Login: undefined;
};

export const ROUTES = {
  AUTH: 'Auth' as const,
  REGISTER: 'Register' as const,
  LOGIN: 'Login' as const,
} as const;
