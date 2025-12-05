import api from './index';

export interface TeamPage {
    id: number;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateTeamDto {
    title?: string;
    content?: string;
    isPublished?: boolean;
}

// Obter página da equipe (público)
export const getTeamPage = async (): Promise<TeamPage> => {
    const response = await api.get('/team');
    return response.data;
};

// Obter página da equipe para admin
export const getTeamPageAdmin = async (): Promise<TeamPage> => {
    const response = await api.get('/team/admin');
    return response.data;
};

// Atualizar página da equipe
export const updateTeamPage = async (data: UpdateTeamDto): Promise<TeamPage> => {
    const response = await api.put('/team', data);
    return response.data;
};
