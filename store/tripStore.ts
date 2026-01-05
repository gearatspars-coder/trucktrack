
import { useState, useEffect, useCallback } from 'react';
import { Trip, Driver, User, Truck } from '../types';
import { translations } from '../i18n';

const STORAGE_KEY_TRIPS = 'truck_track_trips';
const STORAGE_KEY_DRIVERS = 'truck_track_manual_drivers';
const STORAGE_KEY_TRUCKS = 'truck_track_manual_trucks';
const STORAGE_KEY_CITIES = 'truck_track_manual_cities';
const STORAGE_KEY_USERS = 'truck_track_users';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const INITIAL_TRIPS: Trip[] = [
  {
    id: 'live-1',
    date: new Date().toISOString().split('T')[0],
    driverName: 'Ahmad Al-Mansour',
    truckId: 'LKH 4421',
    startPoint: 'Riyadh',
    endPoint: 'Jeddah',
    customerName: 'Aramco',
    revenue: 4800,
    fuelCost: 1100,
    pettyCash: 200,
    deductions: 0,
    trafficFines: 0,
    status: 'in-progress',
    createdAt: new Date().toISOString()
  }
];

const INITIAL_USERS: User[] = [
  { 
    id: 'admin-main', 
    email: 'abdohma@gmail.com', 
    role: 'admin', 
    password: 'Admin007',
    passwordChanged: false 
  }
];

export const useTripStore = () => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TRIPS);
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  const [manualDrivers, setManualDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DRIVERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [manualTrucks, setManualTrucks] = useState<Truck[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TRUCKS);
    return saved ? JSON.parse(saved) : [];
  });

  const [manualCities, setManualCities] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CITIES);
    return saved ? JSON.parse(saved) : translations.en.saudiCities;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DRIVERS, JSON.stringify(manualDrivers));
  }, [manualDrivers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRUCKS, JSON.stringify(manualTrucks));
  }, [manualTrucks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CITIES, JSON.stringify(manualCities));
  }, [manualCities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }, [users]);

  const addTrip = useCallback((trip: Omit<Trip, 'id' | 'createdAt' | 'status'>) => {
    const newTrip: Trip = {
      ...trip,
      id: generateId(),
      status: 'in-progress',
      createdAt: new Date().toISOString(),
    };
    setTrips(prev => [newTrip, ...prev]);
    return newTrip;
  }, []);

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  const updateTrip = (updatedTrip: Trip) => {
    setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
  };

  const addManualDriver = (driver: Omit<Driver, 'id'>) => {
    const newDriver: Driver = { ...driver, id: `MAN-D-${generateId()}` };
    setManualDrivers(prev => [...prev, newDriver]);
    return newDriver;
  };

  const removeManualDriver = (id: string) => {
    setManualDrivers(prev => prev.filter(d => d.id !== id));
  };

  const addManualTruck = (truck: Omit<Truck, 'id'>) => {
    const newTruck: Truck = { ...truck, id: `MAN-T-${generateId()}` };
    setManualTrucks(prev => [...prev, newTruck]);
    return newTruck;
  };

  const removeManualTruck = (id: string) => {
    setManualTrucks(prev => prev.filter(t => t.id !== id));
  };

  const addManualCity = (city: string) => {
    if (!manualCities.includes(city)) {
      setManualCities(prev => [...prev, city]);
    }
  };

  const removeManualCity = (city: string) => {
    setManualCities(prev => prev.filter(c => c !== city));
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: generateId(), passwordChanged: true };
    setUsers(prev => [...prev, newUser]);
  };

  const removeUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const updateUserPassword = (userId: string, newPass: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, password: newPass, passwordChanged: true } : u
    ));
  };

  return { 
    trips, addTrip, deleteTrip, updateTrip,
    manualDrivers, addManualDriver, removeManualDriver,
    manualTrucks, addManualTruck, removeManualTruck,
    manualCities, addManualCity, removeManualCity,
    users, addUser, removeUser, updateUserPassword
  };
};
