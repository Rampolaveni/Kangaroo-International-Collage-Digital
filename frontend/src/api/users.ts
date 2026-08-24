import apiClient from './client';
import type { UserAccount, CreateUserPayload } from '../types/user';

export const getUsers = async (): Promise<UserAccount[]> => {
  const response = await apiClient.get<UserAccount[]>('/auth/users/');
  return response.data;
};

export const createUser = async (data: CreateUserPayload): Promise<UserAccount> => {
  const response = await apiClient.post<UserAccount>('/auth/users/create/', data);
  return response.data;
};

export const updateUser = async (id: number, data: Partial<UserAccount>): Promise<UserAccount> => {
  const response = await apiClient.patch<UserAccount>(`/auth/users/${id}/`, data);
  return response.data;
};