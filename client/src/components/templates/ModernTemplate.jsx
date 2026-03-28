import React from 'react';
import { motion } from 'framer-motion';
import { 
  Github, Linkedin, Twitter, Mail, MapPin, ExternalLink,
  Calendar, BookOpen, Briefcase, Code, Layers, Award,
  Sparkles, Terminal, Cpu, Globe
} from 'lucide-react';

const ModernTemplate = ({ portfolio, isDark }) => {
  const { personalInfo, education, experience, projects, skills, socialLinks } = portfolio;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-500 selection:text-white ${isDark ? 'mesh-gradient-dark text-slate-200' : 'mesh-gradient-light text-slate-800'}`}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-screen relative">
        
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 ${isDark ? 'bg-indigo-600' : 'bg-indigo-400'}`} />
          <div className={`absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 ${isDark ? 'bg-purple-600' : 'bg-purple-400'}`} />
        </div>

        {/* Left Sidebar - Fixed on desktop */}
        <motion.aside 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`lg:w-[400px] lg:sticky lg:top-0 lg:h-screen p-8 lg:p-12 flex flex-col justify-between z-20`}
        >
          <div className="space-y-8">
            {/* Profile Section */}
            <div className="relative group">

              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className={`text-4xl lg:text-5xl font-black mb-3 font-outfit tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {personalInfo?.name}
                </h1>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-sm font-bold mb-6">
                  <Sparkles className="w-4 h-4" />
                  {personalInfo?.role}
                </div>
              </motion.div>
              
              <div className="space-y-4 mb-8">
                {personalInfo?.email && (
                  <a href={`mailto:${personalInfo.email}`} className={`flex items-center gap-3 text-sm ${isDark ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'} transition-all group/link`}>
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 group-hover/link:bg-indigo-500/20' : 'bg-white group-hover/link:bg-indigo-50'} shadow-sm`}>
                      <Mail className="w-4 h-4" />
                    </div>
                    {personalInfo.email}
                  </a>
                )}
                {personalInfo?.location && (
                  <div className={`flex items-center gap-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    {personalInfo.location}
                  </div>
                )}
              </div>

              {/* Bio */}
              <p className={`text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-8 font-medium`}>
                {personalInfo?.bio}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Projects', value: projects?.length || 0, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                  { label: 'Skills', value: skills?.length || 0, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                  { label: 'Exp', value: experience?.length || 0, color: 'text-pink-500', bg: 'bg-pink-500/10' }
                ].map((stat, i) => ( stat.value > 0 && 
                  <div key={i} className={`${stat.bg} p-4 rounded-2xl border border-white/5 backdrop-blur-sm`}>
                    <div className={`text-2xl font-black ${stat.color} font-outfit`}>{stat.value}</div>
                    <div className={`text-[10px] uppercase tracking-wider font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 mt-8 lg:mt-0">
            {[
              { icon: Github, href: socialLinks?.github, color: 'hover:bg-slate-800' },
              { icon: Linkedin, href: socialLinks?.linkedin, color: 'hover:bg-blue-600' },
              { icon: Twitter, href: socialLinks?.twitter, color: 'hover:bg-sky-500' }
            ].map((social, i) => social.href && (
              <a 
                key={i}
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`p-4 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-white'} border border-white/10 shadow-lg text-slate-400 hover:text-white ${social.color} transition-all duration-300 hover:-translate-y-1`}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </motion.aside>

        {/* Right Content - Scrollable */}
        <main className="flex-1 p-8 lg:p-12 lg:pt-24 z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-24"
          >
            {/* Experience Section */}
            <section id="experience">
              <div className="flex items-center gap-4 mb-12">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                <h2 className={`text-3xl font-black font-outfit tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Briefcase className="w-8 h-8 text-indigo-500" />
                  Experience
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
              </div>

              <div className="space-y-6">
                {experience?.length > 0 ? experience.map((exp, i) => (
                  <motion.div 
                    key={i}
                    variants={itemVariants}
                    className={`group relative ${isDark ? 'glass-card-dark' : 'glass-card'} p-8 rounded-[2rem] transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-indigo-50'} text-indigo-500 group-hover:scale-110 transition-transform`}>
                          <Cpu className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{exp.position}</h3>
                          <p className="text-indigo-500 font-bold tracking-tight">{exp.company}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                        {exp.startDate} — {exp.endDate}
                      </div>
                    </div>
                    <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'} pl-16`}>{exp.description}</p>
                  </motion.div>
                )) : (
                  <div className="text-center py-12 opacity-50 font-medium">Add your experience to showcase your career journey.</div>
                )}
              </div>
            </section>

            {/* Projects Section */}
            <section id="projects">
              <div className="flex items-center gap-4 mb-12">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                <h2 className={`text-3xl font-black font-outfit tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Layers className="w-8 h-8 text-purple-500" />
                  Featured Works
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {projects?.length > 0 ? projects.map((project, i) => (
                  <motion.div 
                    key={i}
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    className={`group relative flex flex-col h-full ${isDark ? 'glass-card-dark' : 'glass-card'} p-8 rounded-[2.5rem] transition-all duration-500 overflow-hidden`}
                  >
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-purple-50'} text-purple-500 group-hover:rotate-12 transition-transform duration-500`}>
                          <Terminal className="w-7 h-7" />
                        </div>
                        <div className="flex gap-2">
                          {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className={`p-3 rounded-xl ${isDark ? 'bg-slate-800 hover:text-white' : 'bg-slate-100 hover:text-indigo-600'} transition-all shadow-sm`}>
                              <Github className="w-5 h-5" />
                            </a>
                          )}
                          {project.liveLink && (
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all">
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <h3 className={`text-2xl font-black font-outfit mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{project.title}</h3>
                      <p className={`mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'} line-clamp-3 text-sm flex-grow`}>{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 pt-6 border-t border-white/10 mt-auto">
                        {project.techStack?.map((tech, j) => (
                          <span key={j} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg ${isDark ? 'bg-slate-800 text-purple-400 border-slate-700' : 'bg-purple-50 text-purple-600 border-purple-100'} border transition-colors group-hover:bg-purple-500 group-hover:text-white`}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="md:col-span-2 text-center py-12 opacity-50 font-medium">No projects added yet.</div>
                )}
              </div>
            </section>

            {/* Skills & Education Duo */}
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Skills */}
              <section id="skills">
                <h2 className={`text-3xl font-black font-outfit tracking-tight flex items-center gap-3 mb-10 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Code className="w-8 h-8 text-blue-500" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {skills?.length > 0 ? skills.map((skill, i) => (
                    <motion.div 
                      key={i}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 ${
                        skill.level === 'Expert' ? (isDark ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-indigo-600 text-white border-indigo-600') :
                        skill.level === 'Advanced' ? (isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-600 text-white border-purple-600') :
                        (isDark ? 'bg-slate-800/50 text-slate-300 border-white/5' : 'bg-white text-slate-700 border-slate-200 shadow-sm')
                      } border backdrop-blur-sm transition-all`}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      {skill.name}
                    </motion.div>
                  )) : (
                    <div className="opacity-50 font-medium">Add skills to show your technical stack.</div>
                  )}
                </div>
              </section>

              {/* Education */}
              <section id="education">
                <h2 className={`text-3xl font-black font-outfit tracking-tight flex items-center gap-3 mb-10 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <BookOpen className="w-8 h-8 text-emerald-500" />
                  Education
                </h2>
                <div className="space-y-6">
                  {education?.length > 0 ? education.map((edu, i) => (
                    <motion.div 
                      key={i}
                      variants={itemVariants}
                      className={`relative p-6 rounded-[1.5rem] ${isDark ? 'bg-white/5' : 'bg-white'} border border-white/10 group hover:border-emerald-500/30 transition-colors`}
                    >
                      <div className="mb-2 text-xs font-black uppercase tracking-widest text-emerald-500">
                        {edu.startYear} — {edu.endYear}
                      </div>
                      <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{edu.degree} in {edu.fieldOfStudy}</h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{edu.institution}</p>
                    </motion.div>
                  )) : (
                    <div className="opacity-50 font-medium">Add educational details to complete your profile.</div>
                  )}
                </div>
              </section>
            </div>

            <footer className={`pt-12 border-t ${isDark ? 'border-white/5' : 'border-slate-200'} text-center pb-8`}>
              <a href="/" className="inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-500 transition-colors">
                MADE WITH <Globe className="w-3 h-3" /> FIRSTPORTFOLIO — BUILD YOURS
              </a>
            </footer>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ModernTemplate;
