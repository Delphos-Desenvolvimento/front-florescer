import { Container, Typography, Box, Paper } from '@mui/material';

function About() {
  return (
    <Box
      id="sobre"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
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
            p: { xs: 4, md: 6 },
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
              textAlign: 'justify',
            }}
          >
            O Projeto Florescer é uma metodologia inteligente desenvolvida para apoiar a gestão escolar e a tomada de decisões pedagógicas por meio da tecnologia. A solução integra inteligência artificial, gamificação e gestão educacional em um único ambiente digital. O sistema permite acompanhar o desempenho dos alunos, organizar turmas, controlar frequência e avaliações de forma simples e eficiente.
            <br /><br />
            Um de seus diferenciais é a utilização de inteligência artificial para avaliação de leitura, analisando fluência, pronúncia e compreensão textual. A plataforma também automatiza a correção de avaliações objetivas, otimizando o tempo dos professores.
            <br /><br />
            Com metodologia pedagógica própria e foco na realidade da educação brasileira, o Projeto Florescer promove aprendizado personalizado, engajamento dos alunos e gestão educacional baseada em dados confiáveis.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default About;
