import { Box, Typography, Container, Button } from '@mui/material';
 



function Hero() {
  return (
    <Box
      id="hero-section"
      sx={{
        position: 'relative',
        color: 'common.white',
        height: '100vh',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundImage: 'url(/images/Pagina_Principal_sem_textos[1].png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }
      }}
    >
      {/* Fundo com gradiente animado - Removido o componente AnimatedGradient já que o gradiente foi movido para o container principal */}
      
      {/* Conteúdo principal */}
      <Container 
        maxWidth="lg" 
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          px: { xs: 3, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          paddingTop: '0',
          paddingBottom: '40px'
        }}
      >
        <div style={{ width: '100%' }}>
          <Box
            component="div"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              mb: 4,
            }}
          >
            <Box
              component="img"
              src="/images/Logo_sem_fundo_Contab[1].png"
              alt="Contab Logo"
              sx={{
                width: { xs: '280px', md: '450px' },
                height: 'auto',
                maxWidth: '100%',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </Box>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#00a4f6',
              fontSize: { xs: '2.8rem', md: '4rem' },
              mb: 0.1,
              lineHeight: 1.1,
            }}
          >
            Gestão fiscal responsável
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: 'white',
              fontSize: { xs: '1.4rem', md: '1.8rem' },
              mb: 4,
              mt: 0.1,
            }}
          >
            começa com contabilidade pública de qualidade.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component="a"
            href="https://api.whatsapp.com/send/?phone=%2B558695541237&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              borderRadius: '50px', 
              px: 4, 
              py: 1.5,
              textTransform: 'none',
              fontSize: '1.1rem',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(41, 121, 255, 0.2)',
              },
            }}
          >
            Fale com um especialista
          </Button>
        </div>
      </Container>
    </Box>
  );
}

export default Hero;
