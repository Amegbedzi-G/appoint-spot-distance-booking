
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, CreditCard, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const PaymentPage = () => {
  const { user, isAuthenticated, checkApprovalStatus, setPaymentComplete } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/payment' } });
      return;
    }

    // Check if the user is approved
    const checkApproval = async () => {
      setIsChecking(true);
      const isApproved = await checkApprovalStatus();
      setIsChecking(false);
      
      if (!isApproved) {
        toast.error('Your account has not been approved yet');
        navigate('/');
      } else if (user?.hasPaid) {
        toast.info('You have already completed payment');
        navigate('/services');
      }
    };
    
    checkApproval();
  }, [isAuthenticated, navigate, user, checkApprovalStatus]);

  const handleMockPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment status in the user profile
      await setPaymentComplete();
      
      toast.success('Payment successful!');
      navigate('/services');
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
          <CardTitle className="text-2xl">Complete Your Registration</CardTitle>
          <CardDescription>Your account has been approved! Make a payment to continue.</CardDescription>
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
              <p className="text-sm text-gray-500">Complete a one-time payment to access all services</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Registration Fee</span>
              <span className="font-bold">$49.99</span>
            </div>
            <p className="text-sm text-gray-500">
              This payment provides access to all services and features.
            </p>
          </div>
          
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
                Complete Payment
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
