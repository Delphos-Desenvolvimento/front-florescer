import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, FormControl, InputLabel, Pagination, CircularProgress, Alert, Tooltip } from '@mui/material';
import { getAuditLogs, type AuditLogResponse, type AuditLogItem } from '../../../API/audit';

const LogsAdminPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const typeLabels: Record<string, string> = {
    news_create: 'Criação de notícia',
    news_update: 'Atualização de notícia',
    news_delete: 'Exclusão de notícia',
    news_archive: 'Arquivamento de notícia',
    news_restore: 'Restauração de notícia',
    partner_create: 'Criação de parceiro',
    partner_update: 'Atualização de parceiro',
    partner_delete: 'Exclusão de parceiro',
    links_create: 'Criação de link',
    links_update: 'Atualização de link',
    links_delete: 'Exclusão de link',
    links_reorder: 'Reordenação de links',
    about_update: 'Atualização de Sobre',
    statistics_create: 'Criação de estatística',
    statistics_update: 'Atualização de estatística',
    statistics_delete: 'Exclusão de estatística',
    solutions_create: 'Criação de solução',
    solutions_update: 'Atualização de solução',
    solutions_delete: 'Exclusão de solução',
    solutions_reorder: 'Reordenação de soluções',
    team_update: 'Atualização de equipe',
    admin_update_me: 'Atualização de perfil',
  };

  const loadLogs = async (p = 1, t = '') => {
    try {
      setLoading(true);
      setError('');
      const res: AuditLogResponse = await getAuditLogs({ page: p, limit: 20, type: t || undefined });
      setLogs(res.items);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro ao carregar logs';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLogs(page, typeFilter);
  }, [page, typeFilter]);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>Logs de Auditoria</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="type-label">Tipo</InputLabel>
          <Select
            labelId="type-label"
            value={typeFilter}
            label="Tipo"
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="news_create">Criação de notícia</MenuItem>
            <MenuItem value="news_update">Atualização de notícia</MenuItem>
            <MenuItem value="news_delete">Exclusão de notícia</MenuItem>
            <MenuItem value="news_archive">Arquivamento de notícia</MenuItem>
            <MenuItem value="news_restore">Restauração de notícia</MenuItem>
            <MenuItem value="partner_create">Criação de parceiro</MenuItem>
            <MenuItem value="partner_update">Atualização de parceiro</MenuItem>
            <MenuItem value="partner_delete">Exclusão de parceiro</MenuItem>
            <MenuItem value="links_create">Criação de link</MenuItem>
            <MenuItem value="links_update">Atualização de link</MenuItem>
            <MenuItem value="links_delete">Exclusão de link</MenuItem>
            <MenuItem value="links_reorder">Reordenação de links</MenuItem>
            <MenuItem value="about_update">Atualização de Sobre</MenuItem>
            <MenuItem value="statistics_create">Criação de estatística</MenuItem>
            <MenuItem value="statistics_update">Atualização de estatística</MenuItem>
            <MenuItem value="statistics_delete">Exclusão de estatística</MenuItem>
            <MenuItem value="solutions_create">Criação de solução</MenuItem>
            <MenuItem value="solutions_update">Atualização de solução</MenuItem>
            <MenuItem value="solutions_delete">Exclusão de solução</MenuItem>
            <MenuItem value="solutions_reorder">Reordenação de soluções</MenuItem>
            <MenuItem value="team_update">Atualização de equipe</MenuItem>
            <MenuItem value="admin_update_me">Atualização de perfil</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper>
        {loading ? (
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Usuário</TableCell>
                <TableCell>Artigo</TableCell>
                <TableCell>Notícia</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(log.createdAt))}</TableCell>
                  <TableCell>{typeLabels[log.type] ?? log.type}</TableCell>
                  <TableCell>{log.user?.user || '-'}</TableCell>
                  <TableCell>
                    {log.newsTitle ? (
                      <Tooltip title={log.newsTitle}><span>{log.newsTitle}</span></Tooltip>
                    ) : (
                      log.path || '-'
                    )}
                  </TableCell>
                  <TableCell>{log.newsTitle ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={totalPages} page={page} onChange={(_e, p) => setPage(p)} />
      </Box>
    </Box>
  );
};

export default LogsAdminPage;
