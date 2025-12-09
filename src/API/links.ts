import axios from 'axios';

const API_URL = import.meta.env.DEV ? '/api' : `${import.meta.env.VITE_API_URL}`;

export interface Link {
  id?: number;
  title: string;
  url: string;
  description?: string;
}

export const getLinks = async (): Promise<Link[]> => {
  try {
    const response = await axios.get(`${API_URL}/links`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar links úteis:', error);
    throw error;
  }
};
