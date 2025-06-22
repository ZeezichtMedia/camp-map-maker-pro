
import React from 'react';
import { Filter, X } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClearAll: () => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  onClearAll,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Filter op categorie</h3>
        </div>
        
        {selectedCategories.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
            Alles wissen
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => onCategoryToggle(category)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                isSelected
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
      
      {selectedCategories.length > 0 && (
        <div className="mt-3 text-sm text-gray-600">
          {selectedCategories.length} categorie{selectedCategories.length !== 1 ? 'ën' : ''} geselecteerd
        </div>
      )}
    </div>
  );
};
