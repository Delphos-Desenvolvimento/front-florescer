import { Container, Typography, Box, Grid, Card, CardContent, Button, CircularProgress, Alert } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ArrowRight, BarChart2, Users, Shield, Zap, Clock, Award, TrendingUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { getAboutSection, getStatistics, getSolutions, type AboutSection as AboutSectionType, type Statistic, type Solution } from '../../API/content';

// Definição de tipos para os props
interface StatItemProps {
  value: string;
  label: string;
  icon: React.ElementType;
}

// Componente de estatística
const StatItem = ({ value, label, icon: Icon }: StatItemProps) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <div style={{ height: '100%' }}>
        <Box
          sx={{
            textAlign: 'center',
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '&:hover': {
              '& .stat-icon': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 25px rgba(41, 121, 255, 0.2)',
              },
            },
          }}
        >
          <Box
            className="stat-icon"
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              transition: 'all 0.3s ease',
              '& svg': {
                color: 'primary.main',
                width: 36,
                height: 36,
              },
            }}
          >
            <Icon />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 1.5,
              background: 'linear-gradient(90deg, #1a237e 0%, #2979ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              maxWidth: 250,
              mx: 'auto',
            }}
          >
            {label}
          </Typography>
        </Box>
      </div>
    </Grid>
  );
};

interface SolutionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

// Componente de solução
const SolutionCard = ({ title, description, icon: Icon }: SolutionCardProps) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <div>
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
              '& .solution-icon': {
                transform: 'scale(1.1)',
                boxShadow: '0 8px 20px rgba(26, 35, 126, 0.15)',
              },
              '& .solution-title': {
                color: 'primary.main',
              },
            },
          }}
        >
          <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Box
              className="solution-icon"
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
                  width: 28,
                  height: 28,
                  transition: 'all 0.3s ease',
                },
              }}
            >
              <Icon />
            </Box>
            <Typography
              className="solution-title"
              variant="h5"
              component="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                transition: 'color 0.3s ease',
              }}
            >
              {title}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                mb: 3,
                flexGrow: 1,
              }}
            >
              {description}
            </Typography>
            <Button
              component={RouterLink}
              to={`/solucoes/${title.toLowerCase().replace(/\s+/g, '-')}`}
              endIcon={<ArrowRight size={18} />}
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
              Saiba mais
            </Button>
          </CardContent>
        </Card>
      </div>
    </Grid>
  );
};

