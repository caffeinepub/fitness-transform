import { Activity, Clock, Footprints, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { useWalksByProfile } from '@/hooks/useQueries';

interface PartnerWalkHistoryProps {
  profileId: string;
}

export default function PartnerWalkHistory({ profileId }: PartnerWalkHistoryProps) {
  const { data: walks, isLoading, error } = useWalksByProfile(profileId);

  if (isLoading) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Walk History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('[PartnerWalkHistory] Error loading walks:', error);
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Walk History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-center py-8">
            Error loading walk history. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!walks || walks.length === 0) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Walk History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No walks recorded yet. Start tracking to see walk history! 🚶‍♀️
          </p>
        </CardContent>
      </Card>
    );
  }

  const groupWalksByDate = () => {
    try {
      const groups: { [key: string]: typeof walks } = {};
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      walks.forEach((walk) => {
        if (!walk) return;
        
        try {
          const walkDate = walk.rating?.completionTimestamp
            ? new Date(Number(walk.rating.completionTimestamp) / 1_000_000)
            : new Date();
          walkDate.setHours(0, 0, 0, 0);

          let dateKey: string;
          if (walkDate.getTime() === today.getTime()) {
            dateKey = 'Today';
          } else if (walkDate.getTime() === yesterday.getTime()) {
            dateKey = 'Yesterday';
          } else {
            dateKey = walkDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            });
          }

          if (!groups[dateKey]) {
            groups[dateKey] = [];
          }
          groups[dateKey].push(walk);
        } catch (err) {
          console.error('[PartnerWalkHistory] Error processing walk date:', err);
        }
      });

      return groups;
    } catch (err) {
      console.error('[PartnerWalkHistory] Error grouping walks:', err);
      return {};
    }
  };

  const groupedWalks = groupWalksByDate();

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Walk History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedWalks).map(([date, dateWalks]) => (
          <div key={date} className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">{date}</h3>
            <div className="space-y-3">
              {dateWalks?.map((walk, index) => {
                if (!walk) return null;
                
                return (
                  <div
                    key={index}
                    className="p-4 bg-muted/30 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant={walk.rating?.walkType === 'Tracked' ? 'default' : 'secondary'}>
                        {walk.rating?.walkType || 'Tracked'}
                      </Badge>
                      {walk.rating?.completionTimestamp && (
                        <span className="text-sm text-muted-foreground">
                          {new Date(Number(walk.rating.completionTimestamp) / 1_000_000).toLocaleTimeString(
                            'en-US',
                            {
                              hour: 'numeric',
                              minute: '2-digit',
                            }
                          )}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-semibold">
                            {Math.floor(Number(walk.durationInSeconds || 0) / 60)}m
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Distance</p>
                          <p className="font-semibold">
                            {((walk.distanceInMeters || 0) / 1000).toFixed(2)} km
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Footprints className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Steps</p>
                          <p className="font-semibold">{Number(walk.steps || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Calories</p>
                          <p className="font-semibold">{Number(walk.caloriesBurned || 0)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
