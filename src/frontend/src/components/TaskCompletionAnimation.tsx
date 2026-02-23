import { useEffect, useState } from 'react';
import { Trophy, Sparkles, Zap } from 'lucide-react';

interface TaskCompletionAnimationProps {
  onComplete: () => void;
}

export default function TaskCompletionAnimation({ onComplete }: TaskCompletionAnimationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute h-64 w-64 rounded-full bg-primary/20 animate-ping" />
          <div className="absolute h-48 w-48 rounded-full bg-accent/20 animate-ping animation-delay-150" />
          <div className="absolute h-32 w-32 rounded-full bg-secondary/20 animate-ping animation-delay-300" />
        </div>

        {/* Main content */}
        <div className="relative bg-card border-2 border-primary rounded-3xl p-12 shadow-2xl animate-in zoom-in duration-500">
          <div className="text-center space-y-6">
            {/* Trophy icon with gym theme */}
            <div className="relative inline-block">
              <Trophy className="h-24 w-24 text-primary animate-bounce" />
              <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-accent animate-pulse" />
              <Zap className="absolute -bottom-2 -left-2 h-8 w-8 text-secondary animate-pulse animation-delay-150" />
            </div>

            {/* Well Done text */}
            <div className="space-y-2">
              <h2 className="text-5xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                WELL DONE!
              </h2>
              <p className="text-xl text-muted-foreground font-semibold">
                All tasks completed! 💪
              </p>
            </div>

            {/* Gym-themed decorative elements */}
            <div className="flex justify-center gap-4 text-4xl animate-pulse">
              <span>🏋️</span>
              <span>💪</span>
              <span>🔥</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
