import { apiPublic } from './index';

export interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface CreateCommentDto {
  author: string;
  email: string;
  content: string;
  newsId: number;
}

export interface CreateReplyDto {
  author: string;
  email: string;
  content: string;
}

const CommentService = {
  // Buscar todos os comentários de uma notícia
  async getAllByNewsId(newsId: number): Promise<Comment[]> {
    try {
      const response = await apiPublic.get<Comment[]>(`/comments/news/${newsId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar comentários para a notícia ${newsId}:`, error);
      throw error;
    }
  },

  // Criar um novo comentário
  async create(data: CreateCommentDto): Promise<Comment> {
    try {
      const response = await apiPublic.post<Comment>(`/comments`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      throw error;
    }
  },

  // Responder a um comentário existente
  async replyTo(commentId: number, data: CreateReplyDto): Promise<Comment> {
    try {
      const response = await apiPublic.post<Comment>(`/comments/${commentId}/replies`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao responder ao comentário ${commentId}:`, error);
      throw error;
    }
  },
};

export default CommentService;
