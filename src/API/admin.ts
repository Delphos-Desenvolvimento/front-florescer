import api from './index';

export interface AdminUser {
  id: number;
  user: string;
  role: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getMe(): Promise<AdminUser> {
  try {
    const res = await api.get('/admin/users/me');
    return res.data.user as AdminUser;
  } catch (err: unknown) {
    const res = await api.get('/auth/profile').catch(() => null as unknown as { data: AdminUser });
    if (res && (res as { data?: unknown }).data) {
      return res.data as AdminUser;
    }
    throw (err instanceof Error ? err : new Error('Falha ao obter usuário atual'));
  }
}

export async function updateMe(data: { user?: string; password?: string; role?: string; name?: string }): Promise<AdminUser> {
  const res = await api.post('/admin/users/me', data);
  return res.data.user as AdminUser;
}
