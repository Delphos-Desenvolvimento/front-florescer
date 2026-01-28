import { useState, useEffect } from 'react';

import {
  Box,
  IconButton,
  Drawer,
  Typography,
  Divider,
  Button,
  Slider,
  Switch,
  FormControlLabel,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Accessibility as AccessibilityIcon,
  Close as CloseIcon,
  TextIncrease as TextIncreaseIcon,
  TextDecrease as TextDecreaseIcon,
  Contrast as ContrastIcon,
  DarkMode as DarkModeIcon,
  Mouse as MouseIcon,
  Link as LinkIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';

interface AccessibilitySettings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  highContrast: boolean;
  darkMode: boolean;
  invertColors: boolean;
  largerCursor: boolean;
  highlightLinks: boolean;
  dyslexiaFont: boolean;
  textAlign: 'left' | 'center' | 'justify';
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  lineHeight: 1.5,
  letterSpacing: 0,
  highContrast: false,
  darkMode: false,
  invertColors: false,
  largerCursor: false,
  highlightLinks: false,
  dyslexiaFont: false,
  textAlign: 'left',
};

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    root.style.fontSize = `${settings.fontSize}%`;

    // Line height
    root.style.setProperty('--accessibility-line-height', settings.lineHeight.toString());

    // Letter spacing
    root.style.setProperty('--accessibility-letter-spacing', `${settings.letterSpacing}px`);

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    window.dispatchEvent(new CustomEvent('accessibilitySettingsChanged', { detail: settings }));

    // Invert colors
    if (settings.invertColors) {
      root.classList.add('invert-colors');
    } else {
      root.classList.remove('invert-colors');
    }

    // Larger cursor
    if (settings.largerCursor) {
      root.classList.add('large-cursor');
    } else {
      root.classList.remove('large-cursor');
    }

    // Highlight links
    if (settings.highlightLinks) {
      root.classList.add('highlight-links');
    } else {
      root.classList.remove('highlight-links');
    }

    // Dyslexia font
    if (settings.dyslexiaFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }

    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [settings]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('accessibilitySettings');
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Floating Accessibility Button */}
      <Tooltip title="Acessibilidade" placement="left">
        <IconButton
          onClick={handleToggle}
          sx={{
            position: 'fixed',
            top: '28%',
            right: 6,
            width: 40,
            height: 40,
            backgroundColor: 'primary.main',
            color: 'white',
            boxShadow: 3,
            zIndex: 9999,
            '&:hover': {
              backgroundColor: 'primary.dark',
              boxShadow: 6,
            },
            transition: 'all 0.3s ease',
          }}
        >
          <AccessibilityIcon fontSize="medium" />
        </IconButton>
      </Tooltip>

      {/* Accessibility Panel */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            p: 3,
          },
        }}
      >
        <Box>
          {/* Header */}
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h5" fontWeight="bold">
              Acessibilidade
            </Typography>
            <IconButton onClick={handleToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            {/* Font Size */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Tamanho da Fonte
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  size="small"
                  onClick={() => updateSetting('fontSize', Math.max(80, settings.fontSize - 10))}
                >
                  <TextDecreaseIcon />
                </IconButton>
                <Slider
                  value={settings.fontSize}
                  onChange={(_, value) => updateSetting('fontSize', value as number)}
                  min={80}
                  max={150}
                  step={10}
                  marks
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                />
                <IconButton
                  size="small"
                  onClick={() => updateSetting('fontSize', Math.min(150, settings.fontSize + 10))}
                >
                  <TextIncreaseIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Line Height */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Altura da Linha
              </Typography>
              <Slider
                value={settings.lineHeight}
                onChange={(_, value) => updateSetting('lineHeight', value as number)}
                min={1}
                max={2.5}
                step={0.1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            {/* Letter Spacing */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Espaçamento entre Letras
              </Typography>
              <Slider
                value={settings.letterSpacing}
                onChange={(_, value) => updateSetting('letterSpacing', value as number)}
                min={0}
                max={5}
                step={0.5}
                marks
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}px`}
              />
            </Box>

            <Divider />

            {/* Visual Adjustments */}
            <Typography variant="subtitle1" fontWeight="bold">
              Ajustes Visuais
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ContrastIcon fontSize="small" />
                  <span>Alto Contraste</span>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={(e) => updateSetting('darkMode', e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DarkModeIcon fontSize="small" />
                  <span>Modo Escuro</span>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.invertColors}
                  onChange={(e) => updateSetting('invertColors', e.target.checked)}
                />
              }
              label="Inverter Cores"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.largerCursor}
                  onChange={(e) => updateSetting('largerCursor', e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MouseIcon fontSize="small" />
                  <span>Cursor Maior</span>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.highlightLinks}
                  onChange={(e) => updateSetting('highlightLinks', e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinkIcon fontSize="small" />
                  <span>Destacar Links</span>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.dyslexiaFont}
                  onChange={(e) => updateSetting('dyslexiaFont', e.target.checked)}
                />
              }
              label="Fonte para Dislexia"
            />

            <Divider />

            {/* Reset Button */}
            <Button
              variant="outlined"
              color="error"
              startIcon={<ResetIcon />}
              onClick={handleReset}
              fullWidth
            >
              Restaurar Padrões
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}
