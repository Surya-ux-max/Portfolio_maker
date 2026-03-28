import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import portfolioService from '../api/portfolioService';
import { 
  ChevronLeft, 
  Save, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Layers, 
  Globe, 
  Settings as SettingsIcon,
  Loader2,
  CheckCircle2,
  Plus,
  Trash2,
  X
} from 'lucide-react';

const Editor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [portfolio, setPortfolio] = useState({
    personalInfo: { name: user?.name || '', bio: '', role: '', profilePhoto: '', email: user?.email || '', phone: '', location: '' },
    education: [],
    skills: [],
    projects: [],
    experience: [],
    certifications: [],
    socialLinks: { github: '', linkedin: '', twitter: '', portfolio: '' },
    settings: { theme: 'light', isPublic: true },
    templateId: 'modern'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await portfolioService.getMyPortfolio();
        if (data) setPortfolio(data);
      } catch {
        console.log('No existing portfolio found, starting fresh');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await portfolioService.upsertPortfolio(portfolio);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const updatePersonalInfo = (e) => {
    const { name, value } = e.target;
    setPortfolio({
      ...portfolio,
      personalInfo: { ...portfolio.personalInfo, [name]: value }
    });
  };

  const updateSocialLinks = (e) => {
    const { name, value } = e.target;
    setPortfolio({
      ...portfolio,
      socialLinks: { ...portfolio.socialLinks, [name]: value }
    });
  };

  const updateSettings = (key, value) => {
    setPortfolio({
      ...portfolio,
      settings: { ...portfolio.settings, [key]: value }
    });
  };

  // Experience handlers
  const addExperience = () => {
    setPortfolio({
      ...portfolio,
      experience: [...portfolio.experience, { company: '', position: '', location: '', startDate: '', endDate: '', description: '' }]
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...portfolio.experience];
    updated[index][field] = value;
    setPortfolio({ ...portfolio, experience: updated });
  };

  const removeExperience = (index) => {
    setPortfolio({
      ...portfolio,
      experience: portfolio.experience.filter((_, i) => i !== index)
    });
  };

  // Education handlers
  const addEducation = () => {
    setPortfolio({
      ...portfolio,
      education: [...portfolio.education, { institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '', description: '' }]
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...portfolio.education];
    updated[index][field] = value;
    setPortfolio({ ...portfolio, education: updated });
  };

  const removeEducation = (index) => {
    setPortfolio({
      ...portfolio,
      education: portfolio.education.filter((_, i) => i !== index)
    });
  };

  // Skills handlers
  const addSkill = () => {
    setPortfolio({
      ...portfolio,
      skills: [...portfolio.skills, { name: '', level: 'Beginner' }]
    });
  };

  const updateSkill = (index, field, value) => {
    const updated = [...portfolio.skills];
    updated[index][field] = value;
    setPortfolio({ ...portfolio, skills: updated });
  };

  const removeSkill = (index) => {
    setPortfolio({
      ...portfolio,
      skills: portfolio.skills.filter((_, i) => i !== index)
    });
  };

  // Projects handlers
  const addProject = () => {
    setPortfolio({
      ...portfolio,
      projects: [...portfolio.projects, { title: '', description: '', techStack: [], githubLink: '', liveLink: '', image: '' }]
    });
  };

  const updateProject = (index, field, value) => {
    const updated = [...portfolio.projects];
    updated[index][field] = value;
    setPortfolio({ ...portfolio, projects: updated });
  };

  const updateProjectTechStack = (index, techString) => {
    const updated = [...portfolio.projects];
    // Split by comma or space, trim, and filter out empty strings
    updated[index].techStack = techString
      .split(/[,\s]+/)  // Split by comma or whitespace (one or more)
      .map(t => t.trim())
      .filter(t => t);
    setPortfolio({ ...portfolio, projects: updated });
  };

  const removeProject = (index) => {
    setPortfolio({
      ...portfolio,
      projects: portfolio.projects.filter((_, i) => i !== index)
    });
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: <User className="w-4 h-4" /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Code className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Layers className="w-4 h-4" /> },
    { id: 'social', label: 'Social', icon: <Globe className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-gradient-dark text-white font-sans selection:bg-indigo-500/30">
      {/* Editor - Full Width */}
      <div className="w-full flex flex-col h-screen">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-slate-950/20 backdrop-blur-xl shrink-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg hidden sm:block font-outfit tracking-tight">Editor</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {saveStatus === 'success' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Saved
              </motion.div>
            )}
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 hover:shadow-indigo-500/40 transform active:scale-95"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-white/5 bg-slate-950/10 backdrop-blur-sm shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 max-w-2xl"
              >
                <div>
                  <h2 className="text-xl font-bold mb-1">Personal Information</h2>
                  <p className="text-sm text-slate-500 mb-6">This information will be displayed at the top of your portfolio.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={portfolio.personalInfo.name} 
                      onChange={updatePersonalInfo}
                      className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Current Role / Headline</label>
                    <input 
                      type="text" 
                      name="role" 
                      value={portfolio.personalInfo.role} 
                      onChange={updatePersonalInfo}
                      className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                      placeholder="Full Stack Developer & Student"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Short Bio</label>
                    <textarea 
                      name="bio" 
                      rows="4"
                      value={portfolio.personalInfo.bio} 
                      onChange={updatePersonalInfo}
                      className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm resize-none"
                      placeholder="Tell recruiters about yourself..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={portfolio.personalInfo.email} 
                      onChange={updatePersonalInfo}
                      className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Location</label>
                    <input 
                      type="text" 
                      name="location" 
                      value={portfolio.personalInfo.location} 
                      onChange={updatePersonalInfo}
                      className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                      placeholder="New York, NY"
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 max-w-2xl"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Work Experience</h2>
                    <p className="text-sm text-slate-500">Add your professional experience, internships, or jobs.</p>
                  </div>
                  <button
                    onClick={addExperience}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                {portfolio.experience.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No experience added yet. Click "Add" to get started!</p>
                  </div>
                )}

                {portfolio.experience.map((exp, index) => (
                  <div key={index} className="glass-card-dark p-6 rounded-[2rem] space-y-4 relative">
                    <button
                      onClick={() => removeExperience(index)}
                      className="absolute top-4 right-4 p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Position</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => updateExperience(index, 'position', e.target.value)}
                          className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                          placeholder="Tech Corp"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(index, 'location', e.target.value)}
                          className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                          placeholder="Remote"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Start</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                            className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                            placeholder="Jan 2024"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">End</label>
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                            className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                            placeholder="Present"
                          />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Description</label>
                        <textarea
                          rows="3"
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm resize-none"
                          placeholder="Describe your responsibilities and achievements..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <motion.div
                key="education"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 max-w-2xl"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Education</h2>
                    <p className="text-sm text-slate-500">Add your academic qualifications.</p>
                  </div>
                  <button
                    onClick={addEducation}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                {portfolio.education.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No education history added yet. Click "Add" to get started!</p>
                  </div>
                )}

                {portfolio.education.map((edu, index) => (
                  <div key={index} className="glass-card-dark p-6 rounded-[2rem] space-y-4 relative">
                    <button
                      onClick={() => removeEducation(index)}
                      className="absolute top-4 right-4 p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                          className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                          placeholder="University Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                          placeholder="Bachelor's"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Field of Study</label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                          className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                          placeholder="Computer Science"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Start Year</label>
                        <input
                          type="text"
                          value={edu.startYear}
                          onChange={(e) => updateEducation(index, 'startYear', e.target.value)}
                          className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                          placeholder="2020"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">End Year</label>
                        <input
                          type="text"
                          value={edu.endYear}
                          onChange={(e) => updateEducation(index, 'endYear', e.target.value)}
                          className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                          placeholder="2024"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Description</label>
                        <textarea
                          rows="2"
                          value={edu.description}
                          onChange={(e) => updateEducation(index, 'description', e.target.value)}
                          className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm resize-none"
                          placeholder="Optional: achievements, GPA, honors..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 max-w-2xl"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Skills</h2>
                    <p className="text-sm text-slate-500">Add your technical and soft skills.</p>
                  </div>
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                {portfolio.skills.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <Code className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No skills added yet. Click "Add" to get started!</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolio.skills.map((skill, index) => (
                    <div key={index} className="glass-card-dark p-4 rounded-[1.5rem] flex items-center gap-3 relative">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkill(index, 'name', e.target.value)}
                          className="w-full bg-slate-950/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50"
                          placeholder="React.js"
                        />
                        <select
                          value={skill.level}
                          onChange={(e) => updateSkill(index, 'level', e.target.value)}
                          className="w-full bg-slate-950/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                      <button
                        onClick={() => removeSkill(index)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 max-w-2xl"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Projects</h2>
                    <p className="text-sm text-slate-500">Showcase your best work and projects.</p>
                  </div>
                  <button
                    onClick={addProject}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                {portfolio.projects.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <Layers className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No projects added yet. Click "Add" to get started!</p>
                  </div>
                )}

                {portfolio.projects.map((project, index) => (
                  <div key={index} className="glass-card-dark p-6 rounded-[2rem] space-y-4 relative">
                    <button
                      onClick={() => removeProject(index)}
                      className="absolute top-4 right-4 p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Project Title</label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => updateProject(index, 'title', e.target.value)}
                          className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                          placeholder="My Awesome Project"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Description</label>
                        <textarea
                          rows="3"
                          value={project.description}
                          onChange={(e) => updateProject(index, 'description', e.target.value)}
                          className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm resize-none"
                          placeholder="Describe what this project does and what problems it solves..."
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Tech Stack (comma or space separated)</label>
                        <input
                          type="text"
                          value={project.techStack?.join(', ') || ''}
                          onChange={(e) => updateProjectTechStack(index, e.target.value)}
                          className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                          placeholder="React Node.js MongoDB or React, Node.js, MongoDB"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">GitHub Link</label>
                          <input
                            type="url"
                            value={project.githubLink}
                            onChange={(e) => updateProject(index, 'githubLink', e.target.value)}
                            className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                            placeholder="https://github.com/..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Live Link</label>
                          <input
                            type="url"
                            value={project.liveLink}
                            onChange={(e) => updateProject(index, 'liveLink', e.target.value)}
                            className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50 backdrop-blur-sm"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Social Links Tab */}
            {activeTab === 'social' && (
              <motion.div
                key="social"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 max-w-2xl"
              >
                <div>
                  <h2 className="text-xl font-bold mb-1">Social Links</h2>
                  <p className="text-sm text-slate-500 mb-6">Add your social media and professional profiles.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">GitHub</label>
                    <input
                      type="url"
                      name="github"
                      value={portfolio.socialLinks.github}
                      onChange={updateSocialLinks}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      name="linkedin"
                      value={portfolio.socialLinks.linkedin}
                      onChange={updateSocialLinks}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://linkedin.com/in/yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Twitter</label>
                    <input
                      type="url"
                      name="twitter"
                      value={portfolio.socialLinks.twitter}
                      onChange={updateSocialLinks}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Portfolio Website</label>
                    <input
                      type="url"
                      name="portfolio"
                      value={portfolio.socialLinks.portfolio}
                      onChange={updateSocialLinks}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 max-w-2xl"
              >
                <div>
                  <h2 className="text-xl font-bold mb-1">Portfolio Settings</h2>
                  <p className="text-sm text-slate-500 mb-6">Customize your portfolio visibility and appearance.</p>
                </div>

                <div className="space-y-6">
                  <div className="glass-card-dark p-6 rounded-[2rem]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold mb-1">Public Portfolio</h3>
                        <p className="text-sm text-slate-500">Make your portfolio visible to everyone</p>
                      </div>
                      <button
                        onClick={() => updateSettings('isPublic', !portfolio.settings.isPublic)}
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          portfolio.settings.isPublic ? 'bg-indigo-600' : 'bg-slate-700'
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            portfolio.settings.isPublic ? 'translate-x-7' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="glass-card-dark p-6 rounded-[2rem]">
                    <h3 className="font-bold mb-3">Theme</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => updateSettings('theme', 'light')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          portfolio.settings.theme === 'light'
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <div className="w-full h-16 bg-white rounded-lg mb-2"></div>
                        <p className="text-sm font-medium">Light</p>
                      </button>
                      <button
                        onClick={() => updateSettings('theme', 'dark')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          portfolio.settings.theme === 'dark'
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <div className="w-full h-16 bg-slate-900 rounded-lg mb-2"></div>
                        <p className="text-sm font-medium">Dark</p>
                      </button>
                    </div>
                  </div>

                  <div className="glass-card-dark p-6 rounded-[2rem]">
                    <h3 className="font-bold mb-3">Template</h3>
                    <select
                      value={portfolio.templateId}
                      onChange={(e) => setPortfolio({ ...portfolio, templateId: e.target.value })}
                      className="w-full bg-slate-950/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-white/20 focus:bg-slate-950/50"
                    >
                      <option value="modern">Modern</option>
                      <option value="minimal">Minimal</option>
                      <option value="creative">Creative</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Editor;
