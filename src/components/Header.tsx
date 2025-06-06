import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, User, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg group-hover:shadow-glow transition-all duration-300">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                CardWise
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Compare. Choose. Apply. Smarter.</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/compare" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Compare Cards
            </Link>
            <Link to="/onboarding" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Find My Card
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </div>
                {user.isAdmin && (
                  <Link 
                    to="/admin" 
                    className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                    title="Admin Dashboard"
                  >
                    <Settings className="h-4 w-4" />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:text-error-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-2 rounded-lg hover:shadow-glow transition-all duration-300 font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};