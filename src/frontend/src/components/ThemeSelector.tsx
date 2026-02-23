import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './ui/button';
import { Check } from 'lucide-react';

const themes = [
  { name: 'Default', description: 'Classic neutral theme', colors: ['#FFFFFF', '#000000', '#FF0000'] },
  { name: 'Energize', description: 'Bold orange energy', colors: ['#FF6B35', '#FFB627', '#4CAF50'] },
  { name: 'Ocean', description: 'Cool blue waves', colors: ['#2196F3', '#03A9F4', '#00BCD4'] },
  { name: 'Sunset', description: 'Warm sunset glow', colors: ['#FF5722', '#FF9800', '#E91E63'] },
  { name: 'Forest', description: 'Natural green', colors: ['#4CAF50', '#8BC34A', '#CDDC39'] },
];

export default function ThemeSelector() {
  const { currentTheme, setTheme, isLoading } = useTheme();

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {themes.map((theme) => {
        const isActive = currentTheme?.name === theme.name;
        
        return (
          <Button
            key={theme.name}
            variant={isActive ? 'default' : 'outline'}
            className="h-auto p-4 flex flex-col items-start gap-3 relative"
            onClick={() => setTheme(theme.name)}
            disabled={isLoading}
          >
            {isActive && (
              <div className="absolute top-2 right-2">
                <Check className="h-5 w-5" />
              </div>
            )}
            
            <div className="flex gap-2">
              {theme.colors.map((color, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-background shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            <div className="text-left">
              <div className="font-semibold">{theme.name}</div>
              <div className="text-xs text-muted-foreground font-normal">
                {theme.description}
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
