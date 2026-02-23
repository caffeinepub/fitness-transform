import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useProfile } from '../contexts/ProfileContext';
import type { WalkSession, Task, Exercise, Customization, RecommendedWalk, WalkRating } from '../backend';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

export function useWalkStats(profileId?: string) {
  const { actor, isFetching } = useActor();
  const { activeProfile } = useProfile();
  const effectiveProfileId = profileId || activeProfile;

  return useQuery({
    queryKey: ['walkStats', effectiveProfileId],
    queryFn: async () => {
      if (!actor) return null;
      
      console.log('[useWalkStats] Fetching stats for profile:', effectiveProfileId);
      
      try {
        const [totalSteps, totalCalories, walks] = await Promise.all([
          actor.getTotalSteps(effectiveProfileId),
          actor.getTotalCalories(effectiveProfileId),
          actor.getWalks(effectiveProfileId),
        ]);

        const totalDistance = walks.reduce((sum, walk) => sum + walk.distanceInMeters, 0) / 1000;
        const totalTime = walks.reduce((sum, walk) => sum + Number(walk.durationInSeconds), 0);

        return {
          totalSteps: Number(totalSteps),
          totalCalories: Number(totalCalories),
          totalDistance,
          totalTime,
          walks,
        };
      } catch (error) {
        console.error('[useWalkStats] Error fetching walk stats:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!effectiveProfileId,
  });
}

export function useSaveWalk() {
  const { actor } = useActor();
  const { activeProfile } = useProfile();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session: WalkSession) => {
      if (!actor) throw new Error('Actor not initialized');
      console.log('[useSaveWalk] Saving walk for profile:', activeProfile);
      await actor.trackWalk(activeProfile, session);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walkStats'] });
      queryClient.invalidateQueries({ queryKey: ['walkRatings'] });
      queryClient.invalidateQueries({ queryKey: ['walks'] });
    },
    onError: (error) => {
      console.error('[useSaveWalk] Error saving walk:', error);
    },
  });
}

export function useUploadPhoto() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (photoBlob: ExternalBlob) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.uploadPhoto(photoBlob);
    },
    onError: (error) => {
      console.error('[useUploadPhoto] Error uploading photo:', error);
    },
  });
}

