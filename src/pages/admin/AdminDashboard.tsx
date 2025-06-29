
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSupabaseStore } from '../../store/supabaseStore';
import Navbar from '../../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Users, CheckCircle, Clock, AlertCircle, Grid, MapPin, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { 
    currentAdmin, 
    registrations, 
    categories,
    panchayaths,
    fetchRegistrations,
    fetchCategories,
    fetchPanchayaths,
    setupRealtimeSubscriptions,
    loading
  } = useSupabaseStore();

  useEffect(() => {
    if (!currentAdmin) {
      navigate('/admin/login');
      return;
    }
    
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchRegistrations(),
          fetchCategories(),
          fetchPanchayaths()
        ]);
        setupRealtimeSubscriptions();
      } catch (error) {
        console.error('Error initializing dashboard data:', error);
      }
    };

    initializeData();
  }, [currentAdmin, navigate, fetchRegistrations, fetchCategories, fetchPanchayaths, setupRealtimeSubscriptions]);

  if (!currentAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
  };

  const panchayathStats = panchayaths.map(panchayath => {
    const panchayathRegistrations = registrations.filter(r => r.panchayathId === panchayath.id);
    return {
      name: panchayath.name,
      district: panchayath.district,
      total: panchayathRegistrations.length,
      pending: panchayathRegistrations.filter(r => r.status === 'pending').length,
      approved: panchayathRegistrations.filter(r => r.status === 'approved').length,
      rejected: panchayathRegistrations.filter(r => r.status === 'rejected').length,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of registration statistics and management</p>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/admin/registrations">
            <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Registrations</span>
            </Button>
          </Link>
          <Link to="/admin/categories">
            <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
              <Grid className="h-6 w-6" />
              <span>Categories</span>
            </Button>
          </Link>
          <Link to="/admin/panchayaths">
            <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
              <MapPin className="h-6 w-6" />
              <span>Panchayaths</span>
            </Button>
          </Link>
          {currentAdmin.role === 'super' && (
            <Link to="/admin/roles">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                <Settings className="h-6 w-6" />
                <span>Admin Roles</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-10 w-10 mb-2" />
                <div className="ml-4">
                  <p className="text-blue-100">Total Registrations</p>
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

        {/* Panchayath-wise Statistics Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Panchayath-wise Registration Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Panchayath</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Pending</TableHead>
                    <TableHead className="text-center">Approved</TableHead>
                    <TableHead className="text-center">Rejected</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {panchayathStats.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{stat.name}</TableCell>
                      <TableCell>{stat.district}</TableCell>
                      <TableCell className="text-center font-bold">{stat.total}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{stat.pending}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="default">{stat.approved}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="destructive">{stat.rejected}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Categories Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid className="h-5 w-5" />
              Categories Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => {
                const categoryRegistrations = registrations.filter(r => r.categoryId === category.id).length;
                return (
                  <div key={category.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-sm text-gray-600">
                        Fee: {category.actualFee > 0 ? `₹${category.offerFee}` : 'FREE'}
                      </p>
                    </div>
                    <Badge variant="outline">{categoryRegistrations} registered</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
