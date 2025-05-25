
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useAppointments } from '@/contexts/appointment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, CreditCard, CheckCircle, XCircle, Clock3 } from 'lucide-react';

const BookingsPage = () => {
  const { user } = useAuth();
  const { appointments } = useAppointments();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  
  // Filter appointments for the current user
  const userAppointments = appointments.filter(appointment => 
    appointment.customerEmail === user?.email
  );
  
  // Categorize bookings based on their status
  const pendingPaymentBookings = userAppointments.filter(
    appointment => appointment.status === 'approved' // Admin approved, waiting for payment
  );
  
  const upcomingBookings = userAppointments.filter(
    appointment => appointment.status === 'completed' // Paid bookings
  );
  
  const pendingApprovalBookings = userAppointments.filter(
    appointment => appointment.status === 'pending' // Waiting for admin approval
  );

  const declinedBookings = userAppointments.filter(
    appointment => appointment.status === 'declined' // Admin declined
  );

  const getServiceName = (serviceId: string) => {
    const serviceNames: Record<string, string> = {
      '1': 'Standard Cleaning',
      '2': 'Deep Cleaning', 
      '3': 'Move-in/Move-out Cleaning'
    };
    return serviceNames[serviceId] || 'Service';
  };

  const handlePayment = (appointment: any) => {
    navigate('/payment', {
      state: {
        bookingData: {
          serviceId: appointment.serviceId,
          customerName: appointment.customerName,
          customerEmail: appointment.customerEmail,
          customerPhone: appointment.customerPhone,
          date: appointment.date,
          timeSlot: appointment.timeSlot,
          location: appointment.location,
          distance: appointment.distance,
          price: appointment.price,
          notes: appointment.notes,
        }
      }
    });
  };

  const BookingCard = ({ appointment, showPayButton = false, status }: any) => {
    const getStatusBadge = () => {
      switch (status) {
        case 'upcoming':
          return (
            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300">
              <CheckCircle className="h-3 w-3 mr-1" />
              Confirmed
            </Badge>
          );
        case 'payment':
          return (
            <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300">
              <CreditCard className="h-3 w-3 mr-1" />
              Payment Required
            </Badge>
          );
        case 'pending':
          return (
            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-300">
              <Clock3 className="h-3 w-3 mr-1" />
              Pending Approval
            </Badge>
          );
        case 'declined':
          return (
            <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-300">
              <XCircle className="h-3 w-3 mr-1" />
              Declined
            </Badge>
          );
        default:
          return null;
      }
    };

    return (
      <div className={`border rounded-lg p-4 ${status === 'upcoming' ? 'border-green-200 bg-green-50' : status === 'declined' ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="font-medium text-lg">{getServiceName(appointment.serviceId)}</h3>
              {getStatusBadge()}
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {appointment.date}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {appointment.timeSlot}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {appointment.location.address}
              </div>
            </div>
            
            {appointment.notes && (
              <div className="mt-3 p-2 bg-gray-100 rounded text-sm">
                <strong>Notes:</strong> {appointment.notes}
              </div>
            )}
          </div>
          
          <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col items-end justify-between">
            <div className="text-right">
              <p className="font-bold text-lg">${appointment.price.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{appointment.distance.toFixed(1)} km</p>
            </div>
            
            {showPayButton && (
              <Button 
                onClick={() => handlePayment(appointment)}
                className="mt-2 bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <CreditCard className="h-4 w-4 mr-1" />
                Pay Now
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <Link to="/services">
            <Button>Book New Service</Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Booking Management</CardTitle>
            <CardDescription>
              View and manage your service bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="payment">
                  Payment Required ({pendingPaymentBookings.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending Approval ({pendingApprovalBookings.length})
                </TabsTrigger>
                <TabsTrigger value="declined">
                  Declined ({declinedBookings.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-4">
                {upcomingBookings.length > 0 ? (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                        <div>
                          <p className="font-medium text-green-800">Confirmed Bookings</p>
                          <p className="text-sm text-green-700">
                            These bookings have been paid for and confirmed. Our team will contact you soon.
                          </p>
                        </div>
                      </div>
                    </div>
                    {upcomingBookings.map((appointment) => (
                      <BookingCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        status="upcoming"
                      />
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No upcoming bookings</p>
                    <p className="text-sm text-gray-400">Your confirmed bookings will appear here</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="payment" className="space-y-4">
                {pendingPaymentBookings.length > 0 ? (
                  <>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <CreditCard className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                        <div>
                          <p className="font-medium text-yellow-800">Payment Required</p>
                          <p className="text-sm text-yellow-700">
                            Your bookings have been approved and are ready for payment. Complete payment to confirm your appointments.
                          </p>
                        </div>
                      </div>
                    </div>
                    {pendingPaymentBookings.map((appointment) => (
                      <BookingCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        showPayButton={true}
                        status="payment"
                      />
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No bookings requiring payment</p>
                    <p className="text-sm text-gray-400">All your approved bookings have been paid for</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pending" className="space-y-4">
                {pendingApprovalBookings.length > 0 ? (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <Clock3 className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                        <div>
                          <p className="font-medium text-blue-800">Awaiting Approval</p>
                          <p className="text-sm text-blue-700">
                            These bookings are waiting for admin approval. You'll be notified when they're approved.
                          </p>
                        </div>
                      </div>
                    </div>
                    {pendingApprovalBookings.map((appointment) => (
                      <BookingCard 
                        key={appointment.id} 
                        appointment={appointment}
                        status="pending"
                      />
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Clock3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No pending bookings</p>
                    <p className="text-sm text-gray-400">Your submitted bookings will appear here while awaiting approval</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="declined" className="space-y-4">
                {declinedBookings.length > 0 ? (
                  <>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                        <div>
                          <p className="font-medium text-red-800">Declined Bookings</p>
                          <p className="text-sm text-red-700">
                            These bookings were declined by our admin. You can book new services from the services page.
                          </p>
                        </div>
                      </div>
                    </div>
                    {declinedBookings.map((appointment) => (
                      <BookingCard 
                        key={appointment.id} 
                        appointment={appointment}
                        status="declined"
                      />
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No declined bookings</p>
                    <p className="text-sm text-gray-400">Declined bookings would appear here</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingsPage;
