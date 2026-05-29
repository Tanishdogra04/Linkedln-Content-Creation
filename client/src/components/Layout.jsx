import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Sparkles, 
  Search, 
  Calendar, 
  BarChart3, 
  Library, 
  LogOut, 
  Menu, 
  X,
  User as UserIcon
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Generate Content', path: '/generate', icon: Sparkles },
    { name: 'Research Center', path: '/research', icon: Search },
    { name: 'Content Calendar', path: '/calendar', icon: Calendar },
    { name: 'Style Library', path: '/library', icon: Library },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentActiveName = menuItems.find(item => item.path === location.pathname)?.name || 'LinkedIn Agent';

  return (
    <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* Dynamic Mobile Navbar header */}
      <header class="md:hidden w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" class="flex items-center gap-2.5">
          <span class="text-2xl animate-float">✍️</span>
          <span class="font-display font-extrabold text-xl text-gradient">NB Writer</span>
        </Link>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          class="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 active:scale-95 transition-transform shadow-sm"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside class={`
        fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out shadow-sm
        md:sticky md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div class="flex flex-col gap-8">
          {/* Logo */}
          <div class="hidden md:flex items-center gap-3">
            <span class="text-3xl animate-float">✍️</span>
            <span class="font-display font-extrabold text-2xl text-gradient tracking-tight">
              NB Writer
            </span>
          </div>

          {/* Navigation Links */}
          <nav class="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  class={`
                    flex items-center gap-3.5 px-4.5 py-3 rounded-xl font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm' 
                      : 'border border-transparent text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
                    }
                  `}
                >
                  <Icon size={18} class={isActive ? 'text-emerald-600' : 'text-slate-500'} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div class="flex flex-col gap-4 border-t border-slate-100 pt-6">
          <div class="flex items-center gap-3 px-3">
            <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold font-display shadow-md shadow-emerald-600/20">
              {user?.username?.charAt(0).toUpperCase() || <UserIcon size={18} />}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-slate-800 truncate text-sm">{user?.username || 'Guest'}</p>
              <p class="text-slate-500 text-xs truncate">{user?.email || 'Creator'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 active:scale-95 w-full text-left"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div class="flex-1 flex flex-col min-w-0">
        <main class="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Section Header */}
          <div class="mb-8 flex items-center justify-between">
            <h1 class="font-display font-extrabold text-3xl text-gradient">{currentActiveName}</h1>
            <div class="hidden md:flex items-center gap-2.5 bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-xl text-xs font-semibold text-slate-600">
              <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              OpenRouter 120B Connected
            </div>
          </div>

          {children}
        </main>
      </div>

      {/* Backdrop overlay for mobile menu */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          class="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default Layout;
