// authService.tsx
import axios from '../utils/axiosInstance';
import type { User } from '../types/types';

const USER_AUTH_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_USER_AUTH_URL = `${USER_AUTH_URL}/auth`;
console.log(USER_AUTH_URL)
console.log(VITE_USER_AUTH_URL)

export interface LoginResponse {
  user: Omit<User, 'access_token'>; // user without access_token
  token: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${VITE_USER_AUTH_URL}/login`, { email, password });

  const fullUser: User = {
    ...response.data.user,
    access_token: response.data.token,
  };
  console.log(response)

  localStorage.setItem('user', JSON.stringify(fullUser));

  return response.data;
};

export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const signup = async (data: SignupRequest) => {
  return await axios.post(`${VITE_USER_AUTH_URL}/signup`, data);
};

const logout = (): void => {
  localStorage.removeItem('user');
};

const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const authService = { login, signup, logout, getCurrentUser };

export default authService;
