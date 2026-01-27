import { Box, IconButton } from '@mui/material';
// Hero Component
import { useState, useEffect, useRef } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const slides = [
  '/images/banner1corr.png',
  '/images/banner2corr.png'
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 5000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, []);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleManualNext = () => {
    handleNext();
    startAutoPlay(); // Reinicia o timer ao interagir
  };

  const handleManualPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    startAutoPlay(); // Reinicia o timer ao interagir
  };

  return (
    <Box
      id="hero-section"
      sx={{
        position: 'relative',
        height: '100vh',
        minHeight: '600px',
        margin: 0,
        padding: 0,
        backgroundImage: 'url(/images/Fundo.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: { xs: '95%', md: '90%' },
          maxWidth: '1200px',
          height: { xs: '280px', sm: '420px', md: '560px' }, 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'visible',
          mx: 'auto', 
        }}
      >
        {/* Botão Anterior */}
        <IconButton
          onClick={handleManualPrev}
          sx={{
            position: 'absolute',
            left: { xs: '-10px', md: '-60px' },
            zIndex: 10,
            color: 'primary.main',
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            boxShadow: 3,
            width: '40px',
            height: '40px',
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        {/* Botão Próximo */}
        <IconButton
          onClick={handleManualNext}
          sx={{
            position: 'absolute',
            right: { xs: '-10px', md: '-60px' },
            zIndex: 10,
            color: 'primary.main',
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            boxShadow: 3,
            width: '40px',
            height: '40px',
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>

        <Box sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
          {/* Imagens do Carrossel */}
          {slides.map((src, index) => {
            const isActive = index === currentSlide;
            
            return (
              <Box
                key={src}
                component="img"
                src={src}
                alt={`Banner ${index + 1}`}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  zIndex: isActive ? 2 : 1,
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 1s ease-in-out', // Transição suave de Fade
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default Hero;