function About() {
  const [aboutData, setAboutData] = useState<AboutSectionType | null>(null);
  const [stats, setStats] = useState<Statistic[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [aboutResponse, statsResponse, solutionsResponse] = await Promise.all([
          getAboutSection(),
          getStatistics(),
          getSolutions(),
        ]);
        setAboutData(aboutResponse);
        setStats(statsResponse);
        setSolutions(solutionsResponse);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar conteúdo:', err);
        setError('Não foi possível carregar o conteúdo. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;
    const hash = location.hash.replace('#', '');
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash, loading]);

  // Mapeamento de ícones lucide-react
  const iconMap: Record<string, React.ElementType> = {
    Users,
    TrendingUp,
    Shield,
    Clock,
    BarChart2,
    Award,
    Zap,
  };

  const getIcon = (iconName: string, iconType: string): React.ElementType => {
    if (iconType === 'lucide' && iconMap[iconName]) {
      return iconMap[iconName];
    }
    // Para imagens, retornar um componente que renderiza a imagem
    return () => <img src={iconName} alt="" style={{ width: 36, height: 36 }} />;
  };

  const splitIntoParagraphs = (text?: string): string[] => {
    const raw = (text || '').trim();
    if (!raw) return [];
    const byNewline = raw.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    if (byNewline.length > 1) return byNewline;
    const sentences = raw.split(/(?<=\.)\s+(?=[A-ZÁÉÍÓÚÃÕÇ])/);
    const paras: string[] = [];
    for (let i = 0; i < sentences.length; i += 2) {
      paras.push(sentences.slice(i, i + 2).join(' '));
    }
    return paras.length ? paras : [raw];
  };

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
        pt: { xs: 6, md: 8 },
        pb: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
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
        {/* Seção Sobre Nós */}
        <Box id="sobre" sx={{ mb: { xs: 8, md: 12 }, scrollMarginTop: '80px' }}>
          <div>
            <Box
              sx={{
                textAlign: 'center',
                maxWidth: { xs: 900, md: 1100 },
                mx: 'auto',
                mb: { xs: 6, md: 8 },
              }}
            >
              <Typography
                variant="overline"
                color="primary"
                sx={{
                  display: 'block',
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  mb: 2,
                  fontSize: '0.9rem',
                }}
              >
                {aboutData?.overline || 'Sobre Nós'}
              </Typography>
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
                {aboutData?.title || 'A Contab é líder em tecnologia para gestão pública'}
              </Typography>
              <Box sx={{ maxWidth: { xs: 900, md: 1100 }, mx: 'auto' }}>
                {splitIntoParagraphs(aboutData?.subtitle || 'Somos a evolução da gestão pública, com soluções inovadoras.').map((p, idx) => (
                  <Typography
                    key={idx}
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '1.05rem', md: '1.15rem' },
                      lineHeight: 1.9,
                      textAlign: 'justify',
                      letterSpacing: '0.01em',
                      wordBreak: 'break-word',
                      mb: 2,
                    }}
                  >
                    {p}
                  </Typography>
                ))}
              </Box>
            </Box>
          </div>

          {/* Estatísticas */}
          <Grid container spacing={2} justifyContent="center">
            {stats.map((stat) => (
              <StatItem
                key={stat.id}
                value={stat.value}
                label={stat.label}
                icon={getIcon(stat.icon, stat.iconType)}
              />
            ))}
          </Grid>
          
          {/* Botão Nossa Equipe */}
          <Box sx={{ textAlign: 'center', mt: 6, mb: 6 }}>
            <Button
              component={RouterLink}
              to="/equipe"
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowRight size={20} />}
              sx={{
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1.1rem',
                boxShadow: '0 4px 14px rgba(26, 35, 126, 0.2)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(26, 35, 126, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Conheça Nossa Equipe
            </Button>
          </Box>
        </Box>

        {/* Seção Nossas Soluções */}
        <Box id="solucoes" sx={{
          mb: { xs: 8, md: 12 },
          scrollMarginTop: '80px'
        }}>
          <div>
            <Box
              sx={{
                textAlign: 'center',
                maxWidth: { xs: 900, md: 1100 },
                mx: 'auto',
                mb: { xs: 6, md: 8 },
              }}
            >
              <Typography
                variant="overline"
                color="primary"
                sx={{
                  display: 'block',
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  mb: 2,
                  fontSize: '0.9rem',
                }}
              >
                {aboutData?.solutionsOverline || 'Nossas Soluções'}
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  lineHeight: 1.2,
                }}
              >
                {aboutData?.solutionsTitle || 'Transforme sua gestão com nossas soluções inteligentes'}
              </Typography>
              <Box sx={{ maxWidth: { xs: 900, md: 1100 }, mx: 'auto' }}>
                {splitIntoParagraphs(aboutData?.solutionsSubtitle || 'Oferecemos um ecossistema completo de soluções em nuvem para modernizar e otimizar todos os processos da gestão pública.').map((p, idx) => (
                  <Typography
                    key={idx}
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '1.05rem', md: '1.15rem' },
                      lineHeight: 1.9,
                      textAlign: 'justify',
                      letterSpacing: '0.01em',
                      wordBreak: 'break-word',
                      mb: 2,
                    }}
                  >
                    {p}
                  </Typography>
                ))}
              </Box>
            </Box>
          </div>

          <Grid container spacing={4}>
            {solutions.map((solution) => (
              <SolutionCard
                key={solution.id}
                title={solution.title}
                description={solution.description}
                icon={getIcon(solution.icon, solution.iconType)}
              />
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default About;
