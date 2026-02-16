/**
 * Configuration des routes de l'application
 */

export type RootStackParamList = {
  Auth: undefined;
  Register: undefined;
  Login: undefined;
  Dashboard: undefined;
  RegisterForm: undefined;
  ClientsList: undefined;
  FacturesList: undefined;

  // page: undefined , pour enmpêcher des valeurs et ne pas crasher l'app en runtime (garder undefined)
};

export const ROUTES = {
  AUTH: 'Auth' as const,
  REGISTER: 'Register' as const,
  LOGIN: 'Login' as const,
  DASHBOARD: 'Dashboard' as const,
  REGISTER_FORM: 'RegisterForm' as const,
  CLIENTS_LIST: 'ClientsList' as const,
  FACTURES_LIST: 'FacturesList' as const,
} as const;
