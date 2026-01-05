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
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    if (!formData.driverName || !formData.truckId) {
      alert("Validation Error: Please select both a valid driver and operational vehicle.");
      setIsSubmitting(false);
      return;
    }

    onAddTrip(formData);
    
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
    }, 1500);
  };

  const inputClass = "w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300";
  const labelClass = "block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.03)] border border-slate-100/80 relative overflow-hidden">
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[3rem] animate-in fade-in duration-300">
           <div className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4">
             <div className="w-5 h-5 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             <span className="font-black text-xs uppercase tracking-widest">Synchronizing Record...</span>
           </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-12">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t.newTrip}</h3>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Trip Operational Registry</p>
        </div>
        <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-blue-100">
          📝
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div>
          <label className={labelClass}>{t.date}</label>
          <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t.driver}</label>
          <select required value={formData.driverName} onChange={e => setFormData({ ...formData, driverName: e.target.value })} className={`${inputClass} appearance-none`}>
            <option value="">-- Assign Driver --</option>
            {mergedDrivers.map(d => <option key={d.id} value={d.name}>{d.name} {d.id.startsWith('MAN') ? '(Manual)' : '(GPS)'}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>{t.truck}</label>
          <select required value={formData.truckId} onChange={e => setFormData({ ...formData, truckId: e.target.value })} className={`${inputClass} appearance-none`}>
            <option value="">-- Assign Truck --</option>
            {trucks.map(tr => <option key={tr.id} value={tr.plateNumber}>{tr.plateNumber} ({tr.model})</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>{t.customer}</label>
          <input type="text" required placeholder="Organization Name" value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t.start}</label>
          <select value={formData.startPoint} onChange={e => setFormData({ ...formData, startPoint: e.target.value })} className={`${inputClass} appearance-none`}>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>{t.end}</label>
          <select value={formData.endPoint} onChange={e => setFormData({ ...formData, endPoint: e.target.value })} className={`${inputClass} appearance-none`}>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        
        <div className="lg:col-span-3 h-px bg-slate-50 my-4"></div>

        <div>
          <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3 ml-2">{t.revenue}</label>
          <div className="relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-emerald-300 text-2xl group-focus-within:text-emerald-500 transition-colors">$</span>
            <input
              type="number"
              value={formData.revenue}
              onChange={e => setFormData({ ...formData, revenue: Number(e.target.value) })}
              className="w-full pl-12 pr-6 py-6 bg-emerald-50/20 border-2 border-emerald-100/50 rounded-[1.5rem] focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-black text-emerald-700 text-3xl"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
           <div>
            <label className={labelClass}>{t.fuel}</label>
            <input type="number" value={formData.fuelCost} onChange={e => setFormData({ ...formData, fuelCost: Number(e.target.value) })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t.petty}</label>
            <input type="number" value={formData.pettyCash} onChange={e => setFormData({ ...formData, pettyCash: Number(e.target.value) })} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
           <div>
            <label className="block text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] mb-3 ml-2">{t.deductions}</label>
            <input type="number" value={formData.deductions} onChange={e => setFormData({ ...formData, deductions: Number(e.target.value) })} className="w-full px-6 py-5 bg-rose-50/20 border-2 border-rose-100/50 rounded-[1.5rem] focus:ring-8 focus:ring-rose-500/5 focus:border-rose-500 focus:bg-white focus:outline-none transition-all font-bold text-rose-700" />
          </div>
          <div>
            <label className={labelClass}>{t.fines}*</label>
            <input type="number" value={formData.trafficFines} onChange={e => setFormData({ ...formData, trafficFines: Number(e.target.value) })} className={inputClass} />
          </div>
        </div>
      </div>
      
      <div className="mt-14 flex flex-col md:flex-row items-center justify-between gap-10 border-t border-slate-50 pt-12">
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] max-w-sm leading-relaxed">
          Operational Note: All financial logs are audit-ready and archived in the Registry module upon submission.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full md:w-auto px-20 py-7 font-black rounded-[2rem] shadow-[0_25px_50px_rgba(37,99,235,0.25)] transition-all active:scale-95 uppercase tracking-[0.3em] text-sm ${isSubmitting ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'}`}
        >
          {isSubmitting ? 'Syncing...' : t.register}
        </button>
      </div>
    </form>
  );
};

export default TripForm;