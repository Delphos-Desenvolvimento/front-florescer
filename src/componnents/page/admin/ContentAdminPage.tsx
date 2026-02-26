import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, Tabs, Tab, Alert, CircularProgress, Divider } from '@mui/material';
import { getAboutSection, updateAboutSection } from '../../../API/content';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Removido: mapeamento de ícones (não utilizado)

const ContentAdminPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // About Section State
  const [aboutForm, setAboutForm] = useState({
    overline: '',
    title: '',
    subtitle: '',
  });

  // Removido: estado e opções de Estatísticas

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const about = await getAboutSection();
      setAboutForm({
        overline: about.overline,
        title: about.title,
        subtitle: about.subtitle,
      });
    } catch {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAbout = async () => {
    try {
      await updateAboutSection(aboutForm);
      setSuccess('Conteúdo atualizado com sucesso!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Erro ao atualizar conteúdo');
    }
  };

  // Removido: handlers de Estatísticas

  // Removido: salvar Estatísticas

  // Removido: delete de Estatísticas

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}
      >
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
            Gerenciar Conteúdo
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

          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Sobre" />
          </Tabs>

          {/* Tab Sobre */}
          <TabPanel value={tabValue} index={0}>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                Seção "Sobre"
              </Typography>
              <TextField
                label="Overline"
                value={aboutForm.overline}
                onChange={(e) => setAboutForm({ ...aboutForm, overline: e.target.value })}
                fullWidth
              />
              <TextField
                label="Título"
                value={aboutForm.title}
                onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Subtítulo"
                value={aboutForm.subtitle}
                onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })}
                fullWidth
                multiline
                rows={4}
                required
              />

              <Divider sx={{ my: 2 }} />

              <Button variant="contained" onClick={handleSaveAbout} size="large">
                Salvar Todas as Alterações
              </Button>
            </Box>
          </TabPanel>

          {/* Tab Estatísticas */}
          <TabPanel value={tabValue} index={1}>
          </TabPanel>

        </Paper>

        {/* Removido: Dialog Estatística */}

      </Container>
    </Box>
  );
};

export default ContentAdminPage;
