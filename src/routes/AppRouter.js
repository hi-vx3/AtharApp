import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../features/landing/LandingPage';
import { getResourceRoutes, RESOURCE_ROUTES } from '../features/resources/ResourcesRouter';

// Centralized Route Paths Config (Aggregated from Modules)
export const ROUTES = {
  ...RESOURCE_ROUTES,
};

// Lazy loaded page components for optimal load performance
const AuthCallbackPage = lazy(() => import('../components/auth/AuthCallbackPage'));

// Premium, glassmorphic loading screen shown during lazy-load navigation
const LoadingFallback = () => (
  <div dir="rtl" className="min-h-screen bg-[#070b13] flex flex-col items-center justify-center text-slate-200 font-sans relative overflow-hidden">
    {/* Decorative background glow */}
    <div className="absolute w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
    
    <div className="relative z-10 flex flex-col items-center gap-5">
      {/* Dynamic spinning loader */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-900/80"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <span className="text-xs font-bold text-slate-400 tracking-widest animate-pulse">
        جاري تحميل الصفحة...
      </span>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Core application routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Feature-specific modular routes */}
        {getResourceRoutes()}

        {/* Fallback redirection to the new landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;