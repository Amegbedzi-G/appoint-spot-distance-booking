
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ServiceProvider } from "@/contexts/ServiceContext";
import { AppointmentProvider } from "@/contexts/AppointmentContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// User pages
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import BookServicePage from "@/pages/BookServicePage";
import BookingConfirmationPage from "@/pages/BookingConfirmationPage";

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
      <AuthProvider>
        <ServiceProvider>
          <AppointmentProvider>
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* User Routes */}
                <Route 
                  path="/" 
                  element={<MainLayout><HomePage /></MainLayout>} 
                />
                <Route 
                  path="/services" 
                  element={<MainLayout><ServicesPage /></MainLayout>} 
                />
                <Route 
                  path="/book/:serviceId" 
                  element={<MainLayout><BookServicePage /></MainLayout>} 
                />
                <Route 
                  path="/booking/confirmation/:appointmentId" 
                  element={<MainLayout><BookingConfirmationPage /></MainLayout>} 
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
            </BrowserRouter>
          </AppointmentProvider>
        </ServiceProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
