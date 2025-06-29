
export interface Category {
  id: string;
  name: string;
  description: string;
  actualFee: number;
  offerFee: number;
  image?: string;
  isActive: boolean;
}

export interface Panchayath {
  id: string;
  name: string;
  district: string;
  isActive: boolean;
}

export interface Registration {
  id: string;
  customerId: string;
  categoryId: string;
  categoryName: string;
  name: string;
  address: string;
  mobileNumber: string;
  panchayathId: string;
  panchayathName: string;
  ward: string;
  agentPro: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  username: string;
  password: string;
  role: 'super' | 'local' | 'user';
  isActive: boolean;
}

export interface AppState {
  categories: Category[];
  panchayaths: Panchayath[];
  registrations: Registration[];
  admins: Admin[];
}
