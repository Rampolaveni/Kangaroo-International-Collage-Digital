export interface StudentFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'date' | 'checkbox' | 'select' | 'readonly';
  options?: { value: string; label: string }[];
}

export interface StudentSection {
  title: string;
  fields: StudentFieldConfig[];
}

export const studentSections: StudentSection[] = [
  {
    title: 'Identity',
    fields: [
      { name: 'student_id', label: 'Student ID', type: 'readonly' },
      { name: 'usi', label: 'USI', type: 'text' },
      { name: 'usi_verified', label: 'USI Verified', type: 'checkbox' },
      { name: 'optional_id', label: 'Optional ID', type: 'text' },
      { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
      { name: 'gender', label: 'Gender', type: 'select', options: [
        { value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' },
        { value: 'OTHER', label: 'Other' }, { value: 'UNSPECIFIED', label: 'Prefer not to say' },
      ]},
      { name: 'mobile_phone', label: 'Mobile Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'readonly' },
      { name: 'postal_address', label: 'Postal Address', type: 'text' },
      { name: 'street_address', label: 'Street Address', type: 'text' },
    ],
  },
  {
    title: 'VET Related Details',
    fields: [
      { name: 'citizen_status', label: 'Citizen Status', type: 'select', options: [
        { value: 'AU_CITIZEN', label: 'Australian Citizen' }, { value: 'PERMANENT_RESIDENT', label: 'Permanent Resident' },
        { value: 'STUDENT_VISA', label: 'Student Visa' }, { value: 'OTHER_VISA', label: 'Other Visa' },
      ]},
      { name: 'country_of_birth', label: 'Country of Birth', type: 'text' },
      { name: 'city_of_birth', label: 'City of Birth', type: 'text' },
      { name: 'citizenship', label: 'Citizenship', type: 'text' },
      { name: 'indigenous_status', label: 'Indigenous Status', type: 'select', options: [
        { value: 'YES', label: 'Yes' }, { value: 'NO', label: 'No' }, { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
      ]},
      { name: 'employment_status', label: 'Employment', type: 'select', options: [
        { value: 'FULL_TIME', label: 'Full-time employee' }, { value: 'PART_TIME', label: 'Part-time employee' },
        { value: 'SELF_EMPLOYED', label: 'Self-employed' }, { value: 'UNEMPLOYED', label: 'Unemployed' },
        { value: 'NOT_IN_LABOUR_FORCE', label: 'Not in labour force' },
      ]},
      { name: 'occupation_identifier', label: 'Occupation Identifier', type: 'text' },
      { name: 'industry_of_employment', label: 'Industry of Employment', type: 'text' },
      { name: 'language', label: 'Language', type: 'text' },
      { name: 'english_proficiency', label: 'English', type: 'select', options: [
        { value: 'VERY_WELL', label: 'Spoken Very Well' }, { value: 'WELL', label: 'Spoken Well' },
        { value: 'NOT_WELL', label: 'Not Well' }, { value: 'NOT_AT_ALL', label: 'Not at all' },
      ]},
      { name: 'needs_english_assistance', label: 'Eng Assistance Needed', type: 'checkbox' },
      { name: 'highest_education', label: 'Highest Education', type: 'text' },
      { name: 'attending_other_school', label: 'Attending Other School/s', type: 'checkbox' },
      { name: 'survey_contact_status', label: 'Survey Contact Status', type: 'select', options: [
        { value: 'INCLUDED', label: 'Included in survey use' }, { value: 'EXCLUDED', label: 'Excluded from survey use' },
      ]},
    ],
  },
  {
    title: 'CRICOS Related Details',
    fields: [
      { name: 'passport_number', label: 'Passport Number', type: 'text' },
      { name: 'visa_type', label: 'Visa Type', type: 'text' },
      { name: 'visa_expiry_date', label: 'Visa Expiry Date', type: 'date' },
    ],
  },
  {
    title: 'Emergency Contact',
    fields: [
      { name: 'emergency_contact_name', label: 'Contact Name', type: 'text' },
      { name: 'emergency_contact_relationship', label: 'Relationship', type: 'text' },
      { name: 'emergency_contact_phone', label: 'Contact Phone', type: 'text' },
    ],
  },
  {
    title: 'Academic',
    fields: [
      { name: 'campus_name', label: 'Campus', type: 'readonly' },
      { name: 'enrollment_date', label: 'Enrollment Date', type: 'readonly' },
      { name: 'status', label: 'Status', type: 'select', options: [
        { value: 'ACTIVE', label: 'Active' }, { value: 'ON_LEAVE', label: 'On Leave' },
        { value: 'GRADUATED', label: 'Graduated' }, { value: 'WITHDRAWN', label: 'Withdrawn' },
      ]},
    ],
  },
];