
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useServices } from '@/contexts/ServiceContext';
import AppointmentStatusBadge from '@/components/AppointmentStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { BarChart, Check, Clock, X, Users, Briefcase, ChevronRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboardPage = () => {
  const { appointments } = useAppointments();
  const { services } = useServices();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalServices: 0,
    totalRevenue: 0,
  });
  
  useEffect(() => {
    const pendingCount = appointments.filter(a => a.status === 'pending').length;
    const approvedAppointments = appointments.filter(a => a.status === 'approved' || a.status === 'completed');
    const revenue = approvedAppointments.reduce((sum, appointment) => sum + appointment.price, 0);
    
    setStats({
      totalAppointments: appointments.length,
      pendingAppointments: pendingCount,
      totalServices: services.length,
      totalRevenue: revenue,
    });
  }, [appointments, services]);
  
  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  return (
    <div className="page-container py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stats.totalAppointments}</div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stats.pendingAppointments}</div>
              <div className="bg-yellow-100 p-2 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stats.totalServices}</div>
              <div className="bg-green-100 p-2 rounded-full">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <div className="bg-purple-100 p-2 rounded-full">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link to="/admin/appointments">
          <Card className="hover:bg-gray-50 transition-colors">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-brand-100 p-3 rounded-full mr-4">
                  <Calendar className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-medium">Manage Appointments</h3>
                  <p className="text-sm text-gray-600">View and respond to appointment requests</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/services">
          <Card className="hover:bg-gray-50 transition-colors">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-brand-100 p-3 rounded-full mr-4">
                  <Briefcase className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-medium">Manage Services</h3>
                  <p className="text-sm text-gray-600">Add, edit, or remove service offerings</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* Recent Appointments */}
      <Card className="mb-6">
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Appointment Requests</CardTitle>
            <Link to="/admin/appointments">
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentAppointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAppointments.map((appointment) => {
                  const service = services.find(s => s.id === appointment.serviceId);
                  return (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        <div>
                          <span className="font-medium">{appointment.customerName}</span>
                          <div className="text-xs text-gray-500">{appointment.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {service?.name || "Unknown Service"}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(appointment.date), 'MMM d, yyyy')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {appointment.timeSlot}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        ${appointment.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <AppointmentStatusBadge status={appointment.status} />
                      </TableCell>
                      <TableCell>
                        <Link to={`/admin/appointments/${appointment.id}`}>
                          <Button size="sm" variant="outline" className="text-xs">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No recent appointments found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
