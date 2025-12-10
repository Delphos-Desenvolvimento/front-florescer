import React from 'react';
import { Box } from '@mui/material';
import Header from './page/Header';
import Footer from './page/Footer';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default PublicLayout;
