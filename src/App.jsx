import { lazy, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import UnderConstruction from '@/components/UnderConstruction';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';
import Layout from './components/Layout';
import Home from './pages/Home';
const LeSport = lazy(() => import('./pages/LeSport'));
const Contact = lazy(() => import('./pages/Contact'));
const Gouvernance = lazy(() => import('./pages/Gouvernance'));
const Actualites = lazy(() => import('./pages/Actualites'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Boutique = lazy(() => import('./pages/Boutique'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Panier = lazy(() => import('./pages/Panier'));
const Forum = lazy(() => import('./pages/Forum'));
const Media = lazy(() => import('./pages/Media'));
const Tutoriels = lazy(() => import('./pages/Tutoriels'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Flip to false to retire the "under construction" gate once the site is ready.
const CONSTRUCTION_MODE = true;
const CONSTRUCTION_GATE_KEY = 'vizball_construction_gate_passed';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [gatePassed, setGatePassed] = useState(
    () => sessionStorage.getItem(CONSTRUCTION_GATE_KEY) === 'true'
  );

  if (CONSTRUCTION_MODE && !gatePassed) {
    return (
      <UnderConstruction
        onEnter={() => {
          sessionStorage.setItem(CONSTRUCTION_GATE_KEY, 'true');
          setGatePassed(true);
        }}
      />
    );
  }

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-primary">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <span className="font-heading text-2xl text-white tracking-wider">VIZBALL</span>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/le-sport" element={<LeSport />} />
        <Route path="/association" element={<Navigate to="/gouvernance" replace />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gouvernance" element={<Gouvernance />} />
        <Route path="/actualites" element={<Actualites />} />
        <Route path="/actualites/:id" element={<ArticleDetail />} />
        <Route path="/boutique" element={<Boutique />} />
        <Route path="/boutique/panier" element={<Panier />} />
        <Route path="/boutique/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/forum" element={<Forum />} />
        </Route>
        <Route path="/media" element={<Media />} />
        <Route path="/tutoriels" element={<Tutoriels />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router>
              <ScrollToTop />
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </QueryClientProvider>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  )
}

export default App