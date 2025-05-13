
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from './types';
import { toast } from '@/components/ui/sonner';

// Mock admin user for demo
export const ADMIN_USER: AuthUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  isApproved: true,
  hasPaid: true
};

// Save user to localStorage
export const saveUserToLocalStorage = (user: AuthUser) => {
  localStorage.setItem('appointmentBookingUser', JSON.stringify(user));
};

// Remove user from localStorage
export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('appointmentBookingUser');
};

// Get user from localStorage
export const getUserFromLocalStorage = (): AuthUser | null => {
  const savedUser = localStorage.getItem('appointmentBookingUser');
  if (!savedUser) return null;
  
  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error('Failed to parse saved user:', error);
    localStorage.removeItem('appointmentBookingUser');
    return null;
  }
};

// Check if email is admin
export const isAdminEmail = (email: string): boolean => {
  return email === ADMIN_USER.email;
};

// Create a user profile in Supabase
export const createUserProfile = async (userId: string, name: string, email: string) => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        name,
        email,
        is_approved: false,
        has_paid: false
      });
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Get user profile from Supabase
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update payment status
export const updatePaymentStatus = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ has_paid: true })
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};
