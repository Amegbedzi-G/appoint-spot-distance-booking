
import { Location, Appointment } from './types';

// Provider location (admin/business location)
export const PROVIDER_LOCATION: Location = {
  address: "123 Business St, City, Country",
  latitude: 40.7128,
  longitude: -74.0060,
};

// Mock appointments data
export const initialAppointments: Appointment[] = [
  {
    id: '1',
    serviceId: '1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '123-456-7890',
    date: '2025-05-20',
    timeSlot: '10:00 AM',
    status: 'pending',
    location: {
      address: '456 Customer Ave, City, Country',
      latitude: 40.7282,
      longitude: -73.9942,
    },
    distance: 5.2,
    price: 60.4, // basePrice (50) + distance (5.2 km) * pricePerKm (2)
    notes: 'Please bring eco-friendly products',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
