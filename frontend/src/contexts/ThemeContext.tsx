import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useActor } from '../hooks/useActor';
import { useProfile } from './ProfileContext';
import type { Theme } from '../backend';

interface ThemeContextValue {
  currentTheme: Theme | null;
  setTheme: (themeName: string) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { actor } = useActor();
  const { activeProfile } = useProfile();
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (actor && activeProfile) {
      loadTheme();
    }
  }, [actor, activeProfile]);

  const loadTheme = async () => {
    if (!actor || !activeProfile) return;
    try {
      const theme = await actor.getTheme(activeProfile);
      setCurrentTheme(theme);
      applyTheme(theme);
    } catch (error) {
      console.error('Failed to load theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    // Parse colors and apply them
    if (theme.name === 'Energize') {
      root.style.setProperty('--primary', '0.65 0.22 35');
      root.style.setProperty('--secondary', '0.75 0.18 85');
      root.style.setProperty('--accent', '0.70 0.25 120');
    } else if (theme.name === 'Ocean') {
      root.style.setProperty('--primary', '0.55 0.18 220');
      root.style.setProperty('--secondary', '0.65 0.15 200');
      root.style.setProperty('--accent', '0.60 0.20 180');
    } else if (theme.name === 'Sunset') {
      root.style.setProperty('--primary', '0.60 0.24 25');
      root.style.setProperty('--secondary', '0.70 0.22 50');
      root.style.setProperty('--accent', '0.55 0.20 340');
    } else if (theme.name === 'Forest') {
      root.style.setProperty('--primary', '0.50 0.15 145');
      root.style.setProperty('--secondary', '0.60 0.18 130');
      root.style.setProperty('--accent', '0.70 0.20 90');
    } else {
      // Default theme - reset to original values from index.css
      root.style.setProperty('--primary', '0.65 0.22 25');
      root.style.setProperty('--secondary', '0.75 0.18 45');
      root.style.setProperty('--accent', '0.70 0.25 120');
    }
  };

  const handleSetTheme = async (themeName: string) => {
    if (!actor || !activeProfile) return;
    
    setIsLoading(true);
    try {
      await actor.setTheme(activeProfile, themeName);
      const newTheme = await actor.getTheme(activeProfile);
      setCurrentTheme(newTheme);
      applyTheme(newTheme);
    } catch (error) {
      console.error('Failed to set theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: handleSetTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
