import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from './LoadingScreen';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const auth = useAuth();
  
  // Show loading screen while authentication is being checked
  if (auth.isLoading) {
    return <LoadingScreen isVisible={true} message="Authenticating..." />;
  }
  
  if (auth.isAuthenticated) {
    return <>{children}</>;
  }
  
  return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
}
