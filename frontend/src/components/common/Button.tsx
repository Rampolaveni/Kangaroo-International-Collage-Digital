import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { theme } from '../../styles/theme';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: ReactNode;
  children: ReactNode;
}

export default function Button({ variant = 'primary', icon, children, style, ...rest }: ButtonProps) {
  const base = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 18px',
    borderRadius: theme.radius.sm,
    fontSize: 13.5,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    fontFamily: theme.font.body,
    transition: theme.transition,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: { background: theme.colors.navy, color: theme.colors.white, boxShadow: theme.shadow.xs },
    secondary: { background: theme.colors.white, color: theme.colors.navy, border: `1px solid ${theme.colors.border}` },
    danger: { background: theme.colors.dangerBg, color: theme.colors.danger, border: `1px solid #f5c6c2` },
  };

  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {icon}
      {children}
    </button>
  );
}