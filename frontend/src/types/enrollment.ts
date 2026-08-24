export interface Enrollment {
  id: number;
  student: number;
  student_username: string;
  course: number;
  course_code: string;
  course_name: string;
  status: 'ACTIVE' | 'COMPLETED' | 'WITHDRAWN';
  enrolled_at: string;
  updated_at: string;
}

export interface StudentOption {
  id: number;
  username: string;
  email: string;
}