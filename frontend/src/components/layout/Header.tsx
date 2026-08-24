import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useAuth } from '../../auth/AuthContext';

const labelMap: Record<string, string> = {
  'super-admin': 'Dashboard',
  campuses: 'Campuses',
  courses: 'Courses',
  trainers: 'Trainers',
  enrollments: 'Enrolments',
  users: 'Users',
};

export default function Header() {
  const location = useLocation();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const segments = location.pathname.split('/').filter(Boolean);
  const crumbs = segments.map((seg, idx) => {
    const path = '/' + segments.slice(0, idx + 1).join('/');
    const label = labelMap[seg] || (isNaN(Number(seg)) ? seg : `#${seg}`);
    return { path, label };
  });

  const currentLabel = crumbs[crumbs.length - 1]?.label.replace('-', ' ') || 'Overview';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 32px',
        borderBottom: `1px solid ${theme.colors.border}`,
        background: theme.colors.surface,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        gap: 24,
      }}
    >
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: theme.colors.textFaint, whiteSpace: 'nowrap' }}>
        <span>Overview</span>
        <span>/</span>
        <span style={{ color: theme.colors.text, fontWeight: 600, textTransform: 'capitalize' }}>
          {currentLabel}
        </span>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', flex: 1, maxWidth: 480 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: theme.colors.textFaint }} />
        <input
          type="text"
          placeholder="Search students, courses, trainers, campuses..."
          style={{
            width: '100%',
            padding: '10px 44px 10px 40px',
            fontSize: 13.5,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.md,
            outline: 'none',
            background: theme.colors.background,
            boxSizing: 'border-box',
          }}
        />
        <span
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            fontSize: 11, color: theme.colors.textFaint, border: `1px solid ${theme.colors.border}`,
            borderRadius: 4, padding: '1px 6px', background: theme.colors.surface,
          }}
        >
          ⌘K
        </span>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        

        <button
          aria-label="Notifications"
          style={{
            background: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '50%',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: theme.colors.textMuted,
            position: 'relative',
          }}
        >
          <Bell size={17} />
          <span style={{
            position: 'absolute', top: 8, right: 9, width: 7, height: 7,
            borderRadius: '50%', background: theme.colors.danger, border: `1.5px solid ${theme.colors.surface}`,
          }} />
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0f2942, #163a5c)',
              color: theme.colors.white, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 600,
            }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div style={{ fontSize: 13, textAlign: 'left' }}>
              <div style={{ fontWeight: 600, color: theme.colors.text }}>{user?.username}</div>
              <div style={{ color: theme.colors.textMuted, fontSize: 11 }}>{user?.role.replace('_', ' ')}</div>
            </div>
            <ChevronDown size={14} color={theme.colors.textFaint} />
          </button>

          {menuOpen && (
            <div
              style={{
                position: 'absolute', right: 0, top: '115%', background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md,
                boxShadow: theme.shadow.lg, minWidth: 160, overflow: 'hidden', zIndex: 20,
              }}
            >
            </div>
          )}
        </div>
      </div>
    </div>
  );
}