
import React from 'react';
import { Category } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowRight, Star } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  onSelect: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect }) => {
  const discount = category.actualFee > 0 ? Math.round(((category.actualFee - category.offerFee) / category.actualFee) * 100) : 0;

  return (
    <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="pb-4 relative">
        <div className="flex justify-between items-start mb-3">
          <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
            {category.name}
          </CardTitle>
          {discount > 0 && (
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-sm">
              <Star size={12} className="mr-1" />
              {discount}% OFF
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3 mb-2">
          {category.actualFee > 0 ? (
            <>
              <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                ₹{category.offerFee}
              </span>
              {category.actualFee > category.offerFee && (
                <span className="text-xl text-gray-400 line-through">
                  ₹{category.actualFee}
                </span>
              )}
            </>
          ) : (
            <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              FREE
            </span>
          )}
        </div>
        
        {discount > 0 && (
          <div className="text-sm text-green-600 font-medium">
            Save ₹{category.actualFee - category.offerFee}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="relative">
        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4">
          {category.description}
        </p>
        
        <Button 
          onClick={() => onSelect(category)}
          className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-green-600 transition-all duration-300 bg-gray-800 hover:bg-gray-900 text-white shadow-md hover:shadow-lg"
        >
          Register Now
          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
