import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Search, ArrowUpDown } from 'lucide-react';
import { useCardStore } from '../store/cardStore';
import { CardGrid } from '../components/CardGrid';
import { FilterSidebar } from '../components/FilterSidebar';

export const ComparePage: React.FC = () => {
  const location = useLocation();
  const { cards, filteredCards, getEligibleCards, applyFilters } = useCardStore();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  
  const userProfile = location.state?.userProfile;
  const displayCards = userProfile ? getEligibleCards(userProfile) : filteredCards;

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const filteredBySearch = displayCards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.features.some(feature => 
      feature.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedCards = [...filteredBySearch].sort((a, b) => {
    switch (sortBy) {
      case 'fee-low':
        return a.annualFee - b.annualFee;
      case 'fee-high':
        return b.annualFee - a.annualFee;
      case 'bonus-high':
        return b.joiningBonus - a.joiningBonus;
      case 'salary-low':
        return a.minSalary - b.minSalary;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {userProfile ? 'Your Matched Credit Cards' : 'Compare Credit Cards'}
              </h1>
              <p className="text-gray-600">
                {userProfile 
                  ? `Found ${sortedCards.length} cards matching your profile`
                  : `Compare features, benefits, and costs of ${sortedCards.length} credit cards`
                }
              </p>
              {userProfile && (
                <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <p className="text-sm text-primary-700">
                    <strong>Profile Summary:</strong> ₹{userProfile.monthlySalary?.toLocaleString()}/month salary, 
                    CIBIL Score: {userProfile.cibilScore}, 
                    {userProfile.hasCreditCards === 'yes' ? `${userProfile.creditCardCount} existing cards` : 'First-time applicant'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="relevance">Most Relevant</option>
                <option value="fee-low">Lowest Annual Fee</option>
                <option value="fee-high">Highest Annual Fee</option>
                <option value="bonus-high">Highest Joining Bonus</option>
                <option value="salary-low">Lowest Salary Requirement</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:block ${showFilters ? 'block' : 'hidden'}`}
          >
            <FilterSidebar />
          </motion.div>

          {/* Cards Grid */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {sortedCards.length > 0 ? (
                <CardGrid cards={sortedCards} userProfile={userProfile} />
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No cards found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your filters or search terms to find more options.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};