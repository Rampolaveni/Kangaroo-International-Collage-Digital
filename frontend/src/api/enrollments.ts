import apiClient from './client';
import type { Enrollment, StudentOption } from '../types/enrollment';

export const getEnrollments = async (): Promise<Enrollment[]> => {
  const response = await apiClient.get<Enrollment[]>('/enrollments/');
  return response.data;
};

export const getStudents = async (): Promise<StudentOption[]> => {
  const response = await apiClient.get<StudentOption[]>('/auth/students/');
  return response.data;
};

export const createEnrollment = async (student: number, course: number): Promise<Enrollment> => {
  const response = await apiClient.post<Enrollment>('/enrollments/', { student, course });
  return response.data;
};

export const getEnrollmentsByStudent = async (studentUserId: number): Promise<Enrollment[]> => {
  const all = await getEnrollments();
  return all.filter((e) => e.student === studentUserId);
};