import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Loader2, UserPlus } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await register(username, email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Registration failed. Check details.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
      {/* Background radial glows */}
      <div className="absolute h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl top-1/4 left-1/4 animate-pulse-slow"></div>
      <div className="absolute h-96 w-96 rounded-full bg-teal-500/10 blur-3xl bottom-1/4 right-1/4 animate-pulse-slow"></div>

      <div className="w-full max-w-md relative z-10">
        <GlassCard hover={false} padding={true}>
          <div className="flex flex-col items-center gap-2 mb-8 text-center">
            <span className="text-4xl animate-float">✍️</span>
            <h2 className="font-display font-extrabold text-3xl text-gradient mt-2">Get Started</h2>
            <p className="text-slate-500 text-sm">Create your creator account today</p>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="John Doe"
                  className="input-field pl-11"
                />
                <User className="absolute left-4 top-3.5 text-slate-500" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="input-field pl-11"
                />
                <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-11"
                />
                <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-4 w-full"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default Register;
