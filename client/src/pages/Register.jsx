import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  User, Mail, Lock, Loader2, AlertCircle,
  ArrowRight, Eye, EyeOff, AtSign, CheckCircle2,
} from 'lucide-react';

/* ── Logo ─────────────────────────────────────────────────────────────────── */
function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="rl1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#dc2626" />
          <stop offset="50%"  stopColor="#9333ea" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
        <linearGradient id="rl2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" stroke="url(#rl1)" strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="20" cy="20" r="12" fill="url(#rl1)" />
      <path d="M14 13h10v3h-7v3h6v3h-6v7h-3V13z" fill="white" />
      <circle cx="34" cy="12" r="2.5" fill="url(#rl2)" />
    </svg>
  );
}

/* ── Orb ──────────────────────────────────────────────────────────────────── */
function Orb({ className, style }) {
  return <div className={`glow-orb ${className}`} style={style} />;
}

/* ── Field wrapper ────────────────────────────────────────────────────────── */
function Field({ label, id, icon: Icon, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-300 pl-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon className="w-4 h-4 text-slate-500" />
        </div>
        {children}
      </div>
      {hint && <p className="text-xs text-slate-600 pl-1">{hint}</p>}
    </div>
  );
}

/* ── Password strength meter ──────────────────────────────────────────────── */
function StrengthMeter({ password }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#ef4444', '#f59e0b', '#10b981', '#a855f7'];

  if (!password) return null;
  return (
    <div className="flex items-center gap-2 mt-1.5 pl-1">
      <div className="flex gap-1 flex-1">
        {[1,2,3,4].map(i => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : 'rgba(255,255,255,0.08)' }}
          />
        ))}
      </div>
      <span className="text-xs font-medium" style={{ color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   REGISTER PAGE
══════════════════════════════════════════════════════════════════════════ */
const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', username: '' });
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password, formData.username);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const perks = [
    'Free portfolio URL — yourname.firstportfolio.app',
    'Real-time editor with live preview',
    '10+ recruiter-tested templates',
    'Mobile-perfect on every device',
  ];

  return (
    <div className="page-space min-h-screen flex">

      {/* Orbs */}
      <Orb className="glow-orb-red    w-80 h-80 -top-10 -right-10 opacity-45" />
      <Orb className="glow-orb-purple w-96 h-96 bottom-0 left-0 opacity-30" />
      <Orb className="glow-orb-pink   w-56 h-56 top-1/3 right-1/3 opacity-20" />

      {/* ════════════════════════════════════════════════════════════════════
          LEFT PANEL
      ════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-14 z-10">

        <Link to="/" className="flex items-center gap-3">
          <Logo size={38} />
          <span className="text-xl font-bold font-outfit">
            First<span className="text-gradient">Portfolio</span>
          </span>
        </Link>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="badge-purple mb-6 w-fit">✦ Join 2,400+ students</p>
            <h1 className="text-5xl font-bold font-outfit leading-[1.1] mb-5">
              Build your<br />
              portfolio in<br />
              <span className="text-gradient">under 5 min.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              No code. No design skills. Just your story — told beautifully.
            </p>
          </motion.div>

          {/* Perks list */}
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-10 space-y-3"
          >
            {perks.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.5 }}
                className="flex items-center gap-3 text-sm text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                {p}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex gap-8"
        >
          {[['2,400+','Portfolios live'],['100%','Free to start'],['< 5 min','Setup time']].map(([v,l]) => (
            <div key={l}>
              <p className="text-xl font-bold font-outfit text-gradient">{v}</p>
              <p className="text-xs text-slate-500 mt-0.5">{l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          RIGHT PANEL — form
      ════════════════════════════════════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2.5 mb-8 justify-center">
            <Logo size={32} />
            <span className="text-lg font-bold font-outfit">
              First<span className="text-gradient">Portfolio</span>
            </span>
          </Link>

          {/* Card */}
          <div className="auth-card p-8 sm:p-10">

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold font-outfit mb-1.5">Create your account</h2>
              <p className="text-slate-400 text-sm">
                Already have one?{' '}
                <Link to="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 rounded-xl mb-6 border border-red-500/20"
                style={{ background: 'rgba(239,68,68,0.08)' }}
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name + Username — 2 col */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full name" id="name" icon={User}>
                  <input
                    id="name" name="name" type="text" required
                    value={formData.name} onChange={handleChange}
                    className="fp-input" placeholder="John Doe"
                  />
                </Field>
                <Field label="Username" id="username" icon={AtSign}>
                  <input
                    id="username" name="username" type="text" required
                    value={formData.username} onChange={handleChange}
                    className="fp-input" placeholder="johndoe"
                  />
                </Field>
              </div>

              {/* Email */}
              <Field label="Email address" id="email" icon={Mail}>
                <input
                  id="email" name="email" type="email" required
                  value={formData.email} onChange={handleChange}
                  className="fp-input" placeholder="name@example.com"
                />
              </Field>

              {/* Password */}
              <Field
                label="Password" id="password" icon={Lock}
                hint="Min 8 chars, one uppercase, one number"
              >
                <input
                  id="password" name="password"
                  type={showPwd ? 'text' : 'password'} required
                  value={formData.password} onChange={handleChange}
                  className="fp-input pr-11" placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <StrengthMeter password={formData.password} />
              </Field>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox" required
                  className="w-4 h-4 mt-0.5 rounded border-white/10 bg-white/5 accent-purple-500 shrink-0"
                />
                <span className="text-xs text-slate-400 leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-red-400 hover:text-red-300 transition-colors">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-red-400 hover:text-red-300 transition-colors">Privacy Policy</a>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-1"
              >
                {loading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <><span>Create free account</span><ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>

            {/* Divider */}
            <div className="divider-text my-6">or sign up with</div>

            {/* Social stubs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Google', icon: 'G' },
                { label: 'GitHub', icon: '⌥' },
              ].map((s) => (
                <button key={s.label} type="button" className="btn-ghost py-2.5 text-sm">
                  <span className="font-bold">{s.icon}</span> {s.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            Free forever on the starter plan. No credit card required.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
