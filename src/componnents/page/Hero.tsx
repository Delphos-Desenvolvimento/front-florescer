import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
// Hero Component
import { useState, useEffect } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const slides = [
  {
    type: 'video',
    desktop: '/images/video-novo-florecer-fev.mp4',
    mobile: '/images/video-novo-florecer-fev-mobile.mp4',
  },
  {
    type: 'image',
    desktop: '/images/banner_novo.png',
    mobile: '/images/banner-2-mobile-new.png',
  },
];

function Hero() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentSlide, setCurrentSlide] = useState(0);
  // Efeito para controlar o tempo de exibição de cada slide
  useEffect(() => {
    const currentSlideType = slides[currentSlide].type;
    // Se for vídeo, aumenta o tempo (20s), senão mantém padrão (5s)
    const slideDuration = currentSlideType === 'video' ? 20000 : 5000;

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, slideDuration);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  const handleManualNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleManualPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <Box
      id="hero-section"
      sx={{
        position: 'relative',
        minHeight: { xs: '80dvh', md: '100vh' }, // Garante altura mínima da tela (dvh para mobile)
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
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%', // Full width
          maxWidth: '100%', // Remove limite de largura
          aspectRatio: { xs: 'unset', md: '19/9' }, // Mantém proporção
          height: { xs: '80dvh', md: '100dvh' }, // Altura total no mobile (dvh)
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
            left: { xs: '5px', md: '30px' }, // Botão mais para dentro
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            color: 'rgba(255,255,255,0.7)', // Seta branca levemente transparente
            bgcolor: 'transparent', // Fundo transparente
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)', // Efeito hover sutil
              color: 'rgba(255,255,255,1)', // Seta totalmente branca no hover
            },
            boxShadow: 'none', // Remove sombra
            width: { xs: '40px', md: '48px' },
            height: { xs: '40px', md: '48px' },
            transition: 'all 0.3s ease',
          }}
        >
          <ArrowBackIosNewIcon fontSize="large" />
        </IconButton>

        {/* Botão Próximo */}
        <IconButton
          onClick={handleManualNext}
          sx={{
            position: 'absolute',
            right: { xs: '5px', md: '30px' }, // Botão mais para dentro
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            color: 'rgba(255,255,255,0.7)', // Seta branca levemente transparente
            bgcolor: 'transparent', // Fundo transparente
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)', // Efeito hover sutil
              color: 'rgba(255,255,255,1)', // Seta totalmente branca no hover
            },
            boxShadow: 'none', // Remove sombra
            width: { xs: '40px', md: '48px' },
            height: { xs: '40px', md: '48px' },
            transition: 'all 0.3s ease',
          }}
        >
          <ArrowForwardIosIcon fontSize="large" />
        </IconButton>

        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '0px', // Sem bordas arredondadas para tela cheia
          }}
        >
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
                  objectFit: { xs: 'fill', md: 'contain' }, // Fill no mobile para preencher a tela inteira (pode distorcer mas garante preenchimento sem cortes ou faixas)
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
