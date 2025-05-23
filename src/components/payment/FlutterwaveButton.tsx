
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FlutterwaveIcon } from './FlutterwaveIcon';

interface FlutterwaveButtonProps {
  amount: number;
  customerEmail: string;
  customerName: string;
  reference: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

export const FlutterwaveButton: React.FC<FlutterwaveButtonProps> = ({
  amount,
  customerEmail,
  customerName,
  reference,
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing
}) => {
  const handlePayment = () => {
    setIsProcessing(true);
    
    // This is a simulation as we're in demo mode
    // In production, you would use the actual Flutterwave SDK or API
    console.log('Initiating Flutterwave payment:', { 
      amount, 
      customerEmail, 
      customerName, 
      reference 
    });
    
    // Simulate payment process
    setTimeout(() => {
      // Simulate successful payment
      console.log('Flutterwave payment successful');
      setIsProcessing(false);
      onSuccess();
      
      // Uncomment below to simulate failure scenario
      // setIsProcessing(false);
      // onError('Payment failed. Please try again.');
    }, 2000);
  };

  return (
    <Button
      className="w-full bg-orange-600 hover:bg-orange-700"
      size="lg"
      onClick={handlePayment}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <FlutterwaveIcon className="mr-2 h-4 w-4" />
          Pay with Flutterwave
        </>
      )}
    </Button>
  );
};
