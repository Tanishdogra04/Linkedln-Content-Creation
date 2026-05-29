import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Library, Plus, Edit2, Trash2, Tag, Loader2, X } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const StyleLibrary = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tech & Startups');

  const categories = [
    'Tech & Startups',
    'Storytelling & Brand',
    'Marketing & Scaling',
    'AI & Product Design',
    'Observations & Rants'
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/style');
      if (res.data && res.data.success) {
        setPosts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load style training library:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!title || !content || !category) return;

    try {
      if (editingPost) {
        // Edit flow
        await axios.put(`/api/style/${editingPost._id}`, {
          title,
          content,
          category
        });
      } else {
        // Create flow
        await axios.post('/api/style', {
          title,
          content,
          category
        });
      }

      resetForm();
      fetchPosts();
    } catch (err) {
      console.error('Failed to save style post:', err);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this style example from training library? This will impact future generations.')) return;
    try {
      await axios.delete(`/api/style/${id}`);
      fetchPosts();
    } catch (err) {
      console.error('Failed to delete style post:', err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('Tech & Startups');
    setEditingPost(null);
    setShowForm(false);
  };

  // Quick Seed helper to give them premium initial writing styles immediately!
  const seedLibrary = async () => {
    if (!window.confirm('Seed the library with high-converting professional hooks?')) return;
    try {
      await axios.post('/api/style', {
        title: 'The Bootstrap Playbook hook',
        category: 'Tech & Startups',
        content: `Most founders are building in the dark.

And it’s costing them thousands in missed organic reach.

Here is the exact 3-step playbook we use to scale brands:

1. Stop writing generic guides
Nobody wants an encyclopedia on their feed. Give them one actionable lesson they can implement in 5 minutes.

2. Master the scroll-stopping hook
Your first line is 90% of the battle. If it doesn’t create curiosity, the rest of your post is invisible.

3. Write like you speak
Short lines.
Double spacing.
Simple words.

Your LinkedIn profile is your digital storefront.
Treat it like one.

What’s your biggest hurdle with organic content? Let’s chat in the comments.`
      });
      fetchPosts();
    } catch (err) {
      console.error('Failed to seed style:', err);
    }
  };

  return (
    <div class="flex flex-col gap-8">
      {/* Top Welcome Header */}
      <GlassCard hover={false} className="border-emerald-500/20 shadow-sm bg-emerald-50/30">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h3 class="font-display font-extrabold text-xl mb-1 text-slate-800">Style Training Library (RAG)</h3>
            <p class="text-slate-600 text-sm leading-relaxed">
              Define the tone, spacing benchmarks, and storytelling structure guidelines that the AI uses during prompt compilation.
            </p>
          </div>
          <div class="flex gap-2">
            {posts.length === 0 && (
              <button onClick={seedLibrary} class="btn-secondary text-xs py-2">
                Seed Library
              </button>
            )}
            {!showForm && (
              <button onClick={() => setShowForm(true)} class="btn-primary">
                <Plus size={16} />
                <span>Add Template</span>
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Entry / Update Drawer */}
      {showForm && (
        <GlassCard hover={false} className="border-slate-200 bg-white shadow-md">
          <div class="flex items-center justify-between mb-5">
            <h4 class="font-display font-extrabold text-lg text-slate-800">
              {editingPost ? 'Edit Style Example' : 'Add Style Benchmark'}
            </h4>
            <button onClick={resetForm} class="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleCreateOrUpdate} class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Example Description / Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scaling organic reach breakdown hook"
                  class="input-field"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Example Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  class="input-field"
                >
                  {categories.map((c, i) => (
                    <option key={i} value={c} class="bg-white text-slate-800">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Post content (Observe double lines spacing)</label>
              <textarea
                required
                rows={9}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the high-performing LinkedIn post here..."
                class="input-field resize-none h-full min-h-[220px]"
              />
            </div>

            <div class="md:col-span-2 flex justify-end gap-3 border-t border-slate-200 pt-4 mt-2">
              <button type="button" onClick={resetForm} class="btn-secondary py-2 text-xs">
                Cancel
              </button>
              <button type="submit" class="btn-primary py-2 text-xs">
                {editingPost ? 'Save Template' : 'Train Model'}
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Library Grid list */}
      {loading ? (
        <div class="flex flex-col items-center justify-center py-20">
          <Loader2 size={36} class="text-emerald-500 animate-spin mb-3" />
          <p class="text-slate-500 text-sm">Loading trained style models...</p>
        </div>
      ) : posts.length === 0 ? (
        <div class="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-300 rounded-2xl bg-white/50">
          <div class="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center text-emerald-600 mb-4">
            <Library size={28} />
          </div>
          <h4 class="font-display font-bold text-slate-600 text-base">Training Library is Empty</h4>
          <p class="text-slate-500 text-xs mt-1.5 max-w-sm leading-relaxed mb-4">
            Add style benchmarks or seed default high-converting copywriting templates directly to active RAG queries!
          </p>
          <button onClick={seedLibrary} class="btn-primary py-2 text-xs">
            Seed Default Benchmarks
          </button>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <GlassCard key={post._id} hover={true} className="flex flex-col justify-between gap-5 border-slate-200 bg-white">
              <div>
                <div class="flex items-center justify-between gap-3 mb-3">
                  <span class="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <Tag size={10} /> {post.category}
                  </span>
                  <span class="text-[10px] text-slate-500 font-semibold font-mono">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h4 class="font-bold text-slate-800 text-base mb-2">
                  {post.title}
                </h4>
                
                <p class="text-slate-600 text-xs whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed max-h-[300px] overflow-y-auto">
                  {post.content}
                </p>
              </div>

              <div class="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 mt-1">
                <button
                  onClick={() => handleEdit(post)}
                  class="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 text-slate-500 hover:text-emerald-600 bg-white hover:bg-emerald-50 active:scale-95 transition-all shadow-sm"
                  title="Edit benchmark"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  class="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 active:scale-95 transition-all shadow-sm"
                  title="Delete benchmark"
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

export default StyleLibrary;
