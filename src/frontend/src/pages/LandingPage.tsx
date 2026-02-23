import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Activity, Target, TrendingUp, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DailyWalkRatings from '@/components/DailyWalkRatings';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      setIsVisible(scrollY < 50);

      elementsRef.current.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollY;
          const fadeStart = elementTop - windowHeight * 0.8;
          const fadeEnd = elementTop + rect.height;
          
          let opacity = 1;
          if (scrollY > fadeStart && scrollY < fadeEnd) {
            const fadeRange = fadeEnd - fadeStart;
            const fadeProgress = (scrollY - fadeStart) / fadeRange;
            opacity = Math.max(0, 1 - fadeProgress * 1.5);
          } else if (scrollY >= fadeEnd) {
            opacity = 0;
          }
          
          element.style.opacity = opacity.toString();
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const setRef = (index: number) => (el: HTMLElement | null) => {
    elementsRef.current[index] = el;
  };

  const features = [
    {
      icon: Activity,
      title: 'Track Your Walks',
      description: 'Monitor your daily walking activity with real-time GPS tracking and detailed statistics.',
    },
    {
      icon: Target,
      title: 'Daily Challenges',
      description: 'Complete daily fitness tasks and build healthy habits that last.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Visualize your fitness journey with comprehensive stats and insights.',
    },
    {
      icon: Zap,
      title: 'Exercise Library',
      description: 'Access curated workout routines for every muscle group.',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="container py-20 space-y-12">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="flex items-center gap-3" ref={setRef(0)}>
            <Heart className="h-12 w-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold">
              <span ref={setRef(1)}>Transform</span>{' '}
              <span ref={setRef(2)}>Your</span>{' '}
              <span ref={setRef(3)}>Fitness</span>
            </h1>
          </div>
          
          <p 
            ref={setRef(4)}
            className="text-xl text-muted-foreground max-w-2xl"
          >
            Track your walks, complete daily challenges, and achieve your fitness goals together
          </p>

          <div className="flex flex-col sm:flex-row gap-4" ref={setRef(5)}>
            <Button
              size="lg"
              onClick={() => navigate({ to: '/walk' })}
              className="gap-2"
            >
              <Activity className="h-5 w-5" />
              Start Walking
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: '/tasks' })}
              className="gap-2"
            >
              <Target className="h-5 w-5" />
              View Tasks
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <h2 ref={setRef(6)} className="text-3xl font-bold text-center">
            Features
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  ref={setRef(7 + index)}
                  className="border-primary/20 hover:border-primary/40 transition-colors"
                >
                  <CardHeader>
                    <Icon className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div ref={setRef(11)}>
          <DailyWalkRatings />
        </div>
      </section>
    </div>
  );
}
