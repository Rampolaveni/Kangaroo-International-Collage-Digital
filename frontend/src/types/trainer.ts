export interface Trainer {
  id: number;
  user: number;
  username: string;
  email: string;
  qualification: string;
  specialization: string;
  bio: string;
  employment_type: 'FULL_TIME' | 'PART_TIME' | 'CASUAL';
  hire_date: string;
  campuses: number[];
  campus_names: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}