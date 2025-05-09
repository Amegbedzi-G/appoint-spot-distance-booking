
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useServices } from '@/contexts/ServiceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Mail, Phone, CheckCircle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const BookingConfirmationPage = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { getAppointmentById } = useAppointments();
  const { getServiceById } = useServices();
  
  const [appointment, setAppointment] = useState(
    appointmentId ? getAppointmentById(appointmentId) : undefined
  );
  const [service, setService] = useState(
    appointment ? getServiceById(appointment.serviceId) : undefined
  );
  
  useEffect(() => {
    if (appointmentId) {
      const foundAppointment = getAppointmentById(appointmentId);
      setAppointment(foundAppointment);
      
      if (foundAppointment) {
        const foundService = getServiceById(foundAppointment.serviceId);
        setService(foundService);
      }
    }
  }, [appointmentId, getAppointmentById, getServiceById]);
  
  if (!appointment || !service) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <p className="text-gray-600">Booking not found. Please check your booking reference.</p>
          <Link to="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container py-10">
      <div className="max-w-3xl mx-auto">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <div className="flex justify-center text-green-600 mb-2">
              <CheckCircle className="h-16 w-16" />
            </div>
            <CardTitle className="text-center text-2xl text-green-800">
              Booking Request Submitted!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-6">
              Your booking request has been successfully submitted and is pending approval. 
              You will receive an email notification when the admin approves your booking.
            </p>
            
            <div className="bg-white rounded-lg p-6 border border-green-200 mb-6">
              <h3 className="font-medium mb-4 text-lg">Booking Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-brand-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Appointment Date</p>
                      <p className="font-medium">{format(new Date(appointment.date), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 text-brand-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Time Slot</p>
                      <p className="font-medium">{appointment.timeSlot}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-brand-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Service Location</p>
                      <p className="font-medium">{appointment.location.address}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium">{service.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{service.duration} minutes</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="font-medium">${appointment.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      (Base: ${service.basePrice.toFixed(2)} + Distance fee: ${(appointment.distance * service.pricePerKm).toFixed(2)})
                    </p>
                  </div>
                </div>
              </div>
              
              <hr className="my-4 border-gray-200" />
              
              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Name:</span>
                    <span>{appointment.customerName}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{appointment.customerEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{appointment.customerPhone}</span>
                  </div>
                </div>
              </div>
              
              {appointment.notes && (
                <>
                  <hr className="my-4 border-gray-200" />
                  <div>
                    <h4 className="font-medium mb-2">Additional Notes</h4>
                    <p className="text-gray-700">{appointment.notes}</p>
                  </div>
                </>
              )}
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Reference ID: <span className="font-mono font-medium">{appointment.id}</span>
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Link to="/">
                  <Button>
                    Return Home
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline">
                    Browse More Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
