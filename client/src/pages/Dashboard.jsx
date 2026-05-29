import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Search, 
  Calendar, 
  Library, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalGenerated: 0, totalResearch: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/analytics');
        if (res.data && res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const quickActions = [
    {
      name: 'Generate Content',
      desc: 'Use Gemini to write a spaced, high-converting LinkedIn post.',
      path: '/generate',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      name: 'Research Center',
      desc: 'Pull active global news feeds and immediately draft reaction posts.',
      path: '/research',
      icon: Search,
      color: 'from-teal-500 to-cyan-500',
    },
    {
      name: 'Content Calendar',
      desc: 'Visualize scheduled drafts, scheduled dates, and change statuses.',
      path: '/calendar',
      icon: Calendar,
      color: 'from-emerald-600 to-green-500',
    },
    {
      name: 'Style Library',
      desc: 'Add custom hooks and stories to train the emulating RAG AI.',
      path: '/library',
      icon: Library,
      color: 'from-green-500 to-lime-500',
    },
  ];

  return (
    <div class="flex flex-col gap-8">
      {/* Top Welcome Banner */}
      <GlassCard hover={false} className="relative overflow-hidden border-emerald-500/20 shadow-sm">
        <div class="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-teal-600/5 z-0"></div>
        <div class="relative z-10 flex flex-col gap-2">
          <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
            <Award size={14} /> Creator Dashboard
          </span>
          <h2 class="font-display font-extrabold text-3xl md:text-4xl text-slate-800">
            Welcome back, {user?.username || 'Creator'}!
          </h2>
          <p class="text-slate-600 text-sm md:text-base max-w-2xl">
            Emulate top copywriting methods, construct high-performance hooks, leverage search RAG databases, and schedule your posts seamlessly.
          </p>
        </div>
      </GlassCard>

      {/* Basic Metrics overview */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="flex items-center gap-5">
          <div class="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
            <Sparkles size={22} />
          </div>
          <div>
            <p class="text-slate-500 text-xs font-semibold uppercase tracking-wider">Posts Generated</p>
            <h3 class="text-3xl font-extrabold font-display text-slate-800 mt-1">{loading ? '...' : stats.totalGenerated}</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-5">
          <div class="h-12 w-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
            <Search size={22} />
          </div>
          <div>
            <p class="text-slate-500 text-xs font-semibold uppercase tracking-wider">Research Queries</p>
            <h3 class="text-3xl font-extrabold font-display text-slate-800 mt-1">{loading ? '...' : stats.totalResearch}</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-5 sm:col-span-2 lg:col-span-1">
          <div class="h-12 w-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shadow-sm">
            <TrendingUp size={22} />
          </div>
          <div>
            <p class="text-slate-500 text-xs font-semibold uppercase tracking-wider">System State</p>
            <h3 class="text-lg font-bold text-emerald-600 mt-2 flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              RAG Active
            </h3>
          </div>
        </GlassCard>
      </div>

      {/* Quick Launchpad Actions */}
      <div>
        <h3 class="font-display font-extrabold text-2xl mb-6 text-slate-800">Quick Launchpad</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <GlassCard
                key={i}
                onClick={() => navigate(action.path)}
                className="cursor-pointer group hover:scale-[1.01] transition-transform duration-200"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class={`h-12 w-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon size={22} />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-lg text-slate-800 group-hover:text-emerald-600 transition-colors flex items-center gap-1">
                      {action.name}
                      <ArrowRight size={16} class="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-600" />
                    </h4>
                    <p class="text-slate-500 text-sm mt-1.5 leading-relaxed">{action.desc}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Spacing & Content Guidelines */}
      <GlassCard hover={false} className="border-slate-200 shadow-sm bg-slate-50/50">
        <h3 class="font-display font-extrabold text-xl mb-4 flex items-center gap-2 text-slate-800">
          <BookOpen size={20} class="text-emerald-500" />
          The NB Media Writing Philosophy
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mt-2">
          <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm leading-relaxed">
            <h4 class="font-bold text-emerald-700 mb-1">Scroll-Stopping Hooks</h4>
            <p class="text-slate-500 text-xs">Start with a direct observation, a counter-intuitive statement, or a bold truth. Make it 1 line. Keep them reading.</p>
          </div>
          <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm leading-relaxed">
            <h4 class="font-bold text-teal-700 mb-1">Heavy Line Spacing</h4>
            <p class="text-slate-500 text-xs">Paragraphs should never exceed 1-2 lines. White space increases readability and boosts user interaction rates.</p>
          </div>
          <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm leading-relaxed">
            <h4 class="font-bold text-green-700 mb-1">Actionable Bullet Lists</h4>
            <p class="text-slate-500 text-xs">Offer clear framework steps. Use numbers or simple hyphens. No long walls of corporate jargon.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;
