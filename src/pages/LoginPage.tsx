import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, CreditCard, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const LoginPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'login' | 'register' | 'password-sent'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [existingUser, setExistingUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkUserExists, sendPasswordToEmail, login, register: registerUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    resolver: zodResolver(
      step === 'email' ? emailSchema :
      step === 'login' ? loginSchema :
      registerSchema
    )
  });

  const handleEmailSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { exists, user } = await checkUserExists(data.email);
      setUserEmail(data.email);
      
      if (exists && user) {
        setExistingUser(user);
        setStep('login');
        reset({ email: data.email });
      } else {
        // New user - send password to email
        const sent = await sendPasswordToEmail(data.email, true);
        if (sent) {
          setStep('password-sent');
        } else {
          setError('root', { message: 'Failed to send password email. Please try again.' });
        }
      }
    } catch (error) {
      setError('root', { message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (data: any) => {
    setLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/');
      } else {
        setError('root', { message: 'Invalid password. Please try again.' });
      }
    } catch (error) {
      setError('root', { message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: any) => {
    setLoading(true);
    try {
      const success = await registerUser(data, data.password);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      setError('root', { message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const sent = await sendPasswordToEmail(userEmail, false);
      if (sent) {
        setStep('password-sent');
      } else {
        setError('root', { message: 'Failed to send password reset email.' });
      }
    } catch (error) {
      setError('root', { message: 'Failed to send password reset email.' });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: any) => {
    if (step === 'email') {
      handleEmailSubmit(data);
    } else if (step === 'login') {
      handleLoginSubmit(data);
    } else if (step === 'register') {
      handleRegisterSubmit(data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-card p-8"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl mb-4">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              CardWise
            </h1>
            <p className="text-gray-600 mt-2">
              {step === 'email' && 'Enter your email to continue'}
              {step === 'login' && `Welcome back, ${existingUser?.name || 'User'}!`}
              {step === 'register' && 'Complete your profile'}
              {step === 'password-sent' && 'Check your email'}
            </p>
          </div>

          {step === 'password-sent' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-success-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Check Your Email!</h3>
                <p className="text-gray-600 text-sm">
                  We've sent a password reset link to <strong>{userEmail}</strong>.
                  Follow the instructions in the email to set your password.
                </p>
              </div>
              <button
                onClick={() => {
                  setStep('login');
                  reset({ email: userEmail });
                }}
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-glow transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Continue to Login</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {step === 'email' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
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
                </motion.div>
              )}

              {step === 'login' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-error-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'register' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
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
                      Phone Number
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
                      Email Address
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-error-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      {...register('confirmPassword')}
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-error-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {errors.root && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                  <p className="text-error-700 text-sm">{errors.root.message}</p>
                </div>
              )}

              <div className="flex space-x-3">
                {step !== 'email' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 'login') setStep('email');
                      if (step === 'register') setStep('email');
                      reset();
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Please wait...' : 
                   step === 'email' ? 'Continue' :
                   step === 'login' ? 'Sign In' :
                   'Create Account'}
                </button>
              </div>

              {step === 'register' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep('register')}
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors text-sm"
                  >
                    Want to set your own password? Click here
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Demo Credentials */}
          {step === 'email' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Admin: admin@cardwise.in</div>
                <div>User: user@example.com</div>
              </div>
            </div>
          )}

          {/* Guest Access */}
          <div className="text-center mt-4">
            <Link
              to="/compare"
              className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              Continue as Guest
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};