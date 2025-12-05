import axios from 'axios';

const API_URL = 'http://localhost:3000';

export interface Link {
  id?: number;
  title: string;
  url: string;
  description?: string;
}

export const getLinks = async (): Promise<Link[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/links`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar links úteis:', error);
    throw error;
  }
};
