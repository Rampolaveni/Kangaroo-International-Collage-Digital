import type { CSSProperties } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, ClipboardCheck, BookOpen, Calendar,
  UserCog, ClipboardList, Monitor, BarChart3, Bell, Settings, LogOut,
  ChevronLeft, HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number }>;
  badge?: number;
  comingSoon?: boolean;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navByRole: Record<string, NavItem[]> = {
  SUPER_ADMIN: [
    { label: 'Dashboard', path: '/super-admin', icon: LayoutDashboard },
    { label: 'Campuses', path: '/super-admin/campuses', icon: Building2 },
    { label: 'Students', path: '/super-admin/students', icon: Users },
    { label: 'Admissions', path: '/super-admin/admissions', icon: ClipboardCheck, comingSoon: true },
    { label: 'Courses', path: '/super-admin/courses', icon: BookOpen },
    { label: 'Intakes', path: '/super-admin/intakes', icon: Calendar, comingSoon: true },
    { label: 'Timetables', path: '/super-admin/timetables', icon: Calendar, comingSoon: true },
    { label: 'Trainers', path: '/super-admin/trainers', icon: UserCog },
    { label: 'Enrolments', path: '/super-admin/enrollments', icon: ClipboardList },
    { label: 'LMS', path: '/super-admin/lms', icon: Monitor, comingSoon: true },
    { label: 'Reports', path: '/super-admin/reports', icon: BarChart3, comingSoon: true },
    { label: 'Users', path: '/super-admin/users', icon: UserCog },
    { label: 'Notifications', path: '/super-admin/notifications', icon: Bell, comingSoon: true },
    { label: 'Settings', path: '/super-admin/settings', icon: Settings, comingSoon: true },
    
  ],
  ADMIN: [{ label: 'Dashboard', path: '/admin', icon: LayoutDashboard }],
  TRAINER: [{ label: 'Dashboard', path: '/trainer', icon: LayoutDashboard }],
  STUDENT: [{ label: 'Dashboard', path: '/student', icon: LayoutDashboard }],
};

const theme_orange = '#f5a623';

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const items = user ? navByRole[user.role] || [] : [];

  return (
    <div style={{ ...styles.sidebar, width: collapsed ? 76 : 248 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '4px 6px' }}>
        <Link
          to={`/${user?.role.toLowerCase().replace('_', '-')}`}
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit', fontFamily: 'inherit', flex: 1, minWidth: 0 }}
        >
          <div style={styles.logoBox}>K</div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={styles.brandName}>Kangaroo</div>
              <div style={styles.brandSub}>{user?.role.replace('_', ' ')}</div>
            </div>
          )}
        </Link>
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0, display: 'flex' }}
        >
          <ChevronLeft
            size={16}
            color="rgba(255,255,255,0.4)"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
          />
        </button>
      </div>

      <nav style={styles.nav}>
        {items.map((item) => {
          const Icon = item.icon;
          if (item.comingSoon) {
            return (
              <div
                key={item.label}
                style={{ ...styles.navItem, ...styles.navItemDisabled }}
                title={collapsed ? item.label : 'Coming soon'}
              >
                <Icon size={17} />
                {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
              </div>
            );
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === `/${user?.role.toLowerCase().replace('_', '-')}`}
              title={collapsed ? item.label : undefined}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              <Icon size={17} />
              {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
              {!collapsed && item.badge ? <span style={styles.badge}>{item.badge}</span> : null}
            </NavLink>
          );
        })}
      </nav>

      {!collapsed && (
        <div style={styles.helpBox}>
          <HelpCircle size={18} color={theme_orange} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 12.5 }}>Help &amp; Support</div>
            <div style={{ fontSize: 11, opacity: 0.65, marginBottom: 6 }}>We're here to help you</div>
            <a href="#" style={styles.contactLink}>Contact support →</a>
          </div>
        </div>
      )}

      <button onClick={logout} style={styles.logoutButton} title={collapsed ? 'Log Out' : undefined}>
        <LogOut size={16} />
        {!collapsed && 'Log Out'}
      </button>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  sidebar: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f2942 0%, #0a1c2e 100%)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: '18px 12px',
    boxShadow: '2px 0 12px rgba(0,0,0,0.08)',
    overflowY: 'auto',
    overflowX: 'hidden',
    transition: 'width 0.2s ease',
    flexShrink: 0,
  },
  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #f5a623, #d98c0f)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 18,
    color: '#0f2942',
    boxShadow: '0 2px 6px rgba(245,166,35,0.4)',
    flexShrink: 0,
  },
  brandName: {
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: 0.2,
    whiteSpace: 'nowrap',
  },
  brandSub: {
    fontSize: 10,
    letterSpacing: 0.6,
    opacity: 0.55,
    textTransform: 'uppercase',
    marginTop: 1,
    whiteSpace: 'nowrap',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    borderRadius: 8,
    color: 'rgba(255,255,255,0.62)',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  },
  navItemActive: {
    background: 'rgba(245,166,35,0.14)',
    color: '#f5a623',
    fontWeight: 600,
  },
  navItemDisabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
  },
  badge: {
    background: '#f5a623',
    color: '#0f2942',
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 999,
    padding: '1px 6px',
  },
  helpBox: {
    display: 'flex',
    gap: 10,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: 12,
    margin: '12px 0',
  },
  contactLink: {
    color: '#f5a623',
    fontSize: 11.5,
    fontWeight: 600,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 9,
    color: 'rgba(255,255,255,0.85)',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
};