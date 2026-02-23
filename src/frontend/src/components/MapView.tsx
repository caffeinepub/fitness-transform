import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  coordinates: Coordinate[];
  isTracking: boolean;
}

export default function MapView({ coordinates, isTracking }: MapViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, rect.width, rect.height);

    if (coordinates.length === 0) {
      // Draw placeholder
      ctx.fillStyle = '#6c757d';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Start walking to see your route', rect.width / 2, rect.height / 2);
      return;
    }

    // Calculate bounds
    const lats = coordinates.map((c) => c.latitude);
    const lngs = coordinates.map((c) => c.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const padding = 40;
    const width = rect.width - padding * 2;
    const height = rect.height - padding * 2;

    // Convert lat/lng to canvas coordinates
    const toCanvasX = (lng: number) => {
      const range = maxLng - minLng || 0.001;
      return padding + ((lng - minLng) / range) * width;
    };

    const toCanvasY = (lat: number) => {
      const range = maxLat - minLat || 0.001;
      return padding + height - ((lat - minLat) / range) * height;
    };

    // Draw route
    if (coordinates.length > 1) {
      ctx.strokeStyle = '#FF6B35';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(toCanvasX(coordinates[0].longitude), toCanvasY(coordinates[0].latitude));

      for (let i = 1; i < coordinates.length; i++) {
        ctx.lineTo(toCanvasX(coordinates[i].longitude), toCanvasY(coordinates[i].latitude));
      }

      ctx.stroke();
    }

    // Draw start point
    if (coordinates.length > 0) {
      const startX = toCanvasX(coordinates[0].longitude);
      const startY = toCanvasY(coordinates[0].latitude);

      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(startX, startY, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw current position
    if (coordinates.length > 0) {
      const lastCoord = coordinates[coordinates.length - 1];
      const x = toCanvasX(lastCoord.longitude);
      const y = toCanvasY(lastCoord.latitude);

      ctx.fillStyle = isTracking ? '#FF6B35' : '#2196F3';
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      if (isTracking) {
        ctx.fillStyle = 'rgba(255, 107, 53, 0.2)';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [coordinates, isTracking]);

  return (
    <div className="relative w-full h-[500px] bg-muted/30">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      {coordinates.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-3">
            <MapPin className="h-16 w-16 mx-auto text-muted-foreground/30" />
            <p className="text-muted-foreground">Start walking to see your route</p>
          </div>
        </div>
      )}
    </div>
  );
}
