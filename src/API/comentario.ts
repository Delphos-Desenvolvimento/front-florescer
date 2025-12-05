import axios from 'axios';

const API_URL = 'http://localhost:3000'; // URL do seu backend

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
      const response = await axios.get(`${API_URL}/comments/news/${newsId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar comentários para a notícia ${newsId}:`, error);
      throw error;
    }
  },

  // Criar um novo comentário
  async create(data: CreateCommentDto): Promise<Comment> {
    try {
      const response = await axios.post(`${API_URL}/comments`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      throw error;
    }
  },

  // Responder a um comentário existente
  async replyTo(commentId: number, data: CreateReplyDto): Promise<Comment> {
    try {
      const response = await axios.post(`${API_URL}/comments/${commentId}/replies`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao responder ao comentário ${commentId}:`, error);
      throw error;
    }
  },
};

export default CommentService;
