
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';

const BookingConfirmationHeader = () => {
  return (
    <CardHeader className="text-center pb-2">
      <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
    </CardHeader>
  );
};

export default BookingConfirmationHeader;
