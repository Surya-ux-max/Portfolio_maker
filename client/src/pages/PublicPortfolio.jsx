import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import portfolioService from '../api/portfolioService';
import ModernTemplate from '../components/templates/ModernTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';
import CreativeTemplate from '../components/templates/CreativeTemplate';

const PublicPortfolio = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await portfolioService.getPublicPortfolio(username);
        setData(response);
      } catch (err) {
        setError(err.response?.data?.message || 'Portfolio not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen mesh-gradient-dark flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen mesh-gradient-dark flex flex-col items-center justify-center p-4 text-white font-sans text-center selection:bg-indigo-500/30">
        <h1 className="text-[12rem] md:text-[20rem] font-black italic tracking-tighter text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-outfit">404</h1>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase italic font-outfit tracking-tighter">Portfolio Not Found</h2>
          <p className="text-slate-400 mb-12 font-medium text-lg">{error}</p>
          <Link to="/" className="px-10 py-5 bg-white text-black rounded-full font-black uppercase italic hover:scale-110 transition-transform shadow-2xl tracking-tight text-lg">
            Create Yours
          </Link>
        </div>
      </div>
    );
  }

  const { portfolio, user } = data;
  const { settings, templateId } = portfolio;
  
  const isDark = settings?.theme === 'dark';
  const template = templateId || 'modern';

  // Render different templates based on templateId
  if (template === 'modern') {
    return <ModernTemplate portfolio={portfolio} user={user} isDark={isDark} />;
  }

  if (template === 'minimal') {
    return <MinimalTemplate portfolio={portfolio} user={user} isDark={isDark} />;
  }

  if (template === 'creative') {
    return <CreativeTemplate portfolio={portfolio} user={user} isDark={isDark} />;
  }

  // Fallback to modern
  return <ModernTemplate portfolio={portfolio} user={user} isDark={isDark} />;
};

export default PublicPortfolio;
