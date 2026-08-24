import apiClient from './client';
import type { Trainer } from '../types/trainer';

export const getTrainers = async (): Promise<Trainer[]> => {
  const response = await apiClient.get<Trainer[]>('/trainers/');
  return response.data;
};