
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';

interface PaymentProcessorProps {
  paymentMethod: string;
  price: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ 
  paymentMethod, 
  price, 
  onSuccess, 
  onError,
  isProcessing,
  setIsProcessing 
}) => {
  // This is a mock implementation that will be replaced with actual APIs
  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, we would integrate with the selected payment gateway here
      // For now, we'll just simulate a successful payment
      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      onError(typeof error === 'string' ? error : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtonLabel = () => {
    if (isProcessing) {
      return <>Processing<span className="animate-pulse">...</span></>;
    }
    
    const methodLabels: Record<string, string> = {
      paystack: 'Paystack',
      flutterwave: 'Flutterwave',
      bank: 'Bank',
      bitcoin: 'Bitcoin'
    };
    
    return (
      <>
        Pay with {methodLabels[paymentMethod] || methodLabels.bank}
        <ArrowRight className="ml-2 h-4 w-4" />
      </>
    );
  };

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handlePayment}
      disabled={isProcessing}
    >
      {getButtonLabel()}
    </Button>
  );
};

export default PaymentProcessor;
