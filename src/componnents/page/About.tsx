import { Container, Typography, Box, Paper } from '@mui/material';

function About() {
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
            Sobre o Projeto Florescer
          </Typography>
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
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.8,
              color: 'text.secondary',
              textAlign: { xs: 'left', md: 'justify' }, // Melhor leitura no mobile
            }}
          >
            O Projeto Florescer é uma solução educacional estratégica voltada ao fortalecimento da
            gestão pedagógica nas redes de ensino, promovendo decisões baseadas em evidências e foco
            na aprendizagem dos estudantes. Sua metodologia articula tecnologia educacional,
            inteligência artificial, formação e práticas pedagógicas integradas.
            <br />
            <br />
            A plataforma permite monitorar o desempenho dos estudantes, organizar turmas, acompanhar
            frequência e avaliações, além de gerar indicadores que orientam ações de recomposição e
            intervenção pedagógica. A inteligência artificial aplicada à avaliação da leitura amplia
            a precisão diagnóstica ao analisar fluência, pronúncia e compreensão textual, enquanto a
            automatização dos processos avaliativos otimiza o trabalho docente e indica trilhas
            personalizadas conforme o perfil dos estudantes.
            <br />
            <br />
            Dessa forma, o Projeto Florescer contribui para a equidade das aprendizagens, a melhoria
            dos indicadores educacionais e a transformação das trajetórias escolares, assegurando
            bons resultados.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default About;
