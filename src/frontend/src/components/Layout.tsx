import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Activity, Camera, TrendingUp, Settings, Dumbbell, LogOut, ListChecks, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { SiX, SiFacebook, SiInstagram } from 'react-icons/si';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';

export default function Layout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { clear } = useInternetIdentity();

  const navItems = [
    { path: '/', label: 'Home', icon: Dumbbell },
    { path: '/walk', label: 'Track Walk', icon: Activity },
    { path: '/transform', label: 'Transform', icon: Camera },
    { path: '/stats', label: 'Stats', icon: TrendingUp },
  ];

  const exerciseCategories = [
    { path: '/exercises/upper-body', label: 'Upper Body' },
    { path: '/exercises/lower-body', label: 'Lower Body' },
    { path: '/exercises/core', label: 'Core' },
    { path: '/exercises/cardio', label: 'Cardio' },
  ];

  const handleLogout = () => {
    clear();
    navigate({ to: '/login' });
  };

  const isExercisePath = currentPath.startsWith('/exercises/');

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Decorative background elements */}
      <div className="decorative-bg-left" />
      <div className="decorative-bg-right" />
      <div className="decorative-bg-top" />
      <div className="decorative-bg-bottom" />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FitTransform
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate({ to: item.path })}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isExercisePath ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Exercises
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Exercise Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {exerciseCategories.map((category) => (
                  <DropdownMenuItem
                    key={category.path}
                    onClick={() => navigate({ to: category.path })}
                    className={currentPath === category.path ? 'bg-accent' : ''}
                  >
                    {category.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant={currentPath === '/tasks' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate({ to: '/tasks' })}
              className="gap-2"
            >
              <ListChecks className="h-4 w-4" />
              Tasks
            </Button>

            <Button
              variant={currentPath === '/settings' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate({ to: '/settings' })}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 ml-2"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </nav>

          <div className="md:hidden flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => navigate({ to: item.path })}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              );
            })}
            <Button
              variant={currentPath === '/tasks' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => navigate({ to: '/tasks' })}
              title="Tasks"
            >
              <ListChecks className="h-5 w-5" />
            </Button>
            <Button
              variant={currentPath === '/settings' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => navigate({ to: '/settings' })}
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      <footer className="border-t border-border/40 bg-muted/30 py-8 relative z-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} FitTransform</span>
              <span>•</span>
              <span>Built with ❤️ using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiX className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
