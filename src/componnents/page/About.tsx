import { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Skeleton } from '@mui/material';
import { getAboutSection } from '../../API/content';

interface AboutData {
  title: string;
  subtitle: string;
  overline?: string;
}

function About() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAboutSection()
      .then((res) => setData(res))
      .catch(() =>
        setData({
          title: 'Sobre o Projeto Florescer',
          subtitle: [
            'O Projeto Florescer é uma solução educacional estratégica voltada ao fortalecimento da gestão pedagógica nas redes de ensino, promovendo decisões baseadas em evidências e foco na aprendizagem dos estudantes.',
            '',
            'A plataforma permite monitorar o desempenho dos estudantes, organizar turmas, acompanhar frequência e avaliações, além de gerar indicadores que orientam ações de recomposição e intervenção pedagógica.',
          ].join('\n'),
        })
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box
      id="sobre"
      component="section"
      sx={{
        py: { xs: 6, md: 12 },
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          {data?.overline && (
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, display: 'block', mb: 1 }}
            >
              {data.overline}
            </Typography>
          )}
          {loading ? (
            <Skeleton variant="text" width={400} height={60} sx={{ mx: 'auto' }} />
          ) : (
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.75rem', md: '3rem' },
                mb: 2,
                background: 'linear-gradient(90deg, #1a237e 0%, #2979ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {data?.title ?? 'Sobre o Projeto Florescer'}
            </Typography>
          )}
          <Box
            sx={{
              width: 80,
              height: 4,
              backgroundColor: 'primary.main',
              borderRadius: 2,
              mx: 'auto',
            }}
          />
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            backgroundColor: 'white',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          }}
        >
          {loading ? (
            <>
              <Skeleton variant="text" sx={{ mb: 1 }} />
              <Skeleton variant="text" sx={{ mb: 1 }} />
              <Skeleton variant="text" sx={{ mb: 1 }} width="85%" />
              <Skeleton variant="text" sx={{ mt: 2, mb: 1 }} />
              <Skeleton variant="text" sx={{ mb: 1 }} />
              <Skeleton variant="text" width="75%" />
            </>
          ) : (
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                color: 'text.secondary',
                textAlign: { xs: 'left', md: 'justify' },
                whiteSpace: 'pre-line',
              }}
            >
              {data?.subtitle ?? ''}
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default About;
