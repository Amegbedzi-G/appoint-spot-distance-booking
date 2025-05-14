
import { Service } from '../ServiceContext';

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface Appointment {
  id: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'approved' | 'declined' | 'completed';
  location: Location;
  distance: number;
  price: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentContextType {
  appointments: Appointment[];
  isLoading: boolean;
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  getAppointmentById: (id: string) => Appointment | undefined;
  calculatePrice: (serviceId: string, distance: number) => number;
  getFilteredAppointments: (filters: { status?: string; date?: string; serviceId?: string }) => Appointment[];
}
