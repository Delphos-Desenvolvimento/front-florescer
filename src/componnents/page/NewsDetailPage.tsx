import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Grid,
  TextField,
  Divider,
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import NewsService from '../../API/news';
import type { NewsItem } from '../../API/news';

const MOCK_NEWS_ITEM: NewsItem = {
  id: 999,
  title: 'Notícia de Teste: Florescer Lança Nova Iniciativa!',
  content: `
      <p>É com grande entusiasmo que anunciamos o lançamento de uma nova iniciativa revolucionária da Florescer, focada em sustentabilidade e inovação tecnológica. Este projeto visa transformar a maneira como interagimos com o meio ambiente, utilizando inteligência artificial para otimizar recursos e promover práticas mais ecológicas.</p>
      <p>A iniciativa inclui o desenvolvimento de uma plataforma interativa que permitirá aos usuários monitorar seu impacto ambiental, receber dicas personalizadas para reduzir o consumo e participar de desafios comunitários. Além disso, teremos uma série de workshops e eventos educativos para engajar a comunidade e disseminar conhecimento sobre as melhores práticas de sustentabilidade.</p>
      <h2>Tecnologia a Serviço do Planeta</h2>
      <p>Nossa equipe de engenheiros e cientistas trabalhou incansavelmente para integrar as mais recentes tecnologias de IA e aprendizado de máquina. A plataforma será capaz de analisar dados em tempo real, prever tendências e oferecer soluções proativas para problemas ambientais. Acreditamos que a tecnologia, quando usada com responsabilidade, tem o poder de criar um futuro mais verde e próspero para todos.</p>
      <img src="https://picsum.photos/800/400?random=1" alt="Tecnologia e Natureza" />
      <h3>Como Participar?</h3>
      <p>Convidamos a todos a se juntarem a nós nesta jornada. A plataforma estará disponível para acesso público a partir do próximo mês. Fique atento às nossas redes sociais e ao nosso site para mais informações sobre como se registrar e começar a fazer a diferença.</p>
      <p>Juntos, podemos fazer a Florescer florescer ainda mais, construindo um legado de inovação e cuidado com o nosso planeta.</p>
    `,
  date: '2026-02-23T10:00:00Z',
  category: 'Sustentabilidade',
  status: 'publicada',
  views: 0,
  images: [
    {
      id: 1,
      base64: 'https://picsum.photos/1200/600?random=1',
      altText: 'Imagem de capa da notícia de teste',
    },
  ],
};

function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        let newsData: NewsItem | null = null;

        if (!id) {
          // Se não houver ID, usa a notícia mockada
          newsData = MOCK_NEWS_ITEM;
        } else {
          // Se houver ID, busca a notícia pelo ID
          newsData = await NewsService.getById(parseInt(id));
        }
        setNews(newsData);

        // Busca notícias recentes para a barra lateral
        const allNewsForSidebar = await NewsService.getAll({ status: 'publicada' });
        const filtered = allNewsForSidebar
          .filter((item) => item.id !== (newsData ? newsData.id : undefined)) // Filtra a notícia exibida
          .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
          .slice(0, 2);
        setRecentNews(filtered);
      } catch (err) {
        console.error('Erro ao buscar notícia:', err);
        setError('Não foi possível carregar a notícia. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !news) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Notícia não encontrada.'}
        </Alert>
        <Button
          component={RouterLink}
          to="/noticias"
          variant="outlined"
          startIcon={<ArrowLeft size={20} />}
        >
          Voltar para notícias
        </Button>
      </Container>
    );
  }

  const mainImage =
    news.images && news.images.length > 0
      ? news.images[0].base64.startsWith('data:')
        ? news.images[0].base64
        : `data:image/jpeg;base64,${news.images[0].base64}`
      : `https://picsum.photos/1200/600?random=${id}`;

  return (
    <Box
      sx={{
        pt: { xs: 12, sm: 14, md: 16 },
        pb: { xs: 4, sm: 6, md: 8 },
        backgroundColor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <article>
              <Box sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
                <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                  <span>{news.date || 'Sem data'}</span>
                  <Box
                    component="span"
                    sx={{
                      mx: 1,
                      display: 'inline-block',
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      bgcolor: 'text.disabled',
                      position: 'relative',
                      top: -1,
                    }}
                  />
                  <span>{news.category || 'Geral'}</span>
                </Typography>

                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb: 3,
                    color: 'text.primary',
                  }}
                >
                  {news.title}
                </Typography>
              </Box>

              <Box
                sx={{
                  mb: 6,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 3,
                  position: 'relative',
                  width: '100%',
                  maxWidth: '800px',
                  mx: 'auto',
                  backgroundColor: '#000',
                  '&::before': {
                    content: '""',
                    display: 'block',
                    paddingTop: '56.25%',
                  },
                  '& img': {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  },
                }}
              >
                <img
                  src={mainImage}
                  alt={news.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://picsum.photos/600/600?random=${id}`;
                  }}
                />
              </Box>

              <Box
                sx={{
                  maxWidth: '800px',
                  mx: 'auto',
                  '& p': {
                    mb: 3,
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    color: 'text.primary',
                  },
                  '& h2, & h3': {
                    mt: 6,
                    mb: 3,
                    color: 'primary.main',
                  },
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 2,
                    my: 4,
                    display: 'block',
                    mx: 'auto',
                  },
                  '& a': {
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  },
                }}
                dangerouslySetInnerHTML={{ __html: news.content || '' }}
              />
            </article>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              {/* Divider */}
              <Divider
                orientation="vertical"
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'absolute',
                  left: -16,
                  height: '100%',
                  borderColor: 'divider',
                }}
              />

              {/* Search Box */}
              <Box
                sx={{
                  mb: 3,
                  backgroundColor: 'background.paper',
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar..."
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: '0.875rem',
                        padding: '8px 12px',
                      },
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        navigate(`/noticias?search=${encodeURIComponent(searchQuery)}`);
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      fontSize: '0.75rem',
                      minWidth: 'auto',
                      px: 2,
                      whiteSpace: 'nowrap',
                    }}
                    onClick={() => {
                      if (searchQuery.trim()) {
                        navigate(`/noticias?search=${encodeURIComponent(searchQuery)}`);
                      }
                    }}
                  >
                    Pesquisar
                  </Button>
                </Box>
              </Box>

              {/* Recent News */}
              <Box
                sx={{ backgroundColor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: 'text.primary',
                  }}
                >
                  Notícias recentes
                </Typography>
                {recentNews.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      mb: 1.5,
                      pb: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': {
                        borderBottom: 'none',
                        mb: 0,
                        pb: 0,
                      },
                    }}
                  >
                    <Typography
                      component={RouterLink}
                      to={`/noticia/${item.id}`}
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        lineHeight: 1.5,
                        display: 'block',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Button
          component={RouterLink}
          to="/noticias"
          variant="outlined"
          startIcon={<ArrowLeft size={20} />}
          sx={{ textTransform: 'none' }}
        >
          Voltar para notícias
        </Button>
      </Container>

    </Box>
  );
}

export default NewsDetailPage;
