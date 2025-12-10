import { apiPublic } from '.';
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
    const res = await apiPublic.get<StatsOverview>('/stats/overview');
    return res.data;
  },
  async getEventsByDay(type: string, days = 14): Promise<{ date: string; count: number }[]> {
    const res = await apiPublic.get<Array<{ date: string; count: number }>>('/stats/events-by-day', {
      params: { type, days },
    });
    return res.data;
  },
  async getCategories(): Promise<{ category: string; count: number }[]> {
    const res = await apiPublic.get<Array<{ category: string; count: number }>>('/stats/categories');
    return res.data;
  },
};

export default StatsService;
