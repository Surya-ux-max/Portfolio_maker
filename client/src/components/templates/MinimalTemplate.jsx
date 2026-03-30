import React from 'react';
import { motion } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin, Phone,
  ExternalLink, BookOpen, Briefcase, Code, Layers,
  Award, Globe, ArrowUpRight,
} from 'lucide-react';

const fade = (delay = 0) => ({
  initial:     { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
});

const MinimalTemplate = ({ portfolio, user, isDark }) => {
  const {
    personalInfo = {}, education = [], experience = [],
    projects = [], skills = [], certifications = [],
    socialLinks = {},
  } = portfolio;

  const bg          = isDark ? '#05020f' : '#ffffff';
  const surface     = isDark ? 'rgba(255,255,255,0.04)' : '#f9f7ff';
  const border      = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const textPrimary = isDark ? '#f1f0f5' : '#0f0a1e';
  const textMuted   = isDark ? '#6b7280' : '#6b7280';
  const accent      = '#dc2626';

  return (
    <div className="min-h-screen font-sans" style={{ background: bg, color: textPrimary }}>

      {/* ── Top nav bar ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 border-b px-8 py-4 flex items-center justify-between"
        style={{ background: isDark ? 'rgba(5,2,15,0.85)' : 'rgba(255,255,255,0.85)', borderColor: border, backdropFilter: 'blur(16px)' }}
      >
        <span className="font-bold font-outfit text-lg" style={{ color: textPrimary }}>
          {personalInfo.name || user?.name}
        </span>
        <div className="flex items-center gap-4">
          {[
            { icon: Github,   href: socialLinks.github },
            { icon: Linkedin, href: socialLinks.linkedin },
            { icon: Twitter,  href: socialLinks.twitter },
          ].map((s, i) => s.href && (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
              className="transition-colors hover:text-red-400" style={{ color: textMuted }}>
              <s.icon className="w-4 h-4" />
            </a>
          ))}
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`}
              className="px-4 py-1.5 rounded-full text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#dc2626,#9333ea)' }}>
              Hire me
            </a>
          )}
        </div>
      </motion.header>

      <main className="max-w-5xl mx-auto px-6 py-16 lg:py-24 space-y-24">

        {/* ── Hero ── */}
        <motion.section {...fade(0)} className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: accent }}>
                Portfolio
              </p>
              <h1 className="text-5xl lg:text-7xl font-bold font-outfit leading-[1.05]" style={{ color: textPrimary }}>
                {personalInfo.name || user?.name}
              </h1>
              <p className="text-xl mt-3 font-medium" style={{ color: textMuted }}>
                {personalInfo.role}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm" style={{ color: textMuted }}>
              {personalInfo.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {personalInfo.location}
                </span>
              )}
            </div>
          </div>

          {personalInfo.bio && (
            <p className="text-lg leading-relaxed max-w-2xl" style={{ color: textMuted }}>
              {personalInfo.bio}
            </p>
          )}

          {/* Divider */}
          <div className="h-px w-full" style={{ background: `linear-gradient(to right, ${accent}, #9333ea, transparent)` }} />
        </motion.section>

        {/* ── Experience ── */}
        {experience.length > 0 && (
          <motion.section {...fade(0.1)}>
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] mb-8" style={{ color: textMuted }}>
              Experience
            </h2>
            <div className="space-y-0">
              {experience.map((exp, i) => (
                <motion.div key={i} {...fade(i * 0.07)}
                  className="grid md:grid-cols-[180px_1fr] gap-6 py-8 border-b group"
                  style={{ borderColor: border }}>
                  <div className="text-sm" style={{ color: textMuted }}>
                    <p className="font-medium">{exp.startDate} — {exp.endDate || 'Present'}</p>
                    {exp.location && <p className="mt-1 text-xs">{exp.location}</p>}
                  </div>
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-bold font-outfit text-lg" style={{ color: textPrimary }}>{exp.position}</h3>
                        <p className="text-sm font-semibold" style={{ color: accent }}>{exp.company}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Projects ── */}
        {projects.length > 0 && (
          <motion.section {...fade(0.15)}>
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] mb-8" style={{ color: textMuted }}>
              Selected Work
            </h2>
            <div className="space-y-0">
              {projects.map((proj, i) => (
                <motion.div key={i} {...fade(i * 0.07)}
                  className="py-8 border-b group flex items-start justify-between gap-6"
                  style={{ borderColor: border }}>
                  <div className="flex-1">
                    <h3 className="font-bold font-outfit text-xl mb-2 group-hover:text-red-400 transition-colors"
                      style={{ color: textPrimary }}>
                      {proj.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: textMuted }}>{proj.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {proj.techStack?.map((t, j) => (
                        <span key={j} className="text-xs font-medium px-2.5 py-1 rounded-full border"
                          style={{ color: textMuted, borderColor: border }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 mt-1">
                    {proj.githubLink && (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer"
                        className="p-2.5 rounded-xl border transition-all hover:border-red-500/40"
                        style={{ color: textMuted, borderColor: border }}>
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {proj.liveLink && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer"
                        className="p-2.5 rounded-xl text-white transition-all"
                        style={{ background: 'linear-gradient(135deg,#dc2626,#9333ea)' }}>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Skills + Education side by side ── */}
        <div className="grid md:grid-cols-2 gap-16">

          {skills.length > 0 && (
            <motion.section {...fade(0.2)}>
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] mb-8" style={{ color: textMuted }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.span key={i} {...fade(i * 0.04)} whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 rounded-full text-sm font-medium border transition-all hover:border-red-500/40 cursor-default"
                    style={{ background: surface, color: textPrimary, borderColor: border }}>
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </motion.section>
          )}

          {education.length > 0 && (
            <motion.section {...fade(0.25)}>
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] mb-8" style={{ color: textMuted }}>
                Education
              </h2>
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <motion.div key={i} {...fade(i * 0.07)}>
                    <h3 className="font-bold font-outfit" style={{ color: textPrimary }}>
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </h3>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: accent }}>{edu.institution}</p>
                    <p className="text-xs mt-1" style={{ color: textMuted }}>{edu.startYear} — {edu.endYear}</p>
                    {edu.description && (
                      <p className="text-xs mt-1.5" style={{ color: textMuted }}>{edu.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* ── Certifications ── */}
        {certifications.length > 0 && (
          <motion.section {...fade(0.3)}>
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] mb-8" style={{ color: textMuted }}>
              Certifications
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {certifications.map((cert, i) => (
                <motion.div key={i} {...fade(i * 0.07)}
                  className="p-5 rounded-2xl border flex items-start gap-4"
                  style={{ background: surface, borderColor: border }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
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
                          className="text-xs flex items-center gap-1 hover:text-red-400 transition-colors"
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

        {/* ── Footer ── */}
        <footer className="pt-10 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: border }}>
          <div className="text-xs" style={{ color: textMuted }}>
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="hover:text-red-400 transition-colors">
                {personalInfo.email}
              </a>
            )}
          </div>
          <a href="/" className="text-xs font-semibold flex items-center gap-1.5 hover:text-red-400 transition-colors"
            style={{ color: textMuted }}>
            <Globe className="w-3 h-3" /> Built with FirstPortfolio
          </a>
        </footer>
      </main>
    </div>
  );
};

export default MinimalTemplate;
