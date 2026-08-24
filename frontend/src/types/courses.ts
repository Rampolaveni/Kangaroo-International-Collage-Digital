export interface Courses {
  id: number;
  campus: number;
  campus_name: string;
  name: string;
  code: string;
  description: string;
  duration_weeks: number;
  fee: string;
  start_date: string;
  end_date: string;
  max_students: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}