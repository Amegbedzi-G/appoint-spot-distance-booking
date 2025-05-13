import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, AuthUser } from './types';
import { 
  ADMIN_USER, 
  saveUserToLocalStorage, 
  removeUserFromLocalStorage, 
  getUserFromLocalStorage,
  isAdminEmail,
  createUserProfile,
  getUserProfile,
  updatePaymentStatus
} from './authUtils';

// Create the auth context
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
        const savedUser = getUserFromLocalStorage();
        if (savedUser) {
          setUser(savedUser);
        } else {
          // Check for Supabase session
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // For now, if the user exists in Supabase but is the admin email, use the admin user
            if (isAdminEmail(session.user.email || '')) {
              setUser(ADMIN_USER);
              saveUserToLocalStorage(ADMIN_USER);
            } else {
              // Regular user - check if they're approved
              try {
                const userProfile = await getUserProfile(session.user.id);
                
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
                saveUserToLocalStorage(authUser);
              } catch (error) {
                console.error('Error fetching user profile:', error);
              }
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
        if (isAdminEmail(session.user.email || '')) {
          setUser(ADMIN_USER);
          saveUserToLocalStorage(ADMIN_USER);
        } else {
          // Check if the user is approved
          const checkUserApproval = async () => {
            try {
              const userProfile = await getUserProfile(session.user.id);
              
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
              saveUserToLocalStorage(authUser);
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          };
          
          checkUserApproval();
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        removeUserFromLocalStorage();
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
      if (isAdminEmail(email) && password === 'admin123') {
        setUser(ADMIN_USER);
        saveUserToLocalStorage(ADMIN_USER);
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
        try {
          const userProfile = await getUserProfile(data.user.id);
          
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.name || 'User',
            role: 'user',
            isApproved: userProfile?.is_approved || false,
            hasPaid: userProfile?.has_paid || false
          };
          
          setUser(authUser);
          saveUserToLocalStorage(authUser);
          
          if (!authUser.isApproved) {
            toast.info('Your account is pending admin approval');
          } else if (!authUser.hasPaid) {
            toast.info('Your account is approved! Please proceed to payment');
          } else {
            toast.success('Login successful');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          throw error;
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
      removeUserFromLocalStorage();
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
        await createUserProfile(data.user.id, name, data.user.email || '');
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
      const userProfile = await getUserProfile(user.id);
      
      if (userProfile) {
        const updatedUser = {
          ...user,
          isApproved: userProfile.is_approved,
          hasPaid: userProfile.has_paid
        };
        
        setUser(updatedUser);
        saveUserToLocalStorage(updatedUser);
        
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
      await updatePaymentStatus(user.id);
      
      const updatedUser = {
        ...user,
        hasPaid: true
      };
      
      setUser(updatedUser);
      saveUserToLocalStorage(updatedUser);
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
