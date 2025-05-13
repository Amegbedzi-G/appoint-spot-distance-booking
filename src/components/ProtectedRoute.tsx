
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  if (!isAuthenticated) {
    // Save the location the user was trying to access
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If route requires admin access, check for admin role
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated (and has admin role if required)
  return <>{children}</>;
};

export default ProtectedRoute;
