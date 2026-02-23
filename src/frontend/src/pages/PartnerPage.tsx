import { useState } from 'react';
import { Heart, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import PartnerWalkHistory from '@/components/PartnerWalkHistory';
import PartnerTaskHistory from '@/components/PartnerTaskHistory';
import PartnerWalkRatings from '@/components/PartnerWalkRatings';

type ProfileId = 'user' | 'girlfriend';

export default function PartnerPage() {
  const [selectedProfile, setSelectedProfile] = useState<ProfileId>('girlfriend');

  const handleProfileChange = (value: string) => {
    if (value && (value === 'user' || value === 'girlfriend')) {
      console.log('[PartnerPage] Profile changed to:', value);
      setSelectedProfile(value as ProfileId);
    } else {
      console.warn('[PartnerPage] Invalid profile value:', value);
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Partner Dashboard</h1>
        </div>
        <p className="text-muted-foreground text-center max-w-2xl">
          View fitness progress, walk history, and daily achievements
        </p>
      </div>

      {/* Profile Selector */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-center">Select Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ToggleGroup
            type="single"
            value={selectedProfile}
            onValueChange={handleProfileChange}
            className="bg-muted/50 rounded-lg p-2"
          >
            <ToggleGroupItem value="user" aria-label="My profile" className="gap-2 px-6 py-3">
              <User className="h-5 w-5" />
              <span className="font-medium">Me</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="girlfriend" aria-label="Girlfriend's profile" className="gap-2 px-6 py-3">
              <Heart className="h-5 w-5" />
              <span className="font-medium">Girlfriend</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      {/* Walk Ratings Section */}
      {selectedProfile && <PartnerWalkRatings profileId={selectedProfile} />}

      {/* Walk History Section */}
      {selectedProfile && <PartnerWalkHistory profileId={selectedProfile} />}

      {/* Task History Section */}
      {selectedProfile && <PartnerTaskHistory profileId={selectedProfile} />}
    </div>
  );
}
