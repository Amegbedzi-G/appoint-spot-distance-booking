
import { Location } from '@/contexts/AppointmentContext';

// Function to calculate distance between two coordinates using Haversine formula
export const calculateDistance = (location1: Location, location2: Location): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(location2.latitude - location1.latitude);
  const dLon = deg2rad(location2.longitude - location1.longitude);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(location1.latitude)) * Math.cos(deg2rad(location2.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  // Round to 1 decimal place
  return Math.round(distance * 10) / 10;
};

// Helper function to convert degrees to radians
const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

// Function to geocode an address to get coordinates
// In a real app, this would use Google Maps or similar API
export const geocodeAddress = async (address: string): Promise<Location> => {
  // This is a mock function that returns random coordinates near NYC
  // In a real app, you would use Google Maps Geocoding API
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate random coordinates near NYC for demo purposes
  const baseLat = 40.7128;
  const baseLng = -74.0060;
  
  // Random offset within ~5km
  const latOffset = (Math.random() - 0.5) * 0.1;
  const lngOffset = (Math.random() - 0.5) * 0.1;
  
  return {
    address,
    latitude: baseLat + latOffset,
    longitude: baseLng + lngOffset,
  };
};
