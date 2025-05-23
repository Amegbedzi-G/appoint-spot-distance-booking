
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useServices } from '@/contexts/ServiceContext';
import { useAppointments } from '@/contexts/appointment';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { BookingFormValues } from '@/components/booking/types';
import BookServiceForm from '@/components/booking/BookServiceForm';

const BookServicePage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { services, getServiceById } = useServices();
  const { calculatePrice } = useAppointments();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const service = serviceId ? getServiceById(serviceId) : null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: `/book/${serviceId}` } });
    }
    
    if (!service) {
      toast.error("Service not found");
      navigate('/services');
    }
    
    if (user?.isApproved === false) {
      toast.error("Your account needs to be approved before booking");
      navigate('/');
    }
  }, [isAuthenticated, navigate, service, serviceId, user]);

  const onSubmit = async (
    data: BookingFormValues,
    mockLocation: { latitude: number; longitude: number },
    mockDistance: number,
    mockPrice: number
  ) => {
    if (!service || !mockLocation || !user) {
      toast.error("Missing required information");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare booking data without creating the appointment yet
      const bookingData = {
        serviceId: service.id,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        date: format(data.date, 'yyyy-MM-dd'),
        timeSlot: data.timeSlot,
        location: {
          address: data.address,
          latitude: mockLocation.latitude,
          longitude: mockLocation.longitude,
        },
        distance: mockDistance,
        price: mockPrice,
        notes: data.notes || undefined,
      };

      // Navigate to payment page with booking data
      navigate('/payment', { state: { bookingData } });
    } catch (error) {
      console.error('Error preparing booking:', error);
      toast.error('Error preparing your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service) {
    return (
      <div className="page-container py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading service...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book {service.name}</h1>
          <p className="text-gray-600">{service.description}</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>Please fill out the form below to book this service.</CardDescription>
          </CardHeader>
          <CardContent>
            {service && (
              <BookServiceForm
                user={user}
                service={service}
                calculatePrice={calculatePrice}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" onClick={() => navigate('/services')}>
              Back to Services
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BookServicePage;
