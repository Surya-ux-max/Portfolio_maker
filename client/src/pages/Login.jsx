import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

/* ── Logo ─────────────────────────────────────────────────────────────────── */
function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="ll1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#dc2626" />
          <stop offset="50%"  stopColor="#9333ea" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
        <linearGradient id="ll2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" stroke="url(#ll1)" strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="20" cy="20" r="12" fill="url(#ll1)" />
      <path d="M14 13h10v3h-7v3h6v3h-6v7h-3V13z" fill="white" />
      <circle cx="34" cy="12" r="2.5" fill="url(#ll2)" />
    </svg>
  );
}

/* ── Floating orb ─────────────────────────────────────────────────────────── */
function Orb({ className, style }) {
  return <div className={`glow-orb ${className}`} style={style} />;
}

/* ── Input field wrapper ──────────────────────────────────────────────────── */
function Field({ label, id, icon: Icon, error, children }) {
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
      {error && <p className="text-xs text-red-400 pl-1">{error}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════════════════════════════════ */
const Login = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="page-space min-h-screen flex">

      {/* ── Decorative orbs ── */}
      <Orb className="glow-orb-red    w-96 h-96 -top-20 -left-20 opacity-50" />
      <Orb className="glow-orb-purple w-72 h-72 bottom-10 right-10 opacity-35" />
      <Orb className="glow-orb-pink   w-64 h-64 top-1/2 left-1/3 opacity-25" />

      {/* ════════════════════════════════════════════════════════════════════
          LEFT PANEL — branding + feature highlights
      ════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-14 z-10">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <Logo size={38} />
          <span className="text-xl font-bold font-outfit">
            First<span className="text-gradient">Portfolio</span>
          </span>
        </Link>

        {/* Center copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="badge-purple mb-6 w-fit">✦ Welcome back</p>
            <h1 className="text-5xl font-bold font-outfit leading-[1.1] mb-5">
              Your portfolio<br />
              is waiting<br />
              <span className="text-gradient">for you.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              Sign in to continue building your professional presence and sharing it with the world.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-wrap gap-3 mt-10"
          >
            {['Real-time editor', 'Public URL', 'Mobile ready', 'Free forever'].map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-400 border border-white/8"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                {f}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="p-5 rounded-2xl border border-white/6"
          style={{ background: 'rgba(220,38,38,0.08)' }}
        >
          <p className="text-slate-300 text-sm leading-relaxed italic mb-3">
            "I built my portfolio in 20 minutes and got a callback from Razorpay the same week."
          </p>
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#dc2626,#9333ea)' }}
            >
              AM
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Arjun Mehta</p>
              <p className="text-xs text-slate-500">Frontend Dev @ Razorpay</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          RIGHT PANEL — auth form
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
              <h2 className="text-2xl font-bold font-outfit mb-1.5">Sign in</h2>
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  Create one free
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

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <Field label="Email address" id="email" icon={Mail}>
                <input
                  id="email" name="email" type="email"
                  autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="fp-input"
                  placeholder="name@example.com"
                />
              </Field>

              {/* Password */}
              <Field label="Password" id="password" icon={Lock}>
                <input
                  id="password" name="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="fp-input pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </Field>

              {/* Remember + forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/10 bg-white/5 accent-purple-500"
                  />
                  <span className="text-sm text-slate-400">Remember me</span>
                </label>
                <a href="#" className="text-sm text-red-400 hover:text-red-300 transition-colors font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2"
              >
                {loading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>

            {/* Divider */}
            <div className="divider-text my-6">or continue with</div>

            {/* Social stubs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Google', icon: 'G' },
                { label: 'GitHub', icon: '⌥' },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  className="btn-ghost py-2.5 text-sm"
                >
                  <span className="font-bold">{s.icon}</span> {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-600 mt-6">
            By signing in you agree to our{' '}
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
