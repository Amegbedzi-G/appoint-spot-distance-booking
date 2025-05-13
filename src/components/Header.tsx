
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Menu, MapPin, User, LogOut, LogIn, ChevronDown, CreditCard } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };
  
  const isAdmin = user?.role === 'admin';
  
  return (
    <header className="bg-white shadow-sm w-full">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and site name */}
          <Link to={isAdmin ? "/admin" : "/"} className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-brand-500" />
            <span className="text-xl font-semibold text-gray-800">Service Booking</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <>
                {/* Regular user navigation */}
                {!isAdmin && (
                  <>
                    <Link to="/" className="text-gray-600 hover:text-brand-500">Home</Link>
                    {user?.isApproved && user?.hasPaid && (
                      <Link to="/services" className="text-gray-600 hover:text-brand-500">Services</Link>
                    )}
                    {user?.isApproved && !user?.hasPaid && (
                      <Link to="/payment" className="flex items-center space-x-1 text-brand-500 font-medium">
                        <CreditCard className="h-4 w-4" />
                        <span>Complete Payment</span>
                      </Link>
                    )}
                  </>
                )}
                
                {/* Admin navigation */}
                {isAdmin && (
                  <div className="relative group">
                    <Button variant="link" className="flex items-center space-x-1">
                      <span>Admin</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-20 hidden group-hover:block">
                      <Link to="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Dashboard</Link>
                      <Link to="/admin/services" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Manage Services</Link>
                      <Link to="/admin/appointments" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Manage Appointments</Link>
                      <Link to="/admin/users" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Approve Users</Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </nav>
          
          {/* Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {!isAdmin && !user?.isApproved && (
                  <span className="text-yellow-600 text-sm font-medium">Awaiting Approval</span>
                )}
                <span className="text-sm text-gray-600">Hello, {user?.name}</span>
                <Button variant="ghost" onClick={handleLogout} className="flex items-center space-x-1">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="flex items-center space-x-1">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 pb-3 space-y-3 md:hidden">
            {isAuthenticated ? (
              <>
                {/* Regular user mobile navigation */}
                {!isAdmin && (
                  <>
                    <Link 
                      to="/" 
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    
                    {user?.isApproved && user?.hasPaid && (
                      <Link 
                        to="/services" 
                        className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Services
                      </Link>
                    )}
                    
                    {user?.isApproved && !user?.hasPaid && (
                      <Link 
                        to="/payment" 
                        className="block px-3 py-2 text-base font-medium text-brand-500 hover:bg-gray-100 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <CreditCard className="h-4 w-4 inline mr-2" />
                        Complete Payment
                      </Link>
                    )}
                    
                    {!user?.isApproved && (
                      <div className="block px-3 py-2 text-base font-medium text-yellow-600">
                        Awaiting Approval
                      </div>
                    )}
                  </>
                )}
                
                {/* Admin mobile navigation */}
                {isAdmin && (
                  <>
                    <Link 
                      to="/admin" 
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <Link 
                      to="/admin/services" 
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Manage Services
                    </Link>
                    <Link 
                      to="/admin/appointments" 
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Manage Appointments
                    </Link>
                    <Link 
                      to="/admin/users" 
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Approve Users
                    </Link>
                  </>
                )}
                
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
