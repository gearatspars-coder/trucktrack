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
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    
    // Add validation
    if (!formData.driverName || !formData.truckId) {
      alert("Please select both a driver and a truck.");
      setIsSubmitting(false);
      return;
    }

    onAddTrip(formData);
    
    // Show success and reset form after a short delay
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
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-[2rem]">
           <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl font-black text-sm animate-pulse">
             SYNCING TRIP RECORD...
           </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-800">{t.newTrip}</h3>
        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${isSubmitting ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
          {isSubmitting ? 'Processing Entry' : 'Operational Logging Mode'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.date}</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-700"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.driver}</label>
          <select
            required
            value={formData.driverName}
            onChange={e => setFormData({ ...formData, driverName: e.target.value })}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-700"
          >
            <option value="">-- Choose Driver --</option>
            {mergedDrivers.map(d => <option key={d.id} value={d.name}>{d.name} {d.id.startsWith('MAN') ? '(Manual)' : '(GPS)'}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.truck}</label>
          <select
            required
            value={formData.truckId}
            onChange={e => setFormData({ ...formData, truckId: e.target.value })}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-700"
          >
            <option value="">-- Choose Truck --</option>
            {trucks.map(tr => <option key={tr.id} value={tr.plateNumber}>{tr.plateNumber} ({tr.model})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.customer}</label>
          <input
            type="text"
            required
            placeholder="Aramco, SABIC, etc."
            value={formData.customerName}
            onChange={e => setFormData({ ...formData, customerName: e.target.value })}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-700"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.start}</label>
          <select
            value={formData.startPoint}
            onChange={e => setFormData({ ...formData, startPoint: e.target.value })}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-700"
          >
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.end}</label>
          <select
            value={formData.endPoint}
            onChange={e => setFormData({ ...formData, endPoint: e.target.value })}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-700"
          >
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        
        <div className="lg:col-span-3 h-px bg-slate-100 my-2"></div>

        <div>
          <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">{t.revenue}</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-emerald-300">$</span>
            <input
              type="number"
              value={formData.revenue}
              onChange={e => setFormData({ ...formData, revenue: Number(e.target.value) })}
              className="w-full pl-8 pr-5 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all font-black text-emerald-700 text-xl"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.fuel}</label>
            <input
              type="number"
              value={formData.fuelCost}
              onChange={e => setFormData({ ...formData, fuelCost: Number(e.target.value) })}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-700"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.petty}</label>
            <input
              type="number"
              value={formData.pettyCash}
              onChange={e => setFormData({ ...formData, pettyCash: Number(e.target.value) })}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-700"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">{t.deductions}</label>
            <input
              type="number"
              value={formData.deductions}
              onChange={e => setFormData({ ...formData, deductions: Number(e.target.value) })}
              className="w-full px-5 py-3 bg-red-50/30 border border-red-100 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:outline-none transition-all font-bold text-red-700"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">{t.fines}*</label>
            <input
              type="number"
              value={formData.trafficFines}
              onChange={e => setFormData({ ...formData, trafficFines: Number(e.target.value) })}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-700"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100 pt-8">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-xs leading-relaxed">
          *Logging traffic fines tracks performance but doesn't deduct from gross registry totals.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full md:w-auto px-16 py-6 font-black rounded-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-widest text-sm ${isSubmitting ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-600/30'}`}
        >
          {isSubmitting ? 'Processing...' : t.register}
        </button>
      </div>
    </form>
  );
};

export default TripForm;