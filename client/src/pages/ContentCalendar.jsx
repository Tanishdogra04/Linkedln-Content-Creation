import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Plus, Edit2, Trash2, CheckCircle2, Clock, FileText, Loader2, X } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const ContentCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [post, setPost] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [status, setStatus] = useState('Draft');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/calendar');
      if (res.data && res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!title || !post || !scheduledDate) return;

    try {
      if (editingEvent) {
        // Edit flow
        await axios.put(`/api/calendar/${editingEvent._id}`, {
          title,
          post,
          scheduledDate,
          status
        });
      } else {
        // Create flow
        await axios.post('/api/calendar', {
          title,
          post,
          scheduledDate,
          status
        });
      }

      resetForm();
      fetchEvents();
    } catch (err) {
      console.error('Failed to save calendar event:', err);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setPost(event.post);
    // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
    const d = new Date(event.scheduledDate);
    const tzoffset = d.getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, 16);
    
    setScheduledDate(localISOTime);
    setStatus(event.status);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this post from your schedule?')) return;
    try {
      await axios.delete(`/api/calendar/${id}`);
      fetchEvents();
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setPost('');
    setScheduledDate('');
    setStatus('Draft');
    setEditingEvent(null);
    setShowForm(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Published':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-bold flex items-center gap-1 shadow-sm"><CheckCircle2 size={10} /> Published</span>;
      case 'Scheduled':
        return <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-[10px] font-bold flex items-center gap-1 shadow-sm"><Clock size={10} /> Scheduled</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold flex items-center gap-1 shadow-sm"><FileText size={10} /> Draft</span>;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header card with action */}
      <GlassCard hover={false} className="border-emerald-500/20 shadow-sm bg-emerald-50/30">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-extrabold text-xl mb-1 text-slate-800">Content Calendar</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Track queued concepts, toggle draft status, schedule publication dates, and refine copy layouts.
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <Plus size={16} />
              <span>Create Schedule</span>
            </button>
          )}
        </div>
      </GlassCard>

      {/* Inline schedule Drawer / Form */}
      {showForm && (
        <GlassCard hover={false} className="border-slate-200 bg-white shadow-md">
          <div className="flex items-center justify-between mb-5">
            <h4 className="font-display font-extrabold text-lg text-slate-800">
              {editingEvent ? 'Edit Scheduled Event' : 'Schedule New Post'}
            </h4>
            <button onClick={resetForm} className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Internal Reference Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scaling frameworks reaction post"
                  className="input-field"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-field"
                >
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Post content</label>
              <textarea
                required
                rows={9}
                value={post}
                onChange={(e) => setPost(e.target.value)}
                placeholder="Paste post details here..."
                className="input-field resize-none h-full min-h-[220px]"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 border-t border-slate-200 pt-4 mt-2">
              <button type="button" onClick={resetForm} className="btn-secondary py-2 text-xs">
                Cancel
              </button>
              <button type="submit" className="btn-primary py-2 text-xs">
                {editingEvent ? 'Save Changes' : 'Schedule Event'}
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Visual calendar lists */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={36} className="text-emerald-500 animate-spin mb-3" />
          <p className="text-slate-500 text-sm">Fetching scheduled assets...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-300 rounded-2xl bg-white/50">
          <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center text-emerald-600 mb-4">
            <Calendar size={28} />
          </div>
          <h4 className="font-display font-bold text-slate-600 text-base">Calendar is Empty</h4>
          <p className="text-slate-500 text-xs mt-1.5 max-w-sm leading-relaxed">
            Create a custom schedule above, or generate fresh content and save it directly into this planner workflow!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <GlassCard key={event._id} hover={true} className="flex flex-col justify-between gap-5 relative border-slate-200 bg-white">
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  {getStatusBadge(event.status)}
                  <span className="text-[11px] text-slate-500 font-semibold font-mono">
                    {new Date(event.scheduledDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <h4 className="font-bold text-slate-800 text-base line-clamp-1 mb-2">
                  {event.title}
                </h4>
                
                <p className="text-slate-600 text-xs line-clamp-4 leading-relaxed whitespace-pre-line bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {event.post}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 mt-1">
                <button
                  onClick={() => handleEdit(event)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 text-slate-500 hover:text-emerald-600 bg-white hover:bg-emerald-50 active:scale-95 transition-all shadow-sm"
                  title="Edit post"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 active:scale-95 transition-all shadow-sm"
                  title="Delete post"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentCalendar;
