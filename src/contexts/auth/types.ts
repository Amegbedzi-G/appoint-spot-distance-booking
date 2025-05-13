
import { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isApproved: boolean;
  hasPaid: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  checkApprovalStatus: () => Promise<boolean>;
  setPaymentComplete: () => Promise<void>;
}
