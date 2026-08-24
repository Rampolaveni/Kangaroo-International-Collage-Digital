import type { ReactNode, FormEvent } from 'react';
import { theme } from '../../styles/theme';
import FormField from './FormField';
import SelectField from './SelectField';

export interface GenericFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'date' | 'checkbox' | 'select' | 'readonly';
  options?: { value: string; label: string }[];
}

interface DynamicFormProps {
  fields: GenericFieldConfig[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onSubmit: (e: FormEvent) => void;
  submitLabel: string;
  submitting: boolean;
  error: string;
  children?: ReactNode;
  hideSubmit?: boolean;
}

export default function DynamicForm({
  fields, values, onChange, onSubmit, submitLabel, submitting, error, children, hideSubmit,
}: DynamicFormProps) {
  return (
    <form onSubmit={onSubmit}>
      {fields.map((field) => {
        const value = values[field.name] ?? '';

        if (field.type === 'readonly') {
          const display = field.name.includes('date') && value
            ? new Date(value).toLocaleDateString()
            : value?.toString().replace(/_/g, ' ') || '—';
          return (
            <div key={field.name} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: theme.colors.text }}>
                {field.label}
              </label>
              <div style={{ padding: '9px 12px', fontSize: 13.5, color: theme.colors.textMuted, background: theme.colors.background, borderRadius: theme.radius.sm }}>
                {display}
              </div>
            </div>
          );
        }

        if (field.type === 'checkbox') {
          return (
            <label key={field.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13.5 }}>
              <input type="checkbox" checked={!!value} onChange={(e) => onChange(field.name, e.target.checked)} />
              {field.label}
            </label>
          );
        }

        if (field.type === 'select') {
          return (
            <SelectField key={field.name} label={field.label} value={value} onChange={(e) => onChange(field.name, e.target.value)}>
              <option value="">Select...</option>
              {field.options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </SelectField>
          );
        }

        return (
          <FormField
            key={field.name}
            label={field.label}
            type={field.type}
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );
      })}

      {error && <p style={{ color: theme.colors.danger, fontSize: 13 }}>{error}</p>}

      {!hideSubmit && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          {children}
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '10px 18px', borderRadius: theme.radius.sm, fontSize: 13.5, fontWeight: 600,
              cursor: 'pointer', border: 'none', background: theme.colors.navy, color: theme.colors.white,
            }}
          >
            {submitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      )}
    </form>
  );
}