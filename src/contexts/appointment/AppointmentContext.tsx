
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { useServices } from '../ServiceContext';
import { useAuth } from '@/contexts/auth';
import { Appointment, AppointmentContextType, Location } from './types';
import { PROVIDER_LOCATION, initialAppointments } from './constants';
import { calculateAppointmentPrice, sendEmailNotification } from './utils';

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
    return calculateAppointmentPrice(service, distance);
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
    const service = getServiceById(newAppointment.serviceId);
    const serviceName = service ? service.name : 'Unknown Service';
    
    await sendEmailNotification(
      newAppointment.customerEmail,
      'booking',
      newAppointment,
      serviceName
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
      const service = getServiceById(updatedAppointment.serviceId);
      const serviceName = service ? service.name : 'Unknown Service';
      
      await sendEmailNotification(
        updatedAppointment.customerEmail,
        status as 'approved' | 'declined',
        updatedAppointment,
        serviceName
      );
      
      const action = status === 'approved' ? 'approved' : 'declined';
      toast.success(`Appointment ${action}. Customer has been notified via email.`);
    }

    // Force update of localStorage to ensure changes are reflected immediately
    localStorage.setItem('appointmentBookingAppointments', JSON.stringify(
      appointments.map(app => app.id === id ? { ...app, status, updatedAt: new Date().toISOString() } : app)
    ));
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

// Re-export types and constants needed by other files
export type { Appointment, Location } from './types';
export { PROVIDER_LOCATION } from './constants';
