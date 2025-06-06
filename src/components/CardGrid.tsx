import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from '../store/cardStore';
import { CardComponent } from './CardComponent';

interface CardGridProps {
  cards: CreditCard[];
  userProfile?: any;
}

export const CardGrid: React.FC<CardGridProps> = ({ cards, userProfile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <CardComponent card={card} userProfile={userProfile} />
        </motion.div>
      ))}
    </div>
  );
};