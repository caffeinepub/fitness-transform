import { TrendingUp, Footprints, Flame, Activity, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWalkStats } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function StatsPage() {
  const { data, isLoading } = useWalkStats();

  if (isLoading) {
    return (
      <div className="container py-8 space-y-8">
        <Skeleton className="h-12 w-64 mx-auto" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const totalSteps = data?.totalSteps || 0;
  const totalCalories = data?.totalCalories || 0;
  const totalDistance = data?.totalDistance || 0;
  const totalTime = data?.totalTime || 0;
  const walks = data?.walks || [];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Your Statistics</h1>
        </div>
        <p className="text-muted-foreground text-center max-w-2xl">
          Track your progress and celebrate your achievements
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Steps</CardTitle>
            <Footprints className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSteps.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all walks</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
            <Flame className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCalories.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total energy burned</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distance</CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalDistance.toFixed(2)} km</div>
            <p className="text-xs text-muted-foreground mt-1">Total distance covered</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time</CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatTime(totalTime)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total walking time</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Recent Walks</CardTitle>
        </CardHeader>
        <CardContent>
          {walks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No walks recorded yet. Start tracking to see your history!
            </p>
          ) : (
            <div className="space-y-4">
              {walks.slice(0, 10).map((walk, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={walk.rating?.walkType === 'Tracked' ? 'default' : 'secondary'}>
                        {walk.rating?.walkType || 'Tracked'}
                      </Badge>
                      {walk.rating && (
                        <span className="text-sm text-muted-foreground">
                          {new Date(Number(walk.rating.completionTimestamp) / 1_000_000).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Footprints className="h-4 w-4 text-primary" />
                        {Number(walk.steps).toLocaleString()} steps
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="h-4 w-4 text-primary" />
                        {(walk.distanceInMeters / 1000).toFixed(2)} km
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-primary" />
                        {Number(walk.caloriesBurned)} cal
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {Math.floor(Number(walk.durationInSeconds) / 60)} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
