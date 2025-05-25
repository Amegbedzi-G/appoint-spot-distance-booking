
import { Calendar, Clock, MapPin, CreditCard, CheckCircle, XCircle, Clock3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/contexts/appointment';

interface BookingCardProps {
  appointment: Appointment;
  showPayButton?: boolean;
  status: 'upcoming' | 'payment' | 'pending' | 'declined';
  onPayment: (appointment: Appointment) => void;
}

const BookingCard = ({ appointment, showPayButton = false, status, onPayment }: BookingCardProps) => {
  const getServiceName = (serviceId: string) => {
    const serviceNames: Record<string, string> = {
      '1': 'Standard Cleaning',
      '2': 'Deep Cleaning', 
      '3': 'Move-in/Move-out Cleaning'
    };
    return serviceNames[serviceId] || 'Service';
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'upcoming':
        return (
          <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'payment':
        return (
          <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300">
            <CreditCard className="h-3 w-3 mr-1" />
            Payment Required
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-300">
            <Clock3 className="h-3 w-3 mr-1" />
            Pending Approval
          </Badge>
        );
      case 'declined':
        return (
          <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            Declined
          </Badge>
        );
      default:
        return null;
    }
  };

  const cardClassName = `border rounded-lg p-4 ${
    status === 'upcoming' 
      ? 'border-green-200 bg-green-50' 
      : status === 'declined' 
      ? 'border-red-200 bg-red-50' 
      : 'border-gray-200'
  }`;

  return (
    <div className={cardClassName}>
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="font-medium text-lg">{getServiceName(appointment.serviceId)}</h3>
            {getStatusBadge()}
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {appointment.date}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {appointment.timeSlot}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {appointment.location.address}
            </div>
          </div>
          
          {appointment.notes && (
            <div className="mt-3 p-2 bg-gray-100 rounded text-sm">
              <strong>Notes:</strong> {appointment.notes}
            </div>
          )}
        </div>
        
        <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col items-end justify-between">
          <div className="text-right">
            <p className="font-bold text-lg">${appointment.price.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{appointment.distance.toFixed(1)} km</p>
          </div>
          
          {showPayButton && (
            <Button 
              onClick={() => onPayment(appointment)}
              className="mt-2 bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <CreditCard className="h-4 w-4 mr-1" />
              Pay Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
