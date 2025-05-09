
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useServices } from '@/contexts/ServiceContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Check, MapPin, Calendar, Clock, Mail, Phone, DollarSign, ThumbsDown, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const AppointmentDetailsPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { getAppointmentById, updateAppointmentStatus } = useAppointments();
  const { getServiceById } = useServices();
  
  const [appointment, setAppointment] = useState(
    appointmentId ? getAppointmentById(appointmentId) : undefined
  );
  const [service, setService] = useState(
    appointment ? getServiceById(appointment.serviceId) : undefined
  );
  
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  
  // Load appointment and service data
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
  
  // Handle approval confirmation
  const handleApprove = () => {
    if (!appointment) return;
    updateAppointmentStatus(appointment.id, 'approved');
    toast.success('Appointment approved successfully');
    setIsApproveDialogOpen(false);
    // Refresh appointment data
    setAppointment(getAppointmentById(appointment.id));
  };
  
  // Handle decline confirmation
  const handleDecline = () => {
    if (!appointment) return;
    updateAppointmentStatus(appointment.id, 'declined');
    toast.success('Appointment declined');
    setIsDeclineDialogOpen(false);
    setDeclineReason('');
    // Refresh appointment data
    setAppointment(getAppointmentById(appointment.id));
  };
  
  if (!appointment || !service) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <p className="text-gray-600">Appointment not found</p>
          <Button className="mt-4" onClick={() => navigate('/admin/appointments')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Appointments
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container py-10">
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin/appointments')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Appointments
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Appointment Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Appointment Details</CardTitle>
                  <CardDescription>
                    Booked on {format(new Date(appointment.createdAt), 'MMMM d, yyyy')}
                  </CardDescription>
                </div>
                <div>
                  {appointment.status === 'pending' && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                      Pending
                    </Badge>
                  )}
                  {appointment.status === 'approved' && (
                    <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
                      Approved
                    </Badge>
                  )}
                  {appointment.status === 'declined' && (
                    <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">
                      Declined
                    </Badge>
                  )}
                  {appointment.status === 'completed' && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Appointment Date & Time</h3>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-brand-500" />
                        <span className="font-medium">
                          {format(new Date(appointment.date), 'MMMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-5 w-5 text-brand-500" />
                        <span>{appointment.timeSlot}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Service</h3>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                      <p>{service.duration} minutes</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Customer Information</h3>
                      <p className="font-medium">{appointment.customerName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a href={`mailto:${appointment.customerEmail}`} className="text-brand-600 hover:underline">
                          {appointment.customerEmail}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <a href={`tel:${appointment.customerPhone}`} className="text-brand-600 hover:underline">
                          {appointment.customerPhone}
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Service Location</h3>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-5 w-5 text-brand-500 mt-0.5" />
                        <div>
                          <p>{appointment.location.address}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {appointment.distance} km from provider location
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Price Details</h3>
                      <div className="bg-brand-50 p-3 rounded-md">
                        <div className="flex justify-between text-sm">
                          <span>Base Price:</span>
                          <span>${service.basePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Distance Fee ({appointment.distance} km × ${service.pricePerKm}/km):</span>
                          <span>${(appointment.distance * service.pricePerKm).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium mt-2 pt-2 border-t border-brand-100">
                          <span>Total Price:</span>
                          <span>${appointment.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {appointment.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Notes</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-gray-700">{appointment.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Admin Actions */}
          {appointment.status === 'pending' && (
            <div className="flex flex-wrap gap-3">
              <Button
                className="flex-1"
                onClick={() => setIsApproveDialogOpen(true)}
              >
                <Check className="mr-2 h-4 w-4" />
                Approve Appointment
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-200 hover:bg-red-50 text-red-600"
                onClick={() => setIsDeclineDialogOpen(true)}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Decline Appointment
              </Button>
            </div>
          )}
        </div>
        
        {/* Payment Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              {appointment.status === 'approved' ? (
                <div>
                  <div className="bg-green-50 text-green-800 p-3 rounded-md mb-4">
                    <p className="text-sm">
                      Payment link has been sent to the customer's email.
                    </p>
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-medium">${appointment.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="font-medium text-amber-600">Awaiting payment</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button className="w-full" variant="outline" disabled>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Mark as Paid
                    </Button>
                  </div>
                </div>
              ) : appointment.status === 'declined' ? (
                <div className="text-center py-3">
                  <p className="text-gray-500">
                    This appointment has been declined and no payment is required.
                  </p>
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="text-gray-500">
                    Payment will be processed after appointment approval.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Appointment</DialogTitle>
            <DialogDescription>
              Approving this appointment will send a payment link to the customer's email. 
              They will be asked to complete the payment to confirm the booking.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-800">
                An automated email will be sent to {appointment.customerEmail} with payment instructions.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              <Check className="mr-2 h-4 w-4" />
              Approve & Send Payment Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Decline Dialog */}
      <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Appointment</DialogTitle>
            <DialogDescription>
              Declining this appointment will notify the customer that their booking request has been rejected.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="reason" className="text-sm font-medium text-gray-700 block mb-1">
                Reason for declining (optional)
              </label>
              <Textarea
                id="reason"
                placeholder="Enter reason for declining"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">
                An automated email will be sent to {appointment.customerEmail} notifying them of the declined booking.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeclineDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDecline}>
              <ThumbsDown className="mr-2 h-4 w-4" />
              Decline Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentDetailsPage;
