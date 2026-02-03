import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Alert } from '@mui/material';
import { getMe, updateMe, type AdminUser } from '../../../API/admin';

const ProfileAdminPage: React.FC = () => {
  const [current, setCurrent] = useState<AdminUser | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        setCurrent(me);
        setName(me.name || me.user || '');
        setEmail(me.user || '');
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Erro ao carregar perfil';
        setError(message);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const updated = await updateMe({ user: email, password: password || undefined, name });
      setCurrent(updated);
      setPassword('');
      setSuccess('Perfil atualizado com sucesso');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro ao atualizar perfil';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
        Meu Perfil
      </Typography>

      {error && !/status code\s*500/i.test(error) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        {current && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Usuário atual: {current.user} • Nome: {current.name || '-'} • Papel: {current.role}
            </Typography>
          </Box>
        )}
        <TextField
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Nova Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
          Salvar Alterações
        </Button>
      </Paper>
    </Box>
  );
};

export default ProfileAdminPage;
