import type { InputHTMLAttributes } from 'react';
import { theme } from '../../styles/theme';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function FormField({ label, style, ...rest }: FormFieldProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: theme.colors.text }}>
        {label}
      </label>
      <input
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: 14,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.sm,
          outline: 'none',
          fontFamily: theme.font.body,
          boxSizing: 'border-box',
          ...style,
        }}
        {...rest}
      />
    </div>
  );
}