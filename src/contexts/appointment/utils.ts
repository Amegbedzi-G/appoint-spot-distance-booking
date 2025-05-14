
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from './types';
import { ServiceType } from '../ServiceContext';

// Calculate the price of an appointment based on distance and service
export const calculateAppointmentPrice = (
  service: ServiceType | undefined, 
  distance: number
): number => {
  if (!service) throw new Error('Service not found');
  return service.basePrice + (distance * service.pricePerKm);
};

// Function to send email notifications
export const sendEmailNotification = async (
  email: string,
  type: 'booking' | 'approved' | 'declined',
  appointment: Appointment,
  serviceName: string = 'Unknown Service'
) => {
  try {
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
