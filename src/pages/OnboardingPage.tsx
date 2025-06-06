import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, User, DollarSign, CreditCard, Target } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const personalInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
});

const financialInfoSchema = z.object({
  monthlySalary: z.number().min(10000, 'Monthly salary must be at least ₹10,000'),
  cibilScore: z.number().min(300).max(900),
  totalEmi: z.number().min(0),
});

const steps = [
  { id: 1, title: 'Personal Info', icon: User, description: 'Tell us about yourself' },
  { id: 2, title: 'Financial Info', icon: DollarSign, description: 'Your financial details' },
  { id: 3, title: 'Credit Cards', icon: CreditCard, description: 'Current credit cards' },
  { id: 4, title: 'Preferences', icon: Target, description: 'What you\'re looking for' },
];

export const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: currentStep === 1 ? zodResolver(personalInfoSchema) : 
               currentStep === 2 ? zodResolver(financialInfoSchema) : undefined
  });

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: any) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    if (currentStep === 4) {
      // Complete onboarding
      if (user) {
        updateProfile(updatedFormData);
      }
      navigate('/compare', { state: { userProfile: updatedFormData } });
    } else {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <step.icon className="h-5 w-5" />
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-24 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              {steps[currentStep - 1].title}
            </h1>
            <p className="text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-card p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('name')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-error-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-error-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number *
                    </label>
                    <input
                      {...register('phone')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="9876543210"
                    />
                    {errors.phone && (
                      <p className="text-error-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      {...register('dateOfBirth')}
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.dateOfBirth && (
                      <p className="text-error-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      {...register('city')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Mumbai"
                    />
                    {errors.city && (
                      <p className="text-error-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      {...register('state')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                    {errors.state && (
                      <p className="text-error-500 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Salary (₹) *
                    </label>
                    <input
                      {...register('monthlySalary', { valueAsNumber: true })}
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="50000"
                    />
                    {errors.monthlySalary && (
                      <p className="text-error-500 text-sm mt-1">{errors.monthlySalary.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CIBIL Score *
                    </label>
                    <input
                      {...register('cibilScore', { valueAsNumber: true })}
                      type="number"
                      min="300"
                      max="900"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="750"
                    />
                    {errors.cibilScore && (
                      <p className="text-error-500 text-sm mt-1">{errors.cibilScore.message}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Don't know your CIBIL score? Check it for free on CIBIL's official website.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Monthly EMI (₹)
                    </label>
                    <input
                      {...register('totalEmi', { valueAsNumber: true })}
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Include all loans: home, car, personal, etc.
                    </p>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Do you currently have any credit cards?
                    </label>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          {...register('hasCreditCards')}
                          value="no"
                          className="h-4 w-4 text-primary-600"
                        />
                        <span className="ml-2">No, this will be my first credit card</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          {...register('hasCreditCards')}
                          value="yes"
                          className="h-4 w-4 text-primary-600"
                        />
                        <span className="ml-2">Yes, I have credit cards</span>
                      </label>
                    </div>
                  </div>

                  {watch('hasCreditCards') === 'yes' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Credit Cards
                        </label>
                        <select
                          {...register('creditCardCount')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Select</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4+">4 or more</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Highest Credit Limit (₹)
                        </label>
                        <input
                          {...register('highestCreditLimit', { valueAsNumber: true })}
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="100000"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      What are you looking for in a credit card? (Select all that apply)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        'Cashback Rewards',
                        'Travel Benefits',
                        'Dining Rewards',
                        'Fuel Savings',
                        'Shopping Discounts',
                        'Airport Lounge Access',
                        'Low Interest Rates',
                        'No Annual Fee'
                      ].map((preference) => (
                        <label key={preference} className="flex items-center">
                          <input
                            type="checkbox"
                            {...register('preferences')}
                            value={preference}
                            className="h-4 w-4 text-primary-600 rounded"
                          />
                          <span className="ml-2">{preference}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary card usage
                    </label>
                    <select
                      {...register('primaryUsage')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select primary usage</option>
                      <option value="daily-expenses">Daily Expenses</option>
                      <option value="online-shopping">Online Shopping</option>
                      <option value="travel">Travel & Entertainment</option>
                      <option value="business">Business Expenses</option>
                      <option value="emergency">Emergency Backup</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <button
                type="submit"
                className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-glow transition-all duration-300"
              >
                <span>{currentStep === 4 ? 'Find My Cards' : 'Next'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};