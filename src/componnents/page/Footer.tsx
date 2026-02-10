import { Box, Typography, Container, Grid, Divider, IconButton, Button } from '@mui/material';
// Ícones do Lucide React
import { MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react';

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
  const socialLinks = [
    { icon: Instagram, url: 'https://www.instagram.com/vm_educar' },
  ];

  const contactInfo = [
    {
      icon: <MapPin size={18} />,
      text: 'Rua Crescêncio Ferreira, 1237, Sala 3 Bairro Morada do Sol Teresina - PI CEP: 64.056-440',
    },
    {
      icon: <Phone size={18} />,
      text: '+55 86 9503-2521',
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

  return (
    <Box
      component="footer"
      id="contato"
      sx={{
        backgroundColor: '#0a1929',
        color: 'rgba(255, 255, 255, 1)',
        pt: { xs: 4, md: 7 },
        pb: { xs: 3, md: 5 },
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
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Logo e descrição */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/Logo%20branca.png"
              alt="Contab"
              sx={{
                height: { xs: 70, md: 100 },
                width: 'auto',
                maxWidth: '245px',
                objectFit: 'contain',
                mb: 2,
              }}
            />
            <Typography
              variant="body2"
              color="rgba(255, 255, 255, 0.85)"
              sx={{
                mb: 2,
                lineHeight: 1.8,
                fontSize: { xs: '0.875rem', md: '0.9rem' },
              }}
            >
              O Projeto Florescer é uma metodologia inteligente desenvolvida para apoiar a gestão
              escolar e a tomada de decisões pedagógicas por meio da tecnologia.
            </Typography>
          </Grid>

          {/* Informações de Contato */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Box sx={{ width: '100%', maxWidth: 520 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#64b5f6',
                  fontWeight: 700,
                  mb: 2,
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
              <Box sx={{ mt: 3 }}>
                {contactInfo.map((item, index) => (
                  <ContactItem key={index} icon={item.icon} text={item.text} />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: { xs: '100%', sm: '520px', md: '560px' },
                px: { xs: 0, md: 0 },
                py: { xs: 0, md: 0 },
                borderRadius: 0,
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                Ainda com alguma dúvida?
              </Typography>
              <Button
                component="a"
                href="https://api.whatsapp.com/send/?phone=995032521&text&type=phone_number&app_absent=0"
                variant="outlined"
                sx={{
                  bgcolor: 'white',
                  color: '#0d47a1',
                  fontWeight: 800,
                  borderRadius: 2,
                  px: 3,
                  py: 0.9,
                  boxShadow: 'none',
                  textTransform: 'none',
                  border: '2px solid #0d47a1',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.92)',
                    border: '2px solid #0d47a1',
                    boxShadow: 'none',
                  },
                }}
              >
                Fale conosco
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: { xs: 3, md: 4 }, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

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
