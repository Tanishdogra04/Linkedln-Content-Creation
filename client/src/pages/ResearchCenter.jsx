import React, { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, Sparkles, AlertCircle, FileText, Calendar, Check } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NikBassiPostPreview from '../components/NikBassiPostPreview';

const ResearchCenter = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const [scheduling, setScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const triggerResearch = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setScheduleSuccess(false);

    try {
      const res = await axios.get('/api/research');
      if (res.data && res.data.success) {
        setResult(res.data.data);
      } else {
        setError('No research insights found.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to news feed servers.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCalendar = async () => {
    if (!result) return;
    setScheduling(true);

    try {
      const res = await axios.post('/api/calendar', {
        title: `Research React: ${result.headline.slice(0, 30)}...`,
        post: result.linkedinPost,
        scheduledDate: new Date(Date.now() + 86400000 * 3), // default 3 days out
        status: 'Draft'
      });

      if (res.data && res.data.success) {
        setScheduleSuccess(true);
      }
    } catch (err) {
      console.error('Failed to add calendar schedule:', err);
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div class="flex flex-col gap-8">
      {/* Top action block */}
      <GlassCard hover={false} className="border-emerald-500/20 shadow-sm bg-emerald-50/30 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-teal-600/5 z-0"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex-1 max-w-xl">
            <h3 class="font-display font-extrabold text-xl mb-1 text-slate-800">Auto-Research Portal</h3>
            <p class="text-slate-600 text-sm leading-relaxed">
              Scan active digital networks for trending artificial intelligence, business models, and startup industry news, draft reaction guides, and view them immediately.
            </p>
          </div>
          <button
            onClick={triggerResearch}
            disabled={loading}
            class="btn-primary min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 size={18} class="animate-spin" />
                <span>Scanning feeds...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>Scrape & Research Now</span>
              </>
            )}
          </button>
        </div>
      </GlassCard>

      {error && (
        <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2 font-medium">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div class="flex flex-col items-center justify-center py-24 text-center">
          <Loader2 size={42} class="text-emerald-500 animate-spin mb-4" />
          <h4 class="font-display font-bold text-slate-700">Executing Deep Research Workflow</h4>
          <p class="text-slate-500 text-xs mt-1.5 max-w-sm leading-relaxed">
            Fetching feeds from news endpoints, summarizing content, identifying tactical ideas, and writing emulated style templates.
          </p>
        </div>
      )}

      {result && (
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Article Analysis */}
          <div class="lg:col-span-5 flex flex-col gap-6">
            <GlassCard hover={false} className="bg-white border-slate-200">
              <div class="flex items-center gap-2 mb-4">
                <FileText size={18} class="text-emerald-500" />
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Source Analysis</span>
              </div>
              
              <h4 class="font-display font-extrabold text-lg text-slate-800 leading-snug mb-3">
                {result.headline}
              </h4>

              <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 leading-relaxed">
                <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-1">AI Summarization:</span>
                <p class="text-slate-600 text-xs">{result.summary}</p>
              </div>

              <div class="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 leading-relaxed">
                <span class="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest block mb-1">Content Strategy Concept:</span>
                <p class="text-slate-700 text-xs font-medium">{result.contentIdea}</p>
              </div>
            </GlassCard>

            {/* Quick scheduling actions */}
            <GlassCard hover={false} className="border-emerald-200 bg-white">
              <h4 class="font-bold text-slate-800 text-sm mb-1">Schedule Research Post</h4>
              <p class="text-slate-500 text-xs leading-relaxed mb-4">
                Satisfied with this news-driven reaction post? Save it directly into the queue.
              </p>
              <button
                onClick={handleAddToCalendar}
                disabled={scheduling || scheduleSuccess}
                class={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all duration-200 shadow-sm
                  ${scheduleSuccess 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-98'
                  }
                `}
              >
                {scheduling ? (
                  <>
                    <Loader2 size={14} class="animate-spin" />
                    <span>Adding to queue...</span>
                  </>
                ) : scheduleSuccess ? (
                  <>
                    <Check size={14} />
                    <span>Saved to calendar drafts!</span>
                  </>
                ) : (
                  <>
                    <Calendar size={14} />
                    <span>Add to Content Calendar</span>
                  </>
                )}
              </button>
            </GlassCard>
          </div>

          {/* Generated post display */}
          <div class="lg:col-span-7 flex flex-col gap-6">
            <NikBassiPostPreview 
              content={result.linkedinPost} 
              imageIdea={result.imageIdea}
            />
          </div>
        </div>
      )}

      {!result && !loading && (
        <div class="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-300 rounded-2xl bg-white/50">
          <div class="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center text-emerald-600 mb-4">
            <Search size={28} />
          </div>
          <h4 class="font-display font-bold text-slate-600 text-base">Research Dashboard Ready</h4>
          <p class="text-slate-500 text-xs mt-1.5 max-w-sm leading-relaxed">
            Click the scrape button above to trigger news queries and extract value insights.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResearchCenter;
