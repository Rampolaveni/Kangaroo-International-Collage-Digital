import { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { theme } from '../../styles/theme';

interface InlineFieldProps {
  label: string;
  value: any;
  type: 'text' | 'email' | 'date' | 'checkbox' | 'select' | 'readonly';
  options?: { value: string; label: string }[];
  onSave: (value: any) => Promise<void>;
}

function displayValue(val: any, type: string) {
  if (val === null || val === undefined || val === '') return '—';
  if (type === 'checkbox') return val ? 'Yes' : 'No';
  if (type === 'date') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? val : d.toLocaleDateString();
  }
  if (type === 'select') return val.toString().replace(/_/g, ' ');
  return val;
}

export default function InlineField({ label, value, type, options, onSave }: InlineFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? '');
  const [saving, setSaving] = useState(false);
  const [hover, setHover] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    setDraft(value ?? '');
  }, [value]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = async () => {
    setSaving(true);
    try {
      await onSave(draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setDraft(value ?? '');
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') cancel();
  };

  if (type === 'readonly') {
    return (
      <div>
        <div style={{ fontSize: 11, color: theme.colors.textFaint, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.3 }}>{label}</div>
        <div style={{ fontSize: 13.5, color: theme.colors.textMuted }}>{displayValue(value, type)}</div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ minHeight: 44 }}
    >
      <div style={{ fontSize: 11, color: theme.colors.textFaint, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.3 }}>{label}</div>

      {!editing ? (
        <div
          onClick={() => setEditing(true)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            fontSize: 13.5, color: theme.colors.text, cursor: 'pointer',
            padding: '4px 6px', margin: '-4px -6px', borderRadius: 6,
            background: hover ? theme.colors.background : 'transparent',
          }}
        >
          <span>{displayValue(value, type)}</span>
          {hover && <Pencil size={12} color={theme.colors.textFaint} />}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {type === 'checkbox' ? (
            <input
              ref={inputRef as any}
              type="checkbox"
              checked={!!draft}
              onChange={(e) => setDraft(e.target.checked)}
              onKeyDown={handleKeyDown}
            />
          ) : type === 'select' ? (
            <select
              ref={inputRef as any}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ flex: 1, padding: '6px 8px', fontSize: 13, border: `1px solid ${theme.colors.navy}`, borderRadius: 6, outline: 'none' }}
            >
              <option value="">Select...</option>
              {options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          ) : (
            <input
              ref={inputRef as any}
              type={type}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ flex: 1, padding: '6px 8px', fontSize: 13, border: `1px solid ${theme.colors.navy}`, borderRadius: 6, outline: 'none' }}
            />
          )}
          <button onClick={commit} disabled={saving} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.colors.success, display: 'flex' }}>
            <Check size={16} />
          </button>
          <button onClick={cancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.colors.danger, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}