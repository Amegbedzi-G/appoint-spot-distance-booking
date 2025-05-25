
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useAppointments } from '@/contexts/appointment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import PaymentMethodSelector from '@/components/payment/PaymentMethodSelector';
import PaymentProcessor from '@/components/payment/PaymentProcessor';

const PaymentPage = () => {
  const { user, isAuthenticated, checkApprovalStatus, setPaymentComplete } = useAuth();
  const { bookAppointment } = useAppointments();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  // Get booking data from location state if available
  const bookingData = location.state?.bookingData;
  const price = bookingData?.price || 49.99;

  // Customer information for payment
  const customerEmail = bookingData?.customerEmail || user?.email || '';
  const customerName = bookingData?.customerName || user?.name || '';

  // Check authentication when component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/payment' } });
      return;
    }

    const checkStatus = async () => {
      setIsChecking(true);

      try {
        // Check if the user's account is approved
        const isApproved = await checkApprovalStatus();
        
        if (!isApproved) {
          toast.error('Your account has not been approved yet');
          navigate('/');
          return;
        }
        
        // If there's no booking in progress and user has already paid
        if (!bookingData && user?.hasPaid) {
          toast.info('You have already completed payment');
          navigate('/services');
          return;
        }
      } catch (error) {
        console.error('Error checking status:', error);
        toast.error('Error checking your account status');
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, [isAuthenticated, navigate, user, checkApprovalStatus, bookingData]);

  const handlePaymentSuccess = async () => {
    try {
      setIsProcessing(true);
      setPaymentCompleted(true);
      
      // Show success message immediately
      toast.success(`Payment successful via ${getPaymentMethodName()}!`);
      
      // Update payment status in the user profile
      await setPaymentComplete();
      
      // If this was for a new booking, create the appointment
      if (bookingData) {
        console.log('Creating appointment with booking data:', bookingData);
        
        const newAppointment = await bookAppointment({
          serviceId: bookingData.serviceId,
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          customerPhone: bookingData.customerPhone,
          date: bookingData.date,
          timeSlot: bookingData.timeSlot,
          location: bookingData.location,
          distance: bookingData.distance,
          price: bookingData.price,
          notes: bookingData.notes,
        });
        
        // Navigate to booking confirmation with the appointment ID
        setTimeout(() => {
          navigate(`/booking/confirmation/${newAppointment.id}`, { 
            state: { 
              paymentMethod: getPaymentMethodName(),
              paymentCompleted: true
            },
            replace: true
          });
        }, 1500);
      } else {
        // Regular payment flow - redirect to services
        setTimeout(() => {
          navigate('/services', { replace: true });
        }, 1500);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Error processing payment. Please try again.');
      setPaymentCompleted(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error || 'Payment failed. Please try again.');
    setIsProcessing(false);
    setPaymentCompleted(false);
  };
  
  const getPaymentMethodName = () => {
    const methodNames: Record<string, string> = {
      paystack: 'Paystack',
      flutterwave: 'Flutterwave',
      bank: 'Bank Transfer',
      bitcoin: 'Bitcoin'
    };
    
    return methodNames[paymentMethod] || methodNames.bank;
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-lg font-medium">Checking your account status...</p>
          <p className="text-sm text-gray-500">Please wait while we verify your information</p>
        </div>
      </div>
    );
  }

  // Show payment success UI
  if (paymentCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            <CardDescription>
              Your payment has been processed successfully via {getPaymentMethodName()}.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Amount Paid:</span> ${price.toFixed(2)}
                </p>
                <p className="text-sm text-green-800 mt-1">
                  <span className="font-medium">Payment Method:</span> {getPaymentMethodName()}
                </p>
              </div>
              
              {bookingData ? (
                <p className="text-sm text-gray-600">
                  Redirecting to your booking confirmation...
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Redirecting to services page...
                </p>
              )}
              
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-500">Please wait...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {bookingData ? 'Complete Your Booking' : 'Complete Your Registration'}
          </CardTitle>
          <CardDescription>
            {bookingData 
              ? 'Make a payment to confirm your booking.' 
              : 'Make a one-time payment to access all services.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Admin Approval</p>
              <p className="text-sm text-gray-500">Your account has been approved by an administrator</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">
                {bookingData ? 'Booking Fee' : 'Registration Fee'}
              </span>
              <span className="font-bold text-lg">${price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500">
              {bookingData 
                ? 'This payment confirms your booking.'
                : 'This payment provides access to all services and features.'
              }
            </p>
            
            {bookingData && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Service:</span> {bookingData.serviceId}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span> {bookingData.date}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Time:</span> {bookingData.timeSlot}
                </p>
              </div>
            )}
          </div>
          
          <PaymentMethodSelector 
            value={paymentMethod} 
            onChange={setPaymentMethod} 
          />
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">
              This is a demo payment integration. For production, you'll need to configure the Paystack and Flutterwave API keys.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <PaymentProcessor 
            paymentMethod={paymentMethod}
            price={price}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            customerEmail={customerEmail}
            customerName={customerName}
            reference={`tx-${Date.now()}`}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentPage;
