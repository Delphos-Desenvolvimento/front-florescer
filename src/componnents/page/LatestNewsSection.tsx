import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import NewsService from '../../API/news';
import type { NewsItem, NewsImage } from '../../API/news';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

// Função para remover tags HTML e retornar texto limpo
const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// Componente de notícia individual (adaptado do AllNewsPage.tsx)
const NewsCard = ({
  id,
  title,
  description,
  date,
  images,
  onClick,
}: {
  id: number;
  title: string;
  description: string;
  date?: string;
  images?: NewsImage[];
  onClick: () => void;
}) => {
  const base64 = images && images.length > 0 ? images[0].base64 : undefined;
  const src = base64
    ? base64.startsWith('data:')
      ? base64
      : `data:image/jpeg;base64,${base64}`
    : undefined;

  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <div style={{ height: '100%' }}>
        <div onClick={onClick} style={{ cursor: 'pointer', height: '100%' }}>
          <Box
            sx={{
              height: '100%',
              minHeight: { xs: 420, sm: 450, md: 480 },
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6,
              },
              backgroundColor: 'background.paper',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: { xs: 180, sm: 200, md: 220 },
                flexShrink: 0,
                backgroundImage: `url(${src || `https://picsum.photos/600/400?random=${id}`})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={1}
                sx={{
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
              >
                {date ? format(new Date(date), 'dd/MM/yyyy') : 'Sem data'}
              </Typography>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.3,
                  mb: { xs: 1, sm: 1.5 },
                  fontWeight: 600,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  mb: 2,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  lineHeight: 1.6,
                  flexGrow: 0,
                }}
              >
                {stripHtml(description)}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 'auto',
                }}
              >
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    p: 0,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Notícia
                </Button>
                <ArrowRight size={20} color="primary" />
              </Box>
            </Box>
          </Box>
        </div>
      </div>
    </Grid>
  );
};

function LatestNewsSection() {
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        const newsData = await NewsService.getAll({ status: 'publicada' });
        const sortedNews = (newsData || [])
          .filter((n) => (n.status || '').toLowerCase() === 'publicada')
          .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
          .slice(0, 3);
        setLatestNews(sortedNews);
      } catch (err) {
        console.error('Erro ao buscar últimas notícias do backend:', err);
        setError('Não foi possível carregar as últimas notícias no momento.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  const handleNewsClick = (item: NewsItem) => {
    navigate(`/noticia/${item.id}`);
  };

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', py: 4 }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (latestNews.length === 0) {
    return (
      <Box
        sx={{
          py: { xs: 4, sm: 6, md: 8 },
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            mb={4}
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.5rem' },
              fontWeight: 700,
              color: 'primary.main',
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                width: '80px',
                height: '4px',
                backgroundColor: 'primary.main',
                margin: '16px auto 0',
                borderRadius: '2px',
              },
            }}
          >
            Últimas Notícias
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Nenhuma notícia publicada ainda. Volte mais tarde ou acesse a página de notícias.
          </Alert>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              component={RouterLink}
              to="/noticias"
              variant="outlined"
              endIcon={<ArrowRight size={20} />}
              sx={{ textTransform: 'none' }}
            >
              Ver todas as notícias
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 4, sm: 6, md: 8 },
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          mb={6}
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.5rem' },
            fontWeight: 700,
            color: 'primary.main',
            position: 'relative',
            '&:after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              backgroundColor: 'primary.main',
              margin: '16px auto 0',
              borderRadius: '2px',
            },
          }}
        >
          Últimas Notícias
        </Typography>

        <Grid container spacing={4}>
          {latestNews.map((item) => (
            <NewsCard
              key={item.id}
              id={item.id || 0}
              title={item.title}
              description={stripHtml(item.content || '').substring(0, 200) + (stripHtml(item.content || '').length > 200 ? '...' : '')}
              date={item.date}
              images={item.images}
              onClick={() => handleNewsClick(item)}
            />
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button
            component={RouterLink}
            to="/noticias"
            variant="outlined"
            endIcon={<ArrowRight size={20} />}
            sx={{ textTransform: 'none' }}
          >
            Ver todas as notícias
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default LatestNewsSection;
