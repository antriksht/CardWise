import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  profile?: UserProfile;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  passwordResetToken?: string;
}

export interface UserProfile {
  dateOfBirth: string;
  city: string;
  state: string;
  monthlySalary: number;
  loans: Loan[];
  creditCards: CreditCardInfo[];
  cibilScore: number;
  totalEmi: number;
  hasCreditCards: string;
  creditCardCount?: string;
  highestCreditLimit?: number;
  preferences?: string[];
  primaryUsage?: string;
}

export interface Loan {
  type: string;
  emi: number;
}

export interface CreditCardInfo {
  bank: string;
  limit: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[]; // For admin management
  checkUserExists: (email: string) => Promise<{ exists: boolean; user?: User }>;
  sendPasswordToEmail: (email: string, isNewUser: boolean) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
  // Admin functions
  getAllUsers: () => User[];
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  resetUserPassword: (id: string) => Promise<string>;
}

// Mock users database
const mockUsers: User[] = [
  { 
    id: '1', 
    email: 'admin@cardwise.in', 
    password: 'admin123', 
    name: 'Admin User', 
    isAdmin: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T10:30:00Z',
    isActive: true
  },
  { 
    id: '2', 
    email: 'user@example.com', 
    password: 'user123', 
    name: 'John Doe', 
    isAdmin: false,
    phone: '9876543210',
    createdAt: '2024-01-05T00:00:00Z',
    lastLogin: '2024-01-14T15:45:00Z',
    isActive: true
  },
  {
    id: '3',
    email: 'jane.smith@gmail.com',
    password: 'temp456',
    name: 'Jane Smith',
    isAdmin: false,
    phone: '9123456789',
    createdAt: '2024-01-10T00:00:00Z',
    lastLogin: '2024-01-13T09:20:00Z',
    isActive: true,
    profile: {
      dateOfBirth: '1990-05-15',
      city: 'Mumbai',
      state: 'Maharashtra',
      monthlySalary: 75000,
      loans: [],
      creditCards: [],
      cibilScore: 780,
      totalEmi: 0,
      hasCreditCards: 'no'
    }
  }
];

// Helper function to generate random password
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Helper function to simulate email sending
const simulateEmailSend = (email: string, password: string, isNewUser: boolean) => {
  console.log(`📧 Email sent to ${email}:`);
  console.log(`Subject: ${isNewUser ? 'Welcome to CardWise - Your Login Password' : 'CardWise - Password Reset'}`);
  console.log(`Password: ${password}`);
  console.log('---');
  return true;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: mockUsers,

      checkUserExists: async (email: string) => {
        const users = get().users;
        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        return {
          exists: !!existingUser,
          user: existingUser
        };
      },

      sendPasswordToEmail: async (email: string, isNewUser: boolean) => {
        const password = generatePassword();
        
        if (isNewUser) {
          // Create new user with generated password
          const newUser: User = {
            id: Date.now().toString(),
            name: '',
            email: email.toLowerCase(),
            password: password,
            isAdmin: false,
            createdAt: new Date().toISOString(),
            isActive: true
          };
          
          const users = get().users;
          set({ users: [...users, newUser] });
        } else {
          // Update existing user's password
          const users = get().users;
          const updatedUsers = users.map(user => 
            user.email.toLowerCase() === email.toLowerCase() 
              ? { ...user, password: password, passwordResetToken: password }
              : user
          );
          set({ users: updatedUsers });
        }

        // Simulate sending email
        return simulateEmailSend(email, password, isNewUser);
      },

      login: async (email: string, password: string) => {
        const users = get().users;
        const user = users.find(u => 
          u.email.toLowerCase() === email.toLowerCase() && 
          u.password === password &&
          u.isActive
        );
        
        if (user) {
          // Update last login
          const updatedUsers = users.map(u => 
            u.id === user.id 
              ? { ...u, lastLogin: new Date().toISOString() }
              : u
          );
          set({ users: updatedUsers });

          const { password: _, ...userWithoutPassword } = user;
          set({ user: { ...userWithoutPassword, lastLogin: new Date().toISOString() }, isAuthenticated: true });
          return true;
        }
        return false;
      },

      register: async (userData: Partial<User>, password: string) => {
        const newUser: User = {
          id: Date.now().toString(),
          name: userData.name || '',
          email: userData.email?.toLowerCase() || '',
          phone: userData.phone,
          isAdmin: false,
          profile: userData.profile,
          createdAt: new Date().toISOString(),
          isActive: true,
          password: password
        };
        
        const users = get().users;
        set({ 
          users: [...users, newUser],
          user: { ...newUser, password: undefined },
          isAuthenticated: true 
        });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (profile: UserProfile) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, profile };
          
          // Update in users array
          const users = get().users;
          const updatedUsers = users.map(u => 
            u.id === currentUser.id ? { ...u, profile } : u
          );
          
          set({ 
            user: updatedUser,
            users: updatedUsers
          });
        }
      },

      // Admin functions
      getAllUsers: () => {
        return get().users;
      },

      updateUser: (id: string, updates: Partial<User>) => {
        const users = get().users;
        const updatedUsers = users.map(user => 
          user.id === id ? { ...user, ...updates } : user
        );
        set({ users: updatedUsers });

        // Update current user if it's the same user
        const currentUser = get().user;
        if (currentUser && currentUser.id === id) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      deleteUser: (id: string) => {
        const users = get().users;
        const updatedUsers = users.filter(user => user.id !== id);
        set({ users: updatedUsers });

        // Logout if current user is deleted
        const currentUser = get().user;
        if (currentUser && currentUser.id === id) {
          set({ user: null, isAuthenticated: false });
        }
      },

      toggleUserStatus: (id: string) => {
        const users = get().users;
        const updatedUsers = users.map(user => 
          user.id === id ? { ...user, isActive: !user.isActive } : user
        );
        set({ users: updatedUsers });
      },

      resetUserPassword: async (id: string) => {
        const password = generatePassword();
        const users = get().users;
        const user = users.find(u => u.id === id);
        
        if (user) {
          const updatedUsers = users.map(u => 
            u.id === id ? { ...u, password, passwordResetToken: password } : u
          );
          set({ users: updatedUsers });
          
          // Simulate sending email
          simulateEmailSend(user.email, password, false);
          return password;
        }
        throw new Error('User not found');
      }
    }),
    {
      name: 'cardwise-auth',
    }
  )
);