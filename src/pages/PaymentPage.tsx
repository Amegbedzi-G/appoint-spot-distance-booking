
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, CreditCard, ArrowRight, Bitcoin, Wallet } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PaymentPage = () => {
  const { user, isAuthenticated, checkApprovalStatus, setPaymentComplete } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  
  // Get booking data from location state if available
  const bookingData = location.state?.bookingData;
  const price = bookingData?.price || 49.99;

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

  const handleMockPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment status in the user profile
      await setPaymentComplete();
      
      const paymentMethodName = paymentMethod === 'bank' ? 'Bank' : paymentMethod === 'paypal' ? 'PayPal' : 'Bitcoin';
      toast.success(`Payment successful via ${paymentMethodName}!`);
      
      // If this was for a new booking, continue with the booking process
      if (bookingData) {
        // Navigate to booking confirmation with the booking data
        navigate('/booking/confirmation', { 
          state: { 
            ...bookingData,
            paymentMethod: paymentMethodName,
            paymentCompleted: true
          } 
        });
      } else {
        // Regular payment flow - redirect to services
        setTimeout(() => {
          navigate('/services');
        }, 1000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
          <p className="mt-4">Checking your account status...</p>
        </div>
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
          
          <div className="flex items-center space-x-4">
            <div className="bg-brand-100 p-2 rounded-full">
              <CreditCard className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <p className="font-medium">Payment Required</p>
              <p className="text-sm text-gray-500">
                {bookingData 
                  ? 'Complete payment to confirm your booking' 
                  : 'Complete a one-time payment to access all services'
                }
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">
                {bookingData ? 'Booking Fee' : 'Registration Fee'}
              </span>
              <span className="font-bold">${price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500">
              {bookingData 
                ? 'This payment confirms your booking.'
                : 'This payment provides access to all services and features.'
              }
            </p>
          </div>
          
          <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bank">Bank</TabsTrigger>
              <TabsTrigger value="paypal">PayPal</TabsTrigger>
              <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bank" className="mt-4">
              <div className="rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-700 mb-2">Pay using your bank account</p>
                <CreditCard className="h-10 w-10 text-gray-400 mx-auto" />
              </div>
            </TabsContent>
            
            <TabsContent value="paypal" className="mt-4">
              <div className="rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-700 mb-2">Pay using PayPal</p>
                <Wallet className="h-10 w-10 text-blue-500 mx-auto" />
              </div>
            </TabsContent>
            
            <TabsContent value="bitcoin" className="mt-4">
              <div className="rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-700 mb-2">Pay using Bitcoin</p>
                <Bitcoin className="h-10 w-10 text-orange-500 mx-auto" />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">
              This is a demo payment. No actual charges will be processed.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            onClick={handleMockPayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>Processing<span className="animate-pulse">...</span></>
            ) : (
              <>
                Pay with {paymentMethod === 'bank' ? 'Bank' : paymentMethod === 'paypal' ? 'PayPal' : 'Bitcoin'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentPage;
