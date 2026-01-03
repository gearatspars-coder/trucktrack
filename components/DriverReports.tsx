
import React, { useMemo, useState } from 'react';
import { Trip, Language } from '../types';
import { translations } from '../i18n';
import { saveFileToDrive } from '../services/googleDriveService';

interface DriverReportsProps {
  trips: Trip[];
  language: Language;
}

const DriverReports: React.FC<DriverReportsProps> = ({ trips, language }) => {
  const t = translations[language];
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [showBestPerformer, setShowBestPerformer] = useState(false);

  const groupedData = useMemo(() => {
    const grouped: Record<string, { trips: Trip[], summary: any }> = {};
    
    trips.forEach(trip => {
      // Create a unique key for grouping by Driver + Month/Year
      const dateObj = new Date(trip.date);
      const monthYear = dateObj.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' });
      const key = `${trip.driverName}_${monthYear}`;
      
      if (!grouped[key]) {
        grouped[key] = {
          trips: [],
          summary: {
            id: key,
            name: trip.driverName,
            period: monthYear,
            totalRevenue: 0,
            totalFuel: 0,
            totalPetty: 0,
            totalDeductions: 0,
            totalFines: 0,
            tripsCount: 0
          }
        };
      }
      
      grouped[key].trips.push(trip);
      grouped[key].summary.tripsCount += 1;
      grouped[key].summary.totalRevenue += trip.revenue || 0;
      grouped[key].summary.totalFuel += trip.fuelCost || 0;
      grouped[key].summary.totalPetty += trip.pettyCash || 0;
      grouped[key].summary.totalDeductions += trip.deductions || 0;
      grouped[key].summary.totalFines += trip.trafficFines || 0;
    });
    
    // Convert grouping to list and calculate Net Profit
    return Object.values(grouped).map(group => {
      // FORMULA: Revenue - (Fuel + Petty + Deductions)
      const profit = group.summary.totalRevenue - (group.summary.totalFuel + group.summary.totalPetty + group.summary.totalDeductions);
      return { ...group, netProfit: profit };
    }).sort((a, b) => {
        // Sort by period descending then by profit descending
        return new Date(b.trips[0].date).getTime() - new Date(a.trips[0].date).getTime();
    });
  }, [trips, language]);

  const bestPerformer = useMemo(() => {
    if (groupedData.length === 0) return null;
    return groupedData.reduce((prev, current) => (prev.netProfit > current.netProfit ? prev : current));
  }, [groupedData]);

  const generateCSV = () => {
    const headers = [t.date, t.driver, t.customer, t.truck, t.route, t.revenue, t.fuel, t.petty, t.fines, t.deductions];
    const rows = trips.map(tr => [
      tr.date, tr.driverName, tr.customerName, tr.truckId, `${tr.startPoint} to ${tr.endPoint}`,
      tr.revenue, tr.fuelCost, tr.pettyCash, tr.trafficFines, tr.deductions
    ]);
    return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  };

  const exportToCSV = () => {
    if (trips.length === 0) return;
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `detailed_driver_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleSaveToDrive = async () => {
    if (trips.length === 0) return;
    setIsSavingToDrive(true);
    const csvContent = generateCSV();
    const filename = `TruckTrack_Report_${new Date().toISOString().split('T')[0]}.csv`;
    await saveFileToDrive(filename, csvContent);
    setIsSavingToDrive(false);
    alert('Report saved to Google Drive (Simulated)');
  };

  return (
    <div className="space-y-8">
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-0 z-30">
        <div>
          <h3 className="text-xl font-bold text-slate-800">{t.summary}</h3>
          <p className="text-xs text-slate-400 mt-1">{t.clickToExpand}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {bestPerformer && (
            <button 
              onClick={() => setShowBestPerformer(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-600 text-white rounded-xl hover:shadow-xl transition-all shadow-orange-500/20 active:scale-95 group"
            >
              <span className="text-lg group-hover:scale-125 transition-transform duration-300">👑</span>
              <span className="font-bold text-xs uppercase tracking-widest">{t.bestPerformer}</span>
            </button>
          )}
          <button 
            onClick={handleSaveToDrive}
            disabled={isSavingToDrive}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-blue-600 rounded-xl hover:bg-blue-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            {isSavingToDrive ? (
              <span className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></span>
            ) : (
              <span>☁️</span>
            )}
            <span className="font-bold text-xs uppercase tracking-widest">{t.saveToDrive}</span>
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <span>📥</span>
            <span className="font-bold text-xs uppercase tracking-widest">{t.export}</span>
          </button>
        </div>
      </div>

      {/* Best Performer Spotlight Modal */}
      {showBestPerformer && bestPerformer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowBestPerformer(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 p-10 text-center animate-in zoom-in-95 duration-300">
             <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-xl shadow-orange-500/10">
                🏆
             </div>
             <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-2">{t.performanceWinner}</h4>
             <h2 className="text-3xl font-black text-slate-900 mb-2">{bestPerformer.summary.name}</h2>
             <p className="text-slate-500 font-medium mb-8">Period: {bestPerformer.summary.period}</p>
             
             <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                   <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Max Net Profit</p>
                   <p className="text-3xl font-black text-emerald-700">${bestPerformer.netProfit.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                   <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Operational Trips</p>
                   <p className="text-3xl font-black text-blue-700">{bestPerformer.summary.tripsCount}</p>
                </div>
             </div>
             
             <button 
               onClick={() => {
                 setShowBestPerformer(false);
                 setExpandedKey(bestPerformer.summary.id);
                 // Scroll to the highlighted item
                 document.getElementById(bestPerformer.summary.id)?.scrollIntoView({ behavior: 'smooth' });
               }}
               className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-xl"
             >
               View Detailed Performance Log
             </button>
          </div>
        </div>
      )}

      {/* Driver Summary Groups */}
      <div className="space-y-6">
        {groupedData.length > 0 ? groupedData.map((group, idx) => {
          const { summary, trips: detailTrips, netProfit } = group;
          const isExpanded = expandedKey === summary.id;
          
          return (
            <div 
              key={idx} 
              id={summary.id}
              className={`bg-white rounded-[2.5rem] shadow-sm border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-blue-200 ring-4 ring-blue-500/5 shadow-xl' : 'border-slate-100 hover:shadow-md'}`}
            >
              {/* Summary Row */}
              <div 
                className={`p-8 flex flex-wrap items-center justify-between gap-6 transition-colors ${isExpanded ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}
              >
                 <div 
                   onClick={() => setExpandedKey(isExpanded ? null : summary.id)}
                   className="flex items-center gap-6 cursor-pointer group flex-1"
                 >
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl font-black shadow-lg transition-all duration-300 ${isExpanded ? 'bg-blue-600 text-white scale-110 rotate-3' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'}`}>
                      {summary.tripsCount}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {summary.name}
                        <span className="ml-3 inline-block animate-pulse opacity-0 group-hover:opacity-100 text-xs text-blue-400 font-bold uppercase tracking-widest">
                          {isExpanded ? 'Close' : 'View Trips'}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-1">{summary.period}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-10 text-right">
                    <div className="hidden md:block">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Gross Revenue</p>
                      <p className="text-base font-bold text-slate-800">${summary.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{t.netProfit}</p>
                      <p className={`text-2xl font-black ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        ${netProfit.toLocaleString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => setExpandedKey(isExpanded ? null : summary.id)}
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 ${isExpanded ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-300 hover:text-blue-500'}`}
                    >
                      ▾
                    </button>
                 </div>
              </div>

              {/* Collapsible Detail Table (Monthly Trips Details) */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
              >
                <div className="px-8 pb-10">
                  <div className="flex items-center justify-between mb-8 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                      <h5 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.2em]">{t.details} (Month-by-Month Details)</h5>
                    </div>
                    <div className="flex gap-2">
                       <span className="px-3 py-1 bg-slate-100 text-slate-400 text-[9px] font-bold rounded-full">Fines are logged separately</span>
                    </div>
                  </div>
                  
                  <div className="overflow-hidden rounded-[2rem] border border-slate-100 shadow-inner bg-slate-50/50">
                    <table className="w-full text-left text-xs" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                      <thead>
                        <tr className="bg-slate-100/80">
                          <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest">{t.date}</th>
                          <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest">{t.customer}</th>
                          <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest">{t.route}</th>
                          <th className="px-6 py-5 font-black text-emerald-600 uppercase tracking-widest text-right">{t.revenue}</th>
                          <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest text-right">{t.fuel}</th>
                          <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest text-right">{t.petty}</th>
                          <th className="px-6 py-5 font-black text-rose-500 uppercase tracking-widest text-right">{t.deductions}</th>
                          <th className="px-6 py-5 font-black text-slate-300 uppercase tracking-widest text-center italic">{t.fines}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {detailTrips.map((dt) => (
                          <tr key={dt.id} className="hover:bg-blue-50/20 transition-colors">
                            <td className="px-6 py-5 text-slate-500 font-medium">{dt.date}</td>
                            <td className="px-6 py-5 font-bold text-slate-800">
                              <span className="px-2 py-1 bg-slate-100 rounded text-[9px] uppercase tracking-tighter mr-2">Client</span>
                              {dt.customerName}
                            </td>
                            <td className="px-6 py-5 text-slate-600">
                               <div className="flex items-center gap-2">
                                  <span>{dt.startPoint}</span>
                                  <span className="text-slate-300">→</span>
                                  <span className="font-bold text-slate-700">{dt.endPoint}</span>
                               </div>
                            </td>
                            <td className="px-6 py-5 font-black text-emerald-600 text-right text-sm">${dt.revenue?.toLocaleString()}</td>
                            <td className="px-6 py-5 text-slate-600 text-right">${dt.fuelCost?.toLocaleString()}</td>
                            <td className="px-6 py-5 text-slate-600 text-right">${dt.pettyCash?.toLocaleString()}</td>
                            <td className="px-6 py-5 text-rose-700 font-bold text-right">-${dt.deductions?.toLocaleString()}</td>
                            <td className="px-6 py-5 text-slate-300 font-medium text-center">${dt.trafficFines?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-900 text-white font-black border-t-2 border-slate-900">
                        <tr>
                          <td colSpan={3} className="px-6 py-6 text-sm uppercase tracking-[0.2em]">{summary.period} Aggregate</td>
                          <td className="px-6 py-6 text-emerald-400 text-lg text-right">${summary.totalRevenue.toLocaleString()}</td>
                          <td className="px-6 py-6 text-slate-300 text-right">${summary.totalFuel.toLocaleString()}</td>
                          <td className="px-6 py-6 text-slate-300 text-right">${summary.totalPetty.toLocaleString()}</td>
                          <td className="px-6 py-6 text-rose-400 text-right">-${summary.totalDeductions.toLocaleString()}</td>
                          <td className="px-6 py-6 text-slate-500 text-center">—</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="bg-white rounded-[3rem] p-24 text-center flex flex-col items-center border border-slate-100 shadow-sm">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-5xl mb-6 opacity-40">📉</div>
             <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Fleet Registry is Empty</p>
             <p className="text-slate-300 text-xs mt-2">Add trips to generate monthly performance reports.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverReports;
