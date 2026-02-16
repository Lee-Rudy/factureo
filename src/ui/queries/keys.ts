/**
 * TanStack Query Keys - Organisation centralisée des clés de cache
 */

export const queryKeys = {
  auth: {
    currentUser: ['auth', 'currentUser'] as const,
  },
  clients: {
    all: (userId: string) => ['clients', userId] as const,
    detail: (id: string) => ['clients', 'detail', id] as const,
  },
  factures: {
    all: (userId: string) => ['factures', userId] as const,
    byClient: (clientId: string) => ['factures', 'client', clientId] as const,
    detail: (id: string) => ['factures', 'detail', id] as const,
  },
} as const;
