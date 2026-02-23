import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Sparkles } from 'lucide-react';
import PhotoUploader from '@/components/PhotoUploader';
import TransformationPreview from '@/components/TransformationPreview';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useUploadPhoto } from '@/hooks/useQueries';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

export default function TransformationPage() {
  const [uploadedPhoto, setUploadedPhoto] = useState<ExternalBlob | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<string>('3');
  const [transformedPhoto, setTransformedPhoto] = useState<ExternalBlob | null>(null);
  const uploadPhoto = useUploadPhoto();

  const handlePhotoUpload = async (photo: ExternalBlob) => {
    setUploadedPhoto(photo);
    await uploadPhoto.mutateAsync(photo);
    toast.success('Photo uploaded successfully!');
  };

  const handleGenerate = async () => {
    if (!uploadedPhoto) {
      toast.error('Please upload a photo first');
      return;
    }

    toast.info('Generating transformation... This may take a moment');
    
    // Simulate AI transformation by using the same photo
    // In a real app, this would call an AI service
    setTimeout(() => {
      setTransformedPhoto(uploadedPhoto);
      toast.success('Transformation generated!');
    }, 2000);
  };

  return (
    <div className="container py-8 px-4 max-w-7xl">
      <div className="space-y-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block mb-4">
            <img 
              src="/assets/generated/transform-icon.dim_256x256.png" 
              alt="Transform" 
              className="h-20 w-20 mx-auto"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            See Your Future Self
          </h1>
          <p className="text-xl text-muted-foreground">
            Upload your photo and visualize your transformation after months of dedication
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Upload Your Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoUploader onPhotoUpload={handlePhotoUpload} />
              
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Training Duration
                  </label>
                  <Select value={selectedMonths} onValueChange={setSelectedMonths}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select months" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={handleGenerate}
                  disabled={!uploadedPhoto || uploadPhoto.isPending}
                >
                  <Sparkles className="h-5 w-5" />
                  Generate Transformation
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Your Transformation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransformationPreview
                originalPhoto={uploadedPhoto}
                transformedPhoto={transformedPhoto}
                months={parseInt(selectedMonths)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">How It Works</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">1</div>
                  <h4 className="font-semibold mb-2">Upload Photo</h4>
                  <p className="text-sm text-muted-foreground">
                    Take or upload a clear photo of yourself
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-accent mb-2">2</div>
                  <h4 className="font-semibold mb-2">Choose Duration</h4>
                  <p className="text-sm text-muted-foreground">
                    Select how many months of training to visualize
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-secondary mb-2">3</div>
                  <h4 className="font-semibold mb-2">See Results</h4>
                  <p className="text-sm text-muted-foreground">
                    View your projected transformation and get motivated
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
