import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../../api/courses';
import { getCampuses } from '../../api/campuses';
import type { Courses } from '../../types/courses';
import type { Campus } from '../../types/campus';
import { theme } from '../../styles/theme';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import SelectField from '../../components/common/SelectField';
import PageHeader from '../../components/common/PageHeader';

const emptyForm = {
  campus: '', name: '', code: '', description: '', duration_weeks: 1,
  fee: '0', start_date: '', end_date: '', max_students: 30,
};

function calculateEndDate(startDate: string, weeks: number): string {
  if (!startDate || !weeks) return '';
  const date = new Date(startDate);
  date.setDate(date.getDate() + weeks * 7);
  return date.toISOString().split('T')[0];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Courses[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Courses | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([getCourses(), getCampuses()])
      .then(([c, camp]) => { setCourses(c); setCampuses(camp); })
      .catch(() => setError('Failed to load courses.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = courses.filter((c) =>
    !search.trim() ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.campus_name.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (c: Courses) => {
    setEditingId(c.id);
    setForm({
      campus: String(c.campus), name: c.name, code: c.code, description: c.description,
      duration_weeks: c.duration_weeks, fee: c.fee, start_date: c.start_date,
      end_date: c.end_date, max_students: c.max_students,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      const payload = { ...form, campus: Number(form.campus) };
      if (editingId) await updateCourse(editingId, payload);
      else await createCourse(payload);
      setModalOpen(false);
      load();
    } catch (err: any) {
      const data = err?.response?.data;
      setFormError(data?.non_field_errors?.[0] || 'Could not save course. Check the fields and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCourse(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch {
      setFormError('Could not delete course.');
    }
  };

  return (
    <div style={{ padding: 28, fontFamily: theme.font.body }}>
      <PageHeader
        title="Courses"
        subtitle={`${courses.length} course${courses.length !== 1 ? 's' : ''} offered`}
        action={<Button icon={<Plus size={15} />} onClick={openCreate}>Add Course</Button>}
      />

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by name, code, or campus..."
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
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Course</th>
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Campus</th>
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Duration</th>
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Fee</th>
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Status</th>
                <th style={{ padding: 12 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${theme.colors.borderLight}` }}>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: `${theme.colors.orange}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BookOpen size={16} color={theme.colors.orangeDark} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name}</div>
                        <div style={{ fontSize: 11.5, color: theme.colors.textFaint }}>{c.code}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 12, fontSize: 13, color: theme.colors.textMuted }}>{c.campus_name}</td>
                  <td style={{ padding: 12, fontSize: 13, color: theme.colors.textMuted }}>{c.duration_weeks} weeks</td>
                  <td style={{ padding: 12, fontSize: 13, fontWeight: 600 }}>${c.fee}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                      background: c.is_active ? theme.colors.successBg : theme.colors.dangerBg,
                      color: c.is_active ? theme.colors.success : theme.colors.danger,
                    }}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: 12, textAlign: 'right' }}>
                    <Button variant="secondary" style={{ marginRight: 8, padding: '6px 12px', fontSize: 12.5 }} onClick={() => openEdit(c)}>Edit</Button>
                    <Button variant="danger" style={{ padding: '6px 12px', fontSize: 12.5 }} onClick={() => setDeleteTarget(c)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Course' : 'Add Course'}>
        <form onSubmit={handleSubmit}>
          <SelectField label="Campus" value={form.campus} onChange={(e) => setForm({ ...form, campus: e.target.value })} required>
            <option value="">Select campus...</option>
            {campuses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </SelectField>
          <FormField label="Course Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <FormField label="Course Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
          <FormField label="Duration (weeks)" type="number" value={form.duration_weeks} onChange={(e) => {
            const weeks = Number(e.target.value);
            setForm({ ...form, duration_weeks: weeks, end_date: calculateEndDate(form.start_date, weeks) });
          }} required />
          <FormField label="Fee ($)" type="number" step="0.01" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} required />
          <FormField label="Start Date" type="date" value={form.start_date} onChange={(e) => {
            const startDate = e.target.value;
            setForm({ ...form, start_date: startDate, end_date: calculateEndDate(startDate, form.duration_weeks) });
          }} required />
          <FormField label="End Date" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
          <FormField label="Max Students" type="number" value={form.max_students} onChange={(e) => setForm({ ...form, max_students: Number(e.target.value) })} required />
          {formError && <p style={{ color: theme.colors.danger, fontSize: 13 }}>{formError}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save Course'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Course">
        <p style={{ fontSize: 14, color: theme.colors.textMuted, marginBottom: 20 }}>
          Are you sure you want to delete <strong>{deleteTarget?.code}</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete Course</Button>
        </div>
      </Modal>
    </div>
  );
}