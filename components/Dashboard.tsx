
import React, { useState, useEffect } from 'react';
import { Trip } from '../types';
import { analyzeTrips } from '../services/geminiService';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';

interface DashboardProps {
  trips: Trip[];
}

const Dashboard: React.FC<DashboardProps> = ({ trips }) => {
  const [aiInsights, setAiInsights] = useState<string>("");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [liveEvents, setLiveEvents] = useState<{id: number, text: string, time: string, type: 'info' | 'warn' | 'success'}[]>([]);

  useEffect(() => {
    // Simulated Live Activity Feed
    const initialEvents = [
      { id: 1, text: "LKH 4421: Entered Riyadh Zone", time: "2 mins ago", type: 'success' },
      { id: 2, text: "RRT 9901: Loading at Dammam Port", time: "15 mins ago", type: 'info' },
      { id: 3, text: "DMM 5588: Engine Warning - High Temp", time: "1 hour ago", type: 'warn' },
      { id: 4, text: "Fahad Al-Rashid: Session Start", time: "3 hours ago", type: 'info' }
    ] as const;
    setLiveEvents([...initialEvents]);

    const interval = setInterval(() => {
      const randomTrips = ["JED 1111", "KSA 2030", "BSA 2210"];
      const locations = ["Makkah", "Medina", "Jubail", "Abha"];
      const newEvent = {
        id: Date.now(),
        text: `${randomTrips[Math.floor(Math.random() * randomTrips.length)]}: Approaching ${locations[Math.floor(Math.random() * locations.length)]}`,
        time: "Just now",
        type: 'info' as const
      };
      setLiveEvents(prev => [newEvent, ...prev.slice(0, 5)]);
    }, 15000);

    const getInsights = async () => {
      if (trips.length > 0) {
        setLoadingInsights(true);
        const res = await analyzeTrips(trips);
        setAiInsights(res || "");
        setLoadingInsights(false);
      }
    };
    getInsights();

    return () => clearInterval(interval);
  }, [trips]);

  const stats = {
    total: trips.length,
    moving: trips.filter(t => t.status === 'in-progress').length,
    loading: trips.filter(t => t.status === 'loading').length,
    completed: trips.filter(t => t.status === 'completed').length,
  };

  const operationalData = [
    { name: 'Moving', value: stats.moving, color: '#10b981' },
    { name: 'Loading', value: stats.loading, color: '#f59e0b' },
    { name: 'Completed', value: stats.completed, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Upper Grid: Status & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Fleet Distribution */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Fleet Operations</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Real-time status breakdown</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
              <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
              Live Tracking Active
            </div>
          </div>

          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={operationalData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontWeight: 800, fontSize: 12}}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
                  {operationalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-50">
            {operationalData.map((stat) => (
              <div key={stat.name} className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.name}</p>
                <p className="text-3xl font-black" style={{color: stat.color}}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black">Live Pulse</h3>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">v3.4 Monitor</span>
          </div>

          <div className="space-y-6 flex-1">
            {liveEvents.map((event) => (
              <div key={event.id} className="flex gap-4 group animate-in slide-in-from-right-4 duration-300">
                <div className={`w-1.5 h-12 rounded-full shrink-0 ${
                  event.type === 'warn' ? 'bg-rose-500' : event.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                } group-hover:scale-y-125 transition-transform`}></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-100">{event.text}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
            View Full System Log
          </button>
        </div>
      </div>

      {/* AI Operational Insights */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl">
              ✨
            </div>
            <div>
              <h3 className="text-2xl font-black">AI Fleet Analysis</h3>
              <p className="text-blue-100 text-sm font-medium">Powered by Google Gemini 2.5</p>
            </div>
          </div>

          {loadingInsights ? (
            <div className="space-y-4">
              <div className="h-4 w-3/4 bg-white/10 rounded-full animate-pulse"></div>
              <div className="h-4 w-1/2 bg-white/10 rounded-full animate-pulse delay-75"></div>
              <div className="h-4 w-2/3 bg-white/10 rounded-full animate-pulse delay-150"></div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="text-lg font-medium leading-relaxed opacity-90 whitespace-pre-wrap">
                {aiInsights || "Awaiting more trip data to generate operational optimizations..."}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
