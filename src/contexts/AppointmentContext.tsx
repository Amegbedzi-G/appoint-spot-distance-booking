import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { useServices } from './ServiceContext';
import { calculateDistance } from '@/utils/distanceUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

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

interface AppointmentContextType {
  appointments: Appointment[];
  isLoading: boolean;
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  getAppointmentById: (id: string) => Appointment | undefined;
  calculatePrice: (serviceId: string, distance: number) => number;
  getFilteredAppointments: (filters: { status?: string; date?: string; serviceId?: string }) => Appointment[];
}

// Provider location (admin/business location)
export const PROVIDER_LOCATION = {
  address: "123 Business St, City, Country",
  latitude: 40.7128,
  longitude: -74.0060,
};

// Mock appointments data
const initialAppointments: Appointment[] = [
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

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { services, getServiceById } = useServices();
  const { user } = useAuth();

  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointmentBookingAppointments');
    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch (error) {
        console.error('Failed to parse saved appointments:', error);
        setAppointments(initialAppointments);
      }
    } else {
      setAppointments(initialAppointments);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('appointmentBookingAppointments', JSON.stringify(appointments));
    }
  }, [appointments, isLoading]);

  const calculatePrice = (serviceId: string, distance: number) => {
    const service = getServiceById(serviceId);
    if (!service) throw new Error('Service not found');
    return service.basePrice + (distance * service.pricePerKm);
  };

  // Function to send email notifications
  const sendEmailNotification = async (
    email: string,
    type: 'booking' | 'approved' | 'declined',
    appointment: Appointment
  ) => {
    try {
      const service = getServiceById(appointment.serviceId);
      const serviceName = service ? service.name : 'Unknown Service';
      
      await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          type,
          customerName: appointment.customerName,
          appointmentData: {
            id: appointment.id,
            serviceName,
            date: appointment.date,
            time: appointment.timeSlot,
            location: appointment.location.address,
            price: appointment.price,
            notes: appointment.notes
          }
        }
      });
      
      console.log(`${type} email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send ${type} email:`, error);
    }
  };

  const bookAppointment = async (appointmentData: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    // Calculate final price
    const price = calculatePrice(appointmentData.serviceId, appointmentData.distance);
    
    // Create new appointment
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `appointment-${Date.now()}`,
      status: 'pending',
      price,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setAppointments((prev) => [...prev, newAppointment]);
    
    // Send email notification
    await sendEmailNotification(
      newAppointment.customerEmail,
      'booking',
      newAppointment
    );
    
    toast.success('Appointment booked successfully! Awaiting admin approval.');
    
    return newAppointment;
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    let updatedAppointment: Appointment | undefined;
    
    setAppointments((prev) =>
      prev.map((appointment) => {
        if (appointment.id === id) {
          updatedAppointment = { 
            ...appointment, 
            status, 
            updatedAt: new Date().toISOString() 
          };
          return updatedAppointment;
        }
        return appointment;
      })
    );
    
    if (updatedAppointment) {
      // Send email notification based on the status
      await sendEmailNotification(
        updatedAppointment.customerEmail,
        status as 'approved' | 'declined',
        updatedAppointment
      );
      
      const action = status === 'approved' ? 'approved' : 'declined';
      toast.success(`Appointment ${action}. Customer has been notified via email.`);
    }
  };

  const getAppointmentById = (id: string) => {
    return appointments.find((appointment) => appointment.id === id);
  };

  const getFilteredAppointments = (filters: { status?: string; date?: string; serviceId?: string }) => {
    return appointments.filter((appointment) => {
      let matches = true;
      
      if (filters.status && filters.status !== 'all') {
        matches = matches && appointment.status === filters.status;
      }
      
      if (filters.date) {
        matches = matches && appointment.date === filters.date;
      }
      
      if (filters.serviceId && filters.serviceId !== 'all') {
        matches = matches && appointment.serviceId === filters.serviceId;
      }
      
      return matches;
    });
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        isLoading,
        bookAppointment,
        updateAppointmentStatus,
        getAppointmentById,
        calculatePrice,
        getFilteredAppointments,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};
