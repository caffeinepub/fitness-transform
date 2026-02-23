import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Square, MapPin } from 'lucide-react';
import MapView from '@/components/MapView';
import WalkStats from '@/components/WalkStats';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useSaveWalk } from '@/hooks/useQueries';
import { toast } from 'sonner';

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

  const handleStart = () => {
    startTracking();
    toast.success('Walk tracking started!');
  };

  const handleStop = async () => {
    const session = stopTracking();
    if (session) {
      await saveWalk.mutateAsync(session);
      toast.success('Walk saved successfully!');
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="container py-8 px-4 max-w-7xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Track Your Walk</h1>
            <p className="text-muted-foreground">
              Start tracking to see your route and stats in real-time
            </p>
          </div>
          
          <div className="flex gap-3">
            {!isTracking ? (
              <Button 
                size="lg" 
                onClick={handleStart}
                className="gap-2 shadow-lg"
              >
                <Play className="h-5 w-5" />
                Start Walk
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="destructive"
                onClick={handleStop}
                className="gap-2 shadow-lg"
              >
                <Square className="h-5 w-5" />
                Stop Walk
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Route Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <MapView coordinates={coordinates} isTracking={isTracking} />
              </CardContent>
            </Card>
          </div>

          <div>
            <WalkStats
              distance={distance}
              duration={duration}
              steps={steps}
              calories={calories}
              isTracking={isTracking}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
