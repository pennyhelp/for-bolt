
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Registration, Category, Panchayath, Admin } from '../types';

// Initial data
const initialCategories: Category[] = [
  {
    id: '1',
    name: 'Pennyekart Free Registration',
    description: 'Totally free registration with free delivery between 2pm to 6pm. Basic level access to hybrid ecommerce platform.',
    actualFee: 0,
    offerFee: 0,
    isActive: true
  },
  {
    id: '2',
    name: 'Pennyekart Paid Registration',
    description: 'Premium registration with any time delivery between 8am to 7pm. Full access to all platform features.',
    actualFee: 500,
    offerFee: 299,
    isActive: true
  },
  {
    id: '3',
    name: 'Farmelife',
    description: 'Connected with dairy farm, poultry farm and agricultural businesses.',
    actualFee: 750,
    offerFee: 499,
    isActive: true
  },
  {
    id: '4',
    name: 'Organelife',
    description: 'Connected with vegetable and house gardening, especially terrace vegetable farming.',
    actualFee: 600,
    offerFee: 399,
    isActive: true
  },
  {
    id: '5',
    name: 'Foodlife',
    description: 'Connected with food processing business and culinary services.',
    actualFee: 800,
    offerFee: 599,
    isActive: true
  },
  {
    id: '6',
    name: 'Entrelife',
    description: 'Connected with skilled projects like stitching, art works, various home services.',
    actualFee: 700,
    offerFee: 499,
    isActive: true
  },
  {
    id: '7',
    name: 'Job Card',
    description: 'Special offer card with access to all categories, special discounts, and investment benefits. Best choice for comprehensive registration.',
    actualFee: 2000,
    offerFee: 999,
    isActive: true
  }
];

const initialPanchayaths: Panchayath[] = [
  { id: '1', name: 'Amarambalam', district: 'Malappuram', isActive: true }
];

const initialAdmins: Admin[] = [
  { id: '1', username: 'evaadmin', password: 'eva919123', role: 'super', isActive: true },
  { id: '2', username: 'admin1', password: 'elife9094', role: 'local', isActive: true },
  { id: '3', username: 'admin2', password: 'penny9094', role: 'user', isActive: true }
];

interface AppStore extends AppState {
  currentAdmin: Admin | null;
  setCurrentAdmin: (admin: Admin | null) => void;
  addRegistration: (registration: Omit<Registration, 'id' | 'customerId'>) => string;
  updateRegistration: (id: string, updates: Partial<Registration>) => void;
  getRegistrationByMobile: (mobile: string) => Registration | undefined;
  addPanchayath: (panchayath: Omit<Panchayath, 'id'>) => void;
  updatePanchayath: (id: string, updates: Partial<Panchayath>) => void;
  deletePanchayath: (id: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  updateAdmin: (id: string, updates: Partial<Admin>) => void;
  generateCustomerId: (mobile: string, name: string) => string;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      categories: initialCategories,
      panchayaths: initialPanchayaths,
      registrations: [],
      admins: initialAdmins,
      currentAdmin: null,
      
      setCurrentAdmin: (admin) => set({ currentAdmin: admin }),
      
      generateCustomerId: (mobile: string, name: string) => {
        const firstLetter = name.charAt(0).toUpperCase();
        return `ESEP${mobile}${firstLetter}`;
      },
      
      addRegistration: (registration) => {
        const id = Date.now().toString();
        const customerId = get().generateCustomerId(registration.mobileNumber, registration.name);
        const newRegistration: Registration = {
          ...registration,
          id,
          customerId,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set(state => ({
          registrations: [...state.registrations, newRegistration]
        }));
        
        return customerId;
      },
      
      updateRegistration: (id, updates) => {
        set(state => ({
          registrations: state.registrations.map(reg =>
            reg.id === id ? { ...reg, ...updates, updatedAt: new Date().toISOString() } : reg
          )
        }));
      },
      
      getRegistrationByMobile: (mobile) => {
        return get().registrations.find(reg => reg.mobileNumber === mobile);
      },
      
      addPanchayath: (panchayath) => {
        const id = Date.now().toString();
        set(state => ({
          panchayaths: [...state.panchayaths, { ...panchayath, id }]
        }));
      },
      
      updatePanchayath: (id, updates) => {
        set(state => ({
          panchayaths: state.panchayaths.map(p =>
            p.id === id ? { ...p, ...updates } : p
          )
        }));
      },
      
      deletePanchayath: (id) => {
        set(state => ({
          panchayaths: state.panchayaths.filter(p => p.id !== id)
        }));
      },
      
      updateCategory: (id, updates) => {
        set(state => ({
          categories: state.categories.map(c =>
            c.id === id ? { ...c, ...updates } : c
          )
        }));
      },
      
      updateAdmin: (id, updates) => {
        set(state => ({
          admins: state.admins.map(a =>
            a.id === id ? { ...a, ...updates } : a
          )
        }));
      }
    }),
    {
      name: 'e-life-registration-store'
    }
  )
);
