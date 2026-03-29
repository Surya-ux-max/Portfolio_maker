import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Smartphone, Zap, Palette, Globe, Shield, Star, Users, Clock, CheckCircle, ChevronRight, Github, Twitter, Linkedin, Play } from 'lucide-react';
import BlackHoleScene from '../components/BlackHoleScene';

/* ─── shared fade-up variant ─────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
});

/* ─── Logo SVG ───────────────────────────────────────────────────────────── */
function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="20" cy="20" r="18" stroke="url(#lg1)" strokeWidth="2" fill="none" opacity="0.6" />
      {/* Inner filled circle */}
      <circle cx="20" cy="20" r="12" fill="url(#lg1)" />
      {/* F letterform */}
      <path d="M14 13h10v3h-7v3h6v3h-6v7h-3V13z" fill="white" />
      {/* Orbit dot */}
      <circle cx="34" cy="12" r="2.5" fill="url(#lg2)" />
    </svg>
  );
}

/* ─── Stat card ──────────────────────────────────────────────────────────── */
function StatCard({ value, label, delay }) {
  return (
    <motion.div {...fadeUp(delay)} className="flex flex-col items-start">
      <span
        className="text-2xl font-bold font-outfit text-transparent bg-clip-text"
        style={{ backgroundImage: 'linear-gradient(135deg,#a78bfa,#ec4899)' }}
      >
        {value}
      </span>
      <span className="text-xs text-slate-500 mt-0.5">{label}</span>
    </motion.div>
  );
}

