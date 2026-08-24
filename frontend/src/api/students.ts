import apiClient from './client';
import type { Student } from '../types/student';

export const getStudents = async (): Promise<Student[]> => {
  const response = await apiClient.get<Student[]>('/students/');
  return response.data;
};

export const getStudent = async (id: number): Promise<Student> => {
  const response = await apiClient.get<Student>(`/students/${id}/`);
  return response.data;
};

export const updateStudent = async (id: number, data: Partial<Student>): Promise<Student> => {
  const response = await apiClient.patch<Student>(`/students/${id}/`, data);
  return response.data;
};

export const createStudentWithAccount = async (data: Record<string, any>): Promise<Student> => {
  const response = await apiClient.post<Student>('/students/create-with-account/', data);
  return response.data;
};

export interface BulkEmailPayload {
  student_ids: number[];
  category: string;
  subject: string;
  message: string;
}

export interface BulkEmailResult {
  sent: string[];
  failed: { student_id: string; reason: string }[];
  total: number;
}

export const sendBulkEmail = async (payload: BulkEmailPayload): Promise<BulkEmailResult> => {
  const response = await apiClient.post<BulkEmailResult>('/students/bulk-email/', payload);
  return response.data;
};