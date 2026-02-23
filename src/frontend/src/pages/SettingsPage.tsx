import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Palette, Info } from 'lucide-react';
import ThemeSelector from '@/components/ThemeSelector';
import CustomizationSettings from '@/components/CustomizationSettings';

export default function SettingsPage() {
  return (
    <div className="container py-8 px-4 max-w-4xl">
      {/* Hidden compliment */}
      <div className="hidden-compliment top-24 right-16">you're doing great</div>

      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Customize your app experience and preferences
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Palette className="h-5 w-5 text-primary" />
              Theme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Settings className="h-5 w-5 text-primary" />
              Customization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomizationSettings />
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Info className="h-5 w-5 text-primary" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform</span>
              <span className="font-medium text-foreground">Internet Computer</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
