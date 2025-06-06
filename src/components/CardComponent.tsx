import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Star, Shield, Zap } from 'lucide-react';
import { CreditCard } from '../store/cardStore';

interface CardComponentProps {
  card: CreditCard;
  userProfile?: any;
}

export const CardComponent: React.FC<CardComponentProps> = ({ card, userProfile }) => {
  const isEligible = userProfile ? 
    (userProfile.monthlySalary * 12 >= card.minSalary && userProfile.cibilScore >= card.minCibilScore) : 
    true;

  const eligibilityScore = userProfile ? 
    Math.min(100, Math.round(
      ((userProfile.monthlySalary * 12) / card.minSalary) * 50 + 
      (userProfile.cibilScore / card.minCibilScore) * 50
    )) : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group"
    >
      {/* Card Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {card.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-600 text-white text-xs rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Eligibility Indicator */}
        {userProfile && (
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
            isEligible 
              ? 'bg-success-500 text-white' 
              : 'bg-warning-500 text-white'
          }`}>
            {isEligible ? `${eligibilityScore}% Match` : 'Check Eligibility'}
          </div>
        )}

        {/* Card Title */}
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{card.name}</h3>
          <p className="text-sm opacity-90">{card.bank}</p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-primary-600">
              ₹{card.annualFee.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Annual Fee</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-success-600">
              ₹{card.joiningBonus.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Joining Bonus</div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800 text-sm">Key Features</h4>
          <div className="flex flex-wrap gap-2">
            {card.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md font-medium"
              >
                {feature}
              </span>
            ))}
            {card.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                +{card.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Rewards */}
        {card.rewards.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800 text-sm">Rewards</h4>
            <div className="space-y-1">
              {card.rewards.slice(0, 2).map((reward, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{reward.category}</span>
                  <span className="font-medium text-accent-600">{reward.rate}x</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Eligibility */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Min. Salary</span>
            </div>
            <span className="font-medium">₹{(card.minSalary / 100000).toFixed(1)}L/year</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Min. CIBIL</span>
            </div>
            <span className="font-medium">{card.minCibilScore}+</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <Link
            to={`/card/${card.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium text-center transition-colors text-sm"
          >
            View Details
          </Link>
          <a
            href={card.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-primary-600 to-accent-600 hover:shadow-glow text-white py-2 px-4 rounded-lg font-medium text-center transition-all duration-300 text-sm flex items-center justify-center space-x-1"
          >
            <span>Apply Now</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};