import { useEffect, useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import type { UserAccount } from '../../types/user';
import { useAuth } from '../../auth/AuthContext';
import { theme } from '../../styles/theme';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import PageHeader from '../../components/common/PageHeader';
import { getUsers, createUser, updateUser } from '../../api/users';

type TabKey = 'ALL' | 'ADMIN' | 'TRAINER' | 'STUDENT';

const tabConfig: { key: TabKey; label: string; role?: string }[] = [
  { key: 'ALL', label: 'All Users' },
  { key: 'ADMIN', label: 'Admins', role: 'ADMIN' },
  { key: 'TRAINER', label: 'Trainers', role: 'TRAINER' },
  { key: 'STUDENT', label: 'Students', role: 'STUDENT' },
];

const creatableRolesByCreator: Record<string, string[]> = {
  SUPER_ADMIN: ['ADMIN', 'TRAINER', 'STUDENT'],
  ADMIN: ['TRAINER', 'STUDENT'],
};

const emptyForm = { username: '', email: '', first_name: '', last_name: '', password: '' };
const emptyEditForm = { username: '', email: '', first_name: '', last_name: '', phone_number: '' };

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

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('ALL');

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editTarget, setEditTarget] = useState<UserAccount | null>(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [editError, setEditError] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  const creatableRoles = currentUser ? creatableRolesByCreator[currentUser.role] || [] : [];
  const visibleTabs = tabConfig.filter((t) => !t.role || t.key === 'ALL' || creatableRoles.includes(t.role) || t.role !== 'ADMIN' || currentUser?.role === 'SUPER_ADMIN');

  const load = () => {
    setLoading(true);
    getUsers().then(setUsers).catch(() => setError('Failed to load users.')).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filteredUsers = useMemo(() => {
    let list = users;
    if (activeTab !== 'ALL') list = list.filter((u) => u.role === activeTab);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((u) =>
        u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) ||
        u.first_name.toLowerCase().includes(q) || u.last_name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, activeTab, search]);

  const canAddOnThisTab = activeTab !== 'ALL' && creatableRoles.includes(activeTab);
  const tabLabel = tabConfig.find((t) => t.key === activeTab)?.label || '';

  const openCreate = () => {
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await createUser({ ...form, role: activeTab });
      setModalOpen(false);
      load();
    } catch (err: any) {
      const data = err?.response?.data;
      setFormError(data?.username?.[0] || data?.role?.[0] || data?.password?.[0] || 'Could not create user.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (u: UserAccount) => {
    setEditTarget(u);
    setEditForm({ username: u.username, email: u.email, first_name: u.first_name, last_name: u.last_name, phone_number: u.phone_number });
    setEditError('');
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setEditSubmitting(true);
    setEditError('');
    try {
      await updateUser(editTarget.id, editForm);
      setEditTarget(null);
      load();
    } catch {
      setEditError('Could not update user.');
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 28, fontFamily: theme.font.body }}>
      <PageHeader
        title="Users"
        subtitle={`${users.length} account${users.length !== 1 ? 's' : ''} across all roles`}
        action={canAddOnThisTab ? <Button icon={<Plus size={15} />} onClick={openCreate}>Add {tabLabel.replace(/s$/, '')}</Button> : undefined}
      />

      <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${theme.colors.border}`, marginBottom: 20 }}>
        {visibleTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '10px 18px', background: 'none', border: 'none',
              borderBottom: activeTab === t.key ? `2px solid ${theme.colors.navy}` : '2px solid transparent',
              color: activeTab === t.key ? theme.colors.navy : theme.colors.textMuted,
              fontWeight: activeTab === t.key ? 600 : 400, fontSize: 13.5, cursor: 'pointer', marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 320 }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: theme.colors.textFaint }} />
        <input
          type="text"
          placeholder="Search by username, email, or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '9px 12px 9px 34px', fontSize: 13.5,
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
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>User</th>
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Email</th>
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Role</th>
                <th style={{ padding: 12 }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: theme.colors.textFaint }}>No users found.</td></tr>
              )}
              {filteredUsers.map((u) => {
                const badge = roleBadgeColor(u.role);
                return (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${theme.colors.borderLight}` }}>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%', background: avatarGradient(u.role),
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 13, flexShrink: 0,
                        }}>
                          {u.username[0]?.toUpperCase()}
                        </div>
                        <div>
                          <Link to={`/super-admin/users/${u.id}`} style={{ color: theme.colors.text, textDecoration: 'none', fontWeight: 600, fontSize: 13.5 }}>
                            {u.username}
                          </Link>
                          <div style={{ fontSize: 11.5, color: theme.colors.textFaint }}>
                            {[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 12, fontSize: 13, color: theme.colors.textMuted }}>{u.email || '—'}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: badge.bg, color: badge.fg }}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: 12, textAlign: 'right' }}>
                      <Button variant="secondary" style={{ padding: '6px 12px', fontSize: 12.5 }} onClick={() => openEdit(u)}>Edit</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Add ${tabLabel.replace(/s$/, '')}`}>
        <form onSubmit={handleSubmit}>
          <FormField label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <FormField label="First Name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          <FormField label="Last Name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          <FormField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {formError && <p style={{ color: theme.colors.danger, fontSize: 13 }}>{formError}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : `Create ${tabLabel.replace(/s$/, '')}`}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title={`Edit ${editTarget?.username ?? ''}`}>
        <form onSubmit={handleEditSubmit}>
          <FormField label="Username" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} required />
          <FormField label="Email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
          <FormField label="First Name" value={editForm.first_name} onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })} />
          <FormField label="Last Name" value={editForm.last_name} onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })} />
          <FormField label="Phone" value={editForm.phone_number} onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })} />
          {editError && <p style={{ color: theme.colors.danger, fontSize: 13 }}>{editError}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <Button type="button" variant="secondary" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button type="submit" disabled={editSubmitting}>{editSubmitting ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}