import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, BarChart3, Users, CreditCard as CreditCardIcon } from 'lucide-react';
import { useCardStore, CreditCard } from '../store/cardStore';
import { AdminCardForm } from '../components/AdminCardForm';
import { AdminAnalytics } from '../components/AdminAnalytics';
import { AdminUserManagement } from '../components/AdminUserManagement';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cards');
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const { cards, deleteCard } = useCardStore();

  const tabs = [
    { id: 'cards', label: 'Manage Cards', icon: CreditCardIcon },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const handleEditCard = (card: CreditCard) => {
    setEditingCard(card);
    setShowCardForm(true);
  };

  const handleDeleteCard = (id: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      deleteCard(id);
    }
  };

  const handleCloseForm = () => {
    setShowCardForm(false);
    setEditingCard(null);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage credit cards, users, and view analytics</p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'cards' && (
            <div className="space-y-6">
              {/* Add Card Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Credit Cards ({cards.length})</h2>
                <button
                  onClick={() => setShowCardForm(true)}
                  className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Card</span>
                </button>
              </div>

              {/* Cards Table */}
              <div className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Card
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Annual Fee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cards.map(card => (
                        <tr key={card.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={card.image}
                                alt={card.name}
                                className="h-10 w-16 object-cover rounded mr-3"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{card.name}</div>
                                <div className="text-sm text-gray-500">{card.tags.join(', ')}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {card.bank}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              card.type === 'basic' ? 'bg-green-100 text-green-800' :
                              card.type === 'premium' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {card.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{card.annualFee.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              card.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {card.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEditCard(card)}
                              className="text-primary-600 hover:text-primary-900 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCard(card.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && <AdminUserManagement />}

          {activeTab === 'analytics' && <AdminAnalytics />}
        </motion.div>

        {/* Card Form Modal */}
        {showCardForm && (
          <AdminCardForm
            card={editingCard}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
};