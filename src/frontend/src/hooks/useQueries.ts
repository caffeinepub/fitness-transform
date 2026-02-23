import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { WalkSession, Task, Exercise, Customization } from '../backend';
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

export function useDailyTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['dailyTasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDailyTasks();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60000, // Refetch every minute to check for midnight reset
  });
}

export function useSetTaskCompleted() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.setTaskCompleted(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyTasks'] });
    },
  });
}

export function useExercisesByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Exercise[]>({
    queryKey: ['exercises', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExercisesByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useCustomizations() {
  const { actor, isFetching } = useActor();

  return useQuery<Customization>({
    queryKey: ['customizations'],
    queryFn: async () => {
      if (!actor) return { fontSize: BigInt(16), backgroundMusic: '' };
      return actor.getCustomizations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetCustomizations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fontSize, backgroundMusic }: { fontSize: bigint; backgroundMusic: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.setCustomizations(fontSize, backgroundMusic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customizations'] });
    },
  });
}
