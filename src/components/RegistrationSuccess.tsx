
import React from 'react';
import Navbar from './Navbar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Copy, Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface RegistrationSuccessProps {
  customerId: string;
  onBackToCategories: () => void;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({ customerId, onBackToCategories }) => {
  const copyCustomerId = () => {
    navigator.clipboard.writeText(customerId);
    toast({
      title: "Copied!",
      description: "Customer ID copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              Registration Successful!
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Your registration has been submitted successfully
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Your Customer ID</h3>
              <div className="flex items-center gap-3">
                <code className="text-2xl font-mono font-bold text-blue-600 bg-white px-4 py-2 rounded border flex-1">
                  {customerId}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCustomerId}
                  className="hover:bg-blue-50"
                >
                  <Copy size={16} />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Please save this Customer ID for future reference. You'll need it to check your registration status.
              </p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Your registration is currently under review</li>
                <li>• You will be notified once it's approved</li>
                <li>• Use your Customer ID to check status anytime</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Link to="/status" className="flex-1">
                <Button variant="outline" className="w-full hover:bg-blue-50">
                  <Search size={16} className="mr-2" />
                  Check Status
                </Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  <Home size={16} className="mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
