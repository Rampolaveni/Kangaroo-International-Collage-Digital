import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import type { CSSProperties } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left branding panel */}
      <div style={styles.leftPanel}>
        <div style={styles.decorativeCircle} />

        <div style={styles.brandRow}>
          <div style={styles.logoBox}>K</div>
          <div>
            <div style={styles.brandName}>Kangaroo</div>
            <div style={styles.brandSub}>INTERNATIONAL COLLEGE</div>
          </div>
        </div>

        <div style={styles.heroContent}>
          <div style={styles.eyebrow}>COLLEGE ADMINISTRATION</div>
          <h1 style={styles.headline} className="font-display">
            Everything your campus needs, in one secure place.
          </h1>
          <p style={styles.heroBody}>
            Manage students, enrolments, compliance, classes and academic
            operations from a single workspace.
          </p>

          <div style={styles.statsRow}>
            <div>
              <div style={styles.statNum}>01</div>
              <div style={styles.statLabel}>Student records</div>
            </div>
            <div>
              <div style={styles.statNum}>02</div>
              <div style={styles.statLabel}>Compliance</div>
            </div>
            <div>
              <div style={styles.statNum}>03</div>
              <div style={styles.statLabel}>Learning</div>
            </div>
          </div>
        </div>

        <div style={styles.footerTag}>Empowering education. Supporting every journey.</div>
      </div>

      {/* Right login panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formWrapper}>
          <div style={styles.portalTag}>ADMIN PORTAL</div>
          <h2 style={styles.welcomeHeadline} className="font-display">Welcome back</h2>
          <p style={styles.welcomeSub}>Sign in with your authorised college account.</p>

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="name@kicollege.edu.au or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />

            <div style={styles.passwordLabelRow}>
              <label style={styles.label}>Password</label>
              <a href="#" style={styles.forgotLink}>Forgot password?</a>
            </div>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.input, marginBottom: 0 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
              />
              <span>Keep me signed in on this device</span>
            </label>

            {error && <p style={styles.errorText}>{error}</p>}

            <button type="submit" disabled={loading} style={styles.submitButton}>
              {loading ? 'Signing in...' : 'Sign in to Admin Portal →'}
            </button>
          </form>

          <div style={styles.noticeBox}>
            <strong>Protected access</strong>
            <p style={styles.noticeText}>
              For authorised college staff only. Activity may be monitored for security and compliance.
            </p>
          </div>

          <p style={styles.supportText}>
            Having trouble signing in? <a href="#" style={styles.forgotLink}>Contact IT support</a>
          </p>
        </div>

        <div style={styles.legalFooter}>
          <span>© 2026 Kangaroo International College</span>
          <span>
            <a href="#" style={styles.legalLink}>Privacy</a>{' '}
            <a href="#" style={styles.legalLink}>Terms</a>
          </span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
  },
  leftPanel: {
    flex: '0 0 45%',
    background: 'linear-gradient(160deg, #0f2942 0%, #163a5c 100%)',
    color: '#fff',
    padding: '48px 56px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    top: '15%',
    right: '-10%',
    width: 320,
    height: 320,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    zIndex: 1,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: '#f5a623',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 20,
    color: '#0f2942',
  },
  brandName: {
    fontWeight: 700,
    fontSize: 18,
  },
  brandSub: {
    fontSize: 11,
    letterSpacing: 1,
    opacity: 0.7,
  },
  heroContent: {
    zIndex: 1,
    marginTop: 40,
  },
  eyebrow: {
    color: '#f5a623',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  headline: {
    fontSize: 42,
    lineHeight: 1.15,
    marginBottom: 20,
    fontWeight: 400,
  },
  heroBody: {
    fontSize: 15,
    lineHeight: 1.6,
    opacity: 0.8,
    maxWidth: 420,
    marginBottom: 36,
  },
  statsRow: {
    display: 'flex',
    gap: 40,
    paddingTop: 24,
    borderTop: '1px solid rgba(255,255,255,0.15)',
  },
  statNum: {
    color: '#f5a623',
    fontWeight: 700,
    fontSize: 13,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.85,
  },
  footerTag: {
    fontSize: 13,
    opacity: 0.6,
    zIndex: 1,
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '64px 80px',
  },
  formWrapper: {
    maxWidth: 440,
    width: '100%',
    margin: '0 auto',
  },
  portalTag: {
    color: '#f5a623',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  welcomeHeadline: {
    fontSize: 36,
    fontWeight: 400,
    marginBottom: 8,
  },
  welcomeSub: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: 14,
    border: '1px solid #d0d5dd',
    borderRadius: 8,
    marginBottom: 20,
    outline: 'none',
  },
  passwordLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passwordWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: 12,
    cursor: 'pointer',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#444',
    marginBottom: 24,
    cursor: 'pointer',
  },
  forgotLink: {
    fontSize: 13,
    color: '#1a56c4',
    textDecoration: 'none',
  },
  errorText: {
    color: '#c0392b',
    fontSize: 13,
    marginBottom: 16,
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    background: '#1a56c4',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  noticeBox: {
    marginTop: 28,
    padding: 16,
    background: '#f5f6f8',
    borderRadius: 10,
    fontSize: 13,
  },
  noticeText: {
    color: '#666',
    marginTop: 4,
    lineHeight: 1.5,
  },
  supportText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
    marginTop: 24,
  },
  legalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    color: '#999',
    maxWidth: 440,
    margin: '0 auto',
    width: '100%',
  },
  legalLink: {
    color: '#999',
    textDecoration: 'none',
    marginLeft: 12,
  },
};