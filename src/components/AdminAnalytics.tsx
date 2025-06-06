import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, CreditCard, Eye, MousePointer, ExternalLink } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  // Mock analytics data
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'primary'
    },
    {
      title: 'Card Views',
      value: '18,392',
      change: '+8.2%',
      trend: 'up',
      icon: Eye,
      color: 'success'
    },
    {
      title: 'Applications',
      value: '1,234',
      change: '+15.3%',
      trend: 'up',
      icon: MousePointer,
      color: 'accent'
    },
    {
      title: 'Conversion Rate',
      value: '6.7%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'warning'
    }
  ];

  const topCards = [
    { name: 'HDFC Regalia', views: 2847, applications: 234, conversion: '8.2%' },
    { name: 'SBI SimplyCLICK', views: 2156, applications: 189, conversion: '8.8%' },
    { name: 'ICICI Amazon Pay', views: 1923, applications: 156, conversion: '8.1%' },
    { name: 'Axis Bank Neo', views: 1654, applications: 98, conversion: '5.9%' },
    { name: 'Kotak 811', views: 1432, applications: 87, conversion: '6.1%' }
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'Applied for HDFC Regalia', time: '2 minutes ago' },
    { user: 'Jane Smith', action: 'Viewed SBI SimplyCLICK', time: '5 minutes ago' },
    { user: 'Mike Johnson', action: 'Completed profile', time: '8 minutes ago' },
    { user: 'Sarah Wilson', action: 'Applied for ICICI Amazon Pay', time: '12 minutes ago' },
    { user: 'David Brown', action: 'Viewed Axis Bank Neo', time: '15 minutes ago' }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className={`text-sm mt-2 flex items-center ${
                  stat.trend === 'up' ? 'text-success-600' : 'text-error-600'
                }`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <CreditCard className="h-5 w-5 text-primary-600 mr-2" />
            Top Performing Cards
          </h3>
          <div className="space-y-4">
            {topCards.map((card, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{card.name}</div>
                  <div className="text-sm text-gray-500">{card.views} views • {card.applications} applications</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">{card.conversion}</div>
                  <div className="text-sm text-gray-500">conversion</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 text-success-600 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{activity.user}</div>
                  <div className="text-sm text-gray-600">{activity.action}</div>
                  <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <h3 className="text-lg font-semibold mb-6">Analytics Overview</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chart visualization would be implemented here</p>
            <p className="text-sm">Integration with a charting library (e.g., Chart.js or Recharts) would be implemented here</p>
          </div>
        </div>
      </motion.div>

      {/* Export Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Export Data</h3>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <ExternalLink className="h-4 w-4" />
            <span>Export User Data (CSV)</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors">
            <ExternalLink className="h-4 w-4" />
            <span>Export Analytics (PDF)</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors">
            <ExternalLink className="h-4 w-4" />
            <span>Export Card Performance (Excel)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

function BarChart3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}