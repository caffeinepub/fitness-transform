import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { useCustomizations, useSaveCustomizations } from '@/hooks/useQueries';
import { Skeleton } from './ui/skeleton';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function CustomizationSettings() {
  const { data: customizations, isLoading } = useCustomizations();
  const setCustomizations = useSaveCustomizations();
  
  const [fontSize, setFontSize] = useState<string>('16');
  const [backgroundMusic, setBackgroundMusic] = useState<string>('none');
  const [units, setUnits] = useState<string>('metric');
  const [notifications, setNotifications] = useState<boolean>(true);

  useEffect(() => {
    if (customizations) {
      setFontSize(String(customizations.fontSize));
      setBackgroundMusic(customizations.backgroundMusic || 'none');
    }
  }, [customizations]);

  const handleSave = async () => {
    try {
      await setCustomizations.mutateAsync({
        fontSize: BigInt(fontSize),
        backgroundMusic: backgroundMusic === 'none' ? '' : backgroundMusic,
      });
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="font-size">Font Size</Label>
        <Select value={fontSize} onValueChange={(value) => { setFontSize(value); handleSave(); }}>
          <SelectTrigger id="font-size">
            <SelectValue placeholder="Select font size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="14">Small</SelectItem>
            <SelectItem value="16">Medium</SelectItem>
            <SelectItem value="18">Large</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Adjust the text size throughout the app
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="units">Units</Label>
        <Select value={units} onValueChange={setUnits}>
          <SelectTrigger id="units">
            <SelectValue placeholder="Select units" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (km, kg)</SelectItem>
            <SelectItem value="imperial">Imperial (mi, lb)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Choose your preferred measurement system
        </p>
      </div>

      <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border border-border">
        <div className="space-y-0.5">
          <Label htmlFor="notifications">Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive reminders and motivational messages
          </p>
        </div>
        <Switch
          id="notifications"
          checked={notifications}
          onCheckedChange={setNotifications}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="background-music">Background Music</Label>
        <Select value={backgroundMusic} onValueChange={(value) => { setBackgroundMusic(value); handleSave(); }}>
          <SelectTrigger id="background-music">
            <SelectValue placeholder="Select music preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="energetic">Energetic Beats</SelectItem>
            <SelectItem value="calm">Calm & Focused</SelectItem>
            <SelectItem value="motivational">Motivational</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Choose background music for your workouts
        </p>
      </div>
    </div>
  );
}
