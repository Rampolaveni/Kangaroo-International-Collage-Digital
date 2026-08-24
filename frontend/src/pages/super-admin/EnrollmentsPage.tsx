import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { getEnrollments, getStudents, createEnrollment } from '../../api/enrollments';
import { getCourses } from '../../api/courses';
import type { Enrollment, StudentOption } from '../../types/enrollment';
import type { Courses } from '../../types/courses';
import { theme } from '../../styles/theme';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SelectField from '../../components/common/SelectField';
import PageHeader from '../../components/common/PageHeader';

const statusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE': return { bg: theme.colors.successBg, fg: theme.colors.success };
    case 'COMPLETED': return { bg: theme.colors.infoBg, fg: theme.colors.info };
    case 'WITHDRAWN': return { bg: theme.colors.dangerBg, fg: theme.colors.danger };
    default: return { bg: '#eee', fg: theme.colors.textMuted };
  }
};

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [courses, setCourses] = useState<Courses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([getEnrollments(), getStudents(), getCourses()])
      .then(([e, s, c]) => { setEnrollments(e); setStudents(s); setCourses(c); })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const filtered = enrollments.filter((e) =>
    !search.trim() ||
    e.student_username.toLowerCase().includes(search.toLowerCase()) ||
    e.course_code.toLowerCase().includes(search.toLowerCase()) ||
    e.course_name.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setSelectedStudent('');
    setSelectedCourse('');
    setFormError('');
    setModalOpen(true);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!selectedStudent || !selectedCourse) {
      setFormError('Please select both a student and a course.');
      return;
    }
    setSubmitting(true);
    try {
      await createEnrollment(Number(selectedStudent), Number(selectedCourse));
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      const data = err?.response?.data;
      setFormError(data?.non_field_errors?.[0] || data?.student?.[0] || data?.course?.[0] || 'Failed to create enrollment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 28, fontFamily: theme.font.body }}>
      <PageHeader
        title="Enrolments"
        subtitle={`${enrollments.length} enrolment${enrollments.length !== 1 ? 's' : ''} recorded`}
        action={<Button icon={<Plus size={15} />} onClick={openCreate}>Enrol Student</Button>}
      />

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by student or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: 320, padding: '9px 12px', fontSize: 13.5,
            border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.sm, outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: theme.colors.danger }}>{error}</p>}

      {!loading && !error && (
        <div style={{ background: theme.colors.surface, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadow.xs, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: theme.colors.background, borderBottom: `1px solid ${theme.colors.border}` }}>
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Student</th>
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Course</th>
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Status</th>
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: theme.colors.textFaint }}>No enrolments found.</td></tr>
              )}
              {filtered.map((en) => {
                const badge = statusBadge(en.status);
                return (
                  <tr key={en.id} style={{ borderBottom: `1px solid ${theme.colors.borderLight}` }}>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 12, flexShrink: 0,
                        }}>
                          {en.student_username[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 13.5 }}>{en.student_username}</span>
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ClipboardList size={14} color={theme.colors.textFaint} />
                        <div>
                          <div style={{ fontSize: 13 }}>{en.course_name}</div>
                          <div style={{ fontSize: 11, color: theme.colors.textFaint }}>{en.course_code}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: badge.bg, color: badge.fg }}>
                        {en.status}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontSize: 13, color: theme.colors.textMuted }}>
                      {new Date(en.enrolled_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Enrol Student">
        <form onSubmit={handleCreate}>
          <SelectField label="Student" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
            <option value="">Select student...</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.username}</option>)}
          </SelectField>
          <SelectField label="Course" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
            <option value="">Select course...</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
          </SelectField>
          {formError && <p style={{ color: theme.colors.danger, fontSize: 13 }}>{formError}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Enrolling...' : 'Enrol Student'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}