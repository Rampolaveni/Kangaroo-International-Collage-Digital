import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import apiClient from '../../api/client';
import { theme } from '../../styles/theme';
import Button from '../../components/common/Button';
import DynamicForm from '../../components/common/DynamicForm';
import { userFields } from '../../config/userFields';

const roleBadgeColor = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN': return { bg: '#fdecea', fg: '#c0392b' };
    case 'ADMIN': return { bg: '#eaf1fd', fg: '#1a56c4' };
    case 'TRAINER': return { bg: '#fff6e5', fg: '#b8860b' };
    case 'STUDENT': return { bg: theme.colors.successBg, fg: theme.colors.success };
    default: return { bg: '#eee', fg: theme.colors.textMuted };
  }
};

const avatarGradient = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN': return 'linear-gradient(135deg, #c0392b, #e74c3c)';
    case 'ADMIN': return 'linear-gradient(135deg, #1a56c4, #3b82f6)';
    case 'TRAINER': return 'linear-gradient(135deg, #b8860b, #f5a623)';
    default: return 'linear-gradient(135deg, #16a34a, #22c55e)';
  }
};

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiClient.get(`/auth/users/${id}/`)
      .then((res) => setValues(res.data))
      .catch(() => setError('Failed to load user.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      const res = await apiClient.patch(`/auth/users/${id}/`, values);
      setValues(res.data);
      setSaved(true);
    } catch {
      setFormError('Could not save changes. Check the fields and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: 28, fontFamily: theme.font.body }}>Loading...</div>;
  if (error) return <div style={{ padding: 28, color: theme.colors.danger, fontFamily: theme.font.body }}>{error}</div>;

  const badge = roleBadgeColor(values.role);

  return (
    <div style={{ padding: 28, fontFamily: theme.font.body, maxWidth: 640 }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
          color: theme.colors.textMuted, cursor: 'pointer', marginBottom: 20, fontSize: 13.5, padding: 0,
        }}
      >
        <ArrowLeft size={15} /> Back to Users
      </button>

      {/* Profile header card */}
      <div style={{
        background: theme.colors.surface, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadow.xs, padding: 24, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: avatarGradient(values.role),
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20, flexShrink: 0,
        }}>
          {values.username?.[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: theme.font.display, fontWeight: 400, fontSize: 22, marginBottom: 4 }}>
            {values.username}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: badge.bg, color: badge.fg }}>
              {values.role?.replace('_', ' ')}
            </span>
            <span style={{
              padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
              background: values.is_active ? theme.colors.successBg : theme.colors.dangerBg,
              color: values.is_active ? theme.colors.success : theme.colors.danger,
            }}>
              {values.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {saved && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: theme.colors.successBg,
          color: theme.colors.success, borderRadius: theme.radius.sm, fontSize: 13, marginBottom: 16,
        }}>
          <CheckCircle2 size={15} /> Changes saved.
        </div>
      )}

      <div style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md, boxShadow: theme.shadow.xs, padding: 24 }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 16 }}>Profile Details</h3>
        <DynamicForm
          fields={userFields}
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          submitting={submitting}
          error={formError}
        >
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        </DynamicForm>
      </div>
    </div>
  );
}