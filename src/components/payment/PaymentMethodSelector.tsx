
import React from 'react';
import { CreditCard, Bitcoin, Wallet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaystackIcon } from './PaystackIcon';
import { FlutterwaveIcon } from './FlutterwaveIcon';

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ value, onChange }) => {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="paystack">Paystack</TabsTrigger>
        <TabsTrigger value="flutterwave">Flutterwave</TabsTrigger>
        <TabsTrigger value="bank">Bank</TabsTrigger>
        <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
      </TabsList>
      
      <TabsContent value="paystack" className="mt-4">
        <div className="rounded-lg p-4 border border-green-200 bg-green-50">
          <p className="text-sm text-gray-700 mb-2">Pay using Paystack</p>
          <PaystackIcon className="h-10 w-10 text-green-600 mx-auto" />
        </div>
      </TabsContent>
      
      <TabsContent value="flutterwave" className="mt-4">
        <div className="rounded-lg p-4 border border-orange-200 bg-orange-50">
          <p className="text-sm text-gray-700 mb-2">Pay using Flutterwave</p>
          <FlutterwaveIcon className="h-10 w-10 text-orange-600 mx-auto" />
        </div>
      </TabsContent>
      
      <TabsContent value="bank" className="mt-4">
        <div className="rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-700 mb-2">Pay using your bank account</p>
          <CreditCard className="h-10 w-10 text-gray-400 mx-auto" />
        </div>
      </TabsContent>
      
      <TabsContent value="bitcoin" className="mt-4">
        <div className="rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-700 mb-2">Pay using Bitcoin</p>
          <Bitcoin className="h-10 w-10 text-orange-500 mx-auto" />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PaymentMethodSelector;
