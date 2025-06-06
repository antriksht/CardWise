import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useCardStore, CreditCard } from '../store/cardStore';

const cardSchema = z.object({
  name: z.string().min(2, 'Card name is required'),
  bank: z.string().min(2, 'Bank name is required'),
  type: z.enum(['basic', 'premium', 'super-premium']),
  annualFee: z.number().min(0, 'Annual fee must be positive'),
  joiningBonus: z.number().min(0, 'Joining bonus must be positive'),
  minSalary: z.number().min(10000, 'Minimum salary required'),
  minCibilScore: z.number().min(300).max(900, 'Invalid CIBIL score range'),
  maxAge: z.number().min(18).max(100, 'Invalid age range'),
  features: z.string().min(1, 'Features are required'),
  benefits: z.string().min(1, 'Benefits are required'),
  image: z.string().url('Invalid image URL'),
  affiliateUrl: z.string().url('Invalid affiliate URL'),
  tags: z.string().min(1, 'Tags are required'),
  isActive: z.boolean(),
});

interface AdminCardFormProps {
  card?: CreditCard | null;
  onClose: () => void;
}

export const AdminCardForm: React.FC<AdminCardFormProps> = ({ card, onClose }) => {
  const { addCard, updateCard } = useCardStore();
  const isEditing = !!card;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cardSchema),
    defaultValues: card ? {
      ...card,
      features: card.features.join(', '),
      benefits: card.benefits.join(', '),
      tags: card.tags.join(', '),
      rewards: [] // We'll handle rewards separately if needed
    } : {
      type: 'basic',
      annualFee: 0,
      joiningBonus: 0,
      minSalary: 25000,
      minCibilScore: 650,
      maxAge: 65,
      isActive: true,
    }
  });

  const onSubmit = (data: any) => {
    const processedData = {
      ...data,
      features: data.features.split(',').map((f: string) => f.trim()),
      benefits: data.benefits.split(',').map((b: string) => b.trim()),
      tags: data.tags.split(',').map((t: string) => t.trim()),
      rewards: card?.rewards || [
        { category: 'Others', rate: 1 }
      ]
    };

    if (isEditing && card) {
      updateCard(card.id, processedData);
    } else {
      const newCard: CreditCard = {
        id: Date.now().toString(),
        ...processedData,
      };
      addCard(newCard);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Edit Credit Card' : 'Add New Credit Card'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Name *
                </label>
                <input
                  {...register('name')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="HDFC Regalia"
                />
                {errors.name && (
                  <p className="text-error-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank *
                </label>
                <input
                  {...register('bank')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="HDFC Bank"
                />
                {errors.bank && (
                  <p className="text-error-500 text-sm mt-1">{errors.bank.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Type *
                </label>
                <select
                  {...register('type')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="super-premium">Super Premium</option>
                </select>
                {errors.type && (
                  <p className="text-error-500 text-sm mt-1">{errors.type.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  {...register('isActive')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Active (visible to users)
                </label>
              </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Financial Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Fee (₹) *
                </label>
                <input
                  {...register('annualFee', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="2500"
                />
                {errors.annualFee && (
                  <p className="text-error-500 text-sm mt-1">{errors.annualFee.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joining Bonus (₹) *
                </label>
                <input
                  {...register('joiningBonus', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="10000"
                />
                {errors.joiningBonus && (
                  <p className="text-error-500 text-sm mt-1">{errors.joiningBonus.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Annual Salary (₹) *
                </label>
                <input
                  {...register('minSalary', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="100000"
                />
                {errors.minSalary && (
                  <p className="text-error-500 text-sm mt-1">{errors.minSalary.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum CIBIL Score *
                </label>
                <input
                  {...register('minCibilScore', { valueAsNumber: true })}
                  type="number"
                  min="300"
                  max="900"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="750"
                />
                {errors.minCibilScore && (
                  <p className="text-error-500 text-sm mt-1">{errors.minCibilScore.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Age *
                </label>
                <input
                  {...register('maxAge', { valueAsNumber: true })}
                  type="number"
                  min="18"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="65"
                />
                {errors.maxAge && (
                  <p className="text-error-500 text-sm mt-1">{errors.maxAge.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Features and Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features (comma-separated) *
              </label>
              <textarea
                {...register('features')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Airport Lounge Access, Fuel Surcharge Waiver, Reward Points"
              />
              {errors.features && (
                <p className="text-error-500 text-sm mt-1">{errors.features.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits (comma-separated) *
              </label>
              <textarea
                {...register('benefits')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="6 complimentary airport lounge visits per year, 1% fuel surcharge waiver"
              />
              {errors.benefits && (
                <p className="text-error-500 text-sm mt-1">{errors.benefits.message}</p>
              )}
            </div>
          </div>

          {/* URLs and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Image URL *
              </label>
              <input
                {...register('image')}
                type="url"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://images.pexels.com/..."
              />
              {errors.image && (
                <p className="text-error-500 text-sm mt-1">{errors.image.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Affiliate URL *
              </label>
              <input
                {...register('affiliateUrl')}
                type="url"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://example.com/apply"
              />
              {errors.affiliateUrl && (
                <p className="text-error-500 text-sm mt-1">{errors.affiliateUrl.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated) *
            </label>
            <input
              {...register('tags')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Travel Benefits, Dining Rewards, Best Cashback"
            />
            {errors.tags && (
              <p className="text-error-500 text-sm mt-1">{errors.tags.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-glow transition-all duration-300"
            >
              {isEditing ? 'Update Card' : 'Add Card'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};