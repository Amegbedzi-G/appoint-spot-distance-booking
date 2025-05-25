
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useAppointments } from '@/contexts/appointment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingCard from '@/components/booking/BookingCard';
import BookingStatusInfo from '@/components/booking/BookingStatusInfo';
import EmptyBookingState from '@/components/booking/EmptyBookingState';
import { categorizeBookings } from '@/utils/bookingUtils';

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
  const { pending, approved, completed, declined } = categorizeBookings(userAppointments);

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
                  Upcoming ({completed.length})
                </TabsTrigger>
                <TabsTrigger value="payment">
                  Payment Required ({approved.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending Approval ({pending.length})
                </TabsTrigger>
                <TabsTrigger value="declined">
                  Declined ({declined.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-4">
                {completed.length > 0 ? (
                  <>
                    <BookingStatusInfo type="upcoming" />
                    {completed.map((appointment) => (
                      <BookingCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        status="upcoming"
                        onPayment={handlePayment}
                      />
                    ))}
                  </>
                ) : (
                  <EmptyBookingState type="upcoming" />
                )}
              </TabsContent>
              
              <TabsContent value="payment" className="space-y-4">
                {approved.length > 0 ? (
                  <>
                    <BookingStatusInfo type="payment" />
                    {approved.map((appointment) => (
                      <BookingCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        showPayButton={true}
                        status="payment"
                        onPayment={handlePayment}
                      />
                    ))}
                  </>
                ) : (
                  <EmptyBookingState type="payment" />
                )}
              </TabsContent>
              
              <TabsContent value="pending" className="space-y-4">
                {pending.length > 0 ? (
                  <>
                    <BookingStatusInfo type="pending" />
                    {pending.map((appointment) => (
                      <BookingCard 
                        key={appointment.id} 
                        appointment={appointment}
                        status="pending"
                        onPayment={handlePayment}
                      />
                    ))}
                  </>
                ) : (
                  <EmptyBookingState type="pending" />
                )}
              </TabsContent>

              <TabsContent value="declined" className="space-y-4">
                {declined.length > 0 ? (
                  <>
                    <BookingStatusInfo type="declined" />
                    {declined.map((appointment) => (
                      <BookingCard 
                        key={appointment.id} 
                        appointment={appointment}
                        status="declined"
                        onPayment={handlePayment}
                      />
                    ))}
                  </>
                ) : (
                  <EmptyBookingState type="declined" />
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
