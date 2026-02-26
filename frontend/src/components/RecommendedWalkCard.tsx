import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Clock, TrendingUp, Flame, Heart, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import type { RecommendedWalk } from '../backend';
import { useMarkWalkFavourite, useMarkWalkCompleted } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { useState } from 'react';
import WalkRatingModal from './WalkRatingModal';
import { WalkType } from '../backend';

interface RecommendedWalkCardProps {
  walk: RecommendedWalk;
  onTrackNow: (walk: RecommendedWalk) => void;
}

export default function RecommendedWalkCard({ walk, onTrackNow }: RecommendedWalkCardProps) {
  const markFavourite = useMarkWalkFavourite();
  const markCompleted = useMarkWalkCompleted();
  const [showRatingModal, setShowRatingModal] = useState(false);

  const estimatedTime = Math.round((walk.distance / 5) * 60); // Assuming 5 km/h walking speed
  const estimatedCalories = Math.round(walk.distance * 50); // Rough estimate

  const getDifficultyColor = (distance: number) => {
    if (distance < 2) return 'bg-green-500/20 text-green-400';
    if (distance < 5) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-red-500/20 text-red-400';
  };

  const getDifficultyLabel = (distance: number) => {
    if (distance < 2) return 'Easy';
    if (distance < 5) return 'Moderate';
    return 'Challenging';
  };

  const handleFavourite = async () => {
    try {
      await markFavourite.mutateAsync(walk.id);
      toast.success('Added to favorites! ❤️');
    } catch (error) {
      toast.error('Failed to add to favorites');
    }
  };

  const handleComplete = () => {
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (rating: number) => {
    try {
      await markCompleted.mutateAsync({
        walkId: walk.id,
        rating: {
          rating: BigInt(rating),
          completionTimestamp: BigInt(Date.now() * 1_000_000),
          walkType: WalkType.Recommended,
        },
      });
      toast.success('Walk completed with rating! 🎉');
      setShowRatingModal(false);
    } catch (error) {
      toast.error('Failed to mark walk as completed');
    }
  };

  const handleRatingClose = async () => {
    try {
      await markCompleted.mutateAsync({
        walkId: walk.id,
        rating: undefined,
      });
      toast.success('Walk marked as completed!');
      setShowRatingModal(false);
    } catch (error) {
      toast.error('Failed to mark walk as completed');
    }
  };

  return (
    <>
      <Card className="border-primary/20 hover:border-primary/40 transition-all">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{walk.name}</CardTitle>
              <p className="text-muted-foreground">{walk.description}</p>
            </div>
            <div className="flex gap-2">
              {walk.isFavourite && (
                <Badge variant="secondary" className="gap-1">
                  <Heart className="h-3 w-3 fill-current" />
                  Favorite
                </Badge>
              )}
              {walk.isCompleted && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Distance</p>
                <p className="font-semibold">{walk.distance.toFixed(1)} km</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Est. Time</p>
                <p className="font-semibold">{estimatedTime} min</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Difficulty</p>
                <Badge className={getDifficultyColor(walk.distance)}>
                  {getDifficultyLabel(walk.distance)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="font-semibold">~{estimatedCalories}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              onClick={() => onTrackNow(walk)}
              className="gap-2"
              disabled={walk.isCompleted}
            >
              <MapPin className="h-4 w-4" />
              Track Now
            </Button>
            <Button
              variant="outline"
              onClick={handleFavourite}
              className="gap-2"
              disabled={walk.isFavourite || markFavourite.isPending}
            >
              <Heart className={`h-4 w-4 ${walk.isFavourite ? 'fill-current' : ''}`} />
              {walk.isFavourite ? 'Favorited' : 'Save to Favorites'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleComplete}
              className="gap-2"
              disabled={walk.isCompleted || markCompleted.isPending}
            >
              <CheckCircle className="h-4 w-4" />
              {walk.isCompleted ? 'Completed' : 'Complete Walk'}
            </Button>
          </div>

          {walk.isCompleted && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-primary font-medium">
                🎁 Reward unlocked! You've earned a special treat for completing this walk!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <WalkRatingModal
        isOpen={showRatingModal}
        walkType="Recommended"
        onRatingSubmit={handleRatingSubmit}
        onClose={handleRatingClose}
      />
    </>
  );
}
