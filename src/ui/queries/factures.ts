/**
 * TanStack Query Hooks - Factures
 * Hooks pour les opérations CRUD sur les factures
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { factureUseCases } from '../app/container';
import { queryKeys } from './keys';
import { Facture, FactureStatus } from '../../domain/entities/Facture';
import { CreateFactureDTO, UpdateFactureDTO } from '../../application/usecases/facture/FactureUseCases';

/**
 * Hook : Récupération de la liste des factures
 */
export const useFactures = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.factures.all(userId),
    queryFn: () => factureUseCases.list(userId),
    enabled: !!userId,
  });
};

/**
 * Hook : Récupération des factures par client
 */
export const useFacturesByClient = (clientId: string) => {
  return useQuery({
    queryKey: queryKeys.factures.byClient(clientId),
    queryFn: () => factureUseCases.listByClient(clientId),
    enabled: !!clientId,
  });
};

/**
 * Hook : Récupération d'une facture par ID
 */
export const useFacture = (id: string) => {
  return useQuery({
    queryKey: queryKeys.factures.detail(id),
    queryFn: () => factureUseCases.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook : Création d'une facture
 */
export const useCreateFacture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFactureDTO) => factureUseCases.create(data),
    onSuccess: (newFacture) => {
      // Invalide la liste des factures
      queryClient.invalidateQueries({ queryKey: queryKeys.factures.all(newFacture.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.factures.byClient(newFacture.clientId) });
    },
  });
};

/**
 * Hook : Mise à jour d'une facture
 */
export const useUpdateFacture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFactureDTO }) =>
      factureUseCases.update(id, data),
    onSuccess: (updatedFacture) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.factures.detail(updatedFacture.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.factures.all(updatedFacture.userId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.factures.byClient(updatedFacture.clientId),
      });
    },
  });
};

/**
 * Hook : Suppression d'une facture
 */
export const useDeleteFacture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => factureUseCases.delete(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.factures.all(variables.userId) });
    },
  });
};

/**
 * Hook : Marquer facture comme payée
 */
export const useMarkFactureAsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      factureUseCases.markAsPaid(id),
    onSuccess: (updatedFacture) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.factures.detail(updatedFacture.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.factures.all(updatedFacture.userId) });
    },
  });
};

/**
 * Hook : Changer le statut d'une facture (réversible)
 */
export const useUpdateFactureStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: FactureStatus }) =>
      factureUseCases.updateStatus(id, status),
    onSuccess: (updatedFacture) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.factures.detail(updatedFacture.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.factures.all(updatedFacture.userId) });
    },
  });
};
