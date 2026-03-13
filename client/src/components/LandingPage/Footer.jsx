import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, Heart } from 'lucide-react';
import { BsTwitterX } from 'react-icons/bs';
import Logo from '../Logo';
import { footerSections, socialLinks } from './data';

const Footer = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const handleAuth = () => navigate('/auth');

  const handleLinkClick = (link) => {
    if (link.href?.startsWith('#')) {
      const element = document.querySelector(link.href);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log(`Navigate to ${link.text}`);
    }
  };

  const SocialIcon = ({ name, size = 18 }) => {
    if (name === 'BsTwitterX') return <BsTwitterX size={size} />;
    const IconComponent = LucideIcons[name];
    if (!IconComponent) return null;
    return <IconComponent size={size} />;
  };

  return (
    <footer className="relative bg-slate-50 pt-32 pb-12 overflow-hidden border-t border-slate-200">
      
      {/* 1. Pre-Footer Call to Action (Floating Card) */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-8 md:p-12 shadow-2xl shadow-emerald-200/50 relative overflow-hidden text-center md:text-left md:flex md:items-center md:justify-between gap-8 max-w-5xl mx-auto"
        >
          {/* Decorative Gradient Overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full blur-3xl opacity-60 -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Ready to ace your next interview?
            </h3>
            <p className="text-slate-600 font-medium max-w-xl">
              Join 10,000+ candidates who are landing their dream jobs with IntelliHire.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-6 md:mt-0">
             {!token ? (
               <>
                 <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAuth}
                    className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-white transition-all bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30"
                 >
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                 </motion.button>
                 <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAuth}
                    className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all"
                 >
                    Log In
                 </motion.button>
               </>
             ) : (
               <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-white transition-all bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30"
               >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
               </motion.button>
             )}
          </div>
        </motion.div>
      </div>


      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Ambient Bloom */}
        <div className="absolute top-1/2 left-1/4 w-[800px] h-[800px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Socials (Span 5) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <Logo size="md" className="text-slate-900" />
              <p className="text-slate-600 leading-relaxed max-w-sm font-medium">
                The advanced AI interview coach that helps you master technical, behavioral, and situational questions with real-time feedback.
              </p>
            </div>
            
            <div className="flex gap-3">
              {socialLinks.map(({ icon, url, color }, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 transition-all duration-300 ${color}`}
                >
                  <SocialIcon name={icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid (Span 7) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerSections.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-wider">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <button 
                        onClick={() => handleLinkClick(link)}
                        className="text-slate-500 hover:text-emerald-600 transition-colors text-sm font-medium flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 transition-all duration-300 overflow-hidden text-emerald-600 mr-0 group-hover:mr-1">
                          •
                        </span>
                        {link.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} IntelliHire Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
             <button className="hover:text-emerald-600 transition-colors">Privacy</button>
             <button className="hover:text-emerald-600 transition-colors">Terms</button>
             <button className="hover:text-emerald-600 transition-colors">Sitemap</button>
             <div className="hidden md:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-400 text-xs">Systems Operational</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;