import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import portfolioService from '../api/portfolioService';
import ThemeToggle from '../components/ThemeToggle';
import {
  Plus, Edit3, LogOut, Eye, Copy, Check,
  CheckCircle2, Layout, Zap, Globe,
  ArrowRight, Sparkles, BarChart3,
} from 'lucide-react';

/* ── Logo ─────────────────────────────────────────────────────────────────── */
function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="dl1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#dc2626" />
          <stop offset="50%"  stopColor="#9333ea" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
        <linearGradient id="dl2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" stroke="url(#dl1)" strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="20" cy="20" r="12" fill="url(#dl1)" />
      <path d="M14 13h10v3h-7v3h6v3h-6v7h-3V13z" fill="white" />
      <circle cx="34" cy="12" r="2.5" fill="url(#dl2)" />
    </svg>
  );
}

/* ── Stat card ────────────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fp-card p-6 flex flex-col gap-4"
    >
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center"
        style={{ background: `${color}18`, border: `1px solid ${color}33` }}
      >
        {React.cloneElement(icon, { className: 'w-5 h-5', style: { color } })}
      </div>
      <div>
        <p className="text-2xl font-bold font-outfit" style={{ color }}>{value}</p>
        <p className="fp-text-muted text-sm mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

/* ── Progress item ────────────────────────────────────────────────────────── */
function ProgressItem({ label, done, delay }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3"
    >
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
        style={{
          background: done ? 'linear-gradient(135deg,#dc2626,#db2777)' : 'var(--clr-surface-2)',
          border: done ? 'none' : '1px solid var(--clr-border)',
        }}
      >
        {done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
      </div>
      <span className={`text-sm font-medium transition-colors ${done ? 'fp-text' : 'fp-text-dim'}`}>
        {label}
      </span>
      {done && (
        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(220,38,38,0.12)', color: '#f87171' }}>
          Done
        </span>
      )}
    </motion.li>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [copied,    setCopied]    = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    portfolioService.getMyPortfolio()
      .then(data => setPortfolio(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleCopy = async () => {
    const url = `${window.location.origin}/u/${user?.username}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressItems = [
    { label: 'Personal info',   done: !!(portfolio?.personalInfo?.name) },
    { label: 'Work experience', done: portfolio?.experience?.length > 0 },
    { label: 'Education',       done: portfolio?.education?.length > 0 },
    { label: 'Skills',          done: portfolio?.skills?.length > 0 },
    { label: 'Projects',        done: portfolio?.projects?.length > 0 },
    { label: 'Social links',    done: !!(portfolio?.socialLinks?.github || portfolio?.socialLinks?.linkedin) },
  ];
  const doneCount = progressItems.filter(p => p.done).length;
  const pct = Math.round((doneCount / progressItems.length) * 100);

  if (loading) {
    return (
      <div className="fp-page min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="fp-page min-h-screen font-sans selection:bg-purple-500/30">

      {/* ── Nav ── */}
      <nav className="fp-nav sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2.5">
            <Logo size={32} />
            <span className="font-bold font-outfit text-lg hidden sm:block fp-text">
              First<span className="text-gradient">Portfolio</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Avatar chip */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full fp-border border"
              style={{ background: 'rgba(220,38,38,0.08)' }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#dc2626,#db2777)' }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="text-sm font-medium fp-text-muted hidden sm:block">{user?.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 fp-text-dim hover:fp-text rounded-xl transition-all hover:bg-red-500/10"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10"
        >
          <div>
            <p className="text-sm fp-text-muted mb-1">Welcome back,</p>
            <h1 className="text-3xl font-bold font-outfit fp-text">
              {user?.name?.split(' ')[0]} 👋
            </h1>
          </div>
          <Link to="/editor" className="btn-primary self-start sm:self-auto">
            {portfolio ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {portfolio ? 'Edit Portfolio' : 'Create Portfolio'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Layout />}    label="Template"      value={portfolio?.templateId || '—'}                        color="#dc2626" delay={0.05} />
          <StatCard icon={<Globe />}     label="Status"        value={portfolio?.settings?.isPublic ? 'Public' : 'Private'} color="#10b981" delay={0.10} />
          <StatCard icon={<Zap />}       label="Sections done" value={`${doneCount} / ${progressItems.length}`}             color="#9333ea" delay={0.15} />
          <StatCard icon={<BarChart3 />} label="Completion"    value={`${pct}%`}                                            color="#ec4899" delay={0.20} />
        </div>

        {/* ── Main grid ── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Live URL card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="lg:col-span-2 fp-card p-8 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'rgba(220,38,38,0.08)' }} />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: portfolio ? '#10b981' : '#f59e0b' }} />
                <span className="text-xs font-bold uppercase tracking-widest fp-text-muted">
                  {portfolio ? 'Portfolio Live' : 'Not Published'}
                </span>
              </div>

              {portfolio ? (
                <>
                  <h2 className="text-2xl font-bold font-outfit fp-text mb-2">
                    Your portfolio is <span className="text-gradient">live!</span>
                  </h2>
                  <p className="fp-text-muted text-sm mb-6">
                    Share this link with recruiters and on your resume.
                  </p>
                  <div className="fp-url-bar flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 mb-4">
                    <span className="flex-1 text-sm font-mono fp-text-muted px-2 truncate">
                      {window.location.origin}/u/{user?.username}
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <a href={`/u/${user?.username}`} target="_blank" rel="noopener noreferrer"
                        className="btn-ghost py-2 px-4 text-sm">
                        <Eye className="w-4 h-4" /> View
                      </a>
                      <button onClick={handleCopy} className="btn-ghost py-2 px-4 text-sm">
                        {copied
                          ? <><Check className="w-4 h-4 text-green-500" /> Copied!</>
                          : <><Copy className="w-4 h-4" /> Copy</>}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold font-outfit fp-text mb-3">
                    You haven't built your portfolio yet.
                  </h2>
                  <p className="fp-text-muted text-sm mb-6 max-w-md">
                    Get started by choosing a template and adding your details.
                  </p>
                  <Link to="/editor" className="btn-primary self-start">
                    <Sparkles className="w-4 h-4" /> Start building
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* ── Progress card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="fp-card p-7"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold font-outfit fp-text">Setup Progress</h3>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(220,38,38,0.12)', color: '#f87171' }}>
                {pct}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full mb-6 fp-progress-track">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg,#dc2626,#db2777)' }}
              />
            </div>

            <ul className="space-y-3.5">
              {progressItems.map((item, i) => (
                <ProgressItem key={item.label} {...item} delay={0.35 + i * 0.06} />
              ))}
            </ul>

            {doneCount === progressItems.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-5 p-3 rounded-xl text-center text-sm font-semibold"
                style={{ background: 'rgba(220,38,38,0.10)', color: '#f87171', border: '1px solid rgba(220,38,38,0.20)' }}
              >
                🎉 Portfolio 100% complete!
              </motion.div>
            )}
          </motion.div>

          {/* ── Quick actions ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="lg:col-span-2 fp-card p-7"
          >
            <h3 className="font-bold font-outfit fp-text mb-5">Quick Actions</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: 'Edit Portfolio', icon: <Edit3 className="w-5 h-5" />, color: '#dc2626', to: '/editor' },
                { label: 'View Live',      icon: <Eye className="w-5 h-5" />,   color: '#9333ea', to: `/u/${user?.username}` },
                { label: 'Copy URL',       icon: <Copy className="w-5 h-5" />,  color: '#ec4899', action: handleCopy },
              ].map((a) => (
                a.to ? (
                  <Link key={a.label} to={a.to}
                    className="flex flex-col items-center gap-2.5 p-5 rounded-2xl fp-border border hover:border-red-500/30 transition-all group hover:-translate-y-0.5 fp-inner-card">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ background: `${a.color}18`, color: a.color }}>
                      {a.icon}
                    </div>
                    <span className="text-sm font-medium fp-text-muted">{a.label}</span>
                  </Link>
                ) : (
                  <button key={a.label} onClick={a.action}
                    className="flex flex-col items-center gap-2.5 p-5 rounded-2xl fp-border border hover:border-red-500/30 transition-all group hover:-translate-y-0.5 fp-inner-card">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ background: `${a.color}18`, color: a.color }}>
                      {a.icon}
                    </div>
                    <span className="text-sm font-medium fp-text-muted">{a.label}</span>
                  </button>
                )
              ))}
            </div>
          </motion.div>

          {/* ── Profile card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="fp-card p-7"
          >
            <h3 className="font-bold font-outfit fp-text mb-5">Account</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg,#dc2626,#db2777)' }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold fp-text truncate">{user?.name}</p>
                  <p className="text-xs fp-text-muted truncate">@{user?.username}</p>
                </div>
              </div>

              <div className="fp-divider border-t pt-4 space-y-2.5">
                {[
                  { label: 'Email',    value: user?.email },
                  { label: 'Username', value: `@${user?.username}` },
                  { label: 'Plan',     value: user?.isPremium ? 'Premium ✨' : 'Free' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs fp-text-dim">{label}</span>
                    <span className="text-xs font-medium fp-text-muted truncate max-w-[60%] text-right">{value}</span>
                  </div>
                ))}
              </div>

              <button onClick={handleLogout} className="btn-ghost w-full py-2.5 text-sm mt-1">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
