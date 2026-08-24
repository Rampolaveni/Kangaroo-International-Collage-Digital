import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { getStudent, updateStudent } from '../../api/students';
import { getEnrollmentsByStudent } from '../../api/enrollments';
import type { Student } from '../../types/student';
import type { Enrollment } from '../../types/enrollment';
import { theme } from '../../styles/theme';
import InlineField from '../../components/common/InlineField';
import { studentSections } from '../../config/studentFields';

const statusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE': return { bg: theme.colors.successBg, fg: theme.colors.success };
    case 'ON_LEAVE': return { bg: '#fff6e5', fg: '#b8860b' };
    case 'GRADUATED': return { bg: theme.colors.infoBg, fg: theme.colors.info };
    case 'WITHDRAWN': return { bg: theme.colors.dangerBg, fg: theme.colors.danger };
    default: return { bg: '#eee', fg: theme.colors.textMuted };
  }
};

const enrollmentStatusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE': return { bg: theme.colors.successBg, fg: theme.colors.success };
    case 'COMPLETED': return { bg: theme.colors.infoBg, fg: theme.colors.info };
    case 'WITHDRAWN': return { bg: theme.colors.dangerBg, fg: theme.colors.danger };
    default: return { bg: '#eee', fg: theme.colors.textMuted };
  }
};

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState<Partial<Student>>({});
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getStudent(Number(id))
      .then((s) => {
        setValues(s);
        return getEnrollmentsByStudent(s.user);
      })
      .then(setEnrollments)
      .catch(() => setError('Failed to load student.'))
      .finally(() => setLoading(false));
  }, [id]);

  const saveField = async (fieldName: string, value: any) => {
    if (!id) return;
    const updated = await updateStudent(Number(id), { [fieldName]: value });
    setValues(updated);
  };

  if (loading) return <div style={{ padding: 28, fontFamily: theme.font.body }}>Loading...</div>;
  if (error) return <div style={{ padding: 28, color: theme.colors.danger, fontFamily: theme.font.body }}>{error}</div>;

  const badge = statusBadge(values.status || '');

  return (
    <div style={{ padding: 28, fontFamily: theme.font.body }}>
      <button
        onClick={() => navigate(-1)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: theme.colors.textMuted, cursor: 'pointer', marginBottom: 16, fontSize: 13.5, padding: 0 }}
      >
        <ArrowLeft size={15} /> Back to Students
      </button>

      {/* Header banner */}
      <div style={{ background: theme.colors.surface, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadow.xs, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 24 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 22, flexShrink: 0,
          }}>
            {values.username?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, color: theme.colors.textFaint, marginBottom: 2 }}>Students / {values.username}</div>
            <h1 style={{ fontFamily: theme.font.display, fontWeight: 400, fontSize: 22, marginBottom: 6 }}>{values.username}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: badge.bg, color: badge.fg }}>
                {values.status?.replace('_', ' ')}
              </span>
              {values.citizenship && (
                <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 500, background: theme.colors.background, color: theme.colors.textMuted, border: `1px solid ${theme.colors.border}` }}>
                  {values.citizenship}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: `1px solid ${theme.colors.borderLight}`, background: theme.colors.background }}>
          {[
            { label: 'Student ID', value: values.student_id },
            { label: 'Campus', value: values.campus_name },
            { label: 'Enrollment Date', value: values.enrollment_date ? new Date(values.enrollment_date).toLocaleDateString() : '—' },
            { label: 'USI', value: values.usi || '—' },
          ].map((h, idx) => (
            <div key={h.label} style={{ padding: '14px 20px', borderLeft: idx > 0 ? `1px solid ${theme.colors.borderLight}` : 'none' }}>
              <div style={{ fontSize: 11, color: theme.colors.textFaint, marginBottom: 3 }}>{h.label}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{h.value}</div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 12, color: theme.colors.textFaint, marginBottom: 16 }}>
        Click any field below to edit it. Press Enter to save, Escape to cancel.
      </p>

      {/* Two-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, alignItems: 'start' }}>
        <div>
          {studentSections.map((section) => (
            <div key={section.title} style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md, boxShadow: theme.shadow.xs, padding: 22, marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>{section.title}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                {section.fields.map((f) => (
                  <InlineField
                    key={f.name}
                    label={f.label}
                    type={f.type}
                    options={f.options}
                    value={(values as any)[f.name]}
                    onSave={(val) => saveField(f.name, val)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md, boxShadow: theme.shadow.xs, padding: 20, position: 'sticky', top: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <ClipboardList size={16} color={theme.colors.textMuted} />
            <h3 style={{ fontSize: 13.5, fontWeight: 600 }}>Enrolments</h3>
          </div>
          {enrollments.length === 0 && <p style={{ fontSize: 12.5, color: theme.colors.textFaint }}>No enrolments yet.</p>}
          {enrollments.map((en) => {
            const eb = enrollmentStatusBadge(en.status);
            return (
              <div key={en.id} style={{ padding: '10px 0', borderBottom: `1px solid ${theme.colors.borderLight}` }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{en.course_name}</div>
                <div style={{ fontSize: 11.5, color: theme.colors.textFaint, marginBottom: 6 }}>{en.course_code}</div>
                <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10.5, fontWeight: 600, background: eb.bg, color: eb.fg }}>{en.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}