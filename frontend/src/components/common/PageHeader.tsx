import type { ReactNode } from 'react';
import { theme } from '../../styles/theme';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontFamily: theme.font.display, fontWeight: 400, fontSize: 24, marginBottom: subtitle ? 4 : 0 }}>
          {title}
        </h1>
        {subtitle && <p style={{ color: theme.colors.textMuted, fontSize: 13.5 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}