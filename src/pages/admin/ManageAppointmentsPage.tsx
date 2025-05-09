
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useServices } from '@/contexts/ServiceContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import AppointmentStatusBadge from '@/components/AppointmentStatusBadge';
import { Calendar as CalendarIcon, Filter, Search, X } from 'lucide-react';

const ManageAppointmentsPage = () => {
  const navigate = useNavigate();
  const { appointments, getFilteredAppointments } = useAppointments();
  const { services } = useServices();
  
  // Filter state
  const [filters, setFilters] = useState({
    status: 'all',
    serviceId: 'all',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Apply filters to appointments
  const filteredAppointments = getFilteredAppointments({
    status: filters.status !== 'all' ? filters.status : undefined,
    serviceId: filters.serviceId !== 'all' ? filters.serviceId : undefined,
    date: date ? format(date, 'yyyy-MM-dd') : undefined,
  }).filter((appointment) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      appointment.customerName.toLowerCase().includes(searchLower) ||
      appointment.customerEmail.toLowerCase().includes(searchLower) ||
      appointment.location.address.toLowerCase().includes(searchLower)
    );
  });
  
  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      serviceId: 'all',
    });
    setSearchTerm('');
    setDate(undefined);
  };
  
  return (
    <div className="page-container py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Appointments</h1>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, email, or address..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center flex-wrap gap-3 md:mr-auto">
              <div>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ ...filters, status: value })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select
                  value={filters.serviceId}
                  onValueChange={(value) => setFilters({ ...filters, serviceId: value })}
                >
                  <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Filter by service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[170px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Filter by date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate);
                        setCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Clear filters button */}
              {(filters.status !== 'all' || filters.serviceId !== 'all' || date || searchTerm) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-9 px-2"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Appointments Table */}
      {filteredAppointments.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Location</TableHead>
                <TableHead className="hidden lg:table-cell">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => {
                const service = services.find(s => s.id === appointment.serviceId);
                return (
                  <TableRow key={appointment.id}>
                    <TableCell className="align-top">
                      <div>
                        <span className="font-medium">{appointment.customerName}</span>
                        <div className="text-xs text-gray-500">{appointment.customerEmail}</div>
                        <div className="text-xs text-gray-500">{appointment.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      {service?.name || "Unknown Service"}
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="text-sm">
                        {format(new Date(appointment.date), 'MMM d, yyyy')}
                        <span className="text-xs text-gray-500 ml-1">at {appointment.timeSlot}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 max-w-[180px] truncate">
                        {appointment.location.address}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.distance} km away
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell align-top">
                      ${appointment.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="align-top">
                      <AppointmentStatusBadge status={appointment.status} />
                    </TableCell>
                    <TableCell className="text-right align-top">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/admin/appointments/${appointment.id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 mb-4">
            <Filter className="h-6 w-6 text-gray-500" />
          </div>
          <p className="text-gray-600 mb-2">No appointments found</p>
          <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search criteria</p>
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ManageAppointmentsPage;
