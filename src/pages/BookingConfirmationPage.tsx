
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAppointments } from '@/contexts/appointment';
import { useServices } from '@/contexts/ServiceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { CalendarCheck, Clock, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const BookingConfirmationPage = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { getAppointmentById, bookAppointment } = useAppointments();
  const { getServiceById } = useServices();
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  
  // Use booking data either from URL params or from location state
  const bookingDataFromState = location.state;
  
  useEffect(() => {
    const processBooking = async () => {
      try {
        // Case 1: We have a booking in progress from the payment page
        if (bookingDataFromState && bookingDataFromState.paymentCompleted) {
          // Create the appointment after payment
          await bookAppointment({
            serviceId: bookingDataFromState.serviceId,
            customerName: bookingDataFromState.customerName,
            customerEmail: bookingDataFromState.customerEmail,
            customerPhone: bookingDataFromState.customerPhone,
            date: bookingDataFromState.date,
            timeSlot: bookingDataFromState.timeSlot,
            location: bookingDataFromState.location,
            distance: bookingDataFromState.distance,
            price: bookingDataFromState.price,
            notes: bookingDataFromState.notes,
          });
          
          setIsBookingComplete(true);
          setIsLoading(false);
          return;
        }
        
        // Case 2: Looking up existing appointment
        if (appointmentId) {
          const appointment = getAppointmentById(appointmentId);
          
          if (!appointment) {
            toast.error('Appointment not found');
            navigate('/');
            return;
          }
          
          setIsBookingComplete(true);
          setIsLoading(false);
          return;
        }
        
        // No valid booking data available
        toast.error('No booking information found');
        navigate('/services');
      } catch (error) {
        console.error('Error processing booking:', error);
        toast.error('Failed to process booking');
        navigate('/services');
      }
    };
    
    processBooking();
  }, [appointmentId, bookAppointment, bookingDataFromState, getAppointmentById, navigate]);
  
  if (isLoading) {
    return (
      <div className="page-container py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
          <p className="mt-4 text-lg">Processing your booking...</p>
        </div>
      </div>
    );
  }
  
  // Determine what data to use for display
  const displayData = bookingDataFromState || 
    (appointmentId ? getAppointmentById(appointmentId) : null);
  
  if (!displayData) {
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
  
  const service = getServiceById(displayData.serviceId);
  
  return (
    <div className="page-container py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Your booking has been confirmed and is now pending approval. 
                You will receive a notification once it has been approved.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border mb-6">
              <h3 className="font-medium text-lg mb-4">Booking Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="min-w-[24px] mr-3">
                    <CalendarCheck className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium">Service</p>
                    <p className="text-gray-600">{service?.name || 'Unknown Service'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="min-w-[24px] mr-3">
                    <Clock className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-gray-600">
                      {displayData.date} @ {displayData.timeSlot}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="min-w-[24px] mr-3">
                    <MapPin className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">{displayData.location.address}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Paid:</span>
                    <span className="font-bold">${displayData.price.toFixed(2)}</span>
                  </div>
                  {bookingDataFromState?.paymentMethod && (
                    <div className="text-xs text-gray-500 text-right mt-1">
                      via {bookingDataFromState.paymentMethod}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">What's next?</span> Your booking is now pending approval from our administrators. 
                You will receive an email notification once your appointment is approved or declined. 
                You can also check the status of your appointment on your dashboard.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 border-t pt-6">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => navigate('/')}
            >
              View Dashboard
            </Button>
            <Button 
              className="w-full sm:w-auto"
              onClick={() => navigate('/services')}
            >
              Book Another Service <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
