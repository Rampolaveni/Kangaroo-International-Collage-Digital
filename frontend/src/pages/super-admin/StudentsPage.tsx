import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { getStudents, sendBulkEmail } from '../../api/students';
import type { BulkEmailResult } from '../../api/students';
import type { Student } from '../../types/student';
import { theme } from '../../styles/theme';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SelectField from '../../components/common/SelectField';

const statusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE': return { bg: theme.colors.successBg, fg: theme.colors.success };
    case 'ON_LEAVE': return { bg: '#fff6e5', fg: '#b8860b' };
    case 'GRADUATED': return { bg: theme.colors.infoBg, fg: theme.colors.info };
    case 'WITHDRAWN': return { bg: theme.colors.dangerBg, fg: theme.colors.danger };
    default: return { bg: '#eee', fg: theme.colors.textMuted };
  }
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [category, setCategory] = useState('GENERAL');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<BulkEmailResult | null>(null);

  useEffect(() => {
    getStudents()
      .then(setStudents)
      .catch(() => setError('Failed to load students.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) =>
    !search.trim() ||
    s.username.toLowerCase().includes(search.toLowerCase()) ||
    s.student_id.toLowerCase().includes(search.toLowerCase()) ||
    s.campus_name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((s) => s.id));
  };

  const handleSendEmail = async () => {
    setSending(true);
    setResult(null);
    try {
      const res = await sendBulkEmail({ student_ids: selectedIds, category, subject, message });
      setResult(res);
    } finally {
      setSending(false);
    }
  };

  const closeEmailModal = () => {
    setEmailModalOpen(false);
    setResult(null);
    setSubject('');
    setMessage('');
  };

  return (
    <div style={{ padding: 28, fontFamily: theme.font.body }}>
      <PageHeader
        title="Students"
        subtitle={`${students.length} student${students.length !== 1 ? 's' : ''} enrolled`}
        action={
          selectedIds.length > 0 ? (
            <Button icon={<Mail size={15} />} onClick={() => setEmailModalOpen(true)}>
              Email {selectedIds.length} Selected
            </Button>
          ) : undefined
        }
      />

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by name, student ID, or campus..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 320,
            padding: '9px 12px',
            fontSize: 13.5,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.sm,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: theme.colors.danger }}>{error}</p>}

      {!loading && !error && (
        <div
          style={{
            background: theme.colors.surface,
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadow.xs,
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: theme.colors.background, borderBottom: `1px solid ${theme.colors.border}` }}>
                <th style={{ padding: 12 }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Student</th>
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Student ID</th>
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Campus</th>
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Citizenship</th>
                <th style={{ padding: 12, fontSize: 12.5, color: theme.colors.textMuted, fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: theme.colors.textFaint }}>
                    No students found.
                  </td>
                </tr>
              )}
              {filtered.map((s) => {
                const badge = statusBadge(s.status);
                return (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${theme.colors.borderLight}` }}>
                    <td style={{ padding: 12 }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(s.id)}
                        onChange={() => toggleSelect(s.id)}
                      />
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: 12.5,
                            flexShrink: 0,
                          }}
                        >
                          {s.username[0]?.toUpperCase()}
                        </div>
                        <Link
                          to={`/super-admin/students/${s.id}`}
                          style={{ color: theme.colors.text, textDecoration: 'none', fontWeight: 600, fontSize: 13.5 }}
                        >
                          {s.username}
                        </Link>
                      </div>
                    </td>
                    <td style={{ padding: 12, fontSize: 13, color: theme.colors.textMuted }}>{s.student_id}</td>
                    <td style={{ padding: 12, fontSize: 13, color: theme.colors.textMuted }}>{s.campus_name}</td>
                    <td style={{ padding: 12, fontSize: 13, color: theme.colors.textMuted }}>{s.citizenship || '—'}</td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 11.5,
                          fontWeight: 600,
                          background: badge.bg,
                          color: badge.fg,
                        }}
                      >
                        {s.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={emailModalOpen}
        onClose={closeEmailModal}
        title={`Email ${selectedIds.length} Student${selectedIds.length !== 1 ? 's' : ''}`}
      >
        {!result ? (
          <>
            <SelectField label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="GENERAL">General Announcement</option>
              <option value="SCHEDULE">Schedule Notice</option>
              <option value="WARNING">Warning</option>
              <option value="COMPLIANCE">Compliance Reminder</option>
            </SelectField>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 14,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radius.sm,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 14,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radius.sm,
                  boxSizing: 'border-box',
                  fontFamily: theme.font.body,
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button variant="secondary" onClick={closeEmailModal}>Cancel</Button>
              <Button onClick={handleSendEmail} disabled={sending || !subject || !message}>
                {sending ? 'Sending...' : `Send to ${selectedIds.length}`}
              </Button>
            </div>
          </>
        ) : (
          <div>
            <p style={{ fontSize: 14, marginBottom: 12 }}>
              <strong style={{ color: theme.colors.success }}>{result.sent.length}</strong> sent,{' '}
              <strong style={{ color: theme.colors.danger }}>{result.failed.length}</strong> failed out of {result.total}.
            </p>
            {result.failed.length > 0 && (
              <ul style={{ fontSize: 12.5, color: theme.colors.textMuted }}>
                {result.failed.map((f) => (
                  <li key={f.student_id}>{f.student_id}: {f.reason}</li>
                ))}
              </ul>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <Button onClick={closeEmailModal}>Done</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}