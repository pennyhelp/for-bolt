import React, { useState, useEffect } from 'react';
import { Category, Panchayath } from '../types';
import { useSupabaseStore } from '../store/supabaseStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RegistrationFormProps {
  selectedCategory: Category;
  onBack: () => void;
  onSuccess: (customerId: string) => void;
}

interface FormData {
  name: string;
  address: string;
  mobileNumber: string;
  panchayathId: string;
  ward: string;
  agentPro: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ selectedCategory, onBack, onSuccess }) => {
  const { panchayaths, addRegistration, getRegistrationByMobile, fetchPanchayaths } = useSupabaseStore();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    mobileNumber: '',
    panchayathId: '',
    ward: '',
    agentPro: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPanchayaths();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return false;
    }
    if (!formData.address.trim()) {
      toast({ title: "Error", description: "Address is required", variant: "destructive" });
      return false;
    }
    if (!formData.mobileNumber.trim() || !/^\d{10}$/.test(formData.mobileNumber)) {
      toast({ title: "Error", description: "Valid 10-digit mobile number is required", variant: "destructive" });
      return false;
    }
    if (!formData.panchayathId) {
      toast({ title: "Error", description: "Panchayath is required", variant: "destructive" });
      return false;
    }
    if (!formData.ward.trim()) {
      toast({ title: "Error", description: "Ward is required", variant: "destructive" });
      return false;
    }
    
    // Check for duplicate mobile number
    const existingRegistration = getRegistrationByMobile(formData.mobileNumber);
    if (existingRegistration) {
      toast({ 
        title: "Error", 
        description: "This mobile number is already registered. Each person can register only once.", 
        variant: "destructive" 
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const selectedPanchayath = panchayaths.find(p => p.id === formData.panchayathId);
      
      const customerId = await addRegistration({
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.name,
        name: formData.name,
        address: formData.address,
        mobileNumber: formData.mobileNumber,
        panchayathId: formData.panchayathId,
        panchayathName: selectedPanchayath?.name || '',
        ward: formData.ward,
        agentPro: formData.agentPro,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast({
        title: "Registration Successful!",
        description: `Your Customer ID is: ${customerId}`,
      });

      onSuccess(customerId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    const selectedPanchayath = panchayaths.find(p => p.id === formData.panchayathId);
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-green-500" />
            Confirm Registration Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{selectedCategory.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              {selectedCategory.actualFee > 0 ? (
                <>
                  <span className="text-xl font-bold text-green-600">
                    ₹{selectedCategory.offerFee}
                  </span>
                  {selectedCategory.actualFee > selectedCategory.offerFee && (
                    <span className="text-gray-500 line-through">
                      ₹{selectedCategory.actualFee}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xl font-bold text-green-600">FREE</span>
              )}
            </div>
            <p className="text-sm text-gray-600">{selectedCategory.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Name:</Label>
              <p>{formData.name}</p>
            </div>
            <div>
              <Label className="font-semibold">Mobile Number:</Label>
              <p>{formData.mobileNumber}</p>
            </div>
            <div className="md:col-span-2">
              <Label className="font-semibold">Address:</Label>
              <p>{formData.address}</p>
            </div>
            <div>
              <Label className="font-semibold">Panchayath:</Label>
              <p>{selectedPanchayath?.name} ({selectedPanchayath?.district})</p>
            </div>
            <div>
              <Label className="font-semibold">Ward:</Label>
              <p>{formData.ward}</p>
            </div>
            {formData.agentPro && (
              <div className="md:col-span-2">
                <Label className="font-semibold">Agent/P.R.O:</Label>
                <p>{formData.agentPro}</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmation(false)}
              className="flex-1"
            >
              Edit Details
            </Button>
            <Button 
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Registration'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <CardTitle>Registration Form</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{selectedCategory.name}</Badge>
              {selectedCategory.actualFee > 0 ? (
                <Badge variant="outline">₹{selectedCategory.offerFee}</Badge>
              ) : (
                <Badge variant="outline" className="text-green-600">FREE</Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              value={formData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter your complete address"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="panchayath">Panchayath *</Label>
            <Select value={formData.panchayathId} onValueChange={(value) => handleInputChange('panchayathId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Panchayath" />
              </SelectTrigger>
              <SelectContent>
                {panchayaths.filter(p => p.isActive).map((panchayath) => (
                  <SelectItem key={panchayath.id} value={panchayath.id}>
                    {panchayath.name} - {panchayath.district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="ward">Ward *</Label>
            <Input
              id="ward"
              value={formData.ward}
              onChange={(e) => handleInputChange('ward', e.target.value)}
              placeholder="Enter ward number/name"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="agent">Agent/P.R.O</Label>
          <Input
            id="agent"
            value={formData.agentPro}
            onChange={(e) => handleInputChange('agentPro', e.target.value)}
            placeholder="Enter agent or PRO name (optional)"
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Proceed to Confirmation
        </Button>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
