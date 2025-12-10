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
        const loadPartners = async () => {
            try {
                const activePartners = await PartnersService.getAll(true);
                setPartners(activePartners);
            } catch (error) {
                console.error('Erro ao carregar parceiros:', error);
            }
        };

        loadPartners();
    }, []);

    const handlePrevious = () => {
        const logosPerView = isMobile ? 2 : isTablet ? 3 : 5;
        const maxIndex = Math.max(0, partners.length - logosPerView);

        setCurrentIndex((prevIndex) => {
            if (prevIndex === 0) {
                return maxIndex; // Go to end
            }
            return prevIndex - 1;
        });
    };

    const handleNext = () => {
        const logosPerView = isMobile ? 2 : isTablet ? 3 : 5;
        const maxIndex = Math.max(0, partners.length - logosPerView);

        setCurrentIndex((prevIndex) => {
            if (prevIndex >= maxIndex) {
                return 0; // Go to start
            }
            return prevIndex + 1;
        });
    };

    if (partners.length === 0) {
        return null; // Don't show section if no partners
    }

    // Number of logos to show at once
    const logosPerView = isMobile ? 2 : isTablet ? 3 : 5;

    // Get visible partners - no repetition
    const getVisiblePartners = () => {
        const endIndex = Math.min(currentIndex + logosPerView, partners.length);
        return partners.slice(currentIndex, endIndex);
    };

    const visiblePartners = getVisiblePartners();

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
                            alignItems: 'center',
                            gap: { xs: 2, sm: 3, md: 4 },
                            px: { xs: 2, sm: 4 },
                            minHeight: '120px',
                            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        {visiblePartners.map((partner) => (
                            <Box
                                key={partner.id}
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    p: 2,
                                    backgroundColor: 'background.paper',
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                    animation: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '@keyframes fadeIn': {
                                        from: {
                                            opacity: 0,
                                            transform: 'translateX(30px)',
                                        },
                                        to: {
                                            opacity: 1,
                                            transform: 'translateX(0)',
                                        },
                                    },
                                    '&:hover': {
                                        boxShadow: 3,
                                        transform: 'translateY(-4px)',
                                    },
                                }}
                            >
                                <img
                                    src={
                                        partner.logoBase64.startsWith('data:')
                                            ? partner.logoBase64
                                            : `data:image/jpeg;base64,${partner.logoBase64}`
                                    }
                                    alt={partner.name}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '80px',
                                        objectFit: 'contain',
                                        filter: 'grayscale(100%)',
                                        transition: 'filter 0.4s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.filter = 'grayscale(0%)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.filter = 'grayscale(100%)';
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
