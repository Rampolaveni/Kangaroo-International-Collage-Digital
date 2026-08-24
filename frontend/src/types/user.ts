export interface UserAccount {
  id: number;
  username: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TRAINER' | 'STUDENT';
  phone_number: string;
  first_name: string;
  last_name: string;
}

export interface CreateUserPayload {
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  password: string;
  role: string;
}