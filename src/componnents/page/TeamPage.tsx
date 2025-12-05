import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { getTeamPage, type TeamPage as TeamPageType } from '../../API/team';

function TeamPage() {
    const [teamData, setTeamData] = useState<TeamPageType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getTeamPage();
                setTeamData(data);
                setError(null);
            } catch (err: any) {
                console.error('Erro ao carregar página da equipe:', err);
                if (err.response?.status === 404 || !err.response) {
                    setError('Página não encontrada ou ainda não foi publicada.');
                } else {
                    setError('Não foi possível carregar a página. Tente novamente mais tarde.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !teamData) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Alert severity="info">{error || 'Conteúdo não disponível'}</Alert>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                pt: { xs: 12, sm: 14, md: 16 },
                pb: { xs: 4, sm: 6, md: 8 },
                minHeight: '100vh',
                backgroundColor: '#f9f9f9',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: 2,
                        p: { xs: 3, sm: 4, md: 6 },
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                >
                    {/* Título */}
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            mb: 4,
                            color: 'primary.main',
                            fontSize: { xs: '2rem', md: '2.5rem' },
                        }}
                    >
                        {teamData.title}
                    </Typography>

                    {/* Conteúdo HTML */}
                    <Box
                        className="tiptap-content"
                        sx={{
                            '& h1': { fontSize: '2rem', fontWeight: 700, mb: 2, mt: 3 },
                            '& h2': { fontSize: '1.75rem', fontWeight: 700, mb: 2, mt: 3 },
                            '& h3': { fontSize: '1.5rem', fontWeight: 700, mb: 2, mt: 2 },
                            '& p': { fontSize: '1.1rem', lineHeight: 1.8, mb: 2 },
                            '& ul, & ol': { mb: 2, pl: 4 },
                            '& li': { fontSize: '1.1rem', lineHeight: 1.8, mb: 1 },
                            '& img': { maxWidth: '100%', height: 'auto', borderRadius: 1, my: 2 },
                            '& blockquote': {
                                borderLeft: '4px solid',
                                borderColor: 'primary.main',
                                pl: 2,
                                py: 1,
                                my: 2,
                                fontStyle: 'italic',
                                color: 'text.secondary',
                            },
                            '& code': {
                                backgroundColor: '#f5f5f5',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                            },
                            '& pre': {
                                backgroundColor: '#f5f5f5',
                                padding: 2,
                                borderRadius: 1,
                                overflow: 'auto',
                                my: 2,
                            },
                        }}
                        dangerouslySetInnerHTML={{ __html: teamData.content }}
                    />
                </Box>
            </Container>
        </Box>
    );
}

export default TeamPage;
