import React from 'react';
import { Box } from '@mui/material';
import Header from './page/Header';
import Footer from './page/Footer';
import AccessibilityWidget from './common/AccessibilityWidget';
import '../accessibility.css';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
      <AccessibilityWidget />
    </Box>
  );
};

export default PublicLayout;
