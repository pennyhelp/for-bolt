import React, { useState } from 'react';
import { useSupabaseStore } from '../store/supabaseStore';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Search, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const StatusCheck = () => {
  const { registrations } = useSupabaseStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Customer ID or Mobile Number",
        variant: "destructive"
      });
      return;
    }

    // Search by Customer ID or Mobile Number
    const result = registrations.find(reg => 
      reg.customerId === searchQuery || reg.mobileNumber === searchQuery
    );

    if (result) {
      setSearchResult(result);
    } else {
      setSearchResult(null);
      toast({
        title: "Not Found",
        description: "No registration found with the provided details",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-500" />;
      case 'rejected':
        return <XCircle className="text-red-500" />;
      default:
        return <Clock className="text-yellow-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Check Registration Status
          </h1>
          <p className="text-lg text-gray-600">
            Enter your Customer ID or Mobile Number to check your registration status
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Registration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="search">Customer ID or Mobile Number</Label>
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Customer ID (e.g., ESEP9876543210J) or Mobile Number"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="w-full flex items-center gap-2">
              <Search size={16} />
              Search Registration
            </Button>
          </CardContent>
        </Card>

        {searchResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(searchResult.status)}
                Registration Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div>
                  <Label className="text-sm font-semibold">Status:</Label>
                  <div className="mt-1">
                    {getStatusBadge(searchResult.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Customer ID:</Label>
                  <p className="font-mono text-lg">{searchResult.customerId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Name:</Label>
                  <p>{searchResult.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Mobile Number:</Label>
                  <p>{searchResult.mobileNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Category:</Label>
                  <p>{searchResult.categoryName}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Panchayath:</Label>
                  <p>{searchResult.panchayathName}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Ward:</Label>
                  <p>{searchResult.ward}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Registration Date:</Label>
                  <p>{new Date(searchResult.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                {searchResult.status === 'pending' && (
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Status: Pending Approval</h4>
                    <p className="text-blue-700 text-sm">
                      Your registration is currently under review. You will be notified once it's approved 
                      and payment processing is complete. Please keep your Customer ID safe for future reference.
                    </p>
                  </div>
                )}
                {searchResult.status === 'approved' && (
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Status: Approved</h4>
                    <p className="text-green-700 text-sm">
                      Congratulations! Your registration has been approved. You can now start using E-LIFE SOCIETY services.
                    </p>
                  </div>
                )}
                {searchResult.status === 'rejected' && (
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">Status: Rejected</h4>
                    <p className="text-red-700 text-sm">
                      Your registration was not approved. Please contact the admin for more information.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {!searchResult && searchQuery && (
          <Card>
            <CardContent className="text-center py-8">
              <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Registration Found
              </h3>
              <p className="text-gray-500">
                Please check your Customer ID or Mobile Number and try again.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StatusCheck;