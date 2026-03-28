import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, Zap, Palette } from 'lucide-react';
import BlackHole from '../components/BlackHole';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans overflow-x-hidden">

      {/* ── Black Hole — full viewport canvas, stars fill entire hero ── */}
      <div className="fixed inset-0 z-0">
        <BlackHole style={{ width: '100%', height: '100%' }} />
      </div>

      {/* ── Left-side reading veil: keeps text legible without hiding stars ── */}
      <div
        className="fixed inset-y-0 left-0 z-[1] pointer-events-none"
        style={{
          width: '52%',
          background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)',
        }}
      />

      {/* ── Top nav underlay ── */}
      <div
        className="fixed inset-x-0 top-0 h-24 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
      />

      {/* ── Navigation ── */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between h-16 items-center">

            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                style={{
                  background: 'linear-gradient(135deg, #6d28d9, #9333ea)',
                  boxShadow: '0 0 16px rgba(139,92,246,0.4)',
                }}
              >
                F
              </div>
              <span className="text-xl font-bold tracking-tight font-outfit">FirstPortfolio</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {['#features', '#templates'].map((href, i) => (
                <a
                  key={i}
                  href={href}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  {href === '#features' ? 'Features' : 'Templates'}
                </a>
              ))}
              <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-full text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #6d28d9, #9333ea)',
                  boxShadow: '0 0 20px rgba(139,92,246,0.35)',
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — two-column: text left | black hole right
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center pt-24 pb-20 lg:pt-0 lg:pb-0">

            {/* ── Left: Content ── */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-start"
            >
              {/* Badge */}
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-8 border"
                style={{
                  background: 'rgba(139,92,246,0.08)',
                  borderColor: 'rgba(139,92,246,0.25)',
                  color: '#c4b5fd',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                The ultimate portfolio builder for students
              </motion.span>

              {/* Headline */}
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight font-outfit leading-[1.08] mb-6">
                Build a{' '}
                <span
                  className="text-transparent bg-clip-text block"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 55%, #818cf8 100%)',
                  }}
                >
                  Stunning
                </span>
                Portfolio
                <br />
                <span className="text-white/90">in Minutes</span>
              </h1>

              {/* Sub */}
              <p className="text-base lg:text-lg text-slate-400 mb-10 leading-relaxed max-w-md">
                Zero coding required. Fill in your details, pick a template, and get a
                professional public URL to share with recruiters — instantly.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-14">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full text-white transition-all group"
                  style={{
                    background: 'linear-gradient(135deg, #6d28d9 0%, #9333ea 50%, #db2777 100%)',
                    boxShadow: '0 0 40px rgba(139,92,246,0.4), 0 4px 24px rgba(0,0,0,0.4)',
                  }}
                >
                  Start Building Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#templates"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full text-slate-300 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all backdrop-blur-sm"
                >
                  View Templates
                </a>
              </div>

              {/* Social proof strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex items-center gap-6 text-sm text-slate-500"
              >
                {[['500+', 'Portfolios created'], ['100%', 'Free to start'], ['< 5 min', 'Setup time']].map(([val, label]) => (
                  <div key={label} className="flex flex-col items-start">
                    <span className="text-white font-bold text-base font-outfit">{val}</span>
                    <span className="text-slate-500 text-xs">{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right: spacer so black hole shows through ── */}
            <div className="hidden lg:block" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="features"
        className="relative z-10 py-28 border-t border-white/5"
        style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-4"
              style={{
                background: 'rgba(139,92,246,0.08)',
                borderColor: 'rgba(139,92,246,0.2)',
                color: '#c4b5fd',
              }}
            >
              Everything you need
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold font-outfit">
              Built for{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa, #ec4899)' }}
              >
                speed & impact
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-5 h-5 text-indigo-400" />,
                title: 'Real-time Editor',
                desc: 'See your changes instantly as you type with our side-by-side live preview.',
                accent: 'rgba(99,102,241,0.15)',
                border: 'rgba(99,102,241,0.25)',
              },
              {
                icon: <Palette className="w-5 h-5 text-purple-400" />,
                title: 'Designer Templates',
                desc: 'Choose from a curated collection of modern, recruiter-friendly templates.',
                accent: 'rgba(168,85,247,0.15)',
                border: 'rgba(168,85,247,0.25)',
              },
              {
                icon: <Smartphone className="w-5 h-5 text-pink-400" />,
                title: 'Mobile Ready',
                desc: 'Your portfolio looks stunning on every device — desktop, tablet, or mobile.',
                accent: 'rgba(236,72,153,0.15)',
                border: 'rgba(236,72,153,0.25)',
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22,1,0.36,1] }}
                className="p-8 rounded-3xl border transition-all group hover:-translate-y-1.5 cursor-default"
                style={{
                  background: 'rgba(10,5,20,0.7)',
                  borderColor: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = f.border; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ background: f.accent, border: `1px solid ${f.border}` }}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 font-outfit">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer
        className="relative z-10 border-t border-white/5 py-10"
        style={{ background: 'rgba(0,0,0,0.85)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs text-white"
              style={{ background: 'linear-gradient(135deg, #6d28d9, #9333ea)' }}
            >
              F
            </div>
            <span className="text-sm font-semibold text-slate-500">© 2026 FirstPortfolio</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-600">
            {['Privacy', 'Terms', 'Twitter', 'GitHub'].map(l => (
              <a key={l} href="#" className="hover:text-slate-300 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
