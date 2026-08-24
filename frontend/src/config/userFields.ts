export interface UserFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'checkbox' | 'readonly';
}

export const userFields: UserFieldConfig[] = [
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'first_name', label: 'First Name', type: 'text' },
  { name: 'last_name', label: 'Last Name', type: 'text' },
  { name: 'phone_number', label: 'Phone Number', type: 'text' },
  { name: 'role', label: 'Role', type: 'readonly' },
  { name: 'date_joined', label: 'Joined', type: 'readonly' },
  { name: 'is_active', label: 'Active', type: 'checkbox' },
];