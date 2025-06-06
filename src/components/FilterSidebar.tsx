import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCardStore } from '../store/cardStore';

export const FilterSidebar: React.FC = () => {
  const { filters, updateFilters, applyFilters, cards } = useCardStore();

  const banks = [...new Set(cards.map(card => card.bank))];
  const cardTypes = ['basic', 'premium', 'super-premium'];
  const features = [...new Set(cards.flatMap(card => card.features))];

  const handleFilterChange = (filterType: string, value: any) => {
    const updatedFilters = { ...filters };
    
    if (filterType === 'bank' || filterType === 'type' || filterType === 'features') {
      const currentArray = updatedFilters[filterType] as string[];
      if (currentArray.includes(value)) {
        updatedFilters[filterType] = currentArray.filter(item => item !== value);
      } else {
        updatedFilters[filterType] = [...currentArray, value];
      }
    } else {
      updatedFilters[filterType] = value;
    }
    
    updateFilters(updatedFilters);
    applyFilters();
  };

  const clearFilters = () => {
    updateFilters({
      bank: [],
      type: [],
      minSalary: 0,
      maxAnnualFee: 10000,
      features: []
    });
    applyFilters();
  };

  const hasActiveFilters = 
    filters.bank.length > 0 || 
    filters.type.length > 0 || 
    filters.minSalary > 0 || 
    filters.maxAnnualFee < 10000 || 
    filters.features.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-card p-6 sticky top-24"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-primary-600 text-sm hover:text-primary-700 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Bank Filter */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Bank</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {banks.map(bank => (
              <label key={bank} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.bank.includes(bank)}
                  onChange={() => handleFilterChange('bank', bank)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{bank}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Card Type Filter */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Card Type</h4>
          <div className="space-y-2">
            {cardTypes.map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.type.includes(type)}
                  onChange={() => handleFilterChange('type', type)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {type.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Annual Fee Filter */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">
            Max Annual Fee: ₹{filters.maxAnnualFee.toLocaleString()}
          </h4>
          <input
            type="range"
            min="0"
            max="10000"
            step="500"
            value={filters.maxAnnualFee}
            onChange={(e) => handleFilterChange('maxAnnualFee', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹0</span>
            <span>₹10,000+</span>
          </div>
        </div>

        {/* Minimum Salary Filter */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">
            Min Annual Salary: ₹{filters.minSalary ? (filters.minSalary / 100000).toFixed(1) + 'L' : 'Any'}
          </h4>
          <input
            type="range"
            min="0"
            max="2000000"
            step="100000"
            value={filters.minSalary}
            onChange={(e) => handleFilterChange('minSalary', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Any</span>
            <span>₹20L+</span>
          </div>
        </div>

        {/* Features Filter */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Features</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {features.slice(0, 8).map(feature => (
              <label key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.features.includes(feature)}
                  onChange={() => handleFilterChange('features', feature)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{feature}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};