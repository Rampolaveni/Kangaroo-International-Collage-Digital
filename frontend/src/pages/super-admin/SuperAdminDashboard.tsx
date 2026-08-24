import { TrendingUp, Minus, GraduationCap, BookOpen, UserCog, Building2, UserPlus, FilePlus, CalendarPlus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { theme } from '../../styles/theme';
import { useAuth } from '../../auth/AuthContext';
import { statCards, enrolmentTrend, studentStatus, recentAdmissions, upcomingSessions } from '../../data/mockDashboard';

const statIcons = [GraduationCap, BookOpen, UserCog, Building2];

const statusColor = (status: string) => {
  switch (status) {
    case 'Approved': return { bg: theme.colors.successBg, fg: theme.colors.success };
    case 'Pending': return { bg: '#fff6e5', fg: '#b8860b' };
    case 'Review': return { bg: theme.colors.infoBg, fg: theme.colors.info };
    default: return { bg: '#eee', fg: theme.colors.textMuted };
  }
};

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const totalStudents = studentStatus.reduce((sum, s) => sum + s.value, 0);

  return (
    <div style={{ padding: 28, fontFamily: theme.font.body }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: theme.font.display, fontWeight: 400, fontSize: 26, marginBottom: 4 }}>
            Good morning, {user?.username} 👋
          </h1>
          <p style={{ color: theme.colors.textMuted, fontSize: 14 }}>
            Here's what's happening across Kangaroo International College today
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {statCards.map((stat, idx) => {
          const Icon = statIcons[idx];
          return (
            <div key={stat.label} style={{
              background: theme.colors.surface, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`,
              padding: 18, boxShadow: theme.shadow.xs,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9, background: `${stat.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={17} color={stat.color} />
                </div>
                <span style={{ fontSize: 13, color: theme.colors.textMuted }}>{stat.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 24, fontWeight: 700 }}>{stat.value}</span>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 600,
                  color: stat.trend === 'up' ? theme.colors.success : theme.colors.textFaint,
                }}>
                  {stat.trend === 'up' ? <TrendingUp size={12} /> : <Minus size={12} />} {stat.change}
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: theme.colors.textFaint }}>{stat.vsLast}</div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ background: theme.colors.surface, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, padding: 20, boxShadow: theme.shadow.xs }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Enrolment Overview</h3>
            <span style={{ fontSize: 12, color: theme.colors.textMuted, border: `1px solid ${theme.colors.border}`, borderRadius: 6, padding: '4px 10px' }}>
              Monthly ▾
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={enrolmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.borderLight} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: theme.colors.textFaint }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: theme.colors.textFaint }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="thisYear" name="This Year" stroke={theme.colors.navy} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="lastYear" name="Last Year" stroke={theme.colors.orange} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: theme.colors.surface, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, padding: 20, boxShadow: theme.shadow.xs }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Student Status</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={studentStatus} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2}>
                {studentStatus.map((s) => <Cell key={s.name} fill={s.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', marginTop: -100, marginBottom: 80 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{totalStudents.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: theme.colors.textMuted }}>Total</div>
          </div>
          {studentStatus.map((s) => (
            <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, marginBottom: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                {s.name}
              </span>
              <span style={{ color: theme.colors.textMuted }}>{s.value} students</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tables row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ background: theme.colors.surface, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, padding: 20, boxShadow: theme.shadow.xs }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Recent Admissions</h3>
            <a href="#" style={{ fontSize: 12.5, color: theme.colors.info, textDecoration: 'none' }}>View all</a>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: theme.colors.textFaint, fontSize: 11.5 }}>
                <th style={{ padding: '6px 8px', fontWeight: 500 }}>Student</th>
                <th style={{ padding: '6px 8px', fontWeight: 500 }}>Course</th>
                <th style={{ padding: '6px 8px', fontWeight: 500 }}>Campus</th>
                <th style={{ padding: '6px 8px', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAdmissions.map((a) => {
                const sc = statusColor(a.status);
                return (
                  <tr key={a.id} style={{ borderTop: `1px solid ${theme.colors.borderLight}` }}>
                    <td style={{ padding: '10px 8px' }}>
                      <div style={{ fontWeight: 600 }}>{a.student}</div>
                      <div style={{ fontSize: 11, color: theme.colors.textFaint }}>{a.id}</div>
                    </td>
                    <td style={{ padding: '10px 8px', color: theme.colors.textMuted }}>{a.course}</td>
                    <td style={{ padding: '10px 8px', color: theme.colors.textMuted }}>{a.campus}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{ background: sc.bg, color: sc.fg, fontSize: 11.5, fontWeight: 600, padding: '3px 9px', borderRadius: 999 }}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ background: theme.colors.surface, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, padding: 20, boxShadow: theme.shadow.xs }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Upcoming Sessions</h3>
            <a href="#" style={{ fontSize: 12.5, color: theme.colors.info, textDecoration: 'none' }}>View all</a>
          </div>
          {upcomingSessions.map((s, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 12, padding: '12px 0', borderTop: idx > 0 ? `1px solid ${theme.colors.borderLight}` : 'none' }}>
              <div style={{ textAlign: 'center', minWidth: 40 }}>
                <div style={{ fontSize: 10, color: theme.colors.textFaint, fontWeight: 600 }}>{s.month}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{s.day}</div>
                <div style={{ fontSize: 9, color: theme.colors.textFaint }}>{s.weekday}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: theme.colors.textMuted }}>Trainer: {s.trainer}</div>
                <div style={{ fontSize: 11.5, color: theme.colors.info }}>{s.location}</div>
                <div style={{ fontSize: 11, color: theme.colors.textFaint, marginTop: 2 }}>{s.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ background: theme.colors.surface, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, padding: 20, boxShadow: theme.shadow.xs }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { icon: UserPlus, label: 'Add student', sub: 'Register a new student' },
            { icon: FilePlus, label: 'Create course', sub: 'Add a new course' },
            { icon: UserCog, label: 'Invite trainer', sub: 'Send an invitation' },
            { icon: CalendarPlus, label: 'Schedule class', sub: 'Create a new session' },
          ].map((action) => (
            <button key={action.label} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: 14,
              border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.sm,
              background: theme.colors.background, cursor: 'pointer', textAlign: 'left',
            }}>
              <action.icon size={18} color={theme.colors.navy} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{action.label}</div>
                <div style={{ fontSize: 11.5, color: theme.colors.textMuted }}>{action.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}