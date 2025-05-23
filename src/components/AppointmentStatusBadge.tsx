
import { Badge } from '@/components/ui/badge';
import { Appointment } from '@/contexts/appointment';

interface AppointmentStatusBadgeProps {
  status: Appointment['status'];
}

const AppointmentStatusBadge = ({ status }: AppointmentStatusBadgeProps) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-300">
          Pending
        </Badge>
      );
    case 'approved':
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-300">
          Approved
        </Badge>
      );
    case 'declined':
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-300">
          Declined
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-300">
          Completed
        </Badge>
      );
    default:
      return null;
  }
};

export default AppointmentStatusBadge;
