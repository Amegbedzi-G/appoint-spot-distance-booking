
import { Appointment } from '@/contexts/AppointmentContext';

interface AppointmentStatusBadgeProps {
  status: Appointment['status'];
}

const AppointmentStatusBadge = ({ status }: AppointmentStatusBadgeProps) => {
  switch (status) {
    case 'pending':
      return <span className="status-pending">Pending</span>;
    case 'approved':
      return <span className="status-approved">Approved</span>;
    case 'declined':
      return <span className="status-declined">Declined</span>;
    case 'completed':
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Completed</span>;
    default:
      return null;
  }
};

export default AppointmentStatusBadge;
