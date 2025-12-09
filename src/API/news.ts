import api, { apiPublic } from '.';

function coerceToArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const maybeItems = (data as { items?: unknown }).items;
    if (Array.isArray(maybeItems)) return maybeItems as T[];
  }
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return coerceToArray<T>(parsed);
    } catch {
      return [];
    }
  }
  return [];
}

function coerceToObject<T>(data: unknown): T {
  if (data && typeof data === 'object') return data as T;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') return parsed as T;
      throw new Error('invalid');
    } catch {
      throw new Error('invalid');
    }
  }
  throw new Error('invalid');
}

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

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const NewsService = {
  /**
   * Busca todas as notícias
   */
  async getAll(params?: { status?: string }): Promise<NewsItem[]> {
    try {
      const response = await apiPublic.get<unknown>('/news', { params });
      return coerceToArray<NewsItem>(response.data);
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
      const response = await apiPublic.get<unknown>(`/news/${id}`);
      return coerceToObject<NewsItem>(response.data);
    } catch (error) {
      console.error(`Erro ao buscar notícia com ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cria uma nova notícia
   */
  async create(newsData: Omit<NewsItem, 'id' | 'views' | 'images'>, imageFiles?: File[]): Promise<NewsItem> {
    try {
      const imagesBase64 = Array.isArray(imageFiles) && imageFiles.length > 0
        ? await Promise.all(imageFiles.map(fileToDataUrl))
        : undefined;
      const payload = imagesBase64 ? { ...newsData, imagesBase64 } : { ...newsData };
      const response = await api.post<NewsItem>('/news', payload);
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
      const imagesBase64 = Array.isArray(imageFiles) && imageFiles.length > 0
        ? await Promise.all(imageFiles.map(fileToDataUrl))
        : undefined;
      const payload = imagesBase64 ? { ...newsData, imagesBase64 } : { ...newsData };
      const response = await api.patch<NewsItem>(`/news/${id}`, payload);
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
      const response = await apiPublic.get<unknown>('/news', { params: { category } });
      return coerceToArray<NewsItem>(response.data);
    } catch (error) {
      console.error(`Erro ao buscar notícias da categoria ${category}:`, error);
      throw error;
    }
  }
};

export default NewsService;
