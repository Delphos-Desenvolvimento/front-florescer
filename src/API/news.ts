import api, { apiPublic } from '.';

export interface NewsImage {
  id?: number;
  base64: string;
  altText?: string;
}

export interface NewsItem {
  id?: number;
  title: string;
  content: string;
  category: string;
  status: 'rascunho' | 'publicada' | 'arquivada';
  date: string;
  views: number;
  images?: NewsImage[];
}

// Removido: conversão para base64 (usamos FormData com arquivos)

const NewsService = {
  /**
   * Busca todas as notícias
   */
  async getAll(params?: { status?: string }): Promise<NewsItem[]> {
    try {
      const response = await apiPublic.get<NewsItem[]>('/news', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      throw error;
    }
  },

  /**
   * Busca uma notícia por ID
   */
  async getById(id: number): Promise<NewsItem> {
    try {
      const response = await apiPublic.get<NewsItem>(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar notícia com ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cria uma nova notícia
   */
  async create(
    newsData: Omit<NewsItem, 'id' | 'views' | 'images'>,
    imageFiles?: File[]
  ): Promise<NewsItem> {
    try {
      const form = new FormData();
      form.append('title', newsData.title);
      form.append('content', newsData.content);
      form.append('category', newsData.category);
      if (newsData.status) form.append('status', String(newsData.status));
      if (newsData.date) form.append('date', String(newsData.date));
      if (Array.isArray(imageFiles)) {
        imageFiles.forEach((file) => form.append('images', file));
      }
      const response = await api.post<NewsItem>('/news', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar notícia:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma notícia existente (parcial)
   */
  async update(id: number, newsData: Partial<NewsItem>, imageFiles?: File[]): Promise<NewsItem> {
    try {
      const form = new FormData();
      if (newsData.title) form.append('title', newsData.title);
      if (newsData.content) form.append('content', newsData.content);
      if (newsData.category) form.append('category', newsData.category);
      if (newsData.status) form.append('status', String(newsData.status));
      if (newsData.date) form.append('date', String(newsData.date));
      if (Array.isArray(imageFiles) && imageFiles.length > 0) {
        imageFiles.forEach((file) => form.append('images', file));
      }
      const response = await api.patch<NewsItem>(`/news/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar notícia com ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Remove uma notícia
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/news/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir notícia com ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Arquivar uma notícia
   */
  async archive(id: number): Promise<NewsItem> {
    try {
      const response = await api.patch<NewsItem>(`/news/${id}/archive`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao arquivar notícia com ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Restaurar uma notícia arquivada
   */
  async restore(id: number): Promise<NewsItem> {
    try {
      const response = await api.patch<NewsItem>(`/news/${id}/restore`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao restaurar notícia com ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca notícias por categoria
   */
  async getByCategory(category: string): Promise<NewsItem[]> {
    try {
      const response = await apiPublic.get<NewsItem[]>('/news', {
        params: { category },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar notícias da categoria ${category}:`, error);
      throw error;
    }
  },
};

export default NewsService;
