
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseStore } from '../../store/supabaseStore';
import Navbar from '../../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Trash2, Image } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminCategories = () => {
  const navigate = useNavigate();
  const { 
    currentAdmin, 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    fetchCategories 
  } = useSupabaseStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    actualFee: 0, 
    offerFee: 0, 
    image: '' 
  });

  useEffect(() => {
    if (!currentAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchCategories();
  }, [currentAdmin, navigate, fetchCategories]);

  if (!currentAdmin) {
    return null;
  }

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, { ...formData, isActive: true });
        toast({
          title: "Success",
          description: "Category updated successfully"
        });
        setEditingId(null);
      } else {
        await addCategory({ ...formData, isActive: true });
        toast({
          title: "Success",
          description: "Category added successfully"
        });
        setShowAddForm(false);
      }
      
      setFormData({ name: '', description: '', actualFee: 0, offerFee: 0, image: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (category: any) => {
    setFormData({ 
      name: category.name, 
      description: category.description,
      actualFee: category.actualFee,
      offerFee: category.offerFee,
      image: category.image || ''
    });
    setEditingId(category.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        toast({
          title: "Success",
          description: "Category deleted successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive"
        });
      }
    }
  };

  const cancelEdit = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '', actualFee: 0, offerFee: 0, image: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Add Category
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Category' : 'Add New Category'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Enter image URL"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="actualFee">Actual Fee (₹)</Label>
                  <Input
                    id="actualFee"
                    type="number"
                    value={formData.actualFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, actualFee: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="offerFee">Offer Fee (₹)</Label>
                  <Input
                    id="offerFee"
                    type="number"
                    value={formData.offerFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, offerFee: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSubmit}>
                  {editingId ? 'Update' : 'Add'} Category
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
            <CardTitle>Categories ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => (
                <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{category.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          {category.image && <Image size={14} className="text-blue-500" />}
                          <span className="text-sm font-medium">
                            Fee: {category.actualFee > 0 ? `₹${category.offerFee}` : 'FREE'}
                          </span>
                          {category.actualFee > category.offerFee && category.actualFee > 0 && (
                            <span className="text-xs text-gray-500 line-through">₹{category.actualFee}</span>
                          )}
                        </div>
                      </div>
                      <Badge variant={category.isActive ? 'default' : 'secondary'}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>
                        <Edit size={14} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(category.id)}>
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

export default AdminCategories;
