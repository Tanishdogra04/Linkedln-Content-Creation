import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { BarChart3, Loader2, Sparkles, Search, TrendingUp, RefreshCcw } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/analytics');
      if (res.data && res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load analytics logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 size={36} className="text-emerald-500 animate-spin mb-3" />
        <p className="text-slate-500 text-sm">Aggregating creation records...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="flex items-center gap-5 border-slate-200 bg-white">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Generated</p>
            <h3 className="text-3xl font-extrabold font-display text-slate-800 mt-1">{data?.totalGenerated}</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-5 border-slate-200 bg-white">
          <div className="h-12 w-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Search size={22} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Research Queries</p>
            <h3 className="text-3xl font-extrabold font-display text-slate-800 mt-1">{data?.totalResearch}</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center justify-between gap-5 sm:col-span-2 lg:col-span-1 border-slate-200 bg-white">
          <div className="flex items-center gap-5">
            <div className="h-12 w-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Campaigns</p>
              <h3 className="text-3xl font-extrabold font-display text-slate-800 mt-1">4</h3>
            </div>
          </div>
          <button 
            onClick={fetchAnalytics}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 active:scale-95 transition-all shadow-sm"
            title="Refresh statistics"
          >
            <RefreshCcw size={14} />
          </button>
        </GlassCard>
      </div>

      {/* Visual Chart Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Post Generation Daily Trends */}
        <GlassCard hover={false} className="lg:col-span-7 border-slate-200 bg-white">
          <h4 className="font-display font-extrabold text-lg text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-emerald-500" />
            Post Production Activity (Daily)
          </h4>
          
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.postsPerDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#cbd5e1', 
                    borderRadius: '12px',
                    color: '#0f172a'
                  }} 
                />
                <Area type="monotone" dataKey="count" name="Posts Generated" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Most Popular Generated Topics */}
        <GlassCard hover={false} className="lg:col-span-5 border-slate-200 bg-white">
          <h4 className="font-display font-extrabold text-lg text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-teal-500" />
            Most Popular Campaign Themes
          </h4>

          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.popularTopics} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis dataKey="topic" type="category" stroke="#64748b" tickLine={false} axisLine={false} width={120} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#cbd5e1', 
                    borderRadius: '12px',
                    color: '#0f172a'
                  }} 
                />
                <Bar dataKey="count" name="Frequency" fill="#0d9488" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;
