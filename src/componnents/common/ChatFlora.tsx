import { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Stack,
  Paper,
  Avatar,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIconMui from '@mui/icons-material/Close';
import SendIconMui from '@mui/icons-material/Send';
import { apiPublic } from '../../API';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatFlora = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      text: 'Olá! Eu sou a Flora, sua assistente virtual. Como posso ajudar você hoje?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Lógica Mobile conforme solicitado
  useEffect(() => {
    if (!isMobile) return;

    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;

    const ctx = c.getContext('2d', { alpha: true });
    if (!ctx) return;

    let active = true;

    function render() {
      if (!active) return;
      
      const currentV = videoRef.current;
      const currentC = canvasRef.current;
      
      if (!currentV || !currentC || currentV.paused || currentV.ended) {
        requestAnimationFrame(render);
        return;
      }

      const ctx = currentC.getContext('2d', { alpha: true });
      if (!ctx) return;

      if (currentV.videoWidth > 0) {
        if (currentC.width !== currentV.videoWidth) {
          currentC.width = currentV.videoWidth;
          currentC.height = currentV.videoHeight;
        }
        ctx.drawImage(currentV, 0, 0);
      }
      requestAnimationFrame(render);
    }

    // Tentar play automático (muted auto-play é permitido na maioria dos browsers mobile)
    v.play().then(() => {
      render();
    }).catch(err => {
      console.error("Erro no auto-play mobile:", err);
      // Fallback: tenta rodar de novo em qualquer clique
      const retryPlay = () => {
        v.play().then(() => {
          render();
          window.removeEventListener('click', retryPlay);
        });
      };
      window.addEventListener('click', retryPlay);
    });

    return () => {
      active = false;
    };
  }, [isMobile]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [chatHistory, open]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (isSending) return;

    const newUserMessage: Message = {
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, newUserMessage]);
    setMessage('');

    setIsSending(true);
    try {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
        .map((el) => (el.textContent || '').trim())
        .filter(Boolean)
        .slice(0, 12);
      const buttons = Array.from(document.querySelectorAll('button, a'))
        .map((el) => ((el as HTMLElement).innerText || el.textContent || '').trim())
        .filter(Boolean)
        .slice(0, 12);

      const currentPageInfo = [
        `Title: ${(document.title || '').trim() || '(none)'}`,
        `URL: ${window.location.href}`,
        headings.length ? `Headings: ${headings.join(' | ')}` : '',
        buttons.length ? `Buttons: ${buttons.join(' | ')}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const res = await apiPublic.post<{ reply?: string }>(
        '/chatflora',
        {
          currentPageInfo,
          userMessage: newUserMessage.text,
        },
        { headers: { 'X-Skip-Interceptor': '1' } }
      );

      const reply = typeof res.data?.reply === 'string' ? res.data.reply.trim() : '';
      const botResponse: Message = {
        text: reply || 'Não consegui gerar uma resposta agora.',
        isBot: true,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, botResponse]);
    } catch {
      const botResponse: Message = {
        text: 'Não consegui responder agora. Verifique se o backend está ligado na porta 3000.',
        isBot: true,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, botResponse]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
    }
  };

  return (
    <>
      {/* Filtro SVG para remover o preto (fallback para navegadores que suportam) */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="remove-black" colorInterpolationFilters="sRGB">
          <feColorMatrix 
            type="matrix" 
            values="1 0 0 0 0 
                    0 1 0 0 0 
                    0 0 1 0 0 
                    10 10 10 0 -0.1" 
          />
        </filter>
      </svg>
      {/* Botão Flutuante (Imagem Recortada - Área Clicável Justa) */}
      {!open && (
        <Box
          onClick={handleOpen}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.03)',
              filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))',
            },
          }}
        >
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Box
              component="img"
              src="/images/chat%20flora%20sem%20fundo%20SF.png"
              alt="Chat Flora"
              sx={{
                height: { xs: 80, md: 65 },
                width: 'auto',
                maxWidth: '100%',
                display: 'block',
                objectFit: 'contain',
              }}
            />
            {/* Container do Vídeo / Canvas */}
            <Box
              sx={{
                position: 'absolute',
                right: -12,
                top: 0,
                height: '100%',
                width: { xs: '56%', md: '50%' },
                overflow: 'visible',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              {isMobile ? (
                <>
                  {/* Lógica para Mobile (iPhone Fix) */}
                    <video
                      ref={videoRef}
                      src="/images/Flora%204novo.mp4"
                      loop
                      muted
                      playsInline
                      webkit-playsinline="true"
                      autoPlay
                      crossOrigin="anonymous"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '1px',
                        height: '1px',
                        opacity: 0.01,
                        pointerEvents: 'none',
                      }}
                    />
                  <Box
                    component="canvas"
                    ref={canvasRef}
                    sx={{
                          position: 'absolute',
                          top: -8,
                          left: -5,
                          width: '110%',
                          height: '110%',
                          objectFit: 'contain',
                          transform: 'scale(1.5)',
                          transformOrigin: 'center',
                          filter: 'url(#remove-black)',
                          WebkitFilter: 'url(#remove-black)',
                        }}
                  />
                </>
              ) : (
                /* Lógica para Desktop (Normal) */
                <Box
                  component="video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  sx={{
                     position: 'absolute',
                     top: -8,
                     left: -5,
                     width: '110%',
                     height: '110%',
                     objectFit: 'contain',
                     transform: 'scale(1.5)',
                     transformOrigin: 'center',
                     backgroundColor: 'transparent',
                   }}
                >
                  <source src="/images/flora%204_1.mov" type="video/quicktime" />
                  <source src="/images/video-sem-fundo-convertido.hevc.mp4" type='video/mp4; codecs="hvc1"' />
                  <source src="/images/video%20sem%20fundo.webm" type="video/webm" />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* Modal do Chat */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isMobile}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            position: isMobile ? 'fixed' : 'fixed',
            bottom: isMobile ? 0 : 100,
            right: isMobile ? 0 : 24,
            width: isMobile ? '100%' : 380,
            height: isMobile ? '100%' : 550,
            borderRadius: isMobile ? 0 : '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 10000,
            m: 0,
            maxHeight: isMobile ? '100%' : 'calc(100vh - 120px)',
          },
        }}
      >
        {/* Cabeçalho */}
        <Box
          sx={{
            p: 2,
            background: 'linear-gradient(135deg, #0288d1 0%, #26c6da 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src="/images/banner2corr.png"
              sx={{
                width: 45,
                height: 45,
                border: '2px solid rgba(255,255,255,0.8)',
                bgcolor: 'white',
              }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight="700" lineHeight={1.2}>
                Flora
              </Typography>
              <Typography
                variant="caption"
                sx={{ opacity: 0.9, display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: '#00e676',
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                />
                Online
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={handleClose}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            <CloseIconMui />
          </IconButton>
        </Box>

        {/* Área de Mensagens */}
        <DialogContent
          sx={{
            p: 2,
            bgcolor: '#f0f2f5',
            display: 'flex',
            flexDirection: 'column',
            backgroundImage: 'radial-gradient(#e0e0e0 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              py: 1,
              // Esconde a barra de rolagem para WebKit (Chrome, Safari, Edge)
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              // Esconde a barra de rolagem para Firefox
              scrollbarWidth: 'none',
              // Esconde a barra de rolagem para IE e Edge
              '-ms-overflow-style': 'none',
            }}
          >
            <Typography variant="caption" align="center" sx={{ color: 'text.secondary', my: 1 }}>
              Hoje
            </Typography>

            {chatHistory.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                  maxWidth: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.isBot ? 'flex-start' : 'flex-end',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    px: 2,
                    borderRadius: msg.isBot ? '20px 20px 20px 4px' : '20px 20px 4px 20px',
                    bgcolor: msg.isBot ? 'white' : '#0288d1',
                    color: msg.isBot ? 'text.primary' : 'white',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    position: 'relative',
                  }}
                >
                  <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                    {msg.text}
                  </Typography>
                </Paper>
                <Typography
                  variant="caption"
                  sx={{ mt: 0.5, px: 1, color: 'text.secondary', fontSize: '0.7rem' }}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>
        </DialogContent>

        {/* Input */}
        <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e0e0e0' }}>
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '24px',
                  bgcolor: '#f8f9fa',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: '1px solid #0288d1' },
                  py: 1.5,
                  px: 2,
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
              color="primary"
              sx={{
                bgcolor: message.trim() && !isSending ? '#0288d1' : '#f0f0f0',
                color: message.trim() && !isSending ? 'white' : '#a0a0a0',
                width: 45,
                height: 45,
                '&:hover': {
                  bgcolor: message.trim() && !isSending ? '#01579b' : '#f0f0f0',
                },
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              <SendIconMui fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Dialog>
    </>
  );
};

export default ChatFlora;
