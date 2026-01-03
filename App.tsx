
import React, { useState, useEffect } from 'react';
import { useTripStore } from './store/tripStore';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TripForm from './components/TripForm';
import DriverReports from './components/DriverReports';
import Settings from './components/Settings';
import { Driver, Truck, Language, User, Trip } from './types';
import { translations } from './i18n';
import { fetchGPSData } from './services/gpsService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  const [gpsDrivers, setGpsDrivers] = useState<Driver[]>([]);
  const [gpsTrucks, setGpsTrucks] = useState<Truck[]>([]);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);

  const { 
    trips, addTrip, deleteTrip, updateTrip,
    manualDrivers, addManualDriver, removeManualDriver,
    manualTrucks, addManualTruck, removeManualTruck,
    manualCities, addManualCity, removeManualCity,
    users, addUser, removeUser, updateUserPassword
  } = useTripStore();
  
  const t = translations[language];

  useEffect(() => {
    if (currentUser && currentUser.passwordChanged !== false) {
      const loadData = async () => {
        setIsLoadingGPS(true);
        try {
          const data = await fetchGPSData();
          setGpsDrivers(data.drivers);
          setGpsTrucks(data.trucks);
        } catch (err) {
          console.error("Failed to fetch GPS data", err);
        } finally {
          setIsLoadingGPS(false);
        }
      };
      loadData();
    }
  }, [currentUser]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (user) {
      if (user.passwordChanged === false) {
        setCurrentUser(user);
        setShowPasswordReset(true);
      } else {
        setCurrentUser(user);
        setLoginError('');
      }
    } else {
      setLoginError(language === 'en' ? 'Unauthorized: Access Key is incorrect.' : 'غير مصرح: مفتاح الدخول غير صحيح.');
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 5) {
      alert("Key must be at least 5 characters");
      return;
    }
    if (currentUser) {
      updateUserPassword(currentUser.id, newPassword);
      setCurrentUser({ ...currentUser, passwordChanged: true, password: newPassword });
      setShowPasswordReset(false);
    }
  };

  const isViewer = currentUser?.role === 'viewer';
  const isAccountant = currentUser?.role === 'accountant';
  const isAdmin = currentUser?.role === 'admin';
  const canModify = isAdmin || isAccountant;

  // Merge GPS data with manual data for forms
  const allTrucks = [...gpsTrucks, ...manualTrucks];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>
        <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-12 border border-white/20">
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white text-4xl font-black mb-6 shadow-2xl shadow-blue-500/40">
              TT
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">TruckTrack</h1>
            <p className="text-slate-500 font-medium mt-2">Elite Fleet Monitoring Console</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex justify-center gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl">
               <button type="button" onClick={() => setLanguage('en')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${language === 'en' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>English</button>
               <button type="button" onClick={() => setLanguage('ar')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${language === 'ar' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>العربية</button>
            </div>

            {loginError && <p className="text-center text-red-500 text-xs font-bold bg-red-50 py-3 rounded-xl border border-red-100">{loginError}</p>}

            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">User ID (Email)</label>
              <input type="email" required className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-600" placeholder="abdohma@gmail.com" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Access Key</label>
              <input type="password" required className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-600" placeholder="••••••••" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
            </div>
            <button type="submit" className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/30 active:scale-[0.98] uppercase tracking-[0.15em] text-sm mt-4">
              Initialize Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (showPasswordReset) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
         <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-12 border border-slate-100 text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-4">Security Update Required</h2>
            <p className="text-slate-500 text-sm mb-8">This is your initial login. For security, you must update your Access Key before proceeding.</p>
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <input type="password" required className="w-full px-6 py-5 bg-slate-50 border rounded-2xl focus:outline-none focus:border-blue-600 font-bold" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Access Key (min 5 chars)" />
              <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest active:scale-95 transition-all">Update & Continue</button>
            </form>
         </div>
      </div>
    );
  }

  const handleEditTripInline = (trip: Trip) => {
    updateTrip(trip);
    setEditingTripId(null);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setCurrentUser(null)} language={language} setLanguage={setLanguage}>
      {activeTab === 'dashboard' && <Dashboard trips={trips} />}
      
      {activeTab === 'trips' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {!isViewer && (
            <TripForm onAddTrip={addTrip} drivers={gpsDrivers} manualDrivers={manualDrivers} trucks={allTrucks} cities={manualCities} language={language} />
          )}

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
               <div><h3 className="text-xl font-bold text-slate-800">{t.trips}</h3><p className="text-xs text-slate-400 mt-1">Operational registry log.</p></div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                 <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.date}</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.driver}</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.route}</th>
                      <th className="px-8 py-5 text-[10px] font-black text-blue-600 uppercase tracking-widest text-right">{t.revenue}</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t.actions}</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {trips.map((trip) => (
                     <tr key={trip.id} className="hover:bg-blue-50/30 transition-all group">
                       <td className="px-8 py-5 text-sm font-medium text-slate-500">
                         {editingTripId === trip.id ? (
                           <input type="date" className="bg-white border rounded px-2 py-1 w-full" defaultValue={trip.date} onBlur={(e) => handleEditTripInline({...trip, date: e.target.value})} />
                         ) : trip.date}
                       </td>
                       <td className="px-8 py-5 font-bold text-slate-900">
                         {editingTripId === trip.id ? (
                           <input type="text" className="bg-white border rounded px-2 py-1 w-full" defaultValue={trip.driverName} onBlur={(e) => handleEditTripInline({...trip, driverName: e.target.value})} />
                         ) : trip.driverName}
                       </td>
                       <td className="px-8 py-5 text-sm">
                         {editingTripId === trip.id ? (
                            <div className="flex gap-1">
                               <input type="text" className="text-xs bg-white border rounded w-20 px-1" defaultValue={trip.startPoint} onBlur={(e) => handleEditTripInline({...trip, startPoint: e.target.value})} />
                               <input type="text" className="text-xs bg-white border rounded w-20 px-1" defaultValue={trip.endPoint} onBlur={(e) => handleEditTripInline({...trip, endPoint: e.target.value})} />
                            </div>
                         ) : (
                           <div className="flex items-center gap-3">
                              <span className="text-slate-500 font-medium">{trip.startPoint}</span>
                              <span className="text-blue-400 text-xs">→</span>
                              <span className="text-slate-900 font-bold">{trip.endPoint}</span>
                           </div>
                         )}
                       </td>
                       <td className="px-8 py-5 text-sm text-right font-black text-blue-600">
                         {editingTripId === trip.id ? (
                           <input type="number" className="bg-white border rounded px-2 py-1 w-24 text-right" defaultValue={trip.revenue} onBlur={(e) => handleEditTripInline({...trip, revenue: Number(e.target.value)})} />
                         ) : `$${trip.revenue?.toLocaleString()}`}
                       </td>
                       <td className="px-8 py-5 text-center">
                         <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                           {canModify && (
                             <button onClick={() => setEditingTripId(editingTripId === trip.id ? null : trip.id)} className={`p-2 rounded-lg transition-all ${editingTripId === trip.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 hover:text-blue-500'}`}>
                                {editingTripId === trip.id ? '💾' : '✏️'}
                             </button>
                           )}
                           {isAdmin && (
                             <button onClick={() => { if(confirm("Confirm Delete?")) deleteTrip(trip.id) }} className="text-slate-400 hover:text-red-500 p-2 bg-slate-100 rounded-lg">🗑️</button>
                           )}
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && <DriverReports trips={trips} language={language} />}
      {activeTab === 'settings' && (
        <Settings 
          language={language} manualDrivers={manualDrivers} manualCities={manualCities} manualTrucks={manualTrucks} trips={trips} 
          onAddDriver={addManualDriver} onRemoveDriver={removeManualDriver} 
          onAddCity={addManualCity} onRemoveCity={removeManualCity}
          onAddTruck={addManualTruck} onRemoveTruck={removeManualTruck}
          currentUserRole={currentUser?.role} users={users} onAddUser={addUser} onRemoveUser={removeUser}
        />
      )}
    </Layout>
  );
};

export default App;
