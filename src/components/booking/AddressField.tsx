
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { BookingFormValues } from './types';

interface AddressFieldProps {
  form: UseFormReturn<BookingFormValues>;
}

const AddressField: React.FC<AddressFieldProps> = ({ form }) => {
  const addressValue = form.watch('address');
  
  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Service Address</FormLabel>
          <FormControl>
            <div className="relative">
              <Input placeholder="Enter your address" {...field} />
              {field.value.length > 5 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                  <MapPin className="h-4 w-4" />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AddressField;
