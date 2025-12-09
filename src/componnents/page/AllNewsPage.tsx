import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  TextField,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import NewsService from '../../API/news';
import type { NewsItem, NewsImage } from '../../API/news';

// Extendendo a interface para incluir a descrição que é usada no frontend
interface ExtendedNewsItem extends Omit<NewsItem, 'content' | 'id'> {
  id: number;
  description: string;
  content?: string;
}

// Função para remover tags HTML e retornar texto limpo
const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// Componente de notícia individual
const NewsCard = ({
  id,
  title,
  description,
  date,
  category,
  images,
  onClick
}: {
  id: number;
  title: string;
  description: string;
  date?: string;
  category?: string;
  images?: NewsImage[];
  onClick: () => void;
}) => {
  const base64 = images && images.length > 0 ? images[0].base64 : undefined;
  const src = base64
    ? (base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`)
    : undefined;

  return (
    <Grid item xs={12} sm={6} md={4} lg={4} sx={{ px: { xs: 1, sm: 2 }, mb: 4 }}>
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
                boxShadow: 6
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
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
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
                  height: { xs: '2.6em', sm: '2.6em' },
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
                  height: { xs: '4.5em', sm: '4.5em' },
                  flexGrow: 0,
                }}
              >
                {stripHtml(description)}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                <Chip label={category || 'Geral'} size="small" color="primary" variant="outlined" />
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
                    }
                  }}
                >
                  Ler mais
                </Button>
              </Box>
            </Box>
          </Box>
        </div>
      </div>
    </Grid>
  );
};

function AllNewsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [news, setNews] = useState<ExtendedNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [sort, setSort] = useState<'recent' | 'oldest' | 'views'>('recent');
  const [page, setPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const newsData = await NewsService.getAll({ status: 'publicada' });
        const formattedNews = newsData.map(item => ({
          id: item.id || 0,
          title: item.title,
          description: item.content?.substring(0, 200) + (item.content?.length > 200 ? '...' : '') || '',
          content: item.content || '',
          date: item.date || new Date().toISOString().split('T')[0],
          category: item.category || 'Geral',
          status: item.status || 'publicada',
          views: item.views || 0,
          images: item.images || []
        } as ExtendedNewsItem));
        setNews(formattedNews);
      } catch (err) {
        console.error('Erro ao buscar notícias:', err);
        setError('Não foi possível carregar as notícias. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const categories = Array.from(new Set(['Todas', ...news.map(n => n.category || 'Geral')])).filter(cat => cat !== 'Notícia' && cat !== 'Todas');

  const filtered = news.filter(n => {
    const matchesCategory = selectedCategory === 'Todas' || (n.category || 'Geral') === selectedCategory;
    const q = search.trim().toLowerCase();
    const matchesSearch = q.length === 0 || `${n.title} ${n.description}`.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'views') return (b.views || 0) - (a.views || 0);
    const da = new Date(a.date || 0).getTime();
    const db = new Date(b.date || 0).getTime();
    return sort === 'recent' ? db - da : da - db;
  });

  const visible = sorted.slice(0, page * pageSize);

  const handleNewsClick = (item: ExtendedNewsItem) => {
    navigate(`/noticia/${item.id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pt: { xs: 12, sm: 14, md: 16 }, pb: { xs: 4, sm: 6, md: 8 }, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowLeft size={20} />}
          sx={{ mb: 3, textTransform: 'none' }}
        >
          Voltar para a página inicial
        </Button>

        <Typography
          variant="h3"
          component="h1"
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
              borderRadius: '2px'
            }
          }}
        >
          Todas as Notícias
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            label="Buscar"
            placeholder="Digite para buscar por título ou descrição"
          />
          <Stack direction={'row'} spacing={1} sx={{ flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => { setSelectedCategory(cat); setPage(1); }}
                color={selectedCategory === cat ? 'primary' : 'default'}
                variant={selectedCategory === cat ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="sort-label">Ordenar por</InputLabel>
            <Select
              labelId="sort-label"
              label="Ordenar por"
              value={sort}
              onChange={(e: SelectChangeEvent) => { setSort(e.target.value as 'recent' | 'oldest' | 'views'); setPage(1); }}
            >
              <MenuItem value="recent">Mais recentes</MenuItem>
              <MenuItem value="oldest">Mais antigos</MenuItem>
              <MenuItem value="views">Mais vistos</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {visible.length > 0 ? (
            visible.map((item) => (
              <NewsCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                date={item.date}
                category={item.category}
                images={item.images}
                onClick={() => handleNewsClick(item)}
              />
            ))
          ) : (
            <Box width="100%" textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                Nenhuma notícia encontrada.
              </Typography>
            </Box>
          )}
        </Grid>
        {visible.length < sorted.length && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="contained" onClick={() => setPage(p => p + 1)}>
              Carregar mais
            </Button>
          </Box>
        )}
      </Container>

    </Box>
  );
}

export default AllNewsPage;
