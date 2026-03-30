import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import portfolioService from '../api/portfolioService';
import ThemeToggle from '../components/ThemeToggle';
import {
  ChevronLeft, Save, Loader2, CheckCircle2, AlertCircle,
  User, Briefcase, GraduationCap, Code, Layers,
  Globe, Settings as SettingsIcon, Award,
} from 'lucide-react';

/* ─── Shared reusable input components ──────────────────────────────────── */
export function Label({ children }) {
  return (
    <label className="fp-label">
      {children}
    </label>
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`fp-input ${className}`}
    />
  );
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      {...props}
      className={`fp-input resize-none ${className}`}
    />
  );
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      {...props}
      className={`fp-input fp-select ${className}`}
    >
      {children}
    </select>
  );
}

export function SectionHeader({ title, desc, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold font-outfit fp-text mb-1">{title}</h2>
        {desc && <p className="text-sm fp-text-muted">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function AddButton({ onClick, label = 'Add' }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white shrink-0 transition-all"
      style={{
        background: 'linear-gradient(135deg,#dc2626,#9333ea)',
        boxShadow: '0 0 16px rgba(139,92,246,0.3)',
      }}
    >
      <span className="text-base leading-none">+</span> {label}
    </button>
  );
}

export function RemoveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}

export function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 fp-text-dim">
      <Icon className="w-12 h-12 mb-3 opacity-20" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`relative fp-inner-card p-6 ${className}`}>
      {children}
    </div>
  );
}

/* ─── Tab definitions ────────────────────────────────────────────────────── */
const TABS = [
  { id: 'personal',       label: 'Personal',       icon: User },
  { id: 'experience',     label: 'Experience',     icon: Briefcase },
  { id: 'education',      label: 'Education',      icon: GraduationCap },
  { id: 'skills',         label: 'Skills',         icon: Code },
  { id: 'projects',       label: 'Projects',       icon: Layers },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'social',         label: 'Social',         icon: Globe },
  { id: 'settings',       label: 'Settings',       icon: SettingsIcon },
];

/* ══════════════════════════════════════════════════════════════════════════
   EDITOR
══════════════════════════════════════════════════════════════════════════ */
const Editor = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');

  /* ── Portfolio state ── */
  const [portfolio, setPortfolio] = useState({
    personalInfo:   { name: user?.name || '', bio: '', role: '', profilePhoto: '', email: user?.email || '', phone: '', location: '' },
    education:      [],
    skills:         [],
    projects:       [],
    experience:     [],
    certifications: [],
    socialLinks:    { github: '', linkedin: '', twitter: '', portfolio: '' },
    settings:       { theme: 'light', isPublic: true },
    templateId:     'modern',
  });

  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

  /* ── Fetch existing portfolio ── */
  useEffect(() => {
    portfolioService.getMyPortfolio()
      .then(data => { if (data) setPortfolio(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ── Save ── */
  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      await portfolioService.upsertPortfolio(portfolio);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  /* ── Field updaters ── */
  const setField = (section, key, value) =>
    setPortfolio(p => ({ ...p, [section]: { ...p[section], [key]: value } }));

  const updatePersonalInfo  = e => setField('personalInfo',  e.target.name, e.target.value);
  const updateSocialLinks   = e => setField('socialLinks',   e.target.name, e.target.value);
  const updateSettings      = (k, v) => setField('settings', k, v);

  /* ── Array section helpers ── */
  const addItem    = (key, blank) => setPortfolio(p => ({ ...p, [key]: [...p[key], blank] }));
  const removeItem = (key, i)     => setPortfolio(p => ({ ...p, [key]: p[key].filter((_, idx) => idx !== i) }));
  const updateItem = (key, i, field, value) =>
    setPortfolio(p => {
      const arr = [...p[key]];
      arr[i] = { ...arr[i], [field]: value };
      return { ...p, [key]: arr };
    });

  /* ── Blank templates ── */
  const blanks = {
    experience:     { company: '', position: '', location: '', startDate: '', endDate: '', description: '' },
    education:      { institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '', description: '' },
    skills:         { name: '', level: 'Beginner' },
    projects:       { title: '', description: '', techStack: [], githubLink: '', liveLink: '', image: '' },
    certifications: { name: '', issuer: '', date: '', link: '' },
  };

  /* ── Loading screen ── */
  if (loading) {
    return (
      <div className="page-space min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-500">Loading your portfolio…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fp-page min-h-screen font-sans flex flex-col h-screen overflow-hidden">

      {/* ════════════════════════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════════════════════════ */}
      <header className="fp-header h-14 shrink-0 flex items-center justify-between px-5 z-50">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 rounded-xl fp-text-muted hover:fp-text hover:bg-red-500/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-px h-5 bg-white/8" />
          <span className="font-bold font-outfit text-base hidden sm:block fp-text">Portfolio Editor</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* Save status */}
          <AnimatePresence>
            {saveStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-400"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </motion.div>
            )}
            {saveStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="flex items-center gap-1.5 text-xs font-medium text-red-400"
              >
                <AlertCircle className="w-3.5 h-3.5" /> Save failed
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary py-2 px-5 text-sm"
          >
            {saving
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Save className="w-4 h-4" />
            }
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════════
          BODY — sidebar + content
      ════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar nav ── */}
        <aside className="fp-sidebar w-14 sm:w-52 shrink-0 flex flex-col overflow-y-auto no-scrollbar">
          <nav className="flex flex-col gap-1 p-2 pt-4">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`fp-nav-item ${active ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:block">{label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Main content area — filled by Tasks 2-5 ── */}
        <main className="fp-page flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {/* TABS CONTENT GOES HERE — Tasks 2-5 */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                {/* ── PERSONAL ── */}
                {activeTab === 'personal' && (
                  <PersonalTab
                    data={portfolio.personalInfo}
                    onChange={updatePersonalInfo}
                  />
                )}
                {/* ── EXPERIENCE ── */}
                {activeTab === 'experience' && (
                  <ExperienceTab
                    items={portfolio.experience}
                    onAdd={() => addItem('experience', blanks.experience)}
                    onRemove={i => removeItem('experience', i)}
                    onUpdate={(i, f, v) => updateItem('experience', i, f, v)}
                  />
                )}
                {/* ── EDUCATION ── */}
                {activeTab === 'education' && (
                  <EducationTab
                    items={portfolio.education}
                    onAdd={() => addItem('education', blanks.education)}
                    onRemove={i => removeItem('education', i)}
                    onUpdate={(i, f, v) => updateItem('education', i, f, v)}
                  />
                )}
                {/* ── SKILLS ── */}
                {activeTab === 'skills' && (
                  <SkillsTab
                    items={portfolio.skills}
                    onAdd={() => addItem('skills', blanks.skills)}
                    onRemove={i => removeItem('skills', i)}
                    onUpdate={(i, f, v) => updateItem('skills', i, f, v)}
                  />
                )}
                {/* ── PROJECTS ── */}
                {activeTab === 'projects' && (
                  <ProjectsTab
                    items={portfolio.projects}
                    onAdd={() => addItem('projects', blanks.projects)}
                    onRemove={i => removeItem('projects', i)}
                    onUpdate={(i, f, v) => updateItem('projects', i, f, v)}
                    onUpdateTech={(i, val) => updateItem('projects', i, 'techStack',
                      val.split(/[,\s]+/).map(t => t.trim()).filter(Boolean)
                    )}
                  />
                )}
                {/* ── CERTIFICATIONS ── */}
                {activeTab === 'certifications' && (
                  <CertificationsTab
                    items={portfolio.certifications}
                    onAdd={() => addItem('certifications', blanks.certifications)}
                    onRemove={i => removeItem('certifications', i)}
                    onUpdate={(i, f, v) => updateItem('certifications', i, f, v)}
                  />
                )}
                {/* ── SOCIAL ── */}
                {activeTab === 'social' && (
                  <SocialTab
                    data={portfolio.socialLinks}
                    onChange={updateSocialLinks}
                  />
                )}
                {/* ── SETTINGS ── */}
                {activeTab === 'settings' && (
                  <SettingsTab
                    settings={portfolio.settings}
                    templateId={portfolio.templateId}
                    onSettingChange={updateSettings}
                    onTemplateChange={v => setPortfolio(p => ({ ...p, templateId: v }))}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Editor;

/* ══════════════════════════════════════════════════════════════════════════
   TASK 2 — PERSONAL INFO TAB + SOCIAL LINKS TAB
══════════════════════════════════════════════════════════════════════════ */
function PersonalTab({ data, onChange }) {
  return (
    <div className="space-y-5">
      <SectionHeader
        title="Personal Information"
        desc="Displayed at the top of your portfolio."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label>Full Name</Label>
          <Input name="name" value={data.name} onChange={onChange} placeholder="John Doe" />
        </div>
        <div className="sm:col-span-2">
          <Label>Role / Headline</Label>
          <Input name="role" value={data.role} onChange={onChange} placeholder="Full Stack Developer" />
        </div>
        <div className="sm:col-span-2">
          <Label>Short Bio</Label>
          <Textarea name="bio" rows={4} value={data.bio} onChange={onChange} placeholder="Tell recruiters about yourself…" />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" name="email" value={data.email} onChange={onChange} placeholder="you@example.com" />
        </div>
        <div>
          <Label>Phone</Label>
          <Input name="phone" value={data.phone} onChange={onChange} placeholder="+91 98765 43210" />
        </div>
        <div className="sm:col-span-2">
          <Label>Location</Label>
          <Input name="location" value={data.location} onChange={onChange} placeholder="Chennai, India" />
        </div>
      </div>
    </div>
  );
}

function SocialTab({ data, onChange }) {
  const fields = [
    { name: 'github',    label: 'GitHub',            placeholder: 'https://github.com/username' },
    { name: 'linkedin',  label: 'LinkedIn',           placeholder: 'https://linkedin.com/in/username' },
    { name: 'twitter',   label: 'Twitter / X',        placeholder: 'https://twitter.com/username' },
    { name: 'portfolio', label: 'Portfolio Website',  placeholder: 'https://yoursite.com' },
  ];
  return (
    <div className="space-y-5">
      <SectionHeader
        title="Social Links"
        desc="Add your professional profiles and social media."
      />
      <div className="space-y-4">
        {fields.map(f => (
          <div key={f.name}>
            <Label>{f.label}</Label>
            <Input
              type="url" name={f.name}
              value={data[f.name] || ''}
              onChange={onChange}
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TASK 3 — EXPERIENCE + EDUCATION TABS
══════════════════════════════════════════════════════════════════════════ */
function ExperienceTab({ items, onAdd, onRemove, onUpdate }) {
  return (
    <div className="space-y-5">
      <SectionHeader
        title="Work Experience"
        desc="Add your jobs, internships, and freelance work."
        action={<AddButton onClick={onAdd} />}
      />
      {items.length === 0 && <EmptyState icon={Briefcase} message='No experience yet. Click "Add" to get started.' />}
      {items.map((exp, i) => (
        <Card key={i}>
          <div className="absolute top-4 right-4">
            <RemoveButton onClick={() => onRemove(i)} />
          </div>
          <div className="grid grid-cols-2 gap-4 pr-8">
            <div>
              <Label>Position</Label>
              <Input value={exp.position} onChange={e => onUpdate(i,'position',e.target.value)} placeholder="Software Engineer" />
            </div>
            <div>
              <Label>Company</Label>
              <Input value={exp.company} onChange={e => onUpdate(i,'company',e.target.value)} placeholder="Tech Corp" />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={exp.location} onChange={e => onUpdate(i,'location',e.target.value)} placeholder="Remote" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Start</Label>
                <Input value={exp.startDate} onChange={e => onUpdate(i,'startDate',e.target.value)} placeholder="Jan 2024" />
              </div>
              <div>
                <Label>End</Label>
                <Input value={exp.endDate} onChange={e => onUpdate(i,'endDate',e.target.value)} placeholder="Present" />
              </div>
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea rows={3} value={exp.description} onChange={e => onUpdate(i,'description',e.target.value)} placeholder="Describe your responsibilities and achievements…" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function EducationTab({ items, onAdd, onRemove, onUpdate }) {
  return (
    <div className="space-y-5">
      <SectionHeader
        title="Education"
        desc="Add your academic qualifications."
        action={<AddButton onClick={onAdd} />}
      />
      {items.length === 0 && <EmptyState icon={GraduationCap} message='No education yet. Click "Add" to get started.' />}
      {items.map((edu, i) => (
        <Card key={i}>
          <div className="absolute top-4 right-4">
            <RemoveButton onClick={() => onRemove(i)} />
          </div>
          <div className="grid grid-cols-2 gap-4 pr-8">
            <div className="col-span-2">
              <Label>Institution</Label>
              <Input value={edu.institution} onChange={e => onUpdate(i,'institution',e.target.value)} placeholder="University Name" />
            </div>
            <div>
              <Label>Degree</Label>
              <Input value={edu.degree} onChange={e => onUpdate(i,'degree',e.target.value)} placeholder="Bachelor's" />
            </div>
            <div>
              <Label>Field of Study</Label>
              <Input value={edu.fieldOfStudy} onChange={e => onUpdate(i,'fieldOfStudy',e.target.value)} placeholder="Computer Science" />
            </div>
            <div>
              <Label>Start Year</Label>
              <Input value={edu.startYear} onChange={e => onUpdate(i,'startYear',e.target.value)} placeholder="2020" />
            </div>
            <div>
              <Label>End Year</Label>
              <Input value={edu.endYear} onChange={e => onUpdate(i,'endYear',e.target.value)} placeholder="2024" />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea rows={2} value={edu.description} onChange={e => onUpdate(i,'description',e.target.value)} placeholder="GPA, honors, achievements…" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TASK 4 — SKILLS + PROJECTS TABS
══════════════════════════════════════════════════════════════════════════ */
const LEVEL_COLORS = {
  Beginner:     '#6366f1',
  Intermediate: '#a855f7',
  Advanced:     '#ec4899',
  Expert:       '#f59e0b',
};

function SkillsTab({ items, onAdd, onRemove, onUpdate }) {
  return (
    <div className="space-y-5">
      <SectionHeader
        title="Skills"
        desc="Add your technical and soft skills."
        action={<AddButton onClick={onAdd} />}
      />
      {items.length === 0 && <EmptyState icon={Code} message='No skills yet. Click "Add" to get started.' />}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((skill, i) => (
          <Card key={i} className="flex items-center gap-3 p-4">
            {/* Level color dot */}
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: LEVEL_COLORS[skill.level] || '#6366f1' }}
            />
            <div className="flex-1 space-y-2 min-w-0">
              <Input
                value={skill.name}
                onChange={e => onUpdate(i,'name',e.target.value)}
                placeholder="React.js"
                className="text-sm py-2"
              />
              <Select
                value={skill.level}
                onChange={e => onUpdate(i,'level',e.target.value)}
                className="text-sm py-2"
              >
                {['Beginner','Intermediate','Advanced','Expert'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </Select>
            </div>
            <RemoveButton onClick={() => onRemove(i)} />
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProjectsTab({ items, onAdd, onRemove, onUpdate, onUpdateTech }) {
  return (
    <div className="space-y-5">
      <SectionHeader
        title="Projects"
        desc="Showcase your best work."
        action={<AddButton onClick={onAdd} />}
      />
      {items.length === 0 && <EmptyState icon={Layers} message='No projects yet. Click "Add" to get started.' />}
      {items.map((proj, i) => (
        <Card key={i}>
          <div className="absolute top-4 right-4">
            <RemoveButton onClick={() => onRemove(i)} />
          </div>
          <div className="space-y-4 pr-8">
            <div>
              <Label>Project Title</Label>
              <Input value={proj.title} onChange={e => onUpdate(i,'title',e.target.value)} placeholder="My Awesome Project" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={3} value={proj.description} onChange={e => onUpdate(i,'description',e.target.value)} placeholder="What does this project do?" />
            </div>
            <div>
              <Label>Tech Stack (comma separated)</Label>
              <Input
                value={proj.techStack?.join(', ') || ''}
                onChange={e => onUpdateTech(i, e.target.value)}
                placeholder="React, Node.js, PostgreSQL"
              />
              {/* Tag preview */}
              {proj.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {proj.techStack.map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                      style={{ background:'rgba(139,92,246,0.12)', color:'#c4b5fd' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>GitHub Link</Label>
                <Input type="url" value={proj.githubLink} onChange={e => onUpdate(i,'githubLink',e.target.value)} placeholder="https://github.com/…" />
              </div>
              <div>
                <Label>Live Link</Label>
                <Input type="url" value={proj.liveLink} onChange={e => onUpdate(i,'liveLink',e.target.value)} placeholder="https://…" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TASK 5 — CERTIFICATIONS + SETTINGS TABS
══════════════════════════════════════════════════════════════════════════ */
function CertificationsTab({ items, onAdd, onRemove, onUpdate }) {
  return (
    <div className="space-y-5">
      <SectionHeader
        title="Certifications"
        desc="Add your certificates and achievements."
        action={<AddButton onClick={onAdd} />}
      />
      {items.length === 0 && <EmptyState icon={Award} message='No certifications yet. Click "Add" to get started.' />}
      {items.map((cert, i) => (
        <Card key={i}>
          <div className="absolute top-4 right-4">
            <RemoveButton onClick={() => onRemove(i)} />
          </div>
          <div className="grid grid-cols-2 gap-4 pr-8">
            <div className="col-span-2">
              <Label>Certificate Name</Label>
              <Input value={cert.name} onChange={e => onUpdate(i,'name',e.target.value)} placeholder="AWS Certified Developer" />
            </div>
            <div>
              <Label>Issuer</Label>
              <Input value={cert.issuer} onChange={e => onUpdate(i,'issuer',e.target.value)} placeholder="Amazon Web Services" />
            </div>
            <div>
              <Label>Date</Label>
              <Input value={cert.date} onChange={e => onUpdate(i,'date',e.target.value)} placeholder="Jan 2024" />
            </div>
            <div className="col-span-2">
              <Label>Certificate Link</Label>
              <Input type="url" value={cert.link} onChange={e => onUpdate(i,'link',e.target.value)} placeholder="https://credential.link" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function SettingsTab({ settings, templateId, onSettingChange, onTemplateChange }) {
  const templates = [
    { id: 'modern',   label: 'Modern',   desc: 'Bold, dark, developer-focused' },
    { id: 'minimal',  label: 'Minimal',  desc: 'Clean, white-space, elegant' },
    { id: 'creative', label: 'Creative', desc: 'Gradient, animated, standout' },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Settings"
        desc="Control visibility and appearance of your portfolio."
      />

      {/* Public toggle */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
          <p className="font-semibold mb-0.5 fp-text">Public Portfolio</p>
            <p className="text-sm fp-text-muted">Anyone with your link can view it</p>
          </div>
          <button
            onClick={() => onSettingChange('isPublic', !settings.isPublic)}
            className="relative w-12 h-6 rounded-full transition-all duration-300 shrink-0"
            style={{ background: settings.isPublic ? 'linear-gradient(135deg,#dc2626,#9333ea)' : 'rgba(255,255,255,0.08)' }}
          >
            <div
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
              style={{ left: settings.isPublic ? '1.5rem' : '0.25rem' }}
            />
          </button>
        </div>
      </Card>

      {/* Theme */}
      <Card>
        <p className="font-semibold mb-4 fp-text">Portfolio Theme</p>
        <div className="grid grid-cols-2 gap-3">
          {['light','dark'].map(t => (
            <button
              onClick={() => onSettingChange('theme', t)}
              className="p-4 rounded-xl border-2 transition-all text-left fp-text"
              style={{
                borderColor: settings.theme === t ? '#dc2626' : 'var(--clr-border)',
                background:  settings.theme === t ? 'rgba(220,38,38,0.08)' : 'var(--clr-surface-2)',
              }}
            >
              <div
                className="w-full h-14 rounded-lg mb-3"
                style={{ background: t === 'light' ? '#f8fafc' : '#0f172a' }}
              />
              <p className="text-sm font-medium capitalize fp-text">{t}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Template */}
      <Card>
        <p className="font-semibold mb-4 fp-text">Template</p>
        <div className="space-y-3">
          {templates.map(tmpl => (
            <button
              key={tmpl.id}
              onClick={() => onTemplateChange(tmpl.id)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left"
              style={{
                borderColor: templateId === tmpl.id ? '#dc2626' : 'var(--clr-border)',
                background:  templateId === tmpl.id ? 'rgba(220,38,38,0.08)' : 'var(--clr-surface-2)',
              }}
            >
              {/* Radio dot */}
              <div
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{ borderColor: templateId === tmpl.id ? '#dc2626' : 'var(--clr-border)' }}
              >
                {templateId === tmpl.id && (
                  <div className="w-2 h-2 rounded-full" style={{ background: '#dc2626' }} />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold fp-text">{tmpl.label}</p>
                <p className="text-xs fp-text-muted">{tmpl.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
