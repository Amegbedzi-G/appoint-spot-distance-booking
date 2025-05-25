
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { PaystackIcon } from './PaystackIcon';

interface PaystackButtonProps {
  amount: number;
  email: string;
  name: string;
  reference: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

export const PaystackButton: React.FC<PaystackButtonProps> = ({
  amount,
  email,
  name,
  reference,
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing
}) => {
  const displayAmount = (amount / 100).toFixed(2); // Convert from kobo to dollars

  const handlePayment = () => {
    setIsProcessing(true);
    
    // This is a simulation as we're in demo mode
    // In production, you would use the actual Paystack SDK or API
    console.log('Initiating Paystack payment:', { amount, email, name, reference });
    
    // Simulate payment process
    setTimeout(() => {
      // Simulate successful payment
      console.log('Paystack payment successful');
      setIsProcessing(false);
      onSuccess();
      
      // Uncomment below to simulate failure scenario
      // setIsProcessing(false);
      // onError('Payment failed. Please try again.');
    }, 2000);
  };

  return (
    <Button
      className="w-full bg-green-600 hover:bg-green-700"
      size="lg"
      onClick={handlePayment}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing Payment...
        </>
      ) : (
        <>
          <PaystackIcon className="mr-2 h-4 w-4" />
          Pay ${displayAmount} with Paystack
        </>
      )}
    </Button>
  );
};
