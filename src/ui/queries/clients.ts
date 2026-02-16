/**
 * TanStack Query Hooks - Clients
 * Hooks pour les opérations CRUD sur les clients
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientUseCases } from '../app/container';
import { queryKeys } from './keys';
import { Client } from '../../domain/entities/Client';
import { CreateClientDTO, UpdateClientDTO } from '../../application/usecases/client/ClientUseCases';

/**
 * Hook : Récupération de la liste des clients
 */
export const useClients = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.clients.all(userId),
    queryFn: () => clientUseCases.list(userId),
    enabled: !!userId,
  });
};

/**
 * Hook : Récupération d'un client par ID
 */
export const useClient = (id: string) => {
  return useQuery({
    queryKey: queryKeys.clients.detail(id),
    queryFn: () => clientUseCases.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook : Création d'un client
 */
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientDTO) => clientUseCases.create(data),
    onSuccess: (newClient) => {
      // Invalide la liste des clients pour refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all(newClient.userId) });
    },
  });
};

/**
 * Hook : Mise à jour d'un client
 */
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientDTO }) =>
      clientUseCases.update(id, data),
    onSuccess: (updatedClient) => {
      // Invalide le cache du client et de la liste
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.detail(updatedClient.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all(updatedClient.userId) });
    },
  });
};

/**
 * Hook : Suppression d'un client
 */
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => clientUseCases.delete(id),
    onSuccess: (_, variables) => {
      // Invalide la liste des clients
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all(variables.userId) });
    },
  });
};
