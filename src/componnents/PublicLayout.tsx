import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import Header from './page/Header';
import Footer from './page/Footer';
import { useLocation } from 'react-router-dom';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash) return;
    let attempts = 0;
    const tryScroll = () => {
      const sec = document.getElementById(hash);
      const el =
        sec &&
        (hash === 'sobre'
          ? (sec.querySelector('h1') as HTMLElement) || sec
          : hash === 'solucoes'
            ? (sec.querySelector('h2') as HTMLElement) || sec
            : sec);
      if (el) {
        const headerEl = document.querySelector('header');
        const headerH = headerEl ? (headerEl as HTMLElement).getBoundingClientRect().height : 80;
        const y = el.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top: y, behavior: 'smooth' });
        return;
      }
      if (attempts < 20) {
        attempts += 1;
        setTimeout(tryScroll, 50);
      }
    };
    tryScroll();
  }, [location.pathname, location.hash]);

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
