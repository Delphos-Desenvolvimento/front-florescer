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
  const res = await api.get('/admin/users/me');
  return res.data.user as AdminUser;
}

export async function updateMe(data: { user?: string; password?: string; role?: string; name?: string }): Promise<AdminUser> {
  const res = await api.post('/admin/users/me', data);
  return res.data.user as AdminUser;
}
