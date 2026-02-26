import { useState, useEffect, useRef } from 'react';
import { calculateDistance, calculateSteps, calculateCalories } from '@/utils/walkCalculations';
import type { WalkSession } from '../backend';

interface Coordinate {
  latitude: number;
  longitude: number;
}

export function useLocationTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setError(null);
    setIsTracking(true);
    setCoordinates([]);
    setDistance(0);
    setDuration(0);
    setSteps(0);
    setCalories(0);
    startTimeRef.current = Date.now();

    // Start duration timer
    intervalRef.current = window.setInterval(() => {
      if (startTimeRef.current) {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newCoord: Coordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setCoordinates((prev) => {
          const updated = [...prev, newCoord];
          
          // Calculate distance
          if (updated.length > 1) {
            const newDistance = calculateDistance(updated);
            setDistance(newDistance);
            setSteps(calculateSteps(newDistance));
            
            const currentDuration = startTimeRef.current 
              ? Math.floor((Date.now() - startTimeRef.current) / 1000)
              : 0;
            setCalories(calculateCalories(newDistance, currentDuration));
          }
          
          return updated;
        });
      },
      (err) => {
        setError(`Location error: ${err.message}`);
        stopTracking();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
  };

  const stopTracking = (): WalkSession | null => {
    setIsTracking(false);

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (coordinates.length > 0 && duration > 0) {
      const session: WalkSession = {
        durationInSeconds: BigInt(duration),
        distanceInMeters: distance,
        steps: BigInt(steps),
        caloriesBurned: BigInt(calories),
      };
      return session;
    }

    return null;
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isTracking,
    coordinates,
    distance,
    duration,
    steps,
    calories,
    error,
    startTracking,
    stopTracking,
  };
}
