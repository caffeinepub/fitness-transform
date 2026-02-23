interface Coordinate {
  latitude: number;
  longitude: number;
}

// Haversine formula to calculate distance between two coordinates
function haversineDistance(coord1: Coordinate, coord2: Coordinate): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export function calculateDistance(coordinates: Coordinate[]): number {
  if (coordinates.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < coordinates.length; i++) {
    totalDistance += haversineDistance(coordinates[i - 1], coordinates[i]);
  }

  return totalDistance;
}

export function calculateSteps(distanceInMeters: number): number {
  // Average stride length is approximately 0.762 meters (2.5 feet)
  const averageStrideLength = 0.762;
  return Math.round(distanceInMeters / averageStrideLength);
}

export function calculateCalories(distanceInMeters: number, durationInSeconds: number): number {
  // Simplified calculation: approximately 0.05 calories per meter for walking
  // This can be adjusted based on weight, pace, etc.
  const distanceInKm = distanceInMeters / 1000;
  const caloriesPerKm = 50; // Average for walking
  return Math.round(distanceInKm * caloriesPerKm);
}
