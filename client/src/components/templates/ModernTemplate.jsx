import React from 'react';
import { motion } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin, Phone,
  ExternalLink, BookOpen, Briefcase, Code, Layers,
  Award, Globe, Terminal, ChevronRight,
} from 'lucide-react';

const fade  = (delay = 0) => ({
  initial:   { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:  { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
});

const LEVEL_COLOR = {
  Expert:       { bg: 'rgba(220,38,38,0.15)',  text: '#f87171',  border: 'rgba(220,38,38,0.3)'  },
  Advanced:     { bg: 'rgba(147,51,234,0.15)', text: '#c084fc',  border: 'rgba(147,51,234,0.3)' },
  Intermediate: { bg: 'rgba(99,102,241,0.12)', text: '#a5b4fc',  border: 'rgba(99,102,241,0.25)'},
  Beginner:     { bg: 'rgba(255,255,255,0.05)',text: '#94a3b8',  border: 'rgba(255,255,255,0.1)'},
};

const SectionTitle = ({ icon: Icon, title, color = '#dc2626', isDark }) => (
  <div className="flex items-center gap-4 mb-10">
    <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${color}55)` }} />
    <h2
      className="text-2xl font-bold font-outfit flex items-center gap-2.5 whitespace-nowrap"
      style={{ color: isDark ? '#fff' : '#0f0a1e' }}
    >
      <Icon className="w-6 h-6" style={{ color }} />
      {title}
    </h2>
    <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${color}55)` }} />
  </div>
);

