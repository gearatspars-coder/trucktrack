export type TripStatus = 'completed' | 'in-progress' | 'delayed' | 'loading';

export interface Trip {
  id: string;
  date: string;
  driverName: string;
  truckId: string;
  startPoint: string;
  endPoint: string;
  customerName: string;
  revenue: number;
  fuelCost: number;
  pettyCash: number;
  deductions: number;
  trafficFines: number;
  status: TripStatus;
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  currentStatus?: 'moving' | 'idle' | 'offline';
  lastLocation?: string;
}

export interface Truck {
  id: string;
  plateNumber: string;
  model: string;
}

export type Language = 'en' | 'ar';

export type UserRole = 'admin' | 'accountant' | 'viewer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  password?: string;
  passwordChanged?: boolean;
}