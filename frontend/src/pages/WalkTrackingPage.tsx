import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Square, MapPin, Compass, TrendingUp } from 'lucide-react';
import MapView from '@/components/MapView';
import WalkStats from '@/components/WalkStats';
import RecommendedWalkCard from '@/components/RecommendedWalkCard';
import WalkRatingModal from '@/components/WalkRatingModal';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useSaveWalk, useFilteredWalks } from '@/hooks/useQueries';
import type { RecommendedWalk, WalkSession } from '../backend';
import { WalkType } from '../backend';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function WalkTrackingPage() {
  const {
    isTracking,
    coordinates,
    distance,
    duration,
    steps,
    calories,
    startTracking,
    stopTracking,
    error,
  } = useLocationTracking();

  const saveWalk = useSaveWalk();
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [pendingWalkSession, setPendingWalkSession] = useState<WalkSession | null>(null);

  // Get user's current location for recommendations
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.error('Location error:', err);
        }
      );
    }
  }, []);

  const { data: recommendedWalks, isLoading: isLoadingWalks } = useFilteredWalks(currentLocation, 10);

  const handleStart = () => {
    startTracking();
    toast.success('Walk tracking started!');
  };

  const handleStop = () => {
    stopTracking();
    
    const session: WalkSession = {
      steps: BigInt(steps),
      caloriesBurned: BigInt(calories),
      distanceInMeters: distance,
      durationInSeconds: BigInt(duration),
      rating: undefined,
    };

    setPendingWalkSession(session);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = (rating: number) => {
    if (pendingWalkSession) {
      const sessionWithRating: WalkSession = {
        ...pendingWalkSession,
        rating: {
          rating: BigInt(rating),
          completionTimestamp: BigInt(Date.now() * 1_000_000),
          walkType: WalkType.Tracked,
        },
      };

      saveWalk.mutate(sessionWithRating, {
        onSuccess: () => {
          toast.success('Walk saved successfully!');
          setShowRatingModal(false);
          setPendingWalkSession(null);
        },
        onError: () => {
          toast.error('Failed to save walk');
        },
      });
    }
  };

  const handleRatingClose = () => {
    if (pendingWalkSession) {
      saveWalk.mutate(pendingWalkSession, {
        onSuccess: () => {
          toast.success('Walk saved!');
          setShowRatingModal(false);
          setPendingWalkSession(null);
        },
        onError: () => {
          toast.error('Failed to save walk');
        },
      });
    } else {
      setShowRatingModal(false);
    }
  };

  const handleTrackNow = (walk: RecommendedWalk) => {
    toast.info(`Starting navigation to ${walk.name}...`);
    // In a real app, this would open navigation to the walk location
    // For now, we'll just show a message
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Walking Tracker</h1>
        </div>
        <p className="text-muted-foreground text-center max-w-2xl">
          Track your walks in real-time or explore recommended routes nearby
        </p>
      </div>

      <Tabs defaultValue="tracking" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tracking" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Live Tracking
          </TabsTrigger>
          <TabsTrigger value="recommended" className="gap-2">
            <Compass className="h-4 w-4" />
            Recommended Walks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Track Your Walk</span>
                <Button
                  onClick={isTracking ? handleStop : handleStart}
                  variant={isTracking ? 'destructive' : 'default'}
                  size="lg"
                  className="gap-2"
                >
                  {isTracking ? (
                    <>
                      <Square className="h-5 w-5" />
                      Stop Tracking
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Start Tracking
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              <MapView coordinates={coordinates} isTracking={isTracking} />
              <WalkStats
                distance={distance}
                duration={duration}
                steps={steps}
                calories={calories}
                isTracking={isTracking}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Nearby Walking Routes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingWalks ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
                </div>
              ) : !recommendedWalks || recommendedWalks.length === 0 ? (
                <div className="text-center py-12">
                  <Compass className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No recommended walks found nearby. Try adjusting your location settings.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {recommendedWalks.map((walk) => (
                    <RecommendedWalkCard 
                      key={Number(walk.id)} 
                      walk={walk} 
                      onTrackNow={handleTrackNow}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <WalkRatingModal
        isOpen={showRatingModal}
        walkType="Tracked"
        onRatingSubmit={handleRatingSubmit}
        onClose={handleRatingClose}
      />
    </div>
  );
}
