
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useServices } from '@/contexts/ServiceContext';
import { useAppointments, PROVIDER_LOCATION } from '@/contexts/appointment';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, MapPin, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculateDistance } from '@/utils/distanceUtils';

// Form schema
const bookingFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email"),
  customerPhone: z.string().min(5, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  date: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const TIME_SLOTS = [
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '1:00 PM - 3:00 PM',
  '3:00 PM - 5:00 PM',
];

const BookServicePage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { services, getServiceById } = useServices();
  const { bookAppointment, calculatePrice } = useAppointments();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mockLocation, setMockLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mockDistance, setMockDistance] = useState<number>(0);
  const [mockPrice, setMockPrice] = useState<number>(0);
  
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
        // Calculate price based on distance
        const price = calculatePrice(service.id, distance);
        setMockPrice(price);
      }
    }
  }, [addressValue, calculatePrice, service]);

  const onSubmit = async (data: BookingFormValues) => {
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="Enter your address" {...field} />
                            {field.value.length > 5 && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                                <MapPin className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                // Disable dates in the past
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date < today;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timeSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Slot</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time slot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TIME_SLOTS.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Any special requirements or notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {addressValue.length > 5 && mockDistance > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-medium mb-2">Service Summary</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Service:</div>
                      <div className="font-medium">{service.name}</div>
                      
                      <div>Base Price:</div>
                      <div className="font-medium">${service.basePrice.toFixed(2)}</div>
                      
                      <div>Distance:</div>
                      <div className="font-medium">{mockDistance.toFixed(1)} km</div>
                      
                      <div>Distance Fee:</div>
                      <div className="font-medium">${(mockDistance * service.pricePerKm).toFixed(2)}</div>
                      
                      <div className="text-lg">Total:</div>
                      <div className="text-lg font-bold">${mockPrice.toFixed(2)}</div>
                    </div>
                  </div>
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
