import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, Palette } from 'lucide-react';
import ThemeSelector from '@/components/ThemeSelector';

export default function SettingsPage() {
  return (
    <div className="container py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Customize your app experience
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Color Theme
            </CardTitle>
            <CardDescription>
              Choose a color theme that motivates you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              FitTransform helps you achieve your fitness goals through tracking, visualization, and motivation.
            </p>
            <p className="pt-4 border-t">
              Version 1.0.0
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
