import { useState, useEffect } from 'react';
import { Box, Typography, Container, useTheme, useMediaQuery, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import PartnersService, { type Partner } from '../../API/partners';

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const nowIso = new Date().toISOString();
    const mockLogoA = '/images/logo.png';
    const mockLogoB = '/images/Captura%20de%20tela%202026-02-05%20174729.png';
    const mockPartners: Partner[] = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      name: `Parceiro ${index + 1}`,
      description: undefined,
      logoBase64: index % 2 === 0 ? mockLogoA : mockLogoB,
      displayOrder: index + 1,
      active: true,
      createdAt: nowIso,
      updatedAt: nowIso,
    }));

    const loadPartners = async () => {
      try {
        const activePartners = await PartnersService.getAll(true);
        setPartners(activePartners.length ? activePartners : mockPartners);
      } catch (error) {
        setPartners(mockPartners);
      }
    };

    loadPartners();
  }, []);

  const logosPerView = 4;

  const handlePrevious = () => {
    const maxIndex = Math.max(0, partners.length - logosPerView);

    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return maxIndex; // Go to end
      }
      return prevIndex - 1;
    });
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, partners.length - logosPerView);

    setCurrentIndex((prevIndex) => {
      if (prevIndex >= maxIndex) {
        return 0; // Go to start
      }
      return prevIndex + 1;
    });
  };

  useEffect(() => {
    const maxIndex = Math.max(0, partners.length - logosPerView);
    if (maxIndex === 0) return;
    const id = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
    }, 3500);
    return () => window.clearInterval(id);
  }, [logosPerView, partners.length]);

  // Get visible partners - no repetition
  const getVisiblePartners = () => {
    const endIndex = Math.min(currentIndex + logosPerView, partners.length);
    return partners.slice(currentIndex, endIndex);
  };

  const visiblePartners = getVisiblePartners();

  const getLogoSrc = (logoBase64: string) => {
    const value = (logoBase64 || '').trim();
    if (!value) return '';
    if (value.startsWith('data:')) return value;
    if (value.startsWith('/') || value.startsWith('http')) return value;
    return `data:image/jpeg;base64,${value}`;
  };

  return (
    <Box
      sx={{
        py: 8,
        backgroundColor: 'background.default',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 6,
            color: 'hsla(226, 100%, 29%, 1.00)',
          }}
        >
          Nossos Parceiros
        </Typography>

        <Box sx={{ position: 'relative' }}>
          {/* Navigation Arrows - only show if there are more partners than visible */}
          {partners.length > logosPerView && (
            <>
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: 'absolute',
                  left: { xs: -10, sm: -20 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  backgroundColor: 'background.paper',
                  boxShadow: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    boxShadow: 3,
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: { xs: -10, sm: -20 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  backgroundColor: 'background.paper',
                  boxShadow: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    boxShadow: 3,
                  },
                }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}

          {/* Partners Carousel */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: { xs: 3, sm: 4, md: 5 },
              px: { xs: 2, sm: 4 },
              minHeight: '200px',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {visiblePartners.map((partner) => (
              <Box
                key={partner.id}
                sx={{
                  width: { xs: 160, sm: 200, md: 220 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 1,
                  transition: 'transform 0.3s ease',
                }}
              >
                <img
                  src={getLogoSrc(partner.logoBase64)}
                  alt={partner.name}
                  style={{
                    maxWidth: '100%',
                    height: '110px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
