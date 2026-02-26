import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';

interface WalkRatingModalProps {
  isOpen: boolean;
  walkType: 'Tracked' | 'Recommended';
  onRatingSubmit: (rating: number) => void;
  onClose: () => void;
}

export default function WalkRatingModal({ isOpen, walkType, onRatingSubmit, onClose }: WalkRatingModalProps) {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleSubmit = () => {
    if (selectedRating > 0) {
      onRatingSubmit(selectedRating);
      setSelectedRating(0);
      setHoveredRating(0);
    }
  };

  const handleClose = () => {
    setSelectedRating(0);
    setHoveredRating(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">How do you feel?</DialogTitle>
          <DialogDescription className="text-center">
            Rate your {walkType.toLowerCase()} walk experience
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-2 py-8">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className={`h-12 w-12 ${
                  rating <= (hoveredRating || selectedRating)
                    ? 'fill-primary text-primary'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedRating === 0}
            className="w-full sm:w-auto"
          >
            Submit Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
