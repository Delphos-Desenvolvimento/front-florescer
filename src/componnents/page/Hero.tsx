import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
// Hero Component
import { useState, useEffect, useRef } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const slides = [
  {
    type: 'video',
    desktop: '/images/banner-video-v5.mp4',
    mobile: '/images/banner-video-mobile-v2.mp4'
  },
  {
    type: 'image',
    desktop: '/images/banner2corr.png',
    mobile: '/images/banner2-mobile.png'
  }
];

function Hero() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
        minHeight: '100vh', // Garante altura mínima da tela
        height: 'auto', // Permite crescer se necessário
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
          aspectRatio: '16/9', // Mantém proporção cinematográfica
          height: 'auto', // Remove altura fixa para adaptar ao aspect-ratio
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
            left: { xs: '5px', md: '-60px' },
            top: '50%', // Centraliza verticalmente
            transform: 'translateY(-50%)', // Ajuste fino da centralização
            zIndex: 10,
            color: 'primary.main',
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            boxShadow: 3,
            width: { xs: '40px', md: '48px' }, // Aumentado para melhor toque
            height: { xs: '40px', md: '48px' }, // Aumentado para melhor toque
            transition: 'all 0.3s ease',
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        {/* Botão Próximo */}
        <IconButton
          onClick={handleManualNext}
          sx={{
            position: 'absolute',
            right: { xs: '5px', md: '-60px' },
            top: '50%', // Centraliza verticalmente
            transform: 'translateY(-50%)', // Ajuste fino da centralização
            zIndex: 10,
            color: 'primary.main',
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            boxShadow: 3,
            width: { xs: '40px', md: '48px' }, // Aumentado para melhor toque
            height: { xs: '40px', md: '48px' }, // Aumentado para melhor toque
            transition: 'all 0.3s ease',
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>

        <Box sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
          {/* Imagens/Vídeos do Carrossel */}
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            // Escolhe a fonte baseada no dispositivo
            const src = isMobile ? slide.mobile : slide.desktop;
            const isVideo = src.endsWith('.mp4');
            
            return (
              <Box
                key={index}
                component={isVideo ? 'video' : 'img'}
                src={src}
                alt={isVideo ? undefined : `Banner ${index + 1}`}
                autoPlay={isVideo}
                muted={isVideo}
                loop={isVideo}
                playsInline={isVideo}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: { xs: 'cover', md: 'contain' }, // Cover no mobile para preencher o box mais alto
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
