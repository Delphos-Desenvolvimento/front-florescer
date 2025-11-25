import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import NewsService from '../../API/news';
import type { NewsItem } from '../../API/news';

function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const newsData = await NewsService.getById(parseInt(id));
        setNews(newsData);
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
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

  const mainImage = news.images && news.images.length > 0
    ? news.images[0].base64.startsWith('data:')
      ? news.images[0].base64
      : `data:image/jpeg;base64,${news.images[0].base64}`
    : `https://picsum.photos/1200/600?random=${id}`;

  return (
    <Box sx={{ py: { xs: 4, sm: 6, md: 8 }, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Button
          component={RouterLink}
          to="/noticias"
          startIcon={<ArrowLeft size={20} />}
          sx={{ mb: 3, textTransform: 'none' }}
        >
          Voltar para notícias
        </Button>

        <article>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={2}
            >
              {news.date || 'Sem data'} • {news.category || 'Geral'}
            </Typography>

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
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
              maxWidth: '600px',
              mx: 'auto',
              backgroundColor: '#000',
              '&::before': {
                content: '""',
                display: 'block',
                paddingTop: '100%',
              },
              '& img': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }
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
      </Container>
    </Box>
  );
}

export default NewsDetailPage;
