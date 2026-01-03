
import React, { useState } from 'react';
import { Language, Driver, User, UserRole, Truck } from '../types';
import { translations } from '../i18n';
import { syncStateToDrive } from '../services/googleDriveService';

interface SettingsProps {
  language: Language;
  manualDrivers: Driver[];
  manualTrucks: Truck[];
  manualCities: string[];
  trips: any[];
  users: User[];
  onAddDriver: (d: Omit<Driver, 'id'>) => void;
  onRemoveDriver: (id: string) => void;
  onAddTruck: (t: Omit<Truck, 'id'>) => void;
  onRemoveTruck: (id: string) => void;
  onAddCity: (city: string) => void;
  onRemoveCity: (city: string) => void;
  currentUserRole?: UserRole;
  onAddUser: (u: Omit<User, 'id'>) => void;
  onRemoveUser: (id: string) => void;
}

const Settings: React.FC<SettingsProps> = ({
  language, manualDrivers, manualTrucks, manualCities, trips, users,
  onAddDriver, onRemoveDriver, onAddTruck, onRemoveTruck, onAddCity, onRemoveCity,
  currentUserRole, onAddUser, onRemoveUser
}) => {
  const t = translations[language];
  const [newDriver, setNewDriver] = useState({ name: '', licenseNumber: '' });
  const [newTruck, setNewTruck] = useState({ plateNumber: '', model: '' });
  const [newCity, setNewCity] = useState('');
  const [newUser, setNewUser] = useState({ email: '', role: 'viewer' as UserRole, password: '' });
  
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  const isAdmin = currentUserRole === 'admin';
  const isAccountant = currentUserRole === 'accountant';
  const canManageOps = isAdmin || isAccountant;
  const canAddUsers = isAdmin || isAccountant;

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDriver.name.trim()) {
      onAddDriver(newDriver);
      setNewDriver({ name: '', licenseNumber: '' });
      alert("Driver successfully registered.");
    }
  };

  const handleAddTruck = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTruck.plateNumber.trim()) {
      onAddTruck(newTruck);
      setNewTruck({ plateNumber: '', model: '' });
      alert("Truck plate registered to fleet.");
    }
  };

  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCity.trim()) {
      onAddCity(newCity.trim());
      setNewCity('');
      alert("City added to operational scope.");
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.email.trim()) {
      // Logic: Accountant can ONLY add viewers
      const roleToAssign = isAccountant ? 'viewer' : newUser.role;
      onAddUser({ ...newUser, role: roleToAssign as UserRole });
      setNewUser({ email: '', role: 'viewer', password: '' });
      alert(`User added with ${roleToAssign} authorization.`);
    }
  };

  const handleDriveSync = async () => {
    if (!isDriveConnected) {
      setIsSyncing(true);
      setTimeout(() => {
        setIsDriveConnected(true);
        setIsSyncing(false);
      }, 1000);
      return;
    }

    setIsSyncing(true);
    const state = { manualDrivers, manualTrucks, manualCities, trips, users };
    const time = await syncStateToDrive(state);
    setLastBackup(time);
    setIsSyncing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {!canManageOps && (
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl text-amber-700 font-bold text-center shadow-inner">
          <span className="block text-3xl mb-3">🔒</span>
          Access Restricted: Only Administrators and Accountants can modify core configuration.
        </div>
      )}

      {canManageOps && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Driver Management */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <span className="text-blue-600">👤</span> {t.manageDrivers}
            </h3>
            <form onSubmit={handleAddDriver} className="flex gap-2 mb-8">
              <input type="text" required placeholder={t.placeholderDriver} value={newDriver.name} onChange={e => setNewDriver({ ...newDriver, name: e.target.value })} className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-blue-600" />
              <input type="text" placeholder={t.license} value={newDriver.licenseNumber} onChange={e => setNewDriver({ ...newDriver, licenseNumber: e.target.value })} className="w-32 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-blue-600" />
              <button type="submit" className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all">{t.addBtn}</button>
            </form>
            <div className="flex-1 overflow-y-auto max-h-[300px] space-y-4 pr-2 custom-scrollbar">
              {manualDrivers.map(d => (
                <div key={d.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl group border border-transparent hover:border-blue-100 transition-all">
                  <div><p className="font-bold text-slate-800 text-sm">{d.name}</p><p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mt-1">Plate: {d.licenseNumber || 'UNSET'}</p></div>
                  <button onClick={() => { if(confirm("Remove driver?")) onRemoveDriver(d.id) }} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all">🗑️</button>
                </div>
              ))}
              {manualDrivers.length === 0 && <p className="text-center py-10 text-slate-300 font-bold text-xs">Manual Registry is Empty.</p>}
            </div>
          </div>

          {/* Truck Management */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <span className="text-orange-600">🚛</span> {language === 'en' ? 'Manage Truck Fleet' : 'إدارة أسطول الشاحنات'}
            </h3>
            <form onSubmit={handleAddTruck} className="flex gap-2 mb-8">
              <input type="text" required placeholder={language === 'en' ? 'Plate Number' : 'رقم اللوحة'} value={newTruck.plateNumber} onChange={e => setNewTruck({ ...newTruck, plateNumber: e.target.value })} className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-orange-600" />
              <input type="text" placeholder={language === 'en' ? 'Model' : 'الموديل'} value={newTruck.model} onChange={e => setNewTruck({ ...newTruck, model: e.target.value })} className="w-32 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-orange-600" />
              <button type="submit" className="px-8 py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all">{t.addBtn}</button>
            </form>
            <div className="flex-1 overflow-y-auto max-h-[300px] space-y-4 pr-2 custom-scrollbar">
              {manualTrucks.map(truck => (
                <div key={truck.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl group border border-transparent hover:border-orange-100 transition-all">
                  <div><p className="font-bold text-slate-800 text-sm">{truck.plateNumber}</p><p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mt-1">Model: {truck.model || 'UNSET'}</p></div>
                  <button onClick={() => { if(confirm("Remove truck?")) onRemoveTruck(truck.id) }} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all">🗑️</button>
                </div>
              ))}
              {manualTrucks.length === 0 && <p className="text-center py-10 text-slate-300 font-bold text-xs">No manual trucks registered.</p>}
            </div>
          </div>

          {/* City Management */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <span className="text-emerald-600">📍</span> {t.manageCities}
            </h3>
            <form onSubmit={handleAddCity} className="flex gap-2 mb-8">
              <input type="text" required placeholder={t.placeholderCity} value={newCity} onChange={e => setNewCity(e.target.value)} className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-emerald-600" />
              <button type="submit" className="px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all">{t.addBtn}</button>
            </form>
            <div className="flex-1 overflow-y-auto max-h-[300px] flex flex-wrap gap-3 pr-2 custom-scrollbar content-start">
              {manualCities.map(city => (
                <div key={city} className="px-5 py-3 bg-white text-slate-600 rounded-2xl text-xs font-black flex items-center gap-4 group border border-slate-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100 cursor-default transition-all">
                  {city}
                  <button onClick={() => onRemoveCity(city)} className="opacity-0 group-hover:opacity-100 text-[10px]">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Management */}
      {canAddUsers && (
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-10">
             <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-xl">🛡️</span> 
              Access & Authorization
            </h3>
            {isAccountant && <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-amber-50 text-amber-600 px-5 py-2.5 rounded-2xl border border-amber-100">Accountant: Viewer Level Only</span>}
          </div>

          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">User ID (Email)</label>
              <input type="email" required placeholder="name@almanhal.cc" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Initial Key</label>
              <input type="password" required placeholder="Secure key" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Role Assignment</label>
              <select 
                disabled={isAccountant}
                value={isAccountant ? 'viewer' : newUser.role} 
                onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})} 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:outline-none appearance-none"
              >
                <option value="viewer">Viewer (View Only)</option>
                {!isAccountant && (
                  <>
                    <option value="accountant">Accountant</option>
                    <option value="admin">Administrator</option>
                  </>
                )}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-widest text-sm">Create Account</button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-purple-100 transition-all group">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm ${u.role === 'admin' ? 'bg-purple-600 text-white' : u.role === 'accountant' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                    {u.role === 'admin' ? '👑' : u.role === 'accountant' ? '💼' : '👁️'}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-sm truncate max-w-[150px]">{u.email}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${u.role === 'admin' ? 'text-purple-600' : u.role === 'accountant' ? 'text-blue-600' : 'text-slate-400'}`}>
                      {u.role}
                    </p>
                  </div>
                </div>
                {u.email !== 'abdohma@gmail.com' && isAdmin && (
                   <button onClick={() => { if(confirm("Revoke access for " + u.email + "?")) onRemoveUser(u.id) }} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-3">🗑️</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cloud Sync */}
      {isAdmin && (
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between flex-wrap gap-8">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-inner">☁️</div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{t.googleDrive}</h3>
                <p className="text-sm text-slate-400 font-bold mt-2 leading-relaxed">System state backup to Cloud Storage.</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              {isDriveConnected && (
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">{t.driveConnected}</p>
                  {lastBackup && <p className="text-[10px] text-slate-400 font-bold mt-1">{t.lastBackup}: {lastBackup}</p>}
                </div>
              )}
              <button onClick={handleDriveSync} disabled={isSyncing} className={`flex items-center gap-5 px-12 py-6 rounded-[2rem] font-black transition-all shadow-2xl active:scale-95 text-sm uppercase tracking-widest ${isDriveConnected ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-white border-2 border-slate-100 text-slate-700'}`}>
                {isSyncing ? <span className="flex items-center gap-2"><span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>{t.syncing}</span> : (isDriveConnected ? '📤 Cloud Sync' : '🔗 Connect Drive')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
