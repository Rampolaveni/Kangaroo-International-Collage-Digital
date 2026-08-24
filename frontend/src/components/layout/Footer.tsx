import { theme } from '../../styles/theme';

export default function Footer() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 32px',
        borderTop: `1px solid ${theme.colors.borderLight}`,
        fontSize: 12,
        color: theme.colors.textFaint,
        background: theme.colors.surface,
      }}
    >
      <span>© 2026 Kangaroo International College</span>
      <span style={{ display: 'flex', gap: 20 }}>
        <a href="#" style={{ color: theme.colors.textFaint, textDecoration: 'none' }}>Privacy</a>
        <a href="#" style={{ color: theme.colors.textFaint, textDecoration: 'none' }}>Terms</a>
        <a href="#" style={{ color: theme.colors.textFaint, textDecoration: 'none' }}>Support</a>
      </span>
    </div>
  );
}