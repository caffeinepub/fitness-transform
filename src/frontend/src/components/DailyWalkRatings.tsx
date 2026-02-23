import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useWalkRatings } from '@/hooks/useQueries';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import type { WalkRating } from '../backend';

export default function DailyWalkRatings() {
  const { data: ratings, isLoading, error } = useWalkRatings();

  const groupRatingsByDate = (ratings: WalkRating[]) => {
    try {
      const groups: { [key: string]: WalkRating[] } = {};
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      ratings.forEach((rating) => {
        if (!rating?.completionTimestamp) return;
        
        try {
          const ratingDate = new Date(Number(rating.completionTimestamp) / 1_000_000);
          ratingDate.setHours(0, 0, 0, 0);

          let dateKey: string;
          if (ratingDate.getTime() === today.getTime()) {
            dateKey = 'Today';
          } else if (ratingDate.getTime() === yesterday.getTime()) {
            dateKey = 'Yesterday';
          } else {
            dateKey = ratingDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            });
          }

          if (!groups[dateKey]) {
            groups[dateKey] = [];
          }
          groups[dateKey].push(rating);
        } catch (err) {
          console.error('[DailyWalkRatings] Error processing rating date:', err);
        }
      });

      return groups;
    } catch (err) {
      console.error('[DailyWalkRatings] Error grouping ratings:', err);
      return {};
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    console.error('[DailyWalkRatings] Error loading ratings:', error);
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Walk Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-center py-8">
            Error loading walk ratings. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!ratings || ratings.length === 0) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Walk Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No walk ratings yet. Complete a walk to add your first rating! 💪
          </p>
        </CardContent>
      </Card>
    );
  }

  const groupedRatings = groupRatingsByDate(ratings);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Walk Ratings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedRatings).map(([date, dateRatings]) => (
          <div key={date} className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">{date}</h3>
            <div className="space-y-2">
              {dateRatings?.map((rating, index) => {
                if (!rating) return null;
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Number(rating.rating || 0)
                                ? 'fill-primary text-primary'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <Badge variant={rating.walkType === 'Tracked' ? 'default' : 'secondary'}>
                        {rating.walkType || 'Unknown'}
                      </Badge>
                    </div>
                    {rating.completionTimestamp && (
                      <span className="text-sm text-muted-foreground">
                        {new Date(Number(rating.completionTimestamp) / 1_000_000).toLocaleTimeString(
                          'en-US',
                          {
                            hour: 'numeric',
                            minute: '2-digit',
                          }
                        )}
                      </span>
                    )}
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
