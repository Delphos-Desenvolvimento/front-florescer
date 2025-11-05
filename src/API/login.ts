import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

export interface User {
  id: number;
  user: string;
  role: string;
}

interface LoginResponse {
  message: string;
  user: User;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    console.log('Attempting login with:', { username });
    
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    }, {
      validateStatus: (status) => status < 500 // Don't throw for 4xx errors
    });
    
    console.log('Login response:', response.data);
    
    if (response.status === 401) {
      throw new Error('Invalid username or password');
    }
    
    if (!response.data || !response.data.user) {
      throw new Error('Invalid response from server');
    }
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(response.data.user));
    console.log('User logged in successfully:', response.data.user);
    
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    console.error('Login error:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const register = async (username: string, password: string, role = 'user'): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      password,
      role,
    });
    
    // Auto-login after registration
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user ? user.role === 'admin' : false;
};