export function useDailyTasks(profileId?: string) {
  const { actor, isFetching } = useActor();
  const { activeProfile } = useProfile();
  const effectiveProfileId = profileId || activeProfile;

  return useQuery<Task[]>({
    queryKey: ['dailyTasks', effectiveProfileId],
    queryFn: async () => {
      if (!actor) return [];
      
      console.log('[useDailyTasks] Fetching tasks for profile:', effectiveProfileId);
      
      try {
        return await actor.getDailyTasks(effectiveProfileId);
      } catch (error) {
        console.error('[useDailyTasks] Error fetching tasks:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!effectiveProfileId,
  });
}

export function useCompleteTask() {
  const { actor } = useActor();
  const { activeProfile } = useProfile();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      console.log('[useCompleteTask] Completing task:', taskId, 'for profile:', activeProfile);
      return actor.setTaskCompleted(activeProfile, taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyTasks'] });
    },
    onError: (error) => {
      console.error('[useCompleteTask] Error completing task:', error);
    },
  });
}

export function useExercisesByCategory(category: string) {
  const { actor, isFetching } = useActor();
  const { activeProfile } = useProfile();

  return useQuery<Exercise[]>({
    queryKey: ['exercises', category, activeProfile],
    queryFn: async () => {
      if (!actor) return [];
      
      console.log('[useExercisesByCategory] Fetching exercises for category:', category);
      
      try {
        return await actor.getExercisesByCategory(activeProfile, category);
      } catch (error) {
        console.error('[useExercisesByCategory] Error fetching exercises:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useCustomizations(profileId?: string) {
  const { actor, isFetching } = useActor();
  const { activeProfile } = useProfile();
  const effectiveProfileId = profileId || activeProfile;

  return useQuery<Customization>({
    queryKey: ['customizations', effectiveProfileId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      
      console.log('[useCustomizations] Fetching customizations for profile:', effectiveProfileId);
      
      try {
        return await actor.getCustomizations(effectiveProfileId);
      } catch (error) {
        console.error('[useCustomizations] Error fetching customizations:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!effectiveProfileId,
  });
}

export function useSaveCustomizations() {
  const { actor } = useActor();
  const { activeProfile } = useProfile();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fontSize, backgroundMusic }: { fontSize: bigint; backgroundMusic: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      console.log('[useSaveCustomizations] Saving customizations for profile:', activeProfile);
      await actor.setCustomizations(activeProfile, fontSize, backgroundMusic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customizations'] });
      toast.success('Settings saved successfully!');
    },
    onError: (error) => {
      console.error('[useSaveCustomizations] Error saving customizations:', error);
      toast.error('Failed to save settings');
    },
  });
}

export function useRecommendedWalks(profileId?: string) {
  const { actor, isFetching } = useActor();
  const { activeProfile } = useProfile();
  const effectiveProfileId = profileId || activeProfile;

  return useQuery<RecommendedWalk[]>({
    queryKey: ['recommendedWalks', effectiveProfileId],
    queryFn: async () => {
      if (!actor) return [];
      
      console.log('[useRecommendedWalks] Fetching recommended walks for profile:', effectiveProfileId);
      
      try {
        return await actor.getRecommendedWalks(effectiveProfileId);
      } catch (error) {
        console.error('[useRecommendedWalks] Error fetching recommended walks:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!effectiveProfileId,
  });
}

export function useFilteredWalks(
  userLocation: { latitude: number; longitude: number } | null,
  maxDistance: number
) {
  const { actor, isFetching } = useActor();
  const { activeProfile } = useProfile();

  return useQuery<RecommendedWalk[]>({
    queryKey: ['filteredWalks', userLocation, maxDistance, activeProfile],
    queryFn: async () => {
      if (!actor || !userLocation) return [];
      
      console.log('[useFilteredWalks] Filtering walks for profile:', activeProfile);
      
      try {
        return await actor.filterWalksByLocation(activeProfile, userLocation, maxDistance);
      } catch (error) {
        console.error('[useFilteredWalks] Error filtering walks:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!userLocation,
  });
}

export function useMarkWalkFavourite() {
  const { actor } = useActor();
  const { activeProfile } = useProfile();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (walkId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      console.log('[useMarkWalkFavourite] Marking walk as favourite:', walkId);
      await actor.markWalkFavourite(activeProfile, walkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendedWalks'] });
      queryClient.invalidateQueries({ queryKey: ['filteredWalks'] });
    },
    onError: (error) => {
      console.error('[useMarkWalkFavourite] Error marking walk as favourite:', error);
    },
  });
}

export function useMarkWalkCompleted() {
  const { actor } = useActor();
  const { activeProfile } = useProfile();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ walkId, rating }: { walkId: bigint; rating?: WalkRating }) => {
      if (!actor) throw new Error('Actor not initialized');
      console.log('[useMarkWalkCompleted] Marking walk as completed:', walkId);
      await actor.markWalkCompleted(activeProfile, walkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendedWalks'] });
      queryClient.invalidateQueries({ queryKey: ['filteredWalks'] });
      queryClient.invalidateQueries({ queryKey: ['walkRatings'] });
    },
    onError: (error) => {
      console.error('[useMarkWalkCompleted] Error marking walk as completed:', error);
    },
  });
}

export function useWalkRatings(profileId?: string) {
  const { actor, isFetching } = useActor();
  const { activeProfile } = useProfile();
  const effectiveProfileId = profileId || activeProfile;

  return useQuery<WalkRating[]>({
    queryKey: ['walkRatings', effectiveProfileId],
    queryFn: async () => {
      if (!actor) return [];
      
      console.log('[useWalkRatings] Fetching walk ratings for profile:', effectiveProfileId);
      
      try {
        const walks = await actor.getWalks(effectiveProfileId);
        const ratings: WalkRating[] = [];
        
        walks.forEach((walk) => {
          if (walk?.rating) {
            ratings.push(walk.rating);
          }
        });

        return ratings.sort((a, b) => Number(b.completionTimestamp) - Number(a.completionTimestamp));
      } catch (error) {
        console.error('[useWalkRatings] Error fetching walk ratings:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!effectiveProfileId,
  });
}

// Partner page specific hooks
export function useWalksByProfile(profileId: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['walks', profileId],
    queryFn: async () => {
      if (!actor || !profileId) return [];
      
      console.log('[useWalksByProfile] Fetching walks for profile:', profileId);
      
      try {
        return await actor.getWalks(profileId);
      } catch (error) {
        console.error('[useWalksByProfile] Error fetching walks:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!profileId,
  });
}

export function useTasksByProfile(profileId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['tasks', profileId],
    queryFn: async () => {
      if (!actor || !profileId) return [];
      
      console.log('[useTasksByProfile] Fetching tasks for profile:', profileId);
      
      try {
        return await actor.getDailyTasks(profileId);
      } catch (error) {
        console.error('[useTasksByProfile] Error fetching tasks:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!profileId,
  });
}

export function useWalkRatingsByProfile(profileId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<WalkRating[]>({
    queryKey: ['walkRatings', profileId],
    queryFn: async () => {
      if (!actor || !profileId) return [];
      
      console.log('[useWalkRatingsByProfile] Fetching walk ratings for profile:', profileId);
      
      try {
        const walks = await actor.getWalks(profileId);
        const ratings: WalkRating[] = [];
        
        walks.forEach((walk) => {
          if (walk?.rating) {
            ratings.push(walk.rating);
          }
        });

        return ratings.sort((a, b) => Number(b.completionTimestamp) - Number(a.completionTimestamp));
      } catch (error) {
        console.error('[useWalkRatingsByProfile] Error fetching walk ratings:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching && !!profileId,
  });
}
