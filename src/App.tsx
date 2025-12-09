import { useState, useEffect } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';
import theme from './theme';
import { verifyToken, isTokenValidLocal } from './API/login';

// Importações das páginas
import Home from './componnents/home';
import AdminLogin from './componnents/adminpage/login';
import AdminHome from './componnents/adminpage/adminhome';
import AllNewsPage from './componnents/page/AllNewsPage';
import NewsDetailPage from './componnents/page/NewsDetailPage';
import TeamPage from './componnents/page/TeamPage';
import UsefulLinks from './componnents/page/UsefulLinks';
import PublicLayout from './componnents/PublicLayout';

// Componente de rota protegida
// Componente de rota protegida
// Componente de rota protegida
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
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
                  <Route path="/login" element={<Navigate to="/admin/login" replace />} />
                </Routes>
              </PublicLayout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
