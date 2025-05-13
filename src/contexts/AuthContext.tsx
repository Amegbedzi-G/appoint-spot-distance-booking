
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isApproved: boolean;
  hasPaid: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  checkApprovalStatus: () => Promise<boolean>;
  setPaymentComplete: () => Promise<void>;
}

// Mock admin user for demo
const ADMIN_USER = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin' as const,
  isApproved: true,
  hasPaid: true
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
              // Regular user - check if they're approved
              const { data: userProfile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
              
              // Regular user
              const authUser: AuthUser = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || 'User',
                role: 'user',
                isApproved: userProfile?.is_approved || false,
                hasPaid: userProfile?.has_paid || false
              };
              setUser(authUser);
              localStorage.setItem('appointmentBookingUser', JSON.stringify(authUser));
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
          // Check if the user is approved
          const checkUserApproval = async () => {
            const { data: userProfile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            // Regular user
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || 'User',
              role: 'user',
              isApproved: userProfile?.is_approved || false,
              hasPaid: userProfile?.has_paid || false
            };
            setUser(authUser);
            localStorage.setItem('appointmentBookingUser', JSON.stringify(authUser));
          };
          
          checkUserApproval();
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
        // Check if the user is approved
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
        
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || 'User',
          role: 'user',
          isApproved: userProfile?.is_approved || false,
          hasPaid: userProfile?.has_paid || false
        };
        
        setUser(authUser);
        localStorage.setItem('appointmentBookingUser', JSON.stringify(authUser));
        
        if (!authUser.isApproved) {
          toast.info('Your account is pending admin approval');
        } else if (!authUser.hasPaid) {
          toast.info('Your account is approved! Please proceed to payment');
        } else {
          toast.success('Login successful');
        }
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
        // Create a user profile entry with approval status set to false
        await supabase.from('user_profiles').insert({
          user_id: data.user.id,
          name,
          email: data.user.email,
          is_approved: false,
          has_paid: false
        });
        
        toast.success('Sign up successful! Please wait for admin approval before logging in.');
      }
    } catch (error: any) {
      toast.error(`Sign up failed: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkApprovalStatus = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Refresh user profile data
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (userProfile) {
        const updatedUser = {
          ...user,
          isApproved: userProfile.is_approved,
          hasPaid: userProfile.has_paid
        };
        
        setUser(updatedUser);
        localStorage.setItem('appointmentBookingUser', JSON.stringify(updatedUser));
        
        if (userProfile.is_approved && !user.isApproved) {
          toast.success('Your account has been approved! You can now proceed to payment.');
        }
        
        return userProfile.is_approved;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking approval status:', error);
      return false;
    }
  };

  const setPaymentComplete = async (): Promise<void> => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_profiles')
        .update({ has_paid: true })
        .eq('user_id', user.id);
      
      const updatedUser = {
        ...user,
        hasPaid: true
      };
      
      setUser(updatedUser);
      localStorage.setItem('appointmentBookingUser', JSON.stringify(updatedUser));
      toast.success('Payment completed successfully!');
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
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
        signUp,
        checkApprovalStatus,
        setPaymentComplete
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
