import React, { useState, useEffect } from 'react';
import { Trip } from '../types';
import { analyzeTrips } from '../services/geminiService';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

interface DashboardProps {
  trips: Trip[];
}

const Dashboard: React.FC<DashboardProps> = ({ trips }) => {
  const [aiInsights, setAiInsights] = useState<string>("");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [liveEvents, setLiveEvents] = useState<{id: number, text: string, time: string, type: 'info' | 'warn' | 'success'}[]>([]);

  useEffect(() => {
    const initialEvents = [
      { id: 1, text: "LKH 4421: Entered Riyadh Zone", time: "2 mins ago", type: 'success' },
      { id: 2, text: "RRT 9901: Loading at Dammam Port", time: "15 mins ago", type: 'info' },
      { id: 3, text: "DMM 5588: Engine Warning - High Temp", time: "1 hour ago", type: 'warn' },
      { id: 4, text: "Fahad Al-Rashid: Session Start", time: "3 hours ago", type: 'info' }
    ] as const;
    setLiveEvents([...initialEvents]);

    const getInsights = async () => {
      if (trips.length > 0) {
        setLoadingInsights(true);
        const res = await analyzeTrips(trips);
        setAiInsights(res || "");
        setLoadingInsights(false);
      }
    };
    getInsights();
  }, [trips]);

  const stats = {
    total: trips.length,
    moving: trips.filter(t => t.status === 'in-progress').length,
    loading: trips.filter(t => t.status === 'loading').length,
    completed: trips.filter(t => t.status === 'completed').length,
  };

  const operationalData = [
    { name: 'Moving', value: stats.moving, color: '#3b82f6' },
    { name: 'Loading', value: stats.loading, color: '#f59e0b' },
    { name: 'Completed', value: stats.completed, color: '#10b981' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Upper Grid: Status & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Fleet Distribution - High-end White Card */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Fleet Utilization</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Real-time status synchronization</p>
            </div>
            <div className="px-6 py-3 bg-blue-50/50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-blue-100">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              Live Tracking
            </div>
          </div>

          <div className="flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={operationalData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontWeight: 800, fontSize: 12}}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '16px'}}
                />
                <Bar dataKey="value" radius={[16, 16, 16, 16]} barSize={70}>
                  {operationalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-slate-50">
            {operationalData.map((stat) => (
              <div key={stat.name} className="group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-hover:text-blue-500 transition-colors">{stat.name}</p>
                <p className="text-4xl font-black tracking-tight" style={{color: stat.color}}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Pulse - Dark Sleek Card */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-white/10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black tracking-tight">Live Pulse</h3>
            <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 uppercase tracking-widest">v3.5 Monitor</span>
          </div>

          <div className="space-y-8 flex-1">
            {liveEvents.map((event) => (
              <div key={event.id} className="flex gap-6 group animate-in slide-in-from-right-8 duration-500">
                <div className={`w-1.5 h-14 rounded-full shrink-0 ${
                  event.type === 'warn' ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : event.type === 'success' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-blue-500 shadow-[0_0_15px_#3b82f6]'
                } transition-all duration-500 group-hover:scale-y-110`}></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-100 leading-snug">{event.text}</p>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-2">{event.time}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-10 w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:border-white/20">
            System Log Explorer
          </button>
        </div>
      </div>

      {/* AI Insights - Premium Gradient Background */}
      <div className="bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-900 rounded-[3rem] p-16 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] group-hover:bg-blue-400/20 transition-all duration-1000"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center text-4xl shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform duration-700">
              ✨
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tight">AI Fleet Analytics</h3>
              <p className="text-blue-200 text-xs font-black uppercase tracking-widest mt-1 opacity-70">Powered by Google Gemini 3.0 Pro</p>
            </div>
          </div>

          {loadingInsights ? (
            <div className="space-y-6">
              <div className="h-5 w-3/4 bg-white/5 rounded-full animate-pulse"></div>
              <div className="h-5 w-1/2 bg-white/5 rounded-full animate-pulse delay-75"></div>
              <div className="h-5 w-2/3 bg-white/5 rounded-full animate-pulse delay-150"></div>
            </div>
          ) : (
            <div className="max-w-4xl">
              <div className="text-xl font-medium leading-relaxed opacity-90 whitespace-pre-wrap tracking-tight">
                {aiInsights || "Collecting fleet telemetry to synthesize operational optimizations and fuel efficiency strategies..."}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;