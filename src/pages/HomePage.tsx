import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Search, Shield, Zap, TrendingUp, Users } from 'lucide-react';

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: 'Smart Matching',
      description: 'AI-powered algorithm matches you with perfect credit cards based on your financial profile.'
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Bank-grade security with trusted affiliate partnerships. Your data is always protected.'
    },
    {
      icon: Zap,
      title: 'Instant Eligibility',
      description: 'Check eligibility in seconds without affecting your credit score.'
    },
    {
      icon: TrendingUp,
      title: 'Best Offers',
      description: 'Access exclusive deals and joining bonuses not available elsewhere.'
    }
  ];

  const stats = [
    { number: '50+', label: 'Credit Cards' },
    { number: '25+', label: 'Bank Partners' },
    { number: '10K+', label: 'Happy Users' },
    { number: '₹50L+', label: 'Credit Approved' }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Find Your{' '}
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Perfect
                </span>{' '}
                Credit Card
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Compare credit cards, check eligibility, and apply instantly. 
                Get personalized recommendations based on your financial profile.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/onboarding"
                className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-glow transition-all duration-300 text-center"
              >
                Find My Card
              </Link>
              <Link
                to="/compare"
                className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all duration-300 text-center"
              >
                Compare Cards
              </Link>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-primary-600">{stat.number}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg"
                alt="Credit Cards"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-accent-600/20 rounded-2xl blur-3xl transform scale-110" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl font-bold">Why Choose CardWise?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make credit card selection simple, smart, and secure with our advanced matching technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl font-bold">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get your perfect credit card in just 3 simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Share Your Profile',
              description: 'Tell us about your financial situation, income, and credit history.',
              icon: Users
            },
            {
              step: '02',
              title: 'Get Matched',
              description: 'Our AI analyzes your profile and finds the best credit card options.',
              icon: Search
            },
            {
              step: '03',
              title: 'Apply Instantly',
              description: 'Choose your favorite card and apply directly through our secure platform.',
              icon: CreditCard
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative text-center group"
            >
              <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-primary-600 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 transform -translate-y-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-white">
              Ready to Find Your Perfect Credit Card?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of users who have found their ideal credit card with CardWise. 
              Start your journey today!
            </p>
            <Link
              to="/onboarding"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-glow transition-all duration-300"
            >
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};