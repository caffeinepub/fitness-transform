import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Footprints, Flame, TrendingUp, Clock } from 'lucide-react';

interface WalkStatsProps {
  distance: number;
  duration: number;
  steps: number;
  calories: number;
  isTracking: boolean;
}

export default function WalkStats({ distance, duration, steps, calories, isTracking }: WalkStatsProps) {
  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(2);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <Card className={isTracking ? 'border-primary shadow-lg' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isTracking && (
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            )}
            {isTracking ? 'Tracking...' : 'Walk Stats'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Distance</p>
                <p className="text-2xl font-bold">{formatDistance(distance)} km</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-2xl font-bold">{formatDuration(duration)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Footprints className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Steps</p>
                <p className="text-2xl font-bold">{steps.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <Flame className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="text-2xl font-bold">{calories}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
