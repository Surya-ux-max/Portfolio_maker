import React from 'react';
import { motion } from 'framer-motion';
import { 
  Github, Linkedin, Twitter, Mail, MapPin, ExternalLink,
  Calendar, BookOpen, Briefcase, Code, Layers, Award,
  Zap
} from 'lucide-react';

const CreativeTemplate = ({ portfolio, isDark }) => {
  const { personalInfo, experience, projects, skills, socialLinks } = portfolio;





  return (
    <div className={`min-h-screen relative overflow-hidden font-outfit ${isDark ? 'mesh-gradient-dark text-white' : 'mesh-gradient-light text-slate-900'} selection:bg-purple-500 selection:text-white`}>
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] mix-blend-screen opacity-20 animate-pulse bg-indigo-600`} />
        <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] mix-blend-screen opacity-20 animate-pulse bg-purple-600`} style={{animationDelay: '1s'}} />
        <div className={`absolute top-[40%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] mix-blend-screen opacity-10 animate-pulse bg-pink-600`} style={{animationDelay: '2s'}} />
      </div>

      <div className="relative z-10">
        {/* Header / Nav Area */}
        <header className="px-8 py-12 flex justify-between items-center max-w-7xl mx-auto">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`text-2xl font-black italic tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}
          >
            {personalInfo?.name?.split(' ')[0]}.
          </motion.div>
          <div className="flex gap-4">
            {socialLinks?.github && <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className={`p-3 backdrop-blur-md rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/20' : 'bg-white/40 border-slate-200 hover:bg-white/60'}`}><Github className="w-5 h-5" /></a>}
            {socialLinks?.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={`p-3 backdrop-blur-md rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/20' : 'bg-white/40 border-slate-200 hover:bg-white/60'}`}><Twitter className="w-5 h-5" /></a>}
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-8 py-20 lg:py-40 max-w-7xl mx-auto flex flex-col items-center text-center">


          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.8] mb-12 tracking-tighter uppercase italic break-words max-w-full"
          >
            <span className="text-gradient">CREATIVE</span><br />
            {personalInfo?.name}
          </motion.h1>

          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.6 }}
             className={`text-xl lg:text-3xl font-medium max-w-3xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'} italic`}
          >
            "{personalInfo?.bio}"
          </motion.p>
        </section>

        {/* Dynamic Skills Cloud */}
        <section className={`py-40 backdrop-blur-3xl overflow-hidden relative ${isDark ? 'bg-black/20' : 'bg-white/20'}`}>
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="grid grid-cols-10 h-full">
                {Array.from({length: 100}).map((_, i) => (
                  <div key={i} className={`border-r border-b ${isDark ? 'border-white/10' : 'border-slate-300/20'}`} />
                ))}
              </div>
           </div>
           
           <div className="max-w-7xl mx-auto px-8 relative">
              <h2 className={`text-sm font-black uppercase tracking-[1em] opacity-30 mb-20 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>TECH SPECTRUM</h2>
              <div className="flex flex-wrap justify-center gap-12">
                {skills?.length > 0 && skills.map((skill, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="flex flex-col items-center gap-4 group"
                  >
                    <div className={`w-24 h-24 rounded-[2rem] ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-slate-200'} border flex items-center justify-center transition-all group-hover:bg-indigo-600 shadow-xl group-hover:shadow-indigo-500/50`}>
                      <Code className={`w-10 h-10 ${isDark ? 'text-white' : 'text-slate-700'} group-hover:text-white`} />
                    </div>
                    <span className="text-lg font-black italic tracking-tight">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
           </div>
        </section>

        {/* Experience & Projects - Artistic Layout */}
        <section className="px-8 py-40 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-40">
            
            {/* Experience Column */}
            <div className="space-y-32">
              <h2 className="text-5xl font-black italic mb-16 underline decoration-indigo-500 decoration-8 underline-offset-[20px]">MY JOURNEY.</h2>
              <div className="space-y-20">
                {experience?.length > 0 && experience.map((exp, i) => (
                  <motion.div 
                    key={i}
                    whileInView={{ x: [100, 0], opacity: [0, 1] }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="text-xs font-black uppercase tracking-widest text-purple-500 mb-4">{exp.startDate} - {exp.endDate}</div>
                    <h3 className="text-3xl font-black italic mb-2 tracking-tight group-hover:text-purple-500 transition-colors uppercase">{exp.position}</h3>
                    <div className="text-xl font-bold mb-6 opacity-60">@ {exp.company}</div>
                    <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium`}>{exp.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Projects Column - Floating Cards */}
            <div className="space-y-32 pt-20 lg:pt-60">
              <h2 className="text-5xl font-black italic mb-16 text-right underline decoration-indigo-500 decoration-8 underline-offset-[20px]">PORTFOLIO.</h2>
              <div className="space-y-12">
                {projects?.length > 0 && projects.map((project, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className={`p-10 rounded-[3rem] ${isDark ? 'glass-card-dark' : 'glass-card'} shadow-2xl relative overflow-hidden group`}
                  >
                    <div className="absolute top-0 right-0 p-8">
                       <Layers className="w-12 h-12 opacity-5" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-4xl font-black italic mb-4 tracking-tighter uppercase">{project.title}</h3>
                      <p className={`mb-8 leading-relaxed text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium`}>{project.description}</p>
                      <div className="flex justify-between items-center">
                         <div className="flex flex-wrap gap-2">
                           {project.techStack?.map((tech, j) => (
                             <span key={j} className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-slate-200'}`}>{tech}</span>
                           ))}
                         </div>
                         {project.liveLink && (
                           <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all">
                              <ExternalLink className="w-6 h-6" />
                           </a>
                         )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Massive Footer CTA */}
        <section className={`py-60 relative overflow-hidden bg-gradient-to-b ${isDark ? 'from-transparent to-purple-900/20' : 'from-transparent to-purple-100'}`}>
           <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
              <motion.div
                whileInView={{ scale: [0.5, 1], opacity: [0, 1] }}
                transition={{ duration: 1 }}
              >
                <h2 className={`text-6xl md:text-8xl lg:text-[10rem] font-black italic tracking-tighter uppercase mb-20 leading-[0.8] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  LET'S <br /> <span className="text-gradient">WORK</span> <br /> TOGETHER.
                </h2>
                <div className="flex flex-col md:flex-row justify-center gap-8 items-center">
                  <a href={`mailto:${personalInfo?.email}`} className={`px-12 py-6 ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'} text-2xl font-black italic uppercase rounded-full hover:scale-110 transition-all shadow-2xl`}>
                    GET IN TOUCH
                  </a>
                  <div className="flex gap-4">
                     {socialLinks?.linkedin && <a href={socialLinks.linkedin} className={`w-20 h-20 rounded-full border-2 ${isDark ? 'border-white/20 hover:bg-white hover:text-black' : 'border-slate-900/20 hover:bg-slate-900 hover:text-white'} flex items-center justify-center transition-all`}><Linkedin className="w-8 h-8" /></a>}
                  </div>
                </div>
              </motion.div>
           </div>
           <div className={`absolute bottom-[-100px] left-[-100px] text-[20rem] lg:text-[30rem] font-black italic opacity-[0.03] pointer-events-none select-none ${isDark ? 'text-white' : 'text-black'}`}>
             ARTIST
           </div>
        </section>

        <footer className="py-20 text-center">
          <a href="/" className="group inline-flex flex-col items-center gap-2">
            <p className="text-xs font-black uppercase tracking-[0.5em] opacity-30 group-hover:opacity-100 transition-opacity">Built with FirstPortfolio</p>
            <span className="text-indigo-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">Create your own for free →</span>
          </a>
        </footer>

      </div>
    </div>
  );
};

export default CreativeTemplate;