/* ─── Typewriter Signature ───────────────────────────────────────────────── */
function CreatorSignature() {
  const full    = 'crafted by Suryaprakash';
  const [text, setText]       = useState('');
  const [hovered, setHovered] = useState(false);
  const [started, setStarted] = useState(false);
  const idxRef  = useRef(0);
  const timerRef = useRef(null);

  // Start typing only when the element enters the viewport
  const elRef = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (elRef.current) obs.observe(elRef.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    // Small random delay per character — feels hand-typed
    const type = () => {
      if (idxRef.current < full.length) {
        setText(full.slice(0, idxRef.current + 1));
        idxRef.current += 1;
        timerRef.current = setTimeout(type, 55 + Math.random() * 60);
      }
    };
    timerRef.current = setTimeout(type, 600);
    return () => clearTimeout(timerRef.current);
  }, [started]);

  return (
    <div
      ref={elRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center gap-2 cursor-default select-none group"
    >
      {/* Faint orbit ring that glows on hover */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        className="relative w-5 h-5 flex-shrink-0"
      >
        <svg viewBox="0 0 20 20" fill="none" className="w-full h-full">
          <circle
            cx="10" cy="10" r="8"
            stroke={hovered ? '#a78bfa' : '#3f3f5a'}
            strokeWidth="1"
            strokeDasharray="3 3"
            style={{ transition: 'stroke 0.4s' }}
          />
          <circle
            cx="10" cy="2" r="2"
            fill={hovered ? '#ec4899' : '#4a4a6a'}
            style={{ transition: 'fill 0.4s' }}
          />
        </svg>
      </motion.div>

      {/* Typewriter text */}
      <span
        className="font-mono text-xs tracking-widest transition-all duration-500"
        style={{
          color: hovered ? '#c4b5fd' : '#3a3a52',
          textShadow: hovered ? '0 0 12px rgba(167,139,250,0.6)' : 'none',
          letterSpacing: '0.12em',
        }}
      >
        {text}
        {/* Blinking cursor — only while typing */}
        {text.length < full.length && (
          <span
            className="inline-block w-px h-3 ml-0.5 align-middle"
            style={{
              background: hovered ? '#a78bfa' : '#4a4a6a',
              animation: 'blink 0.7s step-end infinite',
            }}
          />
        )}
      </span>

      {/* Hover tooltip — appears above */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? -2 : 4 }}
        transition={{ duration: 0.25 }}
        className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg text-[10px] font-medium pointer-events-none"
        style={{
          background: 'rgba(139,92,246,0.15)',
          border: '1px solid rgba(139,92,246,0.25)',
          color: '#c4b5fd',
          backdropFilter: 'blur(8px)',
        }}
      >
        the mind behind this ✦
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════════════════════════════ */
const LandingPage = () => {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY       = useTransform(scrollY, [0, 400], [0, 60]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans overflow-x-hidden">

      {/* ── R3F Black Hole — fixed full viewport ── */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={null}>
          <BlackHoleScene />
        </Suspense>
      </div>

      {/* ── Left reading veil — only covers left 45%, BH at x=3.2 shows through right ── */}
      <div
        className="fixed inset-y-0 left-0 z-[1] pointer-events-none"
        style={{
          width: '48%',
          background: 'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.70) 50%, rgba(0,0,0,0.20) 80%, transparent 100%)',
        }}
      />

      {/* ── Bottom scroll fade ── */}
      <div
        className="fixed inset-x-0 bottom-0 h-40 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to top,#000 0%,transparent 100%)' }}
      />

      {/* ════════════════════════════════════════════════════════════════════
          NAV
      ════════════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Logo size={34} />
              </motion.div>
              <span className="text-xl font-bold tracking-tight font-outfit">
                First<span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg,#a78bfa,#ec4899)' }}
                >Portfolio</span>
              </span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-8">
              {[['#features','Features'],['#howitworks','How it works'],['#templates','Templates']].map(([href,label]) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group"
                >
                  {label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-purple-400 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Auth */}
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-full text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg,#6d28d9,#9333ea)',
                  boxShadow: '0 0 20px rgba(139,92,246,0.35)',
                }}
              >
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 min-h-screen flex items-center">
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="max-w-7xl mx-auto px-6 lg:px-10 w-full"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center pt-24 pb-20 lg:pt-0 lg:pb-0">

            {/* Left content */}
            <div className="flex flex-col items-start">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border"
                style={{
                  background: 'rgba(139,92,246,0.08)',
                  borderColor: 'rgba(139,92,246,0.25)',
                  color: '#c4b5fd',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                The ultimate portfolio builder for students
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">NEW</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.22,1,0.36,1] }}
                className="text-5xl lg:text-6xl xl:text-[4.5rem] font-bold tracking-tight font-outfit leading-[1.06] mb-6"
              >
                Your Career Starts<br />
                With a{' '}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#ec4899 50%,#818cf8 100%)' }}
                >
                  Stunning
                </span>
                <br />Portfolio
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                className="text-base lg:text-lg text-slate-400 mb-10 leading-relaxed max-w-lg"
              >
                Zero coding required. Fill in your details, pick a beautiful template,
                and get a professional public URL to share with recruiters — in under 5 minutes.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7 }}
                className="flex flex-col sm:flex-row items-start gap-4 mb-12"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-full text-white transition-all group"
                  style={{
                    background: 'linear-gradient(135deg,#6d28d9 0%,#9333ea 50%,#db2777 100%)',
                    boxShadow: '0 0 40px rgba(139,92,246,0.45), 0 4px 24px rgba(0,0,0,0.4)',
                  }}
                >
                  Start Building Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#templates"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-full text-slate-300 border border-white/10 hover:border-purple-500/40 hover:bg-white/5 transition-all backdrop-blur-sm"
                >
                  <Play className="w-4 h-4" /> Watch Demo
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex items-center gap-8"
              >
                <div className="w-px h-8 bg-white/10" />
                <StatCard value="2,400+" label="Portfolios live" delay={0.65} />
                <div className="w-px h-8 bg-white/10" />
                <StatCard value="100%" label="Free to start" delay={0.7} />
                <div className="w-px h-8 bg-white/10" />
                <StatCard value="< 5 min" label="Setup time" delay={0.75} />
              </motion.div>
            </div>

            {/* Right — transparent, black hole shows through */}
            <div className="hidden lg:block" aria-hidden="true" />
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-slate-600 tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-purple-500/60 to-transparent"
          />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════════════════════════ */}
      <section
        id="features"
        className="relative z-10 py-32 border-t border-white/5"
        style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(24px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Header */}
          <motion.div {...fadeUp(0)} className="text-center mb-20">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-5"
              style={{ background:'rgba(139,92,246,0.08)', borderColor:'rgba(139,92,246,0.2)', color:'#c4b5fd' }}
            >
              <Zap className="w-3 h-3" /> Everything you need
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold font-outfit mb-4">
              Built for{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage:'linear-gradient(135deg,#a78bfa,#ec4899)' }}
              >
                speed & impact
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Every tool you need to go from zero to a live portfolio that gets you hired.
            </p>
          </motion.div>

          {/* 6-card grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                color: '#6366f1', glow: 'rgba(99,102,241,0.25)',
                title: 'Real-time Editor',
                desc: 'Side-by-side live preview. Every keystroke reflects instantly — no refresh needed.',
                tag: 'Instant',
              },
              {
                icon: <Palette className="w-6 h-6" />,
                color: '#a855f7', glow: 'rgba(168,85,247,0.25)',
                title: 'Designer Templates',
                desc: 'Curated modern templates built to impress recruiters at top companies.',
                tag: '10+ Templates',
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                color: '#ec4899', glow: 'rgba(236,72,153,0.25)',
                title: 'Mobile Ready',
                desc: 'Pixel-perfect on every screen — desktop, tablet, and mobile out of the box.',
                tag: 'Responsive',
              },
              {
                icon: <Globe className="w-6 h-6" />,
                color: '#06b6d4', glow: 'rgba(6,182,212,0.25)',
                title: 'Public URL',
                desc: 'Get a shareable link like firstportfolio.app/yourname — ready to paste in emails.',
                tag: 'Instant Deploy',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                color: '#10b981', glow: 'rgba(16,185,129,0.25)',
                title: 'Privacy Control',
                desc: 'Toggle your portfolio public or private anytime. You own your data.',
                tag: 'Secure',
              },
              {
                icon: <Star className="w-6 h-6" />,
                color: '#f59e0b', glow: 'rgba(245,158,11,0.25)',
                title: 'One-click Export',
                desc: 'Download your portfolio as a static site or PDF resume at any time.',
                tag: 'Coming Soon',
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.08)}
                className="group relative p-7 rounded-3xl border cursor-default overflow-hidden transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: 'rgba(8,4,18,0.75)',
                  borderColor: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = f.glow;
                  e.currentTarget.style.boxShadow = `0 0 32px ${f.glow}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Glow blob */}
                <div
                  className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                  style={{ background: f.glow }}
                />

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${f.color}22`, border: `1px solid ${f.color}44`, color: f.color }}
                >
                  {f.icon}
                </div>

                {/* Tag */}
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-3"
                  style={{ background: `${f.color}22`, color: f.color }}
                >
                  {f.tag}
                </span>

                <h3 className="text-lg font-bold mb-2 font-outfit">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════════════════════ */}
      <section
        id="howitworks"
        className="relative z-10 py-32"
        style={{ background: 'rgba(4,2,12,0.85)', backdropFilter: 'blur(24px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Header */}
          <motion.div {...fadeUp(0)} className="text-center mb-20">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-5"
              style={{ background:'rgba(139,92,246,0.08)', borderColor:'rgba(139,92,246,0.2)', color:'#c4b5fd' }}
            >
              <CheckCircle className="w-3 h-3" /> Simple process
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold font-outfit mb-4">
              Live in{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage:'linear-gradient(135deg,#a78bfa,#ec4899)' }}
              >
                3 steps
              </span>
            </h2>
            <p className="text-slate-400 max-w-md mx-auto text-base">
              No tutorials, no setup. Just fill, pick, and publish.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="relative">
            {/* Connector line */}
            <div
              className="hidden lg:block absolute top-16 left-[16.66%] right-[16.66%] h-px"
              style={{ background: 'linear-gradient(to right,transparent,rgba(139,92,246,0.4),rgba(236,72,153,0.4),transparent)' }}
            />

            <div className="grid lg:grid-cols-3 gap-10">
              {[
                {
                  step: '01',
                  icon: <Users className="w-7 h-7" />,
                  color: '#a855f7',
                  title: 'Create your account',
                  desc: 'Sign up in seconds. No credit card, no commitment. Just your email and a password.',
                  detail: 'Free forever on the starter plan',
                },
                {
                  step: '02',
                  icon: <Palette className="w-7 h-7" />,
                  color: '#ec4899',
                  title: 'Fill in your details',
                  desc: 'Add your projects, skills, experience and education using our guided editor.',
                  detail: 'Auto-saves as you type',
                },
                {
                  step: '03',
                  icon: <Globe className="w-7 h-7" />,
                  color: '#6366f1',
                  title: 'Publish & share',
                  desc: 'Pick a template, hit publish, and share your unique URL with the world.',
                  detail: 'yourname.firstportfolio.app',
                },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.15)}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Step number + icon */}
                  <div className="relative mb-8">
                    {/* Outer glow ring */}
                    <motion.div
                      animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 3, delay: i * 0.8 }}
                      className="absolute inset-0 rounded-full blur-xl"
                      style={{ background: s.color }}
                    />
                    <div
                      className="relative w-20 h-20 rounded-full flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `${s.color}18`,
                        borderColor: `${s.color}55`,
                        color: s.color,
                        boxShadow: `0 0 24px ${s.color}33`,
                      }}
                    >
                      {s.icon}
                    </div>
                    {/* Step badge */}
                    <div
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                      style={{ background: s.color }}
                    >
                      {s.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-outfit mb-3">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 max-w-xs">{s.desc}</p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background:`${s.color}18`, color: s.color }}
                  >
                    <CheckCircle className="w-3 h-3" /> {s.detail}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA under steps */}
          <motion.div {...fadeUp(0.4)} className="text-center mt-16">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-full text-white transition-all group"
              style={{
                background: 'linear-gradient(135deg,#6d28d9,#9333ea,#db2777)',
                boxShadow: '0 0 40px rgba(139,92,246,0.35)',
              }}
            >
              Get started for free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          TEMPLATES
      ════════════════════════════════════════════════════════════════════ */}
      <section
        id="templates"
        className="relative z-10 py-32 border-t border-white/5"
        style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(24px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <motion.div {...fadeUp(0)} className="text-center mb-16">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-5"
              style={{ background:'rgba(139,92,246,0.08)', borderColor:'rgba(139,92,246,0.2)', color:'#c4b5fd' }}
            >
              <Palette className="w-3 h-3" /> Templates
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold font-outfit mb-4">
              Pick your{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage:'linear-gradient(135deg,#a78bfa,#ec4899)' }}
              >
                perfect look
              </span>
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Every template is mobile-first, recruiter-tested, and fully customizable.
            </p>
          </motion.div>

          {/* Template cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-24">
            {[
              {
                name: 'Modern',
                tag: 'Most Popular',
                tagColor: '#a855f7',
                desc: 'Clean lines, bold typography, dark theme. Perfect for developers.',
                colors: ['#6366f1','#8b5cf6','#a855f7'],
                accent: '#a855f7',
              },
              {
                name: 'Minimal',
                tag: 'Editor\'s Pick',
                tagColor: '#ec4899',
                desc: 'White space, elegant serif fonts. Ideal for designers and writers.',
                colors: ['#ec4899','#f43f5e','#fb7185'],
                accent: '#ec4899',
              },
              {
                name: 'Creative',
                tag: 'New',
                tagColor: '#06b6d4',
                desc: 'Bold gradients, animated sections. Stand out from the crowd.',
                colors: ['#06b6d4','#0ea5e9','#38bdf8'],
                accent: '#06b6d4',
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                className="group relative rounded-3xl overflow-hidden border cursor-pointer transition-all duration-300 hover:-translate-y-2"
                style={{ borderColor:'rgba(255,255,255,0.06)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${t.accent}55`; e.currentTarget.style.boxShadow = `0 0 40px ${t.accent}22`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Preview mockup */}
                <div
                  className="h-52 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg,${t.colors[0]}22,${t.colors[2]}11)` }}
                >
                  {/* Fake browser chrome */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {['#ff5f57','#febc2e','#28c840'].map(c => (
                      <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  {/* Fake content lines */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center gap-3 px-8 pt-6">
                    <div className="w-14 h-14 rounded-full" style={{ background: `linear-gradient(135deg,${t.colors[0]},${t.colors[2]})` }} />
                    <div className="h-2.5 rounded-full w-32" style={{ background: `${t.colors[0]}88` }} />
                    <div className="h-1.5 rounded-full w-24" style={{ background: `${t.colors[1]}55` }} />
                    <div className="flex gap-2 mt-1">
                      {[40,56,44].map((w,j) => (
                        <div key={j} className="h-1 rounded-full" style={{ width: w, background:`${t.colors[2]}44` }} />
                      ))}
                    </div>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background:'rgba(0,0,0,0.5)' }}>
                    <Link
                      to="/register"
                      className="px-5 py-2 rounded-full text-sm font-semibold text-white"
                      style={{ background: t.accent }}
                    >
                      Use this template
                    </Link>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6" style={{ background:'rgba(8,4,18,0.9)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold font-outfit">{t.name}</h3>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background:`${t.tagColor}22`, color: t.tagColor }}
                    >
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Testimonials ── */}
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-outfit mb-2">
              Loved by{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage:'linear-gradient(135deg,#a78bfa,#ec4899)' }}
              >
                students
              </span>
            </h2>
            <p className="text-slate-500 text-sm">Real people, real results.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Arjun Mehta',
                role: 'Frontend Developer @ Razorpay',
                avatar: 'AM',
                color: '#a855f7',
                text: 'I built my portfolio in 20 minutes and got a callback from Razorpay the same week. The templates are genuinely beautiful.',
                stars: 5,
              },
              {
                name: 'Priya Sharma',
                role: 'UI Designer @ Swiggy',
                avatar: 'PS',
                color: '#ec4899',
                text: 'Finally a portfolio tool that doesn\'t look like every other resume site. The Minimal template got me 3 interview calls.',
                stars: 5,
              },
              {
                name: 'Rohan Das',
                role: 'Full Stack Dev @ Startup',
                avatar: 'RD',
                color: '#6366f1',
                text: 'Setup took 4 minutes. I shared the link in my LinkedIn bio and my profile views doubled. Highly recommend.',
                stars: 5,
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                className="p-7 rounded-3xl border"
                style={{
                  background: 'rgba(8,4,18,0.75)',
                  borderColor: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array(t.stars).fill(0).map((_,j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">“{t.text}”</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: `linear-gradient(135deg,${t.color},${t.color}88)` }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative z-10 py-28 overflow-hidden"
        style={{ background: 'rgba(2,1,8,0.92)' }}
      >
        {/* Glow orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ background: 'linear-gradient(135deg,#6d28d9,#db2777)' }}
        />

        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center relative">
          <motion.div {...fadeUp(0)}>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-6"
              style={{ background:'rgba(139,92,246,0.08)', borderColor:'rgba(139,92,246,0.2)', color:'#c4b5fd' }}
            >
              <Star className="w-3 h-3" /> Free forever on starter
            </span>
            <h2 className="text-4xl lg:text-6xl font-bold font-outfit mb-6 leading-tight">
              Your dream job starts<br />
              with a{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage:'linear-gradient(135deg,#a78bfa 0%,#ec4899 50%,#818cf8 100%)' }}
              >
                great portfolio
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Join 2,400+ students who already landed interviews with their FirstPortfolio.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-10 py-4 text-base font-semibold rounded-full text-white transition-all group"
                style={{
                  background: 'linear-gradient(135deg,#6d28d9,#9333ea,#db2777)',
                  boxShadow: '0 0 60px rgba(139,92,246,0.5)',
                }}
              >
                Build my portfolio — it\'s free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-full text-slate-300 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
              >
                Already have an account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <footer
        className="relative z-10 border-t border-white/5 pt-16 pb-10"
        style={{ background: 'rgba(0,0,0,0.95)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Top row */}
          <div className="grid md:grid-cols-4 gap-12 mb-14">

            {/* Brand */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <Logo size={30} />
                <span className="text-lg font-bold font-outfit">
                  First<span
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage:'linear-gradient(135deg,#a78bfa,#ec4899)' }}
                  >Portfolio</span>
                </span>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                The fastest way for students to build a professional portfolio and land their first job.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: <Github className="w-4 h-4" />, href: '#' },
                  { icon: <Twitter className="w-4 h-4" />, href: '#' },
                  { icon: <Linkedin className="w-4 h-4" />, href: '#' },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-colors border border-white/8 hover:border-white/20"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              {
                heading: 'Product',
                links: [['Features','#features'],['Templates','#templates'],['How it works','#howitworks'],['Pricing','#']],
              },
              {
                heading: 'Company',
                links: [['About','#'],['Blog','#'],['Careers','#'],['Contact','#']],
              },
              {
                heading: 'Legal',
                links: [['Privacy Policy','#'],['Terms of Service','#'],['Cookie Policy','#']],
              },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="text-sm font-semibold text-white mb-4">{col.heading}</h4>
                <ul className="space-y-3">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Logo size={20} />
              <span className="text-sm text-slate-600">© 2026 FirstPortfolio. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-600">
              Made with
              <span className="text-pink-500 mx-1">♥</span>
              for students everywhere
            </div>
            <CreatorSignature />
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
