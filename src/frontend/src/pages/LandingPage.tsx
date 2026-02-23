import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Activity, Camera, TrendingUp, Zap } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/assets/generated/hero-fitness.dim_1920x1080.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        <div className="container relative z-10 text-center px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-block mb-4">
              <img 
                src="/assets/generated/transform-icon.dim_256x256.png" 
                alt="Transform" 
                className="h-24 w-24 mx-auto animate-pulse"
              />
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
              <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Make a change today
              </span>
              <span className="block mt-2 bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
                and thank you for tomorrow
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Transform your body, track your progress, and achieve your fitness goals with AI-powered insights
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 gap-2 shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate({ to: '/walk' })}
              >
                <Activity className="h-5 w-5" />
                Start Tracking
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 gap-2"
                onClick={() => navigate({ to: '/transform' })}
              >
                <Camera className="h-5 w-5" />
                See Your Future
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Your Fitness Journey Starts Here
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Activity className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Track Your Walks</h3>
              <p className="text-muted-foreground">
                Real-time GPS tracking with detailed metrics including steps, distance, and calories burned
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all">
              <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Camera className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI Transformation</h3>
              <p className="text-muted-foreground">
                Upload your photo and see your projected transformation after months of dedication
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all">
              <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Monitor Progress</h3>
              <p className="text-muted-foreground">
                Comprehensive statistics and insights to keep you motivated and on track
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-12 rounded-3xl border border-border">
            <Zap className="h-16 w-16 mx-auto text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Transform?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands who have already started their journey to a healthier, stronger version of themselves
            </p>
            <Button 
              size="lg" 
              className="text-lg px-10 py-6 gap-2 shadow-lg"
              onClick={() => navigate({ to: '/walk' })}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
