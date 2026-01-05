
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
      setLoginError(language === 'en' ? 'Unauthorized: Invalid User ID or Access Key' : 'غير مصرح: بيانات الدخول غير صحيحة');
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert("New Key must be at least 6 characters");
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

  const mergedTrucks = [...gpsTrucks, ...manualTrucks];

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
            <div className="relative">
               {isLoadingGPS && (
                 <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center rounded-3xl">
                    <div className="flex items-center gap-4 px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold animate-bounce shadow-2xl">
                      📡 <span className="flex flex-col"><span>Pilot-GPS Sync</span><span className="text-[9px] text-blue-400">Fetching Data...</span></span>
                    </div>
                 </div>
               )}
               <TripForm onAddTrip={addTrip} drivers={gpsDrivers} manualDrivers={manualDrivers} trucks={mergedTrucks} cities={manualCities} language={language} />
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
               <div><h3 className="text-xl font-bold text-slate-800">{t.trips}</h3><p className="text-xs text-slate-400 mt-1">Full operational history log.</p></div>
               <span className="px-5 py-2 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl uppercase tracking-[0.2em]">{trips.length} Total Records</span>
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
                           <input type="date" className="bg-white border rounded-lg px-2 py-1 w-full font-bold" defaultValue={trip.date} onBlur={(e) => handleEditTripInline({...trip, date: e.target.value})} />
                         ) : trip.date}
                       </td>
                       <td className="px-8 py-5 font-bold text-slate-900">
                         {editingTripId === trip.id ? (
                           <input type="text" className="bg-white border rounded-lg px-2 py-1 w-full font-bold" defaultValue={trip.driverName} onBlur={(e) => handleEditTripInline({...trip, driverName: e.target.value})} />
                         ) : trip.driverName}
                       </td>
                       <td className="px-8 py-5 text-sm">
                         {editingTripId === trip.id ? (
                            <div className="flex gap-2">
                               <input type="text" className="bg-white border rounded-lg px-2 py-1 w-24" defaultValue={trip.startPoint} onBlur={(e) => handleEditTripInline({...trip, startPoint: e.target.value})} />
                               <span className="text-slate-300">→</span>
                               <input type="text" className="bg-white border rounded-lg px-2 py-1 w-24" defaultValue={trip.endPoint} onBlur={(e) => handleEditTripInline({...trip, endPoint: e.target.value})} />
                            </div>
                         ) : (
                           <div className="flex items-center gap-3">
                              <span className="text-slate-500 font-medium">{trip.startPoint}</span>
                              <span className="text-blue-400 text-xs">──▶</span>
                              <span className="text-slate-900 font-bold">{trip.endPoint}</span>
                           </div>
                         )}
                       </td>
                       <td className="px-8 py-5 text-sm text-right font-black text-blue-600">
                         {editingTripId === trip.id ? (
                           <input type="number" className="bg-white border rounded-lg px-2 py-1 w-24 text-right font-black" defaultValue={trip.revenue} onBlur={(e) => handleEditTripInline({...trip, revenue: Number(e.target.value)})} />
                         ) : `$${trip.revenue?.toLocaleString() || 0}`}
                       </td>
                       <td className="px-8 py-5 text-center">
                         <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                           {canModify && (
                             <button onClick={() => setEditingTripId(editingTripId === trip.id ? null : trip.id)} className={`p-2 rounded-lg transition-all ${editingTripId === trip.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:text-blue-500'}`}>
                                {editingTripId === trip.id ? '💾' : '✏️'}
                             </button>
                           )}
                           {isAdmin && (
                             <button onClick={() => { if(confirm("Permanently delete this record?")) deleteTrip(trip.id) }} className="text-slate-400 hover:text-red-500 p-2 bg-slate-100 rounded-lg">🗑️</button>
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
          language={language} manualDrivers={manualDrivers} manualCities={manualCities} trips={trips} 
          onAddDriver={addManualDriver} onRemoveDriver={removeManualDriver} onAddCity={addManualCity} onRemoveCity={removeManualCity}
          manualTrucks={manualTrucks} onAddTruck={addManualTruck} onRemoveTruck={removeManualTruck}
          currentUserRole={currentUser?.role} users={users} onAddUser={addUser} onRemoveUser={removeUser}
        />
      )}

      {activeTab === 'gps' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-slate-900 rounded-[3rem] overflow-hidden aspect-video relative shadow-2xl group border-[16px] border-slate-800/50">
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-[6px] z-10 p-12 text-center">
               <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-5xl mb-10 shadow-2xl shadow-blue-500/40 group-hover:scale-110 transition-transform cursor-pointer border-8 border-white/10">📍</div>
               <h3 className="text-4xl font-black text-white mb-6 tracking-tight">Pilot-GPS Monitor</h3>
               <p className="text-slate-300 max-w-xl mx-auto leading-relaxed mb-12 text-lg">Integrated KSA fleet telemetry bridge for real-time positioning.</p>
               <a href="https://ksa.pilot-gps.com/" target="_blank" rel="noopener noreferrer" className="px-16 py-6 bg-white text-blue-900 font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95 text-xl uppercase tracking-widest">Open Live Console</a>
             </div>
             <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-30 scale-105"></div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
