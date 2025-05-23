
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { AuthUser } from '@/contexts/auth/types';
import { Service } from '@/contexts/ServiceContext';
import { PROVIDER_LOCATION } from '@/contexts/appointment';
import { calculateDistance } from '@/utils/distanceUtils';
import { bookingFormSchema, BookingFormValues, TIME_SLOTS } from './types';

// Import form field components
import CustomerInfoFields from './CustomerInfoFields';
import AddressField from './AddressField';
import DateTimeFields from './DateTimeFields';
import NotesField from './NotesField';
import ServiceSummary from './ServiceSummary';

interface BookServiceFormProps {
  user: AuthUser | null;
  service: Service;
  calculatePrice: (serviceId: string, distance: number) => number;
  onSubmit: (
    data: BookingFormValues,
    location: { latitude: number; longitude: number },
    distance: number,
    price: number
  ) => void;
  isSubmitting: boolean;
}

const BookServiceForm: React.FC<BookServiceFormProps> = ({
  user,
  service,
  calculatePrice,
  onSubmit,
  isSubmitting,
}) => {
  const [mockLocation, setMockLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mockDistance, setMockDistance] = useState<number>(0);
  const [mockPrice, setMockPrice] = useState<number>(0);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: user?.name || "",
      customerEmail: user?.email || "",
      customerPhone: "",
      address: "",
      notes: "",
    },
  });
  
  // Generate mock location and calculate mock distance when address changes
  const addressValue = form.watch('address');
  useEffect(() => {
    if (addressValue.length > 5) {
      // Generate a random location within 20km of provider
      const randomLat = PROVIDER_LOCATION.latitude + (Math.random() - 0.5) * 0.2; // approx 22km latitude range
      const randomLng = PROVIDER_LOCATION.longitude + (Math.random() - 0.5) * 0.2; // approx 22km longitude range
      
      const newMockLocation = {
        latitude: randomLat,
        longitude: randomLng,
      };
      
      setMockLocation(newMockLocation);
      
      // Calculate distance between provider and customer
      const distance = calculateDistance(
        PROVIDER_LOCATION.latitude,
        PROVIDER_LOCATION.longitude,
        newMockLocation.latitude,
        newMockLocation.longitude
      );
      
      setMockDistance(distance);
      
      if (service) {
        // Calculate price based on service and distance - fixing the function call to match expected parameters
        const price = calculatePrice(service.id, distance);
        setMockPrice(price);
      }
    }
  }, [addressValue, calculatePrice, service]);

  const handleSubmit = (data: BookingFormValues) => {
    if (!mockLocation) return;
    
    onSubmit(data, mockLocation, mockDistance, mockPrice);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomerInfoFields form={form} />
          <AddressField form={form} />
          <DateTimeFields form={form} timeSlots={TIME_SLOTS} />
        </div>
        
        <NotesField form={form} />
        
        {addressValue.length > 5 && mockDistance > 0 && (
          <ServiceSummary
            service={service}
            mockDistance={mockDistance}
            mockPrice={mockPrice}
          />
        )}
        
        <div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookServiceForm;
