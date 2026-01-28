import { Box, Typography, Container, Grid, Link, Divider, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
// Ícones do Lucide React
import { MapPin, Phone, Mail, Clock, Facebook, Linkedin, Instagram } from 'lucide-react';

// Componente de link personalizado
const FooterLink = ({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href: string;
  onClick?: (e: React.MouseEvent) => void;
}) => (
  <Link
    component={RouterLink}
    to={href}
    onClick={onClick}
    variant="body2"
    sx={{
      color: 'rgba(255, 255, 255, 0.9)',
      display: 'block',
      mb: 1.5,
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      '&:hover': {
        color: '#64b5f6',
      },
    }}
  >
    {children}
  </Link>
);

// Componente de ícone de rede social
const SocialIcon = ({ icon: Icon, url }: { icon: React.ElementType; url: string }) => (
  <IconButton
    component="a"
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      '&:hover': {
        backgroundColor: 'primary.main',
        color: 'white',
        transform: 'translateY(-3px)',
        boxShadow: '0 5px 15px rgba(26, 35, 126, 0.3)',
      },
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}
  >
    <Icon size={18} />
  </IconButton>
);

// Componente de item de contato
const ContactItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      mb: 2.5,
      '& svg': {
        color: '#64b5f6',
        mt: 0.5,
        mr: 2,
        flexShrink: 0,
      },
    }}
  >
    {icon}
    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
      {text}
    </Typography>
  </Box>
);

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const footerLinks = [
    {
      title: 'Empresa',
      links: [
        { label: 'Sobre Nós', href: '/#sobre' },
        { label: 'Nossa Equipe', href: '/equipe' },
        { label: 'Depoimentos', href: '/depoimentos' },
        { label: 'Trabalhe Conosco', href: '/trabalhe-conosco' },
      ],
    },
    {
      title: 'Recursos',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Perguntas Frequentes', href: '/faq' },
        { label: 'Materiais Gratuitos', href: '/materiais' },
        { label: 'Planos e Preços', href: '/planos' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, url: 'https://facebook.com' },
    { icon: Instagram, url: 'https://instagram.com' },
    { icon: Linkedin, url: 'https://linkedin.com' },
  ];

  const contactInfo = [
    {
      icon: <MapPin size={18} />,
      text: 'Rua - Cidade - CEP',
    },
    {
      icon: <Phone size={18} />,
      text: '+55 86 9999-9999',
    },
    {
      icon: <Mail size={18} />,
      text: 'florescer@gmail.com',
    },
    {
      icon: <Clock size={18} />,
      text: 'Seg-Sex: 9h às 18h',
    },
  ];

  const scrollToSobre = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById('sobre');
      if (el) {
        const target = (el.querySelector('h1') as HTMLElement) || el;
        const headerEl = document.querySelector('header');
        const headerH = headerEl ? (headerEl as HTMLElement).getBoundingClientRect().height : 80;
        const y = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top: y, behavior: 'smooth' });
        return;
      }
    }
    navigate('/#sobre');
  };
  const scrollToSolucoes = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById('solucoes');
      if (el) {
        const target = (el.querySelector('h2') as HTMLElement) || el;
        const headerEl = document.querySelector('header');
        const headerH = headerEl ? (headerEl as HTMLElement).getBoundingClientRect().height : 80;
        const y = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top: y, behavior: 'smooth' });
        return;
      }
    }
    navigate('/#solucoes');
  };

  return (
    <Box
      component="footer"
      id="contato"
      sx={{
        backgroundColor: '#0a1929',
        color: 'rgba(255, 255, 255, 1)',
        pt: { xs: 6, md: 12 },
        pb: { xs: 4, md: 8 },
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #2979ff 0%, #00b0ff 100%)',
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Logo e descrição */}
          <Grid item xs={12} md={3}>
            <Box
              component="img"
              src="/images/Logo%20branca.png"
              alt="Contab"
              sx={{
                height: { xs: 70, md: 100 },
                width: 'auto',
                maxWidth: '245px',
                objectFit: 'contain',
                mb: 3,
              }}
            />
            <Typography
              variant="body2"
              color="rgba(255, 255, 255, 0.85)"
              sx={{
                mb: 3,
                lineHeight: 1.8,
                fontSize: { xs: '0.875rem', md: '0.9rem' },
              }}
            >
              O Projeto Florescer é uma metodologia inteligente desenvolvida para apoiar a gestão
              escolar e a tomada de decisões pedagógicas por meio da tecnologia.
            </Typography>
          </Grid>

          {/* Informações de Contato */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h6"
              sx={{
                color: '#64b5f6',
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '40px',
                  height: '3px',
                  background: '#64b5f6',
                  borderRadius: '2px',
                },
              }}
            >
              Contato
            </Typography>
            <Box sx={{ mt: 4 }}>
              {contactInfo.map((item, index) => (
                <ContactItem key={index} icon={item.icon} text={item.text} />
              ))}
            </Box>
          </Grid>

          {/* Links do rodapé */}
          {footerLinks.map((column, colIndex) => (
            <Grid item xs={6} sm={4} md={2} key={colIndex}>
              <Typography
                variant="h6"
                sx={{
                  color: '#64b5f6',
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '40px',
                    height: '3px',
                    background: '#64b5f6',
                    borderRadius: '2px',
                  },
                }}
              >
                {column.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 4 }}>
                {column.links.map((link, linkIndex) => (
                  <Box component="li" key={linkIndex}>
                    {link.href === '/equipe' ? (
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    ) : link.href === '/#sobre' ? (
                      <FooterLink href={link.href} onClick={scrollToSobre}>
                        {link.label}
                      </FooterLink>
                    ) : link.href === '/#solucoes' ? (
                      <FooterLink href={link.href} onClick={scrollToSolucoes}>
                        {link.label}
                      </FooterLink>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          mb: 1.5,
                        }}
                      >
                        {link.label}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: { xs: 4, md: 6 }, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Rodapé inferior */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr auto 1fr' },
            gap: 3,
            alignItems: 'center',
          }}
        >
          {/* Copyright */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', lg: 'flex-start' },
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}
            >
              © {new Date().getFullYear()}
            </Typography>
            <Box
              component="img"
              src="/images/Logo%20branca.png"
              alt="Contab"
              sx={{
                height: 18,
                width: 'auto',
                maxWidth: '70px',
                objectFit: 'contain',
                display: 'inline-block',
                verticalAlign: 'middle',
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}
            >
              - Todos os direitos reservados
            </Typography>
          </Box>

          {/* Redes Sociais */}
          <Box sx={{ display: 'flex', gap: { xs: 3, md: 1.5 }, justifyContent: 'center' }}>
            {socialLinks.map((social, index) => (
              <SocialIcon key={index} icon={social.icon} url={social.url} />
            ))}
          </Box>

          {/* Links legais removidos / Espaço vazio para equilíbrio */}
          <Box sx={{ display: { xs: 'none', lg: 'block' } }} />
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
