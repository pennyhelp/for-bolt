import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseStore } from '../../store/supabaseStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Lock, User, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { admins, currentAdmin, setCurrentAdmin, fetchAdmins, error, clearError } = useSupabaseStore();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch admins when component mounts
    console.log('Fetching admins for login...');
    fetchAdmins();
  }, [fetchAdmins]);

  useEffect(() => {
    // Only redirect if currentAdmin exists and we're not already navigating
    if (currentAdmin && !isLoading) {
      console.log('Admin logged in, redirecting to dashboard...');
      navigate('/admin/dashboard');
    }
  }, [currentAdmin, navigate, isLoading]);

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      console.log('Attempting login with:', credentials.username);
      console.log('Available admins:', admins.length);
      
      const admin = admins.find(
        a => a.username === credentials.username && 
             a.password === credentials.password && 
             a.isActive
      );

      setTimeout(() => {
        if (admin) {
          console.log('Login successful for:', admin.username);
          setCurrentAdmin(admin);
          toast({
            title: "Login Successful",
            description: `Welcome, ${admin.username}!`
          });
        } else {
          console.log('Login failed - invalid credentials or inactive account');
          toast({
            title: "Login Failed", 
            description: "Invalid credentials or account is inactive",
            variant: "destructive"
          });
          setIsLoading(false);
        }
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Don't render anything if already logged in to prevent flash
  if (currentAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Login
          </CardTitle>
          <p className="text-gray-600">E-LIFE SOCIETY Admin Panel</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-600 text-sm">
              <strong>Debug Info:</strong> {admins.length} admin accounts loaded
            </p>
            {admins.length > 0 && (
              <p className="text-blue-600 text-xs mt-1">
                Available usernames: {admins.map(a => a.username).join(', ')}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter username"
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          <Button 
            onClick={handleLogin} 
            disabled={isLoading || admins.length === 0}
            className="w-full"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          <div className="text-center mt-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-sm"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;