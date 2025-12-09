import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, FormControl, InputLabel, Pagination, CircularProgress, Alert } from '@mui/material';
import { getAuditLogs, type AuditLogResponse, type AuditLogItem } from '../../../API/audit';

const LogsAdminPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

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
            <MenuItem value="news_create">News Create</MenuItem>
            <MenuItem value="news_update">News Update</MenuItem>
            <MenuItem value="news_delete">News Delete</MenuItem>
            <MenuItem value="news_archive">News Archive</MenuItem>
            <MenuItem value="news_restore">News Restore</MenuItem>
            <MenuItem value="partner_create">Partner Create</MenuItem>
            <MenuItem value="partner_update">Partner Update</MenuItem>
            <MenuItem value="partner_delete">Partner Delete</MenuItem>
            <MenuItem value="links_create">Links Create</MenuItem>
            <MenuItem value="links_update">Links Update</MenuItem>
            <MenuItem value="links_delete">Links Delete</MenuItem>
            <MenuItem value="links_reorder">Links Reorder</MenuItem>
            <MenuItem value="about_update">About Update</MenuItem>
            <MenuItem value="statistics_create">Statistics Create</MenuItem>
            <MenuItem value="statistics_update">Statistics Update</MenuItem>
            <MenuItem value="statistics_delete">Statistics Delete</MenuItem>
            <MenuItem value="solutions_create">Solutions Create</MenuItem>
            <MenuItem value="solutions_update">Solutions Update</MenuItem>
            <MenuItem value="solutions_delete">Solutions Delete</MenuItem>
            <MenuItem value="solutions_reorder">Solutions Reorder</MenuItem>
            <MenuItem value="team_update">Team Update</MenuItem>
            <MenuItem value="admin_update_me">Profile Update</MenuItem>
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
                <TableCell>Path</TableCell>
                <TableCell>IP</TableCell>
                <TableCell>Notícia</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{log.type}</TableCell>
                  <TableCell>{log.user?.user || '-'}</TableCell>
                  <TableCell>{log.path || '-'}</TableCell>
                  <TableCell>{log.ip || '-'}</TableCell>
                  <TableCell>{log.newsId ?? '-'}</TableCell>
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
