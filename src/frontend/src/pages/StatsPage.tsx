import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Footprints, Flame, Activity } from 'lucide-react';
import { useWalkStats } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function StatsPage() {
  const { walks, totalSteps, totalCalories, isLoading } = useWalkStats();

  const totalDistance = walks?.reduce((sum, walk) => sum + walk.distanceInMeters, 0) || 0;
  const totalDuration = walks?.reduce((sum, walk) => sum + Number(walk.durationInSeconds), 0) || 0;

  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(2);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="container py-8 px-4 max-w-7xl">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 max-w-7xl">
      {/* Hidden compliments */}
      <div className="hidden-compliment top-32 left-16">so strong</div>

      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your fitness journey and celebrate your achievements
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Footprints className="h-4 w-4" />
                Total Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {Number(totalSteps).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10 hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Calories Burned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {Number(totalCalories).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10 hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Distance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">
                {formatDistance(totalDistance)} km
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Total Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatDuration(totalDuration)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Walks</CardTitle>
          </CardHeader>
          <CardContent>
            {walks && walks.length > 0 ? (
              <div className="space-y-4">
                {walks.map((walk, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">Walk #{walks.length - index}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistance(walk.distanceInMeters)} km • {formatDuration(Number(walk.durationInSeconds))}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm font-medium">
                        {Number(walk.steps).toLocaleString()} steps
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Number(walk.caloriesBurned)} cal
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No walks recorded yet. Start tracking to see your progress!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
