
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { PaystackButton } from '@/components/payment/PaystackButton';
import { FlutterwaveButton } from '@/components/payment/FlutterwaveButton';

interface PaymentProcessorProps {
  paymentMethod: string;
  price: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  customerEmail: string;
  customerName: string;
  reference?: string;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ 
  paymentMethod, 
  price, 
  onSuccess, 
  onError,
  isProcessing,
  setIsProcessing,
  customerEmail,
  customerName,
  reference = `tx-${Date.now()}`
}) => {
  // This is for bank transfer or bitcoin payment methods
  const handleRegularPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing Payment...
        </>
      );
    }
    
    const methodLabels: Record<string, string> = {
      bank: 'Bank Transfer',
      bitcoin: 'Bitcoin'
    };
    
    return (
      <>
        Pay ${price.toFixed(2)} with {methodLabels[paymentMethod] || methodLabels.bank}
        <ArrowRight className="ml-2 h-4 w-4" />
      </>
    );
  };

  // Render appropriate payment button based on selected method
  if (paymentMethod === 'paystack') {
    return (
      <PaystackButton 
        amount={price * 100} // Convert to lowest currency unit (kobo/cents)
        email={customerEmail}
        name={customerName}
        reference={reference}
        onSuccess={onSuccess}
        onError={onError}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    );
  }

  if (paymentMethod === 'flutterwave') {
    return (
      <FlutterwaveButton
        amount={price}
        customerEmail={customerEmail}
        customerName={customerName}
        reference={reference}
        onSuccess={onSuccess}
        onError={onError}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    );
  }

  // For other payment methods (bank, bitcoin)
  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleRegularPayment}
      disabled={isProcessing}
    >
      {getButtonLabel()}
    </Button>
  );
};

export default PaymentProcessor;
