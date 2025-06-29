import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseStore } from '../store/supabaseStore';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowRight, Users, Award, Target, Megaphone, AlertCircle, RefreshCw } from 'lucide-react';

const Index = () => {
  const { announcements, fetchAnnouncements, error, clearError } = useSupabaseStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Index page: Loading announcements...');
        setIsLoading(true);
        setHasError(false);
        clearError();
        
        await fetchAnnouncements();
        console.log('Index page: Announcements loaded successfully');
      } catch (err) {
        console.error('Index page: Error loading announcements:', err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchAnnouncements, clearError]);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    fetchAnnouncements().finally(() => setIsLoading(false));
  };

  console.log('Index page rendering...', { isLoading, hasError, announcementsCount: announcements.length });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                E-LIFE SOCIETY
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join Pennyekart - The Hybrid Ecommerce Platform. Empowering self-employment through innovative digital solutions and community support.
            </p>
            
            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/categories">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Users className="mr-2 h-6 w-6" />
                  Register Now
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              
              <Link to="/status">
                <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-700 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Target className="mr-2 h-6 w-6" />
                  Check Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {(error || hasError) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <h3 className="text-lg font-semibold text-red-800">
                  Unable to load announcements
                </h3>
              </div>
              <p className="text-red-700 mb-4">
                {error || 'An error occurred while loading data from the server.'}
              </p>
              <Button onClick={handleRetry} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading announcements...</p>
          </div>
        </div>
      )}

      {/* Announcements Section */}
      {!isLoading && !hasError && announcements.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Megaphone className="h-8 w-8 text-blue-600" />
              Latest Announcements
            </h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcements.slice(0, 3).map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {announcement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{announcement.content}</p>
                  <p className="text-sm text-gray-400 mt-4">
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Choose E-LIFE SOCIETY?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the benefits of joining our hybrid ecommerce platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="pt-6">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Self Employment</h3>
              <p className="text-gray-600">
                Create your own business opportunities with our comprehensive platform designed for entrepreneurs
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="pt-6">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Services</h3>
              <p className="text-gray-600">
                Access premium services with special offers and discounts across multiple categories
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="pt-6">
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Registration</h3>
              <p className="text-gray-600">
                Simple and quick registration process with instant customer ID generation
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of entrepreneurs who have transformed their lives with E-LIFE SOCIETY
          </p>
          <Link to="/categories">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Get Started Today
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">E-LIFE SOCIETY</h3>
          <p className="text-gray-400 mb-6">Empowering communities through digital innovation</p>
          <p className="text-sm text-gray-500">
            © 2024 E-LIFE SOCIETY. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;