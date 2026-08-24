import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Building2, MapPin, Users } from 'lucide-react';
import { getCampuses, createCampus, updateCampus, deleteCampus } from '../../api/campuses';
import type { Campus } from '../../types/campus';
import { theme } from '../../styles/theme';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import PageHeader from '../../components/common/PageHeader';

const emptyForm = {
  name: '', address: '', city: '', phone: '', email: '',
  capacity: 0, timezone: 'Australia/Melbourne',
};

export default function CampusesPage() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Campus | null>(null);

  const load = () => {
    setLoading(true);
    getCampuses().then(setCampuses).catch(() => setError('Failed to load campuses.')).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = campuses.filter((c) =>
    !search.trim() || c.name.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (c: Campus) => {
    setEditingId(c.id);
    setForm({ name: c.name, address: c.address, city: c.city, phone: c.phone, email: c.email, capacity: c.capacity, timezone: c.timezone });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      if (editingId) await updateCampus(editingId, form);
      else await createCampus(form);
      setModalOpen(false);
      load();
    } catch {
      setFormError('Could not save campus. Check the fields and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCampus(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch {
      setFormError('Could not delete campus.');
    }
  };

  return (
    <div style={{ padding: 28, fontFamily: theme.font.body }}>
      <PageHeader
        title="Campuses"
        subtitle={`${campuses.length} campus${campuses.length !== 1 ? 'es' : ''} across the network`}
        action={<Button icon={<Plus size={15} />} onClick={openCreate}>Add Campus</Button>}
      />

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search campuses..."
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((c) => (
            <div key={c.id} style={{
              background: theme.colors.surface, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`,
              padding: 20, boxShadow: theme.shadow.xs,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: `${theme.colors.navy}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Building2 size={19} color={theme.colors.navy} />
                </div>
                <span style={{
                  padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                  background: c.is_active ? theme.colors.successBg : theme.colors.dangerBg,
                  color: c.is_active ? theme.colors.success : theme.colors.danger,
                }}>
                  {c.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 style={{ fontSize: 15.5, fontWeight: 600, marginBottom: 6 }}>{c.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: theme.colors.textMuted, marginBottom: 4 }}>
                <MapPin size={13} /> {c.city}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: theme.colors.textMuted, marginBottom: 16 }}>
                <Users size={13} /> Capacity: {c.capacity}
              </div>

              <div style={{ display: 'flex', gap: 8, borderTop: `1px solid ${theme.colors.borderLight}`, paddingTop: 12 }}>
                <Button variant="secondary" style={{ flex: 1, padding: '7px 0', fontSize: 12.5, justifyContent: 'center' }} onClick={() => openEdit(c)}>Edit</Button>
                <Button variant="danger" style={{ flex: 1, padding: '7px 0', fontSize: 12.5, justifyContent: 'center' }} onClick={() => setDeleteTarget(c)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Campus' : 'Add Campus'}>
        <form onSubmit={handleSubmit}>
          <FormField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <FormField label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          <FormField label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
          <FormField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <FormField label="Capacity" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
          {formError && <p style={{ color: theme.colors.danger, fontSize: 13 }}>{formError}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save Campus'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Campus">
        <p style={{ fontSize: 14, color: theme.colors.textMuted, marginBottom: 20 }}>
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete Campus</Button>
        </div>
      </Modal>
    </div>
  );
}