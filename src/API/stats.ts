

export interface StatsOverview {
  totalNews: number;
  publishedNews: number;
  archivedNews: number;
  draftNews: number;
  totalViews: number;
  imagesCount: number;
  adminCount: number;
  latestNews?: { id: number; title: string; createdAt: string } | null;
  topCategories: { category: string; count: number }[];
}

const StatsService = {
  async getOverview(): Promise<StatsOverview> {
    const base = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL;
    const url = `${base}/stats/overview`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return (await res.json()) as StatsOverview;
  },
  async getEventsByDay(type: string, days = 14): Promise<{ date: string; count: number }[]> {
    const base = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL;
    const params = new URLSearchParams({ type, days: String(days) });
    const url = `${base}/stats/events-by-day?${params.toString()}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return (await res.json()) as Array<{ date: string; count: number }>;
  },
  async getCategories(): Promise<{ category: string; count: number }[]> {
    const base = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL;
    const url = `${base}/stats/categories`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return (await res.json()) as Array<{ category: string; count: number }>;
  },
};

export default StatsService;
