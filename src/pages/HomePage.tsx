
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useAppointments } from '@/contexts/AppointmentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CheckCircle, Clock, CreditCard } from 'lucide-react';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { appointments } = useAppointments();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  
  useEffect(() => {
    // If not authenticated, redirect to auth
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    // If admin, redirect to admin dashboard
    if (user?.role === 'admin') {
      navigate('/admin');
      return;
    }
    
    // If not approved yet, stay on homepage
    if (!user?.isApproved) {
      // Stay on homepage with pending approval message
      return;
    }
    
    // If approved but not paid, redirect to payment
    if (user?.isApproved && !user?.hasPaid) {
      navigate('/payment');
      return;
    }
  }, [isAuthenticated, navigate, user]);
  
  // Filter appointments for the current user
  const userAppointments = appointments.filter(appointment => 
    appointment.customerEmail === user?.email
  );
  
  // Filter appointments by status
  const pendingAppointments = userAppointments.filter(
    appointment => appointment.status === 'pending'
  );
  
  const approvedAppointments = userAppointments.filter(
    appointment => appointment.status === 'approved'
  );
  
  const declinedAppointments = userAppointments.filter(
    appointment => appointment.status === 'declined'
  );
  
  const completedAppointments = userAppointments.filter(
    appointment => appointment.status === 'completed'
  );
  
  // Find if there's any approved appointment that needs payment
  const hasApprovedAppointment = approvedAppointments.length > 0;
  
  const upcomingAppointments = [...pendingAppointments, ...approvedAppointments];
  const pastAppointments = [...completedAppointments, ...declinedAppointments];
  
  return (
    <div className="page-container py-10">
      <div className="max-w-4xl mx-auto">
        {!user?.isApproved ? (
          // User is pending approval
          <Card>
            <CardHeader>
              <CardTitle>Account Pending Approval</CardTitle>
              <CardDescription>
                Your account is currently being reviewed by an administrator.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <p className="text-yellow-800">
                  Thank you for registering! An administrator will review your account shortly.
                  You'll receive a notification when your account is approved.
                </p>
              </div>
              
              <p className="text-gray-600 mb-4">
                Once approved, you'll be able to browse our services and book appointments.
              </p>
            </CardContent>
          </Card>
        ) : user?.isApproved && !user?.hasPaid ? (
          // User is approved but needs to complete payment
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Registration</CardTitle>
              <CardDescription>
                Your account has been approved! Please complete the payment to access all services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                  <p className="text-green-800">
                    Great news! Your account has been approved by our administrators.
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                To complete your registration and gain access to all services, please proceed with the one-time payment.
              </p>
              
              <Link to="/payment">
                <Button className="w-full sm:w-auto">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Complete Payment
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          // User is fully registered
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Your Dashboard</h1>
              <Link to="/services">
                <Button>Book New Service</Button>
              </Link>
            </div>
            
            {hasApprovedAppointment && (
              <Card className="mb-6 border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                      <p className="font-medium text-green-800">
                        You have appointments that require payment
                      </p>
                    </div>
                    <Link to="/payment">
                      <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-100">
                        Make Payment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
                <CardDescription>
                  View and manage your upcoming and past appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="declined">Declined</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming" className="space-y-4">
                    {pendingAppointments.length > 0 ? (
                      pendingAppointments.map((appointment) => (
                        <div 
                          key={appointment.id}
                          className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between"
                        >
                          <div>
                            <div className="flex items-center mb-2">
                              <h3 className="font-medium text-lg">
                                {appointment.serviceId === '1' ? 'Standard Cleaning' : 
                                 appointment.serviceId === '2' ? 'Deep Cleaning' : 
                                 appointment.serviceId === '3' ? 'Move-in/Move-out Cleaning' : 
                                 'Service'}
                              </h3>
                              
                              <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                                Pending Approval
                              </Badge>
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {appointment.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {appointment.timeSlot}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 sm:mt-0 flex flex-col items-end justify-between">
                            <div className="text-right">
                              <p className="font-medium">${appointment.price.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">{appointment.distance.toFixed(1)} km</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">You don't have any pending appointments</p>
                        <Link to="/services">
                          <Button className="mt-4">Book a Service</Button>
                        </Link>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="approved" className="space-y-4">
                    {approvedAppointments.length > 0 ? (
                      approvedAppointments.map((appointment) => (
                        <div 
                          key={appointment.id}
                          className="border border-green-300 bg-green-50 rounded-lg p-4 flex flex-col sm:flex-row justify-between"
                        >
                          <div>
                            <div className="flex items-center mb-2">
                              <h3 className="font-medium text-lg">
                                {appointment.serviceId === '1' ? 'Standard Cleaning' : 
                                 appointment.serviceId === '2' ? 'Deep Cleaning' : 
                                 appointment.serviceId === '3' ? 'Move-in/Move-out Cleaning' : 
                                 'Service'}
                              </h3>
                              
                              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300">
                                Approved
                              </Badge>
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {appointment.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {appointment.timeSlot}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 sm:mt-0 flex flex-col items-end justify-between">
                            <div className="text-right">
                              <p className="font-medium">${appointment.price.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">{appointment.distance.toFixed(1)} km</p>
                            </div>
                            
                            <Link to="/payment" className="mt-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CreditCard className="h-4 w-4 mr-1" />
                                Pay Now
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">You don't have any approved appointments</p>
                        <Link to="/services">
                          <Button className="mt-4">Book a Service</Button>
                        </Link>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="declined" className="space-y-4">
                    {declinedAppointments.length > 0 ? (
                      declinedAppointments.map((appointment) => (
                        <div 
                          key={appointment.id}
                          className="border border-red-200 bg-red-50 rounded-lg p-4 flex flex-col sm:flex-row justify-between"
                        >
                          <div>
                            <div className="flex items-center mb-2">
                              <h3 className="font-medium text-lg">
                                {appointment.serviceId === '1' ? 'Standard Cleaning' : 
                                 appointment.serviceId === '2' ? 'Deep Cleaning' : 
                                 appointment.serviceId === '3' ? 'Move-in/Move-out Cleaning' : 
                                 'Service'}
                              </h3>
                              
                              <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-300">
                                Declined
                              </Badge>
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {appointment.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {appointment.timeSlot}
                              </div>
                              {appointment.notes && (
                                <div className="mt-2 p-2 bg-red-100 rounded text-red-700 text-xs">
                                  <strong>Reason:</strong> {appointment.notes}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-3 sm:mt-0 text-right">
                            <p className="font-medium">${appointment.price.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">{appointment.distance.toFixed(1)} km</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">You don't have any declined appointments</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
