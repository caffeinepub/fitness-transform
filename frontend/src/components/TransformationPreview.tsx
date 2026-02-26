import { ExternalBlob } from '../backend';
import { Sparkles } from 'lucide-react';

interface TransformationPreviewProps {
  originalPhoto: ExternalBlob | null;
  transformedPhoto: ExternalBlob | null;
  months: number;
}

export default function TransformationPreview({
  originalPhoto,
  transformedPhoto,
  months,
}: TransformationPreviewProps) {
  if (!originalPhoto && !transformedPhoto) {
    return (
      <div className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-2">
          <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <p className="text-muted-foreground">
            Your transformation will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-center">Before</p>
          {originalPhoto ? (
            <img
              src={originalPhoto.getDirectURL()}
              alt="Original"
              className="w-full aspect-square object-cover rounded-lg border border-border"
            />
          ) : (
            <div className="w-full aspect-square bg-muted rounded-lg" />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-center">After {months} Months</p>
          {transformedPhoto ? (
            <div className="relative">
              <img
                src={transformedPhoto.getDirectURL()}
                alt="Transformed"
                className="w-full aspect-square object-cover rounded-lg border border-primary shadow-lg"
              />
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                AI Generated
              </div>
            </div>
          ) : (
            <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-muted-foreground/50" />
            </div>
          )}
        </div>
      </div>

      {transformedPhoto && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <p className="text-sm text-center">
            <span className="font-semibold">Projected transformation</span> after {months} months of consistent training and nutrition
          </p>
        </div>
      )}
    </div>
  );
}
