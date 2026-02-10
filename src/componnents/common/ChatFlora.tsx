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

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatFlora = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
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

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newUserMessage: Message = {
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, newUserMessage]);
    setMessage('');

    // Simulação de resposta da Flora
    setTimeout(() => {
      const botResponse: Message = {
        text: 'Estamos treinando nossa assistente virtual para tirar todas as suas dúvidas instantaneamente. Funcionalidade chegando em breve.',
        isBot: true,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, botResponse]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
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
              alt="Fale com a Flora"
              sx={{
                height: { xs: 70, md: 90 },
                width: 'auto',
                maxWidth: '100%',
                display: 'block',
                objectFit: 'contain',
              }}
            />
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
              <Box
                component="video"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                sx={{
                  position: 'absolute',
                  top: -6,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: 'scale(1.6)',
                  transformOrigin: 'center',
                  backgroundColor: 'transparent',
                  mixBlendMode: 'screen', // Garante que o fundo preto fique transparente
                }}
              >
                <source src="/images/video-sem-fundo-convertido.hevc.mp4" type='video/mp4; codecs="hvc1"' />
                <source src="/images/video%20sem%20fundo.webm" type="video/webm" />
              </Box>
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
              src="/images/chat%20flora%20sem%20fundo%20SF.png"
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
              disabled={!message.trim()}
              color="primary"
              sx={{
                bgcolor: message.trim() ? '#0288d1' : '#f0f0f0',
                color: message.trim() ? 'white' : '#a0a0a0',
                width: 45,
                height: 45,
                '&:hover': { bgcolor: message.trim() ? '#01579b' : '#f0f0f0' },
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
