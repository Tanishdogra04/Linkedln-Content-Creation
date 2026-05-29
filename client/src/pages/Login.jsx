import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Login failed. Check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
      {/* Visual Backdrops */}
      <div class="absolute h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl top-1/4 left-1/4 animate-pulse-slow"></div>
      <div class="absolute h-96 w-96 rounded-full bg-teal-500/10 blur-3xl bottom-1/4 right-1/4 animate-pulse-slow"></div>

      <div class="w-full max-w-md relative z-10">
        <GlassCard hover={false} padding={true}>
          <div class="flex flex-col items-center gap-2 mb-8 text-center">
            <span class="text-4xl animate-float">✍️</span>
            <h2 class="font-display font-extrabold text-3xl text-gradient mt-2">Welcome Back</h2>
            <p class="text-slate-500 text-sm">Sign in to your LinkedIn Content Agent</p>
          </div>

          {error && (
            <div class="mb-5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div class="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  class="input-field pl-11"
                />
                <Mail class="absolute left-4 top-3.5 text-slate-500" size={18} />
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
              <div class="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  class="input-field pl-11"
                />
                <Lock class="absolute left-4 top-3.5 text-slate-500" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              class="btn-primary mt-4 w-full"
            >
              {loading ? (
                <>
                  <Loader2 size={18} class="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <p class="text-center text-slate-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" class="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors">
              Create Account
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default Login;
