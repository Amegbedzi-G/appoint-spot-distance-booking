
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { ServiceProvider } from "@/contexts/ServiceContext";
import { AppointmentProvider } from "@/contexts/appointment";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";

// User pages
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import BookServicePage from "@/pages/BookServicePage";
import BookingConfirmationPage from "@/pages/BookingConfirmationPage";
import BookingsPage from "@/pages/BookingsPage";
import AuthPage from "@/pages/AuthPage";
import PaymentPage from "@/pages/PaymentPage";

// Admin pages
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import ManageServicesPage from "@/pages/admin/ManageServicesPage";
import ManageAppointmentsPage from "@/pages/admin/ManageAppointmentsPage";
import AppointmentDetailsPage from "@/pages/admin/AppointmentDetailsPage";
import ApproveUsersPage from "@/pages/admin/ApproveUsersPage";

import NotFound from "@/pages/NotFound";

// Layout wrapper with header and footer
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <ServiceProvider>
            <AppointmentProvider>
              <Sonner />
              <Routes>
                {/* Auth Route */}
                <Route 
                  path="/auth" 
                  element={<AuthPage />} 
                />
                
                {/* Protected User Routes */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <MainLayout><HomePage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/payment" 
                  element={
                    <ProtectedRoute>
                      <MainLayout><PaymentPage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/services" 
                  element={
                    <ProtectedRoute>
                      <MainLayout><ServicesPage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/bookings" 
                  element={
                    <ProtectedRoute>
                      <MainLayout><BookingsPage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/book/:serviceId" 
                  element={
                    <ProtectedRoute>
                      <MainLayout><BookServicePage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/booking/confirmation/:appointmentId" 
                  element={
                    <ProtectedRoute>
                      <MainLayout><BookingConfirmationPage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/booking/confirmation" 
                  element={
                    <ProtectedRoute>
                      <MainLayout><BookingConfirmationPage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes - Now with requireAdmin flag */}
                <Route 
                  path="/admin/login" 
                  element={<AdminLoginPage />} 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <MainLayout><AdminDashboardPage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/services" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <MainLayout><ManageServicesPage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/appointments" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <MainLayout><ManageAppointmentsPage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/appointments/:appointmentId" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <MainLayout><AppointmentDetailsPage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <MainLayout><ApproveUsersPage /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 Route */}
                <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
              </Routes>
            </AppointmentProvider>
          </ServiceProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
