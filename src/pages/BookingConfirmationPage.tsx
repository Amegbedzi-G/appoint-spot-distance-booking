
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '@/contexts/appointment';
import { useServices } from '@/contexts/ServiceContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import BookingConfirmationHeader from '@/components/booking/BookingConfirmationHeader';
import BookingDetailsCard from '@/components/booking/BookingDetailsCard';
import NextStepsInfo from '@/components/booking/NextStepsInfo';
import ConfirmationActions from '@/components/booking/ConfirmationActions';

const BookingConfirmationPage = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { getAppointmentById } = useAppointments();
  const { getServiceById } = useServices();
  const [isLoading, setIsLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  
  // Get payment method from location state if available
  const paymentMethod = location.state?.paymentMethod || 'Unknown';
  
  useEffect(() => {
    const loadAppointment = () => {
      try {
        if (appointmentId) {
          const foundAppointment = getAppointmentById(appointmentId);
          
          if (!foundAppointment) {
            toast.error('Appointment not found');
            navigate('/services');
            return;
          }
          
          setAppointment(foundAppointment);
        } else {
          toast.error('No appointment ID provided');
          navigate('/services');
          return;
        }
      } catch (error) {
        console.error('Error loading appointment:', error);
        toast.error('Error loading appointment details');
        navigate('/services');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAppointment();
  }, [appointmentId, getAppointmentById, navigate]);
  
  if (isLoading) {
    return (
      <div className="page-container py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your booking details...</p>
        </div>
      </div>
    );
  }
  
  if (!appointment) {
    return (
      <div className="page-container py-12">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600">Booking information not available</p>
              <Button className="mt-4" onClick={() => navigate('/services')}>
                Browse Services
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const service = getServiceById(appointment.serviceId);
  
  return (
    <div className="page-container py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <BookingConfirmationHeader />
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Your booking has been confirmed and is now pending approval. 
                You will receive a notification once it has been approved.
              </p>
            </div>
            
            <BookingDetailsCard 
              appointment={appointment}
              service={service}
              paymentMethod={paymentMethod}
            />
            
            <NextStepsInfo />
          </CardContent>
          <ConfirmationActions />
        </Card>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
