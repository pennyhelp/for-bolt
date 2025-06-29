
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseStore } from '../../store/supabaseStore';
import Navbar from '../../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminPanchayaths = () => {
  const navigate = useNavigate();
  const { 
    currentAdmin, 
    panchayaths, 
    addPanchayath, 
    updatePanchayath, 
    deletePanchayath,
    fetchPanchayaths 
  } = useSupabaseStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', district: '' });

  useEffect(() => {
    if (!currentAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchPanchayaths();
  }, [currentAdmin, navigate, fetchPanchayaths]);

  if (!currentAdmin) {
    return null;
  }

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.district.trim()) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingId) {
        await updatePanchayath(editingId, { ...formData });
        toast({
          title: "Success",
          description: "Panchayath updated successfully"
        });
        setEditingId(null);
      } else {
        await addPanchayath({ ...formData, isActive: true });
        toast({
          title: "Success",
          description: "Panchayath added successfully"
        });
        setShowAddForm(false);
      }
      
      setFormData({ name: '', district: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save panchayath",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (panchayath: any) => {
    setFormData({ name: panchayath.name, district: panchayath.district });
    setEditingId(panchayath.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this panchayath?')) {
      try {
        await deletePanchayath(id);
        toast({
          title: "Success",
          description: "Panchayath deleted successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete panchayath",
          variant: "destructive"
        });
      }
    }
  };

  const cancelEdit = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ name: '', district: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panchayath Management</h1>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Add Panchayath
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Panchayath' : 'Add New Panchayath'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Panchayath Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter panchayath name"
                  />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                    placeholder="Enter district name"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={handleSubmit}>
                  {editingId ? 'Update' : 'Add'} Panchayath
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Panchayaths ({panchayaths.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {panchayaths.map(panchayath => (
                <Card key={panchayath.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{panchayath.name}</h3>
                        <p className="text-sm text-gray-600">{panchayath.district}</p>
                      </div>
                      <Badge variant={panchayath.isActive ? 'default' : 'secondary'}>
                        {panchayath.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(panchayath)}>
                        <Edit size={14} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(panchayath.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanchayaths;
