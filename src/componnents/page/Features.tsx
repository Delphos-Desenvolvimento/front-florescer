import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PublicIcon from '@mui/icons-material/Public';

const features = [
  {
    title: 'Gestão Escolar Completa',
    description: 'Organização de turmas, controle de frequência e avaliações de forma integrada e simples.',
    icon: <SchoolIcon />,
    color: '#1a237e'
  },
  {
    title: 'Inteligência Artificial',
    description: 'Avaliação de leitura com análise avançada de fluência, pronúncia e compreensão textual.',
    icon: <PsychologyIcon />,
    color: '#2979ff'
  },
  {
    title: 'Gamificação',
    description: 'Engajamento dos alunos através de elementos lúdicos que tornam o aprendizado mais divertido.',
    icon: <EmojiEventsIcon />,
    color: '#ff6d00'
  },
  {
    title: 'Automação Inteligente',
    description: 'Correção automática de avaliações objetivas, otimizando o tempo precioso dos professores.',
    icon: <AutoFixHighIcon />,
    color: '#00c853'
  },
  {
    title: 'Decisões Baseadas em Dados',
    description: 'Relatórios detalhados e dashboards intuitivos para apoio à tomada de decisão pedagógica.',
    icon: <AssessmentIcon />,
    color: '#6200ea'
  },
  {
    title: 'Foco na Educação Brasileira',
    description: 'Metodologia e recursos totalmente adaptados à realidade e necessidades das escolas brasileiras.',
    icon: <PublicIcon />,
    color: '#c51162'
  }
];

function Features() {
  return (
    <Box
      id="recursos"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#ffffff',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: '#1a237e'
            }}
          >
            Principais Recursos
          </Typography>
          <Box
            sx={{
              width: 80,
              height: 4,
              backgroundColor: 'primary.main',
              borderRadius: 2,
              mx: 'auto',
              mb: 3
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              fontWeight: 400
            }}
          >
            Tecnologia e inovação para transformar o dia a dia da sua escola
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                    borderColor: 'transparent',
                    '& .icon-box': {
                      backgroundColor: feature.color,
                      color: 'white',
                    }
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
                  <Box
                    className="icon-box"
                    sx={{
                      width: { xs: 64, md: 80 }, // Menor no mobile
                      height: { xs: 64, md: 80 }, // Menor no mobile
                      borderRadius: '50%',
                      backgroundColor: `${feature.color}15`, // 15 is roughly 8% opacity in hex
                      color: feature.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: { xs: 2, md: 3 }, // Menos margem no mobile
                      transition: 'all 0.3s ease-in-out',
                      '& svg': {
                        fontSize: { xs: 32, md: 40 } // Ícone ajusta tamanho
                      }
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2,
                      fontSize: { xs: '1.25rem', md: '1.5rem' } // Ajuste de fonte do título
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Features;
