
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  is_approved: boolean;
  has_paid: boolean;
  created_at: string;
}

const ApproveUsersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [processingUser, setProcessingUser] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast.error(`Error loading users: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const approveUser = async (userId: string) => {
    setProcessingUser(userId);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_approved: true })
        .eq('user_id', userId);

      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => 
        u.user_id === userId ? { ...u, is_approved: true } : u
      ));
      
      toast.success('User has been approved');
    } catch (error: any) {
      toast.error(`Failed to approve user: ${error.message}`);
    } finally {
      setProcessingUser(null);
    }
  };

  const rejectUser = async (userId: string) => {
    setProcessingUser(userId);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_approved: false })
        .eq('user_id', userId);

      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => 
        u.user_id === userId ? { ...u, is_approved: false } : u
      ));
      
      toast.success('User has been rejected');
    } catch (error: any) {
      toast.error(`Failed to reject user: ${error.message}`);
    } finally {
      setProcessingUser(null);
    }
  };

  return (
    <div className="page-container">
      <Card>
        <CardHeader>
          <CardTitle>Approve Users</CardTitle>
          <CardDescription>
            Review and approve new user registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            </div>
          ) : (
            <>
              {users.length === 0 ? (
                <p className="text-center py-10 text-gray-500">No users found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.name}</TableCell>
                        <TableCell>{profile.email}</TableCell>
                        <TableCell>
                          {profile.is_approved ? (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                              Approved
                            </span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                              Pending
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {profile.has_paid ? (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                              Paid
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                              Unpaid
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(profile.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => approveUser(profile.user_id)}
                              disabled={profile.is_approved || processingUser === profile.user_id}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              {processingUser === profile.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => rejectUser(profile.user_id)}
                              disabled={!profile.is_approved || processingUser === profile.user_id}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              {processingUser === profile.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-1" />
                              )}
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApproveUsersPage;
