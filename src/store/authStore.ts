import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supabaseClient';
const REDIRECT_URL = `${window.location.origin}/reset-password`;

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
  logout: () => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
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
    name: 'Admin User',
    isAdmin: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T10:30:00Z',
    isActive: true
  },
  {
    id: '2',
    email: 'user@example.com',
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
  },
  {
    id: '4',
    email: 'antriksh.tewari89@gmail.com',
    name: 'Antriksh Tewari',
    isAdmin: false,
    createdAt: '2024-01-20T00:00:00Z',
    isActive: true
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


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: mockUsers,

      checkUserExists: async (email: string) => {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('email', email.toLowerCase())
          .single();

        if (data) {
          return {
            exists: true,
            user: {
              id: data.id,
              email: data.email,
              name: '',
              isAdmin: false,
              createdAt: data.created_at,
              isActive: true
            }
          };
        }

        return { exists: false };
      },

      sendPasswordToEmail: async (email: string, isNewUser: boolean) => {
        if (isNewUser) {
          const password = generatePassword();
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: REDIRECT_URL }
          });
          if (error || !data.user) return false;
          await supabase.from('users').insert({ id: data.user.id, email: data.user.email });
          const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: REDIRECT_URL });
          return !resetErr;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: REDIRECT_URL });
        return !error;
      },

      login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.session) return false;

        const u = data.session.user;
        set({
          user: {
            id: u.id,
            email: u.email || '',
            name: u.user_metadata?.name,
            phone: u.user_metadata?.phone,
            isAdmin: false,
            createdAt: u.created_at,
            isActive: true,
            lastLogin: new Date().toISOString()
          },
          isAuthenticated: true
        });

        await supabase.from('users').upsert({ id: u.id, email: u.email });
        return true;
      },

      register: async (userData: Partial<User>, password: string) => {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email?.toLowerCase() || '',
          password,
          options: {
            emailRedirectTo: REDIRECT_URL,
            data: { name: userData.name, phone: userData.phone }
          }
        });

        if (error || !data.user) return false;

        const newUser: User = {
          id: data.user.id,
          name: userData.name || '',
          email: data.user.email || '',
          phone: userData.phone,
          profile: userData.profile,
          isAdmin: false,
          createdAt: data.user.created_at,
          isActive: true
        };

        set({ user: newUser, isAuthenticated: true });
        await supabase.from('users').insert({ id: data.user.id, email: data.user.email });
        return true;
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: async (profile: UserProfile) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, profile };
          set({ user: updatedUser });
          await supabase.auth.updateUser({ data: { profile } });
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
        const { data } = await supabase
          .from('users')
          .select('email')
          .eq('id', id)
          .single();

        if (!data) {
          throw new Error('User not found');
        }

        const { error } = await supabase.auth.resetPasswordForEmail(data.email, { redirectTo: REDIRECT_URL });
        if (error) throw error;
        return 'reset-link-sent';
      }
    }),
    {
      name: 'cardwise-auth',
    }
  )
);

supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.user) {
    useAuthStore.setState({
      user: {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name,
        phone: session.user.user_metadata?.phone,
        isAdmin: false,
        createdAt: session.user.created_at,
        isActive: true
      },
      isAuthenticated: true
    });
  }
});

supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    useAuthStore.setState({
      user: {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name,
        phone: session.user.user_metadata?.phone,
        isAdmin: false,
        createdAt: session.user.created_at,
        isActive: true
      },
      isAuthenticated: true
    });
  } else {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  }
});
