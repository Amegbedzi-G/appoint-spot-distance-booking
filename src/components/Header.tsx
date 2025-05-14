
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  MapPin, 
  User, 
  LogOut, 
  LogIn, 
  ChevronDown, 
  CreditCard,
  X 
} from 'lucide-react';
import { useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from '@/components/ui/sonner';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/auth');
    toast.success("You have been logged out successfully.");
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {!isAdmin && !user?.isApproved && (
                    <DropdownMenuItem className="text-yellow-600 font-medium">
                      Awaiting Approval
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="w-full">Admin Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/appointments" className="w-full">Manage Appointments</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 pb-3 space-y-3 md:hidden">
            {isAuthenticated ? (
              <>
                <div className="border-b pb-2 mb-2">
                  <div className="px-3 py-2">
                    <p className="font-medium">Hello, {user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
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
                  className="w-full justify-start px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-100"
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