const ModernTemplate = ({ portfolio, user, isDark }) => {
  const {
    personalInfo = {}, education = [], experience = [],
    projects = [], skills = [], certifications = [],
    socialLinks = {},
  } = portfolio;

  const bg   = isDark ? '#000000' : '#f8f5ff';
  const card = isDark ? 'rgba(8,2,14,0.80)'  : 'rgba(255,255,255,0.90)';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(109,40,217,0.12)';
  const textPrimary = isDark ? '#ffffff' : '#0f0a1e';
  const textMuted   = isDark ? '#94a3b8' : '#4b5563';

  return (
    <div
      className="min-h-screen font-sans selection:bg-red-500/30"
      style={{ background: bg, color: textPrimary }}
    >
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-20"
          style={{ background: '#dc2626' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[120px] opacity-15"
          style={{ background: '#9333ea' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row min-h-screen">

        {/* ── Sidebar ── */}
        <motion.aside
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:w-[360px] lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between p-8 lg:p-10 border-r"
          style={{ borderColor: border }}
        >
          <div className="space-y-8">
            {/* Avatar + name */}
            <div>
              {personalInfo.profilePhoto ? (
                <img src={personalInfo.profilePhoto} alt={personalInfo.name}
                  className="w-20 h-20 rounded-2xl object-cover mb-5 border-2"
                  style={{ borderColor: 'rgba(220,38,38,0.4)' }} />
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mb-5"
                  style={{ background: 'linear-gradient(135deg,#dc2626,#9333ea)' }}>
                  {personalInfo.name?.charAt(0) || '?'}
                </div>
              )}

              <h1 className="text-3xl font-bold font-outfit leading-tight mb-2"
                style={{ color: textPrimary }}>
                {personalInfo.name || user?.name}
              </h1>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                style={{ background: 'rgba(220,38,38,0.12)', color: '#f87171', border: '1px solid rgba(220,38,38,0.25)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                {personalInfo.role || 'Developer'}
              </div>

              <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
                {personalInfo.bio}
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-3 text-sm transition-colors hover:text-red-400"
                  style={{ color: textMuted }}>
                  <Mail className="w-4 h-4 shrink-0" /> {personalInfo.email}
                </a>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-3 text-sm" style={{ color: textMuted }}>
                  <Phone className="w-4 h-4 shrink-0" /> {personalInfo.phone}
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-3 text-sm" style={{ color: textMuted }}>
                  <MapPin className="w-4 h-4 shrink-0" /> {personalInfo.location}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Projects',  value: projects.length,      color: '#dc2626' },
                { label: 'Skills',    value: skills.length,        color: '#9333ea' },
                { label: 'Exp',       value: experience.length,    color: '#ec4899' },
              ].map(s => s.value > 0 && (
                <div key={s.label} className="p-3 rounded-xl text-center"
                  style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
                  <div className="text-xl font-bold font-outfit" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: textMuted }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Social links */}
          <div className="flex gap-3 mt-8 lg:mt-0">
            {[
              { icon: Github,   href: socialLinks.github },
              { icon: Linkedin, href: socialLinks.linkedin },
              { icon: Twitter,  href: socialLinks.twitter },
            ].map((s, i) => s.href && (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ background: card, border: `1px solid ${border}`, color: textMuted }}>
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </motion.aside>

        {/* ── Main content ── */}
        <main className="flex-1 p-8 lg:p-12 space-y-20">

          {/* Experience */}
          {experience.length > 0 && (
            <motion.section {...fade(0.1)}>
              <SectionTitle icon={Briefcase} title="Experience" color="#dc2626" isDark={isDark} />
              <div className="space-y-5">
                {experience.map((exp, i) => (
                  <motion.div key={i} {...fade(i * 0.08)}
                    className="p-6 rounded-2xl border transition-all hover:border-red-500/30"
                    style={{ background: card, borderColor: border }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-bold text-lg font-outfit" style={{ color: textPrimary }}>{exp.position}</h3>
                        <p className="text-sm font-semibold" style={{ color: '#dc2626' }}>{exp.company}</p>
                      </div>
                      <span className="text-xs font-medium px-3 py-1 rounded-full shrink-0"
                        style={{ background: 'rgba(220,38,38,0.10)', color: '#f87171' }}>
                        {exp.startDate} — {exp.endDate || 'Present'}
                      </span>
                    </div>
                    {exp.location && (
                      <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: textMuted }}>
                        <MapPin className="w-3 h-3" /> {exp.location}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{exp.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <motion.section {...fade(0.15)}>
              <SectionTitle icon={Layers} title="Projects" color="#9333ea" isDark={isDark} />
              <div className="grid md:grid-cols-2 gap-5">
                {projects.map((proj, i) => (
                  <motion.div key={i} {...fade(i * 0.08)} whileHover={{ y: -4 }}
                    className="p-6 rounded-2xl border flex flex-col transition-all hover:border-purple-500/30"
                    style={{ background: card, borderColor: border }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(147,51,234,0.12)', color: '#c084fc' }}>
                        <Terminal className="w-5 h-5" />
                      </div>
                      <div className="flex gap-2">
                        {proj.githubLink && (
                          <a href={proj.githubLink} target="_blank" rel="noopener noreferrer"
                            className="p-2 rounded-lg transition-all hover:bg-white/10"
                            style={{ color: textMuted }}>
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {proj.liveLink && (
                          <a href={proj.liveLink} target="_blank" rel="noopener noreferrer"
                            className="p-2 rounded-lg text-white transition-all"
                            style={{ background: 'linear-gradient(135deg,#dc2626,#9333ea)' }}>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <h3 className="font-bold font-outfit mb-2" style={{ color: textPrimary }}>{proj.title}</h3>
                    <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: textMuted }}>{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t" style={{ borderColor: border }}>
                      {proj.techStack?.map((t, j) => (
                        <span key={j} className="px-2 py-0.5 rounded-md text-[11px] font-medium"
                          style={{ background: 'rgba(147,51,234,0.10)', color: '#c084fc' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <motion.section {...fade(0.2)}>
              <SectionTitle icon={Code} title="Skills" color="#6366f1" isDark={isDark} />
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill, i) => {
                  const c = LEVEL_COLOR[skill.level] || LEVEL_COLOR.Beginner;
                  return (
                    <motion.span key={i} {...fade(i * 0.04)} whileHover={{ scale: 1.05 }}
                      className="px-3.5 py-1.5 rounded-full text-sm font-medium border"
                      style={{ background: c.bg, color: c.text, borderColor: c.border }}>
                      {skill.name}
                    </motion.span>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <motion.section {...fade(0.25)}>
              <SectionTitle icon={BookOpen} title="Education" color="#10b981" isDark={isDark} />
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <motion.div key={i} {...fade(i * 0.08)}
                    className="p-5 rounded-2xl border"
                    style={{ background: card, borderColor: border }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold font-outfit" style={{ color: textPrimary }}>
                          {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                        </h3>
                        <p className="text-sm font-semibold mt-0.5" style={{ color: '#10b981' }}>{edu.institution}</p>
                        {edu.description && (
                          <p className="text-xs mt-1.5" style={{ color: textMuted }}>{edu.description}</p>
                        )}
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
                        style={{ background: 'rgba(16,185,129,0.10)', color: '#10b981' }}>
                        {edu.startYear} — {edu.endYear}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <motion.section {...fade(0.3)}>
              <SectionTitle icon={Award} title="Certifications" color="#f59e0b" isDark={isDark} />
              <div className="grid sm:grid-cols-2 gap-4">
                {certifications.map((cert, i) => (
                  <motion.div key={i} {...fade(i * 0.08)}
                    className="p-5 rounded-2xl border flex items-start gap-4"
                    style={{ background: card, borderColor: border }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm font-outfit truncate" style={{ color: textPrimary }}>{cert.name}</h3>
                      <p className="text-xs mt-0.5" style={{ color: '#f59e0b' }}>{cert.issuer}</p>
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
            </motion.section>
          )}

          {/* Footer */}
          <footer className="pt-10 border-t text-center pb-8" style={{ borderColor: border }}>
            <a href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:text-red-400"
              style={{ color: textMuted }}>
              <Globe className="w-3 h-3" /> Built with FirstPortfolio — Create yours free
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default ModernTemplate;
