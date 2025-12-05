import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import RichTextEditor from '../../common/RichTextEditor';
import { getTeamPageAdmin, updateTeamPage, type TeamPage } from '../../../API/team';

const TeamAdminPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [teamData, setTeamData] = useState<TeamPage | null>(null);
    const [title, setTitle] = useState('Nossa Equipe');
    const [content, setContent] = useState('');
    const [isPublished, setIsPublished] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getTeamPageAdmin();
            setTeamData(data);
            setTitle(data.title);
            setContent(data.content);
            setIsPublished(data.isPublished);
        } catch (err) {
            setError('Erro ao carregar dados da página');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setError('');
            await updateTeamPage({ title, content, isPublished });
            setSuccess('Página atualizada com sucesso!');
            loadData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Erro ao salvar página');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !teamData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
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
                <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h4" component="h1" fontWeight="bold" color="primary" sx={{ mb: 3 }}>
                        Gerenciar Página "Nossa Equipe"
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                            {success}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Título */}
                        <TextField
                            label="Título da Página"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                            required
                        />

                        {/* Editor de Conteúdo */}
                        <Box>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                                Conteúdo
                            </Typography>
                            <RichTextEditor content={content} onChange={setContent} />
                        </Box>

                        {/* Switch Publicar */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isPublished}
                                    onChange={(e) => setIsPublished(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body1" fontWeight={600}>
                                        {isPublished ? 'Página Publicada' : 'Página Não Publicada'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {isPublished
                                            ? 'A página está visível para o público'
                                            : 'A página está oculta do público'}
                                    </Typography>
                                </Box>
                            }
                        />

                        {/* Botão Salvar */}
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Save />}
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default TeamAdminPage;
