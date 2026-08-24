import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { getTrainers } from '../../api/trainers';
import type { Trainer } from '../../types/trainer';
import { theme } from '../../styles/theme';
import PageHeader from '../../components/common/PageHeader';

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getTrainers()
      .then(setTrainers)
      .catch(() => setError('Failed to load trainers.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = trainers.filter((t) =>
    !search.trim() ||
    t.username.toLowerCase().includes(search.toLowerCase()) ||
    t.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const employmentBadge = (type: string) => {
    switch (type) {
      case 'FULL_TIME': return { bg: theme.colors.successBg, fg: theme.colors.success };
      case 'PART_TIME': return { bg: theme.colors.infoBg, fg: theme.colors.info };
      case 'CASUAL': return { bg: '#fff6e5', fg: '#b8860b' };
      default: return { bg: '#eee', fg: theme.colors.textMuted };
    }
  };

  return (
    <div style={{ padding: 28, fontFamily: theme.font.body }}>
      <PageHeader
        title="Trainers"
        subtitle={`${trainers.length} trainer${trainers.length !== 1 ? 's' : ''} across the network`}
      />

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by name or specialization..."
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
          {filtered.map((t) => {
            const badge = employmentBadge(t.employment_type);
            return (
              <div key={t.id} style={{
                background: theme.colors.surface, borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`,
                padding: 20, boxShadow: theme.shadow.xs,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #0f2942, #163a5c)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 15,
                  }}>
                    {t.username[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14.5 }}>{t.username}</div>
                    <div style={{ fontSize: 12, color: theme.colors.textMuted }}>{t.specialization || 'General'}</div>
                  </div>
                </div>

                {t.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: theme.colors.textMuted, marginBottom: 10 }}>
                    <Mail size={13} /> {t.email}
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: badge.bg, color: badge.fg }}>
                    {t.employment_type.replace('_', ' ')}
                  </span>
                  {t.campus_names.map((name) => (
                    <span key={name} style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 500, background: theme.colors.background, color: theme.colors.textMuted, border: `1px solid ${theme.colors.border}` }}>
                      {name}
                    </span>
                  ))}
                </div>

                {t.bio && (
                  <p style={{ fontSize: 12.5, color: theme.colors.textMuted, borderTop: `1px solid ${theme.colors.borderLight}`, paddingTop: 12, margin: 0 }}>
                    {t.bio}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}