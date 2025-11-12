import { useState } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

// Importações das páginas
import Home from './componnents/home';
import AdminLogin from './componnents/adminpage/login';
import AdminHome from './componnents/adminpage/adminhome';

// Componente de rota protegida
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isAuthenticated] = useState(true); // Always allow access for now

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
          <Route path="/" element={<Home />} />
          
          {/* Redirect /login to /admin/login for backward compatibility */}
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />
          
          {/* Rotas de administração */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/noticias" 
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
