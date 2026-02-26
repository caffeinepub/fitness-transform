import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Activity, Camera, TrendingUp, Settings, Dumbbell, LogOut, ListChecks, Zap, Heart, User, Users } from 'lucide-react';
import { Button } from './ui/button';
import { SiX, SiFacebook, SiInstagram } from 'react-icons/si';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useProfile } from '../contexts/ProfileContext';
import { useState, useEffect, useRef } from 'react';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

export default function Layout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { clear } = useInternetIdentity();
  const { activeProfile, setActiveProfile } = useProfile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: '/', label: 'Home', icon: Dumbbell },
    { path: '/tasks', label: 'Tasks', icon: ListChecks },
    { path: '/walk', label: 'Walking', icon: Activity },
    { path: '/exercises/upper-body', label: 'Upper Body', icon: Zap },
    { path: '/exercises/lower-body', label: 'Lower Body', icon: Zap },
    { path: '/exercises/core', label: 'Core', icon: Zap },
    { path: '/exercises/cardio', label: 'Cardio', icon: Zap },
    { path: '/partner', label: 'Partner', icon: Heart },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    clear();
    navigate({ to: '/login' });
  };

  const handleNavigate = (path: string) => {
    navigate({ to: path });
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-primary">
              FitTransform
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Profile Selector */}
            <ToggleGroup
              type="single"
              value={activeProfile}
              onValueChange={(value) => {
                if (value) setActiveProfile(value as 'user' | 'girlfriend');
              }}
              className="bg-muted/50 rounded-lg p-1"
            >
              <ToggleGroupItem value="user" aria-label="My profile" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Me</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="girlfriend" aria-label="Girlfriend's profile" className="gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Her</span>
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Hamburger menu button */}
            <div className="relative" ref={menuRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="gap-2 relative"
                aria-label="Menu"
              >
                <div className="hamburger-icon">
                  <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                  <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                  <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                </div>
              </Button>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-black border border-border rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="py-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPath === item.path;
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavigate(item.path)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            isActive
                              ? 'bg-accent text-white'
                              : 'hover:bg-accent/20 text-white hover:text-accent'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                    <div className="border-t border-border my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/20 text-white hover:text-accent transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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
