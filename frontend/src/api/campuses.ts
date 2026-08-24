import apiClient from './client';
import type { Campus } from '../types/campus';

export const getCampuses = async (): Promise<Campus[]> => {
  const response = await apiClient.get<Campus[]>('/campuses/');
  return response.data;
};

export const createCampus = async (data: Partial<Campus>): Promise<Campus> => {
  const response = await apiClient.post<Campus>('/campuses/', data);
  return response.data;
};

export const updateCampus = async (id: number, data: Partial<Campus>): Promise<Campus> => {
  const response = await apiClient.patch<Campus>(`/campuses/${id}/`, data);
  return response.data;
};

export const deleteCampus = async (id: number): Promise<void> => {
  await apiClient.delete(`/campuses/${id}/`);
};