import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Heart, Coffee, Film, Utensils, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

interface RewardSelectorProps {
  onRewardSelected: () => void;
}

const rewards = [
  { id: 'date-night', label: 'Date Night', icon: Heart, description: 'A romantic evening together' },
  { id: 'sleepover', label: 'Sleepover', icon: Coffee, description: 'Cozy night in with movies' },
  { id: 'massage', label: 'Massage', icon: Sparkles, description: 'Relaxing massage session' },
  { id: 'movie-night', label: 'Movie Night', icon: Film, description: 'Cinema or home theater' },
  { id: 'breakfast-bed', label: 'Breakfast in Bed', icon: Utensils, description: 'Special morning treat' },
];

export default function RewardSelector({ onRewardSelected }: RewardSelectorProps) {
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  const handleSelect = (rewardId: string) => {
    setSelectedReward(rewardId);
  };

  const handleConfirm = () => {
    if (selectedReward) {
      const reward = rewards.find((r) => r.id === selectedReward);
      toast.success(`Reward selected: ${reward?.label}! 🎉`);
      onRewardSelected();
    }
  };

  const handleClose = () => {
    onRewardSelected();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in">
      <Card className="w-full max-w-2xl mx-4 shadow-2xl animate-in zoom-in duration-300">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <CardTitle className="text-3xl text-center">
            Choose Your Reward! 🎁
          </CardTitle>
          <p className="text-center text-muted-foreground mt-2">
            You've earned it! Pick your favorite reward for completing all tasks today.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {rewards.map((reward) => {
              const Icon = reward.icon;
              const isSelected = selectedReward === reward.id;
              
              return (
                <button
                  key={reward.id}
                  onClick={() => handleSelect(reward.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-lg scale-105'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{reward.label}</h3>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleConfirm}
            disabled={!selectedReward}
          >
            <Sparkles className="h-5 w-5" />
            Confirm Reward
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
