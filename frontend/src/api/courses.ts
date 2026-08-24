import apiClient from './client';
import type { Courses } from '../types/courses';

export const getCourses = async (): Promise<Courses[]> => {
  const response = await apiClient.get<Courses[]>('/courses/');
  return response.data;
};

export const createCourse = async (data: Partial<Courses>): Promise<Courses> => {
  const response = await apiClient.post<Courses>('/courses/', data);
  return response.data;
};

export const updateCourse = async (id: number, data: Partial<Courses>): Promise<Courses> => {
  const response = await apiClient.patch<Courses>(`/courses/${id}/`, data);
  return response.data;
};

export const deleteCourse = async (id: number): Promise<void> => {
  await apiClient.delete(`/courses/${id}/`);
};