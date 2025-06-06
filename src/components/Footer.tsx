import React from 'react';
import { CreditCard, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">CardWise</h3>
                <p className="text-xs text-gray-400">Compare. Choose. Apply. Smarter.</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted partner in finding the perfect credit card for your financial journey.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/compare" className="text-gray-400 hover:text-white transition-colors">Compare Cards</a></li>
              <li><a href="/onboarding" className="text-gray-400 hover:text-white transition-colors">Find My Card</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Credit Score Check</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Financial Tools</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@cardwise.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 80000 12345</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 CardWise. All rights reserved. | Made with ❤️ for Indian consumers</p>
        </div>
      </div>
    </footer>
  );
};