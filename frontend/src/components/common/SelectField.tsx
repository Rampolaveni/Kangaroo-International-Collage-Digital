import type { SelectHTMLAttributes, ReactNode } from 'react';
import { theme } from '../../styles/theme';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

export default function SelectField({ label, children, style, ...rest }: SelectFieldProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: theme.colors.text }}>
        {label}
      </label>
      <select
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: 14,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.sm,
          outline: 'none',
          fontFamily: theme.font.body,
          boxSizing: 'border-box',
          background: theme.colors.white,
          ...style,
        }}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}