import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';
import { getPublicLinks, type Link } from '../../API/content';

const UsefulLinks: React.FC = () => {
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                setLoading(true);
                const data = await getPublicLinks();
                setLinks(data);
                setError(null);
            } catch (err) {
                console.error('Erro ao carregar links:', err);
                setError('Não foi possível carregar os links. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ py: 8 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                pt: { xs: 12, sm: 14, md: 16 },
                pb: { xs: 8, md: 12 },
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'background.default',
                minHeight: '100vh',
            }}
        >
            {/* Elemento decorativo */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '50%',
                    height: '100%',
                    background: 'radial-gradient(circle at top right, rgba(26, 35, 126, 0.03) 0%, transparent 60%)',
                    zIndex: -1,
                }}
            />

            <Container maxWidth="xl">
                {/* Cabeçalho */}
                <Box
                    sx={{
                        textAlign: 'center',
                        maxWidth: 800,
                        mx: 'auto',
                        mb: { xs: 6, md: 8 },
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            mb: 3,
                            fontSize: { xs: '2rem', md: '2.75rem' },
                            lineHeight: 1.2,
                        }}
                    >
                        Links Úteis
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{
                            fontWeight: 400,
                            fontSize: '1.2rem',
                            lineHeight: 1.7,
                        }}
                    >
                        Acesse rapidamente os principais recursos e ferramentas que você precisa
                    </Typography>
                </Box>

                {/* Grid de Links */}
                {links.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                            Nenhum link disponível no momento.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {links.map((link) => (
                            <Grid item xs={12} sm={6} md={4} key={link.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        border: 'none',
                                        borderRadius: 3,
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 15px 40px rgba(26, 35, 126, 0.15)',
                                            '& .link-icon': {
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                                transform: 'scale(1.1)',
                                            },
                                            '& .link-title': {
                                                color: 'primary.main',
                                            },
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        {link.imageBase64 ? (
                                            <Box
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: '16px',
                                                    mb: 3,
                                                    overflow: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'background.default',
                                                }}
                                            >
                                                <img
                                                    src={link.imageBase64}
                                                    alt={link.title}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            <Box
                                                className="link-icon"
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: '16px',
                                                    backgroundColor: 'primary.light',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mb: 3,
                                                    transition: 'all 0.3s ease',
                                                    '& svg': {
                                                        color: 'primary.main',
                                                        transition: 'all 0.3s ease',
                                                    },
                                                }}
                                            >
                                                <LinkIcon size={28} />
                                            </Box>
                                        )}
                                        <Typography
                                            className="link-title"
                                            variant="h5"
                                            component="h3"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 2,
                                                transition: 'color 0.3s ease',
                                            }}
                                        >
                                            {link.title}
                                        </Typography>
                                        {link.description && (
                                            <Typography
                                                color="text.secondary"
                                                sx={{
                                                    mb: 3,
                                                    flexGrow: 1,
                                                }}
                                            >
                                                {link.description}
                                            </Typography>
                                        )}
                                        <Button
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            endIcon={<ExternalLink size={18} />}
                                            sx={{
                                                alignSelf: 'flex-start',
                                                color: '#64b5f6',
                                                fontWeight: 600,
                                                p: 0,
                                                '&:hover': {
                                                    color: '#42a5f5',
                                                    backgroundColor: 'transparent',
                                                    '& .MuiButton-endIcon': {
                                                        transform: 'translateX(4px)',
                                                    },
                                                },
                                            }}
                                        >
                                            Acessar
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default UsefulLinks;
