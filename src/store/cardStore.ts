import { create } from 'zustand';

export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  type: 'basic' | 'premium' | 'super-premium';
  annualFee: number;
  joiningBonus: number;
  minSalary: number;
  minCibilScore: number;
  maxAge: number;
  features: string[];
  rewards: {
    category: string;
    rate: number;
  }[];
  benefits: string[];
  image: string;
  affiliateUrl: string;
  tags: string[];
  isActive: boolean;
}

interface CardState {
  cards: CreditCard[];
  filteredCards: CreditCard[];
  selectedCard: CreditCard | null;
  filters: {
    bank: string[];
    type: string[];
    minSalary: number;
    maxAnnualFee: number;
    features: string[];
  };
  setCards: (cards: CreditCard[]) => void;
  setSelectedCard: (card: CreditCard | null) => void;
  updateFilters: (filters: Partial<CardState['filters']>) => void;
  applyFilters: () => void;
  getEligibleCards: (userProfile: any) => CreditCard[];
  addCard: (card: CreditCard) => void;
  updateCard: (id: string, updates: Partial<CreditCard>) => void;
  deleteCard: (id: string) => void;
}

// Mock credit card data
const mockCards: CreditCard[] = [
  {
    id: '1',
    name: 'HDFC Regalia',
    bank: 'HDFC Bank',
    type: 'premium',
    annualFee: 2500,
    joiningBonus: 10000,
    minSalary: 100000,
    minCibilScore: 750,
    maxAge: 65,
    features: ['Airport Lounge Access', 'Fuel Surcharge Waiver', 'Reward Points'],
    rewards: [
      { category: 'Dining', rate: 4 },
      { category: 'Travel', rate: 3 },
      { category: 'Others', rate: 1 }
    ],
    benefits: [
      '6 complimentary airport lounge visits per year',
      '1% fuel surcharge waiver',
      'Up to 4 reward points per ₹150 spent'
    ],
    image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
    affiliateUrl: 'https://example.com/hdfc-regalia',
    tags: ['Travel Benefits', 'Dining Rewards'],
    isActive: true
  },
  {
    id: '2',
    name: 'SBI SimplyCLICK',
    bank: 'State Bank of India',
    type: 'basic',
    annualFee: 499,
    joiningBonus: 500,
    minSalary: 25000,
    minCibilScore: 650,
    maxAge: 70,
    features: ['Online Shopping Rewards', 'Cashback', 'Contactless Payments'],
    rewards: [
      { category: 'Online Shopping', rate: 10 },
      { category: 'Others', rate: 1 }
    ],
    benefits: [
      '10X reward points on online spends',
      '1% cashback on all other spends',
      'Contactless payment enabled'
    ],
    image: 'https://images.pexels.com/photos/164501/pexels-photo-164501.jpeg',
    affiliateUrl: 'https://example.com/sbi-simplyclick',
    tags: ['Best Cashback', 'Low CIBIL Friendly'],
    isActive: true
  },
  {
    id: '3',
    name: 'ICICI Amazon Pay',
    bank: 'ICICI Bank',
    type: 'basic',
    annualFee: 500,
    joiningBonus: 2000,
    minSalary: 30000,
    minCibilScore: 700,
    maxAge: 65,
    features: ['Amazon Cashback', 'Utility Bill Payments', 'UPI Payments'],
    rewards: [
      { category: 'Amazon', rate: 5 },
      { category: 'Utilities', rate: 2 },
      { category: 'Others', rate: 1 }
    ],
    benefits: [
      '5% cashback on Amazon purchases',
      '2% cashback on utility bill payments',
      'Welcome bonus Amazon voucher worth ₹2000'
    ],
    image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg',
    affiliateUrl: 'https://example.com/icici-amazon',
    tags: ['Best Cashback', 'Online Shopping'],
    isActive: true
  }
];

export const useCardStore = create<CardState>((set, get) => ({
  cards: mockCards,
  filteredCards: mockCards,
  selectedCard: null,
  filters: {
    bank: [],
    type: [],
    minSalary: 0,
    maxAnnualFee: 10000,
    features: []
  },

  setCards: (cards) => set({ cards, filteredCards: cards }),

  setSelectedCard: (card) => set({ selectedCard: card }),

  updateFilters: (newFilters) => {
    const currentFilters = get().filters;
    set({ filters: { ...currentFilters, ...newFilters } });
  },

  applyFilters: () => {
    const { cards, filters } = get();
    let filtered = cards.filter(card => card.isActive);

    if (filters.bank.length > 0) {
      filtered = filtered.filter(card => filters.bank.includes(card.bank));
    }

    if (filters.type.length > 0) {
      filtered = filtered.filter(card => filters.type.includes(card.type));
    }

    if (filters.minSalary > 0) {
      filtered = filtered.filter(card => card.minSalary <= filters.minSalary);
    }

    if (filters.maxAnnualFee < 10000) {
      filtered = filtered.filter(card => card.annualFee <= filters.maxAnnualFee);
    }

    set({ filteredCards: filtered });
  },

  getEligibleCards: (userProfile) => {
    const { cards } = get();
    if (!userProfile) return cards.filter(card => card.isActive);

    return cards.filter(card => {
      if (!card.isActive) return false;
      
      const salaryEligible = userProfile.monthlySalary * 12 >= card.minSalary;
      const cibilEligible = userProfile.cibilScore >= card.minCibilScore;
      
      return salaryEligible && cibilEligible;
    }).sort((a, b) => {
      // Rank cards based on user profile
      const scoreA = calculateCardScore(a, userProfile);
      const scoreB = calculateCardScore(b, userProfile);
      return scoreB - scoreA;
    });
  },

  addCard: (card) => {
    const cards = [...get().cards, card];
    set({ cards, filteredCards: cards });
  },

  updateCard: (id, updates) => {
    const cards = get().cards.map(card => 
      card.id === id ? { ...card, ...updates } : card
    );
    set({ cards, filteredCards: cards });
  },

  deleteCard: (id) => {
    const cards = get().cards.filter(card => card.id !== id);
    set({ cards, filteredCards: cards });
  }
}));

// Helper function to calculate card score for ranking
function calculateCardScore(card: CreditCard, userProfile: any): number {
  let score = 0;
  
  // Base score by card type
  const typeScores = { basic: 1, premium: 2, 'super-premium': 3 };
  score += typeScores[card.type] || 1;
  
  // Bonus for lower annual fee
  score += Math.max(0, (5000 - card.annualFee) / 1000);
  
  // Bonus for higher joining bonus
  score += card.joiningBonus / 5000;
  
  // Salary utilization efficiency
  const salaryUtilization = (userProfile.monthlySalary * 12) / card.minSalary;
  if (salaryUtilization > 2) score += 2;
  else if (salaryUtilization > 1.5) score += 1;
  
  return score;
}