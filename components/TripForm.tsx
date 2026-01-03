import React, { useState } from 'react';
import { Driver, Truck, Language } from '../types';
import { translations } from '../i18n';

interface TripFormProps {
  onAddTrip: (trip: any) => void;
  drivers: Driver[];
  manualDrivers: Driver[];
  trucks: Truck[];
  cities: string[];
  language: Language;
}

const TripForm: React.FC<TripFormProps> = ({ onAddTrip, drivers, manualDrivers, trucks, cities, language }) => {
  const t = translations[language];
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    driverName: '',
    truckId: '',
    startPoint: cities[0] || '',
    endPoint: cities[1] || '',
    customerName: '',
    revenue: 0,
    fuelCost: 0,
    pettyCash: 0,
    deductions: 0,
    trafficFines: 0,
  });

  const mergedDrivers = [...drivers, ...manualDrivers];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double registration
    
    setIsSubmitting(true);
    
    if (!formData.driverName || !formData.truckId) {
      alert("Selection missing: Driver and Truck are required.");
      setIsSubmitting(false);
      return;
    }

    onAddTrip(formData);
    
    // Lock for 2 seconds to prevent rapid duplication
    setTimeout(() => {
      setFormData({
        ...formData,
        customerName: '',
        revenue: 0,
        fuelCost: 0,
        pettyCash: 0,
        deductions: 0,
        trafficFines: 0,
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-[2rem]">
           <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl font-black text-sm animate-pulse tracking-widest">
             SYNCING TRIP LOG...
           </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-800">{t.newTrip}</h3>
        <div className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
          Security Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.date}</label>
          <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.driver}</label>
          <select required value={formData.driverName} onChange={e => setFormData({ ...formData, driverName: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700">
            <option value="">-- Choose Driver --</option>
            {mergedDrivers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.truck}</label>
          <select required value={formData.truckId} onChange={e => setFormData({ ...formData, truckId: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700">
            <option value="">-- Choose Truck --</option>
            {trucks.map(tr => <option key={tr.id} value={tr.plateNumber}>{tr.plateNumber}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.customer}</label>
          <input type="text" required placeholder="Aramco" value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.start}</label>
          <select value={formData.startPoint} onChange={e => setFormData({ ...formData, startPoint: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold">
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.end}</label>
          <select value={formData.endPoint} onChange={e => setFormData({ ...formData, endPoint: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold">
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        
        <div className="lg:col-span-3 h-px bg-slate-100 my-2"></div>

        <div>
          <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">{t.revenue}</label>
          <input type="number" value={formData.revenue} onChange={e => setFormData({ ...formData, revenue: Number(e.target.value) })} className="w-full px-6 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl font-black text-emerald-700 text-xl" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.fuel}</label>
          <input type="number" value={formData.fuelCost} onChange={e => setFormData({ ...formData, fuelCost: Number(e.target.value) })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">{t.deductions}</label>
          <input type="number" value={formData.deductions} onChange={e => setFormData({ ...formData, deductions: Number(e.target.value) })} className="w-full px-5 py-3 bg-red-50 border border-red-100 rounded-2xl font-bold" />
        </div>
      </div>
      
      <div className="mt-10 flex items-center justify-end">
        <button type="submit" disabled={isSubmitting} className={`px-16 py-6 font-black rounded-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-widest text-sm ${isSubmitting ? 'bg-slate-200 text-slate-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-600/30'}`}>
          {isSubmitting ? 'Processing...' : t.register}
        </button>
      </div>
    </form>
  );
};

export default TripForm;