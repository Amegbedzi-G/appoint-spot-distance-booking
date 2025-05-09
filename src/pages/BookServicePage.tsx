
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useServices } from '@/contexts/ServiceContext';
import { useAppointments, PROVIDER_LOCATION } from '@/contexts/AppointmentContext';
import { geocodeAddress, calculateDistance } from '@/utils/distanceUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { MapPin, Calendar as CalendarIcon, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/sonner';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const BookServicePage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { getServiceById } = useServices();
  const { calculatePrice, bookAppointment } = useAppointments();
  
  const [service, setService] = useState(serviceId ? getServiceById(serviceId) : undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [customerLocation, setCustomerLocation] = useState<any>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Handle invalid service ID
  useEffect(() => {
    if (!service) {
      toast.error("Service not found");
      navigate('/services');
    }
  }, [service, navigate]);
  
  // Calculate distance and price when address changes
  const handleAddressChange = async (newAddress: string) => {
    setAddress(newAddress);
    setCustomerLocation(null);
    setDistance(null);
    setPrice(null);
  };
  
  const handleGetQuote = async () => {
    if (!address.trim() || !service) return;
    
    try {
      setIsProcessing(true);
      // Geocode address to get coordinates
      const location = await geocodeAddress(address);
      setCustomerLocation(location);
      
      // Calculate distance between customer and provider
      const distanceToCustomer = calculateDistance(PROVIDER_LOCATION, location);
      setDistance(distanceToCustomer);
      
      // Calculate price based on service and distance
      const estimatedPrice = calculatePrice(service.id, distanceToCustomer);
      setPrice(estimatedPrice);
      
      toast.success("Quote generated successfully");
    } catch (error) {
      console.error("Error getting quote:", error);
      toast.error("Failed to generate quote. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service || !date || !selectedTimeSlot || !customerLocation || distance === null || price === null) {
      toast.error("Please complete all required fields");
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const appointment = await bookAppointment({
        serviceId: service.id,
        customerName,
        customerEmail,
        customerPhone,
        date: format(date, 'yyyy-MM-dd'),
        timeSlot: selectedTimeSlot,
        location: customerLocation,
        distance,
        price,
        notes,
      });
      
      navigate(`/booking/confirmation/${appointment.id}`);
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
      setIsProcessing(false);
    }
  };
  
  if (!service) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Book {service.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Service Info Card */}
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <img 
                src={service.image} 
                alt={service.name} 
                className="w-full h-40 object-cover rounded-md"
              />
              
              <h3 className="font-semibold text-xl">{service.name}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
              
              <div className="flex items-center text-gray-700">
                <DollarSign className="h-4 w-4 mr-1 text-brand-500" />
                <span className="font-medium">${service.basePrice}</span>
                <span className="text-xs ml-1">(base price)</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Clock className="h-4 w-4 mr-1 text-brand-500" />
                <span>{service.duration} min</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <MapPin className="h-4 w-4 mr-1 text-brand-500" />
                <span className="text-xs">${service.pricePerKm}/km distance fee</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Booking Form */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Personal Information */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <Input
                          id="phone"
                          placeholder="Enter your phone number"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Step 2: Address & Quote */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Service Location</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Address *
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="address"
                          placeholder="Enter your full address"
                          value={address}
                          onChange={(e) => handleAddressChange(e.target.value)}
                          required
                        />
                        <Button 
                          type="button" 
                          onClick={handleGetQuote}
                          disabled={!address.trim() || isProcessing}
                        >
                          Get Quote
                        </Button>
                      </div>
                    </div>
                    
                    {isProcessing && (
                      <div className="text-center py-4">
                        <div className="animate-spin h-6 w-6 border-4 border-brand-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">Calculating...</p>
                      </div>
                    )}
                    
                    {distance !== null && price !== null && (
                      <div className="bg-brand-50 p-4 rounded-md">
                        <h4 className="font-medium">Price Quote:</h4>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Base Price:</span>
                            <span>${service.basePrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Distance Fee ({distance} km × ${service.pricePerKm}/km):</span>
                            <span>${(distance * service.pricePerKm).toFixed(2)}</span>
                          </div>
                          <div className="border-t pt-1 font-medium flex justify-between">
                            <span>Total Price:</span>
                            <span>${price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Step 3: Date & Time */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Appointment Date & Time</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                      </label>
                      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(newDate) => {
                              setDate(newDate);
                              setCalendarOpen(false);
                            }}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                              date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time Slot *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={selectedTimeSlot === time ? "default" : "outline"}
                            className="text-sm py-1"
                            onClick={() => setSelectedTimeSlot(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Step 4: Additional Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes <span className="text-gray-400">(Optional)</span>
                  </label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or requirements"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    size="lg"
                    disabled={
                      isProcessing || 
                      !customerName || 
                      !customerEmail || 
                      !customerPhone || 
                      !address || 
                      !date || 
                      !selectedTimeSlot || 
                      distance === null || 
                      price === null
                    }
                  >
                    Submit Booking Request
                  </Button>
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Your booking will be reviewed by our admin. Payment will only be required after approval.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookServicePage;
