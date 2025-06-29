import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Lock, User, Database, CheckCircle, AlertCircle } from 'lucide-react';

const NewAdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const [testResults, setTestResults] = useState(null);

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      console.log('Testing Supabase connection...');
      
      // Test basic connection
      const { data, error } = await supabase
        .from('admins')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('Connection failed:', error);
        setConnectionStatus('failed');
        setTestResults({ error: error.message });
      } else {
        console.log('Connection successful');
        setConnectionStatus('success');
        setTestResults({ count: data });
      }
    } catch (err) {
      console.error('Connection error:', err);
      setConnectionStatus('failed');
      setTestResults({ error: err.message });
    }
  };

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      alert('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Attempting login...');
      
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', credentials.username)
        .eq('password', credentials.password)
        .eq('is_active', true)
        .single();
      
      if (error || !data) {
        console.error('Login failed:', error);
        alert('Invalid credentials or account inactive');
      } else {
        console.log('Login successful:', data);
        localStorage.setItem('currentAdmin', JSON.stringify(data));
        navigate('/admin/new-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            New Admin Login
          </CardTitle>
          <p className="text-gray-600">E-LIFE SOCIETY Admin Panel v2</p>
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
              Connection: {connectionStatus}
            </p>
          </div>

          {testResults && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-600 text-sm">
                {testResults.error ? `Error: ${testResults.error}` : `Connected successfully`}
              </p>
            </div>
          )}

          <Button 
            onClick={testConnection} 
            variant="outline" 
            className="w-full"
            disabled={connectionStatus === 'testing'}
          >
            <Database className="mr-2 h-4 w-4" />
            {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
          </Button>

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

export default NewAdminLogin;