import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2, Calendar, Clipboard, Check } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NikBassiPostPreview from '../components/NikBassiPostPreview';

const GenerateContent = () => {
  const [topic, setTopic] = useState('');
  const [industry, setIndustry] = useState('Tech & SaaS');
  const [audience, setAudience] = useState('Founders & CEOs');
  const [tone, setTone] = useState('Confident & direct');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const [scheduling, setScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const tones = [
    'Confident & direct',
    'Bold & authoritative',
    'Thoughtful & analytical',
    'Conversational & educational',
    'Storytelling & empathetic'
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);
    setScheduleSuccess(false);

    try {
      const res = await axios.post('/api/generate', {
        topic,
        industry,
        audience,
        tone
      });

      if (res.data && res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleToCalendar = async () => {
    if (!result) return;
    setScheduling(true);

    try {
      const res = await axios.post('/api/calendar', {
        title: `Draft: ${topic.slice(0, 30)}...`,
        post: result.post,
        scheduledDate: new Date(Date.now() + 86400000 * 2), // default 2 days out
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
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Parameter Selection panel */}
      <div class="lg:col-span-5 flex flex-col gap-6">
        <GlassCard hover={false}>
          <h3 class="font-display font-extrabold text-xl mb-5 flex items-center gap-2 text-slate-800">
            <Sparkles size={20} class="text-emerald-500 animate-pulse" />
            Post Generator
          </h3>

          <form onSubmit={handleGenerate} class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Post Topic / Theme</label>
              <textarea
                required
                rows={4}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Why standard enterprise spreadsheets are dying and how AI agents are replacing them."
                class="input-field resize-none"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Artificial Intelligence, B2B SaaS"
                class="input-field"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Founders, Venture Capitalists"
                class="input-field"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Writing Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                class="input-field appearance-none cursor-pointer"
              >
                {tones.map((t, idx) => (
                  <option key={idx} value={t} class="bg-white text-slate-800">{t}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              class="btn-primary mt-3 w-full"
            >
              {loading ? (
                <>
                  <Loader2 size={18} class="animate-spin" />
                  <span>Analyzing style & generating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate Spaced Post</span>
                </>
              )}
            </button>
          </form>
        </GlassCard>

        {/* Calendar Quick Add Option */}
        {result && (
          <GlassCard hover={false} className="border-emerald-500/20">
            <h4 class="font-bold text-slate-800 text-sm mb-1.5">Approve and Queue Post</h4>
            <p class="text-slate-500 text-xs leading-relaxed mb-4">
              Add this generated post directly to your Content Calendar as a Draft to refine or schedule later.
            </p>
            <button
              onClick={handleScheduleToCalendar}
              disabled={scheduling || scheduleSuccess}
              class={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all duration-200
                ${scheduleSuccess 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 active:scale-98 shadow-sm'
                }
              `}
            >
              {scheduling ? (
                <>
                  <Loader2 size={14} class="animate-spin" />
                  <span>Queuing draft...</span>
                </>
              ) : scheduleSuccess ? (
                <>
                  <Check size={14} />
                  <span>Queued to Calendar!</span>
                </>
              ) : (
                <>
                  <Calendar size={14} />
                  <span>Queue in Content Calendar</span>
                </>
              )}
            </button>
          </GlassCard>
        )}
      </div>

      {/* Output / Live Preview Pane */}
      <div class="lg:col-span-7 flex flex-col gap-6">
        {result ? (
          <NikBassiPostPreview 
            content={result.post} 
            imageIdea={result.imageIdea}
          />
        ) : (
          <GlassCard hover={false} className="flex flex-col items-center justify-center text-center py-20 border-dashed border-slate-300 bg-slate-50/50">
            <div class="h-16 w-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-emerald-500 mb-4 animate-pulse-slow">
              <Sparkles size={28} />
            </div>
            <h4 class="font-display font-bold text-slate-600 text-base">Awaiting Generation Input</h4>
            <p class="text-slate-500 text-xs mt-1.5 max-w-sm leading-relaxed">
              Enter your topic, industry and audience, then hit generate to watch the RAG model format a post in the Nikit Bassi style.
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default GenerateContent;
