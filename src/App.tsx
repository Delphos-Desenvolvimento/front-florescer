import { useState, useEffect } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';
import createAppTheme from './theme';
import { verifyToken, isTokenValidLocal } from './API/login';

// Importações das páginas
import Home from './componnents/home';
import AdminHome from './componnents/adminpage/adminhome';
import Login from './componnents/adminpage/login';
import AllNewsPage from './componnents/page/AllNewsPage';
import NewsDetailPage from './componnents/page/NewsDetailPage';
import TeamPage from './componnents/page/TeamPage';
import UsefulLinks from './componnents/page/UsefulLinks';
import Notices from './componnents/page/Notices';
import PublicLayout from './componnents/PublicLayout';
import AccessibilityWidget from './componnents/common/AccessibilityWidget';
import ChatFlora from './componnents/common/ChatFlora';

// Componente de rota protegida
// Componente de rota protegida
// Componente de rota protegida
const ExternalRedirect = ({ to }: { to: string }) => {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const locallyValid = isTokenValidLocal();
        if (locallyValid) {
          setIsAuthenticated(true);
          await verifyToken().catch(() => undefined);
          return;
        }
        await verifyToken();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: { pathname: location.pathname } }}
      />
    );
  }

  return children;
};

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);
  return null;
};

function ChatFloraConditional() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return isAdminRoute ? null : <ChatFlora />;
}

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      try {
        const obj = JSON.parse(saved) as { darkMode?: boolean };
        if (obj && typeof obj.darkMode === 'boolean') {
          setMode(obj.darkMode ? 'dark' : 'light');
        }
      } catch {
        void 0;
      }
    }

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { darkMode?: boolean } | undefined;
      if (detail && typeof detail.darkMode === 'boolean') {
        setMode(detail.darkMode ? 'dark' : 'light');
      }
    };
    window.addEventListener('accessibilitySettingsChanged', handler);
    return () => window.removeEventListener('accessibilitySettingsChanged', handler);
  }, []);

  return (
    <ThemeProvider theme={createAppTheme(mode)}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/*"
            element={
              <PublicLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/noticias" element={<AllNewsPage />} />
                  <Route path="/noticia/:id" element={<NewsDetailPage />} />
                  <Route path="/equipe" element={<TeamPage />} />
                  <Route path="/links-uteis" element={<UsefulLinks />} />
                  <Route path="/avisos" element={<Notices />} />
                  <Route
                    path="/login"
                    element={<ExternalRedirect to="https://app.florescer.tec.br" />}
                  />
                </Routes>
              </PublicLayout>
            }
          />
        </Routes>
        <AccessibilityWidget />
        <ChatFloraConditional />
      </Router>
    </ThemeProvider>
  );
}

export default App;
