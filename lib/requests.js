import axios from 'axios';

// Cria uma instância do Axios com as configurações predefinidas
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api', // Define a URL base da API
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // Define um tempo limite de 5 segundos para as requisições
});

// Interceptador para lidar com erros globais
api.interceptors.response.use(
  (response) => response, // Retorna a resposta normalmente
  (error) => {
    // Você pode lidar com erros de uma forma global aqui
    if (error.response) {
      console.error('Erro na resposta da API:', error.response.data);
    } else if (error.request) {
      console.error('Erro na requisição:', error.request);
    } else {
      console.error('Erro geral:', error.message);
    }
    return Promise.reject(error);
  }
);

// Funções para fazer requisições

// Função para buscar todos os jogadores
export const getPlayers = async () => {
  try {
    const response = await api.get('/players');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCharacters = async () => {
  try {
    const response = await api.get('/characters');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTournaments = async () => {
  try {
    const response = await api.get('/tournaments');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTournamentById = async (id) => {
  try {
    const response = await api.get(`/tournaments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addTournament = async (data) => {
  try {
    const response = await api.post('/tournaments', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTournament = async (id) => {
  try {
    const response = await api.delete(`/tournaments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Função para buscar um jogador por ID
export const getPlayerById = async (id) => {
  try {
    const response = await api.get(`/players/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Função para adicionar um novo jogador
export const addPlayer = async (playerData) => {
  try {
    const response = await api.post('/players', playerData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPlayerParticipation = async (playerId, tournamentId, data) => {
  try {
    const response = await api.post(
      `/players/${playerId}/tournaments/${tournamentId}/participation`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removePlayerParticipation = async (playerId, tournamentId) => {
  try {
    const response = await api.delete(
      `/players/${playerId}/tournaments/${tournamentId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTournamentsByPlayer = async (playerId) => {
  try {
    const response = await api.get(`/players/${playerId}/tournaments`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Função para atualizar um jogador
export const updatePlayer = async (id, playerData) => {
  try {
    const response = await api.put(`/players/${id}`, playerData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Função para deletar um jogador
export const deletePlayer = async (id) => {
  try {
    const response = await api.delete(`/players/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
