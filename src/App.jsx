import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import Home from './pages/Home';
import LeSport from './pages/LeSport';

import Association from './pages/Association';
import Contact from './pages/Contact';
import Gouvernance from './pages/Gouvernance';
import Actualites from './pages/Actualites';
import ArticleDetail from './pages/ArticleDetail';
import Boutique from './pages/Boutique';
import ProductDetail from './pages/ProductDetail';
import Panier from './pages/Panier';
import Forum from './pages/Forum';
import Media from './pages/Media';
import Tutoriels from './pages/Tutoriels';
import AdminDashboard from './pages/AdminDashboard';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

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
        <Route path="/association" element={<Association />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gouvernance" element={<Gouvernance />} />
        <Route path="/actualites" element={<Actualites />} />
        <Route path="/actualites/:id" element={<ArticleDetail />} />
        <Route path="/boutique" element={<Boutique />} />
        <Route path="/boutique/panier" element={<Panier />} />
        <Route path="/boutique/:id" element={<ProductDetail />} />
        <Route path="/forum" element={<Forum />} />
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
    <LanguageProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App