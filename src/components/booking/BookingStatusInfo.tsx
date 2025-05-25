
import { CheckCircle, CreditCard, Clock3, XCircle } from 'lucide-react';

interface BookingStatusInfoProps {
  type: 'upcoming' | 'payment' | 'pending' | 'declined';
}

const BookingStatusInfo = ({ type }: BookingStatusInfoProps) => {
  const getStatusInfo = () => {
    switch (type) {
      case 'upcoming':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          textColor: 'text-green-700',
          title: 'Confirmed Bookings',
          description: 'These bookings have been paid for and confirmed. Our team will contact you soon.'
        };
      case 'payment':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: CreditCard,
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700',
          title: 'Payment Required',
          description: 'Your bookings have been approved and are ready for payment. Complete payment to confirm your appointments.'
        };
      case 'pending':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: Clock3,
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700',
          title: 'Awaiting Approval',
          description: 'These bookings are waiting for admin approval. You\'ll be notified when they\'re approved.'
        };
      case 'declined':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: XCircle,
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          textColor: 'text-red-700',
          title: 'Declined Bookings',
          description: 'These bookings were declined by our admin. You can book new services from the services page.'
        };
    }
  };

  const info = getStatusInfo();
  const Icon = info.icon;

  return (
    <div className={`${info.bgColor} border ${info.borderColor} rounded-lg p-4 mb-4`}>
      <div className="flex items-start">
        <Icon className={`h-5 w-5 ${info.iconColor} mt-0.5 mr-2`} />
        <div>
          <p className={`font-medium ${info.titleColor}`}>{info.title}</p>
          <p className={`text-sm ${info.textColor}`}>
            {info.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingStatusInfo;
