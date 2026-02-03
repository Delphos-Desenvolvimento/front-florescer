import api from './index';

export interface AuditUser {
  id: number;
  user: string;
  role: string;
}

export interface AuditLogItem {
  id: number;
  type: string;
  path?: string | null;
  newsId?: number | null;
  newsTitle?: string | null;
  userId?: number | null;
  user?: AuditUser | null;
  userAgent?: string | null;
  ip?: string | null;
  createdAt: string;
}

export interface AuditLogResponse {
  items: AuditLogItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function getAuditLogs(params?: {
  type?: string;
  page?: number;
  limit?: number;
}): Promise<AuditLogResponse> {
  const res = await api.get('/admin/logs', { params });
  return res.data as AuditLogResponse;
}
