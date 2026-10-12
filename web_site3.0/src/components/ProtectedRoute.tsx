import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheckIcon, Loader2Icon } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto mb-4 text-teal-400">
            <ShieldCheckIcon className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Verifying Session</h2>
          <p className="text-xs text-slate-400 mb-6">Validating admin credentials and security tokens...</p>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-teal-400">
            <Loader2Icon className="w-4 h-4 animate-spin" />
            <span>Please wait...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
