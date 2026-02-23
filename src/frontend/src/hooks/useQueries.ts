import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { WalkSession } from '../backend';
import { ExternalBlob } from '../backend';

export function useWalkStats() {
  const { actor, isFetching } = useActor();

  const walksQuery = useQuery({
    queryKey: ['walks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWalks();
    },
    enabled: !!actor && !isFetching,
  });

  const stepsQuery = useQuery({
    queryKey: ['totalSteps'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalSteps();
    },
    enabled: !!actor && !isFetching,
  });

  const caloriesQuery = useQuery({
    queryKey: ['totalCalories'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalCalories();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    walks: walksQuery.data,
    totalSteps: stepsQuery.data,
    totalCalories: caloriesQuery.data,
    isLoading: walksQuery.isLoading || stepsQuery.isLoading || caloriesQuery.isLoading,
  };
}

export function useSaveWalk() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session: WalkSession) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.trackWalk(session);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walks'] });
      queryClient.invalidateQueries({ queryKey: ['totalSteps'] });
      queryClient.invalidateQueries({ queryKey: ['totalCalories'] });
    },
  });
}

export function useUploadPhoto() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (photo: ExternalBlob) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.uploadPhoto(photo);
    },
  });
}
