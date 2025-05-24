
import React from 'react';
import { CalendarCheck, Clock, MapPin } from 'lucide-react';
import { Appointment } from '@/contexts/appointment';
import { Service } from '@/contexts/ServiceContext';

interface BookingDetailsCardProps {
  appointment: Appointment;
  service: Service | undefined;
  paymentMethod: string;
}

const BookingDetailsCard = ({ appointment, service, paymentMethod }: BookingDetailsCardProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 border mb-6">
      <h3 className="font-medium text-lg mb-4">Booking Details</h3>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="min-w-[24px] mr-3">
            <CalendarCheck className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <p className="font-medium">Service</p>
            <p className="text-gray-600">{service?.name || 'Unknown Service'}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="min-w-[24px] mr-3">
            <Clock className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <p className="font-medium">Date & Time</p>
            <p className="text-gray-600">
              {appointment.date} @ {appointment.timeSlot}
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="min-w-[24px] mr-3">
            <MapPin className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <p className="font-medium">Location</p>
            <p className="text-gray-600">{appointment.location.address}</p>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between">
            <span className="font-medium">Total Paid:</span>
            <span className="font-bold">${appointment.price.toFixed(2)}</span>
          </div>
          <div className="text-xs text-gray-500 text-right mt-1">
            via {paymentMethod}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsCard;
