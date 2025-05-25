
import { Appointment } from '@/contexts/appointment';

export const categorizeBookings = (userAppointments: Appointment[]) => {
  return {
    pending: userAppointments.filter(appointment => appointment.status === 'pending'),
    approved: userAppointments.filter(appointment => appointment.status === 'approved'),
    completed: userAppointments.filter(appointment => appointment.status === 'completed'),
    declined: userAppointments.filter(appointment => appointment.status === 'declined')
  };
};

export const getServiceName = (serviceId: string): string => {
  const serviceNames: Record<string, string> = {
    '1': 'Standard Cleaning',
    '2': 'Deep Cleaning', 
    '3': 'Move-in/Move-out Cleaning'
  };
  return serviceNames[serviceId] || 'Service';
};
