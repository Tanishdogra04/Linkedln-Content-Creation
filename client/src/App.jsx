import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GenerateContent from './pages/GenerateContent';
import ResearchCenter from './pages/ResearchCenter';
import ContentCalendar from './pages/ContentCalendar';
import StyleLibrary from './pages/StyleLibrary';
import Analytics from './pages/Analytics';

// Protected Route Guard wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500">
        <div class="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p class="text-sm font-semibold tracking-wide">Securing connection...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Public Route Guard (Redirect authenticated users to dashboard)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Protected Application Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/generate" element={
            <ProtectedRoute>
              <GenerateContent />
            </ProtectedRoute>
          } />
          <Route path="/research" element={
            <ProtectedRoute>
              <ResearchCenter />
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <ContentCalendar />
            </ProtectedRoute>
          } />
          <Route path="/library" element={
            <ProtectedRoute>
              <StyleLibrary />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />

          {/* Wildcard Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
