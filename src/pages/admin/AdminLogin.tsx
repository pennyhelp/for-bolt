import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseStore } from '../../store/supabaseStore';
import { supabase } from '../../integrations/supabase/client';
import { setupInitialData, checkDatabaseTables } from '../../utils/setupDatabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Lock, User, AlertCircle, CheckCircle, Database, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { admins, currentAdmin, setCurrentAdmin, fetchAdmins, error, clearError } = useSupabaseStore();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [isSettingUpDatabase, setIsSettingUpDatabase] = useState(false);
  const [databaseStatus, setDatabaseStatus] = useState(null);

  useEffect(() => {
    // Test Supabase connection first
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase.from('admins').select('count', { count: 'exact', head: true });
        
        if (error) {
          console.error('Connection test failed:', error);
          setConnectionStatus('failed');
        } else {
          console.log('Connection successful, admin count:', data);
          setConnectionStatus('success');
          
          // Check database tables
          const tableResults = await checkDatabaseTables();
          setDatabaseStatus(tableResults);
          
          // Now fetch admins
          fetchAdmins();
        }
      } catch (err) {
        console.error('Connection error:', err);
        setConnectionStatus('failed');
      }
    };

    testConnection();
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

  const testDirectConnection = async () => {
    try {
      console.log('Testing direct Supabase connection...');
      const { data, error } = await supabase.from('admins').select('*');
      
      if (error) {
        console.error('Direct connection failed:', error);
        toast({
          title: "Connection Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Direct connection successful:', data);
        toast({
          title: "Connection Successful",
          description: `Found ${data.length} admin records`
        });
      }
    } catch (err) {
      console.error('Direct connection error:', err);
      toast({
        title: "Connection Error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const handleSetupDatabase = async () => {
    setIsSettingUpDatabase(true);
    
    try {
      const result = await setupInitialData();
      
      if (result.success) {
        toast({
          title: "Database Setup Successful",
          description: result.message
        });
        
        // Refresh data
        await fetchAdmins();
        const tableResults = await checkDatabaseTables();
        setDatabaseStatus(tableResults);
      } else {
        toast({
          title: "Database Setup Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Setup Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSettingUpDatabase(false);
    }
  };

  // Don't render anything if already logged in to prevent flash
  if (currentAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Login
          </CardTitle>
          <p className="text-gray-600">E-LIFE SOCIETY Admin Panel</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className={`p-3 rounded-md flex items-center gap-2 ${
            connectionStatus === 'success' ? 'bg-green-50 border border-green-200' :
            connectionStatus === 'failed' ? 'bg-red-50 border border-red-200' :
            'bg-yellow-50 border border-yellow-200'
          }`}>
            {connectionStatus === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
            <p className={`text-sm ${
              connectionStatus === 'success' ? 'text-green-600' :
              connectionStatus === 'failed' ? 'text-red-600' :
              'text-yellow-600'
            }`}>
              Connection: {connectionStatus === 'testing' ? 'Testing...' : connectionStatus}
            </p>
          </div>

          {/* Database Status */}
          {databaseStatus && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-600 text-sm font-semibold mb-2">Database Status:</p>
              <div className="space-y-1 text-xs">
                {Object.entries(databaseStatus).map(([table, status]) => (
                  <div key={table} className="flex justify-between">
                    <span>{table}:</span>
                    <span className={status.exists ? 'text-green-600' : 'text-red-600'}>
                      {status.exists ? `${status.count} records` : 'Missing/Error'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testDirectConnection}
                className="text-xs"
              >
                Test Connection
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSetupDatabase}
                disabled={isSettingUpDatabase}
                className="text-xs flex items-center gap-1"
              >
                {isSettingUpDatabase ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <Database className="h-3 w-3" />
                )}
                Setup Database
              </Button>
            </div>
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
                placeholder="Try: evaadmin"
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
                placeholder="Try: eva919123"
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          <Button 
            onClick={handleLogin} 
            disabled={isLoading || connectionStatus !== 'success'}
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