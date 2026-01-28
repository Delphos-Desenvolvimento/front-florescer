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
  styled,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Phone, LogIn, Menu as MenuIcon, X, ChevronRight } from 'lucide-react';

// Componente simplificado sem efeito de scroll

// Estilo personalizado para o AppBar
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  backdropFilter: 'saturate(180%) blur(8px)',
  '& .MuiToolbar-root': {
    minHeight: '50px',
    padding: theme.spacing(0, 2),
    [theme.breakpoints.up('md')]: {
      minHeight: '60px',
      padding: theme.spacing(0, 3),
    },
  },
}));

// Estilo unificado: botões brancos com texto azul
const MenuButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  padding: '10px 20px',
  backgroundColor: theme.palette.common.white,
  color: theme.palette.primary.main,
  transition: 'all 0.2s ease',
  boxShadow: 'none',
  outline: 'none',
  '&:focus,&:focus-visible': {
    outline: 'none',
    boxShadow: 'none',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 'none',
    backgroundColor: theme.palette.common.white,
  },
  '&.active': {
    color: theme.palette.primary.main,
    boxShadow: 'none',
  },
}));

// Menu móvel removido - não está sendo utilizado

// Menu móvel removido - não está sendo utilizado

// Definição da interface para os itens do menu
interface MenuItemType {
  title: string;
  path: string;
  onClick?: (e: React.MouseEvent) => void;
  submenu?: MenuItemType[];
}

// Componente principal do Header
function Header() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Fechar menu mobile ao mudar de rota
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (sectionId === '') {
      if (location.pathname === '/' && !location.hash) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 0);
      }
      return;
    }
    if (sectionId === 'noticias') {
      navigate('/noticias');
      return;
    }
    const element = document.getElementById(sectionId);
    if (element && location.pathname === '/') {
      const target =
        sectionId === 'sobre'
          ? (element.querySelector('h1') as HTMLElement) || element
          : sectionId === 'solucoes'
            ? (element.querySelector('h2') as HTMLElement) || element
            : element;
      const headerEl = document.querySelector('header');
      const headerH = headerEl ? (headerEl as HTMLElement).getBoundingClientRect().height : 80;
      const y = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      navigate('/#' + sectionId);
    }
  };

  const menuItems: MenuItemType[] = [
    {
      title: 'Home',
      path: '/',
      onClick: (e: React.MouseEvent) => scrollToSection(e, ''),
    },
    {
      title: 'Sobre',
      path: '/#sobre',
      onClick: (e: React.MouseEvent) => scrollToSection(e, 'sobre'),
    },
  ];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          component="img"
          src="/images/logo.png"
          alt="Logo"
          sx={{ height: 35, width: 'auto', objectFit: 'contain' }}
        />
        <IconButton onClick={handleDrawerToggle}>
          <X size={24} />
        </IconButton>
      </Box>
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item: MenuItemType) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              onClick={(e) => {
                if (item.onClick) item.onClick(e);
                handleDrawerToggle();
              }}
              sx={{
                py: 1.5,
                color:
                  location.pathname === item.path.replace('/#', '/')
                    ? 'primary.main'
                    : 'text.primary',
                bgcolor:
                  location.pathname === item.path.replace('/#', '/')
                    ? alpha(theme.palette.primary.main, 0.05)
                    : 'transparent',
              }}
            >
              <ListItemText primary={item.title} primaryTypographyProps={{ fontWeight: 600 }} />
              <ChevronRight size={16} color={theme.palette.text.secondary} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => {
              scrollToSection(e, 'contato');
              handleDrawerToggle();
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Phone size={20} color={theme.palette.primary.main} />
            </ListItemIcon>
            <ListItemText primary="Contato" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => (window.location.href = 'https://app.florescer.tec.br')}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogIn size={20} color={theme.palette.primary.main} />
            </ListItemIcon>
            <ListItemText primary="Login" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <StyledAppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
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
                src="/images/logo.png"
                alt="Logo"
                sx={(theme) => ({
                  height: { xs: 35, md: 45 },
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
                      className={
                        location.pathname.startsWith(item.path.replace('/#', '/')) ? 'active' : ''
                      }
                    >
                      {item.title}
                    </MenuButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={
                        Boolean(anchorEl) && item.submenu?.some((sub) => sub.title === item.title)
                      }
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
                            color:
                              location.pathname === subItem.path ? 'primary.main' : 'text.primary',
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
              <MenuButton
                onClick={(e) => scrollToSection(e, 'contato')}
                startIcon={<Phone size={14} />}
                sx={{ ml: 1, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
              >
                Contato
              </MenuButton>
              <MenuButton
                onClick={() => {
                  window.location.href = 'https://app.florescer.tec.br';
                }}
                startIcon={<LogIn size={14} />}
                sx={{ ml: 1, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
              >
                Login
              </MenuButton>
            </Box>
          </Box>
          {/* Menu Mobile Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ ml: 1, display: { md: 'none' }, color: 'primary.main' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </StyledAppBar>
  );
}

export default Header;
