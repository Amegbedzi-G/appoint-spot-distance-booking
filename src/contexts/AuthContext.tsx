import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (email: string, password: string, name: string) => Promise<void>;
}

// Mock admin user for demo
const ADMIN_USER = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin' as const,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);

      try {
        // First check if we have a saved session
        const savedUser = localStorage.getItem('appointmentBookingUser');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (error) {
            console.error('Failed to parse saved user:', error);
            localStorage.removeItem('appointmentBookingUser');
          }
        } else {
          // Check for Supabase session
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // For now, if the user exists in Supabase but is the admin email, use the admin user
            if (session.user.email === ADMIN_USER.email) {
              setUser(ADMIN_USER);
              localStorage.setItem('appointmentBookingUser', JSON.stringify(ADMIN_USER));
            } else {
              // Regular user
              const authUser: AuthUser = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || 'User',
                role: 'user'
              };
              setUser(authUser);
            }
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // For admin email, use the admin user
        if (session.user.email === ADMIN_USER.email) {
          setUser(ADMIN_USER);
          localStorage.setItem('appointmentBookingUser', JSON.stringify(ADMIN_USER));
        } else {
          // Regular user
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'User',
            role: 'user'
          };
          setUser(authUser);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('appointmentBookingUser');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll check if it's the admin
      if (email === ADMIN_USER.email && password === 'admin123') {
        setUser(ADMIN_USER);
        localStorage.setItem('appointmentBookingUser', JSON.stringify(ADMIN_USER));
        toast.success('Login successful');
        return;
      }

      // Otherwise, use Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || 'User',
          role: 'user'
        };
        setUser(authUser);
        toast.success('Login successful');
      }
    } catch (error: any) {
      toast.error(`Login failed: ${error.message || 'Please check your credentials'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('appointmentBookingUser');
      toast.info('You have been logged out');
    } catch (error: any) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success('Sign up successful! Please check your email for verification.');
      }
    } catch (error: any) {
      toast.error(`Sign up failed: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        signUp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
