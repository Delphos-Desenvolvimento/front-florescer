import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  Menu,
  MenuItem,
  alpha,
  styled
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Phone, Link as LinkIcon } from 'lucide-react';

// Componente simplificado sem efeito de scroll

// Estilo personalizado para o AppBar
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  backdropFilter: 'saturate(180%) blur(8px)',
  '& .MuiToolbar-root': {
    minHeight: '75px',
    padding: theme.spacing(0, 2),
    [theme.breakpoints.up('md')]: {
      minHeight: '85px',
      padding: theme.spacing(0, 3),
    },
  },
}));

// Estilo para os itens do menu
const MenuButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  color:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.light, 0.9)
      : theme.palette.text.primary,
  padding: '16px 32px',
  transition: 'color 0.2s ease',
  '&:hover': {
    color:
      theme.palette.mode === 'dark'
        ? theme.palette.primary.main
        : theme.palette.primary.main,
    backgroundColor: 'transparent',
  },
  '&.active': {
    color:
      theme.palette.mode === 'dark'
        ? theme.palette.primary.main
        : theme.palette.primary.main,
  },
}));

// Função para rolagem suave
const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
  e.preventDefault();
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  } else {
    // Se o elemento não for encontrado, navega para a rota
    window.location.href = `/${sectionId}`;
  }
};

// Itens do menu principal
const menuItems = [
  {
    title: 'Home',
    path: '/',
    onClick: (e: React.MouseEvent) => scrollToSection(e, '')
  },
  {
    title: 'Notícias',
    path: '/noticias',
    onClick: (e: React.MouseEvent) => scrollToSection(e, 'noticias')
  },
  {
    title: 'Sobre',
    path: '/#sobre',
    onClick: (e: React.MouseEvent) => scrollToSection(e, 'sobre')
  },
  {
    title: 'Soluções',
    path: '/#solucoes',
    onClick: (e: React.MouseEvent) => scrollToSection(e, 'solucoes'),
    submenu: [
      {
        title: 'Prefeitura e Gestão',
        path: '/solucoes/prefeitura',
        onClick: (event: React.MouseEvent) => scrollToSection(event, 'solucoes')
      },
      {
        title: 'Saúde',
        path: '/solucoes/saude',
        onClick: (event: React.MouseEvent) => scrollToSection(event, 'solucoes')
      },
      {
        title: 'Educação',
        path: '/solucoes/educacao',
        onClick: (event: React.MouseEvent) => scrollToSection(event, 'solucoes')
      },
    ],
  },
];

// Menu móvel removido - não está sendo utilizado

// Componente principal do Header
function Header() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Detectar direção do scroll para esconder/mostrar header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Mostrar header quando estiver no topo
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Esconder quando rolar para baixo, mostrar quando rolar para cima
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Fechar menu mobile ao mudar de rota
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="fixed" sx={{
      transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(0)'
      },
      zIndex: theme.zIndex.drawer + 1
    }}
    >
      <Container maxWidth={false} disableGutters>
        <Toolbar disableGutters>
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            <Box
              component={RouterLink}
              to="/"
              sx={{
                minWidth: 110,
                textAlign: 'left',
                color: 'inherit',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src="/images/Logo_sem_fundo_Contab_2[1].png"
                alt="Logo"
                sx={(theme) => ({
                  height: { xs: 50, md: 65 },
                  width: 'auto',
                  objectFit: 'contain',
                  filter:
                    theme.palette.mode === 'dark'
                      ? 'drop-shadow(0 2px 8px rgba(255,255,255,0.25)) brightness(1.15) contrast(1.05)'
                      : 'none',
                })}
              />
            </Box>
          </Box>

          {/* Menu Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {menuItems.map((item) => (
              <div key={item.title}>
                {item.submenu ? (
                  <>
                    <MenuButton
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        if (item.onClick) {
                          item.onClick(e);
                        }
                        handleMenuOpen(e);
                      }}
                      className={location.pathname.startsWith(item.path.replace('/#', '/')) ? 'active' : ''}
                    >
                      {item.title}
                    </MenuButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && item.submenu?.some(sub => sub.title === item.title)}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      PaperProps={{
                        elevation: 3,
                        sx: {
                          mt: 1.5,
                          minWidth: 240,
                          borderRadius: 2,
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          overflow: 'hidden',
                        },
                      }}
                    >
                      {item.submenu?.map((subItem) => (
                        <MenuItem
                          key={subItem.title}
                          component={RouterLink}
                          to={subItem.path}
                          onClick={handleMenuClose}
                          sx={{
                            py: 1.5,
                            px: 2.5,
                            color: location.pathname === subItem.path ? 'primary.main' : 'text.primary',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: 'primary.main',
                                opacity: location.pathname === subItem.path ? 1 : 0,
                                mr: 1.5,
                                transition: 'all 0.2s ease',
                              }}
                            />
                            <Typography variant="body2" fontWeight={500}>
                              {subItem.title}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                ) : (
                  <Box
                    component="a"
                    href={item.path}
                    onClick={item.onClick}
                    sx={{ textDecoration: 'none' }}
                  >
                    <MenuButton
                      className={location.pathname === item.path.replace('/#', '/') ? 'active' : ''}
                    >
                      {item.title}
                    </MenuButton>
                  </Box>
                )}
              </div>
            ))}

            {/* Botões de ação */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 1, md: 2 } }}>
              <Button
                component={RouterLink}
                to="/links-uteis"
                variant="outlined"
                startIcon={<LinkIcon size={14} />}
                sx={{
                  ml: 1,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  px: 2.5,
                  py: 1,
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(41, 121, 255, 0.2)',
                  },
                }}
              >
                Links Úteis
              </Button>
              <Button
                onClick={(e) => scrollToSection(e, 'contato')}
                variant="outlined"
                startIcon={<Phone size={14} />}
                sx={{
                  ml: 1,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  px: 2.5,
                  py: 1,
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(41, 121, 255, 0.2)',
                  },
                }}
              >
                Contato
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </Container>

      {/* Menu Mobile */}
      <Box
        sx={{
          position: 'fixed',
          top: 70,
          left: 0,
          right: 0,
          backgroundColor: 'background.paper',
          boxShadow: 3,
          zIndex: 1100,
          maxHeight: mobileOpen ? 'calc(100vh - 70px)' : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out',
        }}
      >
        <Box sx={{ p: 2 }}>
          {menuItems.map((item) => (
            <Button
              key={item.title}
              component={RouterLink}
              to={item.path}
              onClick={item.onClick}
              variant="text"
              color="inherit"
              sx={{
                mx: 1,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >{item.title}
            </Button>
          ))}
        </Box>
      </Box>
    </StyledAppBar>
  );
}

export default Header;
