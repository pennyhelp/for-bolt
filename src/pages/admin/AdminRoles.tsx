
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseStore } from '../../store/supabaseStore';
import Navbar from '../../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Shield, User, Crown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminRoles = () => {
  const navigate = useNavigate();
  const { currentAdmin, admins, updateAdmin, fetchAdmins } = useSupabaseStore();

  useEffect(() => {
    if (!currentAdmin) {
      navigate('/admin/login');
      return;
    }
    
    if (currentAdmin.role !== 'super') {
      navigate('/admin/dashboard');
      return;
    }

    fetchAdmins();
  }, [currentAdmin, navigate, fetchAdmins]);

  if (!currentAdmin || currentAdmin.role !== 'super') {
    return null;
  }

  const handleToggleActive = async (adminId: string, isActive: boolean) => {
    try {
      await updateAdmin(adminId, { isActive });
      toast({
        title: "Status Updated",
        description: `Admin ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update admin status",
        variant: "destructive"
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'local':
        return <Shield className="w-5 h-5 text-blue-500" />;
      default:
        return <User className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'super':
        return 'Full access to all features and settings';
      case 'local':
        return 'Read and write access to registrations and panchayaths';
      case 'user':
        return 'Read-only access to registrations';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Role Management</h1>
          <p className="text-gray-600">Manage admin users and their access levels</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Users ({admins.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {admins.map(admin => (
                <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {getRoleIcon(admin.role)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{admin.username}</h3>
                        <Badge variant={
                          admin.role === 'super' ? 'default' :
                          admin.role === 'local' ? 'secondary' : 'outline'
                        }>
                          {admin.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{getRoleDescription(admin.role)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge variant={admin.isActive ? 'default' : 'destructive'}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {admin.id !== currentAdmin.id && (
                      <Switch
                        checked={admin.isActive}
                        onCheckedChange={(checked) => handleToggleActive(admin.id, checked)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Security Notice</h3>
          <p className="text-sm text-yellow-700">
            Admin credentials and detailed information are not displayed for security purposes. 
            Only activation/deactivation controls are available.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRoles;
