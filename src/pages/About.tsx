
import React from 'react';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About E-LIFE SOCIETY
          </h1>
          <p className="text-xl text-gray-600">
            Empowering Self-Employment Through Hybrid Ecommerce
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>What is Pennyekart?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Pennyekart is a revolutionary hybrid ecommerce platform that connects home delivery services 
                with self-employment programs through the E-LIFE SOCIETY initiative. Our unique approach 
                combines traditional ecommerce with community-based employment opportunities.
              </p>
              <p className="text-gray-700">
                Unlike conventional platforms, Pennyekart creates direct pathways for individuals to become 
                entrepreneurs in their local communities while providing essential services to their neighbors.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Pennyekart Registrations</h3>
                  <div className="space-y-2">
                    <div>
                      <Badge variant="outline" className="mb-2">Free Registration</Badge>
                      <p className="text-sm text-gray-600">
                        Totally free registration with free delivery between 2pm to 6pm. Basic level access to our platform.
                      </p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">Paid Registration</Badge>
                      <p className="text-sm text-gray-600">
                        Premium registration with any time delivery between 8am to 7pm. Full access to all platform features.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Specialized Categories</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">Farmelife</Badge>
                      <p className="text-sm text-gray-600">
                        Connected with dairy farms, poultry farms, and agricultural businesses.
                      </p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">Organelife</Badge>
                      <p className="text-sm text-gray-600">
                        Vegetable and house gardening, especially terrace vegetable farming.
                      </p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">Foodlife</Badge>
                      <p className="text-sm text-gray-600">
                        Food processing businesses and culinary services.
                      </p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">Entrelife</Badge>
                      <p className="text-sm text-gray-600">
                        Skilled projects like stitching, art works, and various home services.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Special Offer</h3>
                  <div>
                    <Badge variant="destructive" className="mb-2">Job Card</Badge>
                    <p className="text-sm text-gray-600">
                      The ultimate choice - access to all categories with special fee packages, offers, discounts, 
                      and investment benefits. This card can be converted to any specific category but not reversed.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why Choose E-LIFE SOCIETY?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Community-Centered</h4>
                  <p className="text-sm text-gray-600">
                    Focus on local community development and creating employment opportunities within your area.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Flexible Categories</h4>
                  <p className="text-sm text-gray-600">
                    Choose from multiple categories based on your skills and interests.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Support System</h4>
                  <p className="text-sm text-gray-600">
                    Complete support from registration to business development.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Growth Opportunities</h4>
                  <p className="text-sm text-gray-600">
                    Scale your business with our hybrid ecommerce platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
