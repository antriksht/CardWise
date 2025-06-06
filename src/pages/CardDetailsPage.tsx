import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Check, X, Shield, Star, Gift, Zap } from 'lucide-react';
import { useCardStore } from '../store/cardStore';

export const CardDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cards } = useCardStore();
  
  const card = cards.find(c => c.id === id);

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Card Not Found</h1>
          <Link
            to="/compare"
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            Back to Compare
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/compare"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Compare</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Card Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-card overflow-hidden"
            >
              <div className="relative h-64">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Tags */}
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                  {card.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-600 text-white text-sm rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Card Info */}
                <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="text-3xl font-bold mb-2">{card.name}</h1>
                  <p className="text-lg opacity-90">{card.bank}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm">4.5/5</span>
                    </div>
                    <div className="text-sm opacity-75">1,234 reviews</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">
                      ₹{card.annualFee.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Annual Fee</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-success-600">
                      ₹{card.joiningBonus.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Joining Bonus</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-accent-600">
                      ₹{(card.minSalary / 100000).toFixed(1)}L
                    </div>
                    <div className="text-sm text-gray-500">Min. Salary</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-warning-600">
                      {card.minCibilScore}+
                    </div>
                    <div className="text-sm text-gray-500">CIBIL Score</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Features & Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-card p-6"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Zap className="h-6 w-6 text-primary-600 mr-2" />
                Features & Benefits
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {card.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Benefits</h3>
                  <ul className="space-y-3">
                    {card.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Gift className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Rewards Structure */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-card p-6"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Star className="h-6 w-6 text-accent-600 mr-2" />
                Rewards Structure
              </h2>
              
              <div className="space-y-4">
                {card.rewards.map((reward, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                      <span className="font-medium text-gray-800">{reward.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary-600">{reward.rate}x</div>
                      <div className="text-sm text-gray-500">reward points</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Eligibility Criteria */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-card p-6"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Shield className="h-6 w-6 text-success-600 mr-2" />
                Eligibility Criteria
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Minimum Age</span>
                    <span className="font-semibold">21 years</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Maximum Age</span>
                    <span className="font-semibold">{card.maxAge} years</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Employment Type</span>
                    <span className="font-semibold">Salaried/Self-employed</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Annual Income</span>
                    <span className="font-semibold">₹{(card.minSalary / 100000).toFixed(1)}L+</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">CIBIL Score</span>
                    <span className="font-semibold">{card.minCibilScore}+</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Work Experience</span>
                    <span className="font-semibold">2+ years</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-card p-6 sticky top-24"
            >
              <div className="text-center space-y-4">
                <div className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">Special Offer</div>
                  <div className="text-sm text-gray-600">Limited time joining bonus</div>
                </div>
                
                <a
                  href={card.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-glow transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="h-5 w-5" />
                </a>
                
                <p className="text-xs text-gray-500">
                  Application processed by {card.bank}. 
                  You'll be redirected to their secure website.
                </p>
              </div>
            </motion.div>

            {/* Quick Facts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Quick Facts</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Card Network</span>
                  <span className="font-medium">Visa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Time</span>
                  <span className="font-medium">7-10 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Credit Limit</span>
                  <span className="font-medium">Up to ₹5L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cash Advance Limit</span>
                  <span className="font-medium">50% of credit limit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance Transfer</span>
                  <span className="font-medium text-success-600">Available</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">EMI Facility</span>
                  <span className="font-medium text-success-600">Available</span>
                </div>
              </div>
            </motion.div>

            {/* Customer Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-800">Customer Care</div>
                  <div className="text-primary-600">1800-XXX-XXXX</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-800">Email Support</div>
                  <div className="text-primary-600">cards@{card.bank.toLowerCase().replace(' ', '')}.com</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-800">Chat Support</div>
                  <div className="text-gray-600">Available 24/7</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};