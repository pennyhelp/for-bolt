import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Users, CheckCircle, Clock, AlertCircle, LogOut, RefreshCw } from 'lucide-react';

const NewAdminDashboard = () => {
  const navigate = useNavigate();
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('currentAdmin');
    if (!adminData) {
      navigate('/admin/new-login');
      return;
    }
    
    try {
      const admin = JSON.parse(adminData);
      setCurrentAdmin(admin);
      loadData();
    } catch (err) {
      console.error('Error parsing admin data:', err);
      navigate('/admin/new-login');
    }
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading registrations...');
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading registrations:', error);
        setError(error.message);
        return;
      }
      
      console.log('Registrations loaded:', data);
      setRegistrations(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const pending = data?.filter(r => r.status === 'pending').length || 0;
      const approved = data?.filter(r => r.status === 'approved').length || 0;
      const rejected = data?.filter(r => r.status === 'rejected').length || 0;
      
      setStats({ total, pending, approved, rejected });
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      console.log('Updating status:', id, newStatus);
      
      const { error } = await supabase
        .from('registrations')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status: ' + error.message);
        return;
      }
      
      console.log('Status updated successfully');
      alert('Status updated successfully!');
      loadData(); // Reload data
      
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentAdmin');
    navigate('/admin/new-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              {currentAdmin && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Welcome, {currentAdmin.username}</span>
                  <Badge>{currentAdmin.role}</Badge>
                </div>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-700">Error: {error}</p>
                <Button variant="outline" size="sm" onClick={loadData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-10 w-10 mb-2" />
                <div className="ml-4">
                  <p className="text-blue-100">Total</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-10 w-10 mb-2" />
                <div className="ml-4">
                  <p className="text-yellow-100">Pending</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-10 w-10 mb-2" />
                <div className="ml-4">
                  <p className="text-green-100">Approved</p>
                  <p className="text-3xl font-bold">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-10 w-10 mb-2" />
                <div className="ml-4">
                  <p className="text-red-100">Rejected</p>
                  <p className="text-3xl font-bold">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Registrations ({registrations.length})</CardTitle>
              <Button onClick={loadData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No registrations found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Customer ID</th>
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Category</th>
                      <th className="text-left p-3">Mobile</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.slice(0, 10).map(registration => (
                      <tr key={registration.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-mono text-sm">{registration.customer_id}</td>
                        <td className="p-3">{registration.name}</td>
                        <td className="p-3">{registration.category_name}</td>
                        <td className="p-3">{registration.mobile_number}</td>
                        <td className="p-3">
                          <Badge variant={
                            registration.status === 'approved' ? 'default' :
                            registration.status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {registration.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            {registration.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateStatus(registration.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateStatus(registration.id, 'rejected')}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewAdminDashboard;