
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ServiceProvider } from "@/contexts/ServiceContext";
import { AppointmentProvider } from "@/contexts/AppointmentContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";

// User pages
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import BookServicePage from "@/pages/BookServicePage";
import BookingConfirmationPage from "@/pages/BookingConfirmationPage";
import AuthPage from "@/pages/AuthPage";

// Admin pages
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import ManageServicesPage from "@/pages/admin/ManageServicesPage";
import ManageAppointmentsPage from "@/pages/admin/ManageAppointmentsPage";
import AppointmentDetailsPage from "@/pages/admin/AppointmentDetailsPage";

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
                  path="/services" 
                  element={
                    <ProtectedRoute>
                      <MainLayout><ServicesPage /></MainLayout>
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
                
                {/* Admin Routes */}
                <Route 
                  path="/admin/login" 
                  element={<AdminLoginPage />} 
                />
                <Route 
                  path="/admin" 
                  element={<MainLayout><AdminDashboardPage /></MainLayout>} 
                />
                <Route 
                  path="/admin/services" 
                  element={<MainLayout><ManageServicesPage /></MainLayout>} 
                />
                <Route 
                  path="/admin/appointments" 
                  element={<MainLayout><ManageAppointmentsPage /></MainLayout>} 
                />
                <Route 
                  path="/admin/appointments/:appointmentId" 
                  element={<MainLayout><AppointmentDetailsPage /></MainLayout>} 
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
