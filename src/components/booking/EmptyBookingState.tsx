
import { CheckCircle, CreditCard, Clock3, XCircle } from 'lucide-react';

interface EmptyBookingStateProps {
  type: 'upcoming' | 'payment' | 'pending' | 'declined';
}

const EmptyBookingState = ({ type }: EmptyBookingStateProps) => {
  const getEmptyState = () => {
    switch (type) {
      case 'upcoming':
        return {
          icon: CheckCircle,
          title: 'No upcoming bookings',
          description: 'Your confirmed bookings will appear here'
        };
      case 'payment':
        return {
          icon: CreditCard,
          title: 'No bookings requiring payment',
          description: 'All your approved bookings have been paid for'
        };
      case 'pending':
        return {
          icon: Clock3,
          title: 'No pending bookings',
          description: 'Your submitted bookings will appear here while awaiting approval'
        };
      case 'declined':
        return {
          icon: XCircle,
          title: 'No declined bookings',
          description: 'Declined bookings would appear here'
        };
    }
  };

  const state = getEmptyState();
  const Icon = state.icon;

  return (
    <div className="text-center py-8">
      <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500 mb-2">{state.title}</p>
      <p className="text-sm text-gray-400">{state.description}</p>
    </div>
  );
};

export default EmptyBookingState;
