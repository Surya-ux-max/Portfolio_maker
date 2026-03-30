import React from 'react';
import { motion } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin,
  ExternalLink, BookOpen, Briefcase, Code,
  Layers, Award, Globe, ArrowUpRight, Zap,
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
});

const CreativeTemplate = ({ portfolio, user, isDark }) => {
  const {
    personalInfo = {}, education = [], experience = [],
    projects = [], skills = [], certifications = [],
    socialLinks = {},
  } = portfolio;

  const bg          = isDark ? '#000000' : '#faf8ff';
  const card        = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)';
  const border      = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(109,40,217,0.12)';
  const textPrimary = isDark ? '#ffffff' : '#0f0a1e';
  const textMuted   = isDark ? '#6b7280' : '#6b7280';

  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ background: bg, color: textPrimary }}>

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[70vw] h-[70vh] rounded-full blur-[160px] opacity-15"
          style={{ background: 'radial-gradient(circle, #dc2626, #9333ea)' }} />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] rounded-full blur-[140px] opacity-10"
          style={{ background: '#9333ea' }} />
      </div>

      <div className="relative z-10">

        {/* ── Nav ── */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-8 lg:px-16 py-6 flex items-center justify-between border-b"
          style={{ borderColor: border, backdropFilter: 'blur(20px)', background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(250,248,255,0.8)' }}
        >
          <span className="font-bold font-outfit text-xl" style={{ color: textPrimary }}>
            {personalInfo.name?.split(' ')[0] || user?.name?.split(' ')[0]}<span style={{ color: '#dc2626' }}>.</span>
          </span>
          <div className="flex items-center gap-3">
            {[
              { icon: Github,   href: socialLinks.github },
              { icon: Linkedin, href: socialLinks.linkedin },
              { icon: Twitter,  href: socialLinks.twitter },
            ].map((s, i) => s.href && (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                className="p-2.5 rounded-full border transition-all hover:border-red-500/40"
                style={{ color: textMuted, borderColor: border }}>
                <s.icon className="w-4 h-4" />
              </a>
            ))}
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`}
                className="px-5 py-2 rounded-full text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#dc2626,#9333ea)' }}>
                Contact
              </a>
            )}
          </div>
        </motion.nav>

        {/* ── Hero ── */}
        <section className="px-8 lg:px-16 py-24 lg:py-40 max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border"
              style={{ background: 'rgba(220,38,38,0.08)', borderColor: 'rgba(220,38,38,0.25)', color: '#f87171' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              {personalInfo.role || 'Creative Developer'}
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-bold font-outfit leading-[0.9] tracking-tight">
              <span style={{
                background: 'linear-gradient(135deg,#f87171 0%,#a78bfa 45%,#ec4899 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {personalInfo.name?.split(' ')[0] || user?.name?.split(' ')[0]}
              </span>
              <br />
              <span style={{ color: textPrimary }}>
                {personalInfo.name?.split(' ').slice(1).join(' ') || ''}
              </span>
            </h1>

            <p className="text-xl lg:text-2xl leading-relaxed max-w-2xl font-medium" style={{ color: textMuted }}>
              {personalInfo.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#dc2626,#9333ea)', boxShadow: '0 0 40px rgba(220,38,38,0.3)' }}>
                  <Mail className="w-4 h-4" /> Get in touch
                </a>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1.5 text-sm" style={{ color: textMuted }}>
                  <MapPin className="w-4 h-4" /> {personalInfo.location}
                </span>
              )}
            </div>
          </motion.div>
        </section>

        {/* ── Skills marquee-style grid ── */}
        {skills.length > 0 && (
          <section className="py-20 border-y overflow-hidden" style={{ borderColor: border, background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(109,40,217,0.03)' }}>
            <div className="max-w-7xl mx-auto px-8 lg:px-16">
              <p className="text-xs font-bold uppercase tracking-[0.3em] mb-10 text-center" style={{ color: textMuted }}>
                Tech Stack
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {skills.map((skill, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    whileHover={{ scale: 1.1, rotate: [-1, 1][i % 2] }}
                    className="flex flex-col items-center gap-2 group cursor-default"
                  >
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center border transition-all group-hover:border-red-500/50"
                      style={{ background: card, borderColor: border }}>
                      <Code className="w-7 h-7 transition-colors group-hover:text-red-400" style={{ color: textMuted }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: textMuted }}>{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Experience ── */}
        {experience.length > 0 && (
          <section className="px-8 lg:px-16 py-24 max-w-7xl mx-auto">
            <motion.h2 {...fadeUp(0)}
              className="text-4xl lg:text-6xl font-bold font-outfit mb-16"
              style={{ color: textPrimary }}>
              Journey<span style={{ color: '#dc2626' }}>.</span>
            </motion.h2>
            <div className="space-y-12">
              {experience.map((exp, i) => (
                <motion.div key={i} {...fadeUp(i * 0.1)}
                  className="grid md:grid-cols-[200px_1fr] gap-8 pb-12 border-b group"
                  style={{ borderColor: border }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#dc2626' }}>
                      {exp.startDate} — {exp.endDate || 'Present'}
                    </p>
                    {exp.location && (
                      <p className="text-xs mt-1" style={{ color: textMuted }}>{exp.location}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-outfit mb-1 group-hover:text-red-400 transition-colors"
                      style={{ color: textPrimary }}>
                      {exp.position}
                    </h3>
                    <p className="font-semibold mb-4" style={{ color: textMuted }}>@ {exp.company}</p>
                    <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Projects ── */}
        {projects.length > 0 && (
          <section className="px-8 lg:px-16 py-24 max-w-7xl mx-auto">
            <motion.h2 {...fadeUp(0)}
              className="text-4xl lg:text-6xl font-bold font-outfit mb-16"
              style={{ color: textPrimary }}>
              Work<span style={{ color: '#9333ea' }}>.</span>
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((proj, i) => (
                <motion.div key={i} {...fadeUp(i * 0.1)} whileHover={{ y: -6 }}
                  className="p-8 rounded-3xl border flex flex-col transition-all hover:border-red-500/30"
                  style={{ background: card, borderColor: border }}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(220,38,38,0.10)', color: '#f87171' }}>
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="flex gap-2">
                      {proj.githubLink && (
                        <a href={proj.githubLink} target="_blank" rel="noopener noreferrer"
                          className="p-2.5 rounded-xl border transition-all hover:border-red-500/40"
                          style={{ color: textMuted, borderColor: border }}>
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {proj.liveLink && (
                        <a href={proj.liveLink} target="_blank" rel="noopener noreferrer"
                          className="p-2.5 rounded-xl text-white"
                          style={{ background: 'linear-gradient(135deg,#dc2626,#9333ea)' }}>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-outfit mb-3" style={{ color: textPrimary }}>{proj.title}</h3>
                  <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: textMuted }}>{proj.description}</p>
                  <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: border }}>
                    {proj.techStack?.map((t, j) => (
                      <span key={j} className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(147,51,234,0.10)', color: '#c084fc' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Education + Certifications ── */}
        {(education.length > 0 || certifications.length > 0) && (
          <section className="px-8 lg:px-16 py-24 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16">

              {education.length > 0 && (
                <div>
                  <motion.h2 {...fadeUp(0)}
                    className="text-3xl font-bold font-outfit mb-10"
                    style={{ color: textPrimary }}>
                    Education<span style={{ color: '#10b981' }}>.</span>
                  </motion.h2>
                  <div className="space-y-6">
                    {education.map((edu, i) => (
                      <motion.div key={i} {...fadeUp(i * 0.08)}
                        className="p-5 rounded-2xl border"
                        style={{ background: card, borderColor: border }}>
                        <h3 className="font-bold font-outfit" style={{ color: textPrimary }}>
                          {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                        </h3>
                        <p className="text-sm font-semibold mt-0.5" style={{ color: '#10b981' }}>{edu.institution}</p>
                        <p className="text-xs mt-1" style={{ color: textMuted }}>{edu.startYear} — {edu.endYear}</p>
                        {edu.description && (
                          <p className="text-xs mt-2" style={{ color: textMuted }}>{edu.description}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {certifications.length > 0 && (
                <div>
                  <motion.h2 {...fadeUp(0.1)}
                    className="text-3xl font-bold font-outfit mb-10"
                    style={{ color: textPrimary }}>
                    Certs<span style={{ color: '#f59e0b' }}>.</span>
                  </motion.h2>
                  <div className="space-y-4">
                    {certifications.map((cert, i) => (
                      <motion.div key={i} {...fadeUp(i * 0.08)}
                        className="p-5 rounded-2xl border flex items-start gap-4"
                        style={{ background: card, borderColor: border }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm font-outfit" style={{ color: textPrimary }}>{cert.name}</h3>
                          <p className="text-xs mt-0.5 font-medium" style={{ color: '#f59e0b' }}>{cert.issuer}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-xs" style={{ color: textMuted }}>{cert.date}</span>
                            {cert.link && (
                              <a href={cert.link} target="_blank" rel="noopener noreferrer"
                                className="text-xs flex items-center gap-1 hover:text-amber-400 transition-colors"
                                style={{ color: textMuted }}>
                                View <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        {personalInfo.email && (
          <section className="px-8 lg:px-16 py-32 text-center">
            <motion.div {...fadeUp(0)} className="space-y-8">
              <h2 className="text-5xl lg:text-8xl font-bold font-outfit leading-tight"
                style={{ color: textPrimary }}>
                Let's build<br />
                <span style={{
                  background: 'linear-gradient(135deg,#dc2626,#9333ea,#ec4899)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  something great.
                </span>
              </h2>
              <a href={`mailto:${personalInfo.email}`}
                className="inline-flex items-center gap-2 px-10 py-5 rounded-full text-lg font-semibold text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#dc2626,#9333ea)', boxShadow: '0 0 60px rgba(220,38,38,0.35)' }}>
                <Mail className="w-5 h-5" /> {personalInfo.email}
              </a>
            </motion.div>
          </section>
        )}

        {/* ── Footer ── */}
        <footer className="px-8 lg:px-16 py-10 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: border }}>
          <span className="font-bold font-outfit" style={{ color: textMuted }}>
            {personalInfo.name || user?.name}
          </span>
          <a href="/" className="text-xs font-semibold flex items-center gap-1.5 hover:text-red-400 transition-colors"
            style={{ color: textMuted }}>
            <Globe className="w-3 h-3" /> Built with FirstPortfolio — Create yours free
          </a>
        </footer>
      </div>
    </div>
  );
};

export default CreativeTemplate;
