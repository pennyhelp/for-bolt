import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseStore } from '../../store/supabaseStore';
import Navbar from '../../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { CheckCircle, XCircle, Edit, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminRegistrations = () => {
  const navigate = useNavigate();
  const { 
    currentAdmin, 
    registrations, 
    categories, 
    panchayaths, 
    updateRegistration,
    fetchRegistrations,
    fetchCategories,
    fetchPanchayaths,
    setupRealtimeSubscriptions
  } = useSupabaseStore();
  const [filter, setFilter] = useState({ category: 'all', panchayath: 'all', status: 'all' });

  useEffect(() => {
    if (!currentAdmin) {
      navigate('/admin/login');
      return;
    }
    
    fetchRegistrations();
    fetchCategories();
    fetchPanchayaths();
    setupRealtimeSubscriptions();
  }, [currentAdmin, navigate]);

  if (!currentAdmin) {
    return null;
  }

  const filteredRegistrations = registrations.filter(reg => {
    if (filter.category !== 'all' && reg.categoryId !== filter.category) return false;
    if (filter.panchayath !== 'all' && reg.panchayathId !== filter.panchayath) return false;
    if (filter.status !== 'all' && reg.status !== filter.status) return false;
    return true;
  });

  const handleStatusChange = async (registrationId: string, newStatus: 'approved' | 'rejected') => {
    try {
      await updateRegistration(registrationId, { status: newStatus });
      toast({
        title: "Status Updated",
        description: `Registration ${newStatus} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const exportToExcel = () => {
    try {
      const headers = ['Customer ID', 'Name', 'Category', 'Mobile', 'Panchayath', 'Ward', 'Status', 'Created At'];
      const csvContent = [
        headers.join(','),
        ...filteredRegistrations.map(reg => [
          reg.customerId,
          `"${reg.name}"`,
          `"${reg.categoryName}"`,
          reg.mobileNumber,
          `"${reg.panchayathName}"`,
          `"${reg.ward}"`,
          reg.status,
          new Date(reg.createdAt).toLocaleDateString()
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Registration data has been exported to CSV file",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Registration Management</h1>
          <Button onClick={exportToExcel} className="flex items-center gap-2">
            <Download size={16} />
            Export to Excel
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Category</label>
                <Select value={filter.category} onValueChange={(value) => setFilter(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Panchayath</label>
                <Select value={filter.panchayath} onValueChange={(value) => setFilter(prev => ({ ...prev, panchayath: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Panchayaths" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Panchayaths</SelectItem>
                    {panchayaths.map(pan => (
                      <SelectItem key={pan.id} value={pan.id}>{pan.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Status</label>
                <Select value={filter.status} onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registrations ({filteredRegistrations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Customer ID</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-left p-3">Mobile</th>
                    <th className="text-left p-3">Panchayath</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map(registration => (
                    <tr key={registration.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">{registration.customerId}</td>
                      <td className="p-3">{registration.name}</td>
                      <td className="p-3">{registration.categoryName}</td>
                      <td className="p-3">{registration.mobileNumber}</td>
                      <td className="p-3">{registration.panchayathName}</td>
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
                                onClick={() => handleStatusChange(registration.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusChange(registration.id, 'rejected')}
                              >
                                <XCircle size={14} />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            <Edit size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRegistrations;
